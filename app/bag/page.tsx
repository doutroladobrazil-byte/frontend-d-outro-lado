"use client";

import { useCart } from "@/hooks/useCart";

export default function BagPage() {
  const { items, removeItem, total, subtotal, freight, tax, margin } =
    useCart();

  return (
    <main className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl mb-8">SACOLA</h1>

      {items.length === 0 && <p>Sua sacola está vazia</p>}

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex justify-between border-b border-white/10 pb-4"
          >
            <div>
              <p>{item.name}</p>
              <p>Qtd: {item.quantity}</p>
            </div>

            <div>
              <p>R$ {item.price}</p>

              <button onClick={() => removeItem(item.id)}>
                Remover
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 space-y-2 text-sm">
        <p>Subtotal: R$ {subtotal.toFixed(2)}</p>
        <p>Frete: R$ {freight.toFixed(2)}</p>
        <p>Impostos: R$ {tax.toFixed(2)}</p>
        <p>Margem: R$ {margin.toFixed(2)}</p>

        <p className="text-xl mt-4">
          Total: R$ {total.toFixed(2)}
        </p>
      </div>
    </main>
  );
}