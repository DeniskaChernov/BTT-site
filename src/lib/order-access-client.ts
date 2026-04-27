const ACCESS_STORAGE_KEY = "btt-orders-access";

export function readOrderAccessToken(phoneNorm: string): string {
  if (typeof window === "undefined") return "";
  try {
    const raw = localStorage.getItem(ACCESS_STORAGE_KEY);
    if (!raw) return "";
    const parsed = JSON.parse(raw) as Record<string, string> | null;
    if (!parsed || typeof parsed !== "object") return "";
    const token = parsed[phoneNorm];
    return typeof token === "string" ? token : "";
  } catch {
    return "";
  }
}

export function saveOrderAccessToken(phoneNorm: string, token: string): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(ACCESS_STORAGE_KEY);
    const parsed =
      raw && raw.trim().length > 0
        ? (JSON.parse(raw) as Record<string, string>)
        : {};
    parsed[phoneNorm] = token;
    localStorage.setItem(ACCESS_STORAGE_KEY, JSON.stringify(parsed));
    window.dispatchEvent(new Event("btt-orders-changed"));
  } catch {
    // Ignore storage quota/json errors.
  }
}
