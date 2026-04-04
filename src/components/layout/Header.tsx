"use client";

import { Link } from "@/i18n/navigation";
import { useCart } from "@/contexts/CartContext";
import clsx from "clsx";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { CurrencyToggle } from "./CurrencyToggle";
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
    <header className="sticky top-0 z-50 border-b border-btt-border bg-[color-mix(in_srgb,var(--btt-bg)_88%,transparent)] backdrop-blur-md">
      <div className="btt-container flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-btt bg-btt-primary text-sm text-white">
            BT
          </span>
          <span className="hidden sm:inline">Bententrade</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3 py-2 text-sm text-btt-muted transition hover:bg-black/5 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <LanguageSwitcher />
          </div>
          <CurrencyToggle />
          <Link
            href="/account"
            className="hidden rounded-full px-3 py-2 text-sm text-btt-muted transition hover:text-foreground md:inline"
          >
            {t("account")}
          </Link>
          <Link href="/cart" className="relative inline-flex items-center">
            <motion.span
              className="rounded-full border border-btt-border bg-btt-surface px-3 py-2 text-sm font-medium shadow-btt-sm"
              whileTap={{ scale: 0.97 }}
            >
              {t("cart")}
              {count > 0 && (
                <span className="ml-2 inline-flex min-w-[1.25rem] justify-center rounded-full bg-btt-accent px-1.5 text-xs text-white">
                  {count}
                </span>
              )}
            </motion.span>
          </Link>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-btt-border lg:hidden"
            aria-expanded={open}
            aria-label="Menu"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1">
              <span className={clsx("h-0.5 w-5 bg-foreground transition", open && "translate-y-1.5 rotate-45")} />
              <span className={clsx("h-0.5 w-5 bg-foreground transition", open && "opacity-0")} />
              <span className={clsx("h-0.5 w-5 bg-foreground transition", open && "-translate-y-1.5 -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-btt-border bg-btt-bg lg:hidden">
          <div className="btt-container flex flex-col gap-1 py-4">
            <div className="pb-2">
              <LanguageSwitcher />
            </div>
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-btt px-3 py-3 text-base font-medium hover:bg-black/5"
              >
                {l.label}
              </Link>
            ))}
            <Link
              href="/account"
              onClick={() => setOpen(false)}
              className="rounded-btt px-3 py-3 text-base font-medium hover:bg-black/5"
            >
              {t("account")}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
