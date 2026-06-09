import { PageBackNav } from "@/components/layout/PageBackNav";
import { AnimatedReveal } from "@/components/ui/animated-reveal";
import { Link } from "@/i18n/navigation";
import { buildAlternates } from "@/lib/seo";
import { bttPrimaryButtonClass } from "@/lib/ui-classes";
import { cn } from "@/lib/utils";
import { Building2, FileText, Landmark, Mail, Phone } from "lucide-react";
import { getTranslations } from "next-intl/server";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "companyDetails" });
  const alternates = buildAlternates(locale, "/company-details");
  const title = t("title");
  const description = t("meta_description");
  return {
    title,
    description,
    alternates,
    openGraph: { title, description, url: alternates.canonical },
    twitter: { title, description },
  };
}

export default async function CompanyDetailsPage() {
  const t = await getTranslations("companyDetails");
  const tn = await getTranslations("nav");

  return (
    <div className="btt-container max-w-4xl py-12 md:py-16">
      <PageBackNav fallbackHref="/" />
      <div className="mt-2 max-w-3xl">
        <h1 className="text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
          {t("title")}
        </h1>
        <p className="mt-3 text-pretty text-stone-400 md:text-lg">{t("lead")}</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <AnimatedReveal className="h-full min-h-0" delay={0}>
          <article className="btt-glass flex h-full flex-col rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 text-stone-200/90">
              <Building2 className="h-5 w-5 shrink-0" aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                {t("card_legal_title")}
              </h2>
            </div>
            <p className="mt-4 text-lg font-semibold text-stone-100">{t("legal_name")}</p>
            <p className="mt-2 text-sm leading-relaxed text-stone-400">{t("address_line")}</p>
          </article>
        </AnimatedReveal>

        <AnimatedReveal className="h-full min-h-0" delay={0.06}>
          <article className="btt-glass-strong flex h-full flex-col rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 text-stone-200/90">
              <Mail className="h-5 w-5 shrink-0" aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                {t("card_contact_title")}
              </h2>
            </div>
            <p className="mt-4 text-sm text-stone-400">{t("contact_hint")}</p>
            <dl className="mt-6 grid gap-4 text-sm">
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  {t("email_label")}
                </dt>
                <dd className="mt-1">
                  <a
                    href={`mailto:${t("email_value")}`}
                    className="btt-focus font-medium text-stone-200/95 underline-offset-4 outline-none hover:text-stone-100 hover:underline"
                  >
                    {t("email_value")}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-medium uppercase tracking-wider text-stone-500">
                  {t("phone_label")}
                </dt>
                <dd className="mt-1">
                  <a
                    href={`tel:${t("phone_value").replace(/\s/g, "")}`}
                    className="btt-focus inline-flex items-center gap-2 font-medium text-stone-200/95 underline-offset-4 outline-none hover:text-stone-100 hover:underline"
                  >
                    <Phone className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                    {t("phone_value")}
                  </a>
                </dd>
              </div>
            </dl>
          </article>
        </AnimatedReveal>

        <AnimatedReveal className="md:col-span-2" delay={0.1}>
          <article className="btt-glass rounded-3xl p-6 md:p-8">
            <div className="flex items-center gap-3 text-stone-200/90">
              <Landmark className="h-5 w-5 shrink-0" aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                {t("card_bank_title")}
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-400">{t("bank_hint")}</p>
          </article>
        </AnimatedReveal>

        <AnimatedReveal className="md:col-span-2" delay={0.14}>
          <article className="rounded-3xl border border-white/15 bg-gradient-to-br from-white/[0.05] to-transparent p-6 md:p-8">
            <div className="flex items-center gap-3 text-stone-200/90">
              <FileText className="h-5 w-5 shrink-0" aria-hidden />
              <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                {t("card_docs_title")}
              </h2>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-stone-300">{t("docs_hint")}</p>
            <Link
              href="/contacts"
              className={cn(
                bttPrimaryButtonClass,
                "btt-focus mt-6 inline-flex items-center justify-center px-6 py-3 text-sm",
              )}
            >
              {tn("contacts")}
            </Link>
          </article>
        </AnimatedReveal>
      </div>
    </div>
  );
}
