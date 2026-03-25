
import type { StoreProduct } from "@/lib/storeApi";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000/api";

export async function getStoreProductsServer(region: string, options?: { categorySlug?: string; featured?: boolean }) {
  const params = new URLSearchParams({ region });
  if (options?.categorySlug) params.set("categorySlug", options.categorySlug);
  if (options?.featured) params.set("featured", "true");

  const response = await fetch(`${API_BASE}/store/products?${params.toString()}`, {
    cache: "no-store"
  });

  if (!response.ok) {
    return { products: [] as StoreProduct[], currency: "EUR", region };
  }

  const payload = await response.json();
  return payload.data as { products: StoreProduct[]; currency: string; region: string };
}
