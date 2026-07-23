export const PARIS_TZ = "Europe/Paris";

/**
 * Converts a Europe/Paris wall-clock date+time into the correct UTC Date,
 * accounting for CET/CEST. Uses the "double formatting" trick since no
 * timezone library is bundled.
 */
export function parisWallTimeToUtc(dateStr: string, timeStr: string): Date {
  const guess = new Date(`${dateStr}T${timeStr}:00Z`);
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: PARIS_TZ,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
      .formatToParts(guess)
      .map((p) => [p.type, p.value])
  );
  const parisAsUtc = new Date(
    `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}:${parts.second}Z`
  );
  const offsetMs = guess.getTime() - parisAsUtc.getTime();
  return new Date(guess.getTime() + offsetMs);
}

/** Returns the Europe/Paris calendar date (YYYY-MM-DD) for a given instant. */
export function parisDateKey(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: PARIS_TZ,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  return `${parts.year}-${parts.month}-${parts.day}`;
}

/** Returns the Europe/Paris wall-clock HH:mm for a given instant. */
export function parisTimeKey(date: Date): string {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: PARIS_TZ,
      hourCycle: "h23",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(date)
      .map((p) => [p.type, p.value])
  );
  return `${parts.hour}:${parts.minute}`;
}

/** 0 (Sunday) .. 6 (Saturday) for a plain YYYY-MM-DD calendar date. */
export function dayOfWeek(dateStr: string): number {
  return new Date(`${dateStr}T12:00:00Z`).getUTCDay();
}

/** Adds `days` calendar days to a YYYY-MM-DD string, returning YYYY-MM-DD. */
export function addDays(dateStr: string, days: number): string {
  const d = new Date(`${dateStr}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

const DAY_NAMES_FR = [
  "dimanche",
  "lundi",
  "mardi",
  "mercredi",
  "jeudi",
  "vendredi",
  "samedi",
];
const MONTH_NAMES_FR = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

/** Formats a UTC instant as French Paris-local "jour / date / heure" parts. */
export function formatParisFrench(date: Date): {
  dayName: string;
  dateLabel: string;
  timeLabel: string;
} {
  const dateKey = parisDateKey(date);
  const [year, month, day] = dateKey.split("-").map(Number);
  const dow = new Date(`${dateKey}T12:00:00Z`).getUTCDay();
  return {
    dayName: DAY_NAMES_FR[dow],
    dateLabel: `${day} ${MONTH_NAMES_FR[month - 1]} ${year}`,
    timeLabel: parisTimeKey(date),
  };
}
