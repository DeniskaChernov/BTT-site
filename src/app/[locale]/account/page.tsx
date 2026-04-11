import { AccountForm } from "@/components/account/AccountForm";
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
  };
}

export default function AccountPage() {
  return <AccountForm />;
}
