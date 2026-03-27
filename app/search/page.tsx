"use client";

import { Search } from "lucide-react";
import { useMemo, useState } from "react";

type Product = {
  id: number;
  name: string;
  description: string;
};

const products: Product[] = [
  {
    id: 1,
    name: "Bolsa de couro premium",
    description: "Bolsa elegante com acabamento refinado e design atemporal.",
  },
  {
    id: 2,
    name: "Bolsa de crochê artesanal",
    description: "Peça autoral sofisticada com textura leve e visual premium.",
  },
  {
    id: 3,
    name: "Cerâmica decorativa",
    description: "Objeto minimalista para compor ambientes elegantes.",
  },
  {
    id: 4,
    name: "Carteira de couro",
    description: "Carteira compacta com acabamento premium e linhas discretas.",
  },
  {
    id: 5,
    name: "Óculos de sol sofisticado",
    description: "Acessório contemporâneo com presença elegante.",
  },
];

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export default function SearchPage() {
  const [query, setQuery] = useState("");

  const filteredProducts = useMemo(() => {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) return products;

    return products.filter((product) => {
      const content = normalizeText(`${product.name} ${product.description}`);
      return content.includes(normalizedQuery);
    });
  }, [query]);

  return (
    <main className="container-premium section-spacing">
      <section className="card-premium" style={{ padding: "24px" }}>
        <p
          style={{
            margin: 0,
            fontSize: 12,
            letterSpacing: "0.32em",
            textTransform: "uppercase",
            color: "#6b6b6b",
          }}
        >
          Pesquisa
        </p>

        <h1
          style={{
            marginTop: 12,
            marginBottom: 24,
            fontFamily:
              '"Iowan Old Style", "Palatino Linotype", "Book Antiqua", Palatino, Georgia, serif',
            fontWeight: 400,
            letterSpacing: "0.12em",
            fontSize: "clamp(2rem, 4vw, 3rem)",
          }}
        >
          Buscar produtos
        </h1>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            border: "1px solid rgba(23,23,23,0.08)",
            background: "#fbfaf8",
            borderRadius: 22,
            padding: "14px 16px",
          }}
        >
          <Search size={18} color="#6b6b6b" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por nome ou descrição..."
            style={{
              border: "none",
              outline: "none",
              background: "transparent",
              width: "100%",
              fontSize: 15,
            }}
          />
        </div>

        <div style={{ marginTop: 24, display: "grid", gap: 16 }}>
          {filteredProducts.length === 0 ? (
            <div
              style={{
                border: "1px solid rgba(23,23,23,0.08)",
                borderRadius: 22,
                padding: 20,
                background: "rgba(255,255,255,0.78)",
              }}
            >
              Nenhum produto encontrado.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <article
                key={product.id}
                style={{
                  border: "1px solid rgba(23,23,23,0.08)",
                  borderRadius: 22,
                  padding: 20,
                  background: "rgba(255,255,255,0.78)",
                }}
              >
                <h2 style={{ margin: 0, fontSize: 18 }}>{product.name}</h2>
                <p
                  style={{
                    marginTop: 10,
                    marginBottom: 0,
                    color: "#5f5f5f",
                    lineHeight: 1.7,
                    fontSize: 14,
                  }}
                >
                  {product.description}
                </p>
              </article>
            ))
          )}
        </div>
      </section>
    </main>
  );
}