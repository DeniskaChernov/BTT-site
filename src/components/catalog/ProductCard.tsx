"use client";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types/product";
import type { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { formatUzs, getPricePerKgForQty } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const c = useTranslations("catalog");
  const { add } = useCart();
  const [toast, setToast] = useState(false);
  const toastTimerRef = useRef<number | null>(null);

  const name = product.names[locale];
  const ppk = getPricePerKgForQty(product, 1.5);
  const img = `https://picsum.photos/seed/${product.imageSeed}/640/640`;

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
      className="group relative flex flex-col overflow-hidden rounded-3xl border border-white/[0.08] bg-white/[0.03] shadow-xl backdrop-blur-xl transition duration-300 hover:border-amber-500/25 hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.15)]"
      whileHover={{ y: -4 }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-stone-950">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 transition group-hover:opacity-80" />
          {product.lowStock && (
            <span className="absolute left-3 top-3 rounded-full bg-gradient-to-r from-orange-600 to-amber-600 px-2.5 py-1 text-xs font-semibold text-white shadow-lg">
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
          className={cn(bttPrimaryButtonClass, "w-full")}
        >
          {t("add_cart")}
        </button>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center text-xs font-medium text-emerald-400"
          >
            ✓ {t("add_cart")}
          </motion.p>
        )}
      </div>
    </motion.article>
  );
}
