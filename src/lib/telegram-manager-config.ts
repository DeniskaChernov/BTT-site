/** Бот уведомлений менеджеру. Задаётся только через env — без дефолтов в коде. */
export function getManagerBotToken(): string | undefined {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  return token || undefined;
}

export function getManagerChatId(): string | undefined {
  const chatId = process.env.TELEGRAM_MANAGER_CHAT_ID?.trim();
  return chatId || undefined;
}

export function isManagerTelegramConfigured(): boolean {
  return Boolean(getManagerBotToken() && getManagerChatId());
}
