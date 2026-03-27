export default function AdminPage() {
  return (
    <main className="min-h-screen bg-neutral-950 text-white">
      <section className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-6 py-10 md:px-10">
        <div className="mb-10 border-b border-white/10 pb-6">
          <p className="mb-3 text-xs uppercase tracking-[0.35em] text-white/55">
            Painel administrativo
          </p>
          <h1
            className="text-3xl font-light tracking-[0.18em] md:text-5xl"
            style={{ fontFamily: "serif" }}
          >
            D&apos;OUTRO LADO
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-white/70 md:text-base">
            Área administrativa em construção. Aqui ficarão o controle de
            produtos, pedidos, clientes, importadores cadastrados, atacado,
            aprovação de lojistas, precificação, fretes, taxas, impostos e
            emissão fiscal.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Pedidos
            </p>
            <h2 className="mt-3 text-3xl font-light">0</h2>
            <p className="mt-2 text-sm text-white/60">
              Nenhum pedido sincronizado ainda.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Produtos
            </p>
            <h2 className="mt-3 text-3xl font-light">0</h2>
            <p className="mt-2 text-sm text-white/60">
              Catálogo administrativo aguardando integração.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Clientes
            </p>
            <h2 className="mt-3 text-3xl font-light">0</h2>
            <p className="mt-2 text-sm text-white/60">
              Base de clientes ainda não carregada.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-white/45">
              Lojistas
            </p>
            <h2 className="mt-3 text-3xl font-light">0</h2>
            <p className="mt-2 text-sm text-white/60">
              Aprovações e preços especiais serão exibidos aqui.
            </p>
          </div>
        </div>

        <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] p-6 md:p-8">
          <h3 className="text-lg font-light tracking-[0.14em]">
            Próximos módulos
          </h3>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 p-5 text-sm text-white/70">
              Gestão de produtos, imagens, categorias e estoque.
            </div>
            <div className="rounded-2xl border border-white/10 p-5 text-sm text-white/70">
              Tabela de custos com frete, taxas, impostos e margem sugerida.
            </div>
            <div className="rounded-2xl border border-white/10 p-5 text-sm text-white/70">
              Controle de atacado e aprovação de lojistas/importadores.
            </div>
            <div className="rounded-2xl border border-white/10 p-5 text-sm text-white/70">
              Integração com pagamentos, pedidos e emissão fiscal.
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}