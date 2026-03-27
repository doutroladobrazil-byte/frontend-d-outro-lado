"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";
import { getAllCategories } from "@/data/categoryData";
import { useCart } from "@/components/CartContext";
import { useIntlStore } from "@/components/IntlStoreProvider";

const REGIONS = ["Europe", "France", "Italy", "Germany", "Switzerland"];

function formatCategoryLabel(slug: string) {
  return slug
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  const categories = getAllCategories();
  const { itemCount } = useCart();
  const { locale, setLocale, region, setRegion, currency } = useIntlStore();

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen, searchOpen]);

  return (
    <header className="w-full border-b border-white/10 bg-black text-white">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="p-2 transition hover:opacity-70"
          aria-label="Abrir menu"
        >
          <Menu size={20} />
        </button>

        <Link
          href="/"
          className="text-[18px] font-light tracking-[0.35em]"
          style={{ fontFamily: "serif" }}
        >
          D&apos;OUTRO LADO
        </Link>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            className="p-2 transition hover:opacity-70"
            aria-label="Abrir busca"
          >
            <Search size={20} />
          </button>

          <Link
            href="/login"
            className="p-2 transition hover:opacity-70"
            aria-label="Entrar"
          >
            <User size={20} />
          </Link>

          <Link
            href="/bag"
            className="relative p-2 transition hover:opacity-70"
            aria-label="Sacola"
          >
            <ShoppingBag size={20} />

            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1 text-[10px] font-medium text-black">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 p-6 text-white">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg tracking-[0.2em]">MENU</h2>
            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              aria-label="Fechar menu"
            >
              <X size={24} />
            </button>
          </div>

          <nav className="flex flex-col gap-6 text-lg">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/produtos/${cat.slug}`}
                onClick={() => setMenuOpen(false)}
              >
                {formatCategoryLabel(cat.slug)}
              </Link>
            ))}
          </nav>

          <div className="mt-10">
            <p className="mb-2 text-sm opacity-60">Região</p>
            <div className="flex flex-wrap gap-2">
              {REGIONS.map((r) => (
                <button
                  key={r}
                  type="button"
                  onClick={() => setRegion(r)}
                  className={`px-3 py-1 border transition ${
                    region === r
                      ? "border-white bg-white text-black"
                      : "border-white/30 text-white"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-6">
            <p className="mb-2 text-sm opacity-60">Idioma</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setLocale("pt")}
                className={`px-3 py-1 border transition ${
                  locale === "pt"
                    ? "border-white bg-white text-black"
                    : "border-white/30 text-white"
                }`}
              >
                PT
              </button>

              <button
                type="button"
                onClick={() => setLocale("en")}
                className={`px-3 py-1 border transition ${
                  locale === "en"
                    ? "border-white bg-white text-black"
                    : "border-white/30 text-white"
                }`}
              >
                EN
              </button>
            </div>
          </div>

          <p className="mt-10 text-xs opacity-40">Currency: {currency}</p>
        </div>
      )}

      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 p-6 text-white">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-lg tracking-[0.2em]">SEARCH</h2>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              aria-label="Fechar busca"
            >
              <X size={24} />
            </button>
          </div>

          <input
            type="text"
            placeholder="Buscar produtos..."
            className="w-full border-b border-white/30 bg-transparent py-2 outline-none placeholder:text-white/40"
          />
        </div>
      )}
    </header>
  );
}