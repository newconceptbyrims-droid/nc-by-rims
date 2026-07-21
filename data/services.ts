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
      { name: "Soin", price: "à partir de 55€" },
      { name: "Soin repousse cheveux (fait maison)", price: "à partir de 65€" },
      { name: "Soin + coupe pointes", price: "à partir de 60€" },
      {
        name: "Soin (sur cheveux naturels) + coupe pointes ou carré",
        price: "à partir de 75€",
      },
      {
        name: "Soin + création coupe courte (cheveux naturels)",
        price: "à partir de 55€",
      },
    ],
  },
  {
    id: "defrisage",
    label: "Défrisage",
    items: [
      { name: "Défrisage + coupe (1ère fois)", price: "à partir de 140€" },
      { name: "Défrisage", price: "à partir de 70€" },
      { name: "Défrisage complet", price: "à partir de 100€" },
      { name: "Retouche défrisage « côté + nuque »", price: "à partir de 50€" },
    ],
  },
  {
    id: "tissages",
    label: "Tissages / Tresses",
    items: [
      { name: "Tissage ouvert", price: "à partir de 70€" },
      { name: "Tissage lace frontale", price: "à partir de 130€" },
      { name: "Tissage à 360°", price: "à partir de 140€" },
      { name: "Tissage closure", price: "à partir de 80€" },
      { name: "Pose perruque", price: "à partir de 50€" },
      { name: "Pose perruque extérieure", price: "à partir de 80€" },
      { name: "Perruque closure", price: "à partir de 80€" },
      { name: "Tissage court classique", price: "à partir de 75€" },
      { name: "Tissage court moderne", price: "à partir de 85€" },
      { name: "Nattes collées", price: "à partir de 30€" },
      { name: "Tresses", price: "à partir de 60€" },
    ],
  },
  {
    id: "coloration",
    label: "Coloration",
    items: [
      { name: "Coupe pointe", price: "à partir de 10€" },
      {
        name: "Défrisage entier + coloration + 1ère coupe courte",
        price: "à partir de 170€",
      },
      { name: "Coloration cheveux mi-longs", price: "à partir de 85€" },
      { name: "Mèches cheveux mi-longs", price: "à partir de 50€" },
      { name: "Mèches cheveux longs", price: "à partir de 80€" },
    ],
  },
];
