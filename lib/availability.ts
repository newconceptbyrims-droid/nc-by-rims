import { db } from "@/lib/db";
import { addDays, dayOfWeek, parisTimeKey, parisWallTimeToUtc } from "@/lib/paris-time";

// Assumptions (see plan doc): 30-minute slots, 1 concurrent booking per slot
// (no per-stylist capacity modeling), Tue-Sat 10h-17h45 inclusive (17h45 is
// the last bookable slot; salon stays open later for walk-ins), booking
// window 30 days ahead, no same-day slot within the next 2 hours.
export const OPEN_DAYS = [2, 3, 4, 5, 6]; // Tue..Sat
export const OPEN_HOUR = 10;
export const OPEN_MINUTE = 0;
export const CLOSE_HOUR = 17;
export const CLOSE_MINUTE = 45;
export const SLOT_MINUTES = 30;
export const MIN_LEAD_MINUTES = 120;
export const MAX_DAYS_AHEAD = 30;

export function isBookableDate(dateStr: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) return false;
  if (!OPEN_DAYS.includes(dayOfWeek(dateStr))) return false;
  const today = new Date().toISOString().slice(0, 10);
  return dateStr >= today && dateStr <= addDays(today, MAX_DAYS_AHEAD);
}

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60);
  const m = total % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

function candidateSlots(): string[] {
  const slots: string[] = [];
  const startMinutes = OPEN_HOUR * 60 + OPEN_MINUTE;
  const endMinutes = CLOSE_HOUR * 60 + CLOSE_MINUTE; // inclusive: this exact time is bookable
  let minutes = startMinutes;
  for (; minutes <= endMinutes; minutes += SLOT_MINUTES) {
    slots.push(formatMinutes(minutes));
  }
  // The closing time may not fall on the SLOT_MINUTES grid (e.g. a :45
  // cutoff with 30-minute slots) — always add it as a final slot so it's
  // genuinely bookable, even if the gap to the previous slot is shorter.
  const lastGenerated = minutes - SLOT_MINUTES;
  if (lastGenerated < endMinutes) {
    slots.push(formatMinutes(endMinutes));
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
