
"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getAllCategories } from "@/data/categoryData";
import { useCart } from "@/components/CartContext";
import { localeLabels, type Locale } from "@/lib/i18n";
import { useIntlStore } from "@/components/IntlStoreProvider";
import { storeApi, type StoreProduct } from "@/lib/storeApi";

const REGIONS = ["Europe", "France", "Italy", "Germany", "Switzerland", "United States", "Brazil"];

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const categories = getAllCategories();
  const { totalItems } = useCart();
  const { locale, setLocale, region, setRegion, currency } = useIntlStore();

  useEffect(() => {
    storeApi
      .listProducts(region)
      .then((payload) => setProducts(payload.products))
      .catch(() => setProducts([]));
  }, [region]);

  const suggestions = useMemo(() => {
    if (!query.trim()) return products.slice(0, 5);
    const normalized = query.toLowerCase();
    return products.filter((product) => product.name.toLowerCase().includes(normalized)).slice(0, 5);
  }, [products, query]);

  return (
    <>
      <header className="site-header">
        <div className="nav-side nav-left">
          <button className="icon-button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
            <Menu size={20} />
          </button>
        </div>

        <Link href="/" className="brand-mark">
          D&apos;OUTRO LADO
        </Link>

        <div className="nav-side nav-right">
          <select className="nav-select" value={locale} onChange={(e) => setLocale(e.target.value as Locale)} aria-label="Language">
            {Object.entries(localeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select className="nav-select region-select" value={region} onChange={(e) => setRegion(e.target.value)} aria-label="Region">
            {REGIONS.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <span className="currency-pill">{currency}</span>
          <button className="icon-button" aria-label="Search" onClick={() => setSearchOpen((v) => !v)}>
            <Search size={18} />
          </button>
          <Link href="/login" className="icon-button" aria-label="Sign in">
            <User size={18} />
          </Link>
          <Link href="/bag" className="icon-button bag-button" aria-label="Bag">
            <ShoppingBag size={18} />
            {totalItems > 0 ? <span className="bag-badge">{totalItems}</span> : null}
          </Link>
        </div>
      </header>

      {searchOpen ? (
        <div className="search-panel">
          <div className="search-shell">
            <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search bags, leather, ceramics..." className="search-input" />
            <div className="search-suggestions">
              {suggestions.map((product) => (
                <Link key={product.id} href={`/produtos/${product.categorySlug}`} className="search-suggestion">
                  <span>{product.name}</span>
                  <small>{product.tag}</small>
                </Link>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      <aside className={`menu-drawer ${menuOpen ? "open" : ""}`}>
        <div className="menu-drawer-header">
          <span>Navigation</span>
          <button className="icon-button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
            <X size={18} />
          </button>
        </div>
        <nav className="menu-drawer-nav">
          <Link href="/" onClick={() => setMenuOpen(false)}>Home</Link>
          {categories.map((category) => (
            <Link key={category.slug} href={`/produtos/${category.slug}`} onClick={() => setMenuOpen(false)}>{category.title}</Link>
          ))}
          <Link href="/checkout" onClick={() => setMenuOpen(false)}>Checkout</Link>
          <Link href="/atacado" onClick={() => setMenuOpen(false)}>Atacado</Link>
          <Link href="/importador" onClick={() => setMenuOpen(false)}>Importador</Link>
          <Link href="/sobre" onClick={() => setMenuOpen(false)}>About</Link>
          <Link href="/contato" onClick={() => setMenuOpen(false)}>Contact</Link>
          <Link href="/admin" onClick={() => setMenuOpen(false)}>Admin</Link>
          <Link href="/login" onClick={() => setMenuOpen(false)}>Login</Link>
          <Link href="/bag" onClick={() => setMenuOpen(false)}>Bag</Link>
        </nav>
      </aside>

      {menuOpen ? <button className="drawer-overlay" aria-label="Close menu" onClick={() => setMenuOpen(false)} /> : null}
    </>
  );
}
