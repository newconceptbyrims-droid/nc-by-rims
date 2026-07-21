import { ArrowUp, InstagramLogo } from "@phosphor-icons/react/dist/ssr";
import { site } from "@/data/site";
import Logo from "@/components/Logo";

const LINKS = [
  { href: "#accueil", label: "Accueil" },
  { href: "#a-propos", label: "À propos" },
  { href: "#prestations", label: "Prestations" },
  { href: "#galerie", label: "Galerie" },
  { href: "#avis", label: "Avis" },
  { href: "#contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          <div>
            <Logo size={56} />
            <p className="mt-4 max-w-xs font-sans text-sm leading-relaxed text-muted-on-dark">
              {site.tagline}
            </p>
            <a
              href={site.instagram.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-flex items-center gap-2 font-sans text-sm cursor-pointer"
            >
              <InstagramLogo size={20} weight="light" />
              {site.instagram.handle}
            </a>
          </div>

          <div>
            <p className="font-sans text-xs font-medium tracking-[0.2em] text-muted-on-dark uppercase">
              Navigation
            </p>
            <ul className="mt-4 space-y-3">
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href} className="font-sans text-sm cursor-pointer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-xs font-medium tracking-[0.2em] text-muted-on-dark uppercase">
              Coordonnées
            </p>
            <p className="mt-4 font-sans text-sm leading-relaxed">
              {site.address.line1}
              <br />
              {site.address.line2}
            </p>
            <a href={site.phoneHref} className="mt-3 block font-sans text-sm cursor-pointer">
              {site.phone}
            </a>
            <p className="mt-3 font-sans text-sm text-muted-on-dark">
              Mar–Sam · 10h–19h
            </p>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-line-dark pt-8 md:flex-row">
          <p className="font-sans text-xs text-muted-on-dark">
            © {new Date().getFullYear()} New Concept by Rims. Tous droits réservés.
          </p>
          <a
            href="#accueil"
            aria-label="Retour en haut de page"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-line-dark transition-colors duration-300 hover:border-paper cursor-pointer"
          >
            <ArrowUp size={18} weight="light" />
          </a>
        </div>
      </div>
    </footer>
  );
}
