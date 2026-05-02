import { describe, expect, it, beforeEach } from "vitest";
import { signToken, verifyToken } from "@/lib/jwt";

describe("jwt sign + verify", () => {
  beforeEach(() => {
    process.env.APIKIT_SIGNING_SECRET = "x".repeat(64);
  });
  it("round-trips a payload", async () => {
    const t = await signToken({ providerId: "openai", keyTail: "1234" });
    expect(t).toBeTruthy();
    const decoded = await verifyToken<{ providerId: string; keyTail: string }>(t!);
    expect(decoded?.providerId).toBe("openai");
    expect(decoded?.keyTail).toBe("1234");
  });
  it("returns null when secret missing", async () => {
    process.env.APIKIT_SIGNING_SECRET = "";
    const t = await signToken({ x: 1 });
    expect(t).toBeNull();
  });
});
