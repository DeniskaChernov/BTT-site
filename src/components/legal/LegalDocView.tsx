import { PageBackNav } from "@/components/layout/PageBackNav";
import { pickLocaleValue, toLegalLocale, type LegalDoc } from "@/data/legal";
import { Link } from "@/i18n/navigation";

type Props = {
  doc: LegalDoc;
  locale: string;
  backHref?: string;
};

function formatEffectiveDate(iso: string, locale: string): string {
  const date = new Date(`${iso}T12:00:00`);
  const tag = locale === "uz" ? "uz-UZ" : locale === "en" ? "en-GB" : "ru-RU";
  return new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

export function LegalDocView({ doc, locale, backHref = "/" }: Props) {
  const l = toLegalLocale(locale);
  const title = pickLocaleValue(doc.title, l);
  const kicker = pickLocaleValue(doc.kicker, l);
  const lead = pickLocaleValue(doc.lead, l);
  const effectiveLabel = pickLocaleValue(doc.effectiveLabel, l);
  const contact = pickLocaleValue(doc.contact, l);
  const legalNotice = pickLocaleValue(doc.legalNotice, l);
  const tocLabel = pickLocaleValue(doc.tocLabel, l);
  const effectiveDisplay = formatEffectiveDate(doc.effectiveDateIso, l);

  return (
    <div className="btt-container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <PageBackNav fallbackHref={backHref} />

        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-400/85">
          {kicker}
        </p>
        <h1 className="mt-3 text-balance text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-stone-500">
          {effectiveLabel} {effectiveDisplay}
        </p>
        <p className="mt-6 text-pretty text-lg leading-relaxed text-stone-300">{lead}</p>

        <nav
          className="mt-10 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 md:p-6"
          aria-label={tocLabel}
        >
          <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            {tocLabel}
          </h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-stone-400">
            {doc.sections.map((section) => (
              <li key={section.id}>
                <a
                  href={`#${section.id}`}
                  className="btt-focus text-stone-200/90 underline-offset-4 outline-none transition hover:text-stone-100 hover:underline"
                >
                  {pickLocaleValue(section.title, l)}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <article className="mt-10 space-y-10 text-base leading-relaxed text-stone-400">
          {doc.sections.map((section) => {
            const sectionTitle = pickLocaleValue(section.title, l);
            const paragraphs = pickLocaleValue(section.paragraphs, l);
            const bullets = section.bullets
              ? pickLocaleValue(section.bullets, l)
              : undefined;

            return (
              <section key={section.id} id={section.id} className="scroll-mt-24">
                <h2 className="text-xl font-semibold text-stone-100 md:text-2xl">
                  {sectionTitle}
                </h2>
                <div className="mt-4 space-y-4">
                  {paragraphs.map((paragraph, i) => (
                    <p key={`${section.id}-p-${i}`}>{paragraph}</p>
                  ))}
                </div>
                {bullets && bullets.length > 0 ? (
                  <ul className="mt-4 list-disc space-y-2 pl-5 text-stone-400">
                    {bullets.map((item, i) => (
                      <li key={`${section.id}-b-${i}`}>{item}</li>
                    ))}
                  </ul>
                ) : null}
              </section>
            );
          })}
        </article>

        <aside className="mt-12 space-y-6 border-t border-white/[0.08] pt-10">
          <p className="text-sm leading-relaxed text-stone-400">{contact}</p>
          <p className="border-l-2 border-white/20 pl-4 text-sm leading-relaxed text-stone-300">
            {legalNotice}
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            {doc.slug !== "privacy" ? (
              <Link
                href="/privacy"
                className="btt-focus text-stone-200/90 underline-offset-4 outline-none hover:text-stone-100 hover:underline"
              >
                {l === "ru"
                  ? "Политика конфиденциальности"
                  : l === "uz"
                    ? "Maxfiylik siyosati"
                    : "Privacy Policy"}
              </Link>
            ) : null}
            {doc.slug !== "cookies" ? (
              <Link
                href="/cookies"
                className="btt-focus text-stone-200/90 underline-offset-4 outline-none hover:text-stone-100 hover:underline"
              >
                {l === "ru"
                  ? "Политика cookies"
                  : l === "uz"
                    ? "Cookies siyosati"
                    : "Cookies Policy"}
              </Link>
            ) : null}
            {doc.slug !== "terms" ? (
              <Link
                href="/terms"
                className="btt-focus text-stone-200/90 underline-offset-4 outline-none hover:text-stone-100 hover:underline"
              >
                {l === "ru" ? "Оферта" : l === "uz" ? "Oferta" : "Terms"}
              </Link>
            ) : null}
            <Link
              href="/company-details"
              className="btt-focus text-stone-200/90 underline-offset-4 outline-none hover:text-stone-100 hover:underline"
            >
              {l === "ru"
                ? "Реквизиты компании"
                : l === "uz"
                  ? "Kompaniya rekvizitlari"
                  : "Company details"}
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
