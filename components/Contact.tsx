"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { site } from "@/data/site";
import { serviceCategories } from "@/data/services";

type FieldErrors = Partial<
  Record<"name" | "email" | "phone" | "message" | "date" | "time", string>
>;
type Status = "idle" | "loading" | "success" | "error";
type SlotsState = "idle" | "loading" | "loaded" | "error";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OPEN_DAYS = [2, 3, 4, 5, 6]; // Tue..Sat, matches lib/availability.ts

const serviceOptions = serviceCategories.flatMap((c) => c.items.map((i) => i.name));

function toDateStr(d: Date): string {
  return d.toISOString().slice(0, 10);
}

const today = new Date();
const MIN_DATE = toDateStr(today);
const MAX_DATE = toDateStr(new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000));

export default function Contact() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [slots, setSlots] = useState<string[]>([]);
  const [slotsState, setSlotsState] = useState<SlotsState>("idle");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const dateRef = useRef<HTMLInputElement>(null);
  const timeRef = useRef<HTMLSelectElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  const slotsRequestRef = useRef(0);

  function handleDateChange(nextDate: string) {
    setDate(nextDate);
    setTime("");

    if (!nextDate) {
      setSlots([]);
      setSlotsState("idle");
      return;
    }
    const dow = new Date(`${nextDate}T12:00:00Z`).getUTCDay();
    if (!OPEN_DAYS.includes(dow)) {
      setSlots([]);
      setSlotsState("loaded");
      return;
    }

    const requestId = ++slotsRequestRef.current;
    setSlotsState("loading");
    fetch(`/api/availability?date=${nextDate}`)
      .then(async (res) => {
        const payload = (await res.json()) as { slots?: string[] };
        if (!res.ok) throw new Error(payload?.slots ? "" : "unavailable");
        return payload;
      })
      .then((payload) => {
        if (slotsRequestRef.current !== requestId) return;
        setSlots(payload.slots ?? []);
        setSlotsState("loaded");
      })
      .catch(() => {
        if (slotsRequestRef.current !== requestId) return;
        setSlots([]);
        setSlotsState("error");
      });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const service = String(data.get("service") ?? "");

    const nextErrors: FieldErrors = {};
    if (name.length < 2) nextErrors.name = "Merci d'indiquer votre nom.";
    if (!EMAIL_PATTERN.test(email)) nextErrors.email = "Merci d'indiquer un email valide.";
    if (phone.length < 6) nextErrors.phone = "Merci d'indiquer un numéro valide.";
    if (!date) nextErrors.date = "Merci de choisir une date.";
    if (!time) nextErrors.time = "Merci de choisir un horaire.";
    if (message.length < 4) nextErrors.message = "Dites-nous en un peu plus.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.email) emailRef.current?.focus();
      else if (nextErrors.phone) phoneRef.current?.focus();
      else if (nextErrors.date) dateRef.current?.focus();
      else if (nextErrors.time) timeRef.current?.focus();
      else messageRef.current?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, service, message, date, time }),
      });
      const payload = (await res.json()) as { error?: string; success?: boolean };

      if (!res.ok || !payload.success) {
        setStatus("error");
        setErrorMessage(
          payload.error ?? "Une erreur est survenue. Merci de réessayer."
        );
        return;
      }

      setStatus("success");
      form.reset();
      setDate("");
      setTime("");
      setSlots([]);
      setSlotsState("idle");
    } catch {
      setStatus("error");
      setErrorMessage(
        "Impossible d'envoyer le message. Vérifiez votre connexion et réessayez."
      );
    }
  }

  const noSlotsForDate = slotsState === "loaded" && date && slots.length === 0;

  return (
    <section id="contact" className="bg-paper py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:px-10 lg:grid-cols-2 lg:gap-24">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.1)}
        >
          <motion.p
            variants={fadeUp()}
            className="mb-4 font-sans text-xs font-medium tracking-[0.3em] text-muted-on-light uppercase"
          >
            Contact
          </motion.p>
          <motion.h2 variants={fadeUp(0.05)} className="font-display text-4xl md:text-5xl">
            Prenons rendez-vous
          </motion.h2>

          <motion.div variants={fadeUp(0.1)} className="mt-10 space-y-6">
            <div className="flex items-start gap-4">
              <MapPin size={22} weight="light" className="mt-0.5 shrink-0" />
              <p className="font-sans text-base leading-relaxed">
                {site.address.line1}
                <br />
                {site.address.line2}
              </p>
            </div>
            <div className="flex items-start gap-4">
              <Phone size={22} weight="light" className="mt-0.5 shrink-0" />
              <a href={site.phoneHref} className="font-sans text-base cursor-pointer">
                {site.phone}
              </a>
            </div>
            <div className="flex items-start gap-4">
              <Clock size={22} weight="light" className="mt-0.5 shrink-0" />
              <ul className="font-sans text-base leading-relaxed">
                {site.hours.map((h) => (
                  <li key={h.days} className="flex gap-3">
                    <span className="w-32 shrink-0 text-muted-on-light">{h.days}</span>
                    <span>{h.hours}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp(0.15)}
            className="mt-10 aspect-[4/3] w-full overflow-hidden border border-line-light"
          >
            <iframe
              src={site.mapsEmbedSrc}
              title={`Localisation ${site.name}`}
              loading="lazy"
              className="h-full w-full border-0"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <div>
              <label htmlFor="name" className="font-sans text-sm font-medium">
                Nom <span aria-hidden="true">*</span>
              </label>
              <input
                ref={nameRef}
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                className="mt-2 w-full border-b border-line-light bg-transparent py-3 font-sans text-base outline-none transition-colors focus:border-ink"
              />
              {errors.name && (
                <p id="name-error" role="alert" className="mt-2 text-sm text-red-700">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="font-sans text-sm font-medium">
                Téléphone <span aria-hidden="true">*</span>
              </label>
              <input
                ref={phoneRef}
                id="phone"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                aria-invalid={Boolean(errors.phone)}
                aria-describedby={errors.phone ? "phone-error" : undefined}
                className="mt-2 w-full border-b border-line-light bg-transparent py-3 font-sans text-base outline-none transition-colors focus:border-ink"
              />
              {errors.phone && (
                <p id="phone-error" role="alert" className="mt-2 text-sm text-red-700">
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="font-sans text-sm font-medium">
                Email <span aria-hidden="true">*</span>
              </label>
              <input
                ref={emailRef}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
                className="mt-2 w-full border-b border-line-light bg-transparent py-3 font-sans text-base outline-none transition-colors focus:border-ink"
              />
              {errors.email && (
                <p id="email-error" role="alert" className="mt-2 text-sm text-red-700">
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="date" className="font-sans text-sm font-medium">
                  Date <span aria-hidden="true">*</span>
                </label>
                <input
                  ref={dateRef}
                  id="date"
                  name="date"
                  type="date"
                  min={MIN_DATE}
                  max={MAX_DATE}
                  value={date}
                  onChange={(e) => handleDateChange(e.target.value)}
                  required
                  aria-invalid={Boolean(errors.date)}
                  aria-describedby={errors.date ? "date-error" : undefined}
                  className="mt-2 w-full border-b border-line-light bg-transparent py-3 font-sans text-base outline-none transition-colors focus:border-ink"
                />
                {errors.date && (
                  <p id="date-error" role="alert" className="mt-2 text-sm text-red-700">
                    {errors.date}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="time" className="font-sans text-sm font-medium">
                  Heure <span aria-hidden="true">*</span>
                </label>
                <select
                  ref={timeRef}
                  id="time"
                  name="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  disabled={!date || slotsState === "loading" || slots.length === 0}
                  required
                  aria-invalid={Boolean(errors.time)}
                  aria-describedby={errors.time ? "time-error" : undefined}
                  className="mt-2 w-full border-b border-line-light bg-transparent py-3 font-sans text-base outline-none transition-colors focus:border-ink disabled:text-muted-on-light"
                >
                  <option value="" disabled>
                    {!date
                      ? "Choisir une date d'abord"
                      : slotsState === "loading"
                        ? "Chargement…"
                        : slots.length === 0
                          ? "Aucun créneau"
                          : "Choisir un horaire"}
                  </option>
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                {errors.time && (
                  <p id="time-error" role="alert" className="mt-2 text-sm text-red-700">
                    {errors.time}
                  </p>
                )}
              </div>
            </div>
            {slotsState === "error" && (
              <p className="-mt-3 font-sans text-sm text-red-700">
                Impossible de charger les créneaux disponibles. Merci de
                réessayer ou de nous appeler directement.
              </p>
            )}
            {noSlotsForDate && (
              <p className="-mt-3 font-sans text-sm text-muted-on-light">
                Aucun créneau disponible ce jour-là (salon fermé ou complet). Merci
                d&apos;essayer une autre date.
              </p>
            )}

            <div>
              <label htmlFor="service" className="font-sans text-sm font-medium">
                Prestation souhaitée
              </label>
              <select
                id="service"
                name="service"
                defaultValue=""
                className="mt-2 w-full border-b border-line-light bg-transparent py-3 font-sans text-base outline-none transition-colors focus:border-ink"
              >
                <option value="" disabled>
                  Sélectionner une prestation
                </option>
                {serviceOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="message" className="font-sans text-sm font-medium">
                Message <span aria-hidden="true">*</span>
              </label>
              <textarea
                ref={messageRef}
                id="message"
                name="message"
                rows={4}
                required
                aria-invalid={Boolean(errors.message)}
                aria-describedby={errors.message ? "message-error" : undefined}
                className="mt-2 w-full resize-none border-b border-line-light bg-transparent py-3 font-sans text-base outline-none transition-colors focus:border-ink"
              />
              {errors.message && (
                <p id="message-error" role="alert" className="mt-2 text-sm text-red-700">
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={status === "loading"}
              className="w-full rounded-full bg-ink px-7 py-3.5 font-sans text-sm font-medium tracking-wide text-paper transition-transform duration-200 hover:scale-[1.01] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              {status === "loading" ? "Envoi en cours…" : "Réserver mon créneau"}
            </button>

            <div aria-live="polite">
              {status === "success" && (
                <p className="font-sans text-sm text-emerald-700">
                  Merci ! Votre rendez-vous est confirmé — vous allez recevoir
                  un email de confirmation avec tous les détails.
                </p>
              )}
              {status === "error" && (
                <p className="font-sans text-sm text-red-700">{errorMessage}</p>
              )}
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
