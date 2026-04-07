"use client";

import { SlideTabs, type SlideTabItem } from "@/components/ui/slide-tabs";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

function resolveActiveNavId(pathname: string): string | undefined {
  const normalized = (pathname.replace(/\/$/, "") || "/") as string;
  if (normalized === "/") return "home";
  if (normalized.startsWith("/catalog") || normalized.startsWith("/product"))
    return "catalog";
  if (normalized.startsWith("/about")) return "about";
  if (normalized.startsWith("/contacts")) return "contacts";
  if (normalized.startsWith("/cart")) return "cart";
  return undefined;
}

export function GlowSiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const activeId = useMemo(
    () => resolveActiveNavId(pathname),
    [pathname],
  );

  const items: SlideTabItem[] = useMemo(
    () => [
      { id: "home", label: t("home"), href: "/" },
      { id: "catalog", label: t("catalog"), href: "/catalog" },
      { id: "about", label: t("about"), href: "/about" },
      { id: "contacts", label: t("contacts"), href: "/contacts" },
      { id: "cart", label: t("cart"), href: "/cart" },
    ],
    [t],
  );

  return (
    <div className="sticky top-0 z-50 border-b border-border/30 bg-background/60 backdrop-blur-md">
      <div className="btt-container flex justify-center py-3">
        <SlideTabs
          className="max-w-full overflow-x-auto"
          items={items}
          activeId={activeId}
        />
      </div>
    </div>
  );
}
