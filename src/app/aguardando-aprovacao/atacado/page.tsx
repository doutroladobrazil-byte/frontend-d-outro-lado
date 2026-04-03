import Link from "next/link";

export default function AguardandoAprovacaoAtacadoPage() {
  return (
    <main className="min-h-screen bg-[#050505] px-4 py-16 text-white sm:px-6 lg:px-10">
      <div className="mx-auto max-w-3xl rounded-[28px] border border-white/10 bg-white/[0.03] p-8 text-center">
        <p className="text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">Atacado</p>
        <h1 className="mt-4 text-3xl font-light text-[#f5f0e8]" style={{ fontFamily: 'serif' }}>
          Liberação imediata ativa
        </h1>
        <p className="mt-4 text-sm leading-7 text-white/70">
          O fluxo desta versão foi corrigido para não depender de aprovação manual.
          Se sua conta já estiver marcada como importador, o acesso ao atacado é liberado automaticamente.
        </p>
        <div className="mt-8">
          <Link href="/atacado" className="rounded-full border border-white/20 bg-white/[0.03] px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-white transition hover:bg-white/5">
            Abrir área de atacado
          </Link>
        </div>
      </div>
    </main>
  );
}
