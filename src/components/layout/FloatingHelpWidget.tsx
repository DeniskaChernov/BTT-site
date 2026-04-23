"use client";

import { usePathname } from "@/i18n/navigation";
import { BTT_EASE, BTT_SPRING_SNAPPY } from "@/lib/motion";
import { telegramPaymentChatUrl } from "@/lib/telegram";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  HeartHandshake,
  MessageCircle,
  Phone,
  Send,
  X,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

const PHONE_TEL = "+998771044422";
const PHONE_DISPLAY = "+998 77 104 44 22";
const WHATSAPP_URL = `https://wa.me/${PHONE_TEL.replace(/[^0-9]/g, "")}`;

/** Роуты, где свой sticky-CTA уже занимает низ экрана или это технический раздел. */
const HIDDEN_PATH_PREFIXES = ["/product/", "/checkout", "/cart", "/account"];

function shouldShowOn(pathname: string): boolean {
  const normalized = pathname.replace(/\/$/, "") || "/";
  return !HIDDEN_PATH_PREFIXES.some((p) =>
    p.endsWith("/") ? normalized.startsWith(p) : normalized === p || normalized.startsWith(`${p}/`),
  );
}

/**
 * Глобальный floating-виджет помощи: плавающая CTA-кнопка с раскрывающимися
 * каналами (телефон / WhatsApp / Telegram). Скрывается на PDP и checkout.
 */
export function FloatingHelpWidget() {
  const pathname = usePathname();
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState(false);
  const telegram = telegramPaymentChatUrl();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!shouldShowOn(pathname)) return null;

  return (
    <div
      className="pointer-events-none fixed bottom-[max(1.25rem,env(safe-area-inset-bottom,0px))] right-4 z-[60] flex flex-col items-end gap-3 sm:right-6"
      aria-live="polite"
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            key="help-menu"
            role="dialog"
            aria-label={s("help_title")}
            initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.96 }}
            transition={reduceMotion ? { duration: 0 } : BTT_SPRING_SNAPPY}
            className="pointer-events-auto w-[min(88vw,18rem)] overflow-hidden rounded-3xl border border-amber-500/25 bg-[#0c0a09]/95 p-4 shadow-[0_24px_64px_-12px_rgba(245,158,11,0.3)] backdrop-blur-xl"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/90">
                  {s("help_kicker")}
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-100">
                  {s("help_title")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="btt-focus inline-flex h-7 w-7 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-stone-300 transition hover:border-white/30 hover:text-stone-100"
                aria-label={s("help_kicker")}
              >
                <X className="h-3.5 w-3.5" aria-hidden />
              </button>
            </div>
            <p className="mt-2 text-xs leading-relaxed text-stone-400">
              {s("help_sub")}
            </p>
            <ul className="mt-4 grid gap-2">
              <li>
                <motion.a
                  href={`tel:${PHONE_TEL}`}
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="btt-focus flex items-center gap-3 rounded-2xl border border-amber-500/35 bg-gradient-to-r from-amber-600 to-orange-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition hover:brightness-110"
                >
                  <Phone className="h-4 w-4 shrink-0" aria-hidden />
                  <span className="truncate">
                    {s("help_call")} · {PHONE_DISPLAY}
                  </span>
                </motion.a>
              </li>
              <li>
                <motion.a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                  className="btt-focus flex items-center gap-3 rounded-2xl border border-emerald-500/35 bg-emerald-900/20 px-3.5 py-2.5 text-sm font-semibold text-emerald-100 transition hover:border-emerald-400/60 hover:bg-emerald-900/30"
                >
                  <MessageCircle className="h-4 w-4 shrink-0" aria-hidden />
                  {s("help_whatsapp")}
                </motion.a>
              </li>
              {telegram ? (
                <li>
                  <motion.a
                    href={telegram}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileTap={reduceMotion ? undefined : { scale: 0.98 }}
                    className="btt-focus flex items-center gap-3 rounded-2xl border border-sky-500/35 bg-sky-900/20 px-3.5 py-2.5 text-sm font-semibold text-sky-100 transition hover:border-sky-400/60 hover:bg-sky-900/30"
                  >
                    <Send className="h-4 w-4 shrink-0" aria-hidden />
                    {s("help_telegram")}
                  </motion.a>
                </li>
              ) : null}
            </ul>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <motion.button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-label={s("help_title")}
        initial={reduceMotion ? false : { opacity: 0, y: 12, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={
          reduceMotion
            ? { duration: 0 }
            : { duration: 0.4, ease: [...BTT_EASE], delay: 0.35 }
        }
        whileHover={reduceMotion ? undefined : { scale: 1.04 }}
        whileTap={reduceMotion ? undefined : { scale: 0.94 }}
        className={cn(
          "btt-focus pointer-events-auto relative flex h-14 w-14 items-center justify-center rounded-full shadow-[0_18px_40px_-10px_rgba(245,158,11,0.5),0_8px_20px_rgba(0,0,0,0.4)] ring-1 ring-white/20 transition-[background] duration-200",
          open
            ? "bg-stone-900/95 ring-white/25"
            : "bg-gradient-to-br from-amber-500 to-orange-600 hover:brightness-110",
        )}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={reduceMotion ? false : { opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, rotate: 45 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="text-stone-100"
            >
              <X className="h-6 w-6" aria-hidden />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={reduceMotion ? false : { opacity: 0, rotate: -45 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, rotate: 45 }}
              transition={{ duration: reduceMotion ? 0 : 0.18 }}
              className="text-white"
            >
              <HeartHandshake className="h-6 w-6" aria-hidden />
            </motion.span>
          )}
        </AnimatePresence>
        {/* Мягкий пульсирующий halo для attention (отключается при reduce-motion) */}
        {!open ? (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-full bg-amber-500/40 opacity-70 blur-md animate-ping motion-reduce:animate-none"
            style={{ animationDuration: "2.6s" }}
          />
        ) : null}
      </motion.button>
    </div>
  );
}
