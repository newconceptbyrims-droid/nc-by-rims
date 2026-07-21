"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowDown } from "@phosphor-icons/react/dist/ssr";
import { EASE_OUT, staggerContainer } from "@/lib/motion";
import { site } from "@/data/site";

const title = ["New", "Concept", "by", "Rims"];

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative flex min-h-dvh items-center overflow-hidden bg-ink text-paper"
    >
      <Image
        src="/images/hero-team.webp"
        alt="L'équipe du salon New Concept by Rims devant le mur signature du salon, avenue des Ternes à Paris"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[50%_28%] grayscale"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-ink via-ink/85 to-ink/50" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-6 pt-24 pb-32 md:px-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE_OUT }}
          className="mb-6 font-sans text-xs font-medium tracking-[0.3em] text-muted-on-dark uppercase"
        >
          Salon de coiffure — Paris 17e
        </motion.p>

        <motion.h1
          initial="hidden"
          animate="visible"
          variants={staggerContainer(0.1, 0.15)}
          className="font-display text-[clamp(2.75rem,9vw,7.5rem)] leading-[0.95] tracking-tight uppercase"
        >
          {title.map((word, i) => (
            <span key={word} className="mr-[0.28em] inline-block overflow-hidden align-bottom">
              <motion.span
                variants={{
                  hidden: { y: "100%" },
                  visible: {
                    y: 0,
                    transition: { duration: 0.8, ease: EASE_OUT },
                  },
                }}
                className={`inline-block ${i === 2 ? "font-normal italic" : ""}`}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6, ease: EASE_OUT }}
          className="mt-8 max-w-xl font-sans text-lg leading-relaxed text-muted-on-dark"
        >
          Soins, défrisage, tissages, tresses et coloration — au cœur du
          quartier des Ternes. Une coiffure sur-mesure, pensée pour chaque
          texture.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: EASE_OUT }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <a
            href="#contact"
            className="rounded-full bg-paper px-7 py-3.5 text-sm font-medium tracking-wide text-ink transition-transform duration-200 hover:scale-[1.03] active:scale-[0.97] cursor-pointer"
          >
            Prendre rendez-vous
          </a>
          <a
            href="#prestations"
            className="rounded-full border border-paper/40 px-7 py-3.5 text-sm font-medium tracking-wide transition-colors duration-300 hover:bg-paper/10 cursor-pointer"
          >
            Voir les prestations
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-6 font-sans text-sm text-muted-on-dark"
        >
          {site.address.full} · Mar–Sam 10h–19h
        </motion.p>
      </div>

      <motion.a
        href="#a-propos"
        aria-label="Défiler vers la section suivante"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{
          opacity: { duration: 0.6, delay: 1.2 },
          y: { duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: 1.2 },
        }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2 cursor-pointer text-paper/80"
      >
        <ArrowDown size={22} weight="light" />
      </motion.a>
    </section>
  );
}
