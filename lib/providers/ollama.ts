import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, safeFetch } from "./_helpers";

function normaliseHost(host: string): string {
  if (!host) return "http://localhost:11434";
  if (!/^https?:\/\//i.test(host)) host = `http://${host}`;
  return host.replace(/\/+$/, "");
}

const adapter: ProviderAdapter = {
  id: "ollama",
  name: "Ollama",
  slug: "ollama",
  tagline: "Run open-source models locally, no key.",
  keyPattern: /^https?:\/\/.+/,
  keyExample: "http://localhost:11434",
  docsUrl: "https://github.com/ollama/ollama/blob/main/docs/api.md",
  consoleUrl: "https://ollama.com/download",
  pricingUrl: "https://ollama.com",
  categories: ["chat", "embedding", "open-source"],
  hostBased: true,

  async validateKey(host, opts): Promise<ValidationResult> {
    const base = normaliseHost(host);
    try {
      const res = await safeFetch(`${base}/api/tags`, { signal: opts?.signal });
      if (res.ok) return { status: "valid", httpStatus: res.status };
      return {
        status: "unknown",
        httpStatus: res.status,
        message: "Reached the host but it did not respond like Ollama.",
      };
    } catch {
      return { status: "network_error", message: "Could not reach the Ollama host." };
    }
  },

  async listModels(host, opts): Promise<ModelInfo[]> {
    const base = normaliseHost(host);
    const res = await safeFetch(`${base}/api/tags`, { signal: opts?.signal });
    if (!res.ok) return [];
    const data = (await res.json()) as {
      models?: Array<{ name: string; details?: { parameter_size?: string } }>;
    };
    return (data.models ?? []).map((m) => ({
      id: m.name,
      name: m.details?.parameter_size ? `${m.name} (${m.details.parameter_size})` : m.name,
      capabilities: ["chat"],
    }));
  },

  async benchmarkLatency(host, samples = 5, opts): Promise<LatencyStats> {
    const base = normaliseHost(host);
    return bench((signal) => safeFetch(`${base}/api/tags`, { signal }), samples, {
      signal: opts?.signal,
    });
  },

  snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
    const host = redactedKey || "http://localhost:11434";
    const model = exampleModel || "llama3.2";
    return {
      curl: `curl ${host}/api/generate \\
  -H "Content-Type: application/json" \\
  -d '{"model": "${model}", "prompt": ${JSON.stringify(prompt)}, "stream": false}'`,
      python: `import requests
resp = requests.post("${host}/api/generate",
    json={"model": "${model}", "prompt": ${JSON.stringify(prompt)}, "stream": False})
print(resp.json()["response"])`,
      nodeFetch: `const res = await fetch("${host}/api/generate", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ model: "${model}", prompt: ${JSON.stringify(prompt)}, stream: false }),
});
const data = await res.json();
console.log(data.response);`,
      jsAxios: `import axios from "axios";
const { data } = await axios.post(
  "${host}/api/generate",
  { model: "${model}", prompt: ${JSON.stringify(prompt)}, stream: false }
);
console.log(data.response);`,
    };
  },
};

export default adapter;
