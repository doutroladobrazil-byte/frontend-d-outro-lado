"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import type { Product } from "@/data/products";
import { useCart } from "@/hooks/useCart";

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function ProductDetailClient({
  product,
}: {
  product: Product;
}) {
  const { addItem } = useCart();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const subtotal = product.basePrice * quantity;
  const freight = subtotal * 0.15;
  const tax = subtotal * 0.1;
  const margin = subtotal * 0.6;
  const suggestedPrice = subtotal + freight + tax + margin;

  const pricing = useMemo(
    () => ({
      subtotal,
      freight,
      tax,
      margin,
      suggestedPrice,
    }),
    [subtotal, freight, tax, margin, suggestedPrice]
  );

  function handleAddToBag() {
    addItem({
      id: product.id,
      slug: product.slug,
      name: product.name,
      image: product.images[0],
      price: product.basePrice,
      quantity,
    });

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 2000);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-10">
        <div className="mb-8">
          <Link
            href="/"
            className="text-[11px] uppercase tracking-[0.3em] text-white/60 transition hover:text-white"
          >
            Voltar
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03]">
              <div
                className="h-[460px] w-full bg-cover bg-center sm:h-[560px] lg:h-[720px]"
                style={{
                  backgroundImage: `url('${product.images[selectedImage]}')`,
                }}
              />
            </div>

            <div className="mt-4 grid grid-cols-4 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={`overflow-hidden rounded-[20px] border transition ${
                    selectedImage === index
                      ? "border-white/40"
                      : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div
                    className="h-24 w-full bg-cover bg-center sm:h-28"
                    style={{ backgroundImage: `url('${image}')` }}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:pt-4">
            <p className="mb-3 text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
              {product.category}
            </p>

            <h1
              className="text-4xl font-light leading-[0.95] text-white sm:text-5xl lg:text-6xl"
              style={{ fontFamily: "serif" }}
            >
              {product.name}
            </h1>

            <p className="mt-4 text-sm uppercase tracking-[0.28em] text-white/65">
              {product.subtitle}
            </p>

            <p className="mt-8 max-w-2xl text-sm leading-8 text-white/78 sm:text-base">
              {product.description}
            </p>

            <div className="mt-8 rounded-[28px] border border-white/10 bg-white/[0.03] p-6">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb899]">
                Preço base
              </p>
              <p className="mt-2 text-3xl font-light text-white">
                {formatBRL(product.basePrice)}
              </p>

              <div className="mt-6 grid grid-cols-1 gap-3 text-sm text-white/75 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p>Subtotal</p>
                  <p className="mt-2 text-lg text-white">
                    {formatBRL(pricing.subtotal)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p>Frete estimado</p>
                  <p className="mt-2 text-lg text-white">
                    {formatBRL(pricing.freight)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p>Impostos</p>
                  <p className="mt-2 text-lg text-white">
                    {formatBRL(pricing.tax)}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/8 bg-black/20 p-4">
                  <p>Margem sugerida</p>
                  <p className="mt-2 text-lg text-white">
                    {formatBRL(pricing.margin)}
                  </p>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <p className="text-[11px] uppercase tracking-[0.32em] text-[#cdb899]">
                  Preço final sugerido
                </p>
                <p className="mt-2 text-3xl font-light text-white">
                  {formatBRL(pricing.suggestedPrice)}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <p className="mb-3 text-[11px] uppercase tracking-[0.32em] text-[#cdb899]">
                Quantidade
              </p>

              <div className="flex w-fit items-center rounded-full border border-white/10 bg-white/[0.03]">
                <button
                  type="button"
                  onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                  className="p-4 text-white/80 transition hover:text-white"
                >
                  <Minus size={16} />
                </button>

                <span className="min-w-[56px] text-center text-base">
                  {quantity}
                </span>

                <button
                  type="button"
                  onClick={() => setQuantity((prev) => prev + 1)}
                  className="p-4 text-white/80 transition hover:text-white"
                >
                  <Plus size={16} />
                </button>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleAddToBag}
                className="inline-flex items-center gap-3 rounded-full border border-white/20 px-7 py-4 text-[11px] uppercase tracking-[0.32em] text-white transition hover:bg-white hover:text-black"
              >
                <ShoppingBag size={16} />
                Adicionar à sacola
              </button>

              <Link
                href="/bag"
                className="inline-flex items-center rounded-full border border-white/10 px-7 py-4 text-[11px] uppercase tracking-[0.32em] text-white/80 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
              >
                Ver sacola
              </Link>
            </div>

            {added && (
              <p className="mt-4 text-sm text-[#cdb899]">
                Produto adicionado à sacola.
              </p>
            )}

            <div className="mt-10 border-t border-white/10 pt-8">
              <p className="mb-4 text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
                Destaques do produto
              </p>

              <ul className="space-y-4 text-sm leading-7 text-white/75 sm:text-base">
                {product.details.map((detail) => (
                  <li key={detail} className="border-b border-white/6 pb-4">
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}