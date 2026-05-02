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

  it("detectProvider routes unambiguous prefixes to the correct adapter", () => {
    const cases: Array<[string, string]> = [
      [`sk-ant-api03-${"x".repeat(80)}`, "anthropic"],
      [`sk-or-v1-${"x".repeat(48)}`, "openrouter"],
      [`gsk_${"x".repeat(48)}`, "groq"],
      [`pplx-${"x".repeat(48)}`, "perplexity"],
      [`xai-${"x".repeat(48)}`, "xai"],
      [`fw_${"x".repeat(48)}`, "fireworks"],
      [`hf_${"x".repeat(40)}`, "huggingface"],
      [`r8_${"x".repeat(40)}`, "replicate"],
      [`AIza${"a".repeat(35)}`, "gemini"],
      [`sk-proj-${"x".repeat(48)}`, "openai"],
      ['{"endpoint":"https://x.openai.azure.com","apiKey":"x"}', "azure-openai"],
      ['{"accessKeyId":"AKIAFOO","secretAccessKey":"bar"}', "bedrock"],
      ["http://localhost:11434", "ollama"],
    ];
    for (const [probe, expected] of cases) {
      expect(detectProvider(probe)?.id, probe).toBe(expected);
    }
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
