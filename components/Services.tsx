"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { fadeUp, viewportOnce, EASE_OUT } from "@/lib/motion";
import { serviceCategories } from "@/data/services";

export default function Services() {
  const [activeId, setActiveId] = useState(serviceCategories[0].id);
  const active = serviceCategories.find((c) => c.id === activeId)!;

  return (
    <section id="prestations" className="bg-ink py-24 text-paper md:py-36">
      <div className="mx-auto max-w-5xl px-6 md:px-10">
        <motion.div initial="hidden" whileInView="visible" viewport={viewportOnce}>
          <motion.p
            variants={fadeUp()}
            className="mb-4 font-sans text-xs font-medium tracking-[0.3em] text-muted-on-dark uppercase"
          >
            Prestations &amp; tarifs
          </motion.p>
          <motion.h2 variants={fadeUp(0.05)} className="font-display text-4xl md:text-5xl">
            Le menu du salon
          </motion.h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6, delay: 0.15, ease: EASE_OUT }}
          className="mt-14 flex flex-wrap gap-2 border-b border-line-dark pb-6 md:gap-3"
        >
          {serviceCategories.map((category) => {
            const isActive = category.id === activeId;
            return (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveId(category.id)}
                aria-pressed={isActive}
                className={`rounded-full border px-5 py-2.5 font-sans text-sm font-medium tracking-wide transition-all duration-300 active:scale-[0.97] cursor-pointer ${
                  isActive
                    ? "border-paper bg-paper text-ink"
                    : "border-line-dark text-muted-on-dark hover:border-paper/60 hover:text-paper"
                }`}
              >
                {category.label}
              </button>
            );
          })}
        </motion.div>

        <div className="relative mt-4 min-h-[420px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: EASE_OUT }}
              className="py-10"
            >
              <ul>
                {active.items.map((item, i) => (
                  <li
                    key={item.name}
                    className={`flex items-baseline justify-between gap-6 py-4 ${
                      i !== active.items.length - 1 ? "border-b border-line-dark/70" : ""
                    }`}
                  >
                    <span className="font-display text-lg md:text-xl">
                      {item.name}
                    </span>
                    <span className="tabular shrink-0 font-sans text-base text-muted-on-dark md:text-lg">
                      {item.price ?? "Sur devis"}
                    </span>
                  </li>
                ))}
              </ul>

              {active.note && (
                <p className="mt-8 font-sans text-sm italic text-muted-on-dark">
                  {active.note}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="mt-6 text-center">
          <a
            href="#contact"
            className="inline-block rounded-full border border-paper px-7 py-3.5 font-sans text-sm font-medium tracking-wide transition-all duration-300 hover:bg-paper hover:text-ink active:scale-[0.97] cursor-pointer"
          >
            Demander un devis personnalisé
          </a>
        </div>
      </div>
    </section>
  );
}
