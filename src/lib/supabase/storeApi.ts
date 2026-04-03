export type StoreProduct = {
  id: string;
  slug: string;
  name: string;
  tag: string;
  category: string;
  categorySlug: string;
  description: string;
  image: string;
  priceBRL: number;
  priceLocal: number;
  currency: string;
  weightRange: string;
  stock: number;
  available: boolean;
  wholesalePriceBRL?: number | null;
  wholesalePriceLocal?: number | null;
  wholesaleMinQty?: number | null;
};

type ListProductsResponse = {
  products: StoreProduct[];
};

const PRODUCTS: Omit<StoreProduct, "priceLocal" | "currency" | "wholesalePriceLocal">[] = [
  {
    id: "1",
    slug: "cafe-especial-mantiqueira",
    name: "Café Especial Mantiqueira",
    tag: "Gastronomia premium",
    category: "Gastronomia",
    categorySlug: "gastronomia",
    description:
      "Um café premium brasileiro com perfil sensorial sofisticado, pensado para mercados de alto padrão.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?q=80&w=1600&auto=format&fit=crop",
    priceBRL: 148,
    weightRange: "100g-1kg",
    stock: 28,
    available: true,
    wholesalePriceBRL: 118,
    wholesaleMinQty: 12,
  },
  {
    id: "2",
    slug: "vela-botanica-brasil",
    name: "Vela Botânica Brasil",
    tag: "Casa e atmosfera",
    category: "Decoração",
    categorySlug: "decoracao",
    description:
      "Peça decorativa com assinatura olfativa refinada e presença premium.",
    image:
      "https://images.unsplash.com/photo-1603006905003-be475563bc59?q=80&w=1600&auto=format&fit=crop",
    priceBRL: 219,
    weightRange: "1kg-3kg",
    stock: 16,
    available: true,
    wholesalePriceBRL: 178,
    wholesaleMinQty: 8,
  },
  {
    id: "3",
    slug: "bolsa-artesanal-luxo",
    name: "Bolsa Artesanal Luxo",
    tag: "Moda premium",
    category: "Moda",
    categorySlug: "moda-estilo-e-acessorios",
    description:
      "Bolsa premium com acabamento refinado e leitura internacional sofisticada.",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
    priceBRL: 690,
    weightRange: "1kg-3kg",
    stock: 12,
    available: true,
    wholesalePriceBRL: 560,
    wholesaleMinQty: 5,
  },
  {
    id: "4",
    slug: "kit-madeira-nobre",
    name: "Kit Madeira Nobre",
    tag: "Casa premium",
    category: "Casa",
    categorySlug: "casa-e-decoracao",
    description:
      "Conjunto premium em madeira com identidade brasileira elegante.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    priceBRL: 420,
    weightRange: "3kg-5kg",
    stock: 9,
    available: true,
    wholesalePriceBRL: 348,
    wholesaleMinQty: 6,
  },
  {
    id: "5",
    slug: "chocolate-origem-brasil",
    name: "Chocolate Origem Brasil",
    tag: "Gastronomia fina",
    category: "Gastronomia",
    categorySlug: "gastronomia",
    description:
      "Chocolate fino brasileiro com proposta sofisticada e alto valor percebido.",
    image:
      "https://images.unsplash.com/photo-1511381939415-e44015466834?q=80&w=1600&auto=format&fit=crop",
    priceBRL: 96,
    weightRange: "100g-1kg",
    stock: 44,
    available: true,
    wholesalePriceBRL: 78,
    wholesaleMinQty: 20,
  },
  {
    id: "6",
    slug: "almofada-design-tropical",
    name: "Almofada Design Tropical",
    tag: "Decoração autoral",
    category: "Decoração",
    categorySlug: "decoracao",
    description:
      "Peça decorativa com textura premium e linguagem visual marcante.",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1600&auto=format&fit=crop",
    priceBRL: 184,
    weightRange: "1kg-3kg",
    stock: 21,
    available: true,
    wholesalePriceBRL: 149,
    wholesaleMinQty: 10,
  },
];

function getCurrencyByRegion(region?: string): string {
  const value = (region ?? "").trim().toLowerCase();

  switch (value) {
    case "brazil":
    case "brasil":
      return "BRL";
    case "united states":
    case "usa":
    case "us":
      return "USD";
    case "switzerland":
    case "suica":
    case "suíça":
      return "CHF";
    default:
      return "EUR";
  }
}

function convertFromBRL(valueBRL: number, currency: string): number {
  const rates: Record<string, number> = {
    BRL: 1,
    EUR: 0.19,
    USD: 0.21,
    CHF: 0.18,
  };

  const rate = rates[currency] ?? rates.EUR;
  return Number((valueBRL * rate).toFixed(2));
}

function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function adaptProductToRegion(
  product: Omit<StoreProduct, "priceLocal" | "currency" | "wholesalePriceLocal">,
  region?: string
): StoreProduct {
  const currency = getCurrencyByRegion(region);

  return {
    ...product,
    currency,
    priceLocal: convertFromBRL(product.priceBRL, currency),
    wholesalePriceLocal:
      typeof product.wholesalePriceBRL === "number"
        ? convertFromBRL(product.wholesalePriceBRL, currency)
        : null,
  };
}

function adaptProductsToRegion(region?: string): StoreProduct[] {
  return PRODUCTS.map((product) => adaptProductToRegion(product, region));
}

export const storeApi = {
  async listProducts(region?: string): Promise<ListProductsResponse> {
    return {
      products: adaptProductsToRegion(region),
    };
  },

  async getProducts(region?: string): Promise<StoreProduct[]> {
    return adaptProductsToRegion(region);
  },

  async getFeaturedProducts(region?: string, limit = 4): Promise<StoreProduct[]> {
    return adaptProductsToRegion(region).slice(0, limit);
  },

  async getProductBySlug(
    slug: string,
    region?: string
  ): Promise<StoreProduct | null> {
    const product = PRODUCTS.find((item) => item.slug === slug);

    if (!product) {
      return null;
    }

    return adaptProductToRegion(product, region);
  },

  async getProductsByCategory(
    categorySlug: string,
    region?: string
  ): Promise<StoreProduct[]> {
    return adaptProductsToRegion(region).filter(
      (product) => product.categorySlug === categorySlug
    );
  },

  async searchProducts(query: string, region?: string): Promise<StoreProduct[]> {
    const normalizedQuery = normalizeText(query);

    if (!normalizedQuery) {
      return adaptProductsToRegion(region);
    }

    return adaptProductsToRegion(region).filter((product) => {
      const haystack = normalizeText(
        [
          product.name,
          product.tag,
          product.category,
          product.description,
          product.slug,
        ].join(" ")
      );

      return haystack.includes(normalizedQuery);
    });
  },
};