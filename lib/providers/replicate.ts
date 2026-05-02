import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

async function accountRaw(key: string, signal?: AbortSignal) {
  return safeFetch("https://api.replicate.com/v1/account", {
    headers: { Authorization: `Bearer ${key}` },
    signal,
  });
}

const adapter: ProviderAdapter = {
  id: "replicate",
  name: "Replicate",
  slug: "replicate",
  tagline: "Run open-source models with one HTTP call.",
  keyPattern: /^r8_[A-Za-z0-9]{30,}$/,
  keyExample: "r8_••••••••••••••••••••••",
  docsUrl: "https://replicate.com/docs",
  consoleUrl: "https://replicate.com/account/api-tokens",
  statusPageUrl: "https://www.replicatestatus.com",
  pricingUrl: "https://replicate.com/pricing",
  categories: ["chat", "image", "audio", "open-source"],

  async validateKey(key, opts): Promise<ValidationResult> {
    try {
      const res = await accountRaw(key, opts?.signal);
      if (res.ok) return { status: "valid", httpStatus: res.status };
      return {
        status: res.status === 401 || res.status === 403 ? "invalid" : "unknown",
        httpStatus: res.status,
        fix: fixFromStatus(res.status),
      };
    } catch {
      return { status: "network_error", message: "Could not reach Replicate." };
    }
  },

  async listModels(key, opts): Promise<ModelInfo[]> {
    const res = await safeFetch("https://api.replicate.com/v1/collections/featured-models", {
      headers: { Authorization: `Bearer ${key}` },
      signal: opts?.signal,
    });
    if (!res.ok) return [];
    const data = (await res.json()) as { models?: Array<{ owner: string; name: string }> };
    return (data.models ?? []).map((m) => ({
      id: `${m.owner}/${m.name}`,
      capabilities: ["chat"],
    }));
  },

  async benchmarkLatency(key, samples = 5, opts): Promise<LatencyStats> {
    return bench((signal) => accountRaw(key, signal), samples, { signal: opts?.signal });
  },

  snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
    const model = exampleModel || "meta/meta-llama-3-70b-instruct";
    return {
      curl: `curl https://api.replicate.com/v1/models/${model}/predictions \\
  -H "Authorization: Bearer ${redactedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"input": {"prompt": ${JSON.stringify(prompt)}}}'`,
      python: `import replicate
client = replicate.Client(api_token="${redactedKey}")
out = client.run("${model}", input={"prompt": ${JSON.stringify(prompt)}})
print("".join(out))`,
      nodeFetch: `const res = await fetch("https://api.replicate.com/v1/models/${model}/predictions", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${redactedKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ input: { prompt: ${JSON.stringify(prompt)} } }),
});
console.log(await res.json());`,
      jsAxios: `import axios from "axios";
const { data } = await axios.post(
  "https://api.replicate.com/v1/models/${model}/predictions",
  { input: { prompt: ${JSON.stringify(prompt)} } },
  { headers: { Authorization: "Bearer ${redactedKey}" } }
);
console.log(data);`,
    };
  },
};

export default adapter;
