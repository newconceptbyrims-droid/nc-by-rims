import type { Metadata } from "next";
import { Inter, Jost } from "next/font/google";
import localFont from "next/font/local";
import MotionProvider from "@/components/MotionProvider";
import "./globals.css";

// Inter Display — official OFL-licensed webfonts, self-hosted from rsms.me/inter.
const interDisplay = localFont({
  variable: "--font-inter-display",
  display: "swap",
  src: [
    {
      path: "../fonts/interdisplay/InterDisplay-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/interdisplay/InterDisplay-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../fonts/interdisplay/InterDisplay-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/interdisplay/InterDisplay-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../fonts/interdisplay/InterDisplay-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../fonts/interdisplay/InterDisplay-Black.woff2",
      weight: "900",
      style: "normal",
    },
  ],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

// ITC Avant Garde Gothic is a licensed commercial font (Monotype/ITC) and can't be
// bundled without a license. Jost is the closest free geometric-sans equivalent.
const jost = Jost({
  variable: "--font-jost",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

const siteUrl = "https://newconceptbyrims.fr";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "New Concept by Rims — Salon de coiffure, Paris 17e",
  description:
    "Salon de coiffure New Concept by Rims (NC by Rims) à Paris, avenue des Ternes. Soins, défrisage, tissages, tresses et coloration. Ouvert du mardi au samedi.",
  keywords: [
    "salon de coiffure Paris",
    "New Concept by Rims",
    "coiffure afro Paris",
    "tissage tresses Paris",
    "défrisage Paris 17",
  ],
  openGraph: {
    title: "New Concept by Rims — Salon de coiffure, Paris 17e",
    description:
      "Soins, défrisage, tissages, tresses et coloration. 89 avenue des Ternes, 75017 Paris.",
    url: siteUrl,
    siteName: "New Concept by Rims",
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={`${interDisplay.variable} ${inter.variable} ${jost.variable}`}>
      <body className="bg-paper text-ink antialiased">
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
