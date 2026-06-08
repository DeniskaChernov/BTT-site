import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Armchair, Flower2, Layers } from "lucide-react";
import { getTranslations } from "next-intl/server";

export type CatalogDivision = "general" | "planter" | "furniture";

type Props = {
  active: CatalogDivision;
};

export async function CatalogDivisionsNav({ active }: Props) {
  const t = await getTranslations("catalog");

  const items: {
    id: CatalogDivision;
    href: string;
    title: string;
    desc: string;
    icon: typeof Layers;
  }[] = [
    {
      id: "general",
      href: "/catalog?tab=material",
      title: t("division_general"),
      desc: t("division_general_desc"),
      icon: Layers,
    },
    {
      id: "planter",
      href: "/catalog?tab=planter",
      title: t("division_planter"),
      desc: t("division_planter_desc"),
      icon: Flower2,
    },
    {
      id: "furniture",
      href: "/catalog/furniture",
      title: t("division_furniture"),
      desc: t("division_furniture_desc"),
      icon: Armchair,
    },
  ];

  return (
    <nav aria-label={t("divisions_title")} className="grid gap-3 sm:grid-cols-3">
      {items.map((item) => {
        const Icon = item.icon;
        const isActive = item.id === active;
        return (
          <Link
            key={item.id}
            href={item.href}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "btt-focus group flex min-h-[6.5rem] flex-col rounded-2xl border p-4 transition duration-300 ease-btt",
              isActive
                ? "border-amber-500/45 bg-amber-950/25 shadow-[inset_0_1px_0_0_rgba(251,191,36,0.12)]"
                : "border-white/[0.08] bg-white/[0.02] hover:border-amber-500/30 hover:bg-amber-950/15",
            )}
          >
            <span className="inline-flex items-center gap-2 text-sm font-semibold text-stone-100">
              <Icon
                className={cn(
                  "h-4 w-4 shrink-0",
                  isActive ? "text-amber-300" : "text-amber-400/90",
                )}
                aria-hidden
              />
              {item.title}
            </span>
            <span
              className={cn(
                "mt-2 line-clamp-2 text-xs leading-relaxed",
                isActive ? "text-stone-400" : "text-stone-500 group-hover:text-stone-400",
              )}
            >
              {item.desc}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
