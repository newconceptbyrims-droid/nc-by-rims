"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const FACTS = [
  { label: "Quartier", value: "Ternes, Paris 17e" },
  { label: "Ouvert", value: "Mar–Sam, 10h–19h" },
  { label: "Spécialités", value: "Soins · Défrisage · Tissages · Couleur" },
];

export default function About() {
  return (
    <section id="a-propos" className="bg-paper py-24 md:py-36">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-16 px-6 md:px-10 lg:grid-cols-2 lg:items-center lg:gap-24">
        <motion.div
          initial={{ opacity: 0, scale: 1.04 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={viewportOnce}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative order-2 aspect-[4/5] w-full overflow-hidden lg:order-1"
        >
          <Image
            src="/images/gallery/wavy-blowout.jpg"
            alt="Brushing wavy réalisé au salon New Concept by Rims"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover object-top grayscale"
          />
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.12)}
          className="order-1 lg:order-2"
        >
          <motion.p
            variants={fadeUp()}
            className="mb-4 font-sans text-xs font-medium tracking-[0.3em] text-muted-on-light uppercase"
          >
            L&apos;univers du salon
          </motion.p>

          <motion.h2
            variants={fadeUp(0.05)}
            className="font-display text-4xl leading-tight md:text-5xl"
          >
            Une coiffure sur-mesure,
            <br />
            pensée pour chaque texture.
          </motion.h2>

          <motion.p
            variants={fadeUp(0.1)}
            className="mt-6 max-w-lg font-sans text-base leading-relaxed text-muted-on-light"
          >
            Niché avenue des Ternes, New Concept by Rims accompagne chaque
            cliente avec une expertise pointue : soins réparateurs, défrisage
            maîtrisé, tissages et tresses sur-mesure, colorations précises.
            Ici, chaque prestation est pensée pour révéler la texture
            naturelle de vos cheveux.
          </motion.p>

          <motion.div
            variants={fadeUp(0.16)}
            className="mt-10 grid grid-cols-1 gap-6 border-t border-line-light pt-8 sm:grid-cols-3"
          >
            {FACTS.map((fact) => (
              <div key={fact.label}>
                <p className="font-sans text-xs font-medium tracking-[0.2em] text-muted-on-light uppercase">
                  {fact.label}
                </p>
                <p className="mt-2 font-display text-lg leading-snug">
                  {fact.value}
                </p>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
