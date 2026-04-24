"use client";

import { BTT_EVENTS, trackBttEvent } from "@/lib/analytics";
import { BTT_EASE } from "@/lib/motion";
import { cn } from "@/lib/utils";
import { motion, useReducedMotion } from "framer-motion";
import { HeartHandshake, MessageCircle, Phone, Send } from "lucide-react";
import { useTranslations } from "next-intl";

const PHONE_DISPLAY = "+998 77 104 44 22";
const PHONE_TEL = "+998771044422";
const WHATSAPP_URL = `https://wa.me/${PHONE_TEL.replace(/[^0-9]/g, "")}`;

type Props = {
  telegramUrl?: string | null;
  /** SKU текущего товара — уйдёт в аналитику `pdp_help_click`. */
  sku?: string;
  className?: string;
};

/**
 * Продающий блок помощи на странице товара: телефон + мессенджеры.
 * Ведёт на WhatsApp и (если задана) Telegram-воронку.
 */
export function ProductHelpPanel({ telegramUrl, sku, className }: Props) {
  const s = useTranslations("sales");
  const reduceMotion = useReducedMotion();

  return (
    <motion.aside
      initial={reduceMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-6%" }}
      transition={{ duration: reduceMotion ? 0 : 0.5, ease: [...BTT_EASE] }}
      className={cn(
        "mt-10 overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-br from-amber-950/40 via-stone-950/90 to-orange-950/25 p-6 shadow-[0_20px_60px_-24px_rgba(245,158,11,0.35)] md:p-7",
        className,
      )}
      aria-labelledby="product-help-title"
    >
      <div className="flex items-start gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-amber-500/35 bg-amber-500/10 text-amber-300 shadow-lg shadow-amber-900/20">
          <HeartHandshake className="h-5 w-5" aria-hidden />
        </span>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-amber-400/90">
            {s("help_kicker")}
          </p>
          <h2
            id="product-help-title"
            className="mt-1 text-xl font-bold tracking-tight text-stone-50 md:text-2xl"
          >
            {s("help_title")}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-300 md:text-base">
            {s("help_sub")}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <motion.a
          href={`tel:${PHONE_TEL}`}
          onClick={() =>
            trackBttEvent(BTT_EVENTS.PdpHelpClick, { channel: "phone", sku })
          }
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="btt-focus inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-amber-900/30 transition-[filter] duration-200 hover:brightness-110"
        >
          <Phone className="h-4 w-4" aria-hidden />
          {s("help_call")} {PHONE_DISPLAY}
        </motion.a>
        <motion.a
          href={WHATSAPP_URL}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() =>
            trackBttEvent(BTT_EVENTS.PdpHelpClick, {
              channel: "whatsapp",
              sku,
            })
          }
          whileHover={reduceMotion ? undefined : { scale: 1.02 }}
          whileTap={reduceMotion ? undefined : { scale: 0.98 }}
          className="btt-focus inline-flex items-center gap-2 rounded-full border border-emerald-500/40 bg-emerald-900/20 px-5 py-2.5 text-sm font-semibold text-emerald-100 transition-colors duration-200 hover:border-emerald-400/60 hover:bg-emerald-900/30"
        >
          <MessageCircle className="h-4 w-4" aria-hidden />
          {s("help_whatsapp")}
        </motion.a>
        {telegramUrl ? (
          <motion.a
            href={telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() =>
              trackBttEvent(BTT_EVENTS.PdpHelpClick, {
                channel: "telegram",
                sku,
              })
            }
            whileHover={reduceMotion ? undefined : { scale: 1.02 }}
            whileTap={reduceMotion ? undefined : { scale: 0.98 }}
            className={cn(
              "btt-focus inline-flex items-center gap-2 rounded-full border border-sky-500/40 bg-sky-900/20 px-5 py-2.5 text-sm font-semibold text-sky-100 transition-colors duration-200 hover:border-sky-400/60 hover:bg-sky-900/30",
            )}
          >
            <Send className="h-4 w-4" aria-hidden />
            {s("help_telegram")}
          </motion.a>
        ) : null}
      </div>
    </motion.aside>
  );
}
