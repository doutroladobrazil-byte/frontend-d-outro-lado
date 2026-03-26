export type Product = {
  id: string;
  slug: string;
  name: string;
  category: string;
  subtitle: string;
  description: string;
  details: string[];
  basePrice: number;
  images: string[];
};

export const products: Product[] = [
  {
    id: "bolsa-couro-premium-001",
    slug: "bolsa-couro-premium",
    name: "Bolsa de Couro Premium",
    category: "Moda, vestuário e acessórios",
    subtitle: "Elegância brasileira com leitura internacional",
    description:
      "Uma peça sofisticada, com presença visual forte, acabamento refinado e linguagem premium. Ideal para compor uma curadoria internacional de acessórios brasileiros com alto valor percebido.",
    details: [
      "Couro com estética elegante e acabamento premium",
      "Silhueta versátil para uso urbano e sofisticado",
      "Leitura internacional para catálogo de exportação",
      "Peça com forte apelo visual e comercial",
    ],
    basePrice: 240,
    images: [
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?auto=format&fit=crop&w=1400&q=80",
    ],
  },
  {
    id: "ceramica-autoral-001",
    slug: "ceramica-autoral",
    name: "Cerâmica Autoral",
    category: "Cerâmica, decorações e enxoval",
    subtitle: "Decoração sofisticada para interiores contemporâneos",
    description:
      "Peça autoral com visual minimalista e presença refinada. Pensada para clientes que valorizam autenticidade, textura e design na composição de ambientes premium.",
    details: [
      "Estética minimalista e sofisticada",
      "Peça decorativa com forte presença visual",
      "Ideal para curadoria internacional de casa e decoração",
      "Boa leitura comercial em ambientes premium",
    ],
    basePrice: 180,
    images: [
      "https://images.unsplash.com/photo-1612196808214-b7e239e5fb77?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1517705008128-361805f42e86?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80",
    ],
  },
];

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug);
}