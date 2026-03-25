"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/CartContext";
import { useIntlStore } from "@/components/IntlStoreProvider";
import { getMessage } from "@/lib/i18n";
import { storeApi, type CheckoutTotals } from "@/lib/storeApi";

function formatCurrency(locale: string, currency: string, amount: number) {
  const localeMap: Record<string, string> = {
    pt: "pt-BR",
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    es: "es-ES"
  };

  return new Intl.NumberFormat(localeMap[locale] ?? "en-US", {
    style: "currency",
    currency
  }).format(amount);
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { items, totalBRL } = useCart();
  const { locale, region, currency } = useIntlStore();
  const t = getMessage(locale);
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [previewTotals, setPreviewTotals] = useState<CheckoutTotals | null>(null);

  const itemCount = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);

  async function handleCheckout() {
    try {
      setLoading(true);
      setError("");
      const result = await storeApi.createCheckout({
        customerName,
        customerEmail,
        region,
        locale,
        items: items.map((item) => ({ productId: item.productId, quantity: item.quantity }))
      });

      setPreviewTotals(result.totals);

      if (result.checkoutUrl.startsWith("http")) {
        window.location.href = result.checkoutUrl;
        return;
      }

      router.push(`/success?order=${result.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  }

  const estimatedShippingBRL = 180 + Math.max(0, itemCount - 1) * 24;
  const estimatedDutiesBRL = totalBRL * 0.1;
  const estimatedOperationalBRL = totalBRL * 0.05;
  const fallbackTotalLocal = (totalBRL + estimatedShippingBRL + estimatedDutiesBRL + estimatedOperationalBRL) * (currency === "EUR" ? 0.18 : currency === "USD" ? 0.2 : currency === "CHF" ? 0.16 : currency === "GBP" ? 0.15 : 1);

  const totals = previewTotals ?? {
    currency,
    fxRate: 1,
    subtotalBRL: totalBRL,
    shippingBRL: estimatedShippingBRL,
    dutiesBRL: estimatedDutiesBRL,
    operationalFeeBRL: estimatedOperationalBRL,
    totalBRL: totalBRL + estimatedShippingBRL + estimatedDutiesBRL + estimatedOperationalBRL,
    subtotalLocal: 0,
    shippingLocal: 0,
    dutiesLocal: 0,
    operationalFeeLocal: 0,
    totalLocal: fallbackTotalLocal
  } satisfies CheckoutTotals;

  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section checkout-layout">
        <div className="summary-card">
          <span className="section-eyebrow">Global checkout</span>
          <h1>{t.checkout}</h1>
          <p>Checkout internacional com frete, tributos estimados e custo operacional embutidos no valor final.</p>
          {searchParams.get("cancelled") ? <div className="info-card">Checkout cancelled.</div> : null}
          <div className="form-stack">
            <input className="input-field panel-input" placeholder="Full name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
            <input className="input-field panel-input" placeholder="Email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
            <input className="input-field panel-input" value={region} readOnly />
            {error ? <div className="info-card error-card">{error}</div> : null}
            <button className="primary-button" onClick={handleCheckout} disabled={loading || items.length === 0 || !customerName || !customerEmail}>
              {loading ? "Processing..." : t.checkout}
            </button>
          </div>
        </div>

        <aside className="summary-card">
          <h2>{t.summary}</h2>
          <p>{items.length} item(s)</p>
          <div className="checkout-line"><span>Subtotal BRL</span><strong>R$ {totals.subtotalBRL.toFixed(2)}</strong></div>
          <div className="checkout-line"><span>Frete estimado</span><strong>R$ {totals.shippingBRL.toFixed(2)}</strong></div>
          <div className="checkout-line"><span>Tributos estimados</span><strong>R$ {totals.dutiesBRL.toFixed(2)}</strong></div>
          <div className="checkout-line"><span>Operação</span><strong>R$ {totals.operationalFeeBRL.toFixed(2)}</strong></div>
          <div className="divider" />
          <div className="checkout-line"><span>Total BRL</span><strong>R$ {totals.totalBRL.toFixed(2)}</strong></div>
          <div className="checkout-line"><span>Total exibido</span><strong>{formatCurrency(locale, totals.currency, totals.totalLocal)}</strong></div>
          <div className="divider" />
          {items.map((item) => (
            <div key={item.id} className="checkout-line">
              <span>{item.name} × {item.quantity}</span>
              <strong>R$ {(item.priceBRL * item.quantity).toFixed(2)}</strong>
            </div>
          ))}
        </aside>
      </section>
    </main>
  );
}
