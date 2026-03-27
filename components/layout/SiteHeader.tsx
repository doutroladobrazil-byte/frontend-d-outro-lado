"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useState } from "react";

type MenuItem = {
  label: string;
  href: string;
};

const menuItems: MenuItem[] = [
  { label: "Início", href: "/" },
  { label: "Moda, Estilo e Acessórios", href: "/produtos/moda-estilo-e-acessorios" },
  { label: "Casa e Decoração", href: "/produtos/casa-e-decoracao" },
  { label: "Sobre", href: "/sobre" },
  { label: "Contato", href: "/contato" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="site-header">
        <div className="site-header__inner">
          <div className="site-header__left">
            <button
              type="button"
              className="site-header__icon-button"
              aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

          <div className="site-header__center">
            <Link href="/" className="site-header__brand">
              D&apos;OUTRO LADO
            </Link>
          </div>

          <div className="site-header__right">
            <Link
              href="/search"
              className="site-header__icon-button"
              aria-label="Buscar produtos"
            >
              <Search size={19} />
            </Link>

            <Link
              href="/login"
              className="site-header__icon-button"
              aria-label="Entrar na conta"
            >
              <User size={19} />
            </Link>

            <Link
              href="/bag"
              className="site-header__icon-button"
              aria-label="Abrir bag"
            >
              <ShoppingBag size={19} />
            </Link>
          </div>
        </div>
      </header>

      <aside className={`drawer-overlay ${menuOpen ? "is-open" : ""}`}>
        <div className={`drawer-panel ${menuOpen ? "is-open" : ""}`}>
          <div className="drawer-panel__top">
            <p className="drawer-panel__eyebrow">Navegação</p>
            <button
              type="button"
              className="site-header__icon-button"
              aria-label="Fechar menu lateral"
              onClick={() => setMenuOpen(false)}
            >
              <X size={20} />
            </button>
          </div>

          <nav className="drawer-panel__nav">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="drawer-panel__link"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="drawer-panel__footer">
            <Link href="/search" onClick={() => setMenuOpen(false)}>
              Buscar produtos
            </Link>
            <Link href="/login" onClick={() => setMenuOpen(false)}>
              Minha conta
            </Link>
            <Link href="/bag" onClick={() => setMenuOpen(false)}>
              Minha bag
            </Link>
          </div>
        </div>

        <button
          type="button"
          className="drawer-backdrop"
          aria-label="Fechar menu"
          onClick={() => setMenuOpen(false)}
        />
      </aside>
    </>
  );
}