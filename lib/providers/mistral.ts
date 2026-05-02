import type { ProviderAdapter } from "./_types";
import { makeOpenAICompatAdapter } from "./_openai-compat";

const compat = makeOpenAICompatAdapter({
  base: "https://api.mistral.ai/v1",
  defaultModel: "mistral-small-latest",
  modelMap: (id) => ({
    capabilities: id.includes("embed") ? ["embedding"] : ["chat"],
  }),
});

const adapter: ProviderAdapter = {
  id: "mistral",
  name: "Mistral",
  slug: "mistral",
  tagline: "Mistral Large, Codestral, embeddings.",
  keyPattern: /^[A-Za-z0-9]{32,}$/,
  keyExample: "•••••••••••••••••••••••••••••••• (32+ chars)",
  docsUrl: "https://docs.mistral.ai",
  consoleUrl: "https://console.mistral.ai/api-keys",
  statusPageUrl: "https://status.mistral.ai",
  pricingUrl: "https://mistral.ai/technology/#pricing",
  categories: ["chat", "embedding"],
  ...compat,
};

export default adapter;
