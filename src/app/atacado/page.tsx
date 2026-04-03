"use client";

import AccessGate from "@/components/auth/AccessGate";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { storeApi, type StoreProduct } from "@/lib/storeApi";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function WholesaleContent() {
  const [products, setProducts] = useState<StoreProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        setLoading(true);
        setError("");

        const result = await storeApi.getProducts("Brazil");

        if (!active) return;

        setProducts(
          result.filter(
            (item) =>
              typeof item.wholesalePriceBRL === "number" &&
              typeof item.wholesaleMinQty === "number"
          )
        );
      } catch (err) {
        if (!active) return;
        setError(
          err instanceof Error ? err.message : "Não foi possível carregar o atacado."
        );
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  const summary = useMemo(() => {
    const total = products.length;
    const withStock = products.filter((item) => item.stock > 0).length;
    return { total, withStock };
  }, [products]);

  return (
    <main className="page-shell">
      <section className="content-section">
        <div className="summary-card" style={{ maxWidth: 1240, margin: "0 auto", display: "grid", gap: 20 }}>
          <div>
            <span className="section-eyebrow">Área de atacado</span>
            <h1 style={{ marginTop: 10 }}>Condições comerciais para importadores</h1>
            <p style={{ marginTop: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
              Catálogo comercial protegido por perfil aprovado.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div className="summary-card">
              <strong>Produtos com atacado</strong>
              <div style={{ marginTop: 8 }}>{summary.total}</div>
            </div>

            <div className="summary-card">
              <strong>Produtos com estoque</strong>
              <div style={{ marginTop: 8 }}>{summary.withStock}</div>
            </div>
          </div>

          {loading ? <div className="summary-card">Carregando catálogo atacadista...</div> : null}
          {error ? <div className="summary-card" style={{ color: "#ffd8d8" }}>{error}</div> : null}

          {!loading && !error && products.length > 0 ? (
            <div style={{ display: "grid", gap: 16 }}>
              {products.map((product) => (
                <article
                  key={product.id}
                  className="summary-card"
                  style={{
                    display: "grid",
                    gridTemplateColumns: "minmax(120px, 180px) 1fr",
                    gap: 18,
                    alignItems: "center",
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
                      src={product.image}
                      alt={product.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                    />
                  </div>

                  <div style={{ display: "grid", gap: 10 }}>
                    <div>
                      <div
                        style={{
                          color: "rgba(189,157,106,0.85)",
                          fontSize: 13,
                          letterSpacing: "0.18em",
                          textTransform: "uppercase",
                        }}
                      >
                        {product.category}
                      </div>

                      <h2 style={{ marginTop: 8 }}>{product.name}</h2>

                      <p style={{ marginTop: 10, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
                        {product.description}
                      </p>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                        color: "rgba(255,255,255,0.84)",
                      }}
                    >
                      <span>Varejo: {formatBRL(product.priceBRL)}</span>
                      <span>
                        Atacado:{" "}
                        {typeof product.wholesalePriceBRL === "number"
                          ? formatBRL(product.wholesalePriceBRL)
                          : "—"}
                      </span>
                      <span>Mínimo: {product.wholesaleMinQty ?? "—"} unidades</span>
                      <span>Faixa de peso: {product.weightRange}</span>
                      <span>Estoque: {product.stock}</span>
                    </div>

                    <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                      <Link href={`/produtos/${product.slug}`} className="secondary-button button-link">
                        Ver produto
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  );
}

export default function AtacadoPage() {
  return (
    <AccessGate requireAuth requireWholesale>
      <WholesaleContent />
    </AccessGate>
  );
}