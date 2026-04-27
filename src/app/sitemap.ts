import { getPublishedSlugs } from "@/data/articles";
import { products } from "@/data/products";
import type { MetadataRoute } from "next";

const base = "https://bententrade.uz";
const locales = ["ru", "uz", "en"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/catalog",
    "/catalog/brochure",
    "/wholesale",
    "/export",
    "/about",
    "/contacts",
    "/faq",
    "/articles",
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const p of staticPaths) {
      entries.push({
        url: `${base}/${locale}${p}`,
        lastModified: new Date(),
        changeFrequency: p === "" ? "weekly" : "monthly",
        priority: p === "" ? 1 : 0.7,
      });
    }
    for (const prod of products) {
      entries.push({
        url: `${base}/${locale}/product/${prod.slug}`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: 0.8,
      });
    }
    for (const slug of getPublishedSlugs()) {
      entries.push({
        url: `${base}/${locale}/articles/${slug}`,
        lastModified: new Date(),
        changeFrequency: "monthly",
        priority: 0.65,
      });
    }
  }

  return entries;
}
