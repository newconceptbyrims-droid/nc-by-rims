"use client";

import { useRef, useState, type FormEvent } from "react";
import { motion } from "framer-motion";
import { Clock, MapPin, Phone } from "@phosphor-icons/react/dist/ssr";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { site } from "@/data/site";
import { serviceCategories } from "@/data/services";

type FieldErrors = Partial<Record<"name" | "phone" | "message", string>>;
type Status = "idle" | "loading" | "success" | "error";

const serviceOptions = serviceCategories.flatMap((c) => c.items.map((i) => i.name));

export default function Contact() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [status, setStatus] = useState<Status>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const phone = String(data.get("phone") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();
    const service = String(data.get("service") ?? "");

    const nextErrors: FieldErrors = {};
    if (name.length < 2) nextErrors.name = "Merci d'indiquer votre nom.";
    if (phone.length < 6) nextErrors.phone = "Merci d'indiquer un numéro valide.";
    if (message.length < 4) nextErrors.message = "Dites-nous en un peu plus.";

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      if (nextErrors.name) nameRef.current?.focus();
      else if (nextErrors.phone) phoneRef.current?.focus();
      else messageRef.current?.focus();
      return;
    }

    setStatus("loading");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, phone, service, message }),
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
    } catch {
      setStatus("error");
      setErrorMessage(
        "Impossible d'envoyer le message. Vérifiez votre connexion et réessayez."
      );
    }
  }

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
              {status === "loading" ? "Envoi en cours…" : "Envoyer la demande"}
            </button>

            <div aria-live="polite">
              {status === "success" && (
                <p className="font-sans text-sm text-emerald-700">
                  Merci ! Votre demande a bien été envoyée, nous vous
                  recontactons rapidement.
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
