"use client";

import { getProductBySku } from "@/data/products";
import { Link } from "@/i18n/navigation";
import { readCompareSkus, writeCompareSkus } from "@/lib/compare/compare-store";
import { formatUzs, getPricePerKgForQty, isPricedPerKg } from "@/lib/pricing";
import { productMainImage } from "@/lib/product-media";
import { bttSecondaryNeutralButtonClass } from "@/lib/ui-classes";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import type { Locale, Product } from "@/types/product";

function resolveProducts(skus: string[]): Product[] {
  return skus.map((sku) => getProductBySku(sku)).filter((p): p is Product => Boolean(p));
}

export function CompareTable() {
  const t = useTranslations("compare");
  const tc = useTranslations("common");
  const locale = useLocale() as Locale;
  const [skus, setSkus] = useState<string[]>([]);

  useEffect(() => {
    setSkus(readCompareSkus());
  }, []);

  const items = resolveProducts(skus);

  const remove = (sku: string) => {
    const next = skus.filter((s) => s !== sku);
    writeCompareSkus(next);
    setSkus(next);
  };

  if (items.length === 0) {
    return (
      <p className="mt-8 text-stone-500">
        {t("empty")}{" "}
        <Link href="/catalog" className="text-amber-400 hover:text-amber-300">
          {t("empty_cta")}
        </Link>
      </p>
    );
  }

  const rows: { key: string; label: string; value: (p: Product) => string }[] = [
    { key: "sku", label: t("row_sku"), value: (p) => p.sku },
    {
      key: "thickness",
      label: t("row_thickness"),
      value: (p) => (p.thicknessMm ? `${p.thicknessMm} mm` : "—"),
    },
    { key: "shape", label: t("row_shape"), value: (p) => p.shape },
    { key: "hardness", label: t("row_hardness"), value: (p) => p.hardness },
    {
      key: "price",
      label: t("row_price"),
      value: (p) => {
        const qty = isPricedPerKg(p) ? 5 : 1;
        return `${formatUzs(getPricePerKgForQty(p, qty))} / ${isPricedPerKg(p) ? tc("per_kg") : "шт"}`;
      },
    },
  ];

  return (
    <div className="mt-8 overflow-x-auto">
      <table className="w-full min-w-[640px] border-collapse text-sm">
        <thead>
          <tr>
            <th className="p-3 text-left text-stone-500">{t("attribute")}</th>
            {items.map((p) => (
              <th key={p.sku} className="p-3 text-left align-top">
                <div className="relative mb-2 aspect-square w-24 overflow-hidden rounded-xl">
                  <Image src={productMainImage(p)} alt={p.names[locale]} fill className="object-cover" sizes="96px" />
                </div>
                <Link href={`/product/${p.slug}`} className="font-semibold text-amber-300 hover:text-amber-200">
                  {p.names[locale]}
                </Link>
                <button
                  type="button"
                  onClick={() => remove(p.sku)}
                  className="mt-2 block text-xs text-stone-500 hover:text-stone-300"
                >
                  {t("remove")}
                </button>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} className="border-t border-white/[0.06]">
              <td className="p-3 font-medium text-stone-400">{row.label}</td>
              {items.map((p) => (
                <td key={p.sku} className="p-3 text-stone-200">
                  {row.value(p)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/catalog" className={`${bttSecondaryNeutralButtonClass} mt-8 inline-flex`}>
        {t("add_more")}
      </Link>
    </div>
  );
}
