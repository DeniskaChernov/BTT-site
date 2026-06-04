"use client";

import { useCart } from "@/contexts/CartContext";
import { useIntent } from "@/contexts/IntentContext";
import { useEffect, useRef } from "react";

export function IntentCartSync() {
  const { lines } = useCart();
  const { ready, syncCartSkus, trackCartAdd } = useIntent();
  const prevSkusRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!ready) return;
    const skus = lines.map((l) => l.sku);
    syncCartSkus(skus);
    const prev = prevSkusRef.current;
    for (const line of lines) {
      if (!prev.has(line.sku)) trackCartAdd(line.sku, line.qtyKg);
    }
    prevSkusRef.current = new Set(skus);
  }, [lines, ready, syncCartSkus, trackCartAdd]);

  return null;
}
