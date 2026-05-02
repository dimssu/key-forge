import type { ProviderAdapter, QuotaInfo } from "./_types";
import { makeOpenAICompatAdapter } from "./_openai-compat";
import { safeFetch } from "./_helpers";

const compat = makeOpenAICompatAdapter({
  base: "https://openrouter.ai/api/v1",
  defaultModel: "openai/gpt-4o-mini",
  modelMap: () => ({ capabilities: ["chat"] }),
});

const adapter: ProviderAdapter = {
  id: "openrouter",
  name: "OpenRouter",
  slug: "openrouter",
  tagline: "One API, every model.",
  keyPattern: /^sk-or-(?:v1-)?[A-Za-z0-9]{32,}$/,
  keyExample: "sk-or-v1-•••••••••••••••••••",
  docsUrl: "https://openrouter.ai/docs",
  consoleUrl: "https://openrouter.ai/keys",
  statusPageUrl: "https://status.openrouter.ai",
  pricingUrl: "https://openrouter.ai/models",
  categories: ["chat", "vision", "open-source"],
  ...compat,
  async fetchQuota(key, opts): Promise<QuotaInfo | null> {
    const res = await safeFetch("https://openrouter.ai/api/v1/credits", {
      headers: { Authorization: `Bearer ${key}` },
      signal: opts?.signal,
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { total_credits?: number; total_usage?: number } };
    if (!json.data) return null;
    return {
      hardLimit: json.data.total_credits,
      used: json.data.total_usage,
      currency: "USD",
      raw: json.data,
    };
  },
};

export default adapter;
