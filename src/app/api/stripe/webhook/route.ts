import { NextResponse } from "next/server";
import { markOrderCancelled, markOrderPaidFromStripe } from "@/lib/supabase/commerce";
import { verifyStripeWebhookSignature } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ message: "Assinatura do Stripe ausente." }, { status: 400 });
  }

  const payload = await request.text();

  try {
    const event = verifyStripeWebhookSignature(payload, signature);
    const session = event.data?.object as any;
    const orderId = session?.metadata?.orderId;

    if (!orderId) {
      return NextResponse.json({ received: true, ignored: true });
    }

    if (event.type === "checkout.session.completed" || event.type === "checkout.session.async_payment_succeeded") {
      await markOrderPaidFromStripe({
        orderId,
        stripeSessionId: session.id ?? null,
        paymentIntentId: typeof session.payment_intent === "string" ? session.payment_intent : null,
        paymentStatus: session.payment_status ?? null,
        checkoutCurrency: session.currency ? String(session.currency).toUpperCase() : null,
        paidAt: new Date().toISOString(),
      });
    }

    if (event.type === "checkout.session.expired") {
      await markOrderCancelled(orderId);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Falha ao processar webhook do Stripe." },
      { status: 400 }
    );
  }
}
