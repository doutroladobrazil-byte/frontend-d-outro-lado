"use client";

import { useState } from "react";
import { pricingApi, type PricingQuote } from "@/lib/pricingApi";

export function PricingCalculator() {
  const [form, setForm] = useState({
    productCostBRL: 320,
    quantity: 12,
    region: "France",
    marginPercent: 60,
    extraTaxPercent: 14,
    packagingBRL: 40,
    overrideFreightBRL: 0,
    wholesaleDiscountPercent: 12
  });
  const [quote, setQuote] = useState<PricingQuote | null>(null);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setError("");
      const payload = { ...form, overrideFreightBRL: form.overrideFreightBRL || undefined };
      setQuote(await pricingApi.createQuote(payload));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao gerar simulação");
    }
  }

  return (
    <div className="pricing-layout">
      <form className="auth-form pricing-form" onSubmit={handleSubmit}>
        <input className="input-field" type="number" value={form.productCostBRL} onChange={(e) => setForm((v) => ({ ...v, productCostBRL: Number(e.target.value) }))} placeholder="Custo do produto em BRL" />
        <input className="input-field" type="number" value={form.quantity} onChange={(e) => setForm((v) => ({ ...v, quantity: Number(e.target.value) }))} placeholder="Quantidade" />
        <input className="input-field" value={form.region} onChange={(e) => setForm((v) => ({ ...v, region: e.target.value }))} placeholder="Região" />
        <input className="input-field" type="number" value={form.marginPercent} onChange={(e) => setForm((v) => ({ ...v, marginPercent: Number(e.target.value) }))} placeholder="Margem %" />
        <input className="input-field" type="number" value={form.extraTaxPercent} onChange={(e) => setForm((v) => ({ ...v, extraTaxPercent: Number(e.target.value) }))} placeholder="Impostos %" />
        <input className="input-field" type="number" value={form.packagingBRL} onChange={(e) => setForm((v) => ({ ...v, packagingBRL: Number(e.target.value) }))} placeholder="Embalagem BRL" />
        <input className="input-field" type="number" value={form.overrideFreightBRL} onChange={(e) => setForm((v) => ({ ...v, overrideFreightBRL: Number(e.target.value) }))} placeholder="Frete manual BRL" />
        <input className="input-field" type="number" value={form.wholesaleDiscountPercent} onChange={(e) => setForm((v) => ({ ...v, wholesaleDiscountPercent: Number(e.target.value) }))} placeholder="Desconto atacado %" />
        <button className="primary-button">Gerar preço sugerido</button>
      </form>

      <div className="pricing-card">
        <span className="section-eyebrow">Simulador comercial</span>
        <h2>Preço com frete, impostos e margem</h2>
        <p>Calcula um valor sugerido por unidade e total local para a região do comprador.</p>
        {error ? <p className="status-note">{error}</p> : null}
        {quote ? (
          <dl className="pricing-results">
            <div><dt>Referência</dt><dd>{quote.reference}</dd></div>
            <div><dt>Moeda local</dt><dd>{quote.currency}</dd></div>
            <div><dt>Frete BRL</dt><dd>{quote.freightBRL}</dd></div>
            <div><dt>Impostos BRL</dt><dd>{quote.taxValueBRL}</dd></div>
            <div><dt>Margem BRL</dt><dd>{quote.marginValueBRL}</dd></div>
            <div><dt>Preço sugerido/unidade BRL</dt><dd>{quote.suggestedUnitPriceBRL}</dd></div>
            <div><dt>Preço sugerido/unidade local</dt><dd>{quote.suggestedUnitPriceLocal}</dd></div>
            <div><dt>Total BRL</dt><dd>{quote.totalBRL}</dd></div>
            <div><dt>Total local</dt><dd>{quote.totalLocal}</dd></div>
          </dl>
        ) : null}
      </div>
    </div>
  );
}
