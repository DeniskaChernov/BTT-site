/** Единый формат телефона для API и БД: trim и один пробел между «кусками». */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/\s+/g, " ");
}

/**
 * Мягкое форматирование UZ-номера при вводе: +998 XX XXX XX XX.
 * Не блокирует другие форматы — если цифр мало, возвращает очищенный ввод.
 */
export function formatPhoneInput(raw: string): string {
  const trimmed = raw.trim();
  if (!trimmed) return "";

  const digits = trimmed.replace(/\D/g, "");
  let national = digits;
  if (national.startsWith("998")) {
    national = national.slice(3);
  } else if (national.startsWith("8") && national.length >= 10) {
    national = national.slice(1);
  }
  national = national.slice(0, 9);
  if (!national) {
    return trimmed.startsWith("+") ? "+998" : trimmed.replace(/[^\d+]/g, "");
  }

  const parts: string[] = [];
  if (national.length > 0) parts.push(national.slice(0, 2));
  if (national.length > 2) parts.push(national.slice(2, 5));
  if (national.length > 5) parts.push(national.slice(5, 7));
  if (national.length > 7) parts.push(national.slice(7, 9));

  return `+998 ${parts.join(" ")}`.trimEnd();
}

/** Минимум цифр в номере и лимит длины — отсекаем «+» и пробелы без цифр. */
export function isMeaningfulPhone(phone: string): boolean {
  const s = normalizePhone(phone);
  if (!s || s.length > 48) return false;
  const digits = s.replace(/\D/g, "").length;
  return digits >= 7;
}
