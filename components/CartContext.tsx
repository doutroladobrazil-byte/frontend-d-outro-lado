"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  id: string;
  productId: number;
  slug?: string;
  name: string;
  priceBRL: number;
  priceLocal?: number;
  currency?: string;
  image: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalBRL: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const raw = localStorage.getItem("doutro-lado-cart");
    if (raw) setItems(JSON.parse(raw));
  }, []);

  useEffect(() => {
    localStorage.setItem("doutro-lado-cart", JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => ({
    items,
    addItem: (item) => {
      setItems((current) => {
        const existing = current.find((cartItem) => cartItem.id === item.id);
        if (existing) {
          return current.map((cartItem) =>
            cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
          );
        }
        return [...current, { ...item, quantity: 1 }];
      });
    },
    removeItem: (id) => setItems((current) => current.filter((item) => item.id !== id)),
    clearCart: () => setItems([]),
    totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
    totalBRL: items.reduce((sum, item) => sum + item.priceBRL * item.quantity, 0)
  }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
