import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CatalogPlantersPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/catalog?tab=planter`);
}
