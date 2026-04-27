import { AccountForm } from "@/components/account/AccountForm";
import { buildAlternates } from "@/lib/seo";
import { getTranslations } from "next-intl/server";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "account" });
  return {
    title: t("title"),
    description: t("sub"),
    alternates: buildAlternates(locale, "/account"),
    robots: { index: false, follow: false },
  };
}

export default function AccountPage() {
  return <AccountForm />;
}
