"use client";

/**
 * Ловит ошибки корневого layout (вне локализованного дерева).
 * Обязательны собственные <html> и <body>.
 * Тексты ru / en / uz — без провайдера i18n.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const digest = error.digest;

  return (
    <html lang="ru">
      <body className="min-h-screen bg-[#070605] px-6 py-16 font-sans text-stone-200">
        <div className="mx-auto max-w-lg text-center">
          <h1 className="text-xl font-semibold">Критическая ошибка</h1>
          <p className="mt-3 text-sm text-stone-500">
            Обновите страницу. Если повторяется — напишите в поддержку
            {digest ? ` (код: ${digest})` : ""}.
          </p>
          <p className="mt-4 text-sm text-stone-500" lang="en">
            Refresh the page. If it keeps happening, contact support
            {digest ? ` (ref: ${digest})` : ""}.
          </p>
          <p className="mt-4 text-sm text-stone-500" lang="uz">
            Sahifani yangilang. Muammo davom etsa, qo‘llab-quvvatlashga yozing
            {digest ? ` (kod: ${digest})` : ""}.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="mt-8 rounded-full border border-amber-500/40 bg-amber-500/15 px-6 py-2.5 text-sm font-semibold text-amber-100"
          >
            Повторить / Retry / Qayta urinish
          </button>
        </div>
      </body>
    </html>
  );
}
