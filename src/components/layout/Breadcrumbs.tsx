import { Link } from "@/i18n/navigation";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = { label: string; href?: string };

export function Breadcrumbs({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
  if (items.length === 0) return null;
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-stone-500">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="inline-flex items-center gap-1.5">
              {i > 0 ? <ChevronRight className="h-3 w-3 text-stone-600" aria-hidden /> : null}
              {item.href && !isLast ? (
                <Link href={item.href} className="font-medium text-stone-400 hover:text-amber-200/90">
                  {item.label}
                </Link>
              ) : (
                <span className={isLast ? "font-medium text-stone-300" : ""} aria-current={isLast ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
