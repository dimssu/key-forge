import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  QuotaInfo,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

const BASE = "https://api.openai.com/v1";

async function listModelsRaw(key: string, signal?: AbortSignal) {
  return safeFetch(`${BASE}/models`, {
    headers: { Authorization: `Bearer ${key}` },
    signal,
  });
}

const adapter: ProviderAdapter = {
  id: "openai",
  name: "OpenAI",
  slug: "openai",
  tagline: "GPT-4o, o1, embeddings, DALL·E.",
  keyPattern: /^sk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{20,}$/,
  keyExample: "sk-proj-•••••••••••••••••••",
  docsUrl: "https://platform.openai.com/docs/api-reference",
  consoleUrl: "https://platform.openai.com/api-keys",
  statusPageUrl: "https://status.openai.com",
  pricingUrl: "https://openai.com/api/pricing",
  categories: ["chat", "embedding", "image", "audio", "vision"],

  async validateKey(key, opts): Promise<ValidationResult> {
    try {
      const res = await listModelsRaw(key, opts?.signal);
      if (res.ok) return { status: "valid", httpStatus: res.status };
      if (res.status === 429) {
        return { status: "rate_limited", httpStatus: 429, fix: fixFromStatus(429) };
      }
      return {
        status: res.status === 401 || res.status === 403 ? "invalid" : "unknown",
        httpStatus: res.status,
        message: `OpenAI returned ${res.status}.`,
        fix: fixFromStatus(res.status),
      };
    } catch {
      return { status: "network_error", message: "Could not reach OpenAI." };
    }
  },

  async listModels(key, opts): Promise<ModelInfo[]> {
    const res = await listModelsRaw(key, opts?.signal);
    if (!res.ok) return [];
    const data = (await res.json()) as { data?: Array<{ id: string; owned_by?: string }> };
    return (data.data ?? []).map((m) => ({
      id: m.id,
      capabilities: inferCapabilities(m.id),
    }));
  },

  async fetchQuota(_key): Promise<QuotaInfo | null> {
    // OpenAI removed the public dashboard billing endpoints. Return null and let UI explain.
    return null;
  },

  async *streamTest(key, prompt, opts) {
    const model = opts?.model ?? "gpt-4o-mini";
    const res = await safeFetch(`${BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
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
      const lines = buf.split("\n");
      buf = lines.pop() ?? "";
      for (const line of lines) {
        if (!line.startsWith("data: ")) continue;
        const payload = line.slice(6).trim();
        if (payload === "[DONE]") return;
        try {
          const json = JSON.parse(payload) as {
            choices?: Array<{ delta?: { content?: string } }>;
          };
          const chunk = json.choices?.[0]?.delta?.content;
          if (chunk) yield chunk;
        } catch {
          /* ignore malformed line */
        }
      }
    }
  },

  async benchmarkLatency(key, samples = 5, opts): Promise<LatencyStats> {
    return bench((signal) => listModelsRaw(key, signal), samples, { signal: opts?.signal });
  },

  snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
    const model = exampleModel || "gpt-4o-mini";
    return {
      curl: `curl https://api.openai.com/v1/chat/completions \\
  -H "Authorization: Bearer ${redactedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [{"role": "user", "content": ${JSON.stringify(prompt)}}]
  }'`,
      python: `from openai import OpenAI
client = OpenAI(api_key="${redactedKey}")
resp = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": ${JSON.stringify(prompt)}}],
)
print(resp.choices[0].message.content)`,
      nodeFetch: `const res = await fetch("https://api.openai.com/v1/chat/completions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${redactedKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model: "${model}",
    messages: [{ role: "user", content: ${JSON.stringify(prompt)} }],
  }),
});
const data = await res.json();
console.log(data.choices[0].message.content);`,
      jsAxios: `import axios from "axios";
const { data } = await axios.post(
  "https://api.openai.com/v1/chat/completions",
  {
    model: "${model}",
    messages: [{ role: "user", content: ${JSON.stringify(prompt)} }],
  },
  { headers: { Authorization: "Bearer ${redactedKey}" } }
);
console.log(data.choices[0].message.content);`,
    };
  },
};

function inferCapabilities(id: string): NonNullable<ModelInfo["capabilities"]> {
  const c: NonNullable<ModelInfo["capabilities"]> = [];
  if (id.startsWith("gpt-") || id.startsWith("o1") || id.startsWith("o3") || id.startsWith("chatgpt"))
    c.push("chat");
  if (id.includes("embedding")) c.push("embedding");
  if (id.startsWith("dall-e") || id.startsWith("gpt-image")) c.push("image");
  if (id.includes("whisper") || id.includes("tts")) c.push("audio");
  if (id.includes("vision") || id.startsWith("gpt-4o")) c.push("vision");
  return c;
}

export default adapter;
