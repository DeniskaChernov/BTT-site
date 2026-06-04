"use client";

import { useCart } from "@/contexts/CartContext";
import { useIntent } from "@/contexts/IntentContext";
import { useEffect, useRef } from "react";

export function IntentCartSync() {
  const { lines } = useCart();
  const { ready, syncCartSkus, trackCartAdd } = useIntent();
  const prevQtyRef = useRef<Map<string, number>>(new Map());

  useEffect(() => {
    if (!ready) return;
    const skus = lines.map((l) => l.sku);
    syncCartSkus(skus);
    const prev = prevQtyRef.current;
    for (const line of lines) {
      const was = prev.get(line.sku);
      if (was === undefined || was !== line.qtyKg) {
        trackCartAdd(line.sku, line.qtyKg);
      }
    }
    prevQtyRef.current = new Map(lines.map((l) => [l.sku, l.qtyKg]));
  }, [lines, ready, syncCartSkus, trackCartAdd]);

  return null;
}
