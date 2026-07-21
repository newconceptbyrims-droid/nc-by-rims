"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";

const IMAGES = [
  {
    src: "/images/gallery/long-straight-caramel.jpg",
    alt: "Coloration balayage caramel sur cheveux longs lisses, réalisée au salon New Concept by Rims",
  },
  {
    src: "/images/gallery/pixie-smile.jpg",
    alt: "Coupe courte pixie wavy, réalisée au salon New Concept by Rims",
  },
  {
    src: "/images/gallery/curly-long.jpg",
    alt: "Tissage lace frontale bouclé sur cheveux longs, réalisé au salon New Concept by Rims",
  },
  {
    src: "/images/gallery/bob-glasses.jpg",
    alt: "Coupe carré (bob) lisse, réalisée au salon New Concept by Rims",
  },
  {
    src: "/images/gallery/ponytail-waves.jpg",
    alt: "Queue de cheval ondulée avec racines lissées, réalisée au salon New Concept by Rims",
  },
  {
    src: "/images/gallery/long-straight-dark.jpg",
    alt: "Tissage lisse sur cheveux longs foncés, réalisé au salon New Concept by Rims",
  },
  {
    src: "/images/gallery/pixie-curls-copper.jpg",
    alt: "Coupe courte bouclée ton cuivré, réalisée au salon New Concept by Rims",
  },
  {
    src: "/images/gallery/bun-updo.jpg",
    alt: "Chignon haut avec balayage, réalisé au salon New Concept by Rims",
  },
  {
    src: "/images/gallery/pixie-highlights.jpg",
    alt: "Coupe courte pixie avec mèches, réalisée au salon New Concept by Rims",
  },
];

export default function Gallery() {
  return (
    <section id="galerie" className="bg-paper py-24 md:py-36">
      <div className="mx-auto max-w-7xl px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mx-auto max-w-2xl text-center"
        >
          <motion.p
            variants={fadeUp()}
            className="mb-4 font-sans text-xs font-medium tracking-[0.3em] text-muted-on-light uppercase"
          >
            Galerie
          </motion.p>
          <motion.h2 variants={fadeUp(0.05)} className="font-display text-4xl md:text-5xl">
            Nos réalisations
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.08)}
          className="mt-14 grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4"
        >
          {IMAGES.map((image) => (
            <motion.div
              key={image.src}
              variants={fadeUp(0, 20)}
              className="group relative aspect-square overflow-hidden"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover object-top grayscale transition-all duration-500 ease-out group-hover:scale-105 group-hover:grayscale-0"
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
