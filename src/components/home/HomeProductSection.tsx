import { HomeHitsGrid } from "@/components/home/HomeHitsGrid";
import { Link } from "@/i18n/navigation";
import type { RankPurpose } from "@/lib/intent/types";
import type { Product } from "@/types/product";
import { ArrowRight } from "lucide-react";

type Props = {
  id: string;
  kicker: string;
  title: string;
  lead: string;
  cta: string;
  ctaHref?: string;
  fallback: Product[];
  purpose?: RankPurpose;
};

export function HomeProductSection({
  id,
  kicker,
  title,
  lead,
  cta,
  ctaHref = "/catalog",
  fallback,
  purpose = "home_hits",
}: Props) {
  if (fallback.length === 0) return null;

  return (
    <section id={id} className="relative scroll-mt-24 py-10 md:py-14">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-transparent via-amber-950/6 to-transparent" />
      <div className="relative btt-container">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-amber-500/80">
              {kicker}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-stone-50 md:text-4xl">
              {title}
            </h2>
            <p className="mt-3 text-pretty text-stone-400 md:text-lg">{lead}</p>
          </div>
          <Link
            href={ctaHref}
            className="group btt-focus inline-flex items-center justify-center gap-2 self-start rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm font-semibold text-stone-200 transition hover:border-amber-500/35 hover:text-amber-100 motion-reduce:transition-none md:self-end"
          >
            {cta}
            <ArrowRight
              className="h-4 w-4 transition group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
              aria-hidden
            />
          </Link>
        </div>
        <HomeHitsGrid fallback={fallback} purpose={purpose} />
      </div>
    </section>
  );
}
