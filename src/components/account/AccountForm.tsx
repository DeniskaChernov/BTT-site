"use client";

import { OrderHistory } from "@/components/account/OrderHistory";
import { trackEvent } from "@/lib/analytics";
import { useCart } from "@/contexts/CartContext";
import { formatUzs } from "@/lib/pricing";
import { readLocalProfile, writeLocalProfile } from "@/lib/local-profile";
import { normalizePhone } from "@/lib/phone";
import { bttFieldClass, bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function AccountForm() {
  const t = useTranslations("account");
  const n = useTranslations("nav");
  const tc = useTranslations("cart");
  const c = useTranslations("common");
  const { lines, subtotalUz, lineTotalUz } = useCart();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [savedFlash, setSavedFlash] = useState(false);

  useEffect(() => {
    const p = readLocalProfile();
    setEmail(p.email);
    setPhone(p.phone);
  }, []);

  useEffect(() => {
    if (!savedFlash) return;
    const timer = window.setTimeout(() => setSavedFlash(false), 4500);
    return () => window.clearTimeout(timer);
  }, [savedFlash]);

  const save = () => {
    const emailTrim = email.trim();
    const phoneNorm = normalizePhone(phone);
    writeLocalProfile({ email: emailTrim, phone: phoneNorm });
    setEmail(emailTrim);
    setPhone(phoneNorm);
    trackEvent("profile_save", {
      hasEmail: !!emailTrim,
      hasPhone: !!phoneNorm,
    });
    setSavedFlash(true);
  };

  return (
    <div className="btt-container py-12 md:py-16">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
        <div>
          <h1 className="text-3xl font-bold text-stone-50 md:text-4xl">{t("title")}</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-400">{t("sub")}</p>

          <form
            className="btt-glass mt-8 grid gap-4 rounded-3xl p-6 md:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              save();
            }}
          >
            <label className="grid gap-1 text-sm text-stone-300">
              {t("email_label")}
              <input
                className={bttFieldClass}
                placeholder={t("ph_email")}
                type="email"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="grid gap-1 text-sm text-stone-300">
              {c("phone")}
              <input
                className={bttFieldClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder={t("ph_phone")}
                type="tel"
                name="phone"
                autoComplete="tel"
                inputMode="tel"
              />
            </label>
            <button type="submit" className={bttPrimaryButtonClass}>
              {t("save")}
            </button>
          </form>

          {savedFlash && (
            <p
              className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100"
              role="status"
            >
              {t("save_done")}
            </p>
          )}
          <p className="mt-4 text-xs text-stone-500">{t("phone_saved")}</p>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="btt-glass-strong rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              {t("snapshot_title")}
            </p>
            {lines.length === 0 ? (
              <p className="mt-3 text-sm text-stone-400">{t("snapshot_empty")}</p>
            ) : (
              <>
                <ul className="mt-3 max-h-48 space-y-2 overflow-y-auto text-sm">
                  {lines.map((l) => (
                    <li
                      key={l.sku}
                      className="flex justify-between gap-3 border-b border-white/[0.06] pb-2 last:border-0"
                    >
                      <span className="min-w-0 truncate text-stone-300">{l.name}</span>
                      <span className="shrink-0 tabular-nums text-amber-400/95">
                        {formatUzs(lineTotalUz(l))}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-3 flex justify-between text-sm text-stone-400">
                  <span>{tc("subtotal")}</span>
                  <span className="font-semibold tabular-nums text-stone-100">
                    {formatUzs(subtotalUz)}
                  </span>
                </p>
              </>
            )}
            <Link
              href="/cart"
              className={cn(
                bttPrimaryButtonClass,
                "mt-4 flex w-full justify-center py-2.5 text-sm",
                lines.length === 0 && "opacity-90",
              )}
            >
              {t("snapshot_open")}
            </Link>
          </div>

          <div className="btt-glass rounded-3xl p-6">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
              {t("shortcuts")}
            </p>
            <nav className="mt-4 grid gap-2 text-sm" aria-label={t("shortcuts")}>
              <Link
                href="/catalog"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-stone-200 transition hover:border-amber-500/30 hover:bg-white/[0.06]"
              >
                {n("catalog")}
              </Link>
              <Link
                href="/cart"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-stone-200 transition hover:border-amber-500/30 hover:bg-white/[0.06]"
              >
                {n("cart")}
              </Link>
              <Link
                href="/checkout"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-stone-200 transition hover:border-amber-500/30 hover:bg-white/[0.06]"
              >
                {tc("to_checkout")}
              </Link>
            </nav>
          </div>
        </aside>
      </div>

      <OrderHistory profilePhone={phone} />
    </div>
  );
}
