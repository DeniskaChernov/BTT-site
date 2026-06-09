import { Skeleton, SkeletonCard } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

type Variant = "single" | "split" | "articleIndex" | "articleSlug" | "cart";

/**
 * Общий каркас загрузки для маршрутов без тяжёлого RSC-дерева.
 */
export function RouteLoadingShell({ variant = "single" }: { variant?: Variant }) {
  return (
    <div
      className="btt-container animate-fade-in py-12 motion-reduce:animate-none md:py-16"
      aria-busy
      aria-live="polite"
    >
      <Skeleton className="h-4 w-24" />
      <Skeleton className="mt-4 h-9 w-2/3 max-w-xl md:h-11" />
      <Skeleton className="mt-3 h-4 w-full max-w-2xl" />
      <Skeleton className="mt-2 h-4 max-w-xl w-[85%]" />

      {variant === "split" ? (
        <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_380px]">
          <div className="btt-glass space-y-4 rounded-3xl p-6 md:p-8">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-11 w-full rounded-full md:w-56" />
          </div>
          <div className="btt-glass-strong h-fit rounded-3xl p-6">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="mt-4 h-4 w-full" />
            <Skeleton className="mt-2 h-4 w-full" />
            <Skeleton className="mt-6 h-8 w-40" />
          </div>
        </div>
      ) : null}

      {variant === "cart" ? (
        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">
          <ul className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <li
                key={i}
                className="btt-glass grid grid-cols-1 gap-4 border-white/[0.06] p-5 sm:grid-cols-[1fr_auto_auto] sm:items-center"
              >
                <div className="space-y-2">
                  <Skeleton className="h-5 w-[88%] max-w-md" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-10 w-full max-w-[7rem] rounded-xl sm:justify-self-end" />
                <Skeleton className="h-6 w-24 justify-self-end sm:w-28" />
              </li>
            ))}
          </ul>
          <div className="btt-glass-strong h-fit rounded-3xl p-6">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="mt-4 h-9 w-44" />
            <Skeleton className="mt-6 h-12 w-full rounded-full" />
            <Skeleton className="mt-3 h-12 w-full rounded-full bg-white/[0.04]/30" />
          </div>
        </div>
      ) : null}

      {variant === "articleIndex" ? (
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : null}

      {variant === "articleSlug" ? (
        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn("h-3.5", i % 4 === 3 ? "w-2/3" : "w-full")}
            />
          ))}
        </div>
      ) : null}

      {variant === "single" ? (
        <div className="mt-10 max-w-3xl space-y-4">
          <Skeleton className="h-40 w-full rounded-3xl md:h-48" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
        </div>
      ) : null}
    </div>
  );
}
