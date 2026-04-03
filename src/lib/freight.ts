export type WeightRange =
  | "100g-1kg"
  | "1-3kg"
  | "3-5kg"
  | "5-10kg"
  | "10-15kg"
  | "15-20kg";

export type PackageMetrics = {
  weight: number;
  width: number;
  height: number;
  length: number;
};

export type FreightItemInput = {
  productId?: number | null;
  name?: string;
  quantity: number;
  weightRange?: string | null;
  priceBRL?: number | null;
};

export type FreightAddressInput = {
  zipcode: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  number?: string;
  district?: string;
};

export type FreightQuoteInput =
  | {
      items: FreightItemInput[];
      to: FreightAddressInput;
    }
  | {
      items: FreightItemInput[];
      toPostalCode: string;
      region?: string | null;
    };

export type FreightQuoteProduct = {
  id: number;
  width: number;
  height: number;
  length: number;
  weight: number;
  insurance_value: number;
  quantity: number;
};

export type FreightQuotePayload = {
  from: {
    postal_code: string;
  };
  to: {
    postal_code: string;
  };
  products: FreightQuoteProduct[];
};

export type FreightQuote = {
  service: string;
  priceBRL: number;
  deliveryDays: number;
  currency: "BRL";
  payload: FreightQuotePayload;
};

export type CheckoutFreightQuote = {
  service: string;
  label: string;
  priceBRL: number;
  deliveryDays: number;
};

const DEFAULT_WEIGHT_RANGE: WeightRange = "1-3kg";
const DEFAULT_ORIGIN_ZIPCODE = "14400-000";

const WEIGHT_RANGE_METRICS: Record<WeightRange, PackageMetrics> = {
  "100g-1kg": {
    weight: 1,
    width: 16,
    height: 8,
    length: 22,
  },
  "1-3kg": {
    weight: 3,
    width: 22,
    height: 12,
    length: 28,
  },
  "3-5kg": {
    weight: 5,
    width: 28,
    height: 14,
    length: 34,
  },
  "5-10kg": {
    weight: 10,
    width: 34,
    height: 18,
    length: 42,
  },
  "10-15kg": {
    weight: 15,
    width: 38,
    height: 22,
    length: 48,
  },
  "15-20kg": {
    weight: 20,
    width: 42,
    height: 26,
    length: 54,
  },
};

function normalizeZipcode(zipcode: string): string {
  return zipcode.replace(/\D/g, "");
}

function isWeightRange(value: string): value is WeightRange {
  return value in WEIGHT_RANGE_METRICS;
}

function resolveDestinationZipcode(input: FreightQuoteInput): string {
  if ("to" in input) {
    return normalizeZipcode(input.to.zipcode);
  }

  return normalizeZipcode(input.toPostalCode);
}

export function normalizeWeightRange(value?: string | null): WeightRange {
  if (!value) return DEFAULT_WEIGHT_RANGE;

  const normalized = value.trim();

  if (isWeightRange(normalized)) {
    return normalized;
  }

  const aliases: Record<string, WeightRange> = {
    "100g–1kg": "100g-1kg",
    "100 g-1 kg": "100g-1kg",
    "100 g a 1 kg": "100g-1kg",
    "de 100 g a 1 kg": "100g-1kg",

    "1–3kg": "1-3kg",
    "1 kg-3 kg": "1-3kg",
    "1 kg a 3 kg": "1-3kg",
    "de 1 kg a 3 kg": "1-3kg",

    "3–5kg": "3-5kg",
    "3 kg-5 kg": "3-5kg",
    "3 kg a 5 kg": "3-5kg",
    "de 3 kg a 5 kg": "3-5kg",

    "5–10kg": "5-10kg",
    "5 kg-10 kg": "5-10kg",
    "5 kg a 10 kg": "5-10kg",
    "de 5 kg a 10 kg": "5-10kg",

    "10–15kg": "10-15kg",
    "10 kg-15 kg": "10-15kg",
    "10 kg a 15 kg": "10-15kg",
    "de 10 kg a 15 kg": "10-15kg",

    "15–20kg": "15-20kg",
    "15 kg-20 kg": "15-20kg",
    "15 kg a 20 kg": "15-20kg",
    "de 15 kg a 20 kg": "15-20kg",
  };

  return aliases[normalized] ?? DEFAULT_WEIGHT_RANGE;
}

export function weightRangeToPackageMetrics(weightRange: string): PackageMetrics {
  const normalized = normalizeWeightRange(weightRange);
  return WEIGHT_RANGE_METRICS[normalized];
}

export function calculateItemFreightBRL(weightRange?: string | null): number {
  const metrics = weightRangeToPackageMetrics(weightRange ?? DEFAULT_WEIGHT_RANGE);

  if (metrics.weight <= 1) return 24.9;
  if (metrics.weight <= 3) return 34.9;
  if (metrics.weight <= 5) return 44.9;
  if (metrics.weight <= 10) return 64.9;
  if (metrics.weight <= 15) return 84.9;
  return 109.9;
}

export function calculateCartFreightBRL(items: FreightItemInput[]): number {
  return items.reduce((total, item) => {
    const itemFreight = calculateItemFreightBRL(item.weightRange);
    return total + itemFreight * Math.max(item.quantity || 1, 1);
  }, 0);
}

export function buildFreightPayload(input: FreightQuoteInput): FreightQuotePayload {
  const destinationZipcode = resolveDestinationZipcode(input);

  return {
    from: {
      postal_code: DEFAULT_ORIGIN_ZIPCODE,
    },
    to: {
      postal_code: destinationZipcode,
    },
    products: input.items.map((item, index) => {
      const safeWeightRange = normalizeWeightRange(item.weightRange);
      const metrics = weightRangeToPackageMetrics(safeWeightRange);

      return {
        id: item.productId ?? index + 1,
        width: metrics.width,
        height: metrics.height,
        length: metrics.length,
        weight: metrics.weight,
        insurance_value: Number(item.priceBRL ?? 0),
        quantity: Math.max(item.quantity || 1, 1),
      };
    }),
  };
}

export async function simulateFreightQuote(
  input: FreightQuoteInput
): Promise<FreightQuote[]> {
  const payload = buildFreightPayload(input);

  const totalWeight = payload.products.reduce(
    (sum, product) => sum + product.weight * product.quantity,
    0
  );

  const totalVolumeFactor = payload.products.reduce((sum, product) => {
    return sum + product.width * product.height * product.length * product.quantity;
  }, 0);

  const zipcode = payload.to.postal_code;

  const distanceFactor =
    zipcode.startsWith("0") || zipcode.startsWith("1")
      ? 1.4
      : zipcode.startsWith("2") || zipcode.startsWith("3")
        ? 1.25
        : zipcode.startsWith("7") || zipcode.startsWith("8")
          ? 1.18
          : 1.1;

  const base = totalWeight * 6.5 + totalVolumeFactor / 12000 + 18 * distanceFactor;

  const standardPrice = Number((base + 12).toFixed(2));
  const expressPrice = Number((base * 1.38 + 18).toFixed(2));

  return [
    {
      service: "standard",
      priceBRL: standardPrice,
      deliveryDays: 7,
      currency: "BRL",
      payload,
    },
    {
      service: "express",
      priceBRL: expressPrice,
      deliveryDays: 3,
      currency: "BRL",
      payload,
    },
  ];
}

export function getFallbackFreightQuote(input: FreightQuoteInput) {
  return getCheckoutFreightQuote(input);
}

export async function getCheckoutFreightQuote(
  input: FreightQuoteInput
): Promise<CheckoutFreightQuote[]> {
  const quotes = await simulateFreightQuote(input);

  return quotes.map((quote) => ({
    service: quote.service,
    label: quote.service === "express" ? "Entrega expressa" : "Entrega padrão",
    priceBRL: quote.priceBRL,
    deliveryDays: quote.deliveryDays,
  }));
}