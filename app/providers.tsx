import type { Metadata } from "next";
import "./globals.css";
import Providers from "./providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "D'OUTRO LADO",
  description: "Curadoria premium de peças brasileiras",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}