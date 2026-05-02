import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

async function whoamiRaw(key: string, signal?: AbortSignal) {
  return safeFetch("https://huggingface.co/api/whoami-v2", {
    headers: { Authorization: `Bearer ${key}` },
    signal,
  });
}

const adapter: ProviderAdapter = {
  id: "huggingface",
  name: "Hugging Face",
  slug: "huggingface",
  tagline: "Inference API + Inference Endpoints.",
  keyPattern: /^hf_[A-Za-z0-9]{20,}$/,
  keyExample: "hf_••••••••••••••••••••••",
  docsUrl: "https://huggingface.co/docs/api-inference",
  consoleUrl: "https://huggingface.co/settings/tokens",
  statusPageUrl: "https://status.huggingface.co",
  pricingUrl: "https://huggingface.co/pricing",
  categories: ["chat", "embedding", "image", "audio", "open-source"],

  async validateKey(key, opts): Promise<ValidationResult> {
    try {
      const res = await whoamiRaw(key, opts?.signal);
      if (res.ok) return { status: "valid", httpStatus: res.status };
      return {
        status: res.status === 401 || res.status === 403 ? "invalid" : "unknown",
        httpStatus: res.status,
        fix: fixFromStatus(res.status),
      };
    } catch {
      return { status: "network_error", message: "Could not reach Hugging Face." };
    }
  },

  async listModels(_key): Promise<ModelInfo[]> {
    // HF surfaces hundreds of thousands of models — enumerating is impractical.
    // Surface a curated handful so the UI stays useful; users can call any model id.
    return [
      { id: "meta-llama/Llama-3.1-8B-Instruct", capabilities: ["chat"] },
      { id: "meta-llama/Llama-3.3-70B-Instruct", capabilities: ["chat"] },
      { id: "mistralai/Mistral-7B-Instruct-v0.3", capabilities: ["chat"] },
      { id: "Qwen/Qwen2.5-72B-Instruct", capabilities: ["chat"] },
      { id: "BAAI/bge-large-en-v1.5", capabilities: ["embedding"] },
      { id: "stabilityai/stable-diffusion-xl-base-1.0", capabilities: ["image"] },
      { id: "openai/whisper-large-v3", capabilities: ["audio"] },
    ];
  },

  async benchmarkLatency(key, samples = 5, opts): Promise<LatencyStats> {
    return bench((signal) => whoamiRaw(key, signal), samples, { signal: opts?.signal });
  },

  snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
    const model = exampleModel || "meta-llama/Llama-3.1-8B-Instruct";
    return {
      curl: `curl https://api-inference.huggingface.co/models/${model} \\
  -H "Authorization: Bearer ${redactedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"inputs": ${JSON.stringify(prompt)}}'`,
      python: `from huggingface_hub import InferenceClient
client = InferenceClient(token="${redactedKey}")
print(client.text_generation(${JSON.stringify(prompt)}, model="${model}"))`,
      nodeFetch: `const res = await fetch("https://api-inference.huggingface.co/models/${model}", {
  method: "POST",
  headers: {
    "Authorization": "Bearer ${redactedKey}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ inputs: ${JSON.stringify(prompt)} }),
});
console.log(await res.json());`,
      jsAxios: `import axios from "axios";
const { data } = await axios.post(
  "https://api-inference.huggingface.co/models/${model}",
  { inputs: ${JSON.stringify(prompt)} },
  { headers: { Authorization: "Bearer ${redactedKey}" } }
);
console.log(data);`,
    };
  },
};

export default adapter;
