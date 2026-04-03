import Link from "next/link";
import { notFound } from "next/navigation";
import ProductActions from "@/components/product/ProductActions";
import PriceBlock from "@/components/product/PriceBlock";
import { ProductGrid } from "@/components/ProductGrid";
import { storeApi } from "@/lib/storeApi";

type ProductPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatCurrency(value: number, currency = "BRL", locale = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;

  const product = await storeApi.getProductBySlug(slug, "Brazil");

  if (!product) {
    const categoryProducts = await storeApi.getProductsByCategory(slug, "Brazil");

    if (categoryProducts.length === 0) {
      notFound();
    }

    const categoryName = categoryProducts[0]?.category ?? "Categoria";

    return (
      <main className="page-shell">
        <section className="content-section">
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 24 }}>
            <div className="summary-card">
              <span className="section-eyebrow">Categoria</span>
              <h1 style={{ marginTop: 10 }}>{categoryName}</h1>
              <p style={{ marginTop: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
                Visualize todos os produtos disponíveis desta categoria.
              </p>
            </div>

            <ProductGrid products={categoryProducts} />
          </div>
        </section>
      </main>
    );
  }

  const related = await storeApi.getProductsByCategory(product.categorySlug, "Brazil");
  const relatedProducts = related.filter((item) => item.slug !== product.slug).slice(0, 4);

  return (
    <main className="page-shell">
      <section className="content-section">
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gap: 28,
          }}
        >
          <div
            className="summary-card"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 28,
              alignItems: "start",
            }}
          >
            <div
              style={{
                borderRadius: 28,
                overflow: "hidden",
                border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.02)",
                minHeight: 420,
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  minHeight: 420,
                  objectFit: "cover",
                  display: "block",
                }}
              />
            </div>

            <div style={{ display: "grid", gap: 20 }}>
              <div>
                <div
                  style={{
                    color: "rgba(189,157,106,0.84)",
                    fontSize: 13,
                    letterSpacing: "0.18em",
                    textTransform: "uppercase",
                  }}
                >
                  {product.category}
                </div>

                <h1 style={{ marginTop: 12 }}>{product.name}</h1>

                <p
                  style={{
                    marginTop: 16,
                    color: "rgba(255,255,255,0.74)",
                    lineHeight: 1.8,
                  }}
                >
                  {product.description}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 12,
                  color: "rgba(255,255,255,0.78)",
                  fontSize: 14,
                }}
              >
                <span className="summary-card" style={{ padding: "10px 14px" }}>
                  Tag: {product.tag}
                </span>
                <span className="summary-card" style={{ padding: "10px 14px" }}>
                  Peso: {product.weightRange}
                </span>
                <span className="summary-card" style={{ padding: "10px 14px" }}>
                  Estoque: {product.stock}
                </span>
                <span className="summary-card" style={{ padding: "10px 14px" }}>
                  Disponível: {product.available ? "Sim" : "Não"}
                </span>
              </div>

              <div className="summary-card">
                <PriceBlock
                  retailPriceBRL={product.priceBRL}
                  wholesalePriceBRL={product.wholesalePriceBRL ?? undefined}
                  wholesaleMinQty={product.wholesaleMinQty ?? undefined}
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 12,
                }}
              >
                <div className="summary-card">
                  <strong>Preço varejo</strong>
                  <div style={{ marginTop: 8 }}>
                    {formatCurrency(product.priceBRL, "BRL", "pt-BR")}
                  </div>
                </div>

                {typeof product.wholesalePriceBRL === "number" ? (
                  <div className="summary-card">
                    <strong>Preço atacado</strong>
                    <div style={{ marginTop: 8 }}>
                      {formatCurrency(product.wholesalePriceBRL, "BRL", "pt-BR")}
                    </div>
                    <div
                      style={{
                        marginTop: 8,
                        color: "rgba(255,255,255,0.68)",
                        fontSize: 14,
                      }}
                    >
                      Pedido mínimo: {product.wholesaleMinQty ?? "—"} unidades
                    </div>
                  </div>
                ) : null}
              </div>

              <ProductActions
                product={{
                  id: product.id,
                  productId: Number(product.id),
                  slug: product.slug,
                  name: product.name,
                  priceBRL: product.priceBRL,
                  priceLocal: product.priceLocal,
                  currency: product.currency,
                  image: product.image,
                  weightRange: product.weightRange,
                }}
                available={product.available}
              />

              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <Link href="/checkout" className="primary-button button-link">
                  Ir para checkout
                </Link>

                <Link href="/atacado" className="secondary-button button-link">
                  Ver condições comerciais
                </Link>
              </div>
            </div>
          </div>

          <div className="summary-card">
            <span className="section-eyebrow">Produtos relacionados</span>
            <h2 style={{ marginTop: 10 }}>Mais da mesma curadoria</h2>

            {relatedProducts.length === 0 ? (
              <p style={{ marginTop: 16, color: "rgba(255,255,255,0.72)" }}>
                Nenhum produto relacionado encontrado.
              </p>
            ) : (
              <div
                style={{
                  marginTop: 22,
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 18,
                }}
              >
                {relatedProducts.map((item) => (
                  <article
                    key={item.id}
                    className="summary-card"
                    style={{
                      display: "grid",
                      gap: 14,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        aspectRatio: "1 / 1",
                        borderRadius: 20,
                        overflow: "hidden",
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.02)",
                      }}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          display: "block",
                        }}
                      />
                    </div>

                    <div>
                      <strong>{item.name}</strong>
                      <div
                        style={{
                          marginTop: 8,
                          color: "rgba(255,255,255,0.68)",
                          lineHeight: 1.6,
                          fontSize: 14,
                        }}
                      >
                        {item.tag}
                      </div>
                    </div>

                    <div style={{ color: "rgba(255,255,255,0.9)" }}>
                      {formatCurrency(item.priceBRL, "BRL", "pt-BR")}
                    </div>

                    <Link
                      href={`/produtos/${item.slug}`}
                      className="secondary-button button-link"
                    >
                      Ver produto
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}