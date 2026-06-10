"use client";

import { OrderStatusTimeline } from "@/components/account/OrderStatusTimeline";
import { normalizeOrderStatus } from "@/lib/order-fulfillment";
import { formatUzs } from "@/lib/pricing";
import { readOrderAccessToken } from "@/lib/order-access-client";
import type { StoredOrder } from "@/lib/order-history";
import { ORDERS_STORAGE_KEY, readOrders } from "@/lib/order-history";
import { isMeaningfulPhone, normalizePhone } from "@/lib/phone";
import { ReorderHints } from "@/components/account/ReorderHints";
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

type MeUser = {
  id: string;
  email: string;
  name: string | null;
  phone: string | null;
};

export function OrderHistory({ profilePhone }: Props) {
  const t = useTranslations("account");
  const tc = useTranslations("cart");
  const tch = useTranslations("checkout");
  const locale = useLocale();

  const [me, setMe] = useState<MeUser | null | undefined>(undefined);
  const [localOrders, setLocalOrders] = useState<StoredOrder[]>([]);
  const [remoteOrders, setRemoteOrders] = useState<StoredOrder[] | undefined>(
    undefined,
  );
  /** 429 — сервер ограничил частоту; показываем только локальные заказы */
  const [remoteRateLimited, setRemoteRateLimited] = useState(false);
  const [remoteDenied, setRemoteDenied] = useState(false);
  const [remoteError, setRemoteError] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  const loadLocal = useCallback(() => {
    setLocalOrders(readOrders());
  }, []);

  useEffect(() => {
    let cancel = false;
    fetch("/api/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : { user: null }))
      .then((d: { user: MeUser | null }) => {
        if (cancel) return;
        setMe(d.user ?? null);
      })
      .catch(() => {
        if (!cancel) setMe(null);
      });
    return () => {
      cancel = true;
    };
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
    if (me === undefined) return;

    if (me) {
      let cancelled = false;
      setRemoteOrders(undefined);
      setRemoteRateLimited(false);
      setRemoteDenied(false);
      setRemoteError(false);
      fetch("/api/orders", { credentials: "include" })
        .then(async (res) => {
          if (res.status === 429) {
            if (!cancelled) setRemoteRateLimited(true);
            return [];
          }
          if (res.status >= 500 && !cancelled) setRemoteError(true);
          if (!cancelled) setRemoteRateLimited(false);
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
          if (!cancelled) {
            setRemoteOrders([]);
            setRemoteRateLimited(false);
            setRemoteError(true);
          }
        });
      return () => {
        cancelled = true;
      };
    }

    const phoneNorm = normalizePhone(profilePhone);
    if (!phoneNorm || !isMeaningfulPhone(phoneNorm)) {
      setRemoteOrders([]);
      setRemoteDenied(false);
      setRemoteRateLimited(false);
      setRemoteError(false);
      return;
    }
    const accessToken = readOrderAccessToken(phoneNorm);
    if (!accessToken) {
      setRemoteOrders([]);
      setRemoteDenied(true);
      setRemoteRateLimited(false);
      setRemoteError(false);
      return;
    }
    let cancelled = false;
    setRemoteOrders(undefined);
    setRemoteRateLimited(false);
    setRemoteDenied(false);
    setRemoteError(false);
    fetch(
      `/api/orders?phone=${encodeURIComponent(phoneNorm)}&access=${encodeURIComponent(accessToken)}`,
    )
      .then(async (res) => {
        if (res.status === 429) {
          if (!cancelled) setRemoteRateLimited(true);
          return [];
        }
        if (res.status === 401) {
          if (!cancelled) setRemoteDenied(true);
          return [];
        }
        if (res.status >= 500 && !cancelled) {
          setRemoteError(true);
        }
        if (!cancelled) setRemoteRateLimited(false);
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
        if (!cancelled) {
          setRemoteOrders([]);
          setRemoteRateLimited(false);
          setRemoteError(true);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [me, profilePhone]);

  const orders = useMemo(() => {
    const remote = remoteOrders ?? [];
    const merged = new Map<string, StoredOrder>();
    for (const o of remote) merged.set(o.id, o);
    for (const o of localOrders) {
      if (!merged.has(o.id)) merged.set(o.id, o);
    }
    return [...merged.values()].sort((a, b) => {
      const tb = Date.parse(b.createdAt);
      const ta = Date.parse(a.createdAt);
      const nb = Number.isFinite(tb) ? tb : 0;
      const na = Number.isFinite(ta) ? ta : 0;
      return nb - na;
    });
  }, [localOrders, remoteOrders]);

  const statusText = (order: StoredOrder) =>
    t(`status_${normalizeOrderStatus(order.status).toLowerCase()}`);

  const paymentStatusKey = (order: StoredOrder) => {
    const ps = order.paymentStatus ?? "PENDING";
    switch (ps) {
      case "REQUIRES_ACTION":
        return "payment_requires_action";
      case "PAID":
        return "payment_paid";
      case "FAILED":
        return "payment_failed";
      case "REFUNDED":
        return "payment_refunded";
      case "PARTIALLY_REFUNDED":
        return "payment_partially_refunded";
      default:
        return "payment_pending";
    }
  };

  const paymentTone = (order: StoredOrder) => {
    switch (order.paymentStatus ?? "PENDING") {
      case "PAID":
        return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
      case "FAILED":
        return "border-red-500/35 bg-red-500/10 text-red-300";
      case "REQUIRES_ACTION":
        return "border-amber-500/35 bg-amber-500/10 text-amber-300";
      case "REFUNDED":
      case "PARTIALLY_REFUNDED":
        return "border-violet-500/35 bg-violet-500/10 text-violet-300";
      default:
        return "border-white/20 bg-white/[0.04] text-stone-300";
    }
  };

  const statusTone = (order: StoredOrder) => {
    switch (normalizeOrderStatus(order.status)) {
      case "DELIVERED":
        return "border-emerald-500/35 bg-emerald-500/10 text-emerald-300";
      case "CANCELLED":
        return "border-red-500/35 bg-red-500/10 text-red-300";
      case "SHIPPED":
        return "border-sky-500/35 bg-sky-500/10 text-sky-300";
      case "PACKING":
        return "border-amber-500/35 bg-amber-500/10 text-amber-300";
      case "PRODUCTION":
        return "border-orange-500/35 bg-orange-500/10 text-orange-300";
      case "CONFIRMED":
        return "border-violet-500/35 bg-violet-500/10 text-violet-300";
      default:
        return "border-white/20 bg-white/[0.04] text-stone-300";
    }
  };

  const phoneForHistory = normalizePhone(profilePhone);

  if (me === undefined) {
    return (
      <section className="mt-12 border-t border-white/[0.08] pt-12">
        <h2 className="text-xl font-bold text-stone-50 md:text-2xl">{t("orders_title")}</h2>
        <p className="mt-4 text-sm text-stone-500">{t("session_loading")}</p>
      </section>
    );
  }

  if (me === null && (!phoneForHistory || !isMeaningfulPhone(phoneForHistory))) {
    return (
      <section className="mt-12 border-t border-white/[0.08] pt-12">
        <h2 className="text-xl font-bold text-stone-50 md:text-2xl">{t("orders_title")}</h2>
        <p className="mt-3 text-sm text-stone-500">{t("orders_need_auth_or_phone")}</p>
      </section>
    );
  }

  if (remoteOrders === undefined) {
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
        {remoteRateLimited ? (
          <p className="mt-3 text-sm text-amber-400/95">{t("orders_rate_limited")}</p>
        ) : remoteDenied ? (
          <p className="mt-3 text-sm text-amber-400/95">{t("orders_verify_needed")}</p>
        ) : remoteError ? (
          <p className="mt-3 text-sm text-amber-400/95">{t("orders_server_error")}</p>
        ) : (
          <p className="mt-3 text-sm text-stone-500">{t("orders_empty")}</p>
        )}
        <p className="mt-2 text-xs text-stone-600">{t("orders_local_hint")}</p>
      </section>
    );
  }

  return (
    <section className="mt-12 border-t border-white/[0.08] pt-12">
      <h2 className="text-xl font-bold text-stone-50 md:text-2xl">{t("orders_title")}</h2>
      {remoteRateLimited ? (
        <p className="mt-2 text-xs text-amber-500/90">{t("orders_rate_limited")}</p>
      ) : remoteDenied ? (
        <p className="mt-2 text-xs text-amber-500/90">{t("orders_verify_needed")}</p>
      ) : remoteError ? (
        <p className="mt-2 text-xs text-amber-500/90">{t("orders_server_error")}</p>
      ) : null}
      <p className="mt-1 text-xs text-stone-600">{t("orders_local_hint")}</p>
      <ul className="mt-6 space-y-4">
        {orders.map((order) => {
          const expanded = openId === order.id;
          return (
            <li key={order.id} className="btt-glass overflow-hidden rounded-2xl">
              <button
                type="button"
                onClick={() => setOpenId(expanded ? null : order.id)}
                aria-expanded={expanded}
                className="btt-focus flex w-full items-start justify-between gap-4 p-4 text-left transition hover:bg-white/[0.03] md:p-5"
              >
                <div>
                  <p className="font-mono text-xs text-amber-500/90">{order.id.slice(0, 13)}…</p>
                  <p className="mt-1 text-sm text-stone-400">
                    {formatWhen(order.createdAt, locale)}
                  </p>
                  <p className="mt-1 text-xs text-stone-600">
                    {t("order_status_updated")}{" "}
                    {formatWhen(order.statusUpdatedAt ?? order.createdAt, locale)}
                  </p>
                  <p className="mt-2 text-sm text-stone-500">
                    {t("order_lines_count", { count: order.lines.length })}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3">
                  <span
                    className={`hidden rounded-full border px-2.5 py-1 text-xs font-semibold md:inline-flex ${statusTone(order)}`}
                  >
                    {statusText(order)}
                  </span>
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
                  <ReorderHints order={order} />
                  <div className="mb-4 mt-4 flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${statusTone(order)}`}
                    >
                      {statusText(order)}
                    </span>
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold ${paymentTone(order)}`}
                    >
                      {t(paymentStatusKey(order))}
                    </span>
                  </div>
                  <OrderStatusTimeline order={order} />
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
                      <dd className="text-stone-300">{t("order_pay_manager")}</dd>
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
                    {order.trackingNumber ? (
                      <div className="sm:col-span-2">
                        <dt className="text-xs uppercase tracking-wide text-stone-600">
                          {t("order_tracking")}
                        </dt>
                        <dd className="text-stone-300">
                          {order.trackingProvider
                            ? `${order.trackingProvider}: `
                            : ""}
                          {order.trackingNumber}
                          {order.trackingUrl ? (
                            <>
                              {" · "}
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btt-focus rounded-sm text-amber-400 underline-offset-4 outline-none hover:underline"
                              >
                                {t("order_tracking_open")}
                              </a>
                            </>
                          ) : null}
                        </dd>
                      </div>
                    ) : null}
                    {order.paymentReference ? (
                      <div className="sm:col-span-2">
                        <dt className="text-xs uppercase tracking-wide text-stone-600">
                          {t("order_payment_ref")}
                        </dt>
                        <dd className="text-stone-300">
                          {order.paymentProvider
                            ? `${order.paymentProvider}: `
                            : ""}
                          {order.paymentReference}
                          {order.paymentUrl ? (
                            <>
                              {" · "}
                              <a
                                href={order.paymentUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btt-focus rounded-sm text-amber-400 underline-offset-4 outline-none hover:underline"
                              >
                                {t("order_payment_open")}
                              </a>
                            </>
                          ) : null}
                        </dd>
                      </div>
                    ) : null}
                  </dl>
                  <ul className="mt-4 space-y-2 border-t border-white/[0.06] pt-4">
                    {order.lines.map((line) => (
                      <li
                        key={`${order.id}-${line.sku}`}
                        className="flex flex-wrap items-baseline justify-between gap-2 text-sm"
                      >
                        <Link
                          href={`/product/${line.slug}`}
                          className="btt-focus min-w-0 flex-1 rounded-sm text-stone-200 outline-none hover:text-amber-400"
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
                  <p className="mt-3 text-xs text-stone-500">
                    {t("order_help")}{" "}
                    <Link
                      href="/contacts"
                      className="btt-focus rounded-sm text-amber-400 underline-offset-4 outline-none hover:underline"
                    >
                      {t("order_help_link")}
                    </Link>
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
