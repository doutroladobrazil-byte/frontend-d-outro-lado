"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
  category: string;
  price: number;
  image: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Bolsa de couro premium",
    description: "Bolsa estruturada com acabamento refinado e presença elegante.",
    category: "couro",
    price: 1280,
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: "Bolsa de crochê artesanal",
    description: "Peça leve, sofisticada e autoral com textura delicada.",
    category: "crochê",
    price: 760,
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: "Cerâmica decorativa autoral",
    description: "Objeto elegante para compor ambientes contemporâneos.",
    category: "cerâmica",
    price: 420,
    image:
      "https://images.unsplash.com/photo-1616627547584-bf28cee262db?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: "Carteira de couro minimalista",
    description: "Carteira compacta com visual discreto e acabamento premium.",
    category: "couro",
    price: 340,
    image:
      "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 5,
    name: "Óculos de sol sofisticado",
    description: "Design elegante com leitura contemporânea e premium.",
    category: "acessórios",
    price: 690,
    image:
      "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 6,
    name: "Necessaire de couro",
    description: "Peça funcional, refinada e ideal para uso cotidiano premium.",
    category: "couro",
    price: 390,
    image:
      "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1200&q=80",
  },
];

const synonymMap: Record<string, string[]> = {
  bolsa: ["bolsa", "bag", "handbag", "crochê", "couro"],
  couro: ["couro", "leather", "carteira", "necessaire", "bolsa"],
  ceramica: ["cerâmica", "ceramica", "vaso", "prato", "decoração", "decorativa"],
  croche: ["crochê", "croche", "artesanal", "trama", "bolsa"],
  oculos: ["óculos", "oculos", "solar", "sunglasses", "acessórios"],
  carteira: ["carteira", "wallet", "couro"],
  decoracao: ["decoração", "decoracao", "casa", "cerâmica", "vaso"],
};

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function expandTerms(query: string) {
  const normalized = normalizeText(query);
  if (!normalized) return [];

  const words = normalized.split(/\s+/).filter(Boolean);
  const expanded = new Set<string>();

  for (const word of words) {
    expanded.add(word);

    for (const [key, synonyms] of Object.entries(synonymMap)) {
      if (key.includes(word) || word.includes(key) || synonyms.includes(word)) {
        expanded.add(key);
        synonyms.forEach((term) => expanded.add(normalizeText(term)));
      }
    }
  }

  return Array.from(expanded);
}

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [bagCount, setBagCount] = useState(2);

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) return products;

    const expandedTerms = expandTerms(normalizedQuery);

    return [...products]
      .map((product) => {
        const haystack = normalizeText(
          `${product.name} ${product.description} ${product.category}`
        );

        let score = 0;

        if (normalizeText(product.name).includes(normalizedQuery)) score += 10;
        if (normalizeText(product.description).includes(normalizedQuery)) score += 6;
        if (normalizeText(product.category).includes(normalizedQuery)) score += 5;

        for (const term of expandedTerms) {
          if (normalizeText(product.name).includes(term)) score += 4;
          if (normalizeText(product.description).includes(term)) score += 2;
          if (normalizeText(product.category).includes(term)) score += 2;
          if (haystack.includes(term)) score += 1;
        }

        return { ...product, score };
      })
      .filter((product) => product.score > 0)
      .sort((a, b) => b.score - a.score);
  }, [query]);

  function handleAddToBag(productName: string) {
    setBagCount((prev) => prev + 1);
    alert(`${productName} adicionado à bag.`);
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-neutral-900">
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <header className="mb-8 flex flex-col gap-4 border-b border-neutral-200 pb-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
              Pesquisa premium
            </p>
            <h1
              className="mt-3 text-3xl font-light tracking-[0.18em] sm:text-4xl"
              style={{ fontFamily: "serif" }}
            >
              D&apos;OUTRO LADO
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
              A busca considera nome, descrição e termos semelhantes para encontrar
              produtos com mais inteligência e refinamento.
            </p>
          </div>

          <Link
            href="/bag"
            className="inline-flex items-center gap-3 rounded-2xl border border-neutral-300 px-5 py-3 text-sm font-medium text-neutral-900 transition hover:bg-white"
          >
            <ShoppingBag className="h-4 w-4" />
            Bag ({bagCount})
          </Link>
        </header>

        <div className="mb-8 rounded-[30px] border border-neutral-200 bg-white p-4 shadow-[0_20px_70px_rgba(0,0,0,0.04)] sm:p-5">
          <div className="flex items-center gap-4 rounded-[22px] border border-neutral-200 bg-[#fbfaf8] px-4 py-4">
            <Search className="h-5 w-5 text-neutral-400" />

            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busque por bolsas, couro, cerâmica, crochê..."
              className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            {["Crochê", "Couro", "Cerâmica", "Carteira", "Óculos", "Decoração"].map(
              (term) => (
                <button
                  key={term}
                  type="button"
                  onClick={() => setQuery(term)}
                  className="rounded-full border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-700 transition hover:bg-neutral-50"
                >
                  {term}
                </button>
              )
            )}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="rounded-[30px] border border-neutral-200 bg-white p-10 text-center shadow-[0_20px_70px_rgba(0,0,0,0.04)]">
            <h2 className="text-xl font-medium text-neutral-900">
              Nenhum produto encontrado
            </h2>
            <p className="mt-3 text-sm leading-6 text-neutral-500">
              Tente outro termo ou use palavras como couro, crochê, cerâmica,
              decoração ou bolsa.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <article
                key={product.id}
                className="overflow-hidden rounded-[30px] border border-neutral-200 bg-white shadow-[0_20px_70px_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-1"
              >
                <div className="relative h-[320px] bg-neutral-100">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1280px) 50vw, 33vw"
                  />
                </div>

                <div className="p-6">
                  <p className="text-xs uppercase tracking-[0.26em] text-neutral-400">
                    {product.category}
                  </p>

                  <h2 className="mt-3 text-xl font-medium text-neutral-900">
                    {product.name}
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-neutral-500">
                    {product.description}
                  </p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <p className="text-lg font-semibold text-neutral-900">
                      {formatCurrency(product.price)}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleAddToBag(product.name)}
                      className="rounded-full bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-95"
                    >
                      Adicionar à bag
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}