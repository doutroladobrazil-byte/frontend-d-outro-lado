"use client";

import Link from "next/link";
import AccessGate from "@/components/auth/AccessGate";

function AdminContent() {
  return (
    <main className="page-shell">
      <section className="content-section">
        <div className="summary-card" style={{ maxWidth: 1200, margin: "0 auto" }}>
          <span className="section-eyebrow">Painel administrativo</span>
          <h1>Centro de operação</h1>

          <p style={{ marginTop: 16, color: "rgba(255,255,255,0.72)", lineHeight: 1.7 }}>
            Esta área concentra o controle estrutural do projeto:
            catálogo, pedidos, usuários e operação comercial do atacado.
          </p>

          <div
            style={{
              display: "grid",
              gap: 18,
              marginTop: 28,
              gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            }}
          >
            <Link href="/admin/produtos" className="secondary-button button-link">
              Produtos
            </Link>

            <Link href="/admin/pedidos" className="secondary-button button-link">
              Pedidos
            </Link>

            <Link href="/admin/importadores" className="secondary-button button-link">
              Gestão de importadores
            </Link>

            <Link href="/admin/usuarios" className="secondary-button button-link">
              Usuários e permissões
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

export default function AdminPage() {
  return (
    <AccessGate requireAuth requireAdmin>
      <AdminContent />
    </AccessGate>
  );
}