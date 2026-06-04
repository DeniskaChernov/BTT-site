"use client";

import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MiniCartDrawer } from "@/components/cart/MiniCartDrawer";
import { NavAccountLink } from "@/components/layout/NavAccountLink";
import { SlideTabs, type SlideTabItem } from "@/components/ui/slide-tabs";
import { useCart } from "@/contexts/CartContext";
import { useIntent } from "@/contexts/IntentContext";
import { getProductBySku } from "@/data/products";
import { getCartBulkInsight } from "@/lib/cart/cart-bulk-insight";
import { usePathname } from "@/i18n/navigation";
import { BTT_Z } from "@/lib/layering";
import { useLocale, useTranslations } from "next-intl";
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
  const locale = useLocale() as "ru" | "en" | "uz";
  const pathname = usePathname();
  const { lines } = useCart();
  const { profile, ready } = useIntent();
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

  const recentCatalogLinks = useMemo(() => {
    if (!ready || profile.viewedSkus.length === 0) return [];
    return profile.viewedSkus
      .slice(0, 4)
      .map((v) => getProductBySku(v.sku))
      .filter((p): p is NonNullable<typeof p> => p != null)
      .map((p) => ({
        href: `/product/${p.slug}`,
        label: p.names[locale],
      }));
  }, [profile.viewedSkus, ready, locale]);

  const items: SlideTabItem[] = useMemo(
    () => [
      { id: "home", label: t("home"), href: "/" },
      {
        id: "catalog",
        label: t("catalog"),
        href: "/catalog",
        megaMenu: {
          columns: [
            {
              title: t("catalog_section_twisted"),
              links: [
                { href: "/catalog?tab=material&kind=twisted", label: t("catalog_section_twisted") },
              ],
            },
            {
              title: t("catalog_section_semi"),
              links: [
                { href: "/catalog?tab=material&kind=semi", label: t("catalog_section_semi") },
              ],
            },
            {
              title: t("catalog_section_rattan"),
              links: [
                { href: "/catalog?tab=material&kind=regular", label: t("catalog_section_rattan") },
              ],
            },
            {
              title: t("catalog_section_planter"),
              links: [
                { href: "/catalog?tab=planter", label: t("catalog_section_planter") },
                { href: "/catalog/furniture", label: t("catalog_section_furniture") },
              ],
            },
          ],
          presetsTitle: t("mega_presets"),
          recentTitle: t("mega_recent"),
          recent: recentCatalogLinks,
          presets: [
            { href: "/catalog?tab=material&shape=half_round", label: tc("preset_furniture") },
            { href: "/catalog?tab=planter", label: tc("preset_planter") },
            { href: "/catalog?tab=material&kind=semi", label: tc("preset_semi") },
            { href: "/catalog?tab=material&stock=in_stock", label: tc("preset_stock") },
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
    [t, tc, cartCount, cartBulkHint, recentCatalogLinks, megaFooter],
  );

  return (
    <>
      <header
        className="relative sticky top-0 pt-[env(safe-area-inset-top,0px)]"
        style={{ zIndex: BTT_Z.nav }}
      >
        <div className="btt-container relative py-3.5">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-[auto_minmax(0,1fr)_auto] md:items-center md:gap-4">
            <div className="flex flex-wrap items-center justify-between gap-2 md:justify-start md:gap-3">
              <LanguageSwitcher />
              <NavAccountLink className="md:hidden" />
            </div>
            <div
              className="min-w-0 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              role="navigation"
              aria-label={t("kinetic_menu")}
            >
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
