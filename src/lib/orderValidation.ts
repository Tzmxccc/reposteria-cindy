import { products } from "@/data/products";
import type { CartItem } from "@/types/cart";

export type PickupValidationResult = {
  valid: boolean;
  message: string;
  minimumLeadTimeHours: number;
};

export function getMinimumLeadTime(
  items: CartItem[]
): number {
  return items.reduce((longest, item) => {
    const product = products.find(
      (product) => product.id === item.productId
    );

    return Math.max(
      longest,
      product?.minimumLeadTimeHours ?? 0
    );
  }, 0);
}

export function validatePickupDate(
  date: string,
  time: string,
  items: CartItem[]
): PickupValidationResult {
  const minimumLeadTimeHours = getMinimumLeadTime(items);

  if (!date || !time) {
    return {
      valid: false,
      message: "Selecciona una fecha y hora de recogida.",
      minimumLeadTimeHours,
    };
  }

  const requestedDate = new Date(`${date}T${time}:00`);

  if (Number.isNaN(requestedDate.getTime())) {
    return {
      valid: false,
      message: "La fecha u hora seleccionada no es válida.",
      minimumLeadTimeHours,
    };
  }

  const now = new Date();

  if (requestedDate <= now) {
    return {
      valid: false,
      message: "La fecha y hora deben ser posteriores al momento actual.",
      minimumLeadTimeHours,
    };
  }

  const minimumDate = new Date(
    now.getTime() + minimumLeadTimeHours * 60 * 60 * 1000
  );

  if (requestedDate < minimumDate) {
    return {
      valid: false,
      message: `Tu pedido requiere al menos ${minimumLeadTimeHours} horas de anticipación. Selecciona una fecha y hora posteriores.`,
      minimumLeadTimeHours,
    };
  }

  return {
    valid: true,
    message: "La fecha cumple con la anticipación mínima.",
    minimumLeadTimeHours,
  };
}