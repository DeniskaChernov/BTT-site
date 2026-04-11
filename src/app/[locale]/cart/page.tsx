import { CartView } from "@/components/cart/CartView";
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
  };
}

export default function CartPage() {
  return <CartView />;
}
