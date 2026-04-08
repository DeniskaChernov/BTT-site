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
    <header className="sticky top-0 z-50 bg-transparent">
      <div className="btt-container flex justify-center py-3.5">
        <div
          className="w-full max-w-full overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          role="navigation"
          aria-label={t("kinetic_menu")}
        >
          <div className="flex min-w-min justify-center px-1">
            <SlideTabs items={items} activeId={activeId} />
          </div>
        </div>
      </div>
    </header>
  );
}
