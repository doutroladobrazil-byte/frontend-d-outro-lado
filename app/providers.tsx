"use client";

import type { ReactNode } from "react";
import { CartProvider } from "@/contexts/CartContext";

type ProvidersProps = {
  children: ReactNode;
};

export default function Providers({ children }: ProvidersProps) {
  return <CartProvider>{children}</CartProvider>;
}