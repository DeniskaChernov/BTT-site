"use client";

import type { Product } from "@/types/product";
import { formatUzs, getPricePerKgForQty, isPricedPerKg } from "@/lib/pricing";
import { bttFieldCompactClass } from "@/lib/ui-classes";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

const KG_PER_METER = 0.12;

type Props = { product: Product };

export function YieldCalculator({ product }: Props) {
  const t = useTranslations("product");
  const tc = useTranslations("common");
  const perKg = isPricedPerKg(product);
  const [meters, setMeters] = useState(10);

  const kgEst = useMemo(
    () => Math.max(perKg ? 5 : 1, Math.ceil((meters * KG_PER_METER) / 5) * 5),
    [meters, perKg],
  );
  const ppk = useMemo(() => getPricePerKgForQty(product, kgEst), [product, kgEst]);
  const lineEst = ppk * kgEst;

  if (!perKg) return null;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-4">
      <p className="text-sm font-semibold text-stone-100">{t("calc")}</p>
      <p className="mt-1 text-xs text-stone-500">{t("calc_hint")}</p>
      <label className="mt-3 block text-xs text-stone-400">
        {t("meters")}
        <input
          type="number"
          min={1}
          step={1}
          value={meters}
          onChange={(e) => setMeters(Math.max(1, Number(e.target.value) || 1))}
          className={bttFieldCompactClass + " mt-1 w-full"}
        />
      </label>
      <p className="mt-3 text-sm text-stone-300">
        {t("kg_est")}: <span className="font-semibold text-stone-200">{kgEst}</span> ·{" "}
        {formatUzs(lineEst)} ({tc("per_kg")})
      </p>
    </div>
  );
}
