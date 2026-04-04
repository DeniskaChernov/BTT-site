"use client";

import { GlowMenuBar, type GlowMenuItem } from "@/components/ui/glow-menu";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import {
  Building2,
  Globe2,
  HelpCircle,
  LayoutGrid,
  Mail,
  Plane,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const { lines } = useCart();
  const count = lines.length;

  const glowItems: GlowMenuItem[] = useMemo(
    () => [
      {
        href: "/catalog",
        label: t("catalog"),
        icon: LayoutGrid,
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.55), rgba(234,88,12,0.2) 45%, transparent 70%)",
        iconClassName: "text-amber-400 group-hover:text-amber-300",
      },
      {
        href: "/wholesale",
        label: t("wholesale"),
        icon: Building2,
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(251,146,60,0.5), rgba(194,65,12,0.22) 45%, transparent 70%)",
        iconClassName: "text-orange-400 group-hover:text-orange-300",
      },
      {
        href: "/export",
        label: t("export"),
        icon: Plane,
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(252,211,77,0.45), rgba(120,53,15,0.2) 50%, transparent 72%)",
        iconClassName: "text-amber-300 group-hover:text-amber-200",
      },
      {
        href: "/about",
        label: t("about"),
        icon: Globe2,
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.45), rgba(67,20,7,0.25) 48%, transparent 70%)",
        iconClassName: "text-amber-500 group-hover:text-amber-400",
      },
      {
        href: "/contacts",
        label: t("contacts"),
        icon: Mail,
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(251,113,133,0.35), rgba(234,88,12,0.18) 50%, transparent 72%)",
        iconClassName: "text-rose-400/90 group-hover:text-rose-300",
      },
      {
        href: "/faq",
        label: t("faq"),
        icon: HelpCircle,
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.4), rgba(251,191,36,0.15) 50%, transparent 72%)",
        iconClassName: "text-violet-400/90 group-hover:text-violet-300",
      },
    ],
    [t]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070605]/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#070605]/55">
      <div className="btt-container flex flex-col gap-3 py-3 md:flex-row md:items-center md:justify-between md:gap-4 md:py-3.5">
        <div className="flex min-w-0 items-center justify-between gap-3 md:justify-start">
          <Link
            href="/"
            className="group inline-flex min-w-0 max-w-[55%] items-center gap-2 font-semibold tracking-tight text-stone-100 sm:max-w-none sm:gap-3"
          >
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-xs font-bold text-white shadow-lg shadow-orange-900/30 ring-1 ring-amber-400/30 transition group-hover:shadow-amber-500/20 sm:h-10 sm:w-10 sm:text-sm">
              BT
            </span>
            <span className="truncate text-base sm:text-lg">Bententrade</span>
          </Link>
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 md:hidden">
            <LanguageSwitcher />
            <Link
              href="/account"
              className="rounded-full px-2 py-1.5 text-xs text-stone-400 transition hover:text-stone-100"
            >
              {t("account")}
            </Link>
            <Link href="/cart" className="relative inline-flex items-center">
              <motion.span
                className="rounded-full border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-medium text-stone-100 shadow-lg backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                {t("cart")}
                {count > 0 && (
                  <span className="ml-1.5 inline-flex min-w-[1.1rem] justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-1 text-[10px] text-white shadow-md sm:ml-2 sm:min-w-[1.25rem] sm:px-1.5 sm:text-xs">
                    {count}
                  </span>
                )}
              </motion.span>
            </Link>
          </div>
        </div>

        <div className="min-w-0 flex-1 md:mx-4 md:flex md:max-w-2xl md:justify-center lg:max-w-3xl xl:max-w-4xl">
          <GlowMenuBar items={glowItems} className="w-full" />
        </div>

        <div className="hidden items-center gap-2 md:flex md:gap-3">
          <LanguageSwitcher />
          <Link
            href="/account"
            className="rounded-full px-3 py-2 text-sm text-stone-400 transition hover:text-stone-100"
          >
            {t("account")}
          </Link>
          <Link href="/cart" className="relative inline-flex items-center">
            <motion.span
              className="rounded-full border border-white/15 bg-white/[0.06] px-4 py-2 text-sm font-medium text-stone-100 shadow-lg backdrop-blur-md"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {t("cart")}
              {count > 0 && (
                <span className="ml-2 inline-flex min-w-[1.25rem] justify-center rounded-full bg-gradient-to-r from-amber-500 to-orange-600 px-1.5 text-xs text-white shadow-md">
                  {count}
                </span>
              )}
            </motion.span>
          </Link>
        </div>
      </div>
    </header>
  );
}
