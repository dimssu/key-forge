import type { ProviderAdapter } from "./_types";
import { makeOpenAICompatAdapter } from "./_openai-compat";

const compat = makeOpenAICompatAdapter({
  base: "https://api.x.ai/v1",
  defaultModel: "grok-2-latest",
  modelMap: () => ({ capabilities: ["chat"] }),
});

const adapter: ProviderAdapter = {
  id: "xai",
  name: "xAI",
  slug: "xai",
  tagline: "Grok-2 and Grok-2-vision.",
  keyPattern: /^xai-[A-Za-z0-9]{20,}$/,
  keyExample: "xai-••••••••••••••••••••••",
  docsUrl: "https://docs.x.ai/api",
  consoleUrl: "https://console.x.ai",
  pricingUrl: "https://docs.x.ai/api#pricing",
  categories: ["chat", "vision"],
  ...compat,
};

export default adapter;
