import { createHmac, timingSafeEqual } from "node:crypto";

const STRIPE_API_BASE = "https://api.stripe.com/v1";

export type StripeCheckoutLineItem = {
  name: string;
  unitAmount: number;
  quantity: number;
  image?: string | null;
};

export type StripeCheckoutSessionResult = {
  id: string;
  url: string | null;
  payment_status?: string | null;
  status?: string | null;
  currency?: string | null;
  amount_total?: number | null;
  metadata?: Record<string, string> | null;
  payment_intent?: string | null;
};

function getRequiredSecretKey() {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY não foi definida.");
  }
  return secretKey;
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function getStripeCurrencyFallback() {
  return (process.env.STRIPE_CURRENCY_FALLBACK || "eur").toLowerCase();
}

export async function createStripeCheckoutSession(params: {
  successUrl: string;
  cancelUrl: string;
  customerEmail: string;
  orderId: string;
  currency: string;
  lineItems: StripeCheckoutLineItem[];
}) {
  const body = new URLSearchParams();
  body.set("mode", "payment");
  body.set("success_url", params.successUrl);
  body.set("cancel_url", params.cancelUrl);
  body.set("customer_email", params.customerEmail);
  body.set("metadata[orderId]", params.orderId);
  body.set("payment_intent_data[metadata][orderId]", params.orderId);
  body.set("allow_promotion_codes", "true");

  params.lineItems.forEach((item, index) => {
    body.set(`line_items[${index}][price_data][currency]`, params.currency);
    body.set(`line_items[${index}][price_data][product_data][name]`, item.name);
    if (item.image && /^https?:\/\//.test(item.image)) {
      body.set(`line_items[${index}][price_data][product_data][images][0]`, item.image);
    }
    body.set(`line_items[${index}][price_data][unit_amount]`, String(item.unitAmount));
    body.set(`line_items[${index}][quantity]`, String(item.quantity));
  });

  const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getRequiredSecretKey()}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body.toString(),
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error?.message || "Falha ao criar sessão do Stripe.");
  }

  return data as StripeCheckoutSessionResult;
}

export async function getStripeCheckoutSession(sessionId: string) {
  const response = await fetch(`${STRIPE_API_BASE}/checkout/sessions/${sessionId}`, {
    headers: {
      Authorization: `Bearer ${getRequiredSecretKey()}`,
    },
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error?.message || "Falha ao consultar sessão do Stripe.");
  }

  return data as StripeCheckoutSessionResult;
}

export function verifyStripeWebhookSignature(payload: string, signatureHeader: string) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("STRIPE_WEBHOOK_SECRET não foi definida.");
  }

  const parts = signatureHeader.split(",").map((part) => part.trim());
  const timestamp = parts.find((part) => part.startsWith("t="))?.slice(2);
  const signatures = parts.filter((part) => part.startsWith("v1=")).map((part) => part.slice(3));

  if (!timestamp || signatures.length === 0) {
    throw new Error("Cabeçalho Stripe-Signature inválido.");
  }

  const expected = createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`, "utf8")
    .digest("hex");

  const expectedBuffer = Buffer.from(expected, "hex");

  const matches = signatures.some((signature) => {
    try {
      const receivedBuffer = Buffer.from(signature, "hex");
      return receivedBuffer.length === expectedBuffer.length && timingSafeEqual(receivedBuffer, expectedBuffer);
    } catch {
      return false;
    }
  });

  if (!matches) {
    throw new Error("Assinatura do webhook Stripe inválida.");
  }

  return JSON.parse(payload) as {
    id: string;
    type: string;
    data: { object: any };
  };
}
