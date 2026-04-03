"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItem = {
  id: string;
  productId: number;
  slug: string;
  name: string;
  priceBRL: number;
  priceLocal: number;
  currency: string;
  image: string;
  weightRange?: string;
  quantity: number;
};

type AddCartItemPayload = Omit<CartItem, "quantity">;

type CartContextValue = {
  items: CartItem[];
  totalItems: number;
  totalBRL: number;
  addItem: (item: AddCartItemPayload) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  increaseItem: (id: string) => void;
  decreaseItem: (id: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const STORAGE_KEY = "doutro-lado-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);

      if (!raw) {
        setHydrated(true);
        return;
      }

      const parsed = JSON.parse(raw) as CartItem[];

      if (Array.isArray(parsed)) {
        setItems(parsed);
      }
    } catch {
      // ignore storage parse issues
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, hydrated]);

  function addItem(item: AddCartItemPayload) {
    setItems((current) => {
      const existing = current.find(
        (entry) =>
          entry.productId === item.productId &&
          entry.priceBRL === item.priceBRL &&
          entry.weightRange === item.weightRange
      );

      if (existing) {
        return current.map((entry) =>
          entry.id === existing.id
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  }

  function removeItem(id: string) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  function clearCart() {
    setItems([]);
  }

  function increaseItem(id: string) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseItem(id: string) {
    setItems((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, quantity: Math.max(0, item.quantity - 1) }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }

  const value = useMemo<CartContextValue>(() => {
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const totalBRL = items.reduce(
      (acc, item) => acc + item.priceBRL * item.quantity,
      0
    );

    return {
      items,
      totalItems,
      totalBRL,
      addItem,
      removeItem,
      clearCart,
      increaseItem,
      decreaseItem,
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart deve ser usado dentro de CartProvider.");
  }

  return context;
}