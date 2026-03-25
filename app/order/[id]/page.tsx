
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { storeApi, type StoreOrder } from "@/lib/storeApi";

export default function OrderPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<StoreOrder | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    storeApi.getOrder(params.id)
      .then(setOrder)
      .catch((err) => setError(err instanceof Error ? err.message : "Erro ao carregar pedido"));
  }, [params.id]);

  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section">
        <div className="section-heading">
          <div>
            <span className="section-eyebrow">Order tracking</span>
            <h1>Order {params.id}</h1>
          </div>
          <Link href="/" className="section-link">Return home</Link>
        </div>

        {error ? <p>{error}</p> : null}

        {order ? (
          <div className="admin-shell" style={{ gridTemplateColumns: "1fr" }}>
            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>Payment and fulfillment</h2>
              </div>
              <div className="metrics-grid">
                <article className="metric-card"><span>Status</span><strong>{order.status}</strong></article>
                <article className="metric-card"><span>Inventory applied</span><strong>{order.inventoryApplied ? "Yes" : "Not yet"}</strong></article>
                <article className="metric-card"><span>Paid at</span><strong>{order.paidAt ? new Date(order.paidAt).toLocaleString() : "Awaiting confirmation"}</strong></article>
                <article className="metric-card"><span>Region</span><strong>{order.region}</strong></article>
              </div>
            </section>

            <section className="admin-panel">
              <div className="admin-panel-header">
                <h2>Items</h2>
              </div>
              <div className="admin-table-shell">
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Unit BRL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.id}>
                        <td>{item.productName ?? "Product removed"}</td>
                        <td>{item.quantity}</td>
                        <td>R$ {item.unitPriceBRL.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        ) : null}
      </section>
    </main>
  );
}
