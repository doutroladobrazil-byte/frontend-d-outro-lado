"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import MenuDrawer from "@/components/MenuDrawer";
import { useCart } from "@/components/CartContext";

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { itemCount } = useCart();

  return (
    <>
      <header className="site-navbar">
        <div className="site-navbar__inner">
          <div className="site-navbar__left">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-label="Abrir menu"
              className="site-navbar__icon"
            >
              <Menu size={20} />
            </button>
          </div>

          <div className="site-navbar__center">
            <Link href="/" className="site-navbar__brand">
              D&apos;OUTRO LADO
            </Link>
          </div>

          <div className="site-navbar__right">
            <button
              type="button"
              aria-label="Pesquisar"
              className="site-navbar__icon"
            >
              <Search size={18} />
            </button>

            <Link
              href="/login"
              aria-label="Login"
              className="site-navbar__icon"
            >
              <User size={18} />
            </Link>

            <Link
              href="/bag"
              aria-label="Sacola"
              className="site-navbar__icon site-navbar__bag"
            >
              <ShoppingBag size={18} />
              {itemCount > 0 && (
                <span className="site-navbar__badge">{itemCount}</span>
              )}
            </Link>
          </div>
        </div>
      </header>

      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}