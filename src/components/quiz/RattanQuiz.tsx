"use client";

import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";
import type { Locale } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import { AnimatePresence, motion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type Segment = "novice" | "master" | "wholesale";

export function RattanQuiz() {
  const t = useTranslations("quiz");
  const c = useTranslations("catalog");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const { add } = useCart();

  const [step, setStep] = useState(0);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [productKind, setProductKind] = useState<"material" | "planter" | null>(
    null
  );
  const [place, setPlace] = useState<"outdoor" | "indoor" | "both" | null>(
    null
  );
  const [vol, setVol] = useState<"12" | "5" | "10" | "unknown" | null>(null);
  const [when, setWhen] = useState<string | null>(null);
  const [endMode, setEndMode] = useState<"idle" | "result" | "quote" | "done">(
    "idle"
  );
  const [contact, setContact] = useState({ phone: "", city: "", company: "" });

  const totalSteps = 5;

  const recommended = useMemo(() => {
    if (!productKind || !place) return [];
    let list = products.filter((p) =>
      productKind === "planter" ? p.category === "planter" : p.category !== "planter"
    );
    if (place === "outdoor")
      list = list.filter(
        (p) => p.application === "outdoor" || p.application === "both"
      );
    if (place === "indoor")
      list = list.filter(
        (p) => p.application === "indoor" || p.application === "both"
      );
    return list.slice(0, 3);
  }, [productKind, place]);

  const start = () => {
    trackEvent("quiz_start", { source: "home_quiz" });
    setStep(1);
  };

  const pickQtyKg = () => {
    if (vol === "10") return 10;
    if (vol === "5") return 5;
    return 1.5;
  };

  const onTime = (label: string) => {
    setWhen(label);
    const needQuote = segment === "wholesale" || vol === "unknown";
    trackEvent("quiz_complete", {
      segment,
      productKind,
      place,
      vol,
      when: label,
      needQuote,
    });
    if (needQuote) {
      setEndMode("quote");
      setStep(6);
    } else {
      setEndMode("result");
      setStep(6);
    }
  };

  const submitQuote = () => {
    trackEvent("quote_submit", {
      segment,
      productKind,
      place,
      vol,
      when,
      ...contact,
    });
    setEndMode("done");
  };

  return (
    <div id="quiz" className="btt-glass-strong scroll-mt-24 p-6 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-stone-50 md:text-2xl">
            {t("start")}
          </h2>
          <p className="mt-1 text-sm text-stone-400">{t("hint")}</p>
        </div>
        {step > 0 && step <= 5 && (
          <p className="text-xs font-medium text-stone-500">
            {t("progress", { n: step, total: totalSteps })}
          </p>
        )}
      </div>

      {step === 0 && (
        <div className="mt-8 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={start}
            className="rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-btt-sm"
          >
            {t("open")}
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="mt-8 grid gap-3 md:grid-cols-3"
          >
            <p className="md:col-span-3 text-sm font-medium">{t("q_segment")}</p>
            {(
              [
                ["novice", "novice" as Segment],
                ["master", "master" as Segment],
                ["wholesale", "wholesale" as Segment],
              ] as const
            ).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setSegment(val);
                  setStep(2);
                }}
                className="rounded-btt border border-white/15 bg-stone-950/50 px-4 py-4 text-left text-sm font-semibold hover:border-amber-500/50"
              >
                {t(key as "novice")}
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="mt-8 grid gap-3 md:grid-cols-2"
          >
            <p className="md:col-span-2 text-sm font-medium">{t("q_product")}</p>
            <button
              type="button"
              onClick={() => {
                setProductKind("material");
                setStep(3);
              }}
              className="rounded-btt border border-white/15 px-4 py-4 text-left hover:border-amber-500/50"
            >
              {t("kind_material")}
            </button>
            <button
              type="button"
              onClick={() => {
                setProductKind("planter");
                setStep(3);
              }}
              className="rounded-btt border border-white/15 px-4 py-4 text-left hover:border-amber-500/50"
            >
              {t("kind_planter")}
            </button>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="s3"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="mt-8 grid gap-3 md:grid-cols-3"
          >
            <p className="md:col-span-3 text-sm font-medium">{t("q_place")}</p>
            {(
              [
                ["use_outdoor", "outdoor" as const],
                ["use_indoor", "indoor" as const],
                ["use_both", "both" as const],
              ] as const
            ).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setPlace(val);
                  setStep(4);
                }}
                className="rounded-btt border border-white/15 px-4 py-3 text-sm font-semibold hover:border-amber-500/50"
              >
                {c(key)}
              </button>
            ))}
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="s4"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="mt-8 grid gap-3 md:grid-cols-2"
          >
            <p className="md:col-span-2 text-sm font-medium">{t("q_volume")}</p>
            {(
              [
                ["w12", "12" as const],
                ["w5", "5" as const],
                ["w10", "10" as const],
              ] as const
            ).map(([key, val]) => (
              <button
                key={key}
                type="button"
                onClick={() => {
                  setVol(val);
                  setStep(5);
                }}
                className="rounded-btt border border-white/15 px-4 py-3 text-sm font-semibold hover:border-amber-500/50"
              >
                {c(key)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setVol("unknown");
                setStep(5);
              }}
              className="rounded-btt border border-white/15 px-4 py-3 text-sm font-semibold hover:border-amber-500/50 md:col-span-2"
            >
              {t("opt_unknown")}
            </button>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="s5"
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -12 }}
            className="mt-8 grid gap-3"
          >
            <p className="text-sm font-medium">{t("q_time")}</p>
            <div className="flex flex-wrap gap-2">
              {(
                [
                  ["time_asap", "asap"],
                  ["time_week", "week"],
                  ["time_month", "month"],
                ] as const
              ).map(([key, id]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTime(t(key))}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm hover:border-amber-500/50"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 6 && endMode === "quote" && (
          <motion.div
            key="quote"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid gap-4"
          >
            <p className="text-sm font-medium">{t("result_quote")}</p>
            <input
              className="w-full rounded-btt border border-white/15 px-4 py-3 text-sm"
              placeholder={t("ph_phone")}
              aria-label={common("phone")}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={contact.phone}
              onChange={(e) =>
                setContact((x) => ({ ...x, phone: e.target.value }))
              }
            />
            <input
              className="w-full rounded-btt border border-white/15 px-4 py-3 text-sm"
              placeholder={t("ph_city_country")}
              aria-label={t("ph_city_country")}
              autoComplete="address-level2"
              value={contact.city}
              onChange={(e) =>
                setContact((x) => ({ ...x, city: e.target.value }))
              }
            />
            <input
              className="w-full rounded-btt border border-white/15 px-4 py-3 text-sm"
              placeholder={common("company")}
              aria-label={common("company")}
              autoComplete="organization"
              value={contact.company}
              onChange={(e) =>
                setContact((x) => ({ ...x, company: e.target.value }))
              }
            />
            <button
              type="button"
              onClick={submitQuote}
              className="rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-3 text-sm font-semibold text-white"
            >
              {common("submit")}
            </button>
          </motion.div>
        )}

        {step === 6 && endMode === "result" && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 grid gap-4"
          >
            <p className="font-semibold">{t("result_skus")}</p>
            <div className="grid gap-3 md:grid-cols-3">
              {recommended.map((p) => (
                <div
                  key={p.sku}
                  className="rounded-btt border border-white/15 p-4"
                >
                  <p className="font-medium">{p.names[locale]}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => add(p, p.names[locale], pickQtyKg())}
                      className="rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-3 py-1.5 text-xs font-semibold text-white"
                    >
                      {t("add_combo")}
                    </button>
                    <Link
                      href={`/product/${p.slug}`}
                      className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold"
                    >
                      {t("open_pdp")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/checkout"
              className="inline-flex w-fit rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-6 py-3 text-sm font-semibold text-white shadow-lg"
            >
              {t("one_click")}
            </Link>
          </motion.div>
        )}

        {endMode === "done" && (
          <motion.p
            key="done"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 text-sm font-medium text-emerald-400"
          >
            {t("quote_success")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
