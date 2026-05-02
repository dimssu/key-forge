import type { ProviderAdapter } from "../providers/_types";

/**
 * Generate a Bruno-flavored export. Bruno uses .bru files in a folder; we return
 * a single `bruno.json` that the user can drop into a folder and run `bru open`.
 */
export function brunoExport(adapter: ProviderAdapter) {
  return {
    version: "1",
    name: `${adapter.name} (APIKit)`,
    type: "collection",
    items: [
      {
        type: "http",
        name: "List models",
        request: {
          url: `${baseFor(adapter)}/models`,
          method: "GET",
          headers: headers(adapter),
        },
      },
    ],
    environments: [
      {
        name: "default",
        variables: [{ name: "API_KEY", value: "", enabled: true, secret: true }],
      },
    ],
  };
}

function baseFor(adapter: ProviderAdapter): string {
  if (adapter.id === "gemini") return "https://generativelanguage.googleapis.com/v1beta";
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

function headers(adapter: ProviderAdapter) {
  if (adapter.id === "anthropic")
    return [
      { name: "x-api-key", value: "{{API_KEY}}" },
      { name: "anthropic-version", value: "2023-06-01" },
    ];
  if (adapter.id === "azure-openai") return [{ name: "api-key", value: "{{API_KEY}}" }];
  if (adapter.id === "gemini" || adapter.id === "ollama") return [];
  return [{ name: "Authorization", value: "Bearer {{API_KEY}}" }];
}
