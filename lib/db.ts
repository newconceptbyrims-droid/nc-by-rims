import { neon } from "@neondatabase/serverless";

function getConnectionString(): string {
  const url =
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    process.env.DATABASE_URL_UNPOOLED;
  if (!url) {
    throw new Error(
      "No database connection string found (DATABASE_URL / POSTGRES_URL)."
    );
  }
  return url;
}

export function db() {
  return neon(getConnectionString());
}

export async function ensureSchema() {
  const sql = db();
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      service TEXT,
      message TEXT NOT NULL,
      appointment_at TIMESTAMPTZ NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
      reminder_sent_at TIMESTAMPTZ,
      review_sent_at TIMESTAMPTZ
    )
  `;
  await sql`
    CREATE INDEX IF NOT EXISTS bookings_appointment_at_idx
    ON bookings (appointment_at)
  `;
}

export type BookingRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  service: string | null;
  message: string;
  appointment_at: string;
  created_at: string;
  reminder_sent_at: string | null;
  review_sent_at: string | null;
};
