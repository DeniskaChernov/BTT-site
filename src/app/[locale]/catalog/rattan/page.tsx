import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function CatalogRattanPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/catalog?tab=material&kind=regular`);
}
