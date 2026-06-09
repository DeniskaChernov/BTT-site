import { isMeaningfulPhone, normalizePhone } from "@/lib/phone";

export const LEAD_KINDS = [
  "contacts_feedback",
  "contacts_b2b",
  "wholesale",
  "export_quote",
] as const;

export type LeadKind = (typeof LEAD_KINDS)[number];

const KIND_SET = new Set<string>(LEAD_KINDS);

const MAX_FIELD_LEN = 12_000;
const MAX_FIELDS = 40;

const LOCALES = new Set(["ru", "uz", "en"]);

function trimRecord(input: Record<string, unknown>): Record<string, string> | string {
  const out: Record<string, string> = {};
  let n = 0;
  for (const [k, v] of Object.entries(input)) {
    if (typeof k !== "string" || k.length > 120) return "Invalid fields";
    if (typeof v !== "string") return "Invalid fields";
    const t = v.trim();
    if (t.length > MAX_FIELD_LEN) return "Field too long";
    out[k] = t;
    n += 1;
    if (n > MAX_FIELDS) return "Too many fields";
  }
  return out;
}

function validateByKind(
  kind: LeadKind,
  fields: Record<string, string>,
): string | true {
  switch (kind) {
    case "contacts_feedback": {
      const msg = fields.feedback_message ?? "";
      if (msg.length < 3) return "Message too short";
      return true;
    }
    case "contacts_b2b": {
      const req = fields.b2b_request ?? "";
      if (req.length < 8) return "Request too short";
      return true;
    }
    case "wholesale": {
      const phone = fields.wholesale_phone ?? "";
      const details = fields.wholesale_details ?? "";
      if (!isMeaningfulPhone(normalizePhone(phone))) return "Invalid phone";
      if (details.length < 8) return "Details too short";
      return true;
    }
    case "export_quote": {
      const country = fields.export_country ?? "";
      if (country.length < 2) return "Country required";
      return true;
    }
    default:
      return "Invalid kind";
  }
}

export type IntentLeadSnapshot = {
  journey: string;
  confidence: number;
  volumeIntent: string;
  topics: string[];
  cartSkus: string[];
  viewedSkus: string[];
  readArticles: string[];
};

export type ValidatedLead = {
  kind: LeadKind;
  locale: string;
  fields: Record<string, string>;
  intentSnapshot?: IntentLeadSnapshot;
};

/** Возвращает ошибку строкой или валидированный лид. */
export function validateLeadBody(raw: unknown): ValidatedLead | string {
  if (typeof raw !== "object" || raw === null) return "Invalid payload";
  const b = raw as Record<string, unknown>;
  const kind = b.kind;
  const locale = b.locale;
  if (typeof kind !== "string" || !KIND_SET.has(kind)) return "Invalid kind";
  if (typeof locale !== "string" || !LOCALES.has(locale)) return "Invalid locale";
  const fieldsRaw = b.fields;
  if (typeof fieldsRaw !== "object" || fieldsRaw === null) return "Invalid fields";
  const fields = trimRecord(fieldsRaw as Record<string, unknown>);
  if (typeof fields === "string") return fields;

  const ok = validateByKind(kind as LeadKind, fields);
  if (ok !== true) return ok;

  let intentSnapshot: IntentLeadSnapshot | undefined;
  const snap = b.intentSnapshot;
  if (snap !== undefined && snap !== null) {
    if (typeof snap !== "object") return "Invalid intentSnapshot";
    const s = snap as Record<string, unknown>;
    if (
      typeof s.journey !== "string" ||
      typeof s.confidence !== "number" ||
      typeof s.volumeIntent !== "string"
    ) {
      return "Invalid intentSnapshot";
    }
    const arr = (v: unknown) =>
      Array.isArray(v) ? v.filter((x): x is string => typeof x === "string").slice(0, 16) : [];
    intentSnapshot = {
      journey: s.journey.slice(0, 32),
      confidence: Math.min(1, Math.max(0, s.confidence)),
      volumeIntent: s.volumeIntent.slice(0, 16),
      topics: arr(s.topics),
      cartSkus: arr(s.cartSkus),
      viewedSkus: arr(s.viewedSkus),
      readArticles: arr(s.readArticles),
    };
  }

  return {
    kind: kind as LeadKind,
    locale,
    fields,
    ...(intentSnapshot ? { intentSnapshot } : {}),
  };
}
