"use client";

import { Link } from "@/i18n/navigation";
import { useCart } from "@/contexts/CartContext";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const { lines } = useCart();
  const [open, setOpen] = useState(false);
  const count = lines.length;

  const links = [
    { href: "/catalog", label: t("catalog") },
    { href: "/wholesale", label: t("wholesale") },
    { href: "/export", label: t("export") },
    { href: "/about", label: t("about") },
    { href: "/contacts", label: t("contacts") },
    { href: "/faq", label: t("faq") },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#070605]/75 backdrop-blur-2xl supports-[backdrop-filter]:bg-[#070605]/55">
      <div className="btt-container flex h-[4.25rem] items-center justify-between gap-4">
        <Link
          href="/"
          className="group flex items-center gap-3 font-semibold tracking-tight text-stone-100"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-sm font-bold text-white shadow-lg shadow-orange-900/30 ring-1 ring-amber-400/30 transition group-hover:shadow-amber-500/20">
            BT
          </span>
          <span className="hidden text-lg sm:inline">Bententrade</span>
        </Link>

        <nav
          className="hidden items-center gap-0.5 rounded-full border border-white/[0.08] bg-white/[0.04] p-1 backdrop-blur-xl lg:flex"
          aria-label="Main"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-4 py-2 text-sm text-stone-400 transition hover:bg-white/[0.06] hover:text-stone-100"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <Link
            href="/account"
            className="hidden rounded-full px-3 py-2 text-sm text-stone-400 transition hover:text-stone-100 md:inline"
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
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-stone-200 lg:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1">
              <span
                className={clsx(
                  "h-0.5 w-5 bg-current transition",
                  open && "translate-y-1.5 rotate-45"
                )}
              />
              <span
                className={clsx(
                  "h-0.5 w-5 bg-current transition",
                  open && "opacity-0"
                )}
              />
              <span
                className={clsx(
                  "h-0.5 w-5 bg-current transition",
                  open && "-translate-y-1.5 -rotate-45"
                )}
              />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="border-t border-white/[0.06] bg-[#0c0a09]/95 backdrop-blur-xl lg:hidden"
        >
          <div className="btt-container flex flex-col gap-1 py-5">
            <div className="pb-3">
              <LanguageSwitcher />
            </div>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-2xl px-4 py-3 text-base font-medium text-stone-200 hover:bg-white/[0.05]"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="rounded-2xl px-4 py-3 text-base font-medium text-stone-200 hover:bg-white/[0.05]"
            >
              {t("account")}
            </Link>
          </div>
        </motion.div>
      )}
    </header>
  );
}
