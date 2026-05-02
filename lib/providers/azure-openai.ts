import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

interface AzureCompositeKey {
  endpoint: string; // e.g. "https://my-resource.openai.azure.com"
  apiKey: string;
  apiVersion?: string;
}

function parse(key: string): AzureCompositeKey | null {
  // Composite credential is a JSON-encoded {endpoint, apiKey, apiVersion?} string in the header.
  try {
    const obj = JSON.parse(key) as AzureCompositeKey;
    if (!obj || typeof obj.endpoint !== "string" || typeof obj.apiKey !== "string") return null;
    return { ...obj, endpoint: obj.endpoint.replace(/\/+$/, "") };
  } catch {
    return null;
  }
}

async function listDeploymentsRaw(
  c: AzureCompositeKey,
  signal?: AbortSignal
): Promise<Response | null> {
  const ver = c.apiVersion ?? "2024-10-21";
  return safeFetch(`${c.endpoint}/openai/deployments?api-version=${ver}`, {
    headers: { "api-key": c.apiKey },
    signal,
  });
}

const adapter: ProviderAdapter = {
  id: "azure-openai",
  name: "Azure OpenAI",
  slug: "azure-openai",
  tagline: "OpenAI models on Azure infrastructure.",
  keyPattern: /^\{.*"endpoint".*"apiKey".*\}$/s,
  keyExample: '{"endpoint":"https://you.openai.azure.com","apiKey":"…","apiVersion":"2024-10-21"}',
  docsUrl: "https://learn.microsoft.com/en-us/azure/ai-services/openai/reference",
  consoleUrl: "https://portal.azure.com",
  statusPageUrl: "https://azure.status.microsoft",
  pricingUrl: "https://azure.microsoft.com/en-us/pricing/details/cognitive-services/openai-service",
  categories: ["chat", "embedding", "vision"],

  async validateKey(key, opts): Promise<ValidationResult> {
    const c = parse(key);
    if (!c) return { status: "invalid", message: "Credential must be JSON with endpoint + apiKey." };
    try {
      const res = await listDeploymentsRaw(c, opts?.signal);
      if (!res) return { status: "network_error" };
      if (res.ok) return { status: "valid", httpStatus: res.status };
      return {
        status: res.status === 401 || res.status === 403 ? "invalid" : "unknown",
        httpStatus: res.status,
        fix: fixFromStatus(res.status),
      };
    } catch {
      return { status: "network_error", message: "Could not reach Azure OpenAI." };
    }
  },

  async listModels(key, opts): Promise<ModelInfo[]> {
    const c = parse(key);
    if (!c) return [];
    const res = await listDeploymentsRaw(c, opts?.signal);
    if (!res || !res.ok) return [];
    const data = (await res.json()) as { data?: Array<{ id: string; model?: string }> };
    return (data.data ?? []).map((d) => ({
      id: d.id,
      name: d.model ? `${d.id} → ${d.model}` : d.id,
      capabilities: ["chat"],
    }));
  },

  async benchmarkLatency(key, samples = 5, opts): Promise<LatencyStats> {
    const c = parse(key);
    if (!c) return { samples: [], p50: 0, p95: 0, p99: 0, mean: 0, min: 0, max: 0 };
    return bench((signal) => listDeploymentsRaw(c, signal).then((r) => r!), samples, {
      signal: opts?.signal,
    });
  },

  snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
    const model = exampleModel || "gpt-4o";
    return {
      curl: `curl https://YOUR-RESOURCE.openai.azure.com/openai/deployments/${model}/chat/completions?api-version=2024-10-21 \\
  -H "api-key: ${redactedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"messages": [{"role": "user", "content": ${JSON.stringify(prompt)}}]}'`,
      python: `from openai import AzureOpenAI
client = AzureOpenAI(api_key="${redactedKey}", api_version="2024-10-21",
                     azure_endpoint="https://YOUR-RESOURCE.openai.azure.com")
resp = client.chat.completions.create(model="${model}",
    messages=[{"role": "user", "content": ${JSON.stringify(prompt)}}])
print(resp.choices[0].message.content)`,
      nodeFetch: `const res = await fetch(
  "https://YOUR-RESOURCE.openai.azure.com/openai/deployments/${model}/chat/completions?api-version=2024-10-21",
  {
    method: "POST",
    headers: { "api-key": "${redactedKey}", "Content-Type": "application/json" },
    body: JSON.stringify({ messages: [{ role: "user", content: ${JSON.stringify(prompt)} }] }),
  }
);
console.log(await res.json());`,
      jsAxios: `import axios from "axios";
const { data } = await axios.post(
  "https://YOUR-RESOURCE.openai.azure.com/openai/deployments/${model}/chat/completions?api-version=2024-10-21",
  { messages: [{ role: "user", content: ${JSON.stringify(prompt)} }] },
  { headers: { "api-key": "${redactedKey}" } }
);
console.log(data);`,
    };
  },
};

export default adapter;
