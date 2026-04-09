"use client";

import { formatUzs } from "@/lib/pricing";
import type { StoredOrder } from "@/lib/order-history";
import { ORDERS_STORAGE_KEY, readOrders } from "@/lib/order-history";
import { normalizePhone } from "@/lib/phone";
import { Link } from "@/i18n/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";

function formatWhen(iso: string, locale: string): string {
  const d = Date.parse(iso);
  if (!Number.isFinite(d)) return iso;
  const tag =
    locale === "en" ? "en-GB" : locale === "uz" ? "uz-UZ" : "ru-RU";
  return new Intl.DateTimeFormat(tag, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(d));
}

type Props = {
  profilePhone: string;
};

export function OrderHistory({ profilePhone }: Props) {
  const t = useTranslations("account");
  const tc = useTranslations("cart");
  const tch = useTranslations("checkout");
  const locale = useLocale();

  const [localOrders, setLocalOrders] = useState<StoredOrder[]>([]);
  const [remoteOrders, setRemoteOrders] = useState<StoredOrder[] | undefined>(
    undefined,
  );
  const [openId, setOpenId] = useState<string | null>(null);

  const loadLocal = useCallback(() => {
    setLocalOrders(readOrders());
  }, []);

  useEffect(() => {
    loadLocal();
  }, [loadLocal]);

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ORDERS_STORAGE_KEY || e.key === null) loadLocal();
    };
    const onCustom = () => loadLocal();
    window.addEventListener("storage", onStorage);
    window.addEventListener("btt-orders-changed", onCustom);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("btt-orders-changed", onCustom);
    };
  }, [loadLocal]);

  useEffect(() => {
    const phoneNorm = normalizePhone(profilePhone);
    if (!phoneNorm) {
      setRemoteOrders([]);
      return;
    }
    let cancelled = false;
    setRemoteOrders(undefined);
    fetch(`/api/orders?phone=${encodeURIComponent(phoneNorm)}`)
      .then(async (res) => {
        if (!res.ok) return [];
        try {
          const d = (await res.json()) as { orders?: StoredOrder[] };
          return Array.isArray(d.orders) ? d.orders : [];
        } catch {
          return [];
        }
      })
      .then((list) => {
        if (!cancelled) setRemoteOrders(list);
      })
      .catch(() => {
        if (!cancelled) setRemoteOrders([]);
      });
    return () => {
      cancelled = true;
    };
  }, [profilePhone]);

  const orders = useMemo(() => {
    const remote = remoteOrders ?? [];
    const merged = new Map<string, StoredOrder>();
    for (const o of [...localOrders, ...remote]) {
      if (!merged.has(o.id)) merged.set(o.id, o);
    }
    return [...merged.values()].sort(
      (a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt),
    );
  }, [localOrders, remoteOrders]);

  const payKey = (pay: string) => {
    const map = {
      uzcard: "pay_uzcard",
      humo: "pay_humo",
      payme: "pay_payme",
      click: "pay_click",
      invoice: "pay_invoice",
      cod: "pay_cod",
    } as const;
    const k = map[pay as keyof typeof map];
    return k ? tch(k) : pay;
  };

  const phoneForHistory = normalizePhone(profilePhone);
  const loading = remoteOrders === undefined && phoneForHistory.length > 0;

  if (!phoneForHistory) {
    return (
      <section className="mt-12 border-t border-white/[0.08] pt-12">
        <h2 className="text-xl font-bold text-stone-50 md:text-2xl">{t("orders_title")}</h2>
        <p className="mt-3 text-sm text-stone-500">{t("orders_need_phone")}</p>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="mt-12 border-t border-white/[0.08] pt-12">
        <h2 className="text-xl font-bold text-stone-50 md:text-2xl">{t("orders_title")}</h2>
        <p className="mt-4 text-sm text-stone-500">{t("orders_loading")}</p>
      </section>
    );
  }

  if (orders.length === 0) {
    return (
      <section className="mt-12 border-t border-white/[0.08] pt-12">
        <h2 className="text-xl font-bold text-stone-50 md:text-2xl">{t("orders_title")}</h2>
        <p className="mt-3 text-sm text-stone-500">{t("orders_empty")}</p>
        <p className="mt-2 text-xs text-stone-600">{t("orders_local_hint")}</p>
      </section>
    );
  }

  return (
    <section className="mt-12 border-t border-white/[0.08] pt-12">
      <h2 className="text-xl font-bold text-stone-50 md:text-2xl">{t("orders_title")}</h2>
      <p className="mt-1 text-xs text-stone-600">{t("orders_local_hint")}</p>
      <ul className="mt-6 space-y-4">
        {orders.map((order) => {
          const expanded = openId === order.id;
          return (
            <li key={order.id} className="btt-glass overflow-hidden rounded-2xl">
              <button
                type="button"
                onClick={() => setOpenId(expanded ? null : order.id)}
                className="flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-white/[0.03] md:p-5"
              >
                <div>
                  <p className="font-mono text-xs text-amber-500/90">{order.id.slice(0, 13)}…</p>
                  <p className="mt-1 text-sm text-stone-400">
                    {formatWhen(order.createdAt, locale)}
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    {t("order_lines_count", { count: order.lines.length })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-lg font-bold tabular-nums text-amber-400">
                    {formatUzs(order.totalUz)}
                  </span>
                  {expanded ? (
                    <ChevronUp className="h-5 w-5 text-stone-500" aria-hidden />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-stone-500" aria-hidden />
                  )}
                </div>
              </button>
              {expanded && (
                <div className="border-t border-white/[0.06] px-4 py-4 md:px-5 md:pb-5">
                  <dl className="grid gap-2 text-sm text-stone-400 sm:grid-cols-2">
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-stone-600">
                        {t("order_ship")}
                      </dt>
                      <dd className="text-stone-300">
                        {order.ship === "courier" ? tch("ship_courier") : tch("ship_pickup")}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs uppercase tracking-wide text-stone-600">
                        {t("order_pay")}
                      </dt>
                      <dd className="text-stone-300">{payKey(order.pay)}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-xs uppercase tracking-wide text-stone-600">
                        {t("order_contact")}
                      </dt>
                      <dd className="text-stone-300">
                        {order.customerName} · {order.phone}
                        {order.address ? ` · ${order.address}` : null}
                      </dd>
                    </div>
                  </dl>
                  <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                    {order.lines.map((line) => (
                      <li
                        key={`${order.id}-${line.sku}`}
                        className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                      >
                        <Link
                          href={`/product/${line.slug}`}
                          className="min-w-0 flex-1 text-stone-200 hover:text-amber-400"
                        >
                          {line.name}
                        </Link>
                        <span className="text-stone-500">
                          {line.qtyKg} {tc("qty_kg")}
                        </span>
                        <span className="tabular-nums text-amber-400/90">
                          {formatUzs(line.lineTotalUz)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <p className="mt-4 flex justify-between border-t border-white/[0.06] pt-4 text-sm font-medium text-stone-300">
                    <span>{tc("subtotal")}</span>
                    <span className="tabular-nums text-stone-100">{formatUzs(order.totalUz)}</span>
                  </p>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
