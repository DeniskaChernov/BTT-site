import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/**
 * Общий skeleton под любые маршруты внутри [locale] — держит каркас первого экрана,
 * чтобы переход не «схлопывал» страницу.
 */
export default function LocaleLoading() {
  return (
    <div className="btt-container py-12 md:py-16" aria-busy aria-live="polite">
      <div className="mx-auto max-w-3xl">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="mt-3 h-10 w-3/4 md:h-12" />
        <SkeletonText className="mt-4" lines={2} />

        <div className="mt-6 flex flex-wrap gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-32 rounded-full" />
          ))}
        </div>
      </div>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
