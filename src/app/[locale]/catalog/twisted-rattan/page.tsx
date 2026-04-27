import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CatalogTwistedRattanPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/catalog?tab=material&shape=round`);
}
