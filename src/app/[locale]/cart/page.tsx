import { CartView } from "@/components/cart/CartView";
import { buildAlternates } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "cart" });
  return {
    title: t("title"),
    description: t("empty_lead"),
    alternates: buildAlternates(locale, "/cart"),
    robots: { index: false, follow: false },
  };
}

export default function CartPage() {
  return <CartView />;
}
