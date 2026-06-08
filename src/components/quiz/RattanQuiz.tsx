"use client";

import { Link } from "@/i18n/navigation";
import { products } from "@/data/products";
import type { Locale } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useIntent } from "@/contexts/IntentContext";
import { trackEvent } from "@/lib/analytics";
import { rankQuizRecommendations } from "@/lib/intent/rank-quiz";
import { formatPhoneInput } from "@/lib/phone";
import {
  formatUzs,
  getPricePerKgForQty,
  isPricedPerKg,
  lineItemTotalUz,
} from "@/lib/pricing";
import { pickQuizRecommendations, QUIZ_EXCLUSIVE_SKUS } from "@/lib/quiz-recommendations";
import { telegramBotStartUrl } from "@/lib/telegram";
import {
  bttFieldClass,
  bttPrimaryButtonClass,
  bttQuizChipClass,
  bttQuizOptionClass,
  bttTapReduceClass,
} from "@/lib/ui-classes";
import {
  clearQuizPersisted,
  loadQuizPersisted,
  saveQuizPersisted,
} from "@/lib/quiz-persist";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useLocale, useTranslations } from "next-intl";
import { useEffect, useMemo, useRef, useState } from "react";

type QuizSegment = "workshop" | "planter_pro" | "planter_hobby";
type WorkGoal = "furniture" | "planter";
type FurnitureUse = "seating" | "other";
type PlanterPath = "ready" | "weave";

const RESULT_STEP = 5;
/** Для нитки нет разницы «улица/дом» в подборе — вопрос в квизе убран, в аналитике оставляем нейтральное значение. */
const QUIZ_PLACE = "both" as const;

type RattanQuizProps = {
  autoStart?: boolean;
};

export function RattanQuiz({ autoStart = false }: RattanQuizProps) {
  const t = useTranslations("quiz");
  const c = useTranslations("catalog");
  const cart = useTranslations("cart");
  const common = useTranslations("common");
  const locale = useLocale() as Locale;
  const { add } = useCart();
  const { profile, ready, trackQuizComplete } = useIntent();

  const [step, setStep] = useState(autoStart ? 1 : 0);
  const [segment, setSegment] = useState<QuizSegment | null>(null);
  const [workGoal, setWorkGoal] = useState<WorkGoal | null>(null);
  const [furnitureUse, setFurnitureUse] = useState<FurnitureUse | null>(null);
  const [planterPath, setPlanterPath] = useState<PlanterPath | null>(null);
  const [productKind, setProductKind] = useState<"material" | "planter" | null>(
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
  const [addedFlash, setAddedFlash] = useState(false);
  const reduceMotion = useReducedMotion();
  const autoStartedRef = useRef(false);

  useEffect(() => {
    if (!autoStart || autoStartedRef.current) return;
    autoStartedRef.current = true;
    trackEvent("quiz_start", { source: "home_quiz", auto: true });
  }, [autoStart]);

  useEffect(() => {
    const p = loadQuizPersisted();
    if (
      !p ||
      p.step < 1 ||
      p.step > RESULT_STEP ||
      (p.step === RESULT_STEP && p.endMode === "idle")
    ) {
      return;
    }
    setStep(p.step);
    setWorkGoal(p.workGoal);
    setFurnitureUse(p.furnitureUse);
    setPlanterPath(p.planterPath);
    setProductKind(p.productKind);
    setVol(p.vol);
    setWhen(p.when);
    setEndMode(p.endMode);
    setContact(p.contact);
  }, []);

  useEffect(() => {
    if (step === 0 && endMode === "idle") return;
    const t = window.setTimeout(() => {
      saveQuizPersisted({
        v: 1,
        step,
        workGoal,
        furnitureUse,
        planterPath,
        productKind,
        vol,
        when,
        endMode,
        contact,
      });
    }, 400);
    return () => window.clearTimeout(t);
  }, [
    step,
    workGoal,
    furnitureUse,
    planterPath,
    productKind,
    vol,
    when,
    endMode,
    contact,
  ]);

  const totalSteps = 4;

  const progressStep =
    step >= RESULT_STEP
      ? totalSteps
      : segment === "planter_hobby" && step >= 2
        ? step - 1
        : step;

  const goBack = () => {
    if (step <= 1) return;
    if (step === RESULT_STEP) {
      setEndMode("idle");
      setStep(4);
      return;
    }
    setStep((s) => Math.max(1, s - 1));
  };

  const recommended = useMemo(() => {
    if (!productKind || !workGoal) return [];
    if (workGoal === "furniture" && !furnitureUse) return [];
    if (workGoal === "planter" && !planterPath) return [];
    const ctx = {
      productKind,
      place: QUIZ_PLACE,
      workGoal,
      furnitureUse,
      planterPath,
    };
    if (!ready) {
      return pickQuizRecommendations(products, ctx);
    }
    return rankQuizRecommendations(products, ctx, profile, 3);
  }, [productKind, workGoal, furnitureUse, planterPath, profile, ready]);

  const start = () => {
    clearQuizPersisted();
    trackEvent("quiz_start", { source: "home_quiz" });
    setWorkGoal(null);
    setFurnitureUse(null);
    setPlanterPath(null);
    setProductKind(null);
    setVol(null);
    setWhen(null);
    setEndMode("idle");
    setStep(1);
  };

  const pickQtyForProduct = (product: (typeof recommended)[number]) => {
    if (!isPricedPerKg(product)) return 1;
    if (vol === "10") return 10;
    if (vol === "5") return 5;
    return 5;
  };

  const addAllRecommended = () => {
    for (const p of recommended) {
      add(p, p.names[locale], pickQtyForProduct(p));
    }
    trackEvent("quiz_add_all", {
      source: "home_quiz",
      skus: recommended.map((p) => p.sku),
    });
    setAddedFlash(true);
    window.setTimeout(() => setAddedFlash(false), 2200);
  };

  const onTime = (label: string) => {
    setWhen(label);
    const needQuote = vol === "unknown" || vol === "10";
    trackEvent("quiz_complete", {
      workGoal,
      furnitureUse,
      planterPath,
      productKind,
      place: QUIZ_PLACE,
      vol,
      when: label,
      needQuote,
      recommendedCount: needQuote ? 0 : recommended.length,
    });
    trackQuizComplete({
      workGoal,
      furnitureUse,
      planterPath,
      productKind,
      vol,
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
        credentials: "include",
        body: JSON.stringify({
          kind: "quiz_quote",
          locale,
          fields: {
            phone: contact.phone.trim(),
            city: contact.city.trim(),
            company: contact.company.trim(),
          },
          quiz: {
            workGoal: workGoal ?? "",
            furnitureUse: furnitureUse ?? "",
            planterPath: planterPath ?? "",
            productKind: productKind ?? "",
            place: QUIZ_PLACE,
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
        workGoal,
        furnitureUse,
        planterPath,
        productKind,
        place: QUIZ_PLACE,
        vol,
        when,
        ...contact,
      });
      setEndMode("done");
      clearQuizPersisted();
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
          <div className="flex items-center gap-3">
            {step > 1 ? (
              <button
                type="button"
                onClick={goBack}
                className="text-xs font-medium text-stone-500 underline-offset-2 transition hover:text-stone-300 hover:underline"
              >
                {common("back")}
              </button>
            ) : null}
            <p className="text-xs font-medium text-stone-500">
              {t("progress", { n: progressStep, total: totalSteps })}
            </p>
          </div>
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
            key="s1segment"
            initial={reduceMotion ? false : { opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, x: -12 }}
            transition={{ duration: reduceMotion ? 0 : 0.2 }}
            className="mt-8 grid gap-3"
          >
            <p className="text-sm font-medium">{t("q_segment")}</p>
            <button
              type="button"
              onClick={() => {
                setSegment("workshop");
                setWorkGoal("furniture");
                setPlanterPath(null);
                setProductKind("material");
                setStep(2);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4 text-left")}
            >
              {t("segment_workshop")}
            </button>
            <button
              type="button"
              onClick={() => {
                setSegment("planter_pro");
                setWorkGoal("planter");
                setFurnitureUse(null);
                setStep(2);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4 text-left")}
            >
              {t("segment_planter_pro")}
            </button>
            <button
              type="button"
              onClick={() => {
                setSegment("planter_hobby");
                setWorkGoal("planter");
                setPlanterPath("weave");
                setFurnitureUse(null);
                setProductKind("material");
                setStep(2);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4 text-left")}
            >
              {t("segment_planter_hobby")}
            </button>
          </motion.div>
        )}

        {step === 2 && segment === "workshop" && (
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
                setStep(3);
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
                setStep(3);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4")}
            >
              {t("furniture_other")}
            </button>
          </motion.div>
        )}

        {step === 2 && segment === "planter_pro" && (
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
                setStep(3);
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
                setStep(3);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-4")}
            >
              {t("planter_weave")}
            </button>
          </motion.div>
        )}

        {step === 2 && segment === "planter_hobby" && (
          <motion.div
            key="s2hobby-vol"
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
                  setStep(3);
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
                setStep(3);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-3 text-sm md:col-span-2")}
            >
              {t("opt_unknown")}
            </button>
          </motion.div>
        )}

        {step === 3 && segment !== "planter_hobby" && (
          <motion.div
            key="s4vol"
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
                  setStep(4);
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
                setStep(4);
              }}
              className={cn(bttQuizOptionClass, "px-4 py-3 text-sm md:col-span-2")}
            >
              {t("opt_unknown")}
            </button>
          </motion.div>
        )}

        {step === 3 && segment === "planter_hobby" && (
          <motion.div
            key="s3hobby-time"
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

        {step === 4 && segment !== "planter_hobby" && (
          <motion.div
            key="s5time"
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
                setContact((x) => ({
                  ...x,
                  phone: formatPhoneInput(e.target.value),
                }));
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
            <p className="text-sm font-medium text-stone-200">{t("result_skus")}</p>
            {addedFlash ? (
              <p className="text-sm font-medium text-emerald-400">{cart("added_flash")}</p>
            ) : null}
            <div className="grid gap-3 md:grid-cols-3">
              {recommended.map((p) => {
                const qty = pickQtyForProduct(p);
                const perKg = isPricedPerKg(p);
                const lineTotal = lineItemTotalUz(p, qty);
                const unitPrice = getPricePerKgForQty(p, qty);
                const collectiveUrl = p.collective
                  ? telegramBotStartUrl(p.collective.botStartParam)
                  : null;
                return (
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
                  <p className="mt-2 text-sm font-semibold text-amber-200/95">
                    {formatUzs(lineTotal)}
                    <span className="ml-1 text-xs font-normal text-stone-500">
                      {perKg
                        ? `· ${qty} ${cart("unit_kg")} (${formatUzs(unitPrice)}/${cart("unit_kg")})`
                        : `· ${qty} ${cart("unit_pcs")}`}
                    </span>
                  </p>
                  {QUIZ_EXCLUSIVE_SKUS.has(p.sku) ? (
                    <p className="mt-1 text-xs text-stone-500">{t("exclusive_hint")}</p>
                  ) : null}
                  {p.stock === "on_order" && collectiveUrl ? (
                    <p className="mt-2 text-xs leading-relaxed text-stone-500">
                      {t("collective_hint")}
                    </p>
                  ) : null}
                  <div className="mt-auto flex flex-wrap gap-2 pt-3">
                    <button
                      type="button"
                      onClick={() => {
                        trackEvent("quiz_add_to_cart", {
                          source: "home_quiz",
                          sku: p.sku,
                          slug: p.slug,
                          qtyKg: qty,
                          workGoal,
                          furnitureUse,
                          planterPath,
                        });
                        add(p, p.names[locale], qty);
                      }}
                      className={cn(
                        bttPrimaryButtonClass,
                        "btt-focus px-3 py-1.5 text-xs active:scale-[0.98]",
                      )}
                    >
                      {common("add_cart")}
                    </button>
                    {p.stock === "on_order" && collectiveUrl ? (
                      <a
                        href={collectiveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btt-focus rounded-full border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-xs font-semibold text-amber-100 transition hover:bg-amber-500/15"
                      >
                        {t("collective_cta")}
                      </a>
                    ) : null}
                    <Link
                      href={`/product/${p.slug}`}
                      className="btt-focus rounded-full border border-white/15 px-3 py-1.5 text-xs font-semibold transition hover:border-amber-500/40 hover:bg-white/[0.05]"
                    >
                      {t("open_pdp")}
                    </Link>
                  </div>
                </div>
              );
              })}
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={addAllRecommended}
                disabled={recommended.length === 0}
                className={cn(
                  bttPrimaryButtonClass,
                  "btt-focus active:scale-[0.99]",
                  bttTapReduceClass,
                )}
              >
                {t("add_all")}
              </button>
              <Link
                href="/checkout"
                onClick={() =>
                  trackEvent("quiz_checkout", { source: "home_quiz" })
                }
                className={cn(
                  "btt-focus inline-flex items-center rounded-full border border-white/15 bg-white/[0.04] px-5 py-3 text-sm font-semibold text-stone-100 transition hover:border-amber-500/35 hover:bg-white/[0.06]",
                  bttTapReduceClass,
                )}
              >
                {common("buy")}
              </Link>
            </div>
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
