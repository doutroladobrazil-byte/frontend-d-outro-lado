"use client";

import { useEffect, useMemo, useState } from "react";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  image: string;
  price: number; // preço base em BRL
  quantity: number;
};

const STORAGE_KEY = "doutro-lado-cart";

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        setItems(JSON.parse(stored));
      } catch {
        setItems([]);
      }
    }

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items, loaded]);

  function addItem(product: CartItem) {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        );
      }

      return [...prev, product];
    });
  }

  function removeItem(id: string) {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }

  function updateQuantity(id: string, quantity: number) {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  }

  function clearCart() {
    setItems([]);
  }

  const subtotal = useMemo(
    () => items.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [items]
  );

  const freight = subtotal * 0.15;
  const tax = subtotal * 0.1;
  const margin = subtotal * 0.6;
  const total = subtotal + freight + tax + margin;

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    subtotal,
    freight,
    tax,
    margin,
    total,
  };
}