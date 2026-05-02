import type { ProviderAdapter } from "./_types";
import { makeOpenAICompatAdapter } from "./_openai-compat";

const compat = makeOpenAICompatAdapter({
  base: "https://api.fireworks.ai/inference/v1",
  defaultModel: "accounts/fireworks/models/llama-v3p1-8b-instruct",
  modelMap: () => ({ capabilities: ["chat"] }),
});

const adapter: ProviderAdapter = {
  id: "fireworks",
  name: "Fireworks AI",
  slug: "fireworks",
  tagline: "Fast inference for OSS models.",
  keyPattern: /^fw_[A-Za-z0-9]{20,}$/,
  keyExample: "fw_••••••••••••••••••••••",
  docsUrl: "https://docs.fireworks.ai",
  consoleUrl: "https://fireworks.ai/account/api-keys",
  pricingUrl: "https://fireworks.ai/pricing",
  categories: ["chat", "embedding", "open-source"],
  ...compat,
};

export default adapter;
