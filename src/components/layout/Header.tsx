"use client";

import {
  GlowNavBrand,
  GlowNavDivider,
  GlowNavItem,
  GlowNavPill,
} from "@/components/ui/glow-nav-shell";
import { SpoonyGlowMenu } from "@/components/ui/glow-menu";
import {
  menuBarGradientPresets,
  type MenuBarItem,
} from "@/components/ui/menu-bar";
import { useCart } from "@/contexts/CartContext";
import { resolveActiveNavLabel } from "@/lib/nav-active";
import { Home, Layers, Newspaper, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { usePathname } from "@/i18n/navigation";
import { useSyncedHash } from "@/hooks/use-synced-hash";
import { LanguageSwitcher } from "./LanguageSwitcher";

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const hash = useSyncedHash();
  const { lines } = useCart();
  const count = lines.length;

  const menuItems: MenuBarItem[] = useMemo(
    () => [
      {
        href: "/",
        label: t("home"),
        icon: Home,
        gradient: menuBarGradientPresets.home,
        iconColor: "text-sky-400",
      },
      {
        href: "/catalog",
        label: t("shop"),
        icon: ShoppingBag,
        gradient: menuBarGradientPresets.shop,
        iconColor: "text-violet-400",
      },
      {
        href: "/#hits",
        label: t("collections"),
        icon: Layers,
        gradient: menuBarGradientPresets.collections,
        iconColor: "text-orange-400",
      },
      {
        href: "/blog",
        label: t("blog"),
        icon: Newspaper,
        gradient: menuBarGradientPresets.blog,
        iconColor: "text-cyan-400",
      },
    ],
    [t]
  );

  const activeItem =
    resolveActiveNavLabel(menuItems, pathname, hash) ?? t("home");

  return (
    <header className="relative sticky top-0 z-50 border-b border-white/[0.06] bg-[#070605]/92 py-3 backdrop-blur-xl md:py-4">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-[0.35] [mask-image:linear-gradient(to_bottom,black,transparent)]"
        aria-hidden
      >
        <div className="btt-grid-bg h-full w-full" />
      </div>
      <div className="btt-container flex justify-center">
        <GlowNavPill className="min-h-[3.25rem] sm:min-h-[3.5rem]">
          <GlowNavBrand />
          <GlowNavDivider />
          <SpoonyGlowMenu
            items={menuItems}
            activeItem={activeItem}
            embedded
          />
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
            iconTone="cart"
          />
        </GlowNavPill>
      </div>
    </header>
  );
}
