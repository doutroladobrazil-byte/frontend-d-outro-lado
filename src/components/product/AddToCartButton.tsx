"use client";

import { useAuth } from "@/contexts/AuthContext";

type PriceBlockProps = {
  retailPriceBRL: number;
  retailPriceLocal: number;
  currency: string;
  locale: string;
  wholesalePriceBRL?: number | null;
  wholesalePriceLocal?: number | null;
  wholesaleMinQty?: number | null;
};

function formatMoney(value: number, currency: string, locale: string) {
  const localeMap: Record<string, string> = {
    pt: "pt-BR",
    en: "en-US",
    fr: "fr-FR",
    de: "de-DE",
    it: "it-IT",
    es: "es-ES",
  };

  return new Intl.NumberFormat(localeMap[locale] ?? "en-US", {
    style: "currency",
    currency,
  }).format(value);
}

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function PriceBlock({
  retailPriceBRL,
  retailPriceLocal,
  currency,
  locale,
  wholesalePriceBRL,
  wholesalePriceLocal,
  wholesaleMinQty,
}: PriceBlockProps) {
  const { canSeeWholesale } = useAuth();

  const showWholesale =
    canSeeWholesale &&
    typeof wholesalePriceBRL === "number" &&
    typeof wholesalePriceLocal === "number";

  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
      <div className="grid gap-5">
        <div>
          <p className="text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
            Preço internacional
          </p>

          <h2 className="mt-3 text-3xl font-light text-white sm:text-4xl">
            {formatMoney(retailPriceLocal, currency, locale)}
          </h2>

          <p className="mt-2 text-sm text-white/45">
            Base em BRL: {formatBRL(retailPriceBRL)}
          </p>
        </div>

        {showWholesale ? (
          <div className="border-t border-white/10 pt-5">
            <p className="text-[11px] uppercase tracking-[0.35em] text-[#cdb899]">
              Preço atacado liberado
            </p>

            <h3 className="mt-3 text-2xl font-light text-white sm:text-3xl">
              {formatMoney(wholesalePriceLocal, currency, locale)}
            </h3>

            <p className="mt-2 text-sm text-white/45">
              Base em BRL: {formatBRL(wholesalePriceBRL)}
            </p>

            {wholesaleMinQty ? (
              <p className="mt-3 text-sm text-white/65">
                Pedido mínimo: {wholesaleMinQty} unidades
              </p>
            ) : null}
          </div>
        ) : (
          <div className="border-t border-white/10 pt-5">
            <p className="text-sm leading-7 text-white/55">
              Preço de atacado disponível apenas para importadores aprovados e administradores.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}