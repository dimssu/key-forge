import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

const BASE = "https://generativelanguage.googleapis.com/v1beta";

async function listModelsRaw(key: string, signal?: AbortSignal) {
  return safeFetch(`${BASE}/models?key=${encodeURIComponent(key)}`, {
    headers: { "Content-Type": "application/json" },
    signal,
  });
}

const adapter: ProviderAdapter = {
  id: "gemini",
  name: "Google Gemini",
  slug: "gemini",
  tagline: "Gemini 2.0 Pro, Flash, embeddings.",
  keyPattern: /^AIza[0-9A-Za-z_-]{35}$/,
  keyExample: "AIza••••••••••••••••••••••••••••••••",
  docsUrl: "https://ai.google.dev/gemini-api/docs",
  consoleUrl: "https://aistudio.google.com/app/apikey",
  statusPageUrl: "https://status.cloud.google.com",
  pricingUrl: "https://ai.google.dev/pricing",
  categories: ["chat", "embedding", "vision"],

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
      return { status: "network_error", message: "Could not reach Google AI." };
    }
  },

  async listModels(key, opts): Promise<ModelInfo[]> {
    const res = await listModelsRaw(key, opts?.signal);
    if (!res.ok) return [];
    const data = (await res.json()) as {
      models?: Array<{
        name: string;
        displayName?: string;
        inputTokenLimit?: number;
        supportedGenerationMethods?: string[];
      }>;
    };
    return (data.models ?? []).map((m) => ({
      id: m.name.replace(/^models\//, ""),
      name: m.displayName,
      context: m.inputTokenLimit,
      capabilities: (m.supportedGenerationMethods ?? []).flatMap<
        NonNullable<ModelInfo["capabilities"]>[number]
      >((e) => {
        if (e === "generateContent") return ["chat"];
        if (e === "embedContent") return ["embedding"];
        return [];
      }),
    }));
  },

  async *streamTest(key, prompt, opts) {
    const model = opts?.model ?? "gemini-2.0-flash";
    const res = await safeFetch(
      `${BASE}/models/${model}:streamGenerateContent?alt=sse&key=${encodeURIComponent(key)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ role: "user", parts: [{ text: prompt }] }] }),
        signal: opts?.signal,
        timeoutMs: 60_000,
      }
    );
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
            candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
          };
          const text = json.candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("") ?? "";
          if (text) yield text;
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
    const model = exampleModel || "gemini-2.0-flash";
    return {
      curl: `curl "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${redactedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"contents": [{"parts": [{"text": ${JSON.stringify(prompt)}}]}]}'`,
      python: `from google import genai
client = genai.Client(api_key="${redactedKey}")
resp = client.models.generate_content(model="${model}", contents=${JSON.stringify(prompt)})
print(resp.text)`,
      nodeFetch: `const url = "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${redactedKey}";
const res = await fetch(url, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ contents: [{ parts: [{ text: ${JSON.stringify(prompt)} }] }] }),
});
const data = await res.json();
console.log(data.candidates[0].content.parts[0].text);`,
      jsAxios: `import axios from "axios";
const { data } = await axios.post(
  "https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${redactedKey}",
  { contents: [{ parts: [{ text: ${JSON.stringify(prompt)} }] }] }
);
console.log(data.candidates[0].content.parts[0].text);`,
    };
  },
};

export default adapter;
