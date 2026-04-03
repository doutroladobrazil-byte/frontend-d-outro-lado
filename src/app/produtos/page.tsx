import Link from "next/link";
import { ProductGrid } from "@/components/ProductGrid";
import { storeApi } from "@/lib/storeApi";

export default async function ProductsPage() {
  const products = await storeApi.getProducts("Brazil");

  return (
    <main className="page-shell">
      <section className="content-section">
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gap: 24 }}>
          <div className="summary-card">
            <span className="section-eyebrow">Catálogo completo</span>
            <h1 style={{ marginTop: 10 }}>Todos os produtos</h1>
            <p style={{ marginTop: 14, color: "rgba(255,255,255,0.72)", lineHeight: 1.8 }}>
              Explore a curadoria completa da D&apos;OUTRO LADO em um único lugar.
            </p>
          </div>

          {products.length === 0 ? (
            <div className="summary-card" style={{ display: "grid", gap: 12 }}>
              <strong>Nenhum produto disponível no momento.</strong>
              <p style={{ color: "rgba(255,255,255,0.72)" }}>
                Assim que novos itens forem publicados, eles aparecerão aqui.
              </p>
              <div>
                <Link href="/" className="secondary-button button-link">
                  Voltar para a home
                </Link>
              </div>
            </div>
          ) : (
            <ProductGrid products={products} />
          )}
        </div>
      </section>
    </main>
  );
}
