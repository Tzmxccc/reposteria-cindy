
import { createHash } from "node:crypto";

import type { CartItem } from "@/types/cart";
import type { CreateOrderRequest } from "@/types/orderRequest";

type OrderContent = Omit<CreateOrderRequest, "requestId" | "items"> & {
  items: CartItem[];
};

export function createOrderFingerprint(
  order: OrderContent
): string {
  const normalized = {
    customerName: order.customerName,
    customerPhone: order.customerPhone,
    requestedPickupDate: order.requestedPickupDate,
    requestedPickupTime: order.requestedPickupTime,
    paymentMethod: order.paymentMethod,
    notes: order.notes,
    items: order.items.map((item) => ({
      productId: item.productId,
      sizeId: item.sizeId,
      selectedOptions: item.selectedOptions.map((option) => ({
        optionId: option.optionId,
        choice: option.choice,
      })),
      specialInstructions: item.specialInstructions,
      quantity: item.quantity,
    })),
  };

  return createHash("sha256")
    .update(JSON.stringify(normalized))
    .digest("hex");
}
