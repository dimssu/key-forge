import type { ProviderAdapter } from "./_types";
import { makeOpenAICompatAdapter } from "./_openai-compat";

const compat = makeOpenAICompatAdapter({
  base: "https://api.together.xyz/v1",
  defaultModel: "meta-llama/Meta-Llama-3.1-8B-Instruct-Turbo",
  modelMap: (id) => ({
    capabilities: id.toLowerCase().includes("embed")
      ? ["embedding"]
      : id.toLowerCase().includes("flux") || id.toLowerCase().includes("image")
        ? ["image"]
        : ["chat"],
  }),
});

const adapter: ProviderAdapter = {
  id: "together",
  name: "Together AI",
  slug: "together",
  tagline: "200+ open-source models, fast.",
  keyPattern: /^[A-Fa-f0-9]{64}$/,
  keyExample: "•••••••••••••••••••••••••••••••• (64 hex chars)",
  docsUrl: "https://docs.together.ai",
  consoleUrl: "https://api.together.xyz/settings/api-keys",
  pricingUrl: "https://www.together.ai/pricing",
  categories: ["chat", "embedding", "image", "open-source"],
  ...compat,
};

export default adapter;
