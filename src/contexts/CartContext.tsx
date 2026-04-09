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
const MIN_QTY_KG = 0.5;
const QTY_STEP_KG = 0.5;

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

function lineStillValid(line: CartLine): boolean {
  return getProductBySlug(line.slug) !== undefined;
}

function normalizeQtyKg(qtyKg: number): number | null {
  if (!Number.isFinite(qtyKg)) return null;
  const normalized = Math.round(qtyKg / QTY_STEP_KG) * QTY_STEP_KG;
  if (normalized < MIN_QTY_KG) return null;
  return normalized;
}

function loadLines(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isCartLine).filter(lineStillValid);
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
    const onStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE) return;
      setLines(loadLines());
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
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
      const normalizedQty = normalizeQtyKg(qtyKg);
      if (normalizedQty === null) return;
      setLines((prev) => {
        const i = prev.findIndex((x) => x.sku === product.sku);
        if (i >= 0) {
          const next = [...prev];
          const merged = next[i].qtyKg + normalizedQty;
          const qtyRounded = normalizeQtyKg(merged) ?? merged;
          next[i] = { ...next[i], qtyKg: qtyRounded };
          return next;
        }
        return [
          ...prev,
          {
            sku: product.sku,
            slug: product.slug,
            name: localeName,
            qtyKg: normalizedQty,
          },
        ];
      });
    },
    []
  );

  const updateQty = useCallback((sku: string, qtyKg: number) => {
    const normalizedQty = normalizeQtyKg(qtyKg);
    if (normalizedQty === null) {
      setLines((prev) => prev.filter((l) => l.sku !== sku));
      return;
    }
    setLines((prev) =>
      prev.map((l) => (l.sku === sku ? { ...l, qtyKg: normalizedQty } : l))
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
