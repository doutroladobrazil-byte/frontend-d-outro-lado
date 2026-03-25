"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/lib/i18n";

type StoreContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  region: string;
  setRegion: (region: string) => void;
  currency: string;
};

const StoreContext = createContext<StoreContextValue | null>(null);

function inferCurrency(region: string) {
  const normalized = region.toLowerCase();
  if (normalized.includes("switzerland")) return "CHF";
  if (normalized.includes("united states")) return "USD";
  if (normalized.includes("united kingdom")) return "GBP";
  if (normalized.includes("france") || normalized.includes("italy") || normalized.includes("germany") || normalized.includes("spain") || normalized.includes("europe")) return "EUR";
  return "BRL";
}

export function IntlStoreProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [region, setRegionState] = useState("Europe");

  useEffect(() => {
    const savedLocale = localStorage.getItem("doutro-lado-locale") as Locale | null;
    const savedRegion = localStorage.getItem("doutro-lado-region");
    if (savedLocale) setLocaleState(savedLocale);
    if (savedRegion) setRegionState(savedRegion);
  }, []);

  const value = useMemo<StoreContextValue>(() => ({
    locale,
    setLocale: (next) => {
      setLocaleState(next);
      localStorage.setItem("doutro-lado-locale", next);
    },
    region,
    setRegion: (next) => {
      setRegionState(next);
      localStorage.setItem("doutro-lado-region", next);
    },
    currency: inferCurrency(region)
  }), [locale, region]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useIntlStore() {
  const context = useContext(StoreContext);
  if (!context) throw new Error("useIntlStore must be used within IntlStoreProvider");
  return context;
}
