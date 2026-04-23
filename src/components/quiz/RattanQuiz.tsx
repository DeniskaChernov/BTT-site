"use client";

import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";
import type { Locale } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import {
  pickQuizRecommendations,
  QUIZ_EXCLUSIVE_SKUS,
} from "@/lib/quiz-recommendations";
import {
  bttFieldClass,
  bttPrimaryButtonClass,
  bttQuizChipClass,
  bttQuizOptionClass,
  bttTapReduceClass,
} from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useMemo, useState } from "react";

type Segment = "novice" | "master" | "wholesale";
type WorkGoal = "furniture" | "planter";
type FurnitureUse = "seating" | "other";
type PlanterPath = "ready" | "weave";

const RESULT_STEP = 7;

export function RattanQuiz() {
  const t = useTranslations("quiz");
  const ts = useTranslations("segments");
  const c = useTranslations("catalog");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const { add } = useCart();

  const [step, setStep] = useState(0);
  const [segment, setSegment] = useState<Segment | null>(null);
  const [workGoal, setWorkGoal] = useState<WorkGoal | null>(null);
  const [furnitureUse, setFurnitureUse] = useState<FurnitureUse | null>(null);
  const [planterPath, setPlanterPath] = useState<PlanterPath | null>(null);
  const [productKind, setProductKind] = useState<"material" | "planter" | null>(
    null,
  );
  const [place, setPlace] = useState<"outdoor" | "indoor" | "both" | null>(
    null,
  );
  const [vol, setVol] = useState<"12" | "5" | "10" | "unknown" | null>(null);
  const [when, setWhen] = useState<string | null>(null);
  const [endMode, setEndMode] = useState<"idle" | "result" | "quote" | "done">(
    "idle",
  );
  const [contact, setContact] = useState({ phone: "", city: "", company: "" });
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [quoteSending, setQuoteSending] = useState(false);
  const reduceMotion = useReducedMotion();

  const totalSteps = 6;

  const recommended = useMemo(() => {
    if (!productKind || !place || !workGoal) return [];
    if (workGoal === "furniture" && !furnitureUse) return [];
    if (workGoal === "planter" && !planterPath) return [];
    return pickQuizRecommendations(products, {
      productKind,
      place,
      workGoal,
      furnitureUse,
      planterPath,
    });
  }, [productKind, place, workGoal, furnitureUse, planterPath]);

  const start = () => {
    trackEvent("quiz_start", { source: "home_quiz" });
    setSegment(null);
    setWorkGoal(null);
    setFurnitureUse(null);
    setPlanterPath(null);
    setProductKind(null);
    setPlace(null);
    setVol(null);
    setWhen(null);
    setEndMode("idle");
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
      workGoal,
      furnitureUse,
      planterPath,
      productKind,
      place,
      vol,
      when: label,
      needQuote,
      recommendedCount: needQuote ? 0 : recommended.length,
    });
    if (needQuote) {
      setEndMode("quote");
      setStep(RESULT_STEP);
    } else {
      setEndMode("result");
      setStep(RESULT_STEP);
      trackEvent("quiz_result_view", {
        source: "home_quiz",
        skus: recommended.map((p) => p.sku),
      });
    }
  };

  const submitQuote = async () => {
    if (!contact.phone.trim()) {
      setQuoteError(t("quote_phone_required"));
      return;
    }
    setQuoteError(null);
    setQuoteSending(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "quiz_quote",
          locale,
          fields: {
            phone: contact.phone.trim(),
            city: contact.city.trim(),
            company: contact.company.trim(),
          },
          quiz: {
            segment: segment ?? "",
            workGoal: workGoal ?? "",
            furnitureUse: furnitureUse ?? "",
            planterPath: planterPath ?? "",
            productKind: productKind ?? "",
            place: place ?? "",
            vol: vol ?? "",
            when: when ?? "",
          },
        }),
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !data.ok) {
        setQuoteError(t("quote_send_error"));
        return;
      }
      trackEvent("quote_submit", {
        segment,
        workGoal,
        furnitureUse,
        planterPath,
        productKind,
        place,
        vol,
        when,
        ...contact,
      });
      setEndMode("done");
    } catch {
      setQuoteError(t("quote_send_error"));
    } finally {
      setQuoteSending(false);
    }
  };

  const idle = step === 0;

  return (
    <div
      id="quiz"
      className={cn(
        "btt-glass-strong scroll-mt-24 p-6 md:p-10",
        idle && "mx-auto w-full max-w-xl text-center",
      )}
    >
      <div
        className={cn(
          "flex flex-wrap items-center gap-3",
          idle ? "justify-center" : "justify-between",
        )}
      >
        <div className={cn(idle && "w-full")}>
          {!idle ? (
            <h2 className="text-xl font-semibold text-stone-50 md:text-2xl">
              {step === RESULT_STEP && endMode === "result"
                ? t("title_result")
                : step === RESULT_STEP && endMode === "quote"
                  ? t("title_quote")
                  : t("title_in_progress")}
            </h2>
          ) : null}
          <p
            className={cn(
              "text-sm text-stone-400",
              idle ? "mx-auto max-w-md text-center" : "mt-1",
            )}
          >
            {idle
              ? t("hint")
              : step <= totalSteps
                ? t("hint_active")
                : null}
          </p>
        </div>
        {step > 0 && step <= totalSteps && (
          <p className="text-xs font-medium text-stone-500">
            {t("progress", { n: step, total: totalSteps })}
          </p>
        )}
      </div>

      {step > 0 && step <= totalSteps && (
        <div
          className="mt-4 h-1 w-full overflow-hidden rounded-full bg-white/[0.06]"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={totalSteps}
          aria-valuenow={step}
          aria-label={t("progress", { n: step, total: totalSteps })}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 shadow-[0_0_12px_rgba(245,158,11,0.4)]"
            initial={{ width: 0 }}
            animate={{ width: `${Math.round((step / totalSteps) * 100)}%` }}
            transition={
              reduceMotion
                ? { duration: 0 }
                : { duration: 0.45, ease: [0.22, 1, 0.36, 1] }
            }
          />
        </div>
      )}

      {idle && (
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={start}
            className={cn(
              bttPrimaryButtonClass,
              "btt-focus shadow-btt-sm active:scale-[0.99]",
              bttTapReduceClass,
            )}
          >
            {t("open")}
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="s1"
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
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
                className={cn(bttQuizOptionClass, "px-4 py-4")}
              >
                {ts(key)}
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="s2"
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="mt-8 grid gap-3 md:grid-cols-2"
          >
            <p className="md:col-span-2 text-sm font-medium">{t("q_work_goal")}</p>
            <button
              type="button"
              onClick={() => {
                setWorkGoal("furniture");
                setPlanterPath(null);
                setStep(3);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4")}
            >
              {t("goal_furniture")}
            </button>
            <button
              type="button"
              onClick={() => {
                setWorkGoal("planter");
                setFurnitureUse(null);
                setStep(3);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4")}
            >
              {t("goal_planter")}
            </button>
          </motion.div>
        )}

        {step === 3 && workGoal === "furniture" && (
          <motion.div
            key="s3f"
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="mt-8 grid gap-3 md:grid-cols-2"
          >
            <p className="md:col-span-2 text-sm font-medium">{t("q_furniture_use")}</p>
            <button
              type="button"
              onClick={() => {
                setFurnitureUse("seating");
                setPlanterPath(null);
                setProductKind("material");
                setStep(4);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4")}
            >
              {t("furniture_seating")}
            </button>
            <button
              type="button"
              onClick={() => {
                setFurnitureUse("other");
                setPlanterPath(null);
                setProductKind("material");
                setStep(4);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4")}
            >
              {t("furniture_other")}
            </button>
          </motion.div>
        )}

        {step === 3 && workGoal === "planter" && (
          <motion.div
            key="s3p"
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="mt-8 grid gap-3 md:grid-cols-2"
          >
            <p className="md:col-span-2 text-sm font-medium">{t("q_planter_path")}</p>
            <button
              type="button"
              onClick={() => {
                setPlanterPath("ready");
                setFurnitureUse(null);
                setProductKind("planter");
                setStep(4);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4")}
            >
              {t("planter_ready")}
            </button>
            <button
              type="button"
              onClick={() => {
                setPlanterPath("weave");
                setFurnitureUse(null);
                setProductKind("material");
                setStep(4);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4")}
            >
              {t("planter_weave")}
            </button>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="s4"
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
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
                  setStep(5);
                }}
                className={cn(bttQuizOptionClass, "px-4 py-3 text-sm")}
              >
                {c(key)}
              </button>
            ))}
          </motion.div>
        )}

        {step === 5 && (
          <motion.div
            key="s5"
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
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
                  setStep(6);
                }}
                className={cn(bttQuizOptionClass, "px-4 py-3 text-sm")}
              >
                {c(key)}
              </button>
            ))}
            <button
              type="button"
              onClick={() => {
                setVol("unknown");
                setStep(6);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-3 text-sm md:col-span-2")}
            >
              {t("opt_unknown")}
            </button>
          </motion.div>
        )}

        {step === 6 && (
          <motion.div
            key="s6"
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
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
                  className={bttQuizChipClass}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === RESULT_STEP && endMode === "quote" && (
          <motion.div
            key="quote"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="mt-8 grid gap-4"
          >
            <p className="text-sm font-medium">{t("result_quote")}</p>
            {quoteError ? (
              <p className="text-sm text-red-400" role="alert">
                {quoteError}
              </p>
            ) : null}
            <input
              className={cn(bttFieldClass, "w-full")}
              placeholder={t("ph_phone")}
              aria-label={common("phone")}
              aria-invalid={quoteError ? true : undefined}
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              value={contact.phone}
              onChange={(e) => {
                setQuoteError(null);
                setContact((x) => ({ ...x, phone: e.target.value }));
              }}
            />
            <input
              className={cn(bttFieldClass, "w-full")}
              placeholder={t("ph_city_country")}
              aria-label={t("ph_city_country")}
              autoComplete="address-level2"
              value={contact.city}
              onChange={(e) =>
                setContact((x) => ({ ...x, city: e.target.value }))
              }
            />
            <input
              className={cn(bttFieldClass, "w-full")}
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
              onClick={() => void submitQuote()}
              disabled={quoteSending}
              className={cn(
                bttPrimaryButtonClass,
                "btt-focus active:scale-[0.99]",
                bttTapReduceClass,
              )}
            >
              {quoteSending ? common("loading") : common("submit")}
            </button>
          </motion.div>
        )}

        {step === RESULT_STEP && endMode === "result" && (
          <motion.div
            key="result"
            initial={reduceMotion ? false : { opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.25 }}
            className="mt-8 grid gap-4"
          >
            <div className="grid gap-3 md:grid-cols-3">
              {recommended.map((p) => (
                <div
                  key={p.sku}
                  className="btt-interactive-lift flex h-full min-h-0 flex-col rounded-btt border border-white/15 bg-white/[0.02] p-4 transition hover:border-amber-500/25"
                >
                  {QUIZ_EXCLUSIVE_SKUS.has(p.sku) ? (
                    <p className="mb-2 w-fit rounded-full border border-amber-500/35 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-amber-200/95">
                      {t("badge_exclusive")}
                    </p>
                  ) : null}
                  <p className="line-clamp-2 min-h-[2.5rem] font-medium leading-snug">
                    {p.names[locale]}
                  </p>
                  {QUIZ_EXCLUSIVE_SKUS.has(p.sku) ? (
                    <p className="mt-1 text-xs text-stone-500">{t("exclusive_hint")}</p>
                  ) : null}
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        const kg = pickQtyKg();
                        trackEvent("quiz_add_to_cart", {
                          source: "home_quiz",
                          sku: p.sku,
                          slug: p.slug,
                          kg,
                          workGoal,
                          furnitureUse,
                          planterPath,
                        });
                        add(p, p.names[locale], kg);
                      }}
                      className={cn(
                        bttPrimaryButtonClass,
                        "btt-focus px-3 py-1.5 text-xs active:scale-[0.98]",
                      )}
                    >
                      {t("add_combo")}
                    </button>
                    <Link
                      href={`/product/${p.slug}`}
                      className="btt-focus rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold transition hover:border-amber-500/40 hover:bg-white/[0.05]"
                    >
                      {t("open_pdp")}
                    </Link>
                  </div>
                </div>
              ))}
            </div>
            <Link
              href="/checkout"
              onClick={() =>
                trackEvent("quiz_checkout", { source: "home_quiz" })
              }
              className={cn(
                bttPrimaryButtonClass,
                "btt-focus inline-flex w-fit active:scale-[0.99]",
                bttTapReduceClass,
              )}
            >
              {t("one_click")}
            </Link>
          </motion.div>
        )}

        {endMode === "done" && (
          <motion.p
            key="done"
            initial={reduceMotion ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="mt-8 text-sm font-medium text-emerald-400"
          >
            {t("quote_success")}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
