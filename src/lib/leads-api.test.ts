import { describe, expect, it } from "vitest";
import { validateLeadBody } from "./leads-api";

describe("validateLeadBody", () => {
  it("accepts contacts_feedback with message", () => {
    const r = validateLeadBody({
      kind: "contacts_feedback",
      locale: "ru",
      fields: { feedback_contact: "a@b.c", feedback_message: "Hello world" },
    });
    expect(typeof r).not.toBe("string");
    if (typeof r === "string") throw new Error(r);
    expect(r.kind).toBe("contacts_feedback");
  });

  it("rejects short feedback message", () => {
    expect(
      validateLeadBody({
        kind: "contacts_feedback",
        locale: "ru",
        fields: { feedback_message: "ab" },
      }),
    ).toBe("Message too short");
  });

  it("rejects removed quiz_quote kind", () => {
    expect(
      validateLeadBody({
        kind: "quiz_quote",
        locale: "en",
        fields: { phone: "+998901234567" },
      }),
    ).toBe("Invalid kind");
  });

  it("accepts wholesale with phone and details", () => {
    const r = validateLeadBody({
      kind: "wholesale",
      locale: "uz",
      fields: {
        wholesale_phone: "+998901234567",
        wholesale_details: "Need 50kg half-round natural for workshop",
      },
    });
    expect(typeof r).not.toBe("string");
    if (typeof r === "string") throw new Error(r);
    expect(r.kind).toBe("wholesale");
  });
});
