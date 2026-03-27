"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/CartContext";

type Product = {
  id: string;
  slug: string;
  name: string;
  priceBRL: number;
  image: string;
  category?: string;
};

type ProductGridProps = {
  products: Product[];
  title?: string;
};

function formatPrice(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function ProductGrid({
  products,
  title,
}: ProductGridProps) {
  const { addItem } = useCart();

  return (
    <section className="w-full bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10 md:px-8 md:py-14">
        {title && (
          <div className="mb-8">
            <h2
              className="text-2xl font-light tracking-[0.18em] md:text-3xl"
              style={{ fontFamily: "serif" }}
            >
              {title}
            </h2>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {products.map((product) => (
            <article
              key={product.id}
              className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] transition duration-300 hover:bg-white/[0.05]"
            >
              <Link href={`/produtos/${product.slug}`} className="block">
                <div className="relative aspect-[4/5] overflow-hidden bg-white/5">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-[1.03]"
                    sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw"
                  />
                </div>
              </Link>

              <div className="space-y-4 p-5">
                <div className="space-y-2">
                  {product.category && (
                    <p className="text-[11px] uppercase tracking-[0.28em] text-white/45">
                      {product.category}
                    </p>
                  )}

                  <Link href={`/produtos/${product.slug}`} className="block">
                    <h3 className="text-lg font-light leading-snug text-white">
                      {product.name}
                    </h3>
                  </Link>

                  <p className="text-sm text-white/70">
                    {formatPrice(product.priceBRL)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    addItem({
                      id: product.id,
                      name: product.name,
                      price: product.priceBRL,
                      image: product.image,
                    })
                  }
                  className="w-full rounded-full border border-white/15 px-4 py-3 text-sm tracking-[0.18em] text-white transition hover:border-white hover:bg-white hover:text-black"
                >
                  ADICIONAR À BAG
                </button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}