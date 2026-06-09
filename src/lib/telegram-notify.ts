import type { Order, OrderLine } from "@prisma/client";
import type { LeadKind } from "@/lib/leads-api";
import { log } from "@/lib/logger";
import { formatUzs } from "@/lib/pricing";
import { MANAGER_BOT_TOKEN, MANAGER_CHAT_ID } from "@/lib/telegram-manager-config";

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

export type ManagerLeadNotifyInput = {
  kind: LeadKind;
  locale: string;
  fields: Record<string, string>;
  leadId?: string;
};

const PAY_LABELS: Record<string, string> = {
  telegram: "Telegram / согласование",
  invoice: "Счёт для юрлица",
};

const SHIP_LABELS: Record<string, string> = {
  courier: "Курьер",
  pickup: "Самовывоз (шоурум)",
};

const LEAD_KIND_LABELS: Record<LeadKind, string> = {
  contacts_feedback: "Обратная связь",
  contacts_b2b: "B2B запрос",
  wholesale: "Опт / производство",
  export_quote: "Экспорт",
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
  if (!MANAGER_BOT_TOKEN || !MANAGER_CHAT_ID) return undefined;
  return {
    token: MANAGER_BOT_TOKEN,
    chatId: MANAGER_CHAT_ID,
    timeoutMs: 12_000,
  };
}

function sendManagerTelegram(
  text: string,
  context: { refId: string; logTag: string },
  requestId?: string,
): void {
  const cfg = notifyConfig();
  if (!cfg) return;

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
        log.warn(context.logTag, `Telegram HTTP ${res.status}`, {
          refId: context.refId,
          body: body.slice(0, 200),
          ...(requestId ? { requestId } : {}),
        });
      }
    })
    .catch((e) => {
      log.error(context.logTag, e, {
        refId: context.refId,
        ...(requestId ? { requestId } : {}),
      });
    })
    .finally(() => clearTimeout(t));
}

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

export function formatManagerLeadTelegramHtml(
  lead: ManagerLeadNotifyInput,
): string {
  const fieldLines = Object.entries(lead.fields)
    .map(
      ([key, value]) =>
        `• <b>${escapeTelegramHtml(key)}:</b> ${escapeTelegramHtml(value)}`,
    )
    .join("\n");

  return [
    `<b>📩 Новая заявка</b>`,
    `<b>Тип:</b> ${LEAD_KIND_LABELS[lead.kind] ?? lead.kind}`,
    `<b>Язык:</b> ${escapeTelegramHtml(lead.locale)}`,
    lead.leadId
      ? `<b>ID:</b> <code>${escapeTelegramHtml(lead.leadId)}</code>`
      : null,
    "",
    "<b>Данные:</b>",
    fieldLines || "—",
  ]
    .filter((line) => line !== null)
    .join("\n");
}

export function notifyManagerNewOrder(
  order: ManagerOrderNotifyInput,
  requestId?: string,
): void {
  sendManagerTelegram(
    formatManagerOrderTelegramHtml(order),
    { refId: order.id, logTag: "telegram-notify" },
    requestId,
  );
}

export function notifyManagerNewLead(
  lead: ManagerLeadNotifyInput,
  requestId?: string,
): void {
  sendManagerTelegram(
    formatManagerLeadTelegramHtml(lead),
    { refId: lead.leadId ?? lead.kind, logTag: "telegram-notify-lead" },
    requestId,
  );
}
