"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Currency = "UZS" | "USD";

type Ctx = {
  currency: Currency;
  setCurrency: (c: Currency) => void;
};

const CurrencyContext = createContext<Ctx | null>(null);

const STORAGE_KEY = "btt-currency";

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>("UZS");

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    try {
      localStorage.setItem(STORAGE_KEY, c);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    try {
      const s = localStorage.getItem(STORAGE_KEY) as Currency | null;
      if (s === "USD" || s === "UZS") setCurrencyState(s);
    } catch {
      /* ignore */
    }
  }, []);

  const value = useMemo(
    () => ({ currency, setCurrency }),
    [currency, setCurrency]
  );

  return (
    <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const c = useContext(CurrencyContext);
  if (!c) throw new Error("useCurrency inside provider");
  return c;
}
