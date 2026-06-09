"use client";

import {
  normalizeOrderStatus,
  orderFulfillmentType,
  orderStatusChain,
  type DisplayOrderStatus,
} from "@/lib/order-fulfillment";
import type { StoredOrder } from "@/lib/order-history";
import { useTranslations } from "next-intl";

type Props = { order: StoredOrder };

function stepState(
  step: DisplayOrderStatus,
  current: DisplayOrderStatus,
  chain: DisplayOrderStatus[],
): "done" | "current" | "upcoming" {
  const ci = chain.indexOf(current);
  const si = chain.indexOf(step);
  if (si < ci) return "done";
  if (si === ci) return "current";
  return "upcoming";
}

export function OrderStatusTimeline({ order }: Props) {
  const t = useTranslations("account");
  const current = normalizeOrderStatus(order.status);

  if (current === "CANCELLED") {
    return (
      <p className="mb-4 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
        {t("status_cancelled")}
      </p>
    );
  }

  const chain = orderStatusChain(orderFulfillmentType(order));

  return (
    <ol className="mb-4 space-y-0" aria-label={t("order_status_timeline")}>
      {chain.map((step, index) => {
        const state = stepState(step, current, chain);
        const isLast = index === chain.length - 1;
        return (
          <li key={step} className="relative flex gap-3 pb-4 last:pb-0">
            {!isLast ? (
              <span
                className={`absolute left-[0.4375rem] top-5 h-[calc(100%-0.25rem)] w-px ${
                  state === "done" ? "bg-amber-500/50" : "bg-white/10"
                }`}
                aria-hidden
              />
            ) : null}
            <span
              className={`relative z-[1] mt-0.5 h-3.5 w-3.5 shrink-0 rounded-full border-2 ${
                state === "current"
                  ? "border-amber-400 bg-amber-500/30"
                  : state === "done"
                    ? "border-amber-500/60 bg-amber-500/50"
                    : "border-white/20 bg-white/[0.04]"
              }`}
              aria-hidden
            />
            <div className="min-w-0 flex-1 pt-px">
              <p
                className={`text-sm font-medium ${
                  state === "current"
                    ? "text-amber-100"
                    : state === "done"
                      ? "text-stone-300"
                      : "text-stone-600"
                }`}
              >
                {t(`status_${step.toLowerCase()}`)}
              </p>
              {state === "current" && order.statusNote ? (
                <p className="mt-0.5 text-xs text-stone-400">{order.statusNote}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
