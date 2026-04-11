"use client";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types/product";
import type { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { productMainImage } from "@/lib/product-media";
import { formatUzs, getPricePerKgForQty } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, ShoppingBag } from "lucide-react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const col = useTranslations("collective");
  const tc = useTranslations("cart");
  const c = useTranslations("catalog");
  const { add } = useCart();
  const [toast, setToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const name = product.names[locale];
  const ppk = getPricePerKgForQty(product, 1.5);
  const img = productMainImage(product);

  const onAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add(product, name, 1.5);
    trackEvent("add_to_cart", {
      sku: product.sku,
      value: Math.round(ppk * 1.5),
      currency: "UZS",
    });
    setToast(true);
    if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    toastTimerRef.current = window.setTimeout(() => setToast(false), 1800);
  };

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) window.clearTimeout(toastTimerRef.current);
    };
  }, []);

  return (
    <motion.article
      layout
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-xl backdrop-blur-xl transition duration-300 hover:border-amber-500/30 hover:shadow-[0_24px_64px_-12px_rgba(245,158,11,0.18)]"
      whileHover={{ y: -5 }}
    >
      <Link href={`/product/${product.slug}`} className="block outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#070605]">
        <div className="relative aspect-square overflow-hidden bg-stone-950">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-70 transition duration-300 group-hover:opacity-90" />
          <div className="absolute bottom-4 left-4 right-4 flex translate-y-3 items-center justify-between opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-black/45 px-3 py-1.5 text-xs font-semibold text-stone-100 shadow-lg backdrop-blur-md">
              {t("learn_more")}
              <ArrowRight className="h-3.5 w-3.5 text-amber-400" aria-hidden />
            </span>
          </div>
          {product.collective && (
            <span className="absolute right-3 top-3 rounded-full border border-amber-400/50 bg-amber-950/90 px-2.5 py-1 text-xs font-semibold text-amber-200 shadow-lg backdrop-blur-sm">
              {col("card_badge")}
            </span>
          )}
          {product.lowStock && (
            <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg ring-1 ring-white/20">
              {t("low_stock")}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug text-stone-100">
            {name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm text-stone-500">
            {product.short[locale]}
          </p>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-bold tabular-nums text-amber-400">
              {formatUzs(ppk)}
            </span>
            <span className="text-xs text-stone-500">{t("per_kg")}</span>
          </div>
          <p className="mt-1 text-xs text-stone-600">
            {product.stock === "in_stock" ? c("stock_in") : c("stock_order")}
          </p>
        </div>
      </Link>
      <div className="px-5 pb-5">
        <button
          type="button"
          onClick={onAdd}
          className={cn(
            bttPrimaryButtonClass,
            "btt-focus flex w-full items-center justify-center gap-2 active:scale-[0.98]",
          )}
        >
          <ShoppingBag className="h-4 w-4 opacity-90" aria-hidden />
          {t("add_cart")}
        </button>
        <AnimatePresence>
          {toast && (
            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="mt-2 flex items-center justify-center gap-1.5 text-center text-xs font-medium text-emerald-400"
            >
              <Check className="h-3.5 w-3.5 shrink-0" strokeWidth={2.5} aria-hidden />
              {tc("added_flash")}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  );
}
