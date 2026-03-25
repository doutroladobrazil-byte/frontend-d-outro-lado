"use client";

import { useEffect, useState } from "react";
import { useIntlStore } from "@/components/IntlStoreProvider";
import { storeApi, type PricingPreview as PricingPreviewType } from "@/lib/storeApi";

function formatMoney(value: number, currency: string, locale: string) {
  const localeMap: Record<string, string> = { pt: "pt-BR", en: "en-US", fr: "fr-FR", de: "de-DE", it: "it-IT", es: "es-ES" };
  return new Intl.NumberFormat(localeMap[locale] ?? "en-US", { style: "currency", currency }).format(value);
}

export function PricingPreview() {
  const { region, locale } = useIntlStore();
  const [baseCostBRL, setBaseCostBRL] = useState("250");
  const [marginPercent, setMarginPercent] = useState("60");
  const [channel, setChannel] = useState<"retail" | "wholesale" | "importer">("retail");
  const [preview, setPreview] = useState<PricingPreviewType | null>(null);

  useEffect(() => {
    let active = true;
    storeApi.previewPricing({
      baseCostBRL: Number(baseCostBRL) || 0,
      region,
      marginPercent: Number(marginPercent) || 60,
      channel
    }).then((data) => {
      if (active) setPreview(data);
    }).catch(() => {
      if (active) setPreview(null);
    });

    return () => {
      active = false;
    };
  }, [baseCostBRL, marginPercent, region, channel]);

  return (
    <section className="content-section">
      <div className="section-heading">
        <div>
          <span className="section-eyebrow">Pricing intelligence</span>
          <h2>Simulação de preço sugerido com frete, impostos, taxa operacional e margem configurável.</h2>
        </div>
        <p>Modelo operacional pronto para varejo, atacado e importador cadastrado.</p>
      </div>

      <div className="pricing-preview-grid">
        <div className="pricing-preview-form card-surface">
          <label>
            Custo base do produto (BRL)
            <input value={baseCostBRL} onChange={(e) => setBaseCostBRL(e.target.value)} className="field-input" inputMode="decimal" />
          </label>
          <label>
            Margem desejada (%)
            <input value={marginPercent} onChange={(e) => setMarginPercent(e.target.value)} className="field-input" inputMode="decimal" />
          </label>
          <label>
            Canal
            <select value={channel} onChange={(e) => setChannel(e.target.value as typeof channel)} className="field-input">
              <option value="retail">Varejo</option>
              <option value="wholesale">Atacado</option>
              <option value="importer">Importador</option>
            </select>
          </label>
        </div>

        <div className="pricing-preview-result card-surface">
          {preview ? (
            <>
              <div className="pricing-kpi">
                <span>Preço sugerido local</span>
                <strong>{formatMoney(preview.suggestedPriceLocal, preview.currency, locale)}</strong>
              </div>
              <div className="pricing-line"><span>Custo base</span><b>R$ {preview.baseCostBRL.toFixed(2)}</b></div>
              <div className="pricing-line"><span>Frete estimado</span><b>R$ {preview.shippingBRL.toFixed(2)}</b></div>
              <div className="pricing-line"><span>Impostos estimados</span><b>R$ {preview.dutiesBRL.toFixed(2)}</b></div>
              <div className="pricing-line"><span>Taxa operacional</span><b>R$ {preview.operationalFeeBRL.toFixed(2)}</b></div>
              <div className="pricing-line"><span>Subtotal de custo</span><b>R$ {preview.subtotalCostBRL.toFixed(2)}</b></div>
              <div className="pricing-line"><span>Margem aplicada</span><b>{preview.marginPercent}%</b></div>
              <div className="pricing-line"><span>Desconto por canal</span><b>{preview.discountPercent}%</b></div>
              <div className="pricing-line total"><span>Preço sugerido BRL</span><b>R$ {preview.suggestedPriceBRL.toFixed(2)}</b></div>
            </>
          ) : (
            <p>Não foi possível carregar a simulação.</p>
          )}
        </div>
      </div>
    </section>
  );
}
