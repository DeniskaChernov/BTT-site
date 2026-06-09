"use client";

import { Link } from "@/i18n/navigation";
import type { CatalogMegaMenuConfig } from "@/components/ui/slide-tabs";

type Props = { config: CatalogMegaMenuConfig; onNavigate?: () => void };

export function CatalogMegaMenuPanel({ config, onNavigate }: Props) {
  return (
    <div className="w-[min(100vw-2rem,42rem)] p-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {config.columns.map((col) => (
          <div key={col.title}>
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-400/80">
              {col.title}
            </p>
            <ul className="space-y-0.5">
              {col.links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    role="menuitem"
                    onClick={onNavigate}
                    className="btt-focus block rounded-lg px-2 py-2 text-sm font-medium text-stone-200 transition hover:bg-white/[0.06] hover:text-stone-50"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {config.recent && config.recent.length > 0 ? (
        <div className="mt-4 border-t border-white/[0.08] pt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            {config.recentTitle}
          </p>
          <ul className="space-y-0.5">
            {config.recent.map((r) => (
              <li key={r.href}>
                <Link
                  href={r.href}
                  role="menuitem"
                  onClick={onNavigate}
                  className="btt-focus block rounded-lg px-2 py-1.5 text-sm text-stone-300 transition hover:bg-white/[0.06] hover:text-stone-50"
                >
                  {r.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
      {config.presets.length > 0 ? (
        <div className="mt-4 border-t border-white/[0.08] pt-4">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500">
            {config.presetsTitle}
          </p>
          <div className="flex flex-wrap gap-2">
            {config.presets.map((p) => (
              <Link
                key={p.href}
                href={p.href}
                role="menuitem"
                onClick={onNavigate}
                className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-xs font-semibold text-stone-300 transition hover:border-white/20 hover:text-stone-50"
              >
                {p.label}
              </Link>
            ))}
          </div>
        </div>
      ) : null}
      {config.footer?.length ? (
        <div className="mt-3 flex flex-wrap gap-3 border-t border-white/[0.06] pt-3">
          {config.footer.map((f) => (
            <Link
              key={f.href}
              href={f.href}
              role="menuitem"
              onClick={onNavigate}
              className="text-xs font-medium text-stone-500 transition hover:text-stone-200"
            >
              {f.label}
            </Link>
          ))}
        </div>
      ) : null}
    </div>
  );
}
