"use client";

import { useCart } from "@/contexts/CartContext";
import { validateCartMoq } from "@/lib/cart/moq-validator";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

export function CartMoqWarnings() {
  const { lines } = useCart();
  const t = useTranslations("cart");
  const issues = useMemo(() => validateCartMoq(lines), [lines]);

  if (issues.length === 0) return null;

  return (
    <div
      role="alert"
      className="mb-6 rounded-2xl border border-red-500/30 bg-red-950/30 px-4 py-3 text-sm text-red-100/95"
    >
      <p className="font-semibold">{t("moq_title")}</p>
      <ul className="mt-2 list-inside list-disc space-y-1 text-xs text-red-200/90">
        {issues.map((issue) => (
          <li key={issue.sku}>
            <Link href={`/product/${issue.slug}`} className="underline hover:text-red-50">
              {issue.name}
            </Link>
            {" — "}
            {issue.kind === "below_min"
              ? t("moq_below_min", { min: issue.min })
              : t("moq_wrong_step", { step: issue.step })}
          </li>
        ))}
      </ul>
    </div>
  );
}
