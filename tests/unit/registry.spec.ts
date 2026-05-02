import { describe, expect, it } from "vitest";
import { providers, getProvider, getProviderBySlug, detectProvider } from "@/lib/providers/_registry";
import type { ProviderAdapter } from "@/lib/providers/_types";

describe("provider registry", () => {
  it("exports all 17 supported providers", () => {
    expect(providers).toHaveLength(17);
  });

  it("every provider satisfies the adapter contract", () => {
    for (const p of providers) {
      const required: Array<keyof ProviderAdapter> = [
        "id",
        "name",
        "slug",
        "tagline",
        "keyPattern",
        "keyExample",
        "docsUrl",
        "consoleUrl",
        "validateKey",
        "listModels",
        "benchmarkLatency",
        "snippets",
      ];
      for (const k of required) {
        expect(p[k], `${p.id} missing ${String(k)}`).toBeDefined();
      }
    }
  });

  it("uses unique ids and slugs", () => {
    const ids = providers.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
    const slugs = providers.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("getProvider and getProviderBySlug both find each adapter", () => {
    for (const p of providers) {
      expect(getProvider(p.id)?.id).toBe(p.id);
      expect(getProviderBySlug(p.slug)?.id).toBe(p.id);
    }
  });

  it("detectProvider matches each adapter's keyExample for non-host-based adapters", () => {
    for (const p of providers) {
      if (p.hostBased) continue;
      const probe = `${p.keyExample.split("•")[0]}${"a".repeat(64)}`;
      const detected = detectProvider(probe);
      expect(detected, `no detection for ${p.id} probe ${probe.slice(0, 12)}…`).toBeDefined();
    }
  });

  it("paste-detect is most-specific first (anthropic before openai)", () => {
    const ant = `sk-ant-api03-${"x".repeat(80)}`;
    expect(detectProvider(ant)?.id).toBe("anthropic");
  });

  it("snippets generator returns all four shapes for every provider", () => {
    for (const p of providers) {
      const s = p.snippets({ redactedKey: "***", exampleModel: "", prompt: "hi" });
      expect(s.curl, p.id).toBeTruthy();
      expect(s.python, p.id).toBeTruthy();
      expect(s.nodeFetch, p.id).toBeTruthy();
      expect(s.jsAxios, p.id).toBeTruthy();
    }
  });
});
