export type ServiceItem = {
  name: string;
  price?: string;
};

export type ServiceCategory = {
  id: string;
  label: string;
  note?: string;
  items: ServiceItem[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: "soins",
    label: "Soins",
    items: [
      { name: "Soin", price: "55€" },
      { name: "Soin repousse cheveux (fait maison)", price: "65€" },
      { name: "Soin + coupe pointes", price: "60€" },
      {
        name: "Soin (sur cheveux naturels) + coupe pointes ou carré",
        price: "75€",
      },
      { name: "Texture release cheveux longs", price: "190€" },
      { name: "Texture release cheveux courts", price: "160€" },
      {
        name: "Soin + création coupe courte (cheveux naturels)",
        price: "55€",
      },
    ],
  },
  {
    id: "defrisage",
    label: "Défrisage",
    items: [
      { name: "Défrisage + coupe (1ère fois)", price: "140€" },
      { name: "Défrisage", price: "70€" },
      { name: "Défrisage complet", price: "100€" },
      { name: "Retouche défrisage « côté + nuque »", price: "50€" },
    ],
  },
  {
    id: "tissages",
    label: "Tissages / Tresses",
    items: [
      { name: "Tissage ouvert", price: "70€" },
      { name: "Tissage lace frontale", price: "130€" },
      { name: "Tissage à 360°", price: "140€" },
      { name: "Tissage closure", price: "80€" },
      { name: "Pose perruque", price: "50€" },
      { name: "Pose perruque extérieure", price: "80€" },
      { name: "Perruque closure", price: "80€" },
      { name: "Tissage court classique", price: "75€" },
      { name: "Tissage court moderne", price: "85€" },
      { name: "Nattes collées", price: "de 30€ à 90€" },
      { name: "Tresses", price: "de 60€ à 120€" },
    ],
  },
  {
    id: "coloration",
    label: "Coloration",
    items: [
      { name: "Coupe pointe", price: "10€" },
      {
        name: "Défrisage entier + coloration + 1ère coupe courte",
        price: "170€",
      },
      { name: "Coloration cheveux mi-longs", price: "85€" },
      { name: "Mèches cheveux mi-longs", price: "50€" },
      { name: "Mèches cheveux longs", price: "80€" },
    ],
  },
];
