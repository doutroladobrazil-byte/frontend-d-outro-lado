"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

type ProductActionsProps = {
  product: {
    id: string;
    productId: number;
    slug: string;
    name: string;
    priceBRL: number;
    priceLocal: number;
    currency: string;
    image: string;
    weightRange?: string;
  };
  available: boolean;
};

export default function ProductActions({
  product,
  available,
}: ProductActionsProps) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState("");

  const disabled = useMemo(() => !available, [available]);

  function decrease() {
    setQuantity((current) => Math.max(1, current - 1));
  }

  function increase() {
    setQuantity((current) => current + 1);
  }

  function handleAddToCart() {
    if (disabled) return;

    for (let i = 0; i < quantity; i += 1) {
      addItem({
        id: `${product.slug}-${Date.now()}-${i}`,
        productId: product.productId,
        slug: product.slug,
        name: product.name,
        priceBRL: product.priceBRL,
        priceLocal: product.priceLocal,
        currency: product.currency,
        image: product.image,
        weightRange: product.weightRange,
      });
    }

    setMessage("Produto adicionado ao carrinho.");
    window.setTimeout(() => {
      setMessage("");
    }, 2200);
  }

  return (
    <div
      style={{
        display: "grid",
        gap: 14,
      }}
    >
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
          onClick={decrease}
          disabled={disabled}
        >
          -
        </button>

        <div
          className="summary-card"
          style={{
            minWidth: 72,
            textAlign: "center",
            padding: "10px 14px",
          }}
        >
          {quantity}
        </div>

        <button
          type="button"
          className="secondary-button"
          onClick={increase}
          disabled={disabled}
        >
          +
        </button>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          className="primary-button"
          onClick={handleAddToCart}
          disabled={disabled}
        >
          {available ? "Adicionar ao carrinho" : "Indisponível"}
        </button>

        <Link href="/bag" className="secondary-button button-link">
          Ver carrinho
        </Link>
      </div>

      {message ? (
        <div
          style={{
            border: "1px solid rgba(189,157,106,0.25)",
            background: "rgba(189,157,106,0.08)",
            color: "rgba(255,245,228,0.9)",
            padding: 12,
            borderRadius: 14,
            fontSize: 14,
          }}
        >
          {message}
        </div>
      ) : null}
    </div>
  );
}