import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";

/**
 * Серверный loading state для /catalog — держит раскладку и плавно переходит в реальную сетку.
 * Не зависит от локалей: визуальные плейсхолдеры.
 */
export default function CatalogLoading() {
  return (
    <div className="btt-container py-12 md:py-16" aria-busy aria-live="polite">
      <div className="max-w-4xl">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="mt-3 h-10 w-3/4 md:h-12" />
        <Skeleton className="mt-4 h-4 w-full max-w-2xl" />
        <Skeleton className="mt-2 h-4 w-2/3 max-w-xl" />
      </div>

      <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-full" />
        ))}
      </div>

      <div className="mt-8 rounded-3xl border border-amber-500/15 bg-amber-950/20 p-6 md:p-8">
        <Skeleton className="h-3.5 w-28" />
        <Skeleton className="mt-3 h-4 w-full max-w-xl" />
        <Skeleton className="mt-5 h-11 w-48 rounded-full" />
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-2xl" />
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[280px_1fr]">
        <Skeleton className="hidden h-[420px] w-full rounded-3xl lg:block" />
        <div className="min-w-0">
          <div className="mb-4 grid gap-3 md:grid-cols-[1fr_auto_auto] md:items-center">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-5 w-32 md:justify-self-end" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
