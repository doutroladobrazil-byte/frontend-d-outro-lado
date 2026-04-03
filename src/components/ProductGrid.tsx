"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";
import { useIntlStore } from "@/components/IntlStoreProvider";
import type { StoreProduct } from "@/lib/storeApi";
import { normalizeWeightRange, WEIGHT_RANGE_LABELS } from "@/lib/shipping";

function formatMoney(value: number, currency: string, locale: string) {
  const localeMap: Record<string, string> = {
    pt: "pt-BR",
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    es: "es-ES",
  };

  return new Intl.NumberFormat(localeMap[locale] ?? "en-US", {
    style: "currency",
    currency,
  }).format(value);
}

export function ProductGrid({ products }: { products: StoreProduct[] }) {
  const { addItem } = useCart();
  const { locale } = useIntlStore();

  return (
    <div className="product-grid">
      {products.map((product) => {
        const weightRange = normalizeWeightRange(product.weightRange);

        return (
          <article
            key={product.id}
            id={`product-${product.slug}`}
            className="product-card"
          >
            <Link href={`/produtos/${product.slug}`} className="product-image-shell">
              <img src={product.image} alt={product.name} className="product-image" />
            </Link>

            <div className="product-copy">
              <span className="product-tag">{product.tag}</span>

              <Link
                href={`/produtos/${product.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <h3>{product.name}</h3>
              </Link>

              <p>{product.description}</p>
              <strong>{formatMoney(product.priceLocal, product.currency, locale)}</strong>
              <small>{product.stock} em estoque</small>
              <small>Faixa de peso: {WEIGHT_RANGE_LABELS[weightRange]}</small>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <Link
                href={`/produtos/${product.slug}`}
                className="secondary-button"
                style={{ width: "100%", textAlign: "center", textDecoration: "none" }}
              >
                Ver produto
              </Link>

              <button
                className="primary-button"
                disabled={!product.available}
                onClick={() =>
                  addItem({
                    id: product.id,
                    productId: Number(product.id),
                    slug: product.slug,
                    name: product.name,
                    priceBRL: product.priceBRL,
                    priceLocal: product.priceLocal,
                    currency: product.currency,
                    image: product.image,
                    weightRange,
                  })
                }
              >
                {product.available ? "Add to bag" : "Sold out"}
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}