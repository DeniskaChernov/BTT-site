import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Layers, Sparkles, Wind } from "lucide-react";
import { getTranslations } from "next-intl/server";

const LINKS = [
  {
    href: "/catalog?tab=material&kind=regular",
    icon: Layers,
    labelKey: "guide_classic" as const,
    descKey: "guide_classic_desc" as const,
  },
  {
    href: "/catalog?tab=material&kind=semi",
    icon: Layers,
    labelKey: "guide_semi" as const,
    descKey: "guide_semi_desc" as const,
  },
  {
    href: "/catalog?tab=material&kind=twisted",
    icon: Wind,
    labelKey: "guide_twisted" as const,
    descKey: "guide_twisted_desc" as const,
  },
  {
    href: "/catalog?tab=planter",
    icon: Sparkles,
    labelKey: "guide_planter" as const,
    descKey: "guide_planter_desc" as const,
  },
];

export async function CatalogBuyerGuide() {
  const t = await getTranslations("catalog");

  return (
    <nav
      aria-label={t("guide_title")}
      className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"
    >
      {LINKS.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "btt-focus group flex min-h-[5.5rem] flex-col rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4 transition",
              "hover:border-white/20 hover:bg-white/[0.05]",
            )}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-stone-100">
              <Icon className="h-4 w-4 shrink-0 text-stone-200/90" aria-hidden />
              {t(item.labelKey)}
            </span>
            <span className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-stone-500 group-hover:text-stone-400">
              {t(item.descKey)}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
