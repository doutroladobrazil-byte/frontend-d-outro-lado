import type { WeightRange } from "@/lib/pricing";

export type Product = {
  id: number;
  slug: string;
  name: string;
  category: string;
  shortDescription: string;
  description: string;
  priceBRL: number;
  priceLocal: number;
  currency: string;
  image: string;
  weightRange: WeightRange;
  wholesalePriceBRL?: number | null;
  wholesaleMinQty?: number | null;
  featured?: boolean;
};

export const products: Product[] = [
  {
    id: 1,
    slug: "cafe-especial-mantiqueira",
    name: "Café Especial Mantiqueira",
    category: "gastronomia",
    shortDescription: "Notas elegantes e finalização longa.",
    description:
      "Um café premium brasileiro com perfil sensorial sofisticado, ideal para mercados de alto padrão.",
    priceBRL: 148,
    priceLocal: 29,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop",
    weightRange: "100g-1kg",
    wholesalePriceBRL: 118,
    wholesaleMinQty: 12,
    featured: true,
  },
  {
    id: 2,
    slug: "vela-botanica-brasil",
    name: "Vela Botânica Brasil",
    category: "decoracao",
    shortDescription: "Assinatura olfativa refinada.",
    description:
      "Peça de decoração sensorial com composição premium e estética contemporânea.",
    priceBRL: 219,
    priceLocal: 42,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1600&auto=format&fit=crop",
    weightRange: "1kg-3kg",
    wholesalePriceBRL: 178,
    wholesaleMinQty: 8,
    featured: true,
  },
  {
    id: 3,
    slug: "bolsa-artesanal-luxo",
    name: "Bolsa Artesanal Luxo",
    category: "moda",
    shortDescription: "Design brasileiro em acabamento premium.",
    description:
      "Bolsa de alto padrão, com presença sofisticada e proposta autoral para exportação.",
    priceBRL: 690,
    priceLocal: 129,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    weightRange: "1kg-3kg",
    wholesalePriceBRL: 560,
    wholesaleMinQty: 5,
    featured: true,
  },
  {
    id: 4,
    slug: "kit-madeira-nobre",
    name: "Kit Madeira Nobre",
    category: "casa",
    shortDescription: "Acabamento elegante e identidade brasileira.",
    description:
      "Conjunto premium para casa com estética minimalista e materiais selecionados.",
    priceBRL: 420,
    priceLocal: 78,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    weightRange: "3kg-5kg",
    wholesalePriceBRL: 348,
    wholesaleMinQty: 6,
  },
  {
    id: 5,
    slug: "chocolate-origem-brasil",
    name: "Chocolate Origem Brasil",
    category: "gastronomia",
    shortDescription: "Perfil intenso e premium.",
    description:
      "Chocolate fino brasileiro pensado para uma experiência de alto valor percebido.",
    priceBRL: 96,
    priceLocal: 19,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1600&auto=format&fit=crop",
    weightRange: "100g-1kg",
    wholesalePriceBRL: 78,
    wholesaleMinQty: 20,
  },
  {
    id: 6,
    slug: "almofada-design-tropical",
    name: "Almofada Design Tropical",
    category: "decoracao",
    shortDescription: "Textura premium e identidade visual marcante.",
    description:
      "Peça decorativa com linguagem sofisticada para ambientes exclusivos.",
    priceBRL: 184,
    priceLocal: 35,
    currency: "EUR",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    weightRange: "1kg-3kg",
    wholesalePriceBRL: 149,
    wholesaleMinQty: 10,
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getProductsByCategory(category: string) {
  return products.filter((product) => product.category === category);
}

export function getRelatedProducts(currentProductId: number, category: string) {
  return products
    .filter((product) => product.category === category && product.id !== currentProductId)
    .slice(0, 3);
}