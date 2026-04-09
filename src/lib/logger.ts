/**
 * Структурированные логи сервера (удобно читать в Railway / Docker).
 * В dev — читаемый вывод; в prod — JSON-строки.
 */

function serialize(err: unknown): { message: string; name?: string; stack?: string } {
  if (err instanceof Error) {
    return { message: err.message, name: err.name, stack: err.stack };
  }
  return { message: String(err) };
}

export const log = {
  error(scope: string, err: unknown, extra?: Record<string, unknown>): void {
    const base = { scope, ...serialize(err), ...extra };
    if (process.env.NODE_ENV === "development") {
      console.error(`[${scope}]`, err, extra ?? "");
    } else {
      console.error(JSON.stringify({ level: "error", ...base }));
    }
  },

  warn(scope: string, message: string, extra?: Record<string, unknown>): void {
    const line = { level: "warn", scope, message, ...extra };
    if (process.env.NODE_ENV === "development") {
      console.warn(`[${scope}]`, message, extra ?? "");
    } else {
      console.warn(JSON.stringify(line));
    }
  },
};
