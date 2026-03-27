import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "../components/layout/SiteHeader";

export const metadata: Metadata = {
  title: "D'OUTRO LADO",
  description: "Curadoria premium de produtos brasileiros sofisticados.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <SiteHeader />
        <main className="page-shell">{children}</main>
      </body>
    </html>
  );
}