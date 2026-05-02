import type { ProviderAdapter } from "../providers/_types";

/** Generate an Insomnia v4 export bundle (single workspace + request). */
export function insomniaExport(adapter: ProviderAdapter) {
  const wsId = `wrk_${rand()}`;
  const reqId = `req_${rand()}`;
  return {
    _type: "export",
    __export_format: 4,
    __export_date: new Date().toISOString(),
    __export_source: "keyforge",
    resources: [
      {
        _id: wsId,
        _type: "workspace",
        name: `${adapter.name} (KeyForge)`,
        scope: "collection",
      },
      {
        _id: reqId,
        _type: "request",
        parentId: wsId,
        name: "List models",
        method: "GET",
        url: requestUrl(adapter),
        headers: headers(adapter),
      },
    ],
  };
}

function requestUrl(adapter: ProviderAdapter): string {
  if (adapter.id === "gemini")
    return "https://generativelanguage.googleapis.com/v1beta/models?key={{ API_KEY }}";
  return `${urlFor(adapter)}/models`;
}

function headers(adapter: ProviderAdapter) {
  if (adapter.id === "anthropic")
    return [
      { name: "x-api-key", value: "{{ API_KEY }}" },
      { name: "anthropic-version", value: "2023-06-01" },
    ];
  if (adapter.id === "azure-openai") return [{ name: "api-key", value: "{{ API_KEY }}" }];
  if (adapter.id === "gemini" || adapter.id === "ollama") return [];
  return [{ name: "Authorization", value: "Bearer {{ API_KEY }}" }];
}

function urlFor(adapter: ProviderAdapter): string {
  const m: Record<string, string> = {
    openai: "https://api.openai.com/v1",
    anthropic: "https://api.anthropic.com/v1",
    groq: "https://api.groq.com/openai/v1",
    openrouter: "https://openrouter.ai/api/v1",
    perplexity: "https://api.perplexity.ai",
    deepseek: "https://api.deepseek.com/v1",
    xai: "https://api.x.ai/v1",
    fireworks: "https://api.fireworks.ai/inference/v1",
    together: "https://api.together.xyz/v1",
    mistral: "https://api.mistral.ai/v1",
    cohere: "https://api.cohere.com/v1",
    huggingface: "https://huggingface.co/api",
    replicate: "https://api.replicate.com/v1",
    "azure-openai": "https://YOUR-RESOURCE.openai.azure.com/openai",
    bedrock: "https://bedrock.us-east-1.amazonaws.com",
    ollama: "http://localhost:11434/api",
  };
  return m[adapter.id] ?? "";
}

function rand(): string {
  return Math.random().toString(36).slice(2, 12);
}
