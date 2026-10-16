export type CartItemOption = {
  optionId: string;
  optionName: string;
  choice: string;
};

export type CartItem = {
  // Identificador único del artículo dentro del carrito
  cartItemId: string;

  // Producto original
  productId: string;
  productName: string;
  productImage: string | null;

  // Tamaño seleccionado, si corresponde
  sizeId: string | null;
  sizeName: string | null;

  // Personalización
  selectedOptions: CartItemOption[];
  specialInstructions: string;

  // Cantidad y precio
  quantity: number;
  unitPrice: number;
};

export type Cart = {
  items: CartItem[];
};