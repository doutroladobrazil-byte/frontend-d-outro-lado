"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { useCart } from "@/components/CartContext";
import { getMessage } from "@/lib/i18n";
import { useIntlStore } from "@/components/IntlStoreProvider";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const { clearCart } = useCart();
  const { locale } = useIntlStore();
  const t = getMessage(locale);
  const orderId = searchParams.get("order") ?? "";

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <main className="page-shell">
      <Navbar />
      <section className="content-section centered-panel">
        <div className="summary-card success-panel">
          <span className="section-eyebrow">{t.orderConfirmed}</span>
          <h1>{t.orderConfirmed}</h1>
          <p>Your premium order has been created successfully.</p>
          {orderId ? <p className="muted">Order ID: {orderId}</p> : null}
          <div className="button-row">
            <Link className="primary-button button-link" href={orderId ? `/order/${orderId}` : "/"}>Track order</Link>
            <Link className="secondary-button button-link" href="/">{t.continueShopping}</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
