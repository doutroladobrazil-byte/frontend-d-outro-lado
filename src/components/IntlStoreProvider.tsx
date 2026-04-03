"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n";

type IntlContextType = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  region: string;
  setRegion: (region: string) => void;
  currency: string;
};

const IntlContext = createContext<IntlContextType | null>(null);

export function IntlStoreProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [locale, setLocale] = useState<Locale>("pt");
  const [region, setRegion] = useState("Brazil");

  const currency = useMemo(() => {
    switch (region) {
      case "France":
      case "Italy":
      case "Germany":
        return "EUR";
      case "Switzerland":
        return "CHF";
      case "United States":
        return "USD";
      case "Brazil":
        return "BRL";
      default:
        return "EUR";
    }
  }, [region]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      region,
      setRegion,
      currency,
    }),
    [locale, region, currency]
  );

  return <IntlContext.Provider value={value}>{children}</IntlContext.Provider>;
}

export function useIntlStore() {
  const context = useContext(IntlContext);

  if (!context) {
    throw new Error("useIntlStore must be used inside IntlStoreProvider");
  }

  return context;
}