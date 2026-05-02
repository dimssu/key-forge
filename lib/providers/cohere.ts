import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

const BASE = "https://api.cohere.com/v1";

async function listModelsRaw(key: string, signal?: AbortSignal) {
  return safeFetch(`${BASE}/models`, {
    headers: { Authorization: `Bearer ${key}` },
    signal,
  });
}

const adapter: ProviderAdapter = {
  id: "cohere",
  name: "Cohere",
  slug: "cohere",
  tagline: "Command-R chat, rerank, embed.",
  keyPattern: /^[A-Za-z0-9]{40}$/,
  keyExample: "•••••••••••••••••••••••••••••••••••••••• (40 chars)",
  docsUrl: "https://docs.cohere.com",
  consoleUrl: "https://dashboard.cohere.com/api-keys",
  statusPageUrl: "https://status.cohere.com",
  pricingUrl: "https://cohere.com/pricing",
  categories: ["chat", "embedding"],

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
      return { status: "network_error", message: "Could not reach Cohere." };
    }
  },

  async listModels(key, opts): Promise<ModelInfo[]> {
    const res = await listModelsRaw(key, opts?.signal);
    if (!res.ok) return [];
    const data = (await res.json()) as { models?: Array<{ name: string; endpoints?: string[] }> };
    return (data.models ?? []).map((m) => ({
      id: m.name,
      capabilities: (m.endpoints ?? []).flatMap<NonNullable<ModelInfo["capabilities"]>[number]>((e) => {
        if (e === "chat" || e === "generate") return ["chat"];
        if (e === "embed") return ["embedding"];
        return [];
      }),
    }));
  },

  async benchmarkLatency(key, samples = 5, opts): Promise<LatencyStats> {
    return bench((signal) => listModelsRaw(key, signal), samples, { signal: opts?.signal });
  },

  snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
    const model = exampleModel || "command-r";
    return {
      curl: `curl https://api.cohere.com/v1/chat \\
  -H "Authorization: Bearer ${redactedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${model}", "message": ${JSON.stringify(prompt)}}'`,
      python: `import cohere
co = cohere.Client("${redactedKey}")
resp = co.chat(model="${model}", message=${JSON.stringify(prompt)})
print(resp.text)`,
      nodeFetch: `const res = await fetch("https://api.cohere.com/v1/chat", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${redactedKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ model: "${model}", message: ${JSON.stringify(prompt)} }),
});
const data = await res.json();
console.log(data.text);`,
      jsAxios: `import axios from "axios";
const { data } = await axios.post(
  "https://api.cohere.com/v1/chat",
  { model: "${model}", message: ${JSON.stringify(prompt)} },
  { headers: { Authorization: "Bearer ${redactedKey}" } }
);
console.log(data.text);`,
    };
  },
};

export default adapter;
