export type WeightRange = "100g-1kg" | "1kg-3kg" | "3kg-5kg" | "5kg-10kg" | "10kg-15kg" | "15kg-20kg";

export const WEIGHT_RANGE_LABELS: Record<WeightRange, string> = {
  "100g-1kg": "100 g a 1 kg",
  "1kg-3kg": "1 kg a 3 kg",
  "3kg-5kg": "3 kg a 5 kg",
  "5kg-10kg": "5 kg a 10 kg",
  "10kg-15kg": "10 kg a 15 kg",
  "15kg-20kg": "15 kg a 20 kg",
};

const SHIPPING_BY_RANGE: Record<WeightRange, number> = {
  "100g-1kg": 45,
  "1kg-3kg": 78,
  "3kg-5kg": 120,
  "5kg-10kg": 185,
  "10kg-15kg": 260,
  "15kg-20kg": 340,
};

export function normalizeWeightRange(value?: string): WeightRange {
  const normalized = (value ?? "100g-1kg") as WeightRange;
  return normalized in WEIGHT_RANGE_LABELS ? normalized : "100g-1kg";
}

export function getShippingForWeightRangeBRL(weightRange: string | undefined, region?: string) {
  const normalized = normalizeWeightRange(weightRange);
  const base = SHIPPING_BY_RANGE[normalized];
  const regionText = (region ?? "").toLowerCase();
  const multiplier = regionText.includes("brazil") || regionText.includes("brasil") ? 1 : regionText.includes("united states") ? 1.35 : regionText.includes("switzerland") ? 1.25 : 1.15;
  const shippingBRL = Number((base * multiplier).toFixed(2));
  return { weightRange: normalized, shippingBRL };
}
