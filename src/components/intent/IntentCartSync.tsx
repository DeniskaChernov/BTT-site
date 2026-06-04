"use client";

import { useCart } from "@/contexts/CartContext";
import { useIntent } from "@/contexts/IntentContext";
import { useEffect } from "react";

/** Синхронизирует SKU корзины с IntentProfile для ранжирования и upsell. */
export function IntentCartSync() {
  const { lines } = useCart();
  const { syncCartSkus, ready } = useIntent();

  useEffect(() => {
    if (!ready) return;
    syncCartSkus(lines.map((l) => l.sku));
  }, [lines, ready, syncCartSkus]);

  return null;
}
