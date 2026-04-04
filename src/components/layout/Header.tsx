"use client";

import { SterlingGateKineticNavigation } from "@/components/ui/sterling-gate-kinetic-navigation";
import { Link } from "@/i18n/navigation";
import { useCart } from "@/contexts/CartContext";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const { lines } = useCart();
  const count = lines.length;

  const links = useMemo(
    () => [
      { href: "/catalog", label: t("catalog") },
      { href: "/wholesale", label: t("wholesale") },
      { href: "/export", label: t("export") },
      { href: "/about", label: t("about") },
      { href: "/contacts", label: t("contacts") },
      { href: "/faq", label: t("faq") },
    ],
    [t]
  );

  return (
    <SterlingGateKineticNavigation
      menuLabel={t("kinetic_menu")}
      closeLabel={t("kinetic_close")}
      links={links}
      brand={
        <Link
          href="/"
          className="group inline-flex max-w-full items-center gap-3 font-semibold tracking-tight text-stone-100"
        >
          <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-600 to-orange-700 text-sm font-bold text-white shadow-lg shadow-orange-900/30 ring-1 ring-amber-400/30 transition group-hover:shadow-amber-500/20">
            BT
          </span>
          <span className="truncate text-lg">Bententrade</span>
        </Link>
      }
      trailing={
        <>
          <LanguageSwitcher />
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
        </>
      }
    />
  );
}
