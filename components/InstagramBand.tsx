"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { fadeUp, staggerContainer, viewportOnce } from "@/lib/motion";
import { site } from "@/data/site";

const THUMBS = [
  "/images/gallery/bob-glasses.jpg",
  "/images/gallery/long-straight-caramel.jpg",
  "/images/gallery/curly-long.jpg",
  "/images/gallery/pixie-smile.jpg",
  "/images/gallery/bun-updo.jpg",
  "/images/gallery/ponytail-waves.jpg",
];

export default function InstagramBand() {
  return (
    <section className="bg-ink py-20 text-paper md:py-28">
      <div className="mx-auto max-w-6xl px-6 md:px-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="flex flex-col items-center gap-4 text-center"
        >
          <motion.div variants={fadeUp()} className="flex items-center gap-2">
            <InstagramLogo size={22} weight="light" />
            <span className="font-sans text-sm tracking-wide text-muted-on-dark">
              {site.instagram.handle}
            </span>
          </motion.div>
          <motion.h2 variants={fadeUp(0.05)} className="font-display text-3xl md:text-4xl">
            Suivez-nous sur Instagram
          </motion.h2>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          variants={staggerContainer(0.06)}
          className="mt-12 grid grid-cols-3 gap-2 md:grid-cols-6 md:gap-3"
        >
          {THUMBS.map((src, i) => (
            <motion.a
              key={src}
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              variants={fadeUp(0, 16)}
              className="group relative aspect-square overflow-hidden cursor-pointer"
              aria-label="Voir la publication sur Instagram"
            >
              <Image
                src={src}
                alt={`Publication Instagram ${i + 1} du salon New Concept by Rims`}
                fill
                loading="lazy"
                sizes="(max-width: 768px) 33vw, 16vw"
                className="object-cover object-top transition-transform duration-500 ease-out group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-ink/0 transition-colors duration-300 group-hover:bg-ink/20" />
            </motion.a>
          ))}
        </motion.div>

        <div className="mt-10 text-center">
          <a
            href={site.instagram.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-full border border-paper px-7 py-3.5 font-sans text-sm font-medium tracking-wide transition-all duration-300 hover:bg-paper hover:text-ink active:scale-[0.97] cursor-pointer"
          >
            Suivre {site.instagram.handle}
          </a>
        </div>
      </div>
    </section>
  );
}
