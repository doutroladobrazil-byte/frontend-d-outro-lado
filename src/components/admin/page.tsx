import Link from "next/link";

export default function AdminPage() {
  return (
    <main className="page-shell">
      <section className="content-section">
        <div className="summary-card" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span className="section-eyebrow">Painel administrativo</span>
          <h1>Centro de operação</h1>
          <p style={{ marginTop: 16 }}>
            Esta área deve concentrar o controle estrutural do projeto:
            catálogo, pedidos, usuários e aprovações de importadores.
          </p>

          <div
            style={{
              display: "grid",
              gap: 18,
              marginTop: 28,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <Link href="/admin/importadores" className="secondary-button button-link">
              Aprovação de importadores
            </Link>

            <Link href="/checkout" className="secondary-button button-link">
              Validar fluxo de checkout
            </Link>

            <Link href="/atacado" className="secondary-button button-link">
              Validar área de atacado
            </Link>

            <Link href="/" className="secondary-button button-link">
              Voltar para a home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}