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

  it("accepts quiz_quote with quiz context", () => {
    const r = validateLeadBody({
      kind: "quiz_quote",
      locale: "en",
      fields: { phone: "+998901234567", city: "Tashkent", company: "" },
      quiz: { segment: "wholesale", vol: "5" },
    });
    expect(typeof r).not.toBe("string");
    if (typeof r === "string") throw new Error(r);
    expect(r.quiz?.segment).toBe("wholesale");
  });

  it("rejects quiz_quote without quiz", () => {
    expect(
      validateLeadBody({
        kind: "quiz_quote",
        locale: "ru",
        fields: { phone: "+998901234567" },
      }),
    ).toBe("Quiz context required");
  });
});
