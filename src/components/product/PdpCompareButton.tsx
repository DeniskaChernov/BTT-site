"use client";

import { Link } from "@/i18n/navigation";
import { COMPARE_MAX, readCompareSkus, toggleCompareSku } from "@/lib/compare/compare-store";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

type Props = { sku: string };

export function PdpCompareButton({ sku }: Props) {
  const t = useTranslations("compare");
  const [active, setActive] = useState(false);

  useEffect(() => {
    setActive(readCompareSkus().includes(sku));
  }, [sku]);

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3">
      <button
        type="button"
        onClick={() => setActive(toggleCompareSku(sku).includes(sku))}
        className="text-sm font-medium text-stone-400 transition hover:text-stone-100"
      >
        {active ? t("in_compare") : t("add_compare")}
      </button>
      <Link href="/compare" className="text-xs text-stone-500 hover:text-stone-300">
        {t("open_compare", { max: String(COMPARE_MAX) })}
      </Link>
    </div>
  );
}
