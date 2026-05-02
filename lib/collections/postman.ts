import type { ProviderAdapter } from "../providers/_types";

/**
 * Generate a Postman v2.1 collection scaffold for a given provider.
 * The auth header is parameterized so you can paste your real key in Postman.
 */
export function postmanCollection(adapter: ProviderAdapter) {
  return {
    info: {
      _postman_id: cryptoUUID(),
      name: `${adapter.name} (APIKit)`,
      description: `Validate, list models, and run a sample chat for the ${adapter.name} API.`,
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    auth: {
      type: "bearer",
      bearer: [{ key: "token", value: "{{API_KEY}}", type: "string" }],
    },
    variable: [{ key: "API_KEY", value: "" }],
    item: [
      {
        name: "List models",
        request: {
          method: "GET",
          header: [],
          url: { raw: `${baseFor(adapter)}/models`, host: [baseFor(adapter)], path: ["models"] },
        },
      },
    ],
  };
}

function baseFor(adapter: ProviderAdapter): string {
  switch (adapter.id) {
    case "openai":
      return "https://api.openai.com/v1";
    case "anthropic":
      return "https://api.anthropic.com/v1";
    case "groq":
      return "https://api.groq.com/openai/v1";
    case "openrouter":
      return "https://openrouter.ai/api/v1";
    case "perplexity":
      return "https://api.perplexity.ai";
    case "deepseek":
      return "https://api.deepseek.com/v1";
    case "xai":
      return "https://api.x.ai/v1";
    case "fireworks":
      return "https://api.fireworks.ai/inference/v1";
    case "together":
      return "https://api.together.xyz/v1";
    case "mistral":
      return "https://api.mistral.ai/v1";
    case "cohere":
      return "https://api.cohere.com/v1";
    case "gemini":
      return "https://generativelanguage.googleapis.com/v1beta";
    case "huggingface":
      return "https://huggingface.co/api";
    case "replicate":
      return "https://api.replicate.com/v1";
    case "azure-openai":
      return "https://YOUR-RESOURCE.openai.azure.com/openai";
    case "bedrock":
      return "https://bedrock.us-east-1.amazonaws.com";
    case "ollama":
      return "http://localhost:11434/api";
    default:
      return "";
  }
}

function cryptoUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
