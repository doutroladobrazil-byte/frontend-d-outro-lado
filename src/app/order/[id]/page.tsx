import Link from "next/link";
import { notFound } from "next/navigation";
import { storeApi } from "@/lib/storeApi";

type OrderPageProps = {
  params: Promise<{
    id: string;
  }>;
};

function formatCurrency(value: number, currency = "BRL", locale = "pt-BR") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
}

function getStatusAppearance(status: string) {
  switch (status) {
    case "paid":
      return {
        label: "Pago",
        border: "1px solid rgba(34,197,94,0.22)",
        background: "rgba(34,197,94,0.10)",
        color: "#bbf7d0",
      };
    case "preparing":
      return {
        label: "Preparando",
        border: "1px solid rgba(96,165,250,0.22)",
        background: "rgba(96,165,250,0.10)",
        color: "#bfdbfe",
      };
    case "shipped":
      return {
        label: "Enviado",
        border: "1px solid rgba(167,139,250,0.22)",
        background: "rgba(167,139,250,0.10)",
        color: "#ddd6fe",
      };
    case "cancelled":
      return {
        label: "Cancelado",
        border: "1px solid rgba(248,113,113,0.22)",
        background: "rgba(248,113,113,0.10)",
        color: "#fecaca",
      };
    default:
      return {
        label: "Pendente",
        border: "1px solid rgba(250,204,21,0.22)",
        background: "rgba(250,204,21,0.10)",
        color: "#fde68a",
      };
  }
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

  const order = await storeApi.getOrder(id).catch(() => null);

  if (!order) {
    notFound();
  }

  const status = getStatusAppearance(order.status);

  return (
    <main className="page-shell">
      <section className="content-section">
        <div
          style={{
            maxWidth: 1240,
            margin: "0 auto",
            display: "grid",
            gap: 24,
          }}
        >
          <div className="summary-card">
            <span className="section-eyebrow">Pedido</span>
            <h1 style={{ marginTop: 10 }}>Resumo do pedido {order.id}</h1>

            <p
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
              }}
            >
              Esta página já mostra o status operacional do pagamento, da baixa de estoque e do
              andamento do pedido no painel administrativo.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1.2fr) minmax(320px, 0.8fr)",
              gap: 24,
              alignItems: "start",
            }}
          >
            <div className="summary-card">
              <h2>Itens do pedido</h2>

              <div style={{ display: "grid", gap: 14, marginTop: 18 }}>
                {order.items.map((item) => (
                  <article
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
                        border: "1px solid rgba(255,255,255,0.08)",
                      }}
                    >
                      {item.productImage ? (
                        <img
                          src={item.productImage}
                          alt={item.productName ?? "Produto"}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: "block",
                          }}
                        />
                      ) : null}
                    </div>

                    <div>
                      <strong>{item.productName ?? "Produto removido"}</strong>

                      <div
                        style={{
                          marginTop: 6,
                          color: "rgba(255,255,255,0.68)",
                          fontSize: 14,
                        }}
                      >
                        Quantidade: {item.quantity}
                      </div>

                      <div
                        style={{
                          marginTop: 6,
                          color: "rgba(255,255,255,0.68)",
                          fontSize: 14,
                        }}
                      >
                        Valor unitário: {formatCurrency(item.unitPriceBRL)}
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside style={{ display: "grid", gap: 16 }}>
              <div className="summary-card">
                <h2>Informações do pedido</h2>

                <div
                  style={{
                    marginTop: 18,
                    display: "grid",
                    gap: 12,
                    color: "rgba(255,255,255,0.84)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Status</span>
                    <strong
                      style={{
                        border: status.border,
                        background: status.background,
                        color: status.color,
                        padding: "8px 12px",
                        borderRadius: 999,
                      }}
                    >
                      {status.label}
                    </strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Região</span>
                    <strong>{order.region}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Total</span>
                    <strong>{formatCurrency(order.totalBRL ?? 0)}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Cliente</span>
                    <strong>{order.customerName ?? "—"}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Email</span>
                    <strong>{order.customerEmail ?? "—"}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Pagamento confirmado</span>
                    <strong>{order.paidAt ? new Date(order.paidAt).toLocaleString("pt-BR") : "Aguardando"}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Baixa de estoque</span>
                    <strong>{order.inventoryApplied ? "Aplicada" : "Aguardando"}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Frete</span>
                    <strong>
                      {formatCurrency(order.shippingBRL ?? 0)}
                      {order.shippingServiceName ? ` · ${order.shippingServiceName}` : ""}
                    </strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Nota fiscal</span>
                    <strong>{order.invoiceStatus ?? "pendente"}</strong>
                  </div>

                  <div style={{ display: "flex", justifyContent: "space-between", gap: 16 }}>
                    <span>Criado em</span>
                    <strong>
                      {order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "—"}
                    </strong>
                  </div>
                </div>

                <div style={{ display: "grid", gap: 12, marginTop: 22 }}>
                  <Link href="/" className="secondary-button button-link">
                    Voltar para a home
                  </Link>

                  <Link href="/bag" className="secondary-button button-link">
                    Ver carrinho
                  </Link>
                </div>
              </div>

              <div className="summary-card">
                <strong>Confirmação visual</strong>
                <p
                  style={{
                    marginTop: 12,
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.7,
                  }}
                >
                  Quando o pagamento é confirmado, o sistema marca o pedido como pago, aplica a
                  baixa automática de estoque apenas uma vez e tenta encaminhar a emissão fiscal.
                </p>
              </div>
            </aside>
          </div>
        </div>
      </section>
    </main>
  );
}
