import type { CartItem } from "@/types/cart";

export type PaymentMethod =
  | "cash"
  | "bank_transfer";

export type OrderStatus =
  | "pending_review"
  | "waiting_deposit"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "delivered"
  | "cancelled";

export type OrderCustomer = {
  name: string;
  phone: string;
};

export type OrderPickup = {
  requestedDate: string;
  requestedTime: string;
};

export type OrderRequest = {
  customer: OrderCustomer;
  pickup: OrderPickup;
  paymentMethod: PaymentMethod;
  notes: string;
};

export type Order = {
  id: string;
  customer: OrderCustomer;
  pickup: OrderPickup;
  paymentMethod: PaymentMethod;
  notes: string;

  items: CartItem[];
  subtotal: number;

  status: OrderStatus;
  createdAt: string;
};