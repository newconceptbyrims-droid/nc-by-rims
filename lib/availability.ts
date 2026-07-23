import { db } from "@/lib/db";
import { addDays, dayOfWeek, parisTimeKey, parisWallTimeToUtc } from "@/lib/paris-time";

// Assumptions (see plan doc): 30-minute slots, 1 concurrent booking per slot
// (no per-stylist capacity modeling), Tue-Sat 10h-19h, booking window 30 days
// ahead, no same-day slot within the next 2 hours.
export const OPEN_DAYS = [2, 3, 4, 5, 6]; // Tue..Sat
export const OPEN_HOUR = 10;
export const CLOSE_HOUR = 19;
export const SLOT_MINUTES = 30;
export const MIN_LEAD_MINUTES = 120;
export const MAX_DAYS_AHEAD = 30;

export function isBookableDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  if (!OPEN_DAYS.includes(dayOfWeek(dateStr))) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dateStr >= today && dateStr <= addDays(today, MAX_DAYS_AHEAD);
}

function candidateSlots(): string[] {
  const slots: string[] = [];
  for (let h = OPEN_HOUR; h < CLOSE_HOUR; h++) {
    for (let m = 0; m < 60; m += SLOT_MINUTES) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export async function getAvailableSlots(dateStr: string): Promise<string[]> {
  if (!isBookableDate(dateStr)) return [];

  const now = new Date();
  const minStart = new Date(now.getTime() + MIN_LEAD_MINUTES * 60 * 1000);

  let slots = candidateSlots().filter(
    (time) => parisWallTimeToUtc(dateStr, time) >= minStart
  );

  const dayStart = parisWallTimeToUtc(dateStr, "00:00");
  const dayEnd = parisWallTimeToUtc(addDays(dateStr, 1), "00:00");

  const sql = db();
  const rows = (await sql`
    SELECT appointment_at FROM bookings
    WHERE appointment_at >= ${dayStart.toISOString()}
      AND appointment_at < ${dayEnd.toISOString()}
  `) as { appointment_at: string }[];

  const booked = new Set(rows.map((r) => parisTimeKey(new Date(r.appointment_at))));
  slots = slots.filter((time) => !booked.has(time));

  return slots;
}

export async function isSlotAvailable(dateStr: string, time: string): Promise<boolean> {
  const slots = await getAvailableSlots(dateStr);
  return slots.includes(time);
}
