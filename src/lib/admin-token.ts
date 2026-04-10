import { timingSafeEqual } from "node:crypto";

/**
 * Проверка `Authorization: Bearer <ADMIN_API_SECRET>`.
 * Сравнение через timingSafeEqual при равной длине токенов (секрет ≥ 24 символов в .env).
 */
export function verifyAdminBearer(
  request: Request,
  expectedSecret: string | undefined,
): boolean {
  if (!expectedSecret || expectedSecret.length < 24) return false;
  const auth = request.headers.get("authorization") ?? "";
  const prefix = "Bearer ";
  if (!auth.startsWith(prefix)) return false;
  const token = auth.slice(prefix.length).trim();
  if (!token.length) return false;
  try {
    const a = Buffer.from(token, "utf8");
    const b = Buffer.from(expectedSecret, "utf8");
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
