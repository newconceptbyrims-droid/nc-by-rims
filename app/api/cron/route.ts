import { Resend } from "resend";
import { db, ensureSchema, type BookingRow } from "@/lib/db";
import { addDays, parisWallTimeToUtc } from "@/lib/paris-time";
import {
  reminderEmailHtml,
  reminderEmailText,
  reviewRequestEmailHtml,
  reviewRequestEmailText,
} from "@/lib/email-templates";

export const runtime = "nodejs";

function dayBounds(dateStr: string) {
  return {
    start: parisWallTimeToUtc(dateStr, "00:00").toISOString(),
    end: parisWallTimeToUtc(addDays(dateStr, 1), "00:00").toISOString(),
  };
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  const auth = request.headers.get("authorization");
  if (secret && auth !== `Bearer ${secret}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.CONTACT_FROM_EMAIL || "onboarding@resend.dev";
  if (!apiKey) {
    console.error("Cron: RESEND_API_KEY is not configured.");
    return Response.json({ error: "Email not configured" }, { status: 503 });
  }

  await ensureSchema();
  const sql = db();
  const resend = new Resend(apiKey);

  const today = new Date().toISOString().slice(0, 10);
  const tomorrow = addDays(today, 1);
  const yesterday = addDays(today, -1);

  let remindersSent = 0;
  let reviewsSent = 0;
  const errors: string[] = [];

  // Reminders: appointments happening tomorrow, not yet reminded.
  {
    const { start, end } = dayBounds(tomorrow);
    const rows = (await sql`
      SELECT * FROM bookings
      WHERE appointment_at >= ${start} AND appointment_at < ${end}
        AND reminder_sent_at IS NULL
    `) as BookingRow[];

    for (const row of rows) {
      const data = {
        name: row.name,
        service: row.service ?? undefined,
        message: row.message,
        appointmentAt: new Date(row.appointment_at),
      };
      try {
        await resend.emails.send({
          from: `New Concept by Rims <${fromEmail}>`,
          to: row.email,
          subject: "Rappel — votre rendez-vous est demain",
          html: reminderEmailHtml(data),
          text: reminderEmailText(data),
        });
        await sql`UPDATE bookings SET reminder_sent_at = now() WHERE id = ${row.id}`;
        remindersSent++;
      } catch (err) {
        console.error(`Reminder email failed for booking ${row.id}:`, err);
        errors.push(`reminder:${row.id}`);
      }
    }
  }

  // Review requests: appointments that happened yesterday, not yet asked.
  {
    const { start, end } = dayBounds(yesterday);
    const rows = (await sql`
      SELECT * FROM bookings
      WHERE appointment_at >= ${start} AND appointment_at < ${end}
        AND review_sent_at IS NULL
    `) as BookingRow[];

    for (const row of rows) {
      const data = {
        name: row.name,
        service: row.service ?? undefined,
        message: row.message,
        appointmentAt: new Date(row.appointment_at),
      };
      try {
        await resend.emails.send({
          from: `New Concept by Rims <${fromEmail}>`,
          to: row.email,
          subject: "Merci pour votre visite — donnez-nous votre avis",
          html: reviewRequestEmailHtml(data),
          text: reviewRequestEmailText(data),
        });
        await sql`UPDATE bookings SET review_sent_at = now() WHERE id = ${row.id}`;
        reviewsSent++;
      } catch (err) {
        console.error(`Review email failed for booking ${row.id}:`, err);
        errors.push(`review:${row.id}`);
      }
    }
  }

  return Response.json({ remindersSent, reviewsSent, errors });
}
