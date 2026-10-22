export type OrderRequestItem = {
  productId: string;
  sizeId: string | null;
  selectedOptions: {
    optionId: string;
    choice: string;
  }[];
  specialInstructions: string;
  quantity: number;
};

export type CreateOrderRequest = {
  customerName: string;
  customerPhone: string;
  requestedPickupDate: string;
  requestedPickupTime: string;
  paymentMethod: "cash" | "bank_transfer";
  notes: string;
  items: OrderRequestItem[];
  requestId: string;
};