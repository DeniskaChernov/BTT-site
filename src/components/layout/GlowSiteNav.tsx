"use client";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MiniCartDrawer } from "@/components/cart/MiniCartDrawer";
import { NavAccountLink } from "@/components/layout/NavAccountLink";
import { SlideTabs, type SlideTabItem } from "@/components/ui/slide-tabs";
import { useCart } from "@/contexts/CartContext";
import { usePathname } from "@/i18n/navigation";
import { BTT_Z } from "@/lib/layering";
import { cn } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { useEffect, useMemo, useState } from "react";

function resolveActiveNavId(pathname: string): string | undefined {
  const normalized = (pathname.replace(/\/$/, "") || "/") as string;
  if (normalized === "/") return "home";
  if (normalized.startsWith("/catalog") || normalized.startsWith("/product")) return "catalog";
  if (normalized.startsWith("/about")) return "about";
  if (normalized.startsWith("/articles") || normalized.startsWith("/blog")) return "articles";
  if (normalized.startsWith("/wholesale") || normalized.startsWith("/export")) return "catalog";
  if (normalized.startsWith("/faq")) return "contacts";
  if (normalized.startsWith("/contacts")) return "contacts";
  if (normalized.startsWith("/checkout") || normalized.startsWith("/cart")) return "cart";
  return undefined;
}

export function GlowSiteNav() {
  const t = useTranslations("nav");
  const pathname = usePathname();
  const { lines } = useCart();
  const cartCount = lines.length;
  const [scrolled, setScrolled] = useState(false);
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 14);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const items: SlideTabItem[] = useMemo(
    () => [
      { id: "home", label: t("home"), href: "/" },
      {
        id: "catalog",
        label: t("catalog"),
        href: "/catalog",
        dropdown: [
          { href: "/catalog?tab=material&kind=twisted", label: t("catalog_section_twisted") },
          { href: "/catalog?tab=material&kind=semi", label: t("catalog_section_semi") },
          { href: "/catalog?tab=material&kind=regular", label: t("catalog_section_rattan") },
          { href: "/catalog?tab=planter", label: t("catalog_section_planter") },
          { href: "/catalog/furniture", label: t("catalog_section_furniture") },
          { href: "/wholesale", label: t("wholesale") },
          { href: "/export", label: t("export") },
        ],
      },
      { id: "about", label: t("about"), href: "/about" },
      { id: "articles", label: t("articles"), href: "/articles" },
      { id: "contacts", label: t("contacts"), href: "/contacts" },
      {
        id: "cart",
        label: t("cart"),
        href: "/cart",
        badge: cartCount > 0 ? cartCount : undefined,
        linkAriaLabel: cartCount > 0 ? t("cart_sr", { count: cartCount }) : undefined,
        onClick:
          cartCount > 0
            ? (e) => {
                e.preventDefault();
                setMiniCartOpen(true);
              }
            : undefined,
      },
    ],
    [t, cartCount],
  );

  return (
    <>
      <header
        className="relative sticky top-0 pt-[env(safe-area-inset-top,0px)]"
        style={{ zIndex: BTT_Z.nav }}
        data-scrolled={scrolled ? "true" : "false"}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute inset-0 border-b transition duration-300",
            scrolled
              ? "border-white/[0.08] bg-[#070605]/72 backdrop-blur-xl backdrop-saturate-150"
              : "border-transparent bg-transparent",
          )}
        />
        <div className="btt-container relative py-3.5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-4">
            <div className="flex items-center justify-between gap-3 md:justify-start">
              <LanguageSwitcher />
              <NavAccountLink className="md:hidden" />
            </div>
            <div className="min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" role="navigation" aria-label={t("kinetic_menu")}>
              <div className="flex min-w-min justify-center">
                <SlideTabs items={items} activeId={resolveActiveNavId(pathname)} />
              </div>
            </div>
            <div className="hidden justify-end md:flex">
              <NavAccountLink />
            </div>
          </div>
        </div>
      </header>
      <MiniCartDrawer open={miniCartOpen} onOpenChange={setMiniCartOpen} />
    </>
  );
}
