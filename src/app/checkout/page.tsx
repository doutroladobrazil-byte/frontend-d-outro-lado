"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { storeApi } from "@/lib/storeApi";
import { getShippingForWeightRangeBRL } from "@/lib/shipping";

function formatCurrency(value: number, currency = "BRL", locale = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, totalItems, totalBRL, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerDocument, setCustomerDocument] = useState("");
  const [destinationZip, setDestinationZip] = useState("");
  const [addressCity, setAddressCity] = useState("");
  const [addressState, setAddressState] = useState("SP");
  const [region, setRegion] = useState("Brazil");
  const [locale, setLocale] = useState("pt-BR");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const shippingBRL = useMemo(() => {
    return items.reduce((acc, item) => {
      const shipping = getShippingForWeightRangeBRL(item.weightRange, region).shippingBRL;
      return acc + shipping * item.quantity;
    }, 0);
  }, [items, region]);

  const totalWithShippingBRL = useMemo(() => {
    return Number((totalBRL + shippingBRL).toFixed(2));
  }, [totalBRL, shippingBRL]);

  const canSubmit = useMemo(() => {
    return (
      items.length > 0 &&
      customerName.trim().length >= 2 &&
      customerEmail.trim().length >= 5 &&
      destinationZip.replace(/\D/g, "").length === 8
    );
  }, [items.length, customerEmail, customerName, destinationZip]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    try {
      if (!canSubmit) {
        throw new Error("Preencha seus dados e mantenha ao menos um item no carrinho.");
      }

      const payload = {
        customerName,
        customerEmail,
        customerDocument,
        destinationZip,
        addressCity,
        addressState,
        region,
        locale,
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
      };

      const result = await storeApi.createCheckout(payload);

      if (result.checkoutUrl) {
        clearCart();
        window.location.href = result.checkoutUrl;
        return;
      }

      setMessage(
        `Pedido ${result.orderId} criado com sucesso. Total calculado: ${formatCurrency(
          result.totalBRL
        )}.`
      );

      clearCart();
      router.push(`/order/${result.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível finalizar o pedido.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="page-shell">
      <section className="content-section">
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
            gap: 24,
            alignItems: "start",
          }}
        >
          <div style={{ display: "grid", gap: 16 }}>
            <div className="summary-card">
              <span className="section-eyebrow">Checkout</span>
              <h1 style={{ marginTop: 10 }}>Pedido real integrado ao Supabase</h1>
              <p
                style={{
                  marginTop: 16,
                  color: "rgba(255,255,255,0.72)",
                  lineHeight: 1.7,
                }}
              >
                Esta etapa já grava o pedido diretamente no Supabase, com itens,
                total em BRL e cálculo estrutural de frete por faixa de peso.
              </p>
            </div>

            <div className="summary-card">
              <h2>Itens do pedido</h2>

              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                {items.length === 0 ? (
                  <div style={{ color: "rgba(255,255,255,0.72)" }}>Seu carrinho está vazio.</div>
                ) : (
                  items.map((item) => {
                    const shipping = getShippingForWeightRangeBRL(item.weightRange, region).shippingBRL;

                    return (
                      <div
                        key={item.id}
                        style={{
                          display: "grid",
                          gridTemplateColumns: "80px 1fr",
                          gap: 14,
                          alignItems: "center",
                          padding: 14,
                          borderRadius: 18,
                          border: "1px solid rgba(255,255,255,0.08)",
                          background: "rgba(255,255,255,0.02)",
                        }}
                      >
                        <div
                          style={{
                            width: 80,
                            height: 80,
                            borderRadius: 16,
                            overflow: "hidden",
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

                          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.68)", fontSize: 14 }}>
                            Quantidade: {item.quantity}
                          </div>

                          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.68)", fontSize: 14 }}>
                            Preço unitário: {formatCurrency(item.priceBRL)}
                          </div>

                          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.68)", fontSize: 14 }}>
                            Frete unitário estimado: {formatCurrency(shipping)}
                          </div>

                          <div style={{ marginTop: 6, color: "rgba(255,255,255,0.68)", fontSize: 14 }}>
                            Peso: {item.weightRange ?? "não informado"}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <aside style={{ display: "grid", gap: 16 }}>
            <div className="summary-card">
              <h2>Dados do comprador</h2>

              <form onSubmit={handleSubmit} className="grid gap-4" style={{ marginTop: 18 }}>
                <input
                  className="panel-input"
                  placeholder="Nome completo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                />

                <input
                  className="panel-input"
                  type="email"
                  placeholder="Email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                />

                <input
                  className="panel-input"
                  placeholder="CPF ou CNPJ"
                  value={customerDocument}
                  onChange={(e) => setCustomerDocument(e.target.value)}
                />

                <input
                  className="panel-input"
                  placeholder="CEP de entrega"
                  value={destinationZip}
                  onChange={(e) => setDestinationZip(e.target.value)}
                />

                <input
                  className="panel-input"
                  placeholder="Cidade"
                  value={addressCity}
                  onChange={(e) => setAddressCity(e.target.value)}
                />

                <input
                  className="panel-input"
                  placeholder="UF"
                  maxLength={2}
                  value={addressState}
                  onChange={(e) => setAddressState(e.target.value.toUpperCase())}
                />

                <select className="panel-input" value={region} onChange={(e) => setRegion(e.target.value)}>
                  <option value="Brazil">Brasil</option>
                  <option value="Europe">Europa</option>
                  <option value="United States">Estados Unidos</option>
                  <option value="Switzerland">Suíça</option>
                </select>

                <select className="panel-input" value={locale} onChange={(e) => setLocale(e.target.value)}>
                  <option value="pt-BR">Português (Brasil)</option>
                  <option value="en-US">English (US)</option>
                  <option value="fr-FR">Français</option>
                </select>

                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.68)", lineHeight: 1.6 }}>
                  O pedido já salva CEP, tenta cotação real via Melhor Envio e, se a integração não estiver configurada,
                  usa o fallback interno por faixa de peso.
                </div>

                <button type="submit" className="primary-button" disabled={loading || items.length === 0}>
                  {loading ? "Preparando pagamento..." : "Ir para pagamento"}
                </button>
              </form>

              {message ? (
                <div
                  style={{
                    marginTop: 16,
                    border: "1px solid rgba(189,157,106,0.28)",
                    background: "rgba(189,157,106,0.08)",
                    color: "rgba(255,245,228,0.88)",
                    padding: 14,
                    borderRadius: 16,
                    lineHeight: 1.6,
                    fontSize: 14,
                  }}
                >
                  {message}
                </div>
              ) : null}

              {error ? (
                <div
                  style={{
                    marginTop: 16,
                    border: "1px solid rgba(255,255,255,0.12)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.88)",
                    padding: 14,
                    borderRadius: 16,
                    lineHeight: 1.6,
                    fontSize: 14,
                  }}
                >
                  {error}
                </div>
              ) : null}
            </div>

            <div className="summary-card">
              <h2>Resumo financeiro</h2>

              <div
                style={{
                  marginTop: 18,
                  display: "grid",
                  gap: 12,
                  color: "rgba(255,255,255,0.84)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <span>Itens</span>
                  <strong>{totalItems}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <span>Subtotal em BRL</span>
                  <strong>{formatCurrency(totalBRL)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <span>Frete estimado</span>
                  <strong>{formatCurrency(shippingBRL)}</strong>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                  <span>Total geral</span>
                  <strong>{formatCurrency(totalWithShippingBRL)}</strong>
                </div>
              </div>

              <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
                <Link href="/bag" className="secondary-button button-link">
                  Voltar ao carrinho
                </Link>

                <Link href="/" className="secondary-button button-link">
                  Continuar comprando
                </Link>
              </div>

              <p
                style={{
                  marginTop: 18,
                  color: "rgba(255,255,255,0.62)",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                O pedido agora nasce no Supabase e pode seguir para o Stripe. Quando o webhook
                confirmar o pagamento, o status muda automaticamente para pago e o estoque é baixado.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
