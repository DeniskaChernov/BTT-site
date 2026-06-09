import { getPublishedArticles } from "@/data/articles";
import { products } from "@/data/products";
import type { Locale } from "@/types/product";

export type CommandItemKind = "product" | "article" | "page";

export type CommandItem = {
  id: string;
  kind: CommandItemKind;
  title: string;
  subtitle?: string;
  href: string;
  keywords: string;
};

const PAGE_ROUTES: { href: string; titleKey: string }[] = [
  { href: "/", titleKey: "home" },
  { href: "/catalog", titleKey: "catalog" },
  { href: "/catalog?tab=material&kind=semi", titleKey: "semi" },
  { href: "/catalog?tab=material&kind=twisted", titleKey: "twisted" },
  { href: "/catalog?tab=planter", titleKey: "planter" },
  { href: "/catalog/brochure", titleKey: "brochure" },
  { href: "/wholesale", titleKey: "wholesale" },
  { href: "/export", titleKey: "export" },
  { href: "/about", titleKey: "about" },
  { href: "/articles", titleKey: "articles" },
  { href: "/contacts", titleKey: "contacts" },
  { href: "/faq", titleKey: "faq" },
  { href: "/cart", titleKey: "cart" },
  { href: "/compare", titleKey: "compare" },
];

export function buildCommandIndex(
  locale: Locale,
  pageLabels: Record<string, string>,
  articleLabels: Record<string, string>,
): CommandItem[] {
  const items: CommandItem[] = [];

  for (const p of products) {
    const name = p.names[locale];
    items.push({
      id: `product:${p.sku}`,
      kind: "product",
      title: name,
      subtitle: p.sku,
      href: `/product/${p.slug}`,
      keywords: [p.sku, p.slug, name, p.short[locale]].join(" ").toLowerCase(),
    });
  }

  for (const a of getPublishedArticles()) {
    const title = articleLabels[a.slug] ?? a.slug;
    items.push({
      id: `article:${a.slug}`,
      kind: "article",
      title,
      href: `/articles/${a.slug}`,
      keywords: [a.slug, title].join(" ").toLowerCase(),
    });
  }

  for (const route of PAGE_ROUTES) {
    const title = pageLabels[route.titleKey] ?? route.href;
    items.push({
      id: `page:${route.href}`,
      kind: "page",
      title,
      href: route.href,
      keywords: [title, route.href].join(" ").toLowerCase(),
    });
  }

  return items;
}

function scoreMatch(q: string, item: CommandItem): number {
  if (!q) return 0;
  const title = item.title.toLowerCase();
  const kw = item.keywords;
  if (item.subtitle?.toLowerCase() === q) return 120;
  if (title.startsWith(q)) return 100;
  if (kw.includes(q)) return 60;
  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.every((t) => kw.includes(t))) return 40;
  return 0;
}

export function searchCommandItems(items: CommandItem[], query: string, limit = 12): CommandItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return items.filter((i) => i.kind === "page").slice(0, 8);
  return items
    .map((item) => ({ item, score: scoreMatch(q, item) }))
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.item);
}
