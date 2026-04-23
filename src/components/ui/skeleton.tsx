import { cn } from "@/lib/utils";

type SkeletonProps = {
  className?: string;
  "aria-label"?: string;
};

/**
 * Базовый скелетон: подсвечивает область загрузки.
 * Использует `animate-pulse` + нейтральный фон под тёмную тему BTT.
 * Уважает prefers-reduced-motion через `motion-reduce:animate-none` из Tailwind.
 */
export function Skeleton({ className, ...rest }: SkeletonProps) {
  return (
    <div
      role="status"
      aria-hidden={rest["aria-label"] ? undefined : true}
      className={cn(
        "animate-pulse rounded-lg bg-stone-800/70 motion-reduce:animate-none",
        className,
      )}
      {...rest}
    />
  );
}

export function SkeletonText({
  className,
  lines = 1,
}: {
  className?: string;
  lines?: number;
}) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn(
            "h-3.5 w-full",
            i === lines - 1 && lines > 1 ? "w-2/3" : undefined,
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex h-full min-h-[22rem] flex-col overflow-hidden rounded-3xl border border-white/[0.06] bg-white/[0.02]",
        className,
      )}
    >
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-5">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-auto h-9 w-28 rounded-full" />
        <Skeleton className="h-10 w-full rounded-full bg-amber-950/40" />
      </div>
    </div>
  );
}
