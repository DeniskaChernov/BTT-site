import { Skeleton } from "@/components/ui/skeleton";

/** Короткий редирект /blog → /articles; скелетон снимает мигание пустого экрана. */
export default function BlogLoading() {
  return (
    <div className="btt-container flex min-h-[30vh] items-center justify-center py-16" aria-busy aria-live="polite">
      <Skeleton className="h-10 w-56 rounded-xl" />
    </div>
  );
}
