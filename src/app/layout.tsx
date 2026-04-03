import "./globals.css";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/CartContext";
import { IntlStoreProvider } from "@/components/IntlStoreProvider";
import { Navbar } from "@/components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body>
        <IntlStoreProvider>
          <AuthProvider>
            <CartProvider>
              <Navbar />
              {children}
            </CartProvider>
          </AuthProvider>
        </IntlStoreProvider>
      </body>
    </html>
  );
}