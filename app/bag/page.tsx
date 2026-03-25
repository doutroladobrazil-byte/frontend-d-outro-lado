"use client";

import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/CartContext";
import { getMessage } from "@/lib/i18n";
import { useIntlStore } from "@/components/IntlStoreProvider";

function formatMoney(value: number, currency: string, locale: string) {
  const localeMap: Record<string, string> = { pt: "pt-BR", en: "en-US", fr: "fr-FR", de: "de-DE", it: "it-IT", es: "es-ES" };
  return new Intl.NumberFormat(localeMap[locale] ?? "en-US", { style: "currency", currency }).format(value);
}

export default function BagPage() {
  const { items, removeItem, clearCart, totalBRL } = useCart();
  const { locale, currency } = useIntlStore();
  const t = getMessage(locale);
  const totalLocal = currency === "BRL" ? totalBRL : totalBRL * (currency === "EUR" ? 0.18 : currency === "USD" ? 0.2 : currency === "CHF" ? 0.16 : 0.15);

  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">{t.summary}</span>
            <h1>{t.bag}</h1>
          </div>
        </div>

        <div className="bag-layout">
          <div className="bag-items">
            {items.length === 0 ? (
              <div className="info-card">{t.emptyBag}</div>
            ) : (
              items.map((item) => (
                <article key={item.id} className="bag-item-card">
                  <img src={item.image} alt={item.name} className="bag-item-image" />
                  <div>
                    <h3>{item.name}</h3>
                    <p>Quantity: {item.quantity}</p>
                    <strong>{formatMoney(item.priceLocal ?? item.priceBRL, item.currency ?? currency, locale)}</strong>
                  </div>
                  <button className="secondary-button" onClick={() => removeItem(item.id)}>Remove</button>
                </article>
              ))
            )}
          </div>

          <aside className="summary-card">
            <h2>{t.summary}</h2>
            <p>Base total BRL: R$ {totalBRL.toFixed(2)}</p>
            <p>Display total: {formatMoney(totalLocal, currency, locale)}</p>
            <Link href="/checkout" className="primary-button button-link">{t.checkout}</Link>
            <button className="secondary-button" onClick={clearCart}>Clear bag</button>
          </aside>
        </div>
      </section>
    </main>
  );
}
