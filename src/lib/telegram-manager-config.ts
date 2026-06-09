/** Бот уведомлений менеджеру. Override: TELEGRAM_BOT_TOKEN, TELEGRAM_MANAGER_CHAT_ID. */
export const MANAGER_BOT_TOKEN =
  process.env.TELEGRAM_BOT_TOKEN?.trim() ||
  "7603887905:AAGKCgCT2ZrSyrAXm7Fp7AyJDNPtePNMTrw";

export const MANAGER_CHAT_ID =
  process.env.TELEGRAM_MANAGER_CHAT_ID?.trim() || "7019985933";
