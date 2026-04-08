import { redirect } from "next/navigation";

type Props = {
  params: Promise<{ locale: string }>;
};

/** Старый URL `/blog` ведёт на раздел «Статьи». */
export default async function BlogPage({ params }: Props) {
  const { locale } = await params;
  redirect(`/${locale}/articles`);
}
