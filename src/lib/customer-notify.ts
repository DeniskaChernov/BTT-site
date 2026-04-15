import { createHmac } from "node:crypto";
import { log } from "@/lib/logger";

type OrderNotifyReason =
  | "order_created"
  | "status_changed"
  | "payment_changed"
  | "tracking_changed";

type NotifyOrderPayload = {
  reason: OrderNotifyReason;
  order: {
    id: string;
    createdAt: string;
    updatedAt: string;
    phone: string;
    customerName: string;
    status: string;
    paymentStatus: string;
    totalUz: number;
    trackingProvider?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    paymentUrl?: string;
  };
};

function notifyConfig():
  | { url: string; secret: string; timeoutMs: number }
  | undefined {
  const url = process.env.CUSTOMER_NOTIFY_WEBHOOK_URL?.trim();
  const secret = process.env.CUSTOMER_NOTIFY_WEBHOOK_SECRET?.trim();
  if (!url || !secret || secret.length < 16) return undefined;
  return { url, secret, timeoutMs: 12_000 };
}

function signBody(body: string, secret: string): string {
  return createHmac("sha256", secret).update(body, "utf8").digest("hex");
}

/**
 * Единая точка отправки уведомлений клиентам (через внешний webhook-провайдер:
 * SMS/WhatsApp/Telegram-бот/омниканал).
 * Если env не настроены — no-op.
 */
export function notifyCustomerOrderEvent(
  payload: NotifyOrderPayload,
  requestId?: string,
): void {
  const cfg = notifyConfig();
  if (!cfg) return;

  const body = JSON.stringify(payload);
  const signature = signBody(body, cfg.secret);
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), cfg.timeoutMs);

  void fetch(cfg.url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "X-BTT-Notify-Signature": `sha256=${signature}`,
      "X-BTT-Notify-Reason": payload.reason,
      ...(requestId ? { "X-Request-Id": requestId } : {}),
    },
    body,
    signal: controller.signal,
  })
    .then((res) => {
      if (!res.ok) {
        log.warn("customer-notify", `Notify webhook HTTP ${res.status}`, {
          reason: payload.reason,
          orderId: payload.order.id,
          ...(requestId ? { requestId } : {}),
        });
      }
    })
    .catch((e) => {
      log.error("customer-notify", e, {
        reason: payload.reason,
        orderId: payload.order.id,
        ...(requestId ? { requestId } : {}),
      });
    })
    .finally(() => clearTimeout(t));
}
