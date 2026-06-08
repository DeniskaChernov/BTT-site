import type { Order, OrderLine } from "@prisma/client";
import { log } from "@/lib/logger";
import { formatUzs } from "@/lib/pricing";

export type ManagerOrderNotifyInput = Pick<
  Order,
  | "id"
  | "totalUz"
  | "pay"
  | "ship"
  | "customerName"
  | "phone"
  | "address"
> & {
  lines: Pick<OrderLine, "name" | "qtyKg" | "lineTotalUz">[];
};
const PAY_LABELS: Record<string, string> = {
  telegram: "Telegram / согласование",
  invoice: "Счёт для юрлица",
};

const SHIP_LABELS: Record<string, string> = {
  courier: "Курьер",
  pickup: "Самовывоз (шоурум)",
};

function escapeTelegramHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function notifyConfig():
  | { token: string; chatId: string; timeoutMs: number }
  | undefined {
  const token = process.env.TELEGRAM_BOT_TOKEN?.trim();
  const chatId = process.env.TELEGRAM_MANAGER_CHAT_ID?.trim();
  if (!token || !chatId) return undefined;
  return { token, chatId, timeoutMs: 12_000 };
}

/** HTML-текст для Bot API (`parse_mode: HTML`). Экспорт для unit-тестов. */
export function formatManagerOrderTelegramHtml(
  order: ManagerOrderNotifyInput,
): string {
  const lines = order.lines
    .map((line) => {
      const qty =
        line.qtyKg % 1 === 0
          ? `${line.qtyKg} кг`
          : `${line.qtyKg.toFixed(1)} кг`;
      return `• ${escapeTelegramHtml(line.name)} — ${qty} — ${formatUzs(line.lineTotalUz)}`;
    })
    .join("\n");

  const address = order.address?.trim();

  return [
    `<b>🛒 Новый заказ</b>`,
    `<b>ID:</b> <code>${escapeTelegramHtml(order.id)}</code>`,
    `<b>Клиент:</b> ${escapeTelegramHtml(order.customerName)}`,
    `<b>Тел:</b> ${escapeTelegramHtml(order.phone)}`,
    `<b>Доставка:</b> ${SHIP_LABELS[order.ship] ?? order.ship}`,
    `<b>Оплата:</b> ${PAY_LABELS[order.pay] ?? order.pay}`,
    address ? `<b>Адрес:</b> ${escapeTelegramHtml(address)}` : null,
    "",
    "<b>Позиции:</b>",
    lines || "—",
    "",
    `<b>Итого:</b> ${formatUzs(order.totalUz)}`,
  ]
    .filter((line) => line !== null)
    .join("\n");
}

/**
 * Уведомление менеджеру в Telegram при новом заказе (не блокирует ответ клиенту).
 * Нужны `TELEGRAM_BOT_TOKEN` и `TELEGRAM_MANAGER_CHAT_ID`.
 */
export function notifyManagerNewOrder(
  order: ManagerOrderNotifyInput,
  requestId?: string,
): void {
  const cfg = notifyConfig();
  if (!cfg) return;

  const text = formatManagerOrderTelegramHtml(order);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), cfg.timeoutMs);

  void fetch(`https://api.telegram.org/bot${cfg.token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      chat_id: cfg.chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
    }),
    signal: controller.signal,
  })
    .then(async (res) => {
      if (!res.ok) {
        const body = await res.text().catch(() => "");
        log.warn("telegram-notify", `Telegram HTTP ${res.status}`, {
          orderId: order.id,
          body: body.slice(0, 200),
          ...(requestId ? { requestId } : {}),
        });
      }
    })
    .catch((e) => {
      log.error("telegram-notify", e, {
        orderId: order.id,
        ...(requestId ? { requestId } : {}),
      });
    })
    .finally(() => clearTimeout(t));
}
