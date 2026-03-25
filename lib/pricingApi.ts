const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });
  const payload = await response.json();
  if (!response.ok) throw new Error(payload.message ?? "Pricing request failed");
  return payload.data as T;
}

export type PricingQuotePayload = {
  productCostBRL: number;
  quantity: number;
  region: string;
  marginPercent?: number;
  extraTaxPercent?: number;
  packagingBRL?: number;
  overrideFreightBRL?: number;
  wholesaleDiscountPercent?: number;
};

export type PricingQuote = {
  reference: string;
  createdAt: string;
  currency: string;
  quantity: number;
  region: string;
  costSubtotalBRL: number;
  freightBRL: number;
  packagingBRL: number;
  taxPercent: number;
  taxValueBRL: number;
  marginPercent: number;
  marginValueBRL: number;
  suggestedUnitPriceBRL: number;
  suggestedUnitPriceLocal: number;
  totalBRL: number;
  totalLocal: number;
  wholesaleDiscountPercent: number;
};

export const pricingApi = {
  createQuote(body: PricingQuotePayload) {
    return request<PricingQuote>("/pricing/quote", { method: "POST", body: JSON.stringify(body) });
  },
  listQuotes() {
    return request<any[]>("/pricing/quotes");
  }
};
