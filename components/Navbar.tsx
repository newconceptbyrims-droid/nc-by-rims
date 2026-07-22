"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { List, Phone, X } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/data/site";
import { EASE_OUT } from "@/lib/motion";
import Logo from "@/components/Logo";

const NAV_LINKS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#a-propos", label: "À propos" },
  { href: "#prestations", label: "Prestations" },
  { href: "#galerie", label: "Galerie" },
  { href: "#avis", label: "Avis" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
          scrolled
            ? "bg-paper/90 text-ink backdrop-blur-md border-b border-line-light"
            : "bg-transparent text-paper border-b border-transparent"
        }`}
      >
        <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6 py-4 md:px-10">
          <a href="#accueil" className="flex items-center gap-3 cursor-pointer" aria-label="New Concept by Rims — accueil">
            <Logo size={40} />
            <span className="hidden font-logo text-lg font-semibold tracking-[0.12em] uppercase sm:inline">
              New Concept
            </span>
          </a>

          <ul className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="group relative text-sm font-medium tracking-wide cursor-pointer"
                >
                  {link.label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-current transition-all duration-300 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-5 lg:flex">
            <a
              href={site.phoneHref}
              className="flex items-center gap-2 text-sm font-medium cursor-pointer"
              aria-label={`Appeler le salon au ${site.phone}`}
            >
              <Phone size={18} weight="light" />
              {site.phone}
            </a>
            <a
              href="#contact"
              className={`rounded-full border px-5 py-2.5 text-sm font-medium tracking-wide transition-all duration-300 active:scale-[0.97] cursor-pointer ${
                scrolled
                  ? "border-ink hover:bg-ink hover:text-paper"
                  : "border-paper hover:bg-paper hover:text-ink"
              }`}
            >
              Prendre rendez-vous
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="flex h-11 w-11 items-center justify-center transition-transform duration-200 active:scale-[0.9] lg:hidden cursor-pointer"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
          >
            <List size={26} weight="light" />
          </button>
        </nav>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE_OUT }}
            className="fixed inset-0 z-[60] flex flex-col bg-ink text-paper lg:hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Menu de navigation"
          >
            <div className="flex h-20 items-center justify-between px-6 py-4">
              <span className="flex items-center gap-3">
                <Logo size={40} />
                <span className="font-logo text-lg font-semibold tracking-[0.12em] uppercase">
                  New Concept
                </span>
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 w-11 items-center justify-center transition-transform duration-200 active:scale-[0.9] cursor-pointer"
                aria-label="Fermer le menu"
              >
                <X size={26} weight="light" />
              </button>
            </div>

            <motion.ul
              initial="hidden"
              animate="visible"
              variants={{
                visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
              }}
              className="flex flex-1 flex-col justify-center gap-2 px-8"
            >
              {NAV_LINKS.map((link) => (
                <motion.li
                  key={link.href}
                  variants={{
                    hidden: { opacity: 0, y: 16 },
                    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE_OUT } },
                  }}
                >
                  <a
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block py-3 font-display text-3xl cursor-pointer"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </motion.ul>

            <div className="flex flex-col gap-4 px-8 pb-10">
              <a
                href={site.phoneHref}
                className="flex items-center gap-2 text-base cursor-pointer"
              >
                <Phone size={20} weight="light" />
                {site.phone}
              </a>
              <a
                href="#contact"
                onClick={() => setOpen(false)}
                className="rounded-full border border-paper px-5 py-3 text-center text-sm font-medium tracking-wide transition-transform duration-200 active:scale-[0.97] cursor-pointer"
              >
                Prendre rendez-vous
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
