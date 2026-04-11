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

/** Согласование оплаты в личном чате (username без @). См. .env.example */
export function telegramPaymentChatUrl(): string | null {
  const direct =
    normalizeTelegramUsername(process.env.NEXT_PUBLIC_TELEGRAM_PAYMENT_USERNAME) ??
    normalizeTelegramUsername(process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME);
  if (direct) return `https://t.me/${direct}`;
  return telegramChannelUrl();
}

/** Предзаполнение поля сообщения в клиенте Telegram (`?text=`). */
export function appendTelegramPrefillText(baseUrl: string, text: string): string {
  const t = text.trim();
  if (!t) return baseUrl;
  try {
    const u = new URL(baseUrl);
    u.searchParams.set("text", t);
    return u.toString();
  } catch {
    return baseUrl;
  }
}
