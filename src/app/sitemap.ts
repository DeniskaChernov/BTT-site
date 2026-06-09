import { getPublishedSlugs } from "@/data/articles";
import { products } from "@/data/products";
import { SITE_ORIGIN } from "@/lib/seo";
import type { MetadataRoute } from "next";

const locales = ["ru", "uz", "en"] as const;

const staticPaths: { path: string; priority: number; changeFrequency: "weekly" | "monthly" }[] = [
  { path: "", priority: 1, changeFrequency: "weekly" },
  { path: "/catalog", priority: 0.7, changeFrequency: "monthly" },
  { path: "/compare", priority: 0.5, changeFrequency: "monthly" },
  { path: "/catalog/brochure", priority: 0.7, changeFrequency: "monthly" },
  { path: "/catalog/furniture", priority: 0.45, changeFrequency: "monthly" },
  { path: "/wholesale", priority: 0.7, changeFrequency: "monthly" },
  { path: "/export", priority: 0.7, changeFrequency: "monthly" },
  { path: "/about", priority: 0.7, changeFrequency: "monthly" },
  { path: "/contacts", priority: 0.7, changeFrequency: "monthly" },
  { path: "/faq", priority: 0.7, changeFrequency: "monthly" },
  { path: "/articles", priority: 0.7, changeFrequency: "monthly" },
  { path: "/company-details", priority: 0.45, changeFrequency: "monthly" },
  { path: "/terms", priority: 0.4, changeFrequency: "monthly" },
  { path: "/privacy", priority: 0.4, changeFrequency: "monthly" },
  { path: "/cookies", priority: 0.4, changeFrequency: "monthly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const row of staticPaths) {
      entries.push({
        url: `${SITE_ORIGIN}/${locale}${row.path === "" ? "" : row.path}`,
        lastModified: new Date(),
        changeFrequency: row.changeFrequency,
        priority: row.priority,
      });
    }
    for (const prod of products) {
      entries.push({
        url: `${SITE_ORIGIN}/${locale}/product/${prod.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const slug of getPublishedSlugs()) {
      entries.push({
        url: `${SITE_ORIGIN}/${locale}/articles/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.65,
      });
    }
  }

  return entries;
}
