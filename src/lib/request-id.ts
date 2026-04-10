/** Заголовок корреляции (ставится в `middleware`). */
export function requestIdFrom(request: Request): string | undefined {
  const v = request.headers.get("x-request-id")?.trim();
  return v || undefined;
}
