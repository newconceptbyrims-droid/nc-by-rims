export const site = {
  name: "New Concept by Rims",
  shortName: "NC by Rims",
  tagline: "Coiffure, tissages & couleur — Paris 17e",
  phone: "+33 1 53 81 41 17",
  phoneHref: "tel:+33153814117",
  address: {
    line1: "89 avenue des Ternes",
    line2: "75017 Paris",
    full: "89 avenue des Ternes, 75017 Paris",
  },
  hours: [
    { days: "Lundi", hours: "Fermé" },
    { days: "Mardi — Samedi", hours: "10h – 19h" },
    { days: "Dimanche", hours: "Fermé" },
  ],
  instagram: {
    handle: "@newconceptbyrims",
    url: "https://www.instagram.com/newconceptbyrims",
  },
  googleReviewsUrl:
    "https://www.google.com/search?hl=fr-FR&q=avis+sur+new+concept+by+rims",
  // TODO client: remplacer par le vrai lien "Obtenir plus d'avis" de la fiche
  // Google Business (format g.page/r/XXXXXXX/review), sinon les liens étoiles
  // de l'email d'avis post-visite ne fonctionneront pas.
  googleReviewLeaveUrl: "https://g.page/r/REPLACE_WITH_REAL_CODE/review",
  mapsEmbedSrc:
    "https://www.google.com/maps?q=89+avenue+des+Ternes,+75017+Paris&output=embed",
  mapsDirectionsUrl:
    "https://maps.google.com/?q=89+avenue+des+Ternes+75017+Paris",
};
