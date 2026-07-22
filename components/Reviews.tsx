"use client";

import { motion } from "framer-motion";
import { Star, ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import { fadeUp, viewportOnce } from "@/lib/motion";
import { site } from "@/data/site";

const GOOGLE_RATING = 4.3;

const REVIEWS = [
  {
    quote:
      "« Salon très propre, je vous recommande vivement. Personnel très sympathique, très professionnel, très agréable et surtout un bon prix pour une prestation de qualité. »",
    author: "Jonas Kande",
    rating: 5,
  },
  {
    quote:
      "« Salon propre et accueil au top ! Rien à dire à part du positif ! La responsable ainsi que les coiffeuses sont douces et rapides ! J'y retournerai sans hésiter. »",
    author: "Carla Koum",
    rating: 5,
  },
  {
    quote:
      "« C'était ma première expérience dans ce salon de coiffure, je suis plus que satisfaite, l'équipe est au TOP, je recommande fortement. »",
    author: "Stephie Mpemba",
    rating: 5,
  },
  {
    quote:
      "« Je fréquente le salon depuis quelques temps pour des coupes « Pixie » et je suis toujours impressionnée par le professionnalisme, la bienveillance et le côté humain des coiffeuses. De l'accueil jusqu'à la prestation, le service est impeccable. Un vrai plus pour la carte de fidélité. Je recommande les yeux fermés. »",
    author: "Jasnèle Nkouma",
    rating: 5,
  },
  {
    quote:
      "« Toujours un réel plaisir de me faire coiffer ici. Même en résidant actuellement à Accra, je tiens à revenir spécialement pour faire styliser ma coiffure avant un entretien sur place — c'est dire à quel point j'ai confiance en leur savoir-faire. Le personnel est à la fois accueillant, attentif et très professionnel. Je recommande vivement ! »",
    author: "Ell G.",
    rating: 5,
  },
];

const TRACK = [...REVIEWS, ...REVIEWS];

function StarRating({ rating, size = 20 }: { rating: number; size?: number }) {
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => {
        const fill = Math.min(Math.max(rating - i, 0), 1) * 100;
        return (
          <span
            key={i}
            className="relative inline-block"
            style={{ width: size, height: size }}
          >
            <Star size={size} weight="regular" className="absolute inset-0 text-gold/40" />
            <span
              className="absolute inset-0 overflow-hidden"
              style={{ width: `${fill}%` }}
            >
              <Star size={size} weight="fill" className="text-gold" />
            </span>
          </span>
        );
      })}
    </div>
  );
}

export default function Reviews() {
  return (
    <section id="avis" className="bg-cloud py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.p
            variants={fadeUp()}
            className="mb-4 font-sans text-xs font-medium tracking-[0.3em] text-muted-on-light uppercase"
          >
            Avis clients
          </motion.p>
          <motion.h2 variants={fadeUp(0.05)} className="font-display text-4xl md:text-5xl">
            La confiance de nos clientes
          </motion.h2>

          <motion.div
            variants={fadeUp(0.1)}
            className="mt-6 flex items-center gap-3"
          >
            <StarRating rating={GOOGLE_RATING} />
            <span className="font-sans text-sm text-muted-on-light">
              {GOOGLE_RATING.toString().replace(".", ",")}/5 sur Google
            </span>
          </motion.div>
        </motion.div>
      </div>

      <div className="marquee-pausable mt-14 overflow-x-auto [scrollbar-width:none] md:overflow-hidden [&::-webkit-scrollbar]:hidden">
        <div className="marquee-track flex w-max animate-marquee gap-6 px-6 md:px-0">
          {TRACK.map((review, i) => (
            <blockquote
              key={`${review.author}-${i}`}
              className="flex h-full w-[320px] shrink-0 flex-col justify-between rounded-2xl border border-line-light bg-paper p-8 sm:w-[380px]"
            >
              <div>
                <StarRating rating={review.rating} size={16} />
                <p className="mt-4 font-display text-lg leading-relaxed italic">
                  {review.quote}
                </p>
              </div>
              <footer className="mt-6 font-sans text-sm text-muted-on-light">
                — {review.author}
              </footer>
            </blockquote>
          ))}
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={viewportOnce}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-12 text-center"
      >
        <a
          href={site.googleReviewsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-ink px-7 py-3.5 font-sans text-sm font-medium tracking-wide transition-all duration-300 hover:bg-ink hover:text-paper active:scale-[0.97] cursor-pointer"
        >
          Voir tous nos avis Google
          <ArrowUpRight size={18} weight="light" />
        </a>
      </motion.div>
    </section>
  );
}
