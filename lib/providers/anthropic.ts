import type { LatencyStats, ModelInfo, ProviderAdapter, ProviderSnippet, SnippetParams, ValidationResult } from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

const BASE = "https://api.anthropic.com/v1";
const VERSION = "2023-06-01";

async function listModelsRaw(key: string, signal?: AbortSignal) {
  return safeFetch(`${BASE}/models`, {
    headers: { "x-api-key": key, "anthropic-version": VERSION },
    signal,
  });
}

const adapter: ProviderAdapter = {
  id: "anthropic",
  name: "Anthropic",
  slug: "anthropic",
  tagline: "Claude Opus, Sonnet, Haiku.",
  keyPattern: /^sk-ant-(?:api\d{2}-)?[A-Za-z0-9_-]{40,}$/,
  keyExample: "sk-ant-api03-•••••••••••••••",
  docsUrl: "https://docs.anthropic.com/en/api",
  consoleUrl: "https://console.anthropic.com/settings/keys",
  statusPageUrl: "https://status.anthropic.com",
  pricingUrl: "https://www.anthropic.com/pricing#anthropic-api",
  categories: ["chat", "vision"],

  async validateKey(key, opts): Promise<ValidationResult> {
    try {
      const res = await listModelsRaw(key, opts?.signal);
      if (res.ok) return { status: "valid", httpStatus: res.status };
      if (res.status === 429)
        return { status: "rate_limited", httpStatus: 429, fix: fixFromStatus(429) };
      return {
        status: res.status === 401 || res.status === 403 ? "invalid" : "unknown",
        httpStatus: res.status,
        fix: fixFromStatus(res.status),
      };
    } catch {
      return { status: "network_error", message: "Could not reach Anthropic." };
    }
  },

  async listModels(key, opts): Promise<ModelInfo[]> {
    const res = await listModelsRaw(key, opts?.signal);
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: Array<{ id: string; display_name?: string }> };
    return (data.data ?? []).map((m) => ({
      id: m.id,
      name: m.display_name,
      capabilities: ["chat", "vision"],
    }));
  },

  async *streamTest(key, prompt, opts) {
    const model = opts?.model ?? "claude-haiku-4-5-20251001";
    const res = await safeFetch(`${BASE}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": key,
        "anthropic-version": VERSION,
      },
      body: JSON.stringify({
        model,
        max_tokens: 256,
        stream: true,
        messages: [{ role: "user", content: prompt }],
      }),
      signal: opts?.signal,
      timeoutMs: 60_000,
    });
    if (!res.ok || !res.body) return;
    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let buf = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });
      const events = buf.split("\n\n");
      buf = events.pop() ?? "";
      for (const e of events) {
        const dataLine = e.split("\n").find((l) => l.startsWith("data: "));
        if (!dataLine) continue;
        try {
          const json = JSON.parse(dataLine.slice(6)) as {
            type?: string;
            delta?: { text?: string };
          };
          if (json.type === "content_block_delta" && json.delta?.text) yield json.delta.text;
        } catch {
          /* ignore */
        }
      }
    }
  },

  async benchmarkLatency(key, samples = 5, opts): Promise<LatencyStats> {
    return bench((signal) => listModelsRaw(key, signal), samples, { signal: opts?.signal });
  },

  snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
    const model = exampleModel || "claude-haiku-4-5-20251001";
    return {
      curl: `curl https://api.anthropic.com/v1/messages \\
  -H "x-api-key: ${redactedKey}" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "max_tokens": 256,
    "messages": [{"role": "user", "content": ${JSON.stringify(prompt)}}]
  }'`,
      python: `from anthropic import Anthropic
client = Anthropic(api_key="${redactedKey}")
msg = client.messages.create(
    model="${model}",
    max_tokens=256,
    messages=[{"role": "user", "content": ${JSON.stringify(prompt)}}],
)
print(msg.content[0].text)`,
      nodeFetch: `const res = await fetch("https://api.anthropic.com/v1/messages", {
  method: "POST",
  headers: {
    "x-api-key": "${redactedKey}",
    "anthropic-version": "2023-06-01",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "${model}",
    max_tokens: 256,
    messages: [{ role: "user", content: ${JSON.stringify(prompt)} }],
  }),
});
const data = await res.json();
console.log(data.content[0].text);`,
      jsAxios: `import axios from "axios";
const { data } = await axios.post(
  "https://api.anthropic.com/v1/messages",
  {
    model: "${model}",
    max_tokens: 256,
    messages: [{ role: "user", content: ${JSON.stringify(prompt)} }],
  },
  {
    headers: {
      "x-api-key": "${redactedKey}",
      "anthropic-version": "2023-06-01",
    },
  }
);
console.log(data.content[0].text);`,
    };
  },
};

export default adapter;
