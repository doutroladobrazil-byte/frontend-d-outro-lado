import Link from "next/link";

export default function WaitingApprovalPage() {
  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-4xl items-center justify-center px-6 py-16">
      <section className="w-full rounded-[28px] border border-white/10 bg-black/40 p-8 text-center shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl">
        <span className="mb-4 inline-flex rounded-full border border-emerald-400/30 bg-emerald-400/10 px-4 py-1 text-xs font-medium uppercase tracking-[0.28em] text-emerald-200">
          Fluxo atualizado
        </span>

        <h1 className="text-3xl font-semibold tracking-[0.04em] text-white md:text-4xl">
          O atacado agora é liberado sem aprovação manual
        </h1>

        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
          Esta página foi mantida apenas por compatibilidade. No fluxo corrigido,
          a conta de importador pode ser ativada imediatamente pelo próprio usuário.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/login"
            className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15"
          >
            Ir para login
          </Link>
          <Link
            href="/atacado"
            className="rounded-full border border-white/10 px-5 py-3 text-sm text-white/80 transition hover:bg-white/5"
          >
            Ir para o atacado
          </Link>
        </div>
      </section>
    </main>
  );
}
