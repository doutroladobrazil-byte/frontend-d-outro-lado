"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AccessGate from "@/components/auth/AccessGate";

type AdminOrderItem = {
  id: string;
  productId?: number | null;
  productName?: string | null;
  productImage?: string | null;
  quantity: number;
  unitPriceBRL: number;
};

type OrderStatus = "pending" | "paid" | "preparing" | "shipped" | "cancelled";

type AdminOrder = {
  id: string;
  customerName?: string;
  customerEmail?: string;
  region: string;
  status: OrderStatus;
  totalBRL: number;
  paidAt?: string | null;
  inventoryApplied?: boolean;
  createdAt?: string;
  updatedAt?: string;
  stripePaymentStatus?: string | null;
  checkoutCurrency?: string | null;
  shippingBRL?: number;
  shippingProvider?: string | null;
  shippingServiceName?: string | null;
  shippingDeliveryDays?: number | null;
  invoiceStatus?: string | null;
  invoiceProvider?: string | null;
  invoiceNumber?: string | null;
  invoiceMessage?: string | null;
  invoicePdfUrl?: string | null;
  items: AdminOrderItem[];
};

const API_BASE = "/api/admin/orders";
const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: "Pendente",
  paid: "Pago",
  preparing: "Preparando",
  shipped: "Enviado",
  cancelled: "Cancelado",
};

const STATUS_STYLE: Record<OrderStatus, { border: string; background: string; color: string }> = {
  pending: {
    border: "1px solid rgba(250, 204, 21, 0.25)",
    background: "rgba(250, 204, 21, 0.10)",
    color: "#fde68a",
  },
  paid: {
    border: "1px solid rgba(34, 197, 94, 0.24)",
    background: "rgba(34, 197, 94, 0.10)",
    color: "#bbf7d0",
  },
  preparing: {
    border: "1px solid rgba(96, 165, 250, 0.24)",
    background: "rgba(96, 165, 250, 0.10)",
    color: "#bfdbfe",
  },
  shipped: {
    border: "1px solid rgba(167, 139, 250, 0.24)",
    background: "rgba(167, 139, 250, 0.10)",
    color: "#ddd6fe",
  },
  cancelled: {
    border: "1px solid rgba(248, 113, 113, 0.24)",
    background: "rgba(248, 113, 113, 0.10)",
    color: "#fecaca",
  },
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getAllowedActions(status: OrderStatus): OrderStatus[] {
  switch (status) {
    case "pending":
      return ["paid", "cancelled"];
    case "paid":
      return ["preparing", "cancelled"];
    case "preparing":
      return ["shipped", "cancelled"];
    default:
      return [];
  }
}

function getStatusPill(status: OrderStatus) {
  const style = STATUS_STYLE[status];
  return {
    ...style,
    borderRadius: 999,
    padding: "8px 14px",
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.2,
  } as const;
}

function AdminOrdersContent() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<"all" | OrderStatus>("all");
  const [search, setSearch] = useState("");

  async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(path, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(init?.headers ?? {}),
      },
      credentials: "include",
      cache: "no-store",
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      throw new Error(data?.message || data?.error || "Falha ao comunicar com a API.");
    }

    return (data?.data ?? data) as T;
  }

  async function loadOrders() {
    try {
      setLoading(true);
      setError("");
      const data = await requestJson<AdminOrder[]>(API_BASE);
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível carregar os pedidos.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const summary = useMemo(() => {
    return {
      total: orders.length,
      pending: orders.filter((item) => item.status === "pending").length,
      paid: orders.filter((item) => item.status === "paid").length,
      preparing: orders.filter((item) => item.status === "preparing").length,
      shipped: orders.filter((item) => item.status === "shipped").length,
      totalAmount: orders.reduce((acc, item) => acc + item.totalBRL, 0),
    };
  }, [orders]);

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return orders.filter((order) => {
      const matchesStatus = statusFilter === "all" ? true : order.status === statusFilter;
      if (!matchesStatus) return false;
      if (!normalizedSearch) return true;

      const haystack = [
        order.id,
        order.customerName ?? "",
        order.customerEmail ?? "",
        order.region ?? "",
        ...order.items.map((item) => item.productName ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      return haystack.includes(normalizedSearch);
    });
  }, [orders, search, statusFilter]);


  async function retryInvoice(orderId: string) {
    try {
      setSavingId(orderId);
      setError("");
      setSuccess("");

      const updated = await requestJson<AdminOrder>(`${API_BASE}/${orderId}/invoice`, {
        method: "POST",
      });

      setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
      setSuccess(`Reprocessamento fiscal solicitado para o pedido ${orderId}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível reenviar a nota.");
    } finally {
      setSavingId(null);
    }
  }

  async function updateStatus(orderId: string, status: OrderStatus) {
    try {
      setSavingId(orderId);
      setError("");
      setSuccess("");

      const updated = await requestJson<AdminOrder>(`${API_BASE}/${orderId}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });

      setOrders((current) => current.map((order) => (order.id === orderId ? updated : order)));
      setSuccess(`Pedido ${orderId} atualizado para ${STATUS_LABEL[status].toLowerCase()}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível atualizar o pedido.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="page-shell">
      <section className="content-section">
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            display: "grid",
            gap: 24,
          }}
        >
          <div className="summary-card">
            <span className="section-eyebrow">Administração</span>
            <h1 style={{ marginTop: 10 }}>Gestão de pedidos</h1>
            <p
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
              }}
            >
              Agora o painel já controla status operacionais, valida confirmação de pagamento e
              destaca se a baixa de estoque foi aplicada corretamente.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div className="summary-card">
              <strong>Total de pedidos</strong>
              <div style={{ marginTop: 8 }}>{summary.total}</div>
            </div>

            <div className="summary-card">
              <strong>Pendentes</strong>
              <div style={{ marginTop: 8 }}>{summary.pending}</div>
            </div>

            <div className="summary-card">
              <strong>Pagos / preparando</strong>
              <div style={{ marginTop: 8 }}>{summary.paid + summary.preparing}</div>
            </div>

            <div className="summary-card">
              <strong>Enviados</strong>
              <div style={{ marginTop: 8 }}>{summary.shipped}</div>
            </div>

            <div className="summary-card">
              <strong>Total movimentado</strong>
              <div style={{ marginTop: 8 }}>{formatBRL(summary.totalAmount)}</div>
            </div>
          </div>

          <div
            className="summary-card"
            style={{
              display: "grid",
              gap: 14,
            }}
          >
            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Buscar por pedido, cliente ou produto"
                  style={{
                    minWidth: 280,
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "white",
                  }}
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value as "all" | OrderStatus)}
                  style={{
                    padding: "12px 14px",
                    borderRadius: 14,
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: "rgba(255,255,255,0.03)",
                    color: "white",
                  }}
                >
                  <option value="all">Todos os status</option>
                  <option value="pending">Pendentes</option>
                  <option value="paid">Pagos</option>
                  <option value="preparing">Preparando</option>
                  <option value="shipped">Enviados</option>
                  <option value="cancelled">Cancelados</option>
                </select>
              </div>

              <button type="button" onClick={loadOrders} className="secondary-button">
                Atualizar lista
              </button>
            </div>

            {success ? <div style={{ color: "#d1fae5" }}>{success}</div> : null}
            {error ? <div style={{ color: "#fecaca" }}>{error}</div> : null}
          </div>

          <div className="summary-card">
            <h2>Pedidos registrados</h2>

            {loading ? (
              <div style={{ marginTop: 18 }}>Carregando pedidos...</div>
            ) : filteredOrders.length === 0 ? (
              <div style={{ marginTop: 18 }}>Nenhum pedido encontrado com os filtros atuais.</div>
            ) : (
              <div style={{ display: "grid", gap: 16, marginTop: 18 }}>
                {filteredOrders.map((order) => {
                  const allowedActions = getAllowedActions(order.status);
                  const paymentConfirmed = order.status !== "pending" || order.stripePaymentStatus === "paid";
                  const stockReady = order.inventoryApplied || order.status === "pending" || order.status === "cancelled";
                  const isSaving = savingId === order.id;

                  return (
                    <article
                      key={order.id}
                      style={{
                        padding: 16,
                        borderRadius: 18,
                        border: "1px solid rgba(255,255,255,0.08)",
                        background: "rgba(255,255,255,0.02)",
                        display: "grid",
                        gap: 16,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: 16,
                          flexWrap: "wrap",
                          alignItems: "start",
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: 20 }}>{order.id}</strong>
                          <div
                            style={{
                              marginTop: 8,
                              color: "rgba(255,255,255,0.68)",
                              lineHeight: 1.7,
                              fontSize: 14,
                            }}
                          >
                            {order.customerName ?? "Sem nome"} · {order.customerEmail ?? "Sem email"}
                          </div>
                        </div>

                        <div style={getStatusPill(order.status)}>{STATUS_LABEL[order.status]}</div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 12,
                          flexWrap: "wrap",
                          color: "rgba(255,255,255,0.82)",
                          fontSize: 14,
                        }}
                      >
                        <span>Região: {order.region}</span>
                        <span>Total: {formatBRL(order.totalBRL)}</span>
                        <span>Itens: {order.items.length}</span>
                        <span>
                          Pagamento: {paymentConfirmed ? "Confirmado" : "Aguardando confirmação"}
                        </span>
                        <span>Estoque: {stockReady ? "OK" : "Aguardando baixa"}</span>
                        <span>
                          Criado em: {order.createdAt ? new Date(order.createdAt).toLocaleString("pt-BR") : "—"}
                        </span>
                        <span>
                          Pago em: {order.paidAt ? new Date(order.paidAt).toLocaleString("pt-BR") : "—"}
                        </span>
                      </div>

                      <div
                        style={{
                          display: "grid",
                          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                          gap: 12,
                        }}
                      >
                        <div
                          style={{
                            borderRadius: 16,
                            border: paymentConfirmed
                              ? "1px solid rgba(34,197,94,0.22)"
                              : "1px solid rgba(250,204,21,0.22)",
                            background: paymentConfirmed
                              ? "rgba(34,197,94,0.08)"
                              : "rgba(250,204,21,0.08)",
                            padding: 14,
                          }}
                        >
                          <strong>Pagamento</strong>
                          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
                            {order.stripePaymentStatus ? `Stripe: ${order.stripePaymentStatus}` : "Sem retorno do Stripe"}
                          </div>
                        </div>

                        <div
                          style={{
                            borderRadius: 16,
                            border: stockReady
                              ? "1px solid rgba(34,197,94,0.22)"
                              : "1px solid rgba(96,165,250,0.22)",
                            background: stockReady
                              ? "rgba(34,197,94,0.08)"
                              : "rgba(96,165,250,0.08)",
                            padding: 14,
                          }}
                        >
                          <strong>Estoque</strong>
                          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
                            {order.inventoryApplied
                              ? "Baixa aplicada automaticamente no estoque."
                              : order.status === "pending"
                                ? "Será aplicado ao confirmar pagamento."
                                : "Aguardando sincronização da baixa."}
                          </div>
                        </div>

                        <div
                          style={{
                            borderRadius: 16,
                            border: "1px solid rgba(255,255,255,0.08)",
                            background: "rgba(255,255,255,0.03)",
                            padding: 14,
                          }}
                        >
                          <strong>Moeda checkout</strong>
                          <div style={{ marginTop: 8, color: "rgba(255,255,255,0.78)", lineHeight: 1.6 }}>
                            {order.checkoutCurrency ?? "BRL / padrão"}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "grid", gap: 10 }}>
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              gap: 12,
                              flexWrap: "wrap",
                              borderRadius: 14,
                              padding: 12,
                              border: "1px solid rgba(255,255,255,0.06)",
                              background: "rgba(255,255,255,0.015)",
                            }}
                          >
                            <span>{item.productName ?? "Produto removido"}</span>
                            <span>
                              {item.quantity} × {formatBRL(item.unitPriceBRL)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          flexWrap: "wrap",
                          gap: 10,
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                          {allowedActions.map((nextStatus) => (
                            <button
                              key={nextStatus}
                              type="button"
                              className="secondary-button"
                              onClick={() => updateStatus(order.id, nextStatus)}
                              disabled={isSaving}
                              style={{ opacity: isSaving ? 0.7 : 1 }}
                            >
                              {isSaving ? "Salvando..." : `Marcar como ${STATUS_LABEL[nextStatus].toLowerCase()}`}
                            </button>
                          ))}
                        </div>

                        <Link href={`/order/${order.id}`} className="secondary-button">
                          Abrir pedido
                        </Link>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AdminOrdersPage() {
  return (
  <AccessGate requireAuth requireAdmin>
      <AdminOrdersContent />
    </AccessGate>
  );
}
