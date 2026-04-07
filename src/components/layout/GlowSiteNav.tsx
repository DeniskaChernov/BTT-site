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

/** Тот же визуальный слой, что у CommerceHero: сетка + «меш» поверх фона страницы */
function NavHeroBackdrop() {
  return (
    <>
      <div
        className="btt-mesh btt-grid-bg pointer-events-none absolute inset-0 opacity-[0.85]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-32 top-0 h-48 w-48 rounded-full bg-amber-600/10 blur-[80px]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-0 h-40 w-40 rounded-full bg-orange-950/25 blur-[70px]"
        aria-hidden
      />
    </>
  );
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
    <header className="sticky top-0 z-50 border-b border-white/[0.08]">
      <div className="relative overflow-hidden">
        <NavHeroBackdrop />
        <div className="relative z-10">
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
        </div>
      </div>
    </header>
  );
}
