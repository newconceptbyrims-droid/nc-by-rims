import { db, ensureSchema, type BookingRow } from "@/lib/db";
import { formatParisFrench, parisDateKey } from "@/lib/paris-time";

export const metadata = {
  title: "Planning — New Concept by Rims",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

function formatShortDate(row: BookingRow) {
  const { dayName, dateLabel, timeLabel } = formatParisFrench(
    new Date(row.appointment_at)
  );
  return { dayName, dateLabel, timeLabel };
}

export default async function PlanningPage() {
  let bookings: BookingRow[] = [];
  let error: string | null = null;

  try {
    await ensureSchema();
    const sql = db();
    bookings = (await sql`
      SELECT * FROM bookings
      WHERE appointment_at >= now() - interval '7 days'
      ORDER BY appointment_at ASC
    `) as BookingRow[];
  } catch (err) {
    console.error("Planning page: failed to load bookings:", err);
    error = "Impossible de charger les réservations pour le moment.";
  }

  const groups = new Map<string, BookingRow[]>();
  for (const row of bookings) {
    const key = parisDateKey(new Date(row.appointment_at));
    const list = groups.get(key) ?? [];
    list.push(row);
    groups.set(key, list);
  }

  const todayKey = parisDateKey(new Date());

  return (
    <main className="min-h-dvh bg-paper px-6 py-12 text-ink md:px-10 md:py-16">
      <div className="mx-auto max-w-3xl">
        <p className="font-sans text-xs font-medium tracking-[0.3em] text-muted-on-light uppercase">
          New Concept by Rims
        </p>
        <h1 className="mt-2 font-display text-3xl md:text-4xl">Planning</h1>
        <p className="mt-2 font-sans text-sm text-muted-on-light">
          Réservations des 7 derniers jours et à venir.
        </p>

        {error && (
          <p className="mt-10 font-sans text-sm text-red-700">{error}</p>
        )}

        {!error && bookings.length === 0 && (
          <p className="mt-10 font-sans text-sm text-muted-on-light">
            Aucune réservation pour l&apos;instant.
          </p>
        )}

        <div className="mt-10 space-y-10">
          {Array.from(groups.entries()).map(([dateKey, rows]) => {
            const { dayName, dateLabel } = formatShortDate(rows[0]);
            const isPast = dateKey < todayKey;
            const isToday = dateKey === todayKey;
            return (
              <section key={dateKey}>
                <h2 className="font-display text-xl capitalize">
                  {dayName} {dateLabel}
                  {isToday && (
                    <span className="ml-3 rounded-full bg-ink px-3 py-1 align-middle font-sans text-xs font-medium text-paper">
                      Aujourd&apos;hui
                    </span>
                  )}
                </h2>
                <ul className="mt-4 divide-y divide-line-light border-t border-b border-line-light">
                  {rows.map((row) => {
                    const { timeLabel } = formatShortDate(row);
                    return (
                      <li key={row.id} className="flex flex-col gap-2 py-4 sm:flex-row sm:gap-6">
                        <div className="tabular shrink-0 font-display text-lg sm:w-16">
                          {timeLabel}
                        </div>
                        <div className="flex-1">
                          <p className="font-sans text-base font-semibold">{row.name}</p>
                          {row.service && (
                            <p className="font-sans text-sm text-muted-on-light">
                              {row.service}
                            </p>
                          )}
                          <p className="mt-1 font-sans text-sm text-muted-on-light">
                            <a href={`tel:${row.phone}`} className="cursor-pointer hover:underline">
                              {row.phone}
                            </a>
                            {" · "}
                            <a href={`mailto:${row.email}`} className="cursor-pointer hover:underline">
                              {row.email}
                            </a>
                          </p>
                          {row.message && (
                            <p className="mt-2 font-sans text-sm italic text-muted-on-light">
                              « {row.message} »
                            </p>
                          )}
                        </div>
                        {isPast && (
                          <div className="flex shrink-0 flex-row gap-2 sm:flex-col sm:items-end">
                            <span
                              className={`rounded-full border px-2.5 py-1 font-sans text-xs ${
                                row.reminder_sent_at
                                  ? "border-line-light text-muted-on-light"
                                  : "border-line-light text-muted-on-light opacity-50"
                              }`}
                            >
                              Rappel {row.reminder_sent_at ? "envoyé" : "—"}
                            </span>
                            <span
                              className={`rounded-full border px-2.5 py-1 font-sans text-xs ${
                                row.review_sent_at
                                  ? "border-line-light text-muted-on-light"
                                  : "border-line-light text-muted-on-light opacity-50"
                              }`}
                            >
                              Avis {row.review_sent_at ? "envoyé" : "—"}
                            </span>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>
            );
          })}
        </div>
      </div>
    </main>
  );
}
