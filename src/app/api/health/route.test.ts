import { describe, expect, it } from "vitest";
import { GET } from "./route";

describe("/api/health", () => {
  it("returns ok on shallow check", async () => {
    const res = await GET(new Request("http://localhost/api/health"));
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      ok: boolean;
      time: string;
      databaseConfigured: boolean;
    };
    expect(body.ok).toBe(true);
    expect(body.time).toBeTruthy();
    expect(typeof body.databaseConfigured).toBe("boolean");
  });

  it("reports not_configured when deep without DATABASE_URL", async () => {
    const prev = process.env.DATABASE_URL;
    delete process.env.DATABASE_URL;
    try {
      const res = await GET(new Request("http://localhost/api/health?deep=1"));
      expect(res.status).toBe(200);
      const body = (await res.json()) as { database?: string };
      expect(body.database).toBe("not_configured");
    } finally {
      if (prev !== undefined) process.env.DATABASE_URL = prev;
    }
  });
});
