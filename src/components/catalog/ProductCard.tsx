"use client";

import { Link } from "@/i18n/navigation";
import type { Locale } from "@/types/product";
import type { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useCurrency } from "@/contexts/CurrencyContext";
import { formatMoney, getPricePerKgForQty } from "@/lib/pricing";
import { trackEvent } from "@/lib/analytics";
import { motion } from "framer-motion";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useState } from "react";

type Props = {
  product: Product;
};

export function ProductCard({ product }: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("common");
  const c = useTranslations("catalog");
  const { add } = useCart();
  const { currency } = useCurrency();
  const [toast, setToast] = useState(false);

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
    setTimeout(() => setToast(false), 1800);
  };

  return (
    <motion.article
      layout
      className="group relative flex flex-col overflow-hidden rounded-btt border border-btt-border bg-btt-surface shadow-btt-sm transition hover:shadow-btt"
      whileHover={{ y: -2 }}
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-black/5">
          <Image
            src={img}
            alt={name}
            fill
            sizes="(max-width:768px) 100vw, 33vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
          {product.lowStock && (
            <span className="absolute left-3 top-3 rounded-full bg-btt-accent px-2 py-1 text-xs font-semibold text-white">
              {t("low_stock")}
            </span>
          )}
        </div>
        <div className="flex flex-1 flex-col p-4">
          <h3 className="line-clamp-2 text-base font-semibold leading-snug">
            {name}
          </h3>
          <p className="mt-1 line-clamp-2 text-sm text-btt-muted">
            {product.short[locale]}
          </p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-btt-primary">
              {formatMoney(ppk, currency, locale)}
            </span>
            <span className="text-xs text-btt-muted">{t("per_kg")}</span>
          </div>
          <p className="mt-1 text-xs text-btt-muted">
            {product.stock === "in_stock" ? c("stock_in") : c("stock_order")}
          </p>
        </div>
      </Link>
      <div className="p-4 pt-0">
        <button
          type="button"
          onClick={onAdd}
          className="w-full rounded-full bg-btt-primary py-2.5 text-sm font-semibold text-white transition hover:bg-[var(--btt-primary-hover)]"
        >
          {t("add_cart")}
        </button>
        {toast && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-center text-xs font-medium text-btt-success"
          >
            ✓ {t("add_cart")}
          </motion.p>
        )}
      </div>
    </motion.article>
  );
}
