import type { Metadata, Viewport } from "next";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";
import { IntlStoreProvider } from "@/components/IntlStoreProvider";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "D'OUTRO LADO",
    template: "%s | D'OUTRO LADO"
  },
  description: "E-commerce premium internacional de produtos brasileiros sofisticados, com varejo, atacado e importador em uma operação única.",
  applicationName: "D'OUTRO LADO",
  openGraph: {
    title: "D'OUTRO LADO",
    description: "Produtos brasileiros sofisticados para varejo internacional, atacado e importação premium.",
    url: siteUrl,
    siteName: "D'OUTRO LADO",
    locale: "pt_BR",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "D'OUTRO LADO",
    description: "Produtos brasileiros sofisticados para o mundo."
  },
  icons: {
    icon: "/favicon.ico"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#060606"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <body>
        <IntlStoreProvider>
          <CartProvider>{children}</CartProvider>
        </IntlStoreProvider>
      </body>
    </html>
  );
}
