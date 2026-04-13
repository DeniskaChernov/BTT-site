/**
 * Точка входа для интеграции с CRM: контракт, типы, отправка.
 * Реализация приёмника CRM — отдельный проект; здесь только исходящий контракт сайта.
 */

export {
  CRM_EVENT,
  CRM_HTTP_HEADER,
  CRM_PAYLOAD_SCHEMA_VERSION,
  CRM_SOURCE_APP,
  type CrmEventName,
} from "./contract";
export type {
  CrmLeadSubmittedPayload,
  CrmOrderCreatedPayload,
  CrmPayloadEnvelope,
} from "./payloads";
export {
  crmSiteUrl,
  sendCrmOutboundPayload,
  type SendCrmOutboundOptions,
} from "./outbound";
export { signCrmWebhookBody } from "./signing";
