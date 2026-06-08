import { HomeProductSection } from "@/components/home/HomeProductSection";
import { products } from "@/data/products";
import { getTranslations } from "next-intl/server";

export async function HomeMerchandising() {
  const t = await getTranslations("home");

  const popular = products
    .filter((p) => p.category === "material" || p.category === "planter")
    .slice(0, 12);

  const discounts = products.filter((p) => p.collective != null).slice(0, 6);

  const onOrder = products
    .filter((p) => p.stock === "on_order" && p.category === "material")
    .slice(0, 6);

  const inStock = products
    .filter(
      (p) =>
        p.stock === "in_stock" &&
        (p.category === "material" || p.category === "planter"),
    )
    .slice(0, 6);

  return (
    <>
      <HomeProductSection
        id="popular"
        kicker={t("popular_kicker")}
        title={t("popular_title")}
        lead={t("popular_lead")}
        cta={t("hits_cta")}
        fallback={popular}
      />
      <HomeProductSection
        id="discounts"
        kicker={t("discounts_kicker")}
        title={t("discounts_title")}
        lead={t("discounts_lead")}
        cta={t("discounts_cta")}
        ctaHref="/catalog"
        fallback={discounts}
      />
      <HomeProductSection
        id="on-order"
        kicker={t("on_order_kicker")}
        title={t("on_order_title")}
        lead={t("on_order_lead")}
        cta={t("on_order_cta")}
        ctaHref="/catalog?stock=on_order"
        fallback={onOrder}
      />
      <HomeProductSection
        id="in-stock"
        kicker={t("in_stock_kicker")}
        title={t("in_stock_title")}
        lead={t("in_stock_lead")}
        cta={t("in_stock_cta")}
        ctaHref="/catalog?stock=in_stock"
        fallback={inStock}
      />
    </>
  );
}
