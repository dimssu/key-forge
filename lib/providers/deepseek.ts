import type { ProviderAdapter } from "./_types";
import { makeOpenAICompatAdapter } from "./_openai-compat";

const compat = makeOpenAICompatAdapter({
  base: "https://api.deepseek.com/v1",
  defaultModel: "deepseek-chat",
  modelMap: () => ({ capabilities: ["chat"] }),
});

const adapter: ProviderAdapter = {
  id: "deepseek",
  name: "DeepSeek",
  slug: "deepseek",
  tagline: "DeepSeek-V3 chat and coder.",
  keyPattern: /^sk-[A-Za-z0-9]{20,}$/,
  keyExample: "sk-•••••••••••••••••••",
  docsUrl: "https://api-docs.deepseek.com",
  consoleUrl: "https://platform.deepseek.com/api_keys",
  statusPageUrl: "https://status.deepseek.com",
  pricingUrl: "https://api-docs.deepseek.com/quick_start/pricing",
  categories: ["chat"],
  ...compat,
};

export default adapter;
