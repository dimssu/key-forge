import type {
  LatencyStats,
  ModelInfo,
  ProviderAdapter,
  ProviderSnippet,
  SnippetParams,
  ValidationResult,
} from "./_types";
import { bench, fixFromStatus, safeFetch } from "./_helpers";

export interface OpenAICompatConfig {
  base: string;
  modelMap?: (id: string) => Pick<ModelInfo, "capabilities">;
  defaultModel: string;
  curlHostHeader?: string;
}

/**
 * Build a ProviderAdapter shell for any provider that exposes an OpenAI-compatible
 * /v1/models + /v1/chat/completions surface with `Authorization: Bearer ${key}`.
 *
 * Callers supply their own static fields (id, name, slug, etc.) and can override
 * any method post-spread.
 */
export function makeOpenAICompatAdapter(
  cfg: OpenAICompatConfig
): Pick<
  ProviderAdapter,
  "validateKey" | "listModels" | "streamTest" | "benchmarkLatency" | "snippets"
> {
  async function listRaw(key: string, signal?: AbortSignal) {
    return safeFetch(`${cfg.base}/models`, {
      headers: { Authorization: `Bearer ${key}` },
      signal,
    });
  }

  return {
    async validateKey(key, opts): Promise<ValidationResult> {
      try {
        const res = await listRaw(key, opts?.signal);
        if (res.ok) return { status: "valid", httpStatus: res.status };
        if (res.status === 429)
          return { status: "rate_limited", httpStatus: 429, fix: fixFromStatus(429) };
        return {
          status: res.status === 401 || res.status === 403 ? "invalid" : "unknown",
          httpStatus: res.status,
          fix: fixFromStatus(res.status),
        };
      } catch {
        return { status: "network_error", message: "Could not reach the upstream." };
      }
    },

    async listModels(key, opts): Promise<ModelInfo[]> {
      const res = await listRaw(key, opts?.signal);
      if (!res.ok) return [];
      const data = (await res.json()) as { data?: Array<{ id: string }> };
      return (data.data ?? []).map((m) => ({
        id: m.id,
        ...(cfg.modelMap?.(m.id) ?? {}),
      }));
    },

    async *streamTest(key, prompt, opts) {
      const model = opts?.model ?? cfg.defaultModel;
      const res = await safeFetch(`${cfg.base}/chat/completions`, {
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
            /* ignore */
          }
        }
      }
    },

    async benchmarkLatency(key, samples = 5, opts): Promise<LatencyStats> {
      return bench((signal) => listRaw(key, signal), samples, { signal: opts?.signal });
    },

    snippets({ redactedKey, exampleModel, prompt }: SnippetParams): ProviderSnippet {
      const model = exampleModel || cfg.defaultModel;
      return {
        curl: `curl ${cfg.base}/chat/completions \\
  -H "Authorization: Bearer ${redactedKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "${model}",
    "messages": [{"role": "user", "content": ${JSON.stringify(prompt)}}]
  }'`,
        python: `from openai import OpenAI
client = OpenAI(api_key="${redactedKey}", base_url="${cfg.base}")
resp = client.chat.completions.create(
    model="${model}",
    messages=[{"role": "user", "content": ${JSON.stringify(prompt)}}],
)
print(resp.choices[0].message.content)`,
        nodeFetch: `const res = await fetch("${cfg.base}/chat/completions", {
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
  "${cfg.base}/chat/completions",
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
}
