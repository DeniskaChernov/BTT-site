"use client";

import { MenuBar } from "@/components/ui/glow-menu";
import { usePathname } from "@/i18n/navigation";
import {
  Home,
  LayoutGrid,
  Info,
  Phone,
  ShoppingCart,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

function resolveActiveNavId(pathname: string): string | undefined {
  const normalized = (pathname.replace(/\/$/, "") || "/") as string;
  if (normalized === "/") return "home";
  if (normalized.startsWith("/catalog")) return "catalog";
  if (normalized.startsWith("/about")) return "about";
  if (normalized.startsWith("/contacts")) return "contacts";
  if (normalized.startsWith("/cart")) return "cart";
  return undefined;
}

export function GlowSiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const activeItem = useMemo(
    () => resolveActiveNavId(pathname),
    [pathname],
  );

  const items = useMemo(
    () => [
      {
        id: "home",
        icon: Home,
        label: t("home"),
        href: "/",
        gradient: "linear-gradient(135deg, rgba(59,130,246,0.45) 0%, rgba(147,51,234,0.35) 100%)",
        iconColor: "text-sky-400",
      },
      {
        id: "catalog",
        icon: LayoutGrid,
        label: t("catalog"),
        href: "/catalog",
        gradient: "linear-gradient(135deg, rgba(234,179,8,0.4) 0%, rgba(249,115,22,0.35) 100%)",
        iconColor: "text-amber-400",
      },
      {
        id: "about",
        icon: Info,
        label: t("about"),
        href: "/about",
        gradient: "linear-gradient(135deg, rgba(34,197,94,0.4) 0%, rgba(16,185,129,0.35) 100%)",
        iconColor: "text-emerald-400",
      },
      {
        id: "contacts",
        icon: Phone,
        label: t("contacts"),
        href: "/contacts",
        gradient: "linear-gradient(135deg, rgba(168,85,247,0.4) 0%, rgba(236,72,153,0.35) 100%)",
        iconColor: "text-fuchsia-400",
      },
      {
        id: "cart",
        icon: ShoppingCart,
        label: t("cart"),
        href: "/cart",
        gradient: "linear-gradient(135deg, rgba(248,113,113,0.45) 0%, rgba(251,146,60,0.35) 100%)",
        iconColor: "text-orange-400",
      },
    ],
    [t],
  );

  return (
    <div className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-md">
      <div className="btt-container flex justify-center py-3">
        <MenuBar
          className="max-w-full overflow-x-auto"
          items={items}
          activeItem={activeItem}
        />
      </div>
    </div>
  );
}
