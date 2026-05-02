import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/csv";

describe("toCsv", () => {
  it("emits a header row + UTF-8 body", () => {
    const out = toCsv([{ a: 1, b: "x" }]);
    expect(out).toContain("a,b\r\n");
    expect(out).toContain("1,x\r\n");
  });

  it("escapes commas, quotes, and newlines", () => {
    const out = toCsv([{ a: 'he said "hi", and waved\n' }]);
    expect(out).toContain('"he said ""hi"", and waved\n"');
  });
});
