"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import type { CartItem } from "@/types/cart";

type CartContextType = {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (
    cartItemId: string,
    quantity: number
  ) => void;
  clearCart: () => void;
};

const STORAGE_KEY = "reposteria-cindy-cart";

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const item = value as Partial<CartItem>;

  return (
    typeof item.cartItemId === "string" &&
    typeof item.productId === "string" &&
    typeof item.productName === "string" &&
    (item.productImage === null ||
      typeof item.productImage === "string") &&
    (item.sizeId === null ||
      typeof item.sizeId === "string") &&
    (item.sizeName === null ||
      typeof item.sizeName === "string") &&
    Array.isArray(item.selectedOptions) &&
    item.selectedOptions.every(
      (option) =>
        option !== null &&
        typeof option === "object" &&
        typeof option.optionId === "string" &&
        typeof option.optionName === "string" &&
        typeof option.choice === "string"
    ) &&
    typeof item.specialInstructions === "string" &&
    Number.isSafeInteger(item.quantity) &&
    item.quantity! > 0 &&
    typeof item.unitPrice === "number" &&
    Number.isFinite(item.unitPrice) &&
    item.unitPrice >= 0
  );
}

function loadCart(): CartItem[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed: unknown = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isCartItem);
  } catch {
    return [];
  }
}

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setItems(loadCart());
    setLoaded(true);
  }, []);

  useEffect(() => {
  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== STORAGE_KEY) {
      return;
    }

    setItems(loadCart());
  };

  window.addEventListener("storage", handleStorageChange);

  return () => {
    window.removeEventListener("storage", handleStorageChange);
  };
}, []);

  useEffect(() => {
    if (!loaded) {
      return;
    }

    try {  
        
const serializedCart = JSON.stringify(items);

if (localStorage.getItem(STORAGE_KEY) !== serializedCart) {
  localStorage.setItem(STORAGE_KEY, serializedCart);
}
    } catch {
      // El carrito seguirá funcionando durante la sesión.
    }
  }, [items, loaded]);

  const addItem = useCallback((newItem: CartItem) => {
    setItems((previous) => {
      const existing = previous.find(
        (item) => item.cartItemId === newItem.cartItemId
      );

      if (existing) {
        return previous.map((item) =>
          item.cartItemId === newItem.cartItemId
            ? {
                ...item,
                quantity: item.quantity + newItem.quantity,
              }
            : item
        );
      }

      return [...previous, newItem];
    });
  }, []);

  const removeItem = useCallback((cartItemId: string) => {
    setItems((previous) =>
      previous.filter(
        (item) => item.cartItemId !== cartItemId
      )
    );
  }, []);

  const updateQuantity = useCallback(
    (cartItemId: string, quantity: number) => {
      if (!Number.isSafeInteger(quantity)) {
        return;
      }

      if (quantity <= 0) {
        removeItem(cartItemId);
        return;
      }

      setItems((previous) =>
        previous.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity }
            : item
        )
      );
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const itemCount = items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const subtotal = items.reduce(
    (total, item) =>
      total + item.quantity * item.unitPrice,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart debe utilizarse dentro de CartProvider"
    );
  }

  return context;
}