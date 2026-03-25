
"use client";

import { useCart } from "@/components/CartContext";
import { useIntlStore } from "@/components/IntlStoreProvider";
import type { StoreProduct } from "@/lib/storeApi";

function formatMoney(value: number, currency: string, locale: string) {
  const localeMap: Record<string, string> = { pt: "pt-BR", en: "en-US", fr: "fr-FR", de: "de-DE", it: "it-IT", es: "es-ES" };
  return new Intl.NumberFormat(localeMap[locale] ?? "en-US", { style: "currency", currency }).format(value);
}

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  const { addItem } = useCart();
  const { locale } = useIntlStore();

  return (
    <div className="product-grid">
      {products.map((product) => (
        <article key={product.id} className="product-card">
          <div className="product-image-shell">
            <img src={product.image} alt={product.name} className="product-image" />
          </div>
          <div className="product-copy">
            <span className="product-tag">{product.tag}</span>
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <strong>{formatMoney(product.priceLocal, product.currency, locale)}</strong>
            <small>{product.stock} em estoque</small>
          </div>
          <button
            className="primary-button"
            disabled={!product.available}
            onClick={() => addItem({
              id: product.id,
              productId: Number(product.id),
              slug: product.slug,
              name: product.name,
              priceBRL: product.priceBRL,
              priceLocal: product.priceLocal,
              currency: product.currency,
              image: product.image
            })}
          >
            {product.available ? "Add to bag" : "Sold out"}
          </button>
        </article>
      ))}
    </div>
  );
}
