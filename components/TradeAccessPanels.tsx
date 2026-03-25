"use client";

import Link from "next/link";

const panels = [
  { href: "/atacado", eyebrow: "Wholesale login", title: "Área de lojistas com solicitação de preços especiais e aprovação manual.", text: "Pensada para compradores recorrentes e pedidos por volume.", cta: "Entrar no atacado" },
  { href: "/importador", eyebrow: "Importer portal", title: "Canal dedicado para importadores cadastrados, com cálculo orientado por volume.", text: "Separação clara entre varejo premium e negociação profissional.", cta: "Abrir portal importador" }
];

export function TradeAccessPanels() {
  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">B2B layer</span>
          <h2>Experiência premium no varejo, com trilhas separadas para atacado e importação cadastrada.</h2>
        </div>
      </div>

      <div className="trade-panels">
        {panels.map((panel) => (
          <article key={panel.href} className="trade-panel card-surface">
            <span className="section-eyebrow">{panel.eyebrow}</span>
            <h3>{panel.title}</h3>
            <p>{panel.text}</p>
            <Link href={panel.href} className="secondary-link">{panel.cta}</Link>
          </article>
        ))}
      </div>
    </section>
  );
}
