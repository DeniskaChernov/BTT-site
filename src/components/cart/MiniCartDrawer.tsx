"use client";

import { Link } from "@/i18n/navigation";
import { useCart } from "@/contexts/CartContext";
import { getProductBySlug } from "@/data/products";
import { getCartBulkInsight } from "@/lib/cart/cart-bulk-insight";
import { BTT_Z } from "@/lib/layering";
import { bttDrawerSpring, bttOverlayFade } from "@/lib/motion";
import { formatUzs, isPricedPerKg, lineItemTotalUz } from "@/lib/pricing";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ShoppingBag, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function MiniCartDrawer({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const { lines, subtotalUz } = useCart();
  const t = useTranslations("cart");
  const tNav = useTranslations("nav");
  const bulkHint = useMemo(() => {
    const insight = getCartBulkInsight(lines);
    return insight ? tNav("cart_bulk_hint", { kg: insight.kgToNext }) : null;
  }, [lines, tNav]);
  const reduceMotion = useReducedMotion();

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <AnimatePresence>
        {open ? (
          <Dialog.Portal forceMount>
            <Dialog.Overlay asChild>
              <motion.button
                type="button"
                aria-label={t("mini_close")}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={bttOverlayFade(reduceMotion)}
                className="fixed inset-0 bg-black/60 backdrop-blur-[2px]"
                style={{ zIndex: BTT_Z.drawerBackdrop }}
                onClick={() => onOpenChange(false)}
              />
            </Dialog.Overlay>
            <Dialog.Content asChild>
              <motion.div
                initial={reduceMotion ? false : { x: "100%" }}
                animate={{ x: 0 }}
                exit={reduceMotion ? undefined : { x: "100%" }}
                transition={bttDrawerSpring(reduceMotion)}
                className="fixed inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-[#0a0908]/95 backdrop-blur-xl"
                style={{ zIndex: BTT_Z.miniCart }}
              >
                <div className="flex items-center justify-between border-b border-white/[0.08] px-5 py-4">
                  <Dialog.Title className="flex items-center gap-2 text-base font-semibold text-stone-100">
                    <ShoppingBag className="h-5 w-5 text-amber-400" aria-hidden />
                    {t("mini_title")}
                  </Dialog.Title>
                  <Dialog.Close className="btt-focus rounded-full border border-white/15 p-2 text-stone-300">
                    <X className="h-4 w-4" aria-hidden />
                  </Dialog.Close>
                </div>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {lines.length === 0 ? (
                    <p className="py-8 text-center text-sm text-stone-500">{t("empty")}</p>
                  ) : (
                    <ul className="space-y-3">
                      {lines.map((line) => {
                        const p = getProductBySlug(line.slug);
                        const perKg = p ? isPricedPerKg(p) : true;
                        return (
                          <li key={line.sku} className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-3">
                            <Link href={`/product/${line.slug}`} onClick={() => onOpenChange(false)} className="text-sm font-semibold text-stone-100 hover:text-amber-300">
                              {line.name}
                            </Link>
                            <p className="mt-1 text-xs text-stone-500">
                              {line.qtyKg} {perKg ? t("unit_kg") : t("unit_pcs")} · {formatUzs(p ? lineItemTotalUz(p, line.qtyKg) : 0)}
                            </p>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </div>
                <div className="border-t border-white/[0.08] px-5 py-4">
                  {bulkHint ? (
                    <p className="mb-3 text-center text-xs font-medium text-amber-400/90">{bulkHint}</p>
                  ) : null}
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-400">{t("subtotal")}</span>
                    <span className="font-bold tabular-nums text-amber-300">{formatUzs(subtotalUz)}</span>
                  </div>
                  <Link href="/cart" onClick={() => onOpenChange(false)} className={cn(bttPrimaryButtonClass, "btt-focus mt-4 flex w-full justify-center py-3")}>
                    {t("mini_checkout")}
                  </Link>
                </div>
              </motion.div>
            </Dialog.Content>
          </Dialog.Portal>
        ) : null}
      </AnimatePresence>
    </Dialog.Root>
  );
}
