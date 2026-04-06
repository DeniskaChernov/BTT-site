"use client";

import {
  GlowNavBrand,
  GlowNavDivider,
  GlowNavItem,
  GlowNavPill,
} from "@/components/ui/glow-menu";
import {
  kineticNavGlowPresets,
  MenuBarKinetic,
  type MenuBarKineticItem,
} from "@/components/ui/menu-bar-kinetic";
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

  const menuItems: MenuBarKineticItem[] = useMemo(
    () => [
      {
        href: "/",
        label: t("home"),
        icon: Home,
        surface: "from-sky-400 to-blue-600",
        glow: kineticNavGlowPresets.skyBlue,
        iconColor: "text-sky-400",
      },
      {
        href: "/catalog",
        label: t("shop"),
        icon: ShoppingBag,
        surface: "from-violet-400 to-purple-600",
        glow: kineticNavGlowPresets.violet,
        iconColor: "text-violet-400",
      },
      {
        href: "/#hits",
        label: t("collections"),
        icon: Layers,
        surface: "from-orange-400 to-rose-600",
        glow: kineticNavGlowPresets.orange,
        iconColor: "text-orange-400",
      },
      {
        href: "/blog",
        label: t("blog"),
        icon: Newspaper,
        surface: "from-cyan-400 to-teal-600",
        glow: kineticNavGlowPresets.cyan,
        iconColor: "text-cyan-400",
      },
    ],
    [t]
  );

  const activeItem =
    resolveActiveNavLabel(menuItems, pathname, hash) ?? t("home");

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.05] bg-[#070605]/85 py-3 backdrop-blur-xl md:py-4">
      <div className="btt-container flex justify-center">
        <GlowNavPill className="min-h-[3.25rem] sm:min-h-[3.5rem]">
          <GlowNavBrand />
          <GlowNavDivider />
          <MenuBarKinetic
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
          />
        </GlowNavPill>
      </div>
    </header>
  );
}
