"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCart } from "@/components/CartContext";
import { storeApi, type StoreOrder } from "@/lib/storeApi";

function formatCurrency(value: number, currency = "BRL", locale = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

function getStatusPresentation(status?: string) {
  switch (status) {
    case "paid":
      return {
        title: "Pagamento confirmado",
        description: "O Stripe confirmou o pagamento e o pedido já foi sincronizado.",
        border: "1px solid rgba(34,197,94,0.24)",
        background: "rgba(34,197,94,0.10)",
        color: "#bbf7d0",
      };
    case "preparing":
      return {
        title: "Pedido em preparação",
        description: "Pagamento confirmado e pedido já liberado para separação.",
        border: "1px solid rgba(96,165,250,0.24)",
        background: "rgba(96,165,250,0.10)",
        color: "#bfdbfe",
      };
    case "shipped":
      return {
        title: "Pedido enviado",
        description: "O fluxo financeiro e operacional já foi concluído no sistema.",
        border: "1px solid rgba(167,139,250,0.24)",
        background: "rgba(167,139,250,0.10)",
        color: "#ddd6fe",
      };
    case "cancelled":
      return {
        title: "Pedido cancelado",
        description: "O pedido consta como cancelado no painel administrativo.",
        border: "1px solid rgba(248,113,113,0.24)",
        background: "rgba(248,113,113,0.10)",
        color: "#fecaca",
      };
    default:
      return {
        title: "Aguardando confirmação",
        description: "O pagamento foi recebido pelo checkout e estamos sincronizando o retorno final.",
        border: "1px solid rgba(250,204,21,0.24)",
        background: "rgba(250,204,21,0.10)",
        color: "#fde68a",
      };
  }
}

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order");
  const sessionId = searchParams.get("session_id");
  const { clearCart } = useCart();
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [loading, setLoading] = useState(Boolean(orderId));
  const [error, setError] = useState("");
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  useEffect(() => {
    let active = true;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    async function run(currentAttempt = 0) {
      if (!orderId) {
        setLoading(false);
        return;
      }

      try {
        const data = await storeApi.getOrder(orderId, sessionId);
        if (!active) return;

        setOrder(data);
        setAttempts(currentAttempt);

        const needsRetry = Boolean(sessionId) && data.status === "pending" && currentAttempt < 5;
        if (needsRetry) {
          timeoutId = setTimeout(() => {
            void run(currentAttempt + 1);
          }, 2500);
          return;
        }

        setLoading(false);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Falha ao validar o pedido.");
        setLoading(false);
      }
    }

    void run(0);

    return () => {
      active = false;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [orderId, sessionId]);

  const statusPresentation = useMemo(() => getStatusPresentation(order?.status), [order?.status]);
  const steps = useMemo(
    () => [
      {
        label: "Pedido criado",
        done: Boolean(orderId),
      },
      {
        label: "Pagamento confirmado",
        done: order?.status === "paid" || order?.status === "preparing" || order?.status === "shipped",
      },
      {
        label: "Estoque sincronizado",
        done: Boolean(order?.inventoryApplied),
      },
      {
        label: "Fluxo administrativo liberado",
        done: order?.status === "preparing" || order?.status === "shipped",
      },
    ],
    [order?.inventoryApplied, order?.status, orderId]
  );

  return (
    <main className="page-shell">
      <section className="content-section">
        <div className="summary-card" style={{ maxWidth: 820, margin: "0 auto", display: "grid", gap: 18 }}>
          <span className="section-eyebrow">Pedido confirmado</span>
          <h1>Confirmação visual do pagamento</h1>
          <p>Seu pedido foi registrado com sucesso no sistema da D&apos;OUTRO LADO.</p>

          <div className="info-card">
            <strong>Número do pedido:</strong> {orderId ? orderId : "Aguardando identificação"}
          </div>

          <div
            style={{
              borderRadius: 18,
              padding: 18,
              border: statusPresentation.border,
              background: statusPresentation.background,
              color: statusPresentation.color,
            }}
          >
            <strong style={{ display: "block", fontSize: 18 }}>{statusPresentation.title}</strong>
            <div style={{ marginTop: 8, lineHeight: 1.7 }}>{statusPresentation.description}</div>
            {loading ? (
              <div style={{ marginTop: 8, opacity: 0.9 }}>
                Sincronizando retorno do Stripe{attempts > 0 ? ` · tentativa ${attempts + 1}` : ""}...
              </div>
            ) : null}
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
              gap: 12,
            }}
          >
            {steps.map((step) => (
              <div
                key={step.label}
                style={{
                  borderRadius: 16,
                  padding: 14,
                  border: step.done
                    ? "1px solid rgba(34,197,94,0.22)"
                    : "1px solid rgba(255,255,255,0.08)",
                  background: step.done ? "rgba(34,197,94,0.08)" : "rgba(255,255,255,0.03)",
                }}
              >
                <div style={{ fontSize: 13, color: "rgba(255,255,255,0.68)" }}>Etapa</div>
                <strong style={{ display: "block", marginTop: 6 }}>{step.label}</strong>
                <div style={{ marginTop: 8, color: step.done ? "#bbf7d0" : "rgba(255,255,255,0.68)" }}>
                  {step.done ? "Concluída" : "Aguardando"}
                </div>
              </div>
            ))}
          </div>

          {order ? (
            <div className="info-card" style={{ display: "grid", gap: 8 }}>
              <div><strong>Status:</strong> {order.status}</div>
              <div><strong>Total:</strong> {formatCurrency(order.totalBRL ?? 0)}</div>
              <div><strong>Email:</strong> {order.customerEmail ?? "—"}</div>
              <div><strong>Pagamento em:</strong> {order.paidAt ? new Date(order.paidAt).toLocaleString("pt-BR") : "Aguardando confirmação"}</div>
              <div><strong>Estoque sincronizado:</strong> {order.inventoryApplied ? "Sim" : "Ainda processando"}</div>
              <div><strong>Frete:</strong> {formatCurrency(order.shippingBRL ?? 0)}</div>
              <div><strong>Serviço de frete:</strong> {order.shippingServiceName ?? order.shippingProvider ?? "Fallback interno"}</div>
              <div><strong>Nota fiscal:</strong> {order.invoiceStatus ?? "pendente"}</div>
            </div>
          ) : null}

          {error ? (
            <div className="info-card" style={{ color: "#fecaca" }}>
              <strong>Atenção:</strong> {error}
            </div>
          ) : null}

          <p>Você pode continuar navegando pela loja ou abrir o resumo do pedido.</p>

          <div
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginTop: 6,
            }}
          >
            <Link href="/" className="primary-button">
              Voltar para a home
            </Link>

            {orderId ? (
              <Link href={`/order/${orderId}`} className="secondary-button">
                Ver pedido
              </Link>
            ) : null}

            <Link href="/bag" className="secondary-button">
              Ir para a bag
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell">
          <section className="content-section">
            <div className="summary-card" style={{ maxWidth: 720, margin: "0 auto" }}>
              <span className="section-eyebrow">Pedido confirmado</span>
              <h1>Carregando confirmação...</h1>
              <p>Aguarde um instante.</p>
            </div>
          </section>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
