"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/navigation";
import type { CatalogMegaMenuConfig } from "@/components/ui/slide-tabs";
import { ArrowRight } from "lucide-react";

type Props = { config: CatalogMegaMenuConfig; onNavigate?: () => void };

function ChipLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      role="menuitem"
      onClick={onNavigate}
      className="btt-focus rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-stone-300 transition hover:border-amber-500/35 hover:bg-amber-950/20 hover:text-amber-100"
    >
      {label}
    </Link>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
        {title}
      </p>
      {children}
    </div>
  );
}

export function CatalogMegaMenuPanel({ config, onNavigate }: Props) {
  return (
    <div className="w-[min(100vw-2rem,38rem)] p-4">
      <Link
        href={config.catalogAll.href}
        role="menuitem"
        onClick={onNavigate}
        className="btt-focus mb-4 flex items-center justify-between gap-3 rounded-xl border border-amber-500/25 bg-gradient-to-r from-amber-950/40 to-transparent px-4 py-3 text-sm font-semibold text-amber-50 transition hover:border-amber-500/40 hover:from-amber-950/55"
      >
        {config.catalogAll.label}
        <ArrowRight className="h-4 w-4 shrink-0 text-amber-400/80" aria-hidden />
      </Link>

      <div className="grid gap-4 sm:grid-cols-2">
        <SectionBlock title={config.materialsTitle}>
          <ul className="space-y-0.5">
            {config.materials.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  role="menuitem"
                  onClick={onNavigate}
                  className="btt-focus block rounded-lg px-2 py-2 text-sm font-medium text-stone-200 transition hover:bg-white/[0.06] hover:text-amber-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </SectionBlock>

        <SectionBlock title={config.sectionsTitle}>
          <ul className="space-y-0.5">
            {config.sections.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  role="menuitem"
                  onClick={onNavigate}
                  className="btt-focus block rounded-lg px-2 py-2 text-sm font-medium text-stone-200 transition hover:bg-white/[0.06] hover:text-amber-100"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </SectionBlock>
      </div>

      <div className="mt-4 grid gap-4 border-t border-white/[0.08] pt-4 sm:grid-cols-2">
        <SectionBlock title={config.stockTitle}>
          <div className="flex flex-wrap gap-2">
            {config.stock.map((link) => (
              <ChipLink key={link.href} {...link} onNavigate={onNavigate} />
            ))}
          </div>
        </SectionBlock>

        {config.tasks.length > 0 ? (
          <SectionBlock title={config.tasksTitle}>
            <div className="flex flex-wrap gap-2">
              {config.tasks.map((link) => (
                <ChipLink key={link.href} {...link} onNavigate={onNavigate} />
              ))}
            </div>
          </SectionBlock>
        ) : null}
      </div>

      {config.footer?.length ? (
        <div className="mt-3 flex flex-wrap gap-3 border-t border-white/[0.06] pt-3">
          {config.footer.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              role="menuitem"
              onClick={onNavigate}
              className="text-xs font-medium text-stone-500 transition hover:text-amber-200"
            >
              {f.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
