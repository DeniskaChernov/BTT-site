"use client";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { NavAccountLink } from "@/components/layout/NavAccountLink";
import { SlideTabs, type SlideTabItem } from "@/components/ui/slide-tabs";
import { useCart } from "@/contexts/CartContext";
import { usePathname } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo } from "react";

function resolveActiveNavId(pathname: string): string | undefined {
  const normalized = (pathname.replace(/\/$/, "") || "/") as string;
  if (normalized === "/") return "home";
  if (normalized.startsWith("/catalog") || normalized.startsWith("/product"))
    return "catalog";
  if (normalized.startsWith("/about")) return "about";
  if (normalized.startsWith("/articles") || normalized.startsWith("/blog"))
    return "articles";
  if (normalized.startsWith("/wholesale") || normalized.startsWith("/export"))
    return "catalog";
  if (normalized.startsWith("/faq")) return "contacts";
  if (normalized.startsWith("/contacts")) return "contacts";
  if (normalized.startsWith("/checkout") || normalized.startsWith("/cart"))
    return "cart";
  return undefined;
}

export function GlowSiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { lines } = useCart();
  const cartCount = lines.length;

  const activeId = useMemo(
    () => resolveActiveNavId(pathname),
    [pathname],
  );

  const items: SlideTabItem[] = useMemo(
    () => [
      { id: "home", label: t("home"), href: "/" },
      { id: "catalog", label: t("catalog"), href: "/catalog" },
      { id: "about", label: t("about"), href: "/about" },
      { id: "articles", label: t("articles"), href: "/articles" },
      { id: "contacts", label: t("contacts"), href: "/contacts" },
      {
        id: "cart",
        label: t("cart"),
        href: "/cart",
        badge: cartCount > 0 ? cartCount : undefined,
        linkAriaLabel:
          cartCount > 0 ? t("cart_sr", { count: cartCount }) : undefined,
      },
    ],
    [t, cartCount],
  );

  return (
    <header className="relative sticky top-0 z-50 border-b border-white/[0.06] bg-stone-950/40 backdrop-blur-md supports-[backdrop-filter]:bg-stone-950/25">
      <div className="btt-container py-3.5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-4">
          <div className="flex items-center justify-between gap-3 md:justify-start">
            <LanguageSwitcher />
            <NavAccountLink className="md:hidden" />
          </div>

          <div
            className="min-w-0 overflow-x-auto overflow-y-hidden [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="navigation"
            aria-label={t("kinetic_menu")}
          >
            <div className="flex min-w-min justify-center px-0 sm:px-1">
              <SlideTabs items={items} activeId={activeId} />
            </div>
          </div>

          <div className="hidden justify-end md:flex">
            <NavAccountLink />
          </div>
        </div>
      </div>
    </header>
  );
}
