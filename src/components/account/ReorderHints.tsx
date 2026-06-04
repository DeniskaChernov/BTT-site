"use client";

import { buildReorderHints } from "@/lib/account/reorder-intelligence";
import { formatUzs } from "@/lib/pricing";
import type { StoredOrder } from "@/lib/order-history";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";

type Props = { order: StoredOrder };

export function ReorderHints({ order }: Props) {
  const t = useTranslations("account");
  const hints = buildReorderHints(order);
  if (hints.length === 0) return null;

  return (
    <div className="mt-4 rounded-xl border border-amber-500/20 bg-amber-950/20 p-3 text-sm">
      <p className="font-semibold text-amber-200/95">{t("reorder_title")}</p>
      <ul className="mt-2 space-y-2 text-stone-400">
        {hints.map((h) => (
          <li key={h.sku}>
            <Link href={`/product/${h.slug}`} className="text-amber-300 hover:text-amber-200">
              {h.name}
            </Link>
            {" · "}
            {h.qty} кг · {formatUzs(h.nowPriceUz)}
            {Math.abs(h.driftPct) >= 3 ? (
              <span className="ml-1 text-xs text-stone-500">
                ({t("reorder_drift", { pct: String(h.driftPct > 0 ? `+${h.driftPct}` : h.driftPct) })})
              </span>
            ) : null}
          </li>
        ))}
      </ul>
      <Link href="/catalog" className="mt-3 inline-block text-xs font-semibold text-amber-400 hover:text-amber-300">
        {t("reorder_cta")}
      </Link>
    </div>
  );
}
