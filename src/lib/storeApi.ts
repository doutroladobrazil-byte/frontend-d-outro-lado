const API_URL = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "");

function resolveUrl(path: string) {
  return API_URL ? `${API_URL}${path}` : path;
}

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
  featured?: boolean;
  wholesalePriceBRL?: number | null;
  wholesalePriceLocal?: number | null;
  wholesaleMinQty?: number | null;
};

export type StoreOrderItem = {
  id: string;
  productId?: number | null;
  productName?: string;
  productImage?: string | null;
  quantity: number;
  unitPriceBRL: number;
};

export type StoreOrder = {
  id: string;
  customerName?: string;
  customerEmail?: string;
  customerDocument?: string | null;
  destinationZip?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  region: string;
  status: string;
  totalBRL?: number;
  shippingBRL?: number;
  shippingProvider?: string | null;
  shippingServiceCode?: string | null;
  shippingServiceName?: string | null;
  shippingDeliveryDays?: number | null;
  paidAt?: string | null;
  inventoryApplied?: boolean;
  invoiceStatus?: string | null;
  invoiceProvider?: string | null;
  invoiceId?: string | null;
  invoiceNumber?: string | null;
  invoicePdfUrl?: string | null;
  invoiceXmlUrl?: string | null;
  invoiceMessage?: string | null;
  createdAt?: string;
  items: StoreOrderItem[];
};

type ListProductsResponse = {
  region: string;
  currency: string;
  shippingBaseBRL: number;
  products: StoreProduct[];
};

type CheckoutPayload = {
  customerName: string;
  customerEmail: string;
  customerDocument?: string;
  destinationZip: string;
  addressCity?: string;
  addressState?: string;
  region: string;
  locale: string;
  items: { productId: number; quantity: number }[];
};

type CheckoutResponse = {
  mode: "demo" | "stripe";
  checkoutUrl: string | null;
  orderId: string;
  sessionId?: string;
  totalBRL: number;
  subtotalBRL?: number;
  shippingBRL?: number;
  message?: string;
};

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(resolveUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
    credentials: "include",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || data?.error || "Falha ao comunicar com a API do projeto.");
  }

  return data as T;
}

function normalizeText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

export const storeApi = {
  async listProducts(
    region?: string,
    options?: { categorySlug?: string; featured?: boolean }
  ): Promise<ListProductsResponse> {
    const params = new URLSearchParams();

    if (region) params.set("region", region);
    if (options?.categorySlug) params.set("categorySlug", options.categorySlug);
    if (typeof options?.featured === "boolean") {
      params.set("featured", String(options.featured));
    }

    return requestJson<ListProductsResponse>(
      `/api/store/products${params.toString() ? `?${params.toString()}` : ""}`
    );
  },

  async getProducts(region?: string): Promise<StoreProduct[]> {
    const result = await this.listProducts(region);
    return result.products ?? [];
  },

  async getFeaturedProducts(region?: string, limit = 4): Promise<StoreProduct[]> {
    const result = await this.listProducts(region, { featured: true });
    return (result.products ?? []).slice(0, limit);
  },

  async getProductBySlug(slug: string, region?: string): Promise<StoreProduct | null> {
    const params = new URLSearchParams();
    if (region) params.set("region", region);

    try {
      return await requestJson<StoreProduct>(
        `/api/store/products/${slug}${params.toString() ? `?${params.toString()}` : ""}`
      );
    } catch {
      return null;
    }
  },

  async getProductsByCategory(categorySlug: string, region?: string): Promise<StoreProduct[]> {
    const result = await this.listProducts(region, { categorySlug });
    return result.products ?? [];
  },

  async searchProducts(query: string, region?: string): Promise<StoreProduct[]> {
    const normalized = normalizeText(query);
    const all = await this.getProducts(region);

    if (!normalized) return all;

    return all.filter((product) => {
      const haystack = normalizeText(
        [product.name, product.tag, product.category, product.description, product.slug].join(" ")
      );

      return haystack.includes(normalized);
    });
  },

  async createCheckout(payload: CheckoutPayload): Promise<CheckoutResponse> {
    return requestJson<CheckoutResponse>("/api/checkout/session", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  async getOrder(orderId: string, sessionId?: string | null): Promise<StoreOrder> {
    const params = new URLSearchParams();
    if (sessionId) params.set("session_id", sessionId);
    return requestJson<StoreOrder>(`/api/store/orders/${orderId}${params.toString() ? `?${params.toString()}` : ""}`);
  },
};
