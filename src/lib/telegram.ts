function normalizeTelegramUsername(raw: string | undefined): string | undefined {
  const t = raw?.trim();
  if (!t) return undefined;
  return t.replace(/^@/, "");
}

export function telegramBotStartUrl(startParam: string): string | null {
  const u = normalizeTelegramUsername(process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME);
  if (!u) return null;
  return `https://t.me/${u}?start=${encodeURIComponent(startParam)}`;
}

export function telegramChannelUrl(): string | null {
  const u = normalizeTelegramUsername(process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_USERNAME);
  if (!u) return null;
  return `https://t.me/${u}`;
}
