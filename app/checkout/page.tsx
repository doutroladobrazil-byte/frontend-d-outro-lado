"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutContent() {
  const searchParams = useSearchParams();

  const status = searchParams.get("status");
  const sessionId = searchParams.get("session_id");
  const canceled = searchParams.get("canceled");

  return (
    <main className="min-h-screen bg-black text-white px-6 py-16">
      <div className="mx-auto max-w-3xl">
        <h1
          className="mb-6 text-3xl font-light tracking-[0.2em]"
          style={{ fontFamily: "serif" }}
        >
          CHECKOUT
        </h1>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-3 text-white/80">
            Status: {status || "não informado"}
          </p>

          <p className="mb-3 text-white/80">
            Session ID: {sessionId || "não informado"}
          </p>

          <p className="text-white/80">
            Cancelado: {canceled === "true" ? "sim" : "não"}
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black text-white px-6 py-16">
          <div className="mx-auto max-w-3xl">
            <h1
              className="mb-6 text-3xl font-light tracking-[0.2em]"
              style={{ fontFamily: "serif" }}
            >
              CHECKOUT
            </h1>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/70">Carregando checkout...</p>
            </div>
          </div>
        </main>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}