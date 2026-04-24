import { Skeleton, SkeletonText } from "@/components/ui/skeleton";

/**
 * Серверный skeleton для PDP: сохраняет двухколоночную раскладку до гидратации клиентского компонента.
 */
export default function ProductLoading() {
  return (
    <div className="btt-container py-10 pb-28 lg:pb-10" aria-busy aria-live="polite">
      <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
        <div>
          <Skeleton className="aspect-square w-full rounded-3xl" />
          <div className="mt-3 grid grid-cols-5 gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="aspect-square w-full rounded-lg" />
            ))}
          </div>
          <div className="mt-8 rounded-2xl border border-dashed border-white/12 bg-white/[0.03] p-5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="mt-3 h-3 w-full max-w-md" />
          </div>
        </div>
        <div>
          <Skeleton className="h-3.5 w-32" />
          <Skeleton className="mt-3 h-9 w-4/5 md:h-10" />
          <SkeletonText className="mt-4" lines={2} />

          <div className="mt-6 space-y-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-full max-w-md" />
            ))}
          </div>

          <Skeleton className="mt-8 h-28 w-full rounded-2xl" />

          <Skeleton className="mt-8 h-40 w-full rounded-3xl" />

          <div className="mt-6 flex flex-wrap gap-3">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-40 rounded-full" />
            <Skeleton className="h-12 w-44 rounded-full" />
          </div>

          <Skeleton className="mt-10 h-36 w-full rounded-3xl" />
          <Skeleton className="mt-6 h-40 w-full rounded-3xl" />
          <Skeleton className="mt-6 h-32 w-full rounded-3xl" />
        </div>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-40 w-full rounded-2xl" />
        ))}
      </div>
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
      </div>
      <div className="mt-6 border-t border-white/[0.08] py-4">
        <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-14 w-full rounded-lg" />
          ))}
        </div>
      </div>
      <div className="mt-12">
        <Skeleton className="h-6 w-40" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-64 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
