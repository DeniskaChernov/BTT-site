"use client";

import {
  GlowMenuLink,
  GlowNavBrand,
  GlowNavDivider,
  GlowNavItem,
  GlowNavPill,
  type GlowMenuItem,
} from "@/components/ui/glow-menu";
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

  const glowItems: GlowMenuItem[] = useMemo(
    () => [
      {
        href: "/catalog",
        label: t("catalog"),
        icon: LayoutGrid,
        activeIconClass: "text-amber-400",
      },
      {
        href: "/wholesale",
        label: t("wholesale"),
        icon: Building2,
        activeIconClass: "text-orange-400",
      },
      {
        href: "/export",
        label: t("export"),
        icon: Plane,
        activeIconClass: "text-amber-300",
      },
      {
        href: "/about",
        label: t("about"),
        icon: Globe2,
        activeIconClass: "text-amber-500",
      },
      {
        href: "/contacts",
        label: t("contacts"),
        icon: Mail,
        activeIconClass: "text-rose-400",
      },
      {
        href: "/faq",
        label: t("faq"),
        icon: HelpCircle,
        activeIconClass: "text-violet-400",
      },
    ],
    [t]
  );

  return (
    <header className="sticky top-0 z-50 border-b border-transparent bg-gradient-to-b from-[#070605]/90 to-transparent py-3 backdrop-blur-[2px] md:py-4">
      <div className="btt-container flex justify-center">
        <GlowNavPill className="min-h-[3.25rem] sm:min-h-[3.5rem]">
          <GlowNavBrand />
          <GlowNavDivider />
          {glowItems.map((item) => (
            <GlowMenuLink key={item.href} item={item} />
          ))}
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
