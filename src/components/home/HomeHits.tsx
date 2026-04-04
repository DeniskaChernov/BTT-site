import { products } from "@/data/products";
import { getTranslations } from "next-intl/server";
import { ProductCard } from "@/components/catalog/ProductCard";

export async function HomeHits() {
  const t = await getTranslations("home");
  const hits = products.filter((p) => p.category === "material" || p.category === "planter").slice(0, 6);

  return (
    <section className="border-y border-btt-border bg-btt-surface py-16 md:py-20">
      <div className="btt-container">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">
          {t("hits")}
        </h2>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {hits.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
