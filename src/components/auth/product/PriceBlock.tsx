import { getCurrentUserProfile } from "@/lib/auth/roles";

type PriceBlockProps = {
  retailPriceBRL: number;
  wholesalePriceBRL?: number | null;
  wholesaleMinQty?: number | null;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default async function PriceBlock({
  retailPriceBRL,
  wholesalePriceBRL,
  wholesaleMinQty,
}: PriceBlockProps) {
  const profile = await getCurrentUserProfile();

  const canSeeWholesale =
    !!profile && (profile.role === "admin" || profile.role === "importer");

  return (
    <div className="space-y-4 rounded-[24px] border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-white/45">
          Preço unitário
        </p>
        <h3 className="mt-2 text-3xl font-semibold text-white">
          {formatBRL(retailPriceBRL)}
        </h3>
      </div>

      {canSeeWholesale && wholesalePriceBRL ? (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
          <p className="text-xs uppercase tracking-[0.22em] text-emerald-200/80">
            Atacado liberado
          </p>

          <div className="mt-2 flex flex-wrap items-end gap-3">
            <span className="text-2xl font-semibold text-emerald-100">
              {formatBRL(wholesalePriceBRL)}
            </span>

            {wholesaleMinQty ? (
              <span className="rounded-full border border-emerald-300/20 px-3 py-1 text-xs text-emerald-100/80">
                mínimo de {wholesaleMinQty} unidades
              </span>
            ) : null}
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
          <p className="text-sm text-white/65">
            Preços especiais de atacado disponíveis apenas para importadores.
          </p>
        </div>
      )}
    </div>
  );
}
