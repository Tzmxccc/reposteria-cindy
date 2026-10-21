import { products } from "@/data/products";

import type { CartItem } from "@/types/cart";
import type { CreateOrderRequest } from "@/types/orderRequest";

type ValidatedCustomerData = Omit<CreateOrderRequest, "items">;

type ValidationResult =
  | {
      success: true;
      data: ValidatedCustomerData;
    }
  | {
      success: false;
      error: string;
    };

export function validateOrderRequest(
  request: CreateOrderRequest,
  validatedItems: CartItem[]
): ValidationResult {
  if (!request || typeof request !== "object") {
    return {
      success: false,
      error: "La solicitud no es válida.",
    };
  }

  if (
    typeof request.customerName !== "string" ||
    request.customerName.trim().length < 2 ||
    request.customerName.trim().length > 100
  ) {
    return {
      success: false,
      error: "Ingresa un nombre válido de 2 a 100 caracteres.",
    };
  }

  if (
    typeof request.customerPhone !== "string" ||
    !/^\+?[\d\s()-]{8,25}$/.test(request.customerPhone.trim())
  ) {
    return {
      success: false,
      error: "Ingresa un número de teléfono válido.",
    };
  }

  if (
    request.paymentMethod !== "cash" &&
    request.paymentMethod !== "bank_transfer"
  ) {
    return {
      success: false,
      error: "Selecciona un método de pago válido.",
    };
  }

  if (
    typeof request.notes !== "string" ||
    request.notes.length > 2000
  ) {
    return {
      success: false,
      error: "Las notas del pedido no son válidas.",
    };
  }

  const date = request.requestedPickupDate;
  const time = request.requestedPickupTime;

  if (
    typeof date !== "string" ||
    typeof time !== "string" ||
    !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
    !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)
  ) {
    return {
      success: false,
      error: "Selecciona una fecha y hora válidas.",
    };
  }

  const [year, month, day] = date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);

  // Las fechas se interpretan en la zona horaria de Honduras (UTC-6).
  const pickupTimestamp = Date.UTC(
    year,
    month - 1,
    day,
    hour + 6,
    minute
  );

  const pickupDate = new Date(pickupTimestamp);

  // Comprobar que la fecha exista realmente.
  const reconstructedDate = new Date(
    pickupTimestamp - 6 * 60 * 60 * 1000
  );

  if (
    reconstructedDate.getUTCFullYear() !== year ||
    reconstructedDate.getUTCMonth() !== month - 1 ||
    reconstructedDate.getUTCDate() !== day
  ) {
    return {
      success: false,
      error: "La fecha de recogida no existe.",
    };
  }

  if (pickupDate.getTime() <= Date.now()) {
    return {
      success: false,
      error: "La fecha de recogida debe ser futura.",
    };
  }

  const minimumLeadTimeHours = Math.max(
    0,
    ...validatedItems.map((item) => {
      const product = products.find(
        (candidate) => candidate.id === item.productId
      );

      return product?.minimumLeadTimeHours ?? 0;
    })
  );

  const hoursUntilPickup =
    (pickupDate.getTime() - Date.now()) / (1000 * 60 * 60);

  if (hoursUntilPickup < minimumLeadTimeHours) {
    return {
      success: false,
      error: `Este pedido requiere al menos ${minimumLeadTimeHours} horas de anticipación.`,
    };
  }

  return {
    success: true,
    data: {
      customerName: request.customerName.trim(),
      customerPhone: request.customerPhone.trim(),
      requestedPickupDate: date,
      requestedPickupTime: time,
      paymentMethod: request.paymentMethod,
      notes: request.notes.trim(),
    },
  };
}