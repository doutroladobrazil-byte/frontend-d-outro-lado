"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/components/CartContext";
import { IntlStoreProvider } from "@/components/IntlStoreProvider";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return (
    <IntlStoreProvider>
      <CartProvider>{children}</CartProvider>
    </IntlStoreProvider>
  );
}