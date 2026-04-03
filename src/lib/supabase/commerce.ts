import { z } from "zod";
import { createAdminClient } from "@/lib/supabase/admin";
import { normalizeWeightRange } from "@/lib/shipping";
import { getCheckoutFreightQuote } from "@/lib/freight";
import { issueInvoiceForPaidOrder } from "@/lib/nfe";
import {
  createStripeCheckoutSession,
  getStripeCheckoutSession,
  getStripeCurrencyFallback,
  isStripeConfigured,
  type StripeCheckoutLineItem,
} from "@/lib/stripe";

export const weightRangeSchema = z.enum([
  "100g-1kg",
  "1kg-3kg",
  "3kg-5kg",
  "5kg-10kg",
  "10kg-15kg",
  "15kg-20kg",
]);

export const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  category: z.string().min(2),
  categorySlug: z.string().min(2),
  priceBRL: z.coerce.number().positive(),
  wholesalePriceBRL: z.coerce.number().positive().nullable().optional(),
  wholesaleMinQty: z.coerce.number().int().min(1).nullable().optional(),
  stock: z.coerce.number().int().min(0),
  weightRange: weightRangeSchema,
  image: z
    .string()
    .min(1)
    .refine((value: string) => /^https?:\/\//.test(value) || value.startsWith("/"), {
      message: "Informe uma URL válida ou caminho interno da imagem.",
    }),
  tag: z.string().min(2),
  description: z.string().min(4),
  featured: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(true),
});

export const orderStatusSchema = z.enum([
  "pending",
  "paid",
  "preparing",
  "shipped",
  "cancelled",
]);

const checkoutSchema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerDocument: z.string().min(11).max(18).optional().or(z.literal("")),
  destinationZip: z.string().min(8).max(10),
  addressCity: z.string().min(2).optional().or(z.literal("")),
  addressState: z.string().min(2).max(2).optional().or(z.literal("")),
  region: z.string().min(2),
  locale: z.string().min(2),
  originUrl: z.string().url().optional(),
  items: z
    .array(
      z.object({
        productId: z.coerce.number().int().positive(),
        quantity: z.coerce.number().int().min(1),
      })
    )
    .min(1),
});

function admin() {
  return createAdminClient();
}

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
    case "united kingdom":
    case "uk":
    case "great britain":
      return "GBP";
    case "europe":
      return "EUR";
    default:
      return getStripeCurrencyFallback().toUpperCase();
  }
}

function convertFromBRL(valueBRL: number, currency: string): number {
  const rates: Record<string, number> = {
    BRL: 1,
    EUR: 0.19,
    USD: 0.21,
    CHF: 0.18,
    GBP: 0.16,
  };

  const rate = rates[currency] ?? rates.EUR;
  return Number((valueBRL * rate).toFixed(2));
}

function toMinorUnits(value: number) {
  return Math.round(Number(value.toFixed(2)) * 100);
}

function buildPublicOrderId() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = String(now.getUTCMonth() + 1).padStart(2, "0");
  const d = String(now.getUTCDate()).padStart(2, "0");
  const random = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `DL-${y}${m}${d}-${random}`;
}

function mapProduct(row: any, region?: string) {
  const currency = getCurrencyByRegion(region);
  const priceBRL = Number(row.price_brl ?? 0);
  const wholesalePriceBRL =
    row.wholesale_price_brl === null || row.wholesale_price_brl === undefined
      ? null
      : Number(row.wholesale_price_brl);

  return {
    id: String(row.id),
    name: row.name,
    slug: row.slug,
    category: row.category,
    categorySlug: row.category_slug,
    priceBRL,
    priceLocal: convertFromBRL(priceBRL, currency),
    wholesalePriceBRL,
    wholesalePriceLocal:
      typeof wholesalePriceBRL === "number"
        ? convertFromBRL(wholesalePriceBRL, currency)
        : null,
    wholesaleMinQty:
      row.wholesale_min_qty === null || row.wholesale_min_qty === undefined
        ? null
        : Number(row.wholesale_min_qty),
    stock: Number(row.stock ?? 0),
    weightRange: normalizeWeightRange(row.weight_range),
    image: row.image,
    tag: row.tag,
    description: row.description,
    featured: Boolean(row.featured),
    active: Boolean(row.active),
    available: Boolean(row.active) && Number(row.stock ?? 0) > 0,
    currency,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
  };
}

function mapOrder(row: any) {
  const items = Array.isArray(row.order_items) ? row.order_items : [];

  return {
    id: row.public_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerDocument: row.customer_document ?? null,
    destinationZip: row.destination_zip ?? null,
    shippingCity: row.shipping_city ?? null,
    shippingState: row.shipping_state ?? null,
    region: row.region,
    status: row.status,
    totalBRL: Number(row.total_brl ?? 0),
    shippingBRL: Number(row.shipping_brl ?? 0),
    shippingProvider: row.shipping_provider ?? null,
    shippingServiceCode: row.shipping_service_code ?? null,
    shippingServiceName: row.shipping_service_name ?? null,
    shippingDeliveryDays:
      row.shipping_delivery_days === null || row.shipping_delivery_days === undefined
        ? null
        : Number(row.shipping_delivery_days),
    paidAt: row.paid_at ?? null,
    inventoryApplied: Boolean(row.inventory_applied),
    stripeSessionId: row.stripe_session_id ?? null,
    paymentIntentId: row.payment_intent_id ?? null,
    checkoutCurrency: row.checkout_currency ?? null,
    stripePaymentStatus: row.stripe_payment_status ?? null,
    invoiceStatus: row.invoice_status ?? null,
    invoiceProvider: row.invoice_provider ?? null,
    invoiceId: row.invoice_id ?? null,
    invoiceNumber: row.invoice_number ?? null,
    invoicePdfUrl: row.invoice_pdf_url ?? null,
    invoiceXmlUrl: row.invoice_xml_url ?? null,
    invoiceMessage: row.invoice_message ?? null,
    createdAt: row.created_at ?? null,
    updatedAt: row.updated_at ?? null,
    items: items.map((item: any) => ({
      id: String(item.id),
      productId: item.product_id ? Number(item.product_id) : null,
      productName: item.products?.name ?? null,
      productImage: item.products?.image ?? null,
      quantity: Number(item.quantity ?? 0),
      unitPriceBRL: Number(item.unit_price_brl ?? 0),
    })),
  };
}

const ORDER_SELECT = `
  id,
  public_id,
  customer_name,
  customer_email,
  region,
  status,
  total_brl,
  shipping_brl,
  shipping_provider,
  shipping_service_code,
  shipping_service_name,
  shipping_delivery_days,
  destination_zip,
  shipping_city,
  shipping_state,
  customer_document,
  paid_at,
  inventory_applied,
  stripe_session_id,
  payment_intent_id,
  checkout_currency,
  stripe_payment_status,
  invoice_status,
  invoice_provider,
  invoice_id,
  invoice_number,
  invoice_pdf_url,
  invoice_xml_url,
  invoice_message,
  created_at,
  updated_at,
  order_items (
    id,
    product_id,
    quantity,
    unit_price_brl,
    products (
      name,
      image
    )
  )
`;

export async function listStoreProducts(
  region?: string,
  options?: { categorySlug?: string; featured?: boolean }
) {
  let query = admin()
    .from("products")
    .select(
      "id, name, slug, category, category_slug, price_brl, wholesale_price_brl, wholesale_min_qty, stock, weight_range, image, tag, description, featured, active, created_at, updated_at"
    )
    .eq("active", true)
    .order("featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (options?.categorySlug) {
    query = query.eq("category_slug", options.categorySlug);
  }

  if (typeof options?.featured === "boolean") {
    query = query.eq("featured", options.featured);
  }

  const { data, error } = await query;
  if (error) throw error;

  const currency = getCurrencyByRegion(region);
  return {
    region: region ?? "Brazil",
    currency,
    shippingBaseBRL: 0,
    products: (data ?? []).map((row: any) => mapProduct(row, region)),
  };
}

export async function getStoreProductBySlug(slug: string, region?: string) {
  const { data, error } = await admin()
    .from("products")
    .select(
      "id, name, slug, category, category_slug, price_brl, wholesale_price_brl, wholesale_min_qty, stock, weight_range, image, tag, description, featured, active, created_at, updated_at"
    )
    .eq("slug", slug)
    .eq("active", true)
    .maybeSingle();

  if (error) throw error;
  return data ? mapProduct(data, region) : null;
}

export async function getStoreOrderByPublicId(publicId: string) {
  const { data, error } = await admin()
    .from("orders")
    .select(ORDER_SELECT)
    .eq("public_id", publicId)
    .maybeSingle();

  if (error) throw error;
  return data ? mapOrder(data) : null;
}

export async function createStoreCheckout(input: unknown) {
  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    const error = new Error("Dados inválidos para o checkout.");
    (error as any).issues = parsed.error.flatten();
    throw error;
  }

  const payload = parsed.data;
  const productIds = [...new Set(payload.items.map((item) => item.productId))];

  const { data: products, error: productsError } = await admin()
    .from("products")
    .select("id, name, stock, price_brl, weight_range, active, image")
    .in("id", productIds);

  if (productsError) throw productsError;

  const productRows = (products ?? []) as any[];
  const productMap = new Map<number, any>(
    productRows.map((product) => [Number(product.id), product])
  );

  let subtotalBRL = 0;
  const orderItemsPayload: Array<{
    product_id: number;
    quantity: number;
    unit_price_brl: number;
  }> = [];

  const stripeProducts: Array<{
    name: string;
    image?: string | null;
    quantity: number;
    unitPriceBRL: number;
    weightRange?: string | null;
    productId?: number | null;
  }> = [];

  for (const item of payload.items) {
    const product = productMap.get(item.productId);

    if (!product || !product.active) {
      throw new Error(`Produto ${item.productId} não está disponível.`);
    }

    if (Number(product.stock ?? 0) < item.quantity) {
      throw new Error(`Estoque insuficiente para ${product.name}.`);
    }

    const unitPriceBRL = Number(product.price_brl ?? 0);
    const lineSubtotal = unitPriceBRL * item.quantity;

    subtotalBRL += lineSubtotal;

    orderItemsPayload.push({
      product_id: item.productId,
      quantity: item.quantity,
      unit_price_brl: unitPriceBRL,
    });

    stripeProducts.push({
      productId: item.productId,
      name: product.name,
      image: product.image ?? null,
      quantity: item.quantity,
      unitPriceBRL,
      weightRange: product.weight_range ?? null,
    });
  }

  const freightQuotes = await getCheckoutFreightQuote({
    toPostalCode: payload.destinationZip,
    region: payload.region,
    items: stripeProducts.map((item) => ({
      productId: item.productId ?? null,
      name: item.name,
      quantity: item.quantity,
      weightRange: item.weightRange ?? null,
      priceBRL: item.unitPriceBRL,
    })),
  });

  const selectedFreight =
    freightQuotes.find((quote) => quote.service === "standard") ??
    freightQuotes[0] ?? {
      service: "standard",
      label: "Entrega padrão",
      priceBRL: 0,
      deliveryDays: 0,
    };

  const shippingBRL = Number((selectedFreight.priceBRL ?? 0).toFixed(2));
  const totalBRL = Number((subtotalBRL + shippingBRL).toFixed(2));
  const publicId = buildPublicOrderId();

  const { data: order, error: orderError } = await admin()
    .from("orders")
    .insert({
      public_id: publicId,
      customer_name: payload.customerName,
      customer_email: payload.customerEmail,
      customer_document: payload.customerDocument
        ? String(payload.customerDocument).replace(/\D/g, "")
        : null,
      destination_zip: payload.destinationZip.replace(/\D/g, ""),
      shipping_city: payload.addressCity || null,
      shipping_state: payload.addressState || null,
      region: payload.region,
      status: "pending",
      total_brl: totalBRL,
      shipping_brl: shippingBRL,
      shipping_provider: "simulated",
      shipping_service_code: selectedFreight.service,
      shipping_service_name: selectedFreight.label,
      shipping_delivery_days: selectedFreight.deliveryDays,
      inventory_applied: false,
      invoice_status: "pending",
    })
    .select("id, public_id, total_brl")
    .single();

  if (orderError) throw orderError;

  const { error: itemsError } = await admin().from("order_items").insert(
    orderItemsPayload.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price_brl: item.unit_price_brl,
    }))
  );

  if (itemsError) {
    await admin().from("orders").delete().eq("id", order.id);
    throw itemsError;
  }

  if (!isStripeConfigured()) {
    return {
      mode: "demo" as const,
      checkoutUrl: null,
      orderId: order.public_id,
      totalBRL,
      subtotalBRL: Number(subtotalBRL.toFixed(2)),
      shippingBRL: Number(shippingBRL.toFixed(2)),
      message: "Pedido criado no Supabase com sucesso.",
    };
  }

  const originUrl = (
    payload.originUrl ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "http://localhost:3000"
  ).replace(/\/+$/, "");

  const checkoutCurrency = getCurrencyByRegion(payload.region).toLowerCase();

  try {
    const lineItems: StripeCheckoutLineItem[] = stripeProducts.map((item) => ({
      name: item.name,
      image: item.image,
      quantity: item.quantity,
      unitAmount: toMinorUnits(
        convertFromBRL(item.unitPriceBRL, checkoutCurrency.toUpperCase())
      ),
    }));

    if (shippingBRL > 0) {
      lineItems.push({
        name: "Frete estimado",
        quantity: 1,
        unitAmount: toMinorUnits(
          convertFromBRL(shippingBRL, checkoutCurrency.toUpperCase())
        ),
      });
    }

    const session = await createStripeCheckoutSession({
      successUrl: `${originUrl}/success?order=${encodeURIComponent(
        order.public_id
      )}&session_id={CHECKOUT_SESSION_ID}`,
      cancelUrl: `${originUrl}/checkout?canceled=1&order=${encodeURIComponent(
        order.public_id
      )}`,
      customerEmail: payload.customerEmail,
      orderId: order.public_id,
      currency: checkoutCurrency,
      lineItems,
    });

    const { error: stripeUpdateError } = await admin()
      .from("orders")
      .update({
        stripe_session_id: session.id,
        checkout_currency: checkoutCurrency.toUpperCase(),
        stripe_payment_status: session.payment_status ?? "unpaid",
      })
      .eq("id", order.id);

    if (stripeUpdateError) throw stripeUpdateError;

    return {
      mode: "stripe" as const,
      checkoutUrl: session.url,
      sessionId: session.id,
      orderId: order.public_id,
      totalBRL,
      subtotalBRL: Number(subtotalBRL.toFixed(2)),
      shippingBRL: Number(shippingBRL.toFixed(2)),
      message: "Sessão Stripe criada com sucesso.",
    };
  } catch (error) {
    await admin().from("orders").update({ status: "pending" }).eq("id", order.id);
    throw error;
  }
}

export async function applyInventoryForOrder(publicId: string) {
  const { data: order, error: orderError } = await admin()
    .from("orders")
    .select("id, inventory_applied")
    .eq("public_id", publicId)
    .single();

  if (orderError) throw orderError;
  if (order.inventory_applied) return false;

  const { data: items, error: itemsError } = await admin()
    .from("order_items")
    .select("id, product_id, quantity")
    .eq("order_id", order.id);

  if (itemsError) throw itemsError;

  const productIds = (items ?? [])
    .map((item: any) => (item.product_id ? Number(item.product_id) : null))
    .filter((id: number | null): id is number => Number.isInteger(id));

  if (productIds.length === 0) {
    const { error: doneError } = await admin()
      .from("orders")
      .update({ inventory_applied: true, updated_at: new Date().toISOString() })
      .eq("id", order.id);

    if (doneError) throw doneError;
    return true;
  }

  const { data: products, error: productsError } = await admin()
    .from("products")
    .select("id, name, stock")
    .in("id", productIds);

  if (productsError) throw productsError;

  const stockRows = (products ?? []) as any[];
  const stockMap = new Map<number, any>(
    stockRows.map((product) => [Number(product.id), product])
  );

  for (const item of items ?? []) {
    if (!item.product_id) continue;
    const product = stockMap.get(Number(item.product_id));

    if (!product) {
      throw new Error(
        `Produto ${item.product_id} não encontrado para baixa de estoque.`
      );
    }

    if (Number(product.stock ?? 0) < Number(item.quantity ?? 0)) {
      throw new Error(`Estoque insuficiente para ${product.name}.`);
    }
  }

  for (const item of items ?? []) {
    if (!item.product_id) continue;
    const product = stockMap.get(Number(item.product_id));
    const nextStock = Number(product?.stock ?? 0) - Number(item.quantity ?? 0);

    const { error: updateError } = await admin()
      .from("products")
      .update({
        stock: nextStock,
        active: nextStock > 0,
        updated_at: new Date().toISOString(),
      })
      .eq("id", item.product_id);

    if (updateError) throw updateError;
  }

  const { error: orderUpdateError } = await admin()
    .from("orders")
    .update({ inventory_applied: true, updated_at: new Date().toISOString() })
    .eq("id", order.id);

  if (orderUpdateError) throw orderUpdateError;
  return true;
}

export async function markOrderPaidFromStripe(input: {
  orderId: string;
  stripeSessionId?: string | null;
  paymentIntentId?: string | null;
  paymentStatus?: string | null;
  checkoutCurrency?: string | null;
  paidAt?: string | null;
}) {
  const updates: Record<string, unknown> = {
    status: "paid",
    updated_at: new Date().toISOString(),
  };

  if (input.paidAt) updates.paid_at = input.paidAt;
  if (input.stripeSessionId) updates.stripe_session_id = input.stripeSessionId;
  if (input.paymentIntentId) updates.payment_intent_id = input.paymentIntentId;
  if (input.paymentStatus) updates.stripe_payment_status = input.paymentStatus;
  if (input.checkoutCurrency) updates.checkout_currency = input.checkoutCurrency;

  const { data, error } = await admin()
    .from("orders")
    .update(updates)
    .eq("public_id", input.orderId)
    .select(ORDER_SELECT)
    .single();

  if (error) throw error;

  await applyInventoryForOrder(input.orderId);

  try {
    const current = mapOrder(data);
    const invoice = await issueInvoiceForPaidOrder({
      orderId: current.id,
      customerName: current.customerName ?? "Cliente D'OUTRO LADO",
      customerEmail: current.customerEmail ?? "",
      customerDocument: current.customerDocument ?? null,
      totalBRL: current.totalBRL ?? 0,
      shippingBRL: current.shippingBRL ?? 0,
      region: current.region,
      items: current.items.map((item: any) => ({
        productName: item.productName ?? null,
        quantity: item.quantity,
        unitPriceBRL: item.unitPriceBRL,
      })),
    });

    const { data: invoiceData, error: invoiceError } = await admin()
      .from("orders")
      .update({
        invoice_status: invoice.status,
        invoice_provider: invoice.provider,
        invoice_id: invoice.invoiceId,
        invoice_number: invoice.invoiceNumber,
        invoice_pdf_url: invoice.pdfUrl,
        invoice_xml_url: invoice.xmlUrl,
        invoice_message: invoice.message,
        updated_at: new Date().toISOString(),
      })
      .eq("public_id", input.orderId)
      .select(ORDER_SELECT)
      .single();

    if (!invoiceError) {
      return mapOrder(invoiceData);
    }
  } catch {
    // Não quebra a confirmação financeira se a emissão fiscal falhar.
  }

  return mapOrder(data);
}

export async function markOrderCancelled(publicId: string) {
  const { data, error } = await admin()
    .from("orders")
    .update({ status: "cancelled", updated_at: new Date().toISOString() })
    .eq("public_id", publicId)
    .in("status", ["pending"])
    .select(ORDER_SELECT)
    .maybeSingle();

  if (error) throw error;
  return data ? mapOrder(data) : null;
}

export async function syncOrderFromCheckoutSession(sessionId: string) {
  const session = await getStripeCheckoutSession(sessionId);
  const publicId = session.metadata?.orderId;

  if (!publicId) {
    throw new Error("Sessão Stripe sem orderId vinculado.");
  }

  if (session.payment_status === "paid") {
    await markOrderPaidFromStripe({
      orderId: publicId,
      stripeSessionId: session.id,
      paymentIntentId:
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : null,
      paymentStatus: session.payment_status,
      checkoutCurrency: session.currency?.toUpperCase() ?? null,
      paidAt: new Date().toISOString(),
    });
  }

  return getStoreOrderByPublicId(publicId);
}

export async function listAdminProducts() {
  const { data, error } = await admin()
    .from("products")
    .select(
      "id, name, slug, category, category_slug, price_brl, wholesale_price_brl, wholesale_min_qty, stock, weight_range, image, tag, description, featured, active, created_at, updated_at"
    )
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row: any) => mapProduct(row, "Brazil"));
}

export async function createAdminProduct(input: unknown) {
  const parsed = productSchema.safeParse(input);

  if (!parsed.success) {
    const error = new Error("Dados inválidos para o produto.");
    (error as any).issues = parsed.error.flatten();
    throw error;
  }

  const payload = {
    name: parsed.data.name,
    slug: parsed.data.slug,
    category: parsed.data.category,
    category_slug: parsed.data.categorySlug,
    price_brl: parsed.data.priceBRL,
    wholesale_price_brl: parsed.data.wholesalePriceBRL ?? null,
    wholesale_min_qty: parsed.data.wholesaleMinQty ?? null,
    stock: parsed.data.stock,
    weight_range: parsed.data.weightRange,
    image: parsed.data.image,
    tag: parsed.data.tag,
    description: parsed.data.description,
    featured: parsed.data.featured,
    active: parsed.data.active,
  };

  const { data, error } = await admin()
    .from("products")
    .insert(payload)
    .select(
      "id, name, slug, category, category_slug, price_brl, wholesale_price_brl, wholesale_min_qty, stock, weight_range, image, tag, description, featured, active, created_at, updated_at"
    )
    .single();

  if (error) throw error;
  return mapProduct(data, "Brazil");
}

export async function updateAdminProduct(id: number, input: unknown) {
  const parsed = productSchema.partial().safeParse(input);

  if (!parsed.success) {
    const error = new Error("Dados inválidos para o produto.");
    (error as any).issues = parsed.error.flatten();
    throw error;
  }

  const payload: Record<string, unknown> = {};

  if (parsed.data.name !== undefined) payload.name = parsed.data.name;
  if (parsed.data.slug !== undefined) payload.slug = parsed.data.slug;
  if (parsed.data.category !== undefined) payload.category = parsed.data.category;
  if (parsed.data.categorySlug !== undefined) {
    payload.category_slug = parsed.data.categorySlug;
  }
  if (parsed.data.priceBRL !== undefined) payload.price_brl = parsed.data.priceBRL;
  if (parsed.data.wholesalePriceBRL !== undefined) {
    payload.wholesale_price_brl = parsed.data.wholesalePriceBRL;
  }
  if (parsed.data.wholesaleMinQty !== undefined) {
    payload.wholesale_min_qty = parsed.data.wholesaleMinQty;
  }
  if (parsed.data.stock !== undefined) payload.stock = parsed.data.stock;
  if (parsed.data.weightRange !== undefined) {
    payload.weight_range = parsed.data.weightRange;
  }
  if (parsed.data.image !== undefined) payload.image = parsed.data.image;
  if (parsed.data.tag !== undefined) payload.tag = parsed.data.tag;
  if (parsed.data.description !== undefined) {
    payload.description = parsed.data.description;
  }
  if (parsed.data.featured !== undefined) payload.featured = parsed.data.featured;
  if (parsed.data.active !== undefined) payload.active = parsed.data.active;

  payload.updated_at = new Date().toISOString();

  const { data, error } = await admin()
    .from("products")
    .update(payload)
    .eq("id", id)
    .select(
      "id, name, slug, category, category_slug, price_brl, wholesale_price_brl, wholesale_min_qty, stock, weight_range, image, tag, description, featured, active, created_at, updated_at"
    )
    .single();

  if (error) throw error;
  return mapProduct(data, "Brazil");
}

export async function deleteAdminProduct(id: number) {
  const { data, error } = await admin()
    .from("products")
    .delete()
    .eq("id", id)
    .select(
      "id, name, slug, category, category_slug, price_brl, wholesale_price_brl, wholesale_min_qty, stock, weight_range, image, tag, description, featured, active, created_at, updated_at"
    )
    .single();

  if (error) throw error;
  return mapProduct(data, "Brazil");
}

export async function listAdminOrders() {
  const { data, error } = await admin()
    .from("orders")
    .select(ORDER_SELECT)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []).map((row: any) => mapOrder(row));
}

export async function updateAdminOrder(publicId: string, input: unknown) {
  const parsed = z.object({ status: orderStatusSchema }).safeParse(input);

  if (!parsed.success) {
    const error = new Error("Status inválido.");
    (error as any).issues = parsed.error.flatten();
    throw error;
  }

  const { data: current, error: currentError } = await admin()
    .from("orders")
    .select("public_id, status, paid_at, inventory_applied")
    .eq("public_id", publicId)
    .single();

  if (currentError) throw currentError;

  const nextStatus = parsed.data.status;
  const currentStatus = String(current.status ?? "pending");

  const allowedTransitions: Record<string, string[]> = {
    pending: ["paid", "cancelled"],
    paid: ["preparing", "cancelled"],
    preparing: ["shipped", "cancelled"],
    shipped: [],
    cancelled: [],
  };

  if (
    currentStatus !== nextStatus &&
    !(allowedTransitions[currentStatus] ?? []).includes(nextStatus)
  ) {
    throw new Error("Transição de status inválida para o fluxo operacional atual.");
  }

  if (nextStatus === "paid") {
    return markOrderPaidFromStripe({
      orderId: publicId,
      paidAt: current.paid_at ?? new Date().toISOString(),
      paymentStatus: "paid",
    });
  }

  const updates: Record<string, unknown> = {
    status: nextStatus,
    updated_at: new Date().toISOString(),
  };

  if (nextStatus === "cancelled" && currentStatus === "pending") {
    updates.invoice_status = "cancelled";
  }

  const { data, error } = await admin()
    .from("orders")
    .update(updates)
    .eq("public_id", publicId)
    .select(ORDER_SELECT)
    .single();

  if (error) throw error;
  return mapOrder(data);
}


export async function deleteAdminOrder(publicId: string) {
  const existing = await getStoreOrderByPublicId(publicId);

  if (!existing) {
    throw new Error("Pedido não encontrado.");
  }

  const { error } = await admin()
    .from("orders")
    .delete()
    .eq("public_id", publicId);

  if (error) throw error;
  return existing;
}

export async function retryOrderInvoice(publicId: string) {
  const current = await getStoreOrderByPublicId(publicId);

  if (!current) {
    throw new Error("Pedido não encontrado.");
  }

  if (current.status !== "paid") {
    throw new Error("A NFe só pode ser reemitida para pedidos pagos.");
  }

  const invoice = await issueInvoiceForPaidOrder({
    orderId: current.id,
    customerName: current.customerName ?? "Cliente D'OUTRO LADO",
    customerEmail: current.customerEmail ?? "",
    customerDocument: current.customerDocument ?? null,
    totalBRL: current.totalBRL ?? 0,
    shippingBRL: current.shippingBRL ?? 0,
    region: current.region,
    items: current.items.map((item: any) => ({
      productName: item.productName ?? null,
      quantity: item.quantity,
      unitPriceBRL: item.unitPriceBRL,
    })),
  });

  const { data, error } = await admin()
    .from("orders")
    .update({
      invoice_status: invoice.status,
      invoice_provider: invoice.provider,
      invoice_id: invoice.invoiceId,
      invoice_number: invoice.invoiceNumber,
      invoice_pdf_url: invoice.pdfUrl,
      invoice_xml_url: invoice.xmlUrl,
      invoice_message: invoice.message,
      updated_at: new Date().toISOString(),
    })
    .eq("public_id", publicId)
    .select(ORDER_SELECT)
    .single();

  if (error) throw error;
  return mapOrder(data);
}