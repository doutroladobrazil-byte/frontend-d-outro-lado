import {
  getShippingForWeightRangeBRL,
  normalizeWeightRange,
  type WeightRange,
  WEIGHT_RANGE_LABELS,
} from "@/lib/shipping";
import {
  getCheckoutFreightQuote,
  getFallbackFreightQuote,
  type FreightQuote,
  type FreightQuoteInput,
} from "@/lib/freight";

export {
  getShippingForWeightRangeBRL,
  normalizeWeightRange,
  WEIGHT_RANGE_LABELS,
  getCheckoutFreightQuote,
  getFallbackFreightQuote,
};

export type { WeightRange, FreightQuote, FreightQuoteInput };
