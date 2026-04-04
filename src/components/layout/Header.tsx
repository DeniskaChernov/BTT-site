"use client";

import {
  GlowNavBrand,
  GlowNavDivider,
  GlowNavItem,
  GlowNavPill,
} from "@/components/ui/glow-menu";
import { MenuBar, type MenuBarItem } from "@/components/ui/menu-bar";
import { useCart } from "@/contexts/CartContext";
import {
  Building2,
  Globe2,
  HelpCircle,
  LayoutGrid,
  Mail,
  Plane,
  ShoppingCart,
  User,
} from "lucide-react";
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
        href: "/catalog",
        label: t("catalog"),
        icon: LayoutGrid,
        iconColor: "text-amber-400",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(251,191,36,0.55) 0%, rgba(234,88,12,0.22) 50%, rgba(67,20,7,0.08) 68%, transparent 76%)",
      },
      {
        href: "/wholesale",
        label: t("wholesale"),
        icon: Building2,
        iconColor: "text-orange-400",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(251,146,60,0.5) 0%, rgba(194,65,12,0.2) 50%, transparent 74%)",
      },
      {
        href: "/export",
        label: t("export"),
        icon: Plane,
        iconColor: "text-amber-300",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(252,211,77,0.48) 0%, rgba(120,53,15,0.18) 55%, transparent 76%)",
      },
      {
        href: "/about",
        label: t("about"),
        icon: Globe2,
        iconColor: "text-amber-500",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(245,158,11,0.45) 0%, rgba(67,20,7,0.2) 52%, transparent 75%)",
      },
      {
        href: "/contacts",
        label: t("contacts"),
        icon: Mail,
        iconColor: "text-rose-400",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(251,113,133,0.42) 0%, rgba(234,88,12,0.15) 55%, transparent 76%)",
      },
      {
        href: "/faq",
        label: t("faq"),
        icon: HelpCircle,
        iconColor: "text-violet-400",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.45) 0%, rgba(251,191,36,0.12) 58%, transparent 78%)",
      },
    ],
    [t]
  );

  return (
    <header className="sticky top-0 z-50 bg-transparent py-3 md:py-4">
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
