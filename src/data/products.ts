export type ProductSize = {
  id: string;
  name: string;
  price: number;
};

export type ProductOption = {
  id: string;
  name: string;
  choices: string[];
};

export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | null;
  customizable: boolean;
  available: boolean;
  emoji: string;

  // Campos para la página de detalle
  images: string[];
  sizes: ProductSize[];
  options: ProductOption[];
  minimumLeadTimeHours: number;
};

export const categories = [
  "Todas",
  "Tortas de cumpleaños",
  "Tortas personalizadas",
  "Postres y porciones",
  "Cupcakes y galletas",
  "Panadería",
  "Otros productos",
  "Bebidas",
];

export const products: Product[] = [
  {
    id: "1",
    name: "Torta de Quince Años",
    description:
      "Deliciosa torta de chocolate con relleno cremoso, ideal para cumpleaños y celebraciones especiales.",
    category: "Tortas de cumpleaños",
    price: 650,
    customizable: true,
    available: true,
    emoji: "🎂",
    images: [
  "/images/products/pastel-15-años.jpg",
],
    sizes: [
      { id: "small", name: "Pequeña", price: 650 },
      { id: "medium", name: "Mediana", price: 900 },
      { id: "large", name: "Grande", price: 1250 },
    ],
    options: [
      {
        id: "decoration",
        name: "Decoración",
        choices: ["Clásica", "Cumpleaños", "Especial"],
      },
    ],
    minimumLeadTimeHours: 24,
  },
  {
    id: "2",
    name: "Torta de Mariposas Personalizada",
    description:
      "Una creación especial diseñada según las preferencias y detalles de tu celebración.",
    category: "Tortas personalizadas",
    price: null,
    customizable: true,
    available: true,
    emoji: "🎨",
    images: [
  "/images/products/pastel-de-mariposas.jpg",
],
    sizes: [],
    options: [
      {
        id: "theme",
        name: "Estilo de decoración",
        choices: ["Elegante", "Infantil", "Temática", "Otro"],
      },
    ],
    minimumLeadTimeHours: 72,
  },
  {
    id: "3",
    name: "Porción de cheesecake",
    description:
      "Suave cheesecake con una deliciosa cobertura de frutas.",
    category: "Postres y porciones",
    price: 85,
    customizable: false,
    available: true,
    emoji: "🍰",
    images: [],
    sizes: [],
    options: [],
    minimumLeadTimeHours: 4,
  },
  {
    id: "4",
    name: "Caja de cupcakes",
    description:
      "Cupcakes decorados, perfectos para regalar o compartir.",
    category: "Cupcakes y galletas",
    price: 180,
    customizable: true,
    available: true,
    emoji: "🧁",
    images: [],
    sizes: [
      { id: "six", name: "6 unidades", price: 180 },
      { id: "twelve", name: "12 unidades", price: 340 },
    ],
    options: [
      {
        id: "decoration",
        name: "Decoración",
        choices: ["Clásica", "Cumpleaños", "Personalizada"],
      },
    ],
    minimumLeadTimeHours: 24,
  },
  {
    id: "5",
    name: "Pan dulce artesanal",
    description:
      "Pan dulce preparado con dedicación y sabor casero.",
    category: "Panadería",
    price: 25,
    customizable: false,
    available: true,
    emoji: "🥐",
    images: [],
    sizes: [],
    options: [],
    minimumLeadTimeHours: 2,
  },
  {
    id: "6",
    name: "Galletas decoradas",
    description:
      "Galletas con decoraciones especiales para celebraciones.",
    category: "Cupcakes y galletas",
    price: null,
    customizable: true,
    available: false,
    emoji: "🍪",
    images: [],
    sizes: [],
    options: [
      {
        id: "theme",
        name: "Temática",
        choices: ["Cumpleaños", "Infantil", "Otra"],
      },
    ],
    minimumLeadTimeHours: 48,
  },
  {
    id: "7",
    name: "Caja de regalo dulce",
    description:
      "Una selección de productos dulces para sorprender.",
    category: "Otros productos",
    price: null,
    customizable: true,
    available: true,
    emoji: "🎁",
    images: [],
    sizes: [],
    options: [],
    minimumLeadTimeHours: 24,
  },
  {
    id: "8",
    name: "Café",
    description:
      "Una bebida caliente para acompañar tus postres favoritos.",
    category: "Bebidas",
    price: 35,
    customizable: false,
    available: true,
    emoji: "☕",
    images: [],
    sizes: [],
    options: [],
    minimumLeadTimeHours: 0,
  },
];