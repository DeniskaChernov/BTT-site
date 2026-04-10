/** Единый формат телефона для API и БД: trim и один пробел между «кусками». */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/\s+/g, " ");
}

/** Минимум цифр в номере и лимит длины — отсекаем «+» и пробелы без цифр. */
export function isMeaningfulPhone(phone: string): boolean {
  const s = normalizePhone(phone);
  if (!s || s.length > 48) return false;
  const digits = s.replace(/\D/g, "").length;
  return digits >= 7;
}
