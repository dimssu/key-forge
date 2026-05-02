import type { ProviderAdapter } from "./_types";
import { makeOpenAICompatAdapter } from "./_openai-compat";

const compat = makeOpenAICompatAdapter({
  base: "https://api.groq.com/openai/v1",
  defaultModel: "llama-3.3-70b-versatile",
  modelMap: () => ({ capabilities: ["chat"] }),
});

const adapter: ProviderAdapter = {
  id: "groq",
  name: "Groq",
  slug: "groq",
  tagline: "LPU-accelerated Llama, Mixtral, Whisper.",
  keyPattern: /^gsk_[A-Za-z0-9]{40,}$/,
  keyExample: "gsk_•••••••••••••••••••••••",
  docsUrl: "https://console.groq.com/docs",
  consoleUrl: "https://console.groq.com/keys",
  statusPageUrl: "https://groqstatus.com",
  pricingUrl: "https://groq.com/pricing",
  categories: ["chat", "audio"],
  ...compat,
};

export default adapter;
