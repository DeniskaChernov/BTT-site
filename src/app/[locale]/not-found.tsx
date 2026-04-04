import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="btt-container flex min-h-[60vh] flex-col items-center justify-center py-24 text-center">
      <p className="text-8xl font-bold tabular-nums text-stone-800">404</p>
      <h1 className="mt-4 text-2xl font-semibold text-stone-200">
        Страница не найдена
      </h1>
      <p className="mt-2 max-w-md text-stone-500">
        Проверьте адрес или вернитесь на главную.
      </p>
      <Link
        href="/"
        className="mt-10 inline-flex rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-8 py-3 text-sm font-semibold text-white shadow-lg"
      >
        На главную
      </Link>
    </div>
  );
}
