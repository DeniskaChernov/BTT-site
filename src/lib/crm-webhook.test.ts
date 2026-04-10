import { describe, expect, it } from "vitest";
import { signCrmWebhookBody } from "./crm-webhook";

describe("signCrmWebhookBody", () => {
  it("returns stable hex for same input", () => {
    const secret = "test-secret-key-16";
    const body = '{"event":"order.created"}';
    const a = signCrmWebhookBody(body, secret);
    const b = signCrmWebhookBody(body, secret);
    expect(a).toBe(b);
    expect(a).toMatch(/^[a-f0-9]{64}$/);
  });

  it("differs when body changes", () => {
    const secret = "test-secret-key-16";
    expect(signCrmWebhookBody("a", secret)).not.toBe(signCrmWebhookBody("b", secret));
  });
});
