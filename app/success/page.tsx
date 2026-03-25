"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function SuccessContent() {
  const searchParams = useSearchParams();

  const sessionId = searchParams.get("session_id");
  const status = searchParams.get("status");

  return (
    <main className="min-h-screen bg-black px-6 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <h1
          className="mb-4 text-3xl font-light tracking-[0.2em]"
          style={{ fontFamily: "serif" }}
        >
          PAGAMENTO CONFIRMADO
        </h1>

        <p className="mb-8 text-white/75">
          Seu pedido foi recebido com sucesso.
        </p>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="mb-3 text-white/80">
            Status: {status || "confirmado"}
          </p>

          <p className="mb-6 break-all text-white/80">
            Session ID: {sessionId || "não informado"}
          </p>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-full border border-white/15 px-5 py-3 text-sm tracking-[0.18em] transition hover:bg-white hover:text-black"
            >
              VOLTAR PARA HOME
            </Link>

            <Link
              href="/bag"
              className="rounded-full border border-white/15 px-5 py-3 text-sm tracking-[0.18em] transition hover:bg-white hover:text-black"
            >
              VER SACOLA
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-black px-6 py-16 text-white">
          <div className="mx-auto max-w-3xl">
            <h1
              className="mb-4 text-3xl font-light tracking-[0.2em]"
              style={{ fontFamily: "serif" }}
            >
              PAGAMENTO CONFIRMADO
            </h1>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="text-white/70">Carregando informações do pedido...</p>
            </div>
          </div>
        </main>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}