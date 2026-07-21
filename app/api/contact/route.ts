import { Resend } from "resend";

export const runtime = "nodejs";

type ContactPayload = {
  name: string;
  phone: string;
  service?: string;
  message: string;
};

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
  const { name, phone, service, message } = data as Record<string, unknown>;
  return (
    typeof name === "string" &&
    name.trim().length > 1 &&
    name.length <= 100 &&
    typeof phone === "string" &&
    phone.trim().length > 5 &&
    phone.length <= 30 &&
    typeof message === "string" &&
    message.trim().length > 3 &&
    message.length <= 3000 &&
    (service === undefined || (typeof service === "string" && service.length <= 150))
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
    return Response.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }

  if (!isValidPayload(body)) {
    return Response.json(
      { error: "Merci de renseigner votre nom, votre téléphone et votre message." },
      { status: 400 }
    );
  }

  const { name, phone, service, message } = body;

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
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: `New Concept by Rims <${fromEmail}>`,
      to: toEmail,
      subject: `Nouvelle demande de rendez-vous — ${name}`,
      text: [
        `Nom : ${name}`,
        `Téléphone : ${phone}`,
        service ? `Prestation souhaitée : ${service}` : null,
        "",
        "Message :",
        message,
      ]
        .filter(Boolean)
        .join("\n"),
    });

    if (error) {
      console.error("Resend error:", error);
      return Response.json(
        { error: "L'envoi a échoué. Merci de réessayer ou de nous appeler." },
        { status: 502 }
      );
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Contact form send failure:", err);
    return Response.json(
      { error: "L'envoi a échoué. Merci de réessayer ou de nous appeler." },
      { status: 500 }
    );
  }
}
