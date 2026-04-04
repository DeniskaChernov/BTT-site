import { Link } from "@/i18n/navigation";

export default function NotFound() {
  return (
    <div className="btt-container py-24 text-center">
      <h1 className="text-2xl font-semibold">404</h1>
      <p className="mt-2 text-btt-muted">Страница не найдена.</p>
      <Link href="/" className="mt-6 inline-block text-btt-primary underline">
        На главную
      </Link>
    </div>
  );
}
