export type StoreProduct = {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  image: string;
  tag: string;
  description: string;
  featured: boolean;
  stock: number;
  available: boolean;
  priceBRL: number;
  priceLocal: number;
  currency: string;
};

export type StoreOrder = {
  id: string;
  customerName: string;
  customerEmail: string;
  region: string;
  status: string;
  currency: string;
  fxRate: number;
  subtotalBRL: number;
  shippingBRL: number;
  dutiesBRL: number;
  operationalFeeBRL: number;
  totalBRL: number;
  totalLocal: number;
  paidAt?: string | null;
  inventoryApplied?: boolean;
  createdAt: string;
  items: { id: number; productName?: string; productImage?: string; quantity: number; unitPriceBRL: number }[];
};

export type CheckoutPayload = {
  customerName: string;
  customerEmail: string;
  region: string;
  locale: "pt" | "en" | "fr" | "de" | "it" | "es";
  items: { productId: number; quantity: number }[];
};

export type PricingPreview = {
  baseCostBRL: number;
  shippingBRL: number;
  dutiesBRL: number;
  operationalFeeBRL: number;
  subtotalCostBRL: number;
  suggestedPriceBRL: number;
  suggestedPriceLocal: number;
  currency: string;
  marginPercent: number;
  discountPercent: number;
  channel: "retail" | "wholesale" | "importer";
};

export type CheckoutTotals = {
  currency: string;
  fxRate: number;
  subtotalBRL: number;
  shippingBRL: number;
  dutiesBRL: number;
  operationalFeeBRL: number;
  totalBRL: number;
  subtotalLocal: number;
  shippingLocal: number;
  dutiesLocal: number;
  operationalFeeLocal: number;
  totalLocal: number;
};

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.message ?? "Request failed");
  }

  return payload.data as T;
}

export const storeApi = {
  async listProducts(region: string, categorySlug?: string, featured?: boolean) {
    const query = new URLSearchParams({ region });
    if (categorySlug) query.set("categorySlug", categorySlug);
    if (featured) query.set("featured", "true");
    return request<{ currency: string; region: string; products: StoreProduct[] }>(`/store/products?${query.toString()}`);
  },
  async getProduct(slug: string, region: string) {
    return request<StoreProduct>(`/store/products/${slug}?region=${encodeURIComponent(region)}`);
  },
  async getOrder(id: string) {
    return request<StoreOrder>(`/store/orders/${id}`);
  },
  async createCheckout(body: CheckoutPayload) {
    return request<{ mode: string; checkoutUrl: string; orderId: string; totals: CheckoutTotals; message?: string }>("/checkout/session", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },
  async previewPricing(params: { baseCostBRL: number; region: string; itemCount?: number; marginPercent?: number; channel?: "retail" | "wholesale" | "importer" }) {
    const query = new URLSearchParams({
      baseCostBRL: String(params.baseCostBRL),
      region: params.region,
      itemCount: String(params.itemCount ?? 1),
      marginPercent: String(params.marginPercent ?? 60),
      channel: params.channel ?? "retail"
    });

    return request<PricingPreview>(`/pricing/preview?${query.toString()}`);
  },
  async createWholesaleApplication(body: { companyName: string; contactName: string; email: string; country: string; monthlyVolume: string; message?: string }) {
    return request<{ id: number; status: string; requiresManualApproval: boolean }>("/pricing/wholesale-applications", {
      method: "POST",
      body: JSON.stringify(body)
    });
  },
  async createImporterApplication(body: { companyName: string; taxId: string; email: string; market: string; expectedAnnualVolumeBRL: number; notes?: string }) {
    return request<{ id: number; status: string; requiresManualApproval: boolean }>("/pricing/importer-applications", {
      method: "POST",
      body: JSON.stringify(body)
    });
  }
};
