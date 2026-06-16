"use client";

import { BrandLogo } from "@/components/layout/BrandLogo";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MiniCartDrawer } from "@/components/cart/MiniCartDrawer";
import { NavAccountLink } from "@/components/layout/NavAccountLink";
import { SlideTabs, type SlideTabItem } from "@/components/ui/slide-tabs";
import { useCart } from "@/contexts/CartContext";
import { getCartBulkInsight } from "@/lib/cart/cart-bulk-insight";
import { usePathname } from "@/i18n/navigation";
import { BTT_Z } from "@/lib/layering";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

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
  const tc = useTranslations("catalog");
  const tCommon = useTranslations("common");
  const pathname = usePathname();
  const { lines } = useCart();
  const cartCount = lines.length;
  const [miniCartOpen, setMiniCartOpen] = useState(false);

  const cartBulkHint = useMemo(() => {
    const insight = getCartBulkInsight(lines);
    return insight ? t("cart_bulk_hint", { kg: insight.kgToNext }) : undefined;
  }, [lines, t]);

  const megaFooter = useMemo(
    () => [
      { href: "/wholesale", label: t("wholesale") },
      { href: "/export", label: t("export") },
    ],
    [t],
  );

  const items: SlideTabItem[] = useMemo(
    () => [
      { id: "home", label: t("home"), href: "/" },
      {
        id: "catalog",
        label: t("catalog"),
        href: "/catalog",
        megaMenu: {
          catalogAll: { href: "/catalog", label: t("mega_all_catalog") },
          materialsTitle: t("mega_materials"),
          materials: [
            { href: "/catalog?tab=material&kind=twisted", label: t("catalog_section_twisted") },
            { href: "/catalog?tab=material&kind=semi", label: t("catalog_section_semi") },
            { href: "/catalog?tab=material&kind=regular", label: t("catalog_section_rattan") },
          ],
          sectionsTitle: t("mega_sections"),
          sections: [
            { href: "/catalog?tab=planter", label: t("catalog_section_planter") },
            { href: "/catalog/furniture", label: t("catalog_section_furniture") },
          ],
          stockTitle: t("mega_stock"),
          stock: [
            { href: "/catalog?stock=in_stock", label: tCommon("in_stock") },
            { href: "/catalog?stock=on_order", label: tCommon("on_order") },
          ],
          tasksTitle: t("mega_presets"),
          tasks: [
            { href: "/catalog?tab=material&shape=half_round", label: tc("preset_furniture") },
          ],
          footer: megaFooter,
        },
      },
      { id: "about", label: t("about"), href: "/about" },
      { id: "articles", label: t("articles"), href: "/articles" },
      { id: "contacts", label: t("contacts"), href: "/contacts" },
      {
        id: "cart",
        label: t("cart"),
        href: "/cart",
        badge: cartCount > 0 ? cartCount : undefined,
        badgeHint: cartBulkHint,
        linkAriaLabel:
          cartCount > 0
            ? cartBulkHint
              ? `${t("cart_sr", { count: cartCount })}. ${cartBulkHint}`
              : t("cart_sr", { count: cartCount })
            : undefined,
        onClick:
          cartCount > 0
            ? (e) => {
                e.preventDefault();
                setMiniCartOpen(true);
              }
            : undefined,
      },
    ],
    [t, tc, tCommon, cartCount, cartBulkHint, megaFooter],
  );

  const navMenu = (
    <div
      className="min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      role="navigation"
      aria-label={t("kinetic_menu")}
    >
      <div className="flex min-w-min justify-center">
        <SlideTabs items={items} activeId={resolveActiveNavId(pathname)} />
      </div>
    </div>
  );

  return (
    <>
      <header
        className="btt-glass-nav sticky top-0 pt-[env(safe-area-inset-top,0px)]"
        style={{ zIndex: BTT_Z.nav }}
      >
        <div className="btt-container">
          <div className="hidden h-16 items-center md:grid md:grid-cols-[auto_auto_minmax(0,1fr)_auto] md:gap-3 lg:gap-4">
            <div className="flex h-10 items-center justify-self-start">
              <BrandLogo />
            </div>
            <div className="flex h-10 items-center justify-self-start">
              <LanguageSwitcher />
            </div>
            <div className="flex h-10 min-w-0 items-center justify-center">
              {navMenu}
            </div>
            <div className="flex h-10 items-center justify-self-end">
              <NavAccountLink />
            </div>
          </div>

          <div className="flex flex-col gap-2.5 py-3 md:hidden">
            <div className="flex items-center justify-between gap-2">
              <BrandLogo />
              <div className="flex items-center gap-2">
                <LanguageSwitcher />
                <NavAccountLink />
              </div>
            </div>
            {navMenu}
          </div>
        </div>
      </header>
      <MiniCartDrawer open={miniCartOpen} onOpenChange={setMiniCartOpen} />
    </>
  );
}
