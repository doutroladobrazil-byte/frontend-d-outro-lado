"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useCart } from "@/components/CartContext";
import { useIntlStore } from "@/components/IntlStoreProvider";
import { storeApi, type StoreProduct } from "@/lib/storeApi";
import { normalizeWeightRange, WEIGHT_RANGE_LABELS } from "@/lib/shipping";

type Props = {
  title?: string;
};

function formatMoney(value: number, currency: string, locale: string) {
  const localeMap: Record<string, string> = {
    pt: "pt-BR",
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    es: "es-ES",
  };

  return new Intl.NumberFormat(localeMap[locale] ?? "pt-BR", {
    style: "currency",
    currency,
  }).format(value);
}

function buildFallbackProducts(currency: string): StoreProduct[] {
  return [
    {
      id: "fallback-1",
      slug: "bolsa-artesanal-premium",
      name: "Bolsa artesanal premium",
      tag: "Moda",
      category: "Moda",
      categorySlug: "moda-estilo-e-acessorios",
      description: "Acabamento sofisticado, textura elegante e presença editorial.",
      image:
        "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
      priceBRL: 429,
      priceLocal: 429,
      currency,
      weightRange: "1-3kg",
      stock: 12,
      available: true,
      featured: true,
      wholesalePriceBRL: 349,
      wholesalePriceLocal: 349,
      wholesaleMinQty: 5,
    },
    {
      id: "fallback-2",
      slug: "ceramica-autoral",
      name: "Cerâmica autoral",
      tag: "Casa",
      category: "Casa e decoração",
      categorySlug: "casa-e-decoracao",
      description: "Peças minimalistas com linguagem premium para mesa e interior.",
      image:
        "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1200&q=80",
      priceBRL: 289,
      priceLocal: 289,
      currency,
      weightRange: "3-5kg",
      stock: 8,
      available: true,
      featured: true,
      wholesalePriceBRL: 229,
      wholesalePriceLocal: 229,
      wholesaleMinQty: 4,
    },
    {
      id: "fallback-3",
      slug: "kit-presente-sofisticado",
      name: "Kit presente sofisticado",
      tag: "Presentes",
      category: "Presentes especiais",
      categorySlug: "presentes-especiais",
      description: "Composição elegante para presentes com alto valor percebido.",
      image:
        "https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&w=1200&q=80",
      priceBRL: 359,
      priceLocal: 359,
      currency,
      weightRange: "1-3kg",
      stock: 9,
      available: true,
      featured: true,
      wholesalePriceBRL: 299,
      wholesalePriceLocal: 299,
      wholesaleMinQty: 3,
    },
    {
      id: "fallback-4",
      slug: "decoracao-brasileira-premium",
      name: "Decoração brasileira premium",
      tag: "Casa",
      category: "Casa e decoração",
      categorySlug: "casa-e-decoracao",
      description: "Objeto de composição elegante com textura e identidade visual.",
      image:
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
      priceBRL: 519,
      priceLocal: 519,
      currency,
      weightRange: "5-10kg",
      stock: 6,
      available: true,
      featured: true,
      wholesalePriceBRL: 449,
      wholesalePriceLocal: 449,
      wholesaleMinQty: 2,
    },
  ];
}

export default function HomeProductPreview({
  title = "Produtos em destaque",
}: Props) {
  const { locale, region } = useIntlStore();
  const { addItem } = useCart();
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadProducts() {
      setLoading(true);

      try {
        const featured = await storeApi.getFeaturedProducts(region, 4);
        if (!active) return;

        if (featured.length > 0) {
          setProducts(featured);
        } else {
          setProducts(buildFallbackProducts("BRL"));
        }
      } catch {
        if (!active) return;
        setProducts(buildFallbackProducts("BRL"));
      } finally {
        if (active) setLoading(false);
      }
    }

    loadProducts();

    return () => {
      active = false;
    };
  }, [region]);

  return (
    <section className="store-preview-section">
      <div className="store-preview-head">
        <div>
          <p className="store-kicker">Loja pronta para vender</p>
          <h3>{title}</h3>
        </div>

        <p className="store-preview-copy">
          Cards reais de produto com imagem, estoque, faixa de peso e ação de compra,
          preservando seu visual premium sem perder leitura comercial.
        </p>
      </div>

      <div className="store-preview-grid">
        {loading
          ? Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="store-preview-card skeleton-card">
                <div className="store-preview-image skeleton-shimmer" />
                <div className="store-preview-body">
                  <div className="skeleton-line skeleton-shimmer" />
                  <div className="skeleton-line short skeleton-shimmer" />
                  <div className="skeleton-line medium skeleton-shimmer" />
                </div>
              </div>
            ))
          : products.map((product) => {
              const weightRange = normalizeWeightRange(product.weightRange);

              return (
                <article key={product.id} className="store-preview-card">
                  <Link
                    href={`/produtos/${product.slug}`}
                    className="store-preview-image-link"
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="store-preview-image"
                    />
                  </Link>

                  <div className="store-preview-body">
                    <div className="store-preview-meta">
                      <span className="store-preview-tag">{product.tag}</span>
                      <span className="store-preview-stock">
                        {product.stock} em estoque
                      </span>
                    </div>

                    <Link href={`/produtos/${product.slug}`} className="store-preview-title">
                      {product.name}
                    </Link>

                    <p className="store-preview-description">{product.description}</p>

                    <div className="store-preview-price-row">
                      <strong>
                        {formatMoney(product.priceLocal, product.currency, locale)}
                      </strong>
                      <small>
                        Peso: {WEIGHT_RANGE_LABELS[weightRange] ?? weightRange}
                      </small>
                    </div>

                    <div className="store-preview-actions">
                      <Link
                        href={`/produtos/${product.slug}`}
                        className="secondary-button"
                        style={{ textDecoration: "none", textAlign: "center" }}
                      >
                        Ver produto
                      </Link>

                      <button
                        className="primary-button"
                        disabled={!product.available}
                        onClick={() =>
                          addItem({
                            id: product.id,
                            productId: Number(product.id) || Date.now(),
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
                        {product.available ? "Adicionar à bag" : "Indisponível"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
      </div>
    </section>
  );
}
