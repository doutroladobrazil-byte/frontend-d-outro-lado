import type { StoreProduct } from "@/lib/storeApi";
import { listStoreProducts } from "@/lib/supabase/commerce";

export async function getStoreProductsServer(
  region: string,
  options?: { categorySlug?: string; featured?: boolean }
) {
  try {
    return await listStoreProducts(region, options);
  } catch {
    return { products: [] as StoreProduct[], currency: "EUR", region, shippingBaseBRL: 0 };
  }
}
