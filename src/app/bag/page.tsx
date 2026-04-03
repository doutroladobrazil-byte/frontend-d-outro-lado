"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function BagPage() {
  const {
    items,
    totalItems,
    totalBRL,
    removeItem,
    increaseItem,
    decreaseItem,
    clearCart,
  } = useCart();

  return (
    <main className="page-shell">
      <section className="content-section">
        <div
          className="summary-card"
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "grid",
            gap: 24,
          }}
        >
          <div>
            <span className="section-eyebrow">Bag</span>
            <h1 style={{ marginTop: 10 }}>Sua sacola</h1>
            <p
              style={{
                marginTop: 12,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
              }}
            >
              {totalItems} item(ns) • Total estimado:{" "}
              <strong>R$ {totalBRL.toFixed(2)}</strong>
            </p>
          </div>

          {items.length === 0 ? (
            <div
              style={{
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 24,
                padding: 24,
                background: "rgba(255,255,255,0.03)",
              }}
            >
              <h2 style={{ fontSize: 24, marginBottom: 10 }}>
                Sua bag está vazia
              </h2>
              <p
                style={{
                  color: "rgba(255,255,255,0.68)",
                  lineHeight: 1.7,
                  marginBottom: 18,
                }}
              >
                Explore o catálogo e adicione os produtos que deseja comprar.
              </p>

              <Link href="/produtos" className="primary-button button-link">
                Ir para produtos
              </Link>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gap: 16 }}>
                {items.map((item) => (
                  <article
                    key={item.id}
                    className="summary-card"
                    style={{
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
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 16,
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.name}
                          style={{
                            width: 84,
                            height: 84,
                            objectFit: "cover",
                            borderRadius: 18,
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        />

                        <div>
                          <h2 style={{ fontSize: 20 }}>{item.name}</h2>
                          <p
                            style={{
                              marginTop: 8,
                              color: "rgba(255,255,255,0.65)",
                            }}
                          >
                            {item.weightRange
                              ? `Faixa de peso: ${item.weightRange}`
                              : "Peso não informado"}
                          </p>
                          <p
                            style={{
                              marginTop: 6,
                              color: "rgba(255,255,255,0.8)",
                              fontWeight: 600,
                            }}
                          >
                            R$ {item.priceBRL.toFixed(2)} por unidade
                          </p>
                        </div>
                      </div>

                      <div
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "center",
                          flexWrap: "wrap",
                        }}
                      >
                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => decreaseItem(item.id)}
                        >
                          -
                        </button>

                        <div
                          style={{
                            minWidth: 40,
                            textAlign: "center",
                            fontWeight: 700,
                          }}
                        >
                          {item.quantity}
                        </div>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => increaseItem(item.id)}
                        >
                          +
                        </button>

                        <button
                          type="button"
                          className="secondary-button"
                          onClick={() => removeItem(item.id)}
                        >
                          Remover
                        </button>
                      </div>
                    </div>

                    <div
                      style={{
                        color: "rgba(255,255,255,0.82)",
                        fontWeight: 600,
                      }}
                    >
                      Subtotal: R$ {(item.priceBRL * item.quantity).toFixed(2)}
                    </div>
                  </article>
                ))}
              </div>

              <div
                className="summary-card"
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 16,
                  flexWrap: "wrap",
                  alignItems: "center",
                }}
              >
                <div>
                  <h2 style={{ fontSize: 24 }}>Resumo</h2>
                  <p
                    style={{
                      marginTop: 10,
                      color: "rgba(255,255,255,0.68)",
                    }}
                  >
                    Total geral: <strong>R$ {totalBRL.toFixed(2)}</strong>
                  </p>
                </div>

                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="secondary-button"
                    onClick={clearCart}
                  >
                    Limpar bag
                  </button>

                  <Link href="/checkout" className="primary-button button-link">
                    Ir para checkout
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
}