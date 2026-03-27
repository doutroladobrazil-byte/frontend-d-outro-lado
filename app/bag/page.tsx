"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useMemo, useState } from "react";

type BagItem = {
  id: number;
  name: string;
  description: string;
  price: number;
  quantity: number;
  image: string;
};

const initialItems: BagItem[] = [
  {
    id: 1,
    name: "Bolsa de couro premium",
    description: "Acabamento refinado, estrutura elegante e visual atemporal.",
    price: 1280,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 2,
    name: "Óculos de sol sofisticado",
    description: "Design contemporâneo com presença discreta e premium.",
    price: 690,
    quantity: 2,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1000&q=80",
  },
  {
    id: 3,
    name: "Cerâmica decorativa autoral",
    description: "Peça de presença leve para ambientes elegantes e minimalistas.",
    price: 420,
    quantity: 1,
    image:
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=1000&q=80",
  },
];

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function BagPage() {
  const [items, setItems] = useState<BagItem[]>(initialItems);

  function increaseQuantity(id: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  }

  function decreaseQuantity(id: number) {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  }

  function removeItem(id: number) {
    setItems((current) => current.filter((item) => item.id !== id));
  }

  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const estimatedShipping = useMemo(() => {
    if (items.length === 0) return 0;
    return 95;
  }, [items]);

  const total = subtotal + estimatedShipping;

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-neutral-900">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              Sua bag
            </p>
            <h1
              className="mt-3 text-3xl font-light tracking-[0.18em] sm:text-4xl"
              style={{ fontFamily: "serif" }}
            >
              D&apos;OUTRO LADO
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              Sua bag está vinculada à conta de login. Aqui o cliente pode revisar
              os produtos, alterar quantidades, remover itens e finalizar a compra.
            </p>
          </div>

          <Link
            href="/search"
            className="inline-flex items-center justify-center rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-white"
          >
            Continuar comprando
          </Link>
        </header>

        <div className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-4">
            {items.length === 0 ? (
              <div className="rounded-[30px] border border-neutral-200 bg-white p-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
                  <ShoppingBag className="h-6 w-6 text-neutral-500" />
                </div>
                <h2 className="text-xl font-medium text-neutral-900">
                  Sua bag está vazia
                </h2>
                <p className="mt-3 text-sm leading-6 text-neutral-500">
                  Adicione produtos para continuar sua experiência de compra.
                </p>
                <Link
                  href="/search"
                  className="mt-6 inline-flex rounded-2xl bg-neutral-900 px-5 py-3 text-sm font-medium text-white transition hover:opacity-95"
                >
                  Explorar produtos
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <article
                  key={item.id}
                  className="grid gap-4 rounded-[30px] border border-neutral-200 bg-white p-4 shadow-[0_20px_70px_rgba(0,0,0,0.04)] sm:grid-cols-[180px_1fr]"
                >
                  <div className="relative h-[220px] overflow-hidden rounded-[24px] bg-neutral-100 sm:h-full">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 180px"
                    />
                  </div>

                  <div className="flex flex-col justify-between gap-5 p-1">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="max-w-xl">
                        <h2 className="text-xl font-medium text-neutral-900">
                          {item.name}
                        </h2>
                        <p className="mt-2 text-sm leading-6 text-neutral-500">
                          {item.description}
                        </p>
                      </div>

                      <div className="text-left sm:text-right">
                        <p className="text-xs uppercase tracking-[0.22em] text-neutral-400">
                          Valor
                        </p>
                        <p className="mt-2 text-lg font-medium text-neutral-900">
                          {formatCurrency(item.price)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-4 border-t border-neutral-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-xs uppercase tracking-[0.22em] text-neutral-400">
                          Quantidade
                        </span>

                        <div className="flex items-center rounded-full border border-neutral-200 bg-[#fbfaf8]">
                          <button
                            type="button"
                            onClick={() => decreaseQuantity(item.id)}
                            className="flex h-11 w-11 items-center justify-center text-neutral-700 transition hover:bg-neutral-100"
                            aria-label="Diminuir quantidade"
                          >
                            <Minus className="h-4 w-4" />
                          </button>

                          <span className="min-w-[44px] text-center text-sm font-medium text-neutral-900">
                            {item.quantity}
                          </span>

                          <button
                            type="button"
                            onClick={() => increaseQuantity(item.id)}
                            className="flex h-11 w-11 items-center justify-center text-neutral-700 transition hover:bg-neutral-100"
                            aria-label="Aumentar quantidade"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-3">
                        <p className="text-sm text-neutral-500">
                          Subtotal do item:{" "}
                          <span className="font-medium text-neutral-900">
                            {formatCurrency(item.price * item.quantity)}
                          </span>
                        </p>

                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2 text-sm text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Retirar da bag
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>

          <aside className="h-fit rounded-[30px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
            <p className="text-xs uppercase tracking-[0.32em] text-neutral-500">
              Resumo
            </p>

            <h3 className="mt-3 text-2xl font-medium text-neutral-900">
              Finalizar compra
            </h3>

            <div className="mt-8 space-y-4 text-sm text-neutral-600">
              <div className="flex items-center justify-between">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">
                  {formatCurrency(subtotal)}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>Frete estimado</span>
                <span className="font-medium text-neutral-900">
                  {formatCurrency(estimatedShipping)}
                </span>
              </div>

              <div className="h-px bg-neutral-200" />

              <div className="flex items-center justify-between text-base">
                <span className="font-medium text-neutral-900">Valor total</span>
                <span className="font-semibold text-neutral-900">
                  {formatCurrency(total)}
                </span>
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button
                type="button"
                className="w-full rounded-2xl bg-neutral-900 px-5 py-4 text-sm font-medium uppercase tracking-[0.16em] text-white transition hover:opacity-95"
              >
                Finalizar compra
              </button>

              <Link
                href="/search"
                className="flex w-full items-center justify-center rounded-2xl border border-neutral-300 px-5 py-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50"
              >
                Continuar comprando
              </Link>
            </div>

            <p className="mt-6 text-xs leading-5 text-neutral-400">
              Depois integre esta página ao backend para que a bag fique realmente
              persistida por conta de usuário.
            </p>
          </aside>
        </div>
      </section>
    </main>
  );
}