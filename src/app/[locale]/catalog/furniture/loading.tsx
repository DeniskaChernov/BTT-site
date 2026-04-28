export default function CatalogFurnitureLoading() {
  return (
    <div className="btt-container py-12 md:py-16">
      <div className="mx-auto max-w-3xl">
        <div className="space-y-3">
          <div className="h-4 w-28 animate-pulse rounded-full bg-stone-800/70" />
          <div className="h-10 w-full max-w-lg animate-pulse rounded-lg bg-stone-800/80" />
          <div className="h-6 w-full max-w-2xl animate-pulse rounded-lg bg-stone-800/55" />
          <div className="h-6 w-full max-w-xl animate-pulse rounded-lg bg-stone-800/45" />
        </div>

        <div className="mt-10 rounded-3xl border border-white/[0.06] bg-white/[0.02] p-4 md:p-6">
          <div className="mx-auto mb-4 h-4 w-48 animate-pulse rounded bg-stone-800/55" />
          <div className="aspect-[4/3] min-h-[260px] animate-pulse rounded-[1.75rem] bg-gradient-to-b from-stone-900/75 to-[#0a0908]" />
        </div>

        <div className="mt-10 flex justify-center">
          <div className="h-11 w-52 animate-pulse rounded-full bg-stone-800/65" />
        </div>
      </div>
    </div>
  );
}
