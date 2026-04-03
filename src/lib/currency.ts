const localeCurrencyMap: Record<string, { locale: string; currency: string }> = {
  BR: { locale: "pt-BR", currency: "BRL" },
  PT: { locale: "pt-PT", currency: "EUR" },
  ES: { locale: "es-ES", currency: "EUR" },
  FR: { locale: "fr-FR", currency: "EUR" },
  DE: { locale: "de-DE", currency: "EUR" },
  IT: { locale: "it-IT", currency: "EUR" },
  NL: { locale: "nl-NL", currency: "EUR" },
  CH: { locale: "de-CH", currency: "CHF" },
  GB: { locale: "en-GB", currency: "GBP" },
  US: { locale: "en-US", currency: "USD" }
};

const approximateRates: Record<string, number> = {
  BRL: 1,
  EUR: 0.18,
  CHF: 0.17,
  GBP: 0.15,
  USD: 0.2
};

export function getRegionCurrency(countryCode?: string) {
  return localeCurrencyMap[countryCode ?? "BR"] ?? localeCurrencyMap.BR;
}

export function formatRegionalPrice(priceBRL: number, countryCode?: string) {
  const { locale, currency } = getRegionCurrency(countryCode);
  const converted = priceBRL * (approximateRates[currency] ?? 1);
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    maximumFractionDigits: 2
  }).format(converted);
}
