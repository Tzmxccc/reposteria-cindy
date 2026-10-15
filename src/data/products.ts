export type Product = {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number | null;
  customizable: boolean;
  available: boolean;
  emoji: string;
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
    name: "Torta de chocolate",
    description: "Bizcocho de chocolate con relleno cremoso.",
    category: "Tortas de cumpleaños",
    price: 650,
    customizable: true,
    available: true,
    emoji: "🎂",
  },
  {
    id: "2",
    name: "Torta personalizada",
    description: "Diseñada especialmente para tu celebración.",
    category: "Tortas personalizadas",
    price: null,
    customizable: true,
    available: true,
    emoji: "🎨",
  },
  {
    id: "3",
    name: "Porción de cheesecake",
    description: "Suave cheesecake con cobertura de frutas.",
    category: "Postres y porciones",
    price: 85,
    customizable: false,
    available: true,
    emoji: "🍰",
  },
  {
    id: "4",
    name: "Caja de cupcakes",
    description: "Cupcakes decorados para compartir.",
    category: "Cupcakes y galletas",
    price: 180,
    customizable: true,
    available: true,
    emoji: "🧁",
  },
  {
    id: "5",
    name: "Pan dulce artesanal",
    description: "Pan recién preparado con sabor casero.",
    category: "Panadería",
    price: 25,
    customizable: false,
    available: true,
    emoji: "🥐",
  },
  {
    id: "6",
    name: "Galletas decoradas",
    description: "Galletas especiales para regalar.",
    category: "Cupcakes y galletas",
    price: null,
    customizable: true,
    available: false,
    emoji: "🍪",
  },
  {
    id: "7",
    name: "Caja de regalo dulce",
    description: "Selección de delicias para ocasiones especiales.",
    category: "Otros productos",
    price: null,
    customizable: true,
    available: true,
    emoji: "🎁",
  },
  {
    id: "8",
    name: "Café",
    description: "Una bebida caliente para acompañar tu postre.",
    category: "Bebidas",
    price: 35,
    customizable: false,
    available: true,
    emoji: "☕",
  },
];