"use client";

import { getProductBySlug } from "@/data/products";
import { getPricePerKgForQty } from "@/lib/pricing";
import type { Product } from "@/types/product";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type CartLine = {
  sku: string;
  slug: string;
  name: string;
  qtyKg: number;
};

type CartCtx = {
  lines: CartLine[];
  add: (product: Product, localeName: string, qtyKg: number) => void;
  updateQty: (sku: string, qtyKg: number) => void;
  remove: (sku: string) => void;
  clear: () => void;
  lineTotalUz: (line: CartLine) => number;
  subtotalUz: number;
};

const CartContext = createContext<CartCtx | null>(null);

const STORAGE = "btt-cart";

function isCartLine(x: unknown): x is CartLine {
  if (typeof x !== "object" || x === null) return false;
  const o = x as Record<string, unknown>;
  return (
    typeof o.sku === "string" &&
    o.sku.length > 0 &&
    typeof o.slug === "string" &&
    typeof o.name === "string" &&
    typeof o.qtyKg === "number" &&
    Number.isFinite(o.qtyKg) &&
    o.qtyKg > 0
  );
}

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine);
  } catch {
    return [];
  }
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setLines(loadLines());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      localStorage.setItem(STORAGE, JSON.stringify(lines));
    } catch {
      /* ignore */
    }
  }, [lines, ready]);

  const lineTotalUz = useCallback((line: CartLine) => {
    const p = getProductBySlug(line.slug);
    if (!p) return 0;
    const ppk = getPricePerKgForQty(p, line.qtyKg);
    return Math.round(ppk * line.qtyKg);
  }, []);

  const subtotalUz = useMemo(
    () => lines.reduce((s, l) => s + lineTotalUz(l), 0),
    [lines, lineTotalUz]
  );

  const add = useCallback(
    (product: Product, localeName: string, qtyKg: number) => {
      setLines((prev) => {
        const i = prev.findIndex((x) => x.sku === product.sku);
        if (i >= 0) {
          const next = [...prev];
          const q = next[i].qtyKg + qtyKg;
          next[i] = { ...next[i], qtyKg: q };
          return next;
        }
        return [
          ...prev,
          {
            sku: product.sku,
            slug: product.slug,
            name: localeName,
            qtyKg,
          },
        ];
      });
    },
    []
  );

  const updateQty = useCallback((sku: string, qtyKg: number) => {
    if (qtyKg <= 0) {
      setLines((prev) => prev.filter((l) => l.sku !== sku));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.sku === sku ? { ...l, qtyKg } : l))
    );
  }, []);

  const remove = useCallback((sku: string) => {
    setLines((prev) => prev.filter((l) => l.sku !== sku));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(
    () => ({
      lines,
      add,
      updateQty,
      remove,
      clear,
      lineTotalUz,
      subtotalUz,
    }),
    [lines, add, updateQty, remove, clear, lineTotalUz, subtotalUz]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

export function useCart() {
  const c = useContext(CartContext);
  if (!c) throw new Error("useCart inside provider");
  return c;
}
