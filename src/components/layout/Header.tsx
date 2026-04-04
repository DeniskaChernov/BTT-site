"use client";

import {
  GlowNavBrand,
  GlowNavDivider,
  GlowNavItem,
  GlowNavPill,
} from "@/components/ui/glow-menu";
import {
  MenuBarKinetic,
  type MenuBarKineticItem,
} from "@/components/ui/menu-bar-kinetic";
import { useCart } from "@/contexts/CartContext";
import { resolveActiveNavLabel } from "@/lib/nav-active";
import { Home, Layers, Newspaper, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";
import { usePathname } from "@/i18n/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";

function useHash() {
  const [hash, setHash] = useState("");
  useEffect(() => {
    const sync = () =>
      setHash(typeof window !== "undefined" ? window.location.hash : "");
    sync();
    window.addEventListener("hashchange", sync);
    return () => window.removeEventListener("hashchange", sync);
  }, []);
  return hash;
}

export function Header() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const hash = useHash();
  const { lines } = useCart();
  const count = lines.length;

  const menuItems: MenuBarKineticItem[] = useMemo(
    () => [
      {
        href: "/",
        label: t("home"),
        icon: Home,
        gradient: "from-sky-400 to-blue-600",
        iconColor: "text-sky-400",
      },
      {
        href: "/catalog",
        label: t("shop"),
        icon: ShoppingBag,
        gradient: "from-violet-400 to-purple-600",
        iconColor: "text-violet-400",
      },
      {
        href: "/#hits",
        label: t("collections"),
        icon: Layers,
        gradient: "from-orange-400 to-rose-600",
        iconColor: "text-orange-400",
      },
      {
        href: "/blog",
        label: t("blog"),
        icon: Newspaper,
        gradient: "from-cyan-400 to-teal-600",
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
