import { Resend } from "resend";
import { db, ensureSchema } from "@/lib/db";
import { isBookableDate, isSlotAvailable } from "@/lib/availability";
import { parisWallTimeToUtc } from "@/lib/paris-time";
import {
  reservationConfirmedHtml,
  reservationConfirmedText,
  salonNotificationText,
} from "@/lib/email-templates";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  service?: string;
  message: string;
  date: string;
  time: string;
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/;

// Best-effort in-memory rate limit (per server instance): 5 requests / 10 min / IP.
// Not a substitute for a shared store (e.g. Upstash) under multi-instance hosting,
// but stops naive scripted abuse at low cost.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX = 5;
const requestLog = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const timestamps = (requestLog.get(ip) ?? []).filter(
    (t) => now - t < RATE_LIMIT_WINDOW_MS
  );
  timestamps.push(now);
  requestLog.set(ip, timestamps);

  if (requestLog.size > 5000) {
    for (const [key, times] of requestLog) {
      if (times.every((t) => now - t > RATE_LIMIT_WINDOW_MS)) requestLog.delete(key);
    }
  }

  return timestamps.length > RATE_LIMIT_MAX;
}

function isValidPayload(data: unknown): data is ContactPayload {
  if (!data || typeof data !== "object") return false;
  const { name, email, phone, service, message, date, time } = data as Record<
    string,
    unknown
  >;
  return (
    typeof name === "string" &&
    name.trim().length > 1 &&
    name.length <= 100 &&
    typeof email === "string" &&
    email.length <= 254 &&
    EMAIL_PATTERN.test(email) &&
    typeof phone === "string" &&
    phone.trim().length > 5 &&
    phone.length <= 30 &&
    typeof message === "string" &&
    message.trim().length > 3 &&
    message.length <= 3000 &&
    (service === undefined || (typeof service === "string" && service.length <= 150)) &&
    typeof date === "string" &&
    typeof time === "string" &&
    TIME_PATTERN.test(time)
  );
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(ip)) {
    return Response.json(
      { error: "Trop de tentatives. Merci de réessayer dans quelques minutes." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Requête invalide." }, { status: 400 });
  }

  if (!isValidPayload(body)) {
    return Response.json(
      {
        error:
          "Merci de renseigner votre nom, votre email, votre téléphone, un créneau et votre message.",
      },
      { status: 400 }
    );
  }

  const { name, email, phone, service, message, date, time } = body;

  if (!isBookableDate(date)) {
    return Response.json(
      { error: "Cette date n'est plus disponible. Merci de choisir un autre jour." },
      { status: 409 }
    );
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";

  if (!apiKey || !toEmail) {
    console.error(
      "Contact form: RESEND_API_KEY or CONTACT_TO_EMAIL is not configured."
    );
    return Response.json(
      {
        error:
          "Le formulaire n'est pas encore activé. Merci de nous contacter par téléphone en attendant.",
      },
      { status: 503 }
    );
  }

  try {
    await ensureSchema();
  } catch (err) {
    console.error("Database schema init failed:", err);
    return Response.json(
      { error: "Le service de réservation est momentanément indisponible." },
      { status: 503 }
    );
  }

  const available = await isSlotAvailable(date, time).catch((err) => {
    console.error("Availability check failed:", err);
    return false;
  });
  if (!available) {
    return Response.json(
      {
        error:
          "Ce créneau vient d'être réservé par quelqu'un d'autre. Merci d'en choisir un autre.",
      },
      { status: 409 }
    );
  }

  const appointmentAt = parisWallTimeToUtc(date, time);

  try {
    const sql = db();
    await sql`
      INSERT INTO bookings (name, email, phone, service, message, appointment_at)
      VALUES (${name}, ${email}, ${phone}, ${service ?? null}, ${message}, ${appointmentAt.toISOString()})
    `;
  } catch (err) {
    console.error("Booking insert failed:", err);
    return Response.json(
      { error: "L'enregistrement de la réservation a échoué. Merci de réessayer." },
      { status: 500 }
    );
  }

  const resend = new Resend(apiKey);
  const emailData = { name, service, message, appointmentAt };

  try {
    const { error } = await resend.emails.send({
      from: `New Concept by Rims <${fromEmail}>`,
      to: toEmail,
      replyTo: email,
      subject: `Nouvelle réservation — ${name}`,
      text: salonNotificationText({ ...emailData, email, phone }),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "L'envoi a échoué. Merci de réessayer ou de nous appeler." },
        { status: 502 }
      );
    }
  } catch (err) {
    console.error("Contact form send failure:", err);
    return Response.json(
      { error: "L'envoi a échoué. Merci de réessayer ou de nous appeler." },
      { status: 500 }
    );
  }

  // Confirmation email to the client. Best-effort: the booking + salon notice
  // already succeeded above, so a failure here shouldn't surface as an error.
  try {
    await resend.emails.send({
      from: `New Concept by Rims <${fromEmail}>`,
      to: email,
      subject: "Votre rendez-vous est confirmé — New Concept by Rims",
      html: reservationConfirmedHtml(emailData),
      text: reservationConfirmedText(emailData),
    });
  } catch (err) {
    console.error("Client confirmation email failed:", err);
  }

  return Response.json({ success: true });
}
