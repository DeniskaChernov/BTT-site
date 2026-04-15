import { PaymentStatus } from "@prisma/client";

export const PAYMENT_PROVIDER = {
  TELEGRAM_MANUAL: "telegram_manual",
  PAYME: "payme",
  CLICK: "click",
  UZCARD: "uzcard",
  HUMO: "humo",
} as const;

export type PaymentProviderKey =
  (typeof PAYMENT_PROVIDER)[keyof typeof PAYMENT_PROVIDER];

export const PAYMENT_WEBHOOK_HEADER = {
  SIGNATURE: "X-BTT-Pay-Signature",
  EVENT: "X-BTT-Pay-Event",
} as const;

export const EXTERNAL_PAYMENT_STATUS = {
  PENDING: "pending",
  REQUIRES_ACTION: "requires_action",
  SUCCEEDED: "succeeded",
  FAILED: "failed",
  REFUNDED: "refunded",
  PARTIALLY_REFUNDED: "partially_refunded",
} as const;

export type ExternalPaymentStatus =
  (typeof EXTERNAL_PAYMENT_STATUS)[keyof typeof EXTERNAL_PAYMENT_STATUS];

export function mapExternalToPaymentStatus(
  status: ExternalPaymentStatus,
): PaymentStatus {
  switch (status) {
    case EXTERNAL_PAYMENT_STATUS.REQUIRES_ACTION:
      return PaymentStatus.REQUIRES_ACTION;
    case EXTERNAL_PAYMENT_STATUS.SUCCEEDED:
      return PaymentStatus.PAID;
    case EXTERNAL_PAYMENT_STATUS.FAILED:
      return PaymentStatus.FAILED;
    case EXTERNAL_PAYMENT_STATUS.REFUNDED:
      return PaymentStatus.REFUNDED;
    case EXTERNAL_PAYMENT_STATUS.PARTIALLY_REFUNDED:
      return PaymentStatus.PARTIALLY_REFUNDED;
    default:
      return PaymentStatus.PENDING;
  }
}
