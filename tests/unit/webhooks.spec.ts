import { describe, expect, it } from "vitest";
import { verifyAnthropic, verifyOpenAI } from "@/lib/webhooks";
import { createHmac } from "node:crypto";

const SECRET = "shhh-test-secret";

function hexHmac(body: string): string {
  return createHmac("sha256", SECRET).update(body).digest("hex");
}

describe("verifyAnthropic", () => {
  it("validates a fresh signature", async () => {
    const ts = Math.floor(Date.now() / 1000).toString();
    const body = '{"hello":"world"}';
    const sig = hexHmac(`${ts}.${body}`);
    const out = await verifyAnthropic({
      body,
      signatureHeader: `v1=${sig}`,
      timestampHeader: ts,
      secret: SECRET,
    });
    expect(out.valid).toBe(true);
  });

  it("rejects an expired timestamp", async () => {
    const ts = (Math.floor(Date.now() / 1000) - 9999).toString();
    const body = "{}";
    const sig = hexHmac(`${ts}.${body}`);
    const out = await verifyAnthropic({
      body,
      signatureHeader: `v1=${sig}`,
      timestampHeader: ts,
      secret: SECRET,
    });
    expect(out.valid).toBe(false);
  });
});

describe("verifyOpenAI", () => {
  it("validates a fresh signature", async () => {
    const t = Math.floor(Date.now() / 1000);
    const body = '{"event":"test"}';
    const hex = hexHmac(`${t}.${body}`);
    const b64 = Buffer.from(hex, "hex").toString("base64");
    const out = await verifyOpenAI({
      body,
      signatureHeader: `t=${t},v1=${b64}`,
      secret: SECRET,
    });
    expect(out.valid).toBe(true);
  });
});
