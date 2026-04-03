import Link from "next/link";

export default function AcessoNegadoPage() {
  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-white">
      <div className="mx-auto flex min-h-[70vh] max-w-3xl items-center justify-center">
        <section className="w-full rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center shadow-2xl backdrop-blur-md">
          <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full border border-red-400/25 bg-red-400/10 text-2xl">
            !
          </div>

          <h1 className="text-3xl font-semibold">Acesso negado</h1>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-white/70">
            Sua conta não possui permissão para acessar esta área no momento.
            Se você acredita que isso está incorreto, revise seu tipo de acesso
            ou solicite liberação administrativa.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-2xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Voltar para a home
            </Link>

            <Link
              href="/login"
              className="rounded-2xl border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5 hover:text-white"
            >
              Ir para login
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}