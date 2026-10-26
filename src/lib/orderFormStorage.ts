
const ORDER_FORM_STORAGE_KEY = "reposteria-cindy-order-form";

export function saveOrderForm(form: unknown): void {
  try {
    sessionStorage.setItem(
      ORDER_FORM_STORAGE_KEY,
      JSON.stringify(form)
    );
  } catch {
    // El formulario seguirá funcionando sin almacenamiento.
  }
}

export function clearSavedOrderForm(): void {
  try {
    sessionStorage.removeItem(ORDER_FORM_STORAGE_KEY);
  } catch {
    // No interrumpir el funcionamiento del formulario.
  }
}


import type { OrderRequest } from "@/types/order";

export function loadSavedOrderForm(): OrderRequest | null {
  try {
    const stored = sessionStorage.getItem(
      ORDER_FORM_STORAGE_KEY
    );

    if (!stored) {
      return null;
    }

    const parsed: unknown = JSON.parse(stored);

    if (
      typeof parsed !== "object" ||
      parsed === null ||
      !("customer" in parsed) ||
      !("pickup" in parsed) ||
      !("paymentMethod" in parsed) ||
      !("notes" in parsed)
    ) {
      return null;
    }

    const data = parsed as Record<string, unknown>;
    const customer = data.customer;
    const pickup = data.pickup;

    if (
      typeof customer !== "object" ||
      customer === null ||
      !("name" in customer) ||
      !("phone" in customer) ||
      typeof customer.name !== "string" ||
      typeof customer.phone !== "string" ||
      typeof pickup !== "object" ||
      pickup === null ||
      !("requestedDate" in pickup) ||
      !("requestedTime" in pickup) ||
      typeof pickup.requestedDate !== "string" ||
      typeof pickup.requestedTime !== "string" ||
      (data.paymentMethod !== "cash" &&
        data.paymentMethod !== "bank_transfer") ||
      typeof data.notes !== "string"
    ) {
      return null;
    }

    return {
      customer: {
        name: customer.name,
        phone: customer.phone,
      },
      pickup: {
        requestedDate: pickup.requestedDate,
        requestedTime: pickup.requestedTime,
      },
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    };
  } catch {
    return null;
  }
}
