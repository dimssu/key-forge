import type { ProviderAdapter } from "./_types";
import { makeOpenAICompatAdapter } from "./_openai-compat";

const compat = makeOpenAICompatAdapter({
  base: "https://api.perplexity.ai",
  defaultModel: "sonar",
  modelMap: () => ({ capabilities: ["chat"] }),
});

const adapter: ProviderAdapter = {
  id: "perplexity",
  name: "Perplexity",
  slug: "perplexity",
  tagline: "Sonar online search-augmented chat.",
  keyPattern: /^pplx-[A-Za-z0-9]{32,}$/,
  keyExample: "pplx-•••••••••••••••••••••",
  docsUrl: "https://docs.perplexity.ai",
  consoleUrl: "https://www.perplexity.ai/settings/api",
  pricingUrl: "https://docs.perplexity.ai/guides/pricing",
  categories: ["chat"],
  ...compat,
  // Perplexity does not currently expose /models — override listModels with a static fallback.
  async listModels() {
    return [
      { id: "sonar", capabilities: ["chat"] as const },
      { id: "sonar-pro", capabilities: ["chat"] as const },
      { id: "sonar-reasoning", capabilities: ["chat"] as const },
      { id: "sonar-reasoning-pro", capabilities: ["chat"] as const },
    ].map((m) => ({ id: m.id, capabilities: [...m.capabilities] }));
  },
};

export default adapter;
