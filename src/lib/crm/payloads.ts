import { CRM_PAYLOAD_SCHEMA_VERSION } from "./contract";

export type CrmOrderJson = ReturnType<
  typeof import("@/lib/admin-order-json").orderToJson
>;

/** Общие поля всех исходящих событий в CRM. */
export type CrmPayloadEnvelope = {
  schemaVersion: typeof CRM_PAYLOAD_SCHEMA_VERSION;
  /** Уникальный id сообщения (дедуп в CRM, логи). */
  payloadId: string;
  /** См. CRM_SOURCE_APP в contract.ts */
  source: "btt-site";
  site: string;
};

export type CrmOrderCreatedPayload = CrmPayloadEnvelope & {
  event: "order.created";
  createdAt: string;
  order: CrmOrderJson;
};

export type CrmOrderUpdatedPayload = CrmPayloadEnvelope & {
  event: "order.updated";
  updatedAt: string;
  reason: "status_changed" | "payment_changed" | "tracking_changed" | "order_updated";
  order: CrmOrderJson;
};

export type CrmLeadSubmittedPayload = CrmPayloadEnvelope & {
  event: "lead.submitted";
  submittedAt: string;
  kind: string;
  locale: string;
  fields: Record<string, string>;
  quiz?: Record<string, string>;
  /** id строки в PostgreSQL, если лид сохранён в БД */
  leadId?: string;
};
