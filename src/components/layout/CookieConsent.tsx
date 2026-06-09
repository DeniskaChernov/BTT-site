"use client";

import { Link } from "@/i18n/navigation";
import { updateAnalyticsConsent } from "@/lib/analytics";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const STORAGE_KEY = "btt_consent_v1";

type ConsentValue = "granted" | "denied";

function readStoredConsent(): ConsentValue | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(STORAGE_KEY);
  return raw === "granted" || raw === "denied" ? raw : null;
}

function persistConsent(value: ConsentValue) {
  window.localStorage.setItem(STORAGE_KEY, value);
  document.cookie = `btt_consent=${value}; path=/; max-age=${60 * 60 * 24 * 180}; SameSite=Lax`;
}

export function CookieConsent() {
  const t = useTranslations("consent");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const existing = readStoredConsent();
    if (existing) {
      updateAnalyticsConsent(existing === "granted");
      return;
    }
    setVisible(true);
  }, []);

  const choose = (value: ConsentValue) => {
    persistConsent(value);
    updateAnalyticsConsent(value === "granted");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-labelledby="btt-consent-title"
      aria-describedby="btt-consent-body"
      className="fixed inset-x-0 bottom-0 z-[90] p-4 pb-[max(1rem,env(safe-area-inset-bottom))]"
    >
      <div className="btt-container">
        <div className="mx-auto flex max-w-4xl flex-col gap-4 rounded-2xl border border-white/10 bg-stone-950/95 p-5 shadow-2xl shadow-black/50 backdrop-blur-xl md:flex-row md:items-center md:gap-6 md:p-6">
          <div className="min-w-0 flex-1">
            <p id="btt-consent-title" className="text-sm font-semibold text-stone-100">
              {t("title")}
            </p>
            <p id="btt-consent-body" className="mt-1.5 text-sm leading-relaxed text-stone-400">
              {t("body")}{" "}
              <Link href="/cookies" className="text-stone-200/90 underline-offset-2 hover:underline">
                {t("policy")}
              </Link>
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap gap-2">
            <button
              type="button"
              onClick={() => choose("denied")}
              className="btt-focus rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-stone-300 transition hover:border-white/25 hover:bg-white/[0.04]"
            >
              {t("decline")}
            </button>
            <button
              type="button"
              onClick={() => choose("granted")}
              className="btt-focus rounded-full bg-gradient-to-r from-white/20 to-white/8 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/40"
            >
              {t("accept")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
