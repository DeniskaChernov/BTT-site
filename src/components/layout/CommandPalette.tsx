"use client";

import { useRouter } from "@/i18n/navigation";
import { buildCommandIndex, searchCommandItems, type CommandItem } from "@/lib/command-search";
import { BTT_Z } from "@/lib/layering";
import * as Dialog from "@radix-ui/react-dialog";
import { FileText, LayoutGrid, Package, Search, X } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Locale } from "@/types/product";

const KIND_ICON = {
  product: Package,
  article: FileText,
  page: LayoutGrid,
} as const;

export function CommandPalette() {
  const locale = useLocale() as Locale;
  const t = useTranslations("command");
  const tNav = useTranslations("nav");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const pageLabels = useMemo(
    () => ({
      home: tNav("home"),
      catalog: tNav("catalog"),
      semi: tNav("catalog_section_semi"),
      twisted: tNav("catalog_section_twisted"),
      planter: tNav("catalog_section_planter"),
      brochure: t("brochure"),
      wholesale: tNav("wholesale"),
      export: tNav("export"),
      about: tNav("about"),
      articles: tNav("articles"),
      contacts: tNav("contacts"),
      faq: tNav("faq"),
      cart: tNav("cart"),
      compare: tNav("compare"),
    }),
    [t, tNav],
  );

  const articleLabels = useMemo(
    () => ({
      "rattan-thickness-furniture": t("article_1"),
      "planters-outdoor-uv-drainage": t("article_2"),
      "wholesale-horeca-timelines": t("article_3"),
      "what-is-artificial-rattan": t("article_4"),
    }),
    [t],
  );

  const index = useMemo(
    () => buildCommandIndex(locale, pageLabels, articleLabels),
    [locale, pageLabels, articleLabels],
  );

  const results = useMemo(() => searchCommandItems(index, query), [index, query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onPick = useCallback(
    (item: CommandItem) => {
      setOpen(false);
      setQuery("");
      router.push(item.href);
    },
    [router],
  );

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (!v) setQuery("");
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 bg-black/65 backdrop-blur-[3px]"
          style={{ zIndex: BTT_Z.commandPalette }}
        />
        <Dialog.Content
          className="fixed left-1/2 top-[12vh] w-[min(100vw-2rem,36rem)] -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-[#0c0a09]/95 shadow-2xl backdrop-blur-xl outline-none"
          style={{ zIndex: BTT_Z.commandPalette + 1 }}
        >
          <div className="flex items-center gap-2 border-b border-white/[0.08] px-4 py-3">
            <Search className="h-4 w-4 shrink-0 text-stone-500" aria-hidden />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("placeholder")}
              className="min-w-0 flex-1 bg-transparent text-sm text-stone-100 outline-none placeholder:text-stone-500"
              autoFocus
            />
            <Dialog.Close className="btt-focus rounded-md border border-white/10 p-1 text-stone-400">
              <X className="h-4 w-4" aria-hidden />
            </Dialog.Close>
          </div>
          <p className="border-b border-white/[0.06] px-4 py-2 text-[11px] text-stone-500">{t("hint")}</p>
          <ul className="max-h-[min(50vh,22rem)] overflow-y-auto p-2" role="listbox">
            {results.length === 0 ? (
              <li className="px-3 py-6 text-center text-sm text-stone-500">{t("empty")}</li>
            ) : (
              results.map((item) => {
                const Icon = KIND_ICON[item.kind];
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={false}
                      onClick={() => onPick(item)}
                      className="btt-focus flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition hover:bg-white/[0.06]"
                    >
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-stone-100">
                        <Icon className="h-4 w-4" aria-hidden />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-stone-100">{item.title}</span>
                        {item.subtitle ? (
                          <span className="block truncate text-xs text-stone-500">{item.subtitle}</span>
                        ) : null}
                      </span>
                      <span className="text-[10px] uppercase tracking-wide text-stone-600">
                        {t(`kind_${item.kind}`)}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
          <div className="border-t border-white/[0.06] px-4 py-2 text-[11px] text-stone-600">
            <kbd className="rounded border border-white/10 px-1.5 py-0.5">Ctrl</kbd> +{" "}
            <kbd className="rounded border border-white/10 px-1.5 py-0.5">K</kbd>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
