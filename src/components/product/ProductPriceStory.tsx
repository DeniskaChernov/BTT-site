"use client";

import type { Product } from "@/types/product";
import { formatUzs, getPricePerKgForQty, isPricedPerKg, isTwistedRattan } from "@/lib/pricing";
import { useTranslations } from "next-intl";

type Props = { product: Product; qty: number };

export function ProductPriceStory({ product, qty }: Props) {
  const t = useTranslations("product");
  const perKg = isPricedPerKg(product);
  const twisted = isTwistedRattan(product);

  const tierKey = (() => {
    if (!perKg) {
      if (qty >= 10) return "tier_piece_10";
      if (qty >= 3) return "tier_piece_3";
      return "tier_piece_1";
    }
    if (twisted) {
      if (qty >= 400) return "tier_twisted_400";
      if (qty >= 200) return "tier_twisted_200";
      return "tier_retail";
    }
    if (qty >= 500) return "tier_rattan_500";
    if (qty >= 200) return "tier_rattan_200";
    return "tier_retail";
  })();

  const ppk = getPricePerKgForQty(product, qty);
  const nextHint =
    perKg && product.category === "material"
      ? (() => {
          if (twisted && qty < 200) return { at: 200, price: getPricePerKgForQty(product, 200) };
          if (twisted && qty < 400) return { at: 400, price: getPricePerKgForQty(product, 400) };
          if (!twisted && qty < 200) return { at: 200, price: getPricePerKgForQty(product, 200) };
          if (!twisted && qty < 500) return { at: 500, price: getPricePerKgForQty(product, 500) };
          return null;
        })()
      : null;

  return (
    <p className="mt-3 text-xs leading-relaxed text-stone-500">
      <span className="font-medium text-stone-200/90">{t(tierKey as "tier_retail")}</span>
      {" · "}
      {t("price_story_ppk", { price: formatUzs(ppk) })}
      {nextHint && nextHint.price < ppk ? (
        <>
          {" "}
          {t("price_story_next", { kg: nextHint.at })}
        </>
      ) : null}
    </p>
  );
}
