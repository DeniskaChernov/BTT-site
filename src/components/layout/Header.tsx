"use client";

import {
  GlowNavBrand,
  GlowNavDivider,
  GlowNavItem,
  GlowNavPill,
} from "@/components/ui/glow-menu";
import { MenuBar, type MenuBarItem } from "@/components/ui/menu-bar";
import { useCart } from "@/contexts/CartContext";
import { Home, Layers, Newspaper, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const { lines } = useCart();
  const count = lines.length;

  const menuItems: MenuBarItem[] = useMemo(
    () => [
      {
        href: "/",
        label: t("home"),
        icon: Home,
        iconColor: "text-amber-400",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.5) 0%, rgba(234,88,12,0.16) 54%, transparent 72%)",
      },
      {
        href: "/catalog",
        label: t("shop"),
        icon: ShoppingBag,
        iconColor: "text-orange-400",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(251,146,60,0.45) 0%, rgba(194,65,12,0.14) 54%, transparent 72%)",
      },
      {
        href: "/#hits",
        label: t("collections"),
        icon: Layers,
        iconColor: "text-amber-300",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(252,211,77,0.4) 0%, rgba(120,53,15,0.12) 55%, transparent 72%)",
      },
      {
        href: "/blog",
        label: t("blog"),
        icon: Newspaper,
        iconColor: "text-amber-500",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.42) 0%, rgba(67,20,7,0.12) 54%, transparent 72%)",
      },
    ],
    [t]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#070605]/85 py-3 backdrop-blur-xl md:py-4">
      <div className="btt-container flex justify-center">
        <GlowNavPill className="min-h-[3.25rem] sm:min-h-[3.5rem]">
          <GlowNavBrand />
          <GlowNavDivider />
          <MenuBar items={menuItems} embedded />
          <GlowNavDivider />
          <LanguageSwitcher variant="navbar" />
          <GlowNavItem
            href="/account"
            icon={User}
            label={t("account")}
          />
          <GlowNavItem
            href="/cart"
            icon={ShoppingCart}
            label={t("cart")}
            badge={count}
          />
        </GlowNavPill>
      </div>
    </header>
  );
}
