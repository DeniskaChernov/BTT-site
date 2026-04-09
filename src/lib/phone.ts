/** Единый формат телефона для API и БД: trim и один пробел между «кусками». */
export function normalizePhone(phone: string): string {
  return phone.trim().replace(/\s+/g, " ");
}
