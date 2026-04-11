import { ChevronDown } from "lucide-react";

type Item = { q: string; a: string };

export function FaqList({ items }: { items: Item[] }) {
  return (
    <ul className="space-y-3 md:space-y-4">
      {items.map((item) => (
        <li key={item.q}>
          <details className="group btt-glass rounded-2xl border border-white/[0.08] transition open:border-amber-500/25 open:shadow-[0_0_32px_rgba(245,158,11,0.06)] md:rounded-3xl">
            <summary className="btt-focus flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 text-left text-base font-semibold text-stone-100 outline-none marker:content-none md:rounded-3xl md:px-6 md:py-5 md:text-lg [&::-webkit-details-marker]:hidden">
              <span className="pr-2">{item.q}</span>
              <ChevronDown
                className="h-5 w-5 shrink-0 text-amber-500/70 transition duration-300 group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="border-t border-white/[0.06] px-5 pb-5 pt-0 md:px-6 md:pb-6">
              <p className="pt-4 text-sm leading-relaxed text-stone-400 md:text-base">
                {item.a}
              </p>
            </div>
          </details>
        </li>
      ))}
    </ul>
  );
}
