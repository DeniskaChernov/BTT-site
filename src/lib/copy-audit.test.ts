import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const FORBIDDEN = [
  /оплат[аы]\s+сразу/i,
  /\bpay\s+now\b/i,
  /\binstant\s+payment\b/i,
  /оплатить\s+онлайн\s+сейчас/i,
];

function collectJsonStrings(dir: string): string[] {
  const out: string[] = [];
  for (const file of readdirSync(dir)) {
    if (!file.endsWith(".json")) continue;
    const parsed = JSON.parse(readFileSync(join(dir, file), "utf8")) as unknown;
    const walk = (v: unknown) => {
      if (typeof v === "string") out.push(v);
      else if (Array.isArray(v)) v.forEach(walk);
      else if (v && typeof v === "object")
        Object.values(v).forEach(walk);
    };
    walk(parsed);
  }
  return out;
}

describe("copy audit — no instant-payment promises", () => {
  it("messages/*.json avoid misleading pay-now wording", () => {
    const hits: string[] = [];
    for (const s of collectJsonStrings(join(process.cwd(), "messages"))) {
      for (const re of FORBIDDEN) {
        if (re.test(s)) hits.push(s.slice(0, 120));
      }
    }
    expect(hits, hits.join("\n")).toEqual([]);
  });
});
