import { products } from "@/data/products";

import type { CartItem } from "@/types/cart";
import type { OrderRequestItem } from "@/types/orderRequest";

type ValidationResult =
  | {
      success: true;
      items: CartItem[];
      subtotal: number;
    }
  | {
      success: false;
      error: string;
    };

export function validateOrderItems(
  requestedItems: OrderRequestItem[]
): ValidationResult {
  if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
    return {
      success: false,
      error: "El pedido debe contener al menos un producto.",
    };
  }

  if (requestedItems.length > 30) {
    return {
      success: false,
      error: "El pedido contiene demasiados productos.",
    };
  }

  const validatedItems: CartItem[] = [];

  for (const item of requestedItems) {
    if (
      !item ||
      typeof item.productId !== "string" ||
      !Number.isSafeInteger(item.quantity) ||
      item.quantity < 1 ||
      item.quantity > 100
    ) {
      return {
        success: false,
        error: "Uno de los productos contiene datos inválidos.",
      };
    }

    const product = products.find(
      (candidate) => candidate.id === item.productId
    );

    if (!product || !product.available) {
      return {
        success: false,
        error: "Uno de los productos no está disponible.",
      };
    }

    if (product.price === null) {
      return {
        success: false,
        error:
          "Los productos por cotización deben solicitarse por separado.",
      };
    }

    if (!Array.isArray(item.selectedOptions)) {
      return {
        success: false,
        error: "Las opciones del producto no son válidas.",
      };
    }

    if (
      typeof item.specialInstructions !== "string" ||
      item.specialInstructions.length > 1000
    ) {
      return {
        success: false,
        error: "Las instrucciones especiales no son válidas.",
      };
    }

    if (
      item.sizeId !== null &&
      typeof item.sizeId !== "string"
    ) {
      return {
        success: false,
        error: "El tamaño seleccionado no es válido.",
      };
    }

    const selectedSize = product.sizes.find(
      (size) => size.id === item.sizeId
    );

    if (product.sizes.length > 0 && !selectedSize) {
      return {
        success: false,
        error: `Selecciona un tamaño válido para ${product.name}.`,
      };
    }

    if (product.sizes.length === 0 && item.sizeId !== null) {
      return {
        success: false,
        error: `El producto ${product.name} no admite tamaños.`,
      };
    }

    const selectedOptions: CartItem["selectedOptions"] = [];
    const usedOptionIds = new Set<string>();

    for (const requestedOption of item.selectedOptions) {
      if (
        !requestedOption ||
        typeof requestedOption.optionId !== "string" ||
        typeof requestedOption.choice !== "string" ||
        usedOptionIds.has(requestedOption.optionId)
      ) {
        return {
          success: false,
          error: "Una opción de personalización no es válida.",
        };
      }

      const productOption = product.options.find(
        (option) => option.id === requestedOption.optionId
      );

      if (
        !productOption ||
        !productOption.choices.includes(requestedOption.choice)
      ) {
        return {
          success: false,
          error: `Una opción seleccionada para ${product.name} no es válida.`,
        };
      }

      usedOptionIds.add(requestedOption.optionId);

      selectedOptions.push({
        optionId: productOption.id,
        optionName: productOption.name,
        choice: requestedOption.choice,
      });
    }

    const unitPrice = selectedSize
      ? selectedSize.price
      : product.price;

    if (!Number.isFinite(unitPrice) || unitPrice < 0) {
      return {
        success: false,
        error: "No se pudo determinar el precio del producto.",
      };
    }

    validatedItems.push({
      cartItemId: crypto.randomUUID(),
      productId: product.id,
      productName: product.name,
      productImage: product.images[0] ?? null,
      sizeId: selectedSize?.id ?? null,
      sizeName: selectedSize?.name ?? null,
      selectedOptions,
      specialInstructions: item.specialInstructions,
      quantity: item.quantity,
      unitPrice,
    });
  }

  const subtotal = validatedItems.reduce(
    (total, item) => total + item.unitPrice * item.quantity,
    0
  );

  if (!Number.isSafeInteger(subtotal) || subtotal < 0) {
    return {
      success: false,
      error: "No se pudo calcular el subtotal.",
    };
  }

  return {
    success: true,
    items: validatedItems,
    subtotal,
  };
}