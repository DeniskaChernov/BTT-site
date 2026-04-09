"use client";

/**
 * Ловит ошибки корневого layout (вне локализованного дерева).
 * Обязательны собственные <html> и <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#070605] px-6 py-16 font-sans text-stone-200">
        <div className="mx-auto max-w-md text-center">
          <h1 className="text-xl font-semibold">Критическая ошибка</h1>
          <p className="mt-3 text-sm text-stone-500">
            Обновите страницу. Если повторяется — напишите в поддержку
            {error.digest ? ` (код: ${error.digest})` : ""}.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-full border border-amber-500/40 bg-amber-500/15 px-6 py-2.5 text-sm font-semibold text-amber-100"
          >
            Повторить
          </button>
        </div>
      </body>
    </html>
  );
}
