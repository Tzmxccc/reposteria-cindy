import type { CartItem } from "@/types/cart";
import type { PaymentMethod } from "@/types/order";

export type FirestoreOrderStatus =
  | "pending_review"
  | "waiting_deposit"
  | "confirmed"
  | "preparing"
  | "ready_for_pickup"
  | "delivered"
  | "cancelled";

export type FirestoreOrder = {
  customerName: string;
  customerPhone: string;

  requestedPickupDate: string;
  requestedPickupTime: string;

  paymentMethod: PaymentMethod;

  notes: string;

  items: CartItem[];

  subtotal: number;

  status: FirestoreOrderStatus;

  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
};