"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useCart } from "@/components/CartContext";
import { localeLabels, type Locale } from "@/lib/i18n";
import { useIntlStore } from "@/components/IntlStoreProvider";
import { storeApi, type StoreProduct } from "@/lib/storeApi";

const REGIONS = [
  "Europe",
  "France",
  "Italy",
  "Germany",
  "Switzerland",
  "United States",
  "Brazil",
];

const MENU_LINKS = [
  { href: "/", label: "Home" },
  { href: "/produtos/moda-estilo-e-acessorios", label: "Moda" },
  { href: "/produtos/casa-e-decoracao", label: "Casa & decoração" },
  { href: "/atacado", label: "Atacado" },
  { href: "/contato", label: "Contato" },
];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<StoreProduct[]>([]);

  const { totalItems } = useCart();
  const { locale, setLocale, region, setRegion, currency } = useIntlStore();

  useEffect(() => {
    let active = true;

    storeApi
      .getFeaturedProducts(region, 8)
      .then((result) => {
        if (!active) return;
        setProducts(result);
      })
      .catch(() => {
        if (!active) return;
        setProducts([]);
      });

    return () => {
      active = false;
    };
  }, [region]);

  const suggestions = useMemo(() => {
    const source = products.length
      ? products
      : [
          {
            id: "fallback-1",
            name: "Bolsa artesanal premium",
            tag: "Moda",
            slug: "bolsa-artesanal-premium",
            image:
              "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80",
          },
          {
            id: "fallback-2",
            name: "Cerâmica autoral",
            tag: "Casa",
            slug: "ceramica-autoral",
            image:
              "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=600&q=80",
          },
          {
            id: "fallback-3",
            name: "Kit presente sofisticado",
            tag: "Presentes",
            slug: "kit-presente-sofisticado",
            image:
              "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=600&q=80",
          },
        ];

    const normalized = query.trim().toLowerCase();

    return source
      .filter((item) => {
        if (!normalized) return true;

        return (
          item.name.toLowerCase().includes(normalized) ||
          item.tag.toLowerCase().includes(normalized) ||
          item.slug.toLowerCase().includes(normalized)
        );
      })
      .slice(0, 6);
  }, [products, query]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function closeSearch() {
    setSearchOpen(false);
    setQuery("");
  }

  function handleCloseAll() {
    closeMenu();
    closeSearch();
  }

  function handleToggleSearch() {
    setSearchOpen((prev) => !prev);
    setMenuOpen(false);
  }

  useEffect(() => {
    const shouldLockScroll = menuOpen || searchOpen;
    document.body.style.overflow = shouldLockScroll ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  return (
    <>
      <div className="top-brand-bar">
        <Link href="/" className="top-brand-link" aria-label="Ir para a página inicial">
          D&apos;OUTRO LADO
        </Link>
      </div>

      <header className="site-header">
        <div className="nav-side nav-left">
          <button
            type="button"
            className="icon-button"
            aria-label="Abrir menu"
            onClick={() => {
              setMenuOpen(true);
              setSearchOpen(false);
            }}
          >
            <Menu size={20} />
          </button>
        </div>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {MENU_LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="desktop-nav-link">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="brand-mark">D&apos;OUTRO LADO</div>

        <div className="nav-side nav-right">
          <select
            className="nav-select"
            value={locale}
            onChange={(e) => setLocale(e.target.value as Locale)}
            aria-label="Idioma"
          >
            {Object.entries(localeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>

          <select
            className="nav-select region-select"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            aria-label="Região"
          >
            {REGIONS.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>

          <span className="currency-pill" aria-label={`Moeda atual ${currency}`}>
            {currency}
          </span>

          <button
            type="button"
            className="icon-button"
            aria-label={searchOpen ? "Fechar busca" : "Abrir busca"}
            aria-expanded={searchOpen}
            onClick={handleToggleSearch}
          >
            <Search size={18} />
          </button>

          <Link
            href="/login"
            className="icon-button"
            aria-label="Ir para login"
            onClick={handleCloseAll}
          >
            <User size={18} />
          </Link>

          <Link
            href="/bag"
            className="icon-button bag-button"
            aria-label="Ir para bag"
            onClick={handleCloseAll}
          >
            <ShoppingBag size={18} />
            {totalItems > 0 ? <span className="bag-badge">{totalItems}</span> : null}
          </Link>
        </div>
      </header>

      {searchOpen ? (
        <div className="search-panel">
          <div className="search-shell">
            <div className="search-head">
              <div>
                <p className="search-kicker">Busca premium</p>
                <h3>Encontre produtos, categorias e coleções</h3>
              </div>

              <button type="button" className="icon-button" onClick={closeSearch}>
                <Search size={18} />
              </button>
            </div>

            <input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar bolsas, couro, cerâmica..."
              className="search-input"
              aria-label="Buscar produtos"
            />

            <div className="search-suggestions enhanced-search-grid">
              {suggestions.length > 0 ? (
                suggestions.map((product) => (
                  <Link
                    key={product.id}
                    href={`/produtos/${product.slug}`}
                    className="search-suggestion visual"
                    onClick={closeSearch}
                  >
                    <div
                      className="search-suggestion-thumb"
                      style={{ backgroundImage: `url("${product.image}")` }}
                    />
                    <div>
                      <span>{product.name}</span>
                      <small>{product.tag}</small>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="search-suggestion">
                  <span>Nenhum produto encontrado</span>
                  <small>Tente outro termo</small>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {menuOpen ? (
        <div className="menu-overlay" onClick={closeMenu}>
          <aside className="menu-panel" onClick={(event) => event.stopPropagation()}>
            <div className="menu-panel-head">
              <div>
                <p className="menu-kicker">Navegação</p>
                <h3>Explore a loja</h3>
              </div>

              <button type="button" className="icon-button" onClick={closeMenu}>
                <Menu size={18} />
              </button>
            </div>

            <div className="menu-links">
              {[
                ...MENU_LINKS,
                { href: "/admin", label: "Admin" },
                { href: "/login", label: "Login" },
                { href: "/bag", label: "Bag" },
              ].map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="menu-link-card"
                  onClick={handleCloseAll}
                >
                  <span>{link.label}</span>
                  <span>→</span>
                </Link>
              ))}
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
