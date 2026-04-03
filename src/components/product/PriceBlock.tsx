type PriceBlockProps = {
  retailPriceBRL: number;
  wholesalePriceBRL?: number;
  wholesaleMinQty?: number;
};

function formatBRL(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export default function PriceBlock({
  retailPriceBRL,
  wholesalePriceBRL,
  wholesaleMinQty,
}: PriceBlockProps) {
  return (
    <div
      style={{
        display: "grid",
        gap: 14,
      }}
    >
      <div
        style={{
          display: "grid",
          gap: 6,
        }}
      >
        <span
          style={{
            color: "rgba(255,255,255,0.6)",
            fontSize: 13,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Preço de varejo
        </span>

        <strong
          style={{
            fontSize: 30,
            lineHeight: 1.1,
            color: "rgba(255,255,255,0.96)",
          }}
        >
          {formatBRL(retailPriceBRL)}
        </strong>
      </div>

      {typeof wholesalePriceBRL === "number" ? (
        <div
          style={{
            display: "grid",
            gap: 6,
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <span
            style={{
              color: "rgba(189,157,106,0.85)",
              fontSize: 13,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            Condição de atacado
          </span>

          <strong
            style={{
              fontSize: 22,
              lineHeight: 1.1,
              color: "rgba(255,255,255,0.92)",
            }}
          >
            {formatBRL(wholesalePriceBRL)}
          </strong>

          <span
            style={{
              color: "rgba(255,255,255,0.68)",
              fontSize: 14,
            }}
          >
            Pedido mínimo: {wholesaleMinQty ?? "—"} unidades
          </span>
        </div>
      ) : null}
    </div>
  );
}