import { GUIDES, type GuideMeta } from "./guides";
import type { ProviderId } from "./providers/_types";

export interface ProviderContent {
  lede: string;
  whatItDoes: string;
  howToGet: string[];
  commonErrors: Array<{ code: string; fix: string }>;
  security: string[];
  pricing?: string;
  faqs: Array<{ q: string; a: string }>;
  relatedGuides: GuideMeta[];
}

const guides = (slugs: string[]) => GUIDES.filter((g) => slugs.includes(g.slug));

const baseSecurity = [
  "Store keys in an env var or secret manager — never commit them to a repo, even a private one.",
  "Restrict scope: prefer per-project or per-deployment keys over a single root key shared across services.",
  "Rotate on a schedule (90 days is a sane default) and immediately on suspected leak.",
  "Audit usage in the provider console after rotation to confirm the old key has zero traffic.",
  "Set per-key spend limits where the provider supports them, so a leaked key has a bounded blast radius.",
];

const baseErrors = [
  { code: "401 Unauthorized", fix: "Key is invalid, revoked, or pasted with extra whitespace. Generate a new key from the provider console and try again." },
  { code: "403 Forbidden", fix: "Key is valid but lacks permission for this resource. Check project / org / workspace scope, or that billing is set up for this key." },
  { code: "429 Too Many Requests", fix: "You hit the per-minute or per-day rate limit. Wait a moment and retry, or upgrade your tier." },
  { code: "404 Not Found", fix: "The endpoint or model id changed. Check the provider docs for the current path and model identifier." },
  { code: "5xx", fix: "The provider is having issues. Check their status page before assuming the bug is yours." },
];

const content: Record<ProviderId, ProviderContent> = {
  openai: {
    lede: "Verify an OpenAI key in seconds, see which GPT-4o, o1, embedding, and DALL·E models you can call, and benchmark how fast OpenAI is responding to you right now.",
    whatItDoes:
      "An OpenAI API key authenticates requests to OpenAI's REST API — chat completions, the Responses API, embeddings, image generation, audio transcription, and the moderation endpoint. Keys can be project-scoped or attached to a service account; both work the same way over the wire (Authorization: Bearer ...). Calling /v1/models is the cheapest way to confirm a key is alive without spending tokens.",
    howToGet: [
      "Sign in at platform.openai.com and switch to the project you want this key tied to.",
      "Open Settings → API keys and click Create new secret key.",
      "Choose a permission scope (Restricted is safer than All) and a project.",
      "Copy the key — you only see it once — and paste it here to confirm it works.",
      "Set a usage cap on the project so a leaked key has a bounded blast radius.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "OpenAI bills per-million tokens for chat models and per-image for DALL·E. GPT-4o-mini is the cheapest reasoning-capable chat model in the catalog. Batch API requests are 50% off list price; cached input tokens are billed at a steep discount. See the live pricing page for current numbers.",
    faqs: [
      {
        q: "How do I know if my OpenAI key is valid?",
        a: "Paste it above. We call /v1/models with your key and report status, the list of models the key can access, and round-trip latency.",
      },
      {
        q: "Does my key get logged anywhere?",
        a: "No. The proxy forwards the key once, returns the response, and discards it. We do not log headers, request bodies, or the key value.",
      },
      {
        q: "Can I tell if my key is a project key vs a user key?",
        a: "Project keys start with sk-proj-. Service account keys start with sk-svcacct-. Plain sk-... keys are legacy user keys (still supported for now).",
      },
      {
        q: "Why don't I see GPT-4o in my models list?",
        a: "GPT-4o is gated by tier. New accounts can call gpt-4o-mini immediately; gpt-4o-full and o1 unlock once you've spent a small amount or topped up.",
      },
      {
        q: "Is there a free tier?",
        a: "OpenAI gives short-lived starter credits to new accounts. They expire after a few months. After that you pay-as-you-go.",
      },
      {
        q: "How fast should an OpenAI key respond?",
        a: "GET /v1/models typically returns under 300ms from a healthy region. Our latency benchmark runs 5 pings and reports p50 / p95 / p99 so you can spot regional slowdowns.",
      },
      {
        q: "Why do I see a 401 even though the key is correct?",
        a: "Whitespace. Paste-from-Slack and paste-from-1Password sometimes wrap the key in a zero-width character. Try retyping the last few chars or pasting into a plain text editor first.",
      },
    ],
    relatedGuides: guides(["how-to-get-an-openai-api-key", "api-key-security-best-practices", "openai-vs-anthropic-pricing"]),
  },
  anthropic: {
    lede: "Verify a Claude key, see which Opus / Sonnet / Haiku models it can call, and time the round trip — without burning tokens on a real message.",
    whatItDoes:
      "An Anthropic API key authenticates against the Messages API (Opus / Sonnet / Haiku across the Claude 4 line), the streaming endpoint, and the prompt caching feature. The key uses the x-api-key header (not Bearer) and the anthropic-version header is required. Calling /v1/models is the cheapest validation path.",
    howToGet: [
      "Sign in at console.anthropic.com.",
      "Open Settings → API Keys and click Create Key.",
      "Pick the workspace this key should belong to. Workspaces let you split production from dev.",
      "Copy the key (shown once) and paste it here to confirm it works.",
      "Set a per-workspace spend limit before issuing the key to anyone — including yourself.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "Anthropic bills per million input/output tokens, with prompt caching giving a 90% discount on cached input tokens. Sonnet is the price/performance pick for most workloads; Haiku is the cheap-and-fast lane; Opus is the heavy-reasoning tier. The Batch API gives a flat 50% off.",
    faqs: [
      {
        q: "What's the difference between an Anthropic API key and a Claude.ai login?",
        a: "Different products. Claude.ai is the consumer chat. The API key authenticates against the Anthropic platform and is what you'd use from your code.",
      },
      {
        q: "Why does my key need workspaces?",
        a: "Workspaces let you set spend caps and rate limits per environment. Production should always be in its own workspace with its own key.",
      },
      {
        q: "Does Anthropic have a free tier?",
        a: "Anthropic offers small starter credits on signup. They expire. After that it's pay-as-you-go.",
      },
      {
        q: "What's the latest Claude model?",
        a: "As of early 2026, Claude Opus 4.7 is the flagship; Sonnet 4.6 and Haiku 4.5 cover the price/performance and speed tiers. Always pull /v1/models to see the current set tied to your key.",
      },
      {
        q: "How do I enable prompt caching?",
        a: "Set cache_control breakpoints in the message content. Cache hits are billed at ~10% of normal input cost.",
      },
      {
        q: "Why is my key returning 403 even though it's valid?",
        a: "Workspace permission. The key may be valid but tied to a workspace that has no model access enabled. Check the workspace settings.",
      },
    ],
    relatedGuides: guides(["how-to-get-an-anthropic-api-key", "api-key-security-best-practices", "openai-vs-anthropic-pricing"]),
  },
  gemini: {
    lede: "Verify a Google Gemini API key from AI Studio in seconds — see which Gemini 2.0 / 2.5 models the key has access to, and benchmark the latency.",
    whatItDoes:
      "A Gemini API key authenticates against Google's Generative Language API: generateContent, streamGenerateContent, embedContent, and the count-tokens helper. Keys are passed as a query parameter (?key=AIza...) rather than a header. Free-tier keys talk to the same endpoints, just with stricter rate limits.",
    howToGet: [
      "Open aistudio.google.com/app/apikey.",
      "Click Create API key, choose the Cloud project, and approve the consent screen.",
      "Copy the AIza... key.",
      "Paste it here. We'll list the models accessible to your project.",
      "If you plan to ship to production, link a billing account — free-tier rate limits will not be enough.",
    ],
    commonErrors: baseErrors,
    security: [
      ...baseSecurity,
      "Restrict the key in the GCP console to the Generative Language API only — IAM lets you scope a key to specific Google APIs.",
    ],
    pricing:
      "Gemini Flash is among the cheapest production-grade chat models on the market. Pro is priced higher but offers a much larger context window. Free tier exists but has aggressive RPM caps; switching to a billed key is the difference between 15 RPM and 1000+ RPM on Flash.",
    faqs: [
      {
        q: "Is the AIza... key the same as a Google Cloud API key?",
        a: "Yes — Gemini keys are standard GCP API keys with the Generative Language API enabled. You can manage them from console.cloud.google.com.",
      },
      {
        q: "Why does my Gemini key only work for a few requests then 429?",
        a: "Free-tier RPM caps. Link a billing account and the same key starts hitting paid-tier limits.",
      },
      {
        q: "Can I use the same key on AI Studio and Vertex AI?",
        a: "No. Vertex AI uses Google Cloud auth (service accounts / ADC), not API keys. The AIza key is AI Studio only.",
      },
      {
        q: "Which Gemini model should I default to?",
        a: "gemini-2.0-flash for cost-sensitive workloads, gemini-2.5-pro for long-context reasoning. Always pull the live model list to see what's enabled.",
      },
      {
        q: "Are responses safe to log?",
        a: "Be careful with safety attributes — they can leak prompt content. Strip them before logging.",
      },
      {
        q: "How is the latency from outside the US?",
        a: "Generative Language API is hosted in us-central1 by default. From APAC you'll see ~150-250ms extra. Vertex AI offers regional endpoints if that's a problem.",
      },
    ],
    relatedGuides: guides(["how-to-get-a-gemini-api-key", "api-key-security-best-practices", "free-llm-api-keys-for-testing"]),
  },
  mistral: {
    lede: "Validate a Mistral API key, list Mistral Large / Codestral / embedding models, and benchmark latency against the Paris-hosted endpoint.",
    whatItDoes:
      "A Mistral API key authenticates the la Plateforme REST API: chat completions, embeddings, fine-tunes, and Codestral. The wire protocol is OpenAI-compatible (Bearer auth, /v1/chat/completions shape) so SDKs that target OpenAI usually work with a base URL swap.",
    howToGet: [
      "Sign in at console.mistral.ai.",
      "Add a billing source if you haven't (free trial credits exist but burn fast).",
      "Open API Keys → Create new key.",
      "Copy the key and paste it here to validate.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "Mistral Small / Medium / Large are tiered roughly an order of magnitude apart. Codestral is priced for code workloads. Free tier exists but is heavily rate-limited.",
    faqs: [
      { q: "Does Mistral support streaming?", a: "Yes, via Server-Sent Events on /v1/chat/completions with stream:true." },
      { q: "Is Mistral OpenAI-compatible?", a: "Mostly. Swap the base URL to https://api.mistral.ai/v1 and the OpenAI Python/Node SDKs work for chat completions. Tool use shapes are slightly different." },
      { q: "Are my data sent to Mistral used for training?", a: "By default, paid-tier requests are not used for training. Free-tier requests may be — check the current data-usage policy." },
      { q: "What's the cheapest Mistral model?", a: "mistral-small-latest, then mistral-tiny / open-mistral-nemo if available on your account." },
      { q: "Where are Mistral keys hosted?", a: "Inference is currently EU-hosted, which is useful for GDPR-bound workloads." },
      { q: "Can I use Mistral on Vertex / Bedrock?", a: "Yes, several Mistral models are mirrored on AWS Bedrock and GCP. Those use the host platform's auth, not a Mistral API key." },
    ],
    relatedGuides: guides(["api-key-security-best-practices", "free-llm-api-keys-for-testing"]),
  },
  cohere: {
    lede: "Verify a Cohere API key, list Command-R / Embed / Rerank models the key can call, and benchmark the round trip.",
    whatItDoes:
      "A Cohere key authenticates the v1 Cohere API — Chat (Command-R / Command-R+), Embed, Rerank, and the classify and summarize endpoints. Auth is Bearer; the Chat shape is Cohere-specific (not OpenAI-compatible).",
    howToGet: [
      "Sign in at dashboard.cohere.com.",
      "Open API Keys and create a new trial or production key.",
      "Trial keys are free but rate-limited; production keys require billing.",
      "Paste the key here to confirm it works.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "Command-R is priced for high-throughput RAG. Embed is among the cheapest large-context embedding models. Rerank is billed per search query, not per token.",
    faqs: [
      { q: "What's the difference between trial and production keys?", a: "Trial keys are free but throttled and labeled as for evaluation only. Production keys hit standard pay-as-you-go pricing." },
      { q: "Is Cohere OpenAI-compatible?", a: "No. The Chat shape is different (uses message + chat_history, not messages[])." },
      { q: "Which Cohere endpoint is cheapest to call for validation?", a: "/v1/models. We use it for the latency benchmark and key validation here." },
      { q: "Does Cohere train on my data?", a: "Production-tier requests are not used for training by default. Trial keys are subject to the trial data policy — read it before sending sensitive prompts." },
      { q: "What's the cheapest Cohere chat model?", a: "command-r is the price/performance pick. command-r-plus is the heavy-reasoning tier." },
      { q: "Can I run Cohere models on AWS?", a: "Yes — several are mirrored on Bedrock with AWS-side billing." },
    ],
    relatedGuides: guides(["api-key-security-best-practices", "openai-vs-anthropic-pricing"]),
  },
  groq: {
    lede: "Verify a Groq API key, see which Llama / Mixtral / Whisper models you can call, and watch the LPU-class latency yourself.",
    whatItDoes:
      "Groq's API is OpenAI-compatible: same /v1/chat/completions shape, same Bearer auth. The differentiator is latency — Groq's LPU hardware regularly does 300+ tokens/s on Llama 3 / 3.3.",
    howToGet: [
      "Sign in at console.groq.com.",
      "Open API Keys → Create API Key.",
      "Copy the gsk_... key and paste it here.",
      "Free tier exists with daily token caps — useful for development.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "Groq's pay-as-you-go pricing is competitive on Llama-class models. The free tier is generous for prototyping but caps tokens-per-day per model.",
    faqs: [
      { q: "Is Groq OpenAI-compatible?", a: "Yes. Just swap base URL to https://api.groq.com/openai/v1 and the OpenAI SDKs work." },
      { q: "Why is Groq so much faster than other providers?", a: "Custom LPU silicon optimized for inference, plus aggressive batching." },
      { q: "Which models are on Groq?", a: "Llama 3 / 3.1 / 3.3 family, Mixtral, Gemma, Whisper for audio. The exact set rotates — pull /v1/models to see current." },
      { q: "Is there a free tier?", a: "Yes, with per-day token caps per model. Good enough for development." },
      { q: "Where is Groq hosted?", a: "Multiple US regions with global edge routing." },
      { q: "Does Groq support tool use / function calling?", a: "Yes, via the OpenAI-compatible tools field." },
    ],
    relatedGuides: guides(["llm-rate-limits-explained", "free-llm-api-keys-for-testing"]),
  },
  deepseek: {
    lede: "Validate a DeepSeek API key, list DeepSeek-Chat / Coder / Reasoner models, and benchmark latency.",
    whatItDoes:
      "DeepSeek's API is OpenAI-compatible. The current model list includes deepseek-chat (general) and deepseek-reasoner (chain-of-thought). Pricing is aggressively cheap for the capability tier.",
    howToGet: [
      "Sign in at platform.deepseek.com.",
      "Top up the account (DeepSeek requires a positive balance to issue keys).",
      "Create an API key and paste it here.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "DeepSeek is among the cheapest providers in the reasoning-class lane. Off-peak pricing offers an additional discount for batch-style workloads.",
    faqs: [
      { q: "Is DeepSeek OpenAI-compatible?", a: "Yes — base URL https://api.deepseek.com/v1." },
      { q: "What's the difference between deepseek-chat and deepseek-reasoner?", a: "Reasoner exposes chain-of-thought tokens and is priced higher. Chat is the general-purpose model." },
      { q: "Where is DeepSeek hosted?", a: "China-based infrastructure. Latency from outside Asia is noticeably higher." },
      { q: "Is there a free tier?", a: "Not in the standard sense — accounts need a positive balance to issue keys, but minimum top-up is small." },
      { q: "Can I use OpenAI's Python SDK with DeepSeek?", a: "Yes, just swap base_url and api_key." },
      { q: "Are there content policy differences?", a: "Yes, DeepSeek has its own content moderation. Some prompts that pass on US providers may be filtered." },
    ],
    relatedGuides: guides(["openai-vs-anthropic-pricing", "free-llm-api-keys-for-testing"]),
  },
  xai: {
    lede: "Test an xAI Grok API key, see Grok-2 / Grok-2-vision availability, and benchmark response latency.",
    whatItDoes:
      "xAI's API is OpenAI-compatible. Grok-2 is the current general-purpose model; Grok-2-vision adds image input. Tool use, streaming, and JSON mode are supported via the standard OpenAI shapes.",
    howToGet: [
      "Sign in at console.x.ai.",
      "Add a payment method.",
      "Create a key in the API Keys section.",
      "Paste it here to validate.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing: "xAI is mid-tier on price for chat. Image input is billed separately.",
    faqs: [
      { q: "Is xAI OpenAI-compatible?", a: "Yes — base URL https://api.x.ai/v1." },
      { q: "What's grok-beta?", a: "An older beta model — prefer grok-2-latest unless you've pinned to it." },
      { q: "Does xAI support real-time search like Grok on X?", a: "The 'live search' preview is gated and not on by default for API keys." },
      { q: "Which model has vision?", a: "grok-2-vision-latest." },
      { q: "Is there a free tier?", a: "Promotional credits have come and gone. Don't depend on free tier in production." },
      { q: "Can I stream from xAI?", a: "Yes, via the OpenAI-compatible stream:true on /v1/chat/completions." },
    ],
    relatedGuides: guides(["api-key-security-best-practices", "free-llm-api-keys-for-testing"]),
  },
  perplexity: {
    lede: "Validate a Perplexity API key and confirm you can call the Sonar online-search models.",
    whatItDoes:
      "Perplexity's API is OpenAI-compatible. The Sonar model family does retrieval-augmented chat using Perplexity's index. Citations come back as part of the response.",
    howToGet: [
      "Sign in at perplexity.ai/settings/api.",
      "Add a payment method (the API requires it).",
      "Create a key starting with pplx-.",
      "Paste it here.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "Sonar is billed per request plus per token. Sonar Pro is more expensive but includes deeper search.",
    faqs: [
      { q: "What's the Sonar model family?", a: "Perplexity-tuned Llama / Mistral with built-in retrieval over Perplexity's index." },
      { q: "Is Perplexity OpenAI-compatible?", a: "Yes — base URL https://api.perplexity.ai." },
      { q: "Are sources returned in the response?", a: "Yes — there's a citations array alongside the chat response." },
      { q: "Can I disable search?", a: "No — Sonar is search-augmented by design. For pure chat use a different provider." },
      { q: "What's sonar-reasoning?", a: "A chain-of-thought variant trained for multi-step retrieval reasoning." },
      { q: "Is there a free tier?", a: "No public free tier on the API; pay-as-you-go from the start." },
    ],
    relatedGuides: guides(["api-key-security-best-practices", "openai-vs-anthropic-pricing"]),
  },
  together: {
    lede: "Validate a Together AI API key and see which of the 200+ open-source models your account can run.",
    whatItDoes:
      "Together hosts open-source models behind an OpenAI-compatible API: Llama, Mixtral, Qwen, Flux, and many more. Per-token pricing varies by model size.",
    howToGet: [
      "Sign in at api.together.xyz.",
      "Open Settings → API Keys.",
      "Generate a key (64 hex chars).",
      "Paste it here.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing: "Together prices per million tokens scaled by model size. Llama 3.1 8B is among the cheapest production-grade chat options on the market.",
    faqs: [
      { q: "Is Together OpenAI-compatible?", a: "Yes — base URL https://api.together.xyz/v1." },
      { q: "Which models can I run?", a: "200+ open-source models, including image (Flux) and embedding. Pull /v1/models to see your account's current set." },
      { q: "Does Together support fine-tuning?", a: "Yes, via the fine-tuning endpoints." },
      { q: "Are dedicated endpoints available?", a: "Yes — you can pin a model to a dedicated GPU for predictable latency." },
      { q: "Free tier?", a: "Promotional credits exist but expire." },
      { q: "Can I run Flux image models?", a: "Yes, with a separate per-image price." },
    ],
    relatedGuides: guides(["free-llm-api-keys-for-testing", "openai-vs-anthropic-pricing"]),
  },
  fireworks: {
    lede: "Validate a Fireworks AI key and see which open-source chat / embedding / image models you can call.",
    whatItDoes:
      "Fireworks runs open-source models with custom inference optimizations. API is OpenAI-compatible. Models live under accounts/fireworks/models/...",
    howToGet: [
      "Sign in at fireworks.ai.",
      "Open Account → API Keys.",
      "Generate a fw_... key.",
      "Paste it here.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing: "Fireworks competes with Together / Groq on open-source pricing.",
    faqs: [
      { q: "Is Fireworks OpenAI-compatible?", a: "Yes — base URL https://api.fireworks.ai/inference/v1." },
      { q: "Why are model ids so long?", a: "They're scoped to accounts: accounts/fireworks/models/llama-v3p1-8b-instruct." },
      { q: "Does Fireworks support fine-tuning?", a: "Yes, including LoRAs." },
      { q: "Free tier?", a: "Promotional credits, no permanent free tier." },
      { q: "How fast is Fireworks vs Groq?", a: "Groq generally wins on Llama at low concurrency. Fireworks scales smoothly to higher concurrency." },
      { q: "Can I deploy my own model?", a: "Yes, via on-demand deployment." },
    ],
    relatedGuides: guides(["free-llm-api-keys-for-testing", "llm-rate-limits-explained"]),
  },
  openrouter: {
    lede: "Validate an OpenRouter key and see your credit balance plus the catalogue of models routed through one API.",
    whatItDoes:
      "OpenRouter is a routing layer over OpenAI, Anthropic, Google, Meta, Mistral, and dozens of others. One key, one shape, one bill. Useful for fallback and price comparison.",
    howToGet: [
      "Sign in at openrouter.ai.",
      "Top up credits or attach a card.",
      "Create a key starting with sk-or-v1-.",
      "Paste it here. We'll also pull your remaining balance.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "OpenRouter passes through provider pricing with a thin markup. The savings come from automatic fallback and the ability to A/B between providers without touching code.",
    faqs: [
      { q: "Why not just call providers directly?", a: "Two reasons: one bill across all providers, and fallback / price routing without writing the orchestration yourself." },
      { q: "Is OpenRouter OpenAI-compatible?", a: "Yes — base URL https://openrouter.ai/api/v1." },
      { q: "How is privacy handled?", a: "OpenRouter does not log prompt content by default. Some upstream providers may have their own logging — check OpenRouter's per-provider settings." },
      { q: "Does it support streaming?", a: "Yes, on every model that the underlying provider streams." },
      { q: "Can I see my credit balance?", a: "Yes — the validation pulls /v1/credits and we show your remaining balance and total spend." },
      { q: "What model identifiers do I use?", a: "vendor/model — e.g. openai/gpt-4o, anthropic/claude-3.5-sonnet, google/gemini-2.5-pro." },
    ],
    relatedGuides: guides(["openai-vs-anthropic-pricing", "free-llm-api-keys-for-testing"]),
  },
  "azure-openai": {
    lede: "Validate Azure OpenAI credentials (endpoint + api-key + api-version) and list deployments.",
    whatItDoes:
      "Azure OpenAI runs OpenAI's models on Azure infrastructure. Auth is api-key header instead of Bearer; routes are scoped to your resource and a deployment id, not a model id directly. The validator here accepts a JSON-encoded composite credential.",
    howToGet: [
      "Open the Azure portal and find your Azure OpenAI resource.",
      "Under Keys and Endpoint, copy KEY 1 and the endpoint URL.",
      "Pick an API version (2024-10-21 is a stable current default).",
      "Paste a JSON object here: {\"endpoint\":\"…\",\"apiKey\":\"…\",\"apiVersion\":\"2024-10-21\"}.",
    ],
    commonErrors: [
      ...baseErrors,
      { code: "404 Deployment not found", fix: "The model id you're calling must be the deployment name from your Azure resource, not the OpenAI model name." },
    ],
    security: baseSecurity,
    pricing:
      "Azure OpenAI mirrors OpenAI's per-million-token pricing with provisioned throughput options for predictable QoS. Billing flows through your Azure subscription.",
    faqs: [
      { q: "Why does Azure use api-key instead of Bearer?", a: "Legacy choice from Cognitive Services. The OpenAI SDK abstracts this difference." },
      { q: "What's an api-version for?", a: "Pins the request shape. Azure releases new versions as OpenAI ships features; old ones are deprecated on a schedule." },
      { q: "Can I use the same key on Azure and OpenAI direct?", a: "No, they're separate auth systems." },
      { q: "Why does my deployment 404?", a: "You're calling a model id, not a deployment name. Azure routes via deployment names you assign." },
      { q: "Is Entra ID auth supported?", a: "Yes — token-based auth is preferred for production. The simple api-key path is fine for testing." },
      { q: "Where can I check usage?", a: "Azure cost analysis, scoped to the resource." },
    ],
    relatedGuides: guides(["api-key-security-best-practices", "openai-vs-anthropic-pricing"]),
  },
  bedrock: {
    lede: "Validate AWS access keys against Bedrock and list the foundation models your account has access to.",
    whatItDoes:
      "Bedrock hosts Anthropic, Meta, Cohere, Mistral, Amazon Titan, and AI21 models behind AWS SigV4-signed HTTP. Auth is an AWS access key ID + secret (and optional session token), region-scoped. Paste them as a JSON composite here.",
    howToGet: [
      "Sign in to the AWS console.",
      "IAM → create a user with the AmazonBedrockFullAccess (or scoped) policy.",
      "Generate an access key for that user.",
      "Request access to the specific Bedrock models you want to use (some require approval).",
      "Paste {\"accessKeyId\":\"…\",\"secretAccessKey\":\"…\",\"region\":\"us-east-1\"} here.",
    ],
    commonErrors: [
      ...baseErrors,
      { code: "AccessDeniedException", fix: "Either the IAM policy doesn't grant Bedrock or the model isn't enabled in this region. Check both." },
    ],
    security: [
      ...baseSecurity,
      "Prefer short-lived STS credentials over long-lived IAM access keys for Bedrock production traffic.",
    ],
    pricing:
      "Bedrock pricing mirrors the underlying provider, billed through AWS. Provisioned throughput is available for predictable latency and discounted bulk pricing.",
    faqs: [
      { q: "Why does Bedrock need region?", a: "Models are deployed per region. us-east-1 has the broadest catalog; ap-northeast-1 / eu-central-1 have growing subsets." },
      { q: "Why does my key validate but list zero models?", a: "Each Bedrock model needs to be opted in via the console (Model access page). The model exists but your account hasn't enabled it yet." },
      { q: "Is the Bedrock body shape the same as Anthropic direct?", a: "Almost — anthropic_version becomes \"bedrock-2023-05-31\" instead of the date string Anthropic direct uses." },
      { q: "Can I use the AWS SDK to call Bedrock?", a: "Yes, that's the recommended path. The SigV4 signing here is a manual workaround for browser/edge environments without the SDK." },
      { q: "Does Bedrock support streaming?", a: "Yes, via InvokeModelWithResponseStream." },
      { q: "How do I scope an IAM policy to one model?", a: "Use the bedrock:InvokeModel resource ARN with the foundation-model arn including the model id." },
    ],
    relatedGuides: guides(["api-key-security-best-practices", "rotating-api-keys-safely"]),
  },
  huggingface: {
    lede: "Validate a Hugging Face token, confirm whoami, and run a quick benchmark against the inference endpoint.",
    whatItDoes:
      "Hugging Face tokens authenticate against the Inference API (free, rate-limited, hundreds of thousands of models) and Inference Endpoints (your own dedicated GPUs). Tokens can be read, write, or fine-grained.",
    howToGet: [
      "Sign in at huggingface.co/settings/tokens.",
      "Click New token.",
      "Pick a fine-grained token with Inference API permissions.",
      "Copy the hf_... token and paste it here.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "Inference API is free with rate limits; Inference Endpoints are billed by GPU/hour. Pro accounts get higher rate limits.",
    faqs: [
      { q: "What's the difference between Inference API and Inference Endpoints?", a: "API is shared, free, throttled. Endpoints are dedicated GPUs you spin up and pay for." },
      { q: "Why does my token 503?", a: "Cold start. The first call to a model on the Inference API triggers a load. Retry after a few seconds." },
      { q: "Read vs write vs fine-grained?", a: "Read: download models. Write: push. Fine-grained: scoped permissions. For inference, read or fine-grained is enough." },
      { q: "How do I list models I can call?", a: "There are 500k+ — enumerating is impractical. Use the HF Hub search UI to find models, then call by id." },
      { q: "Free rate limits?", a: "Roughly a few hundred requests per hour per user. Pro accounts get higher caps." },
      { q: "Can I run multimodal models?", a: "Yes — image, audio, video models are all callable via the Inference API." },
    ],
    relatedGuides: guides(["free-llm-api-keys-for-testing", "api-key-security-best-practices"]),
  },
  replicate: {
    lede: "Validate a Replicate API token and benchmark the round trip against api.replicate.com.",
    whatItDoes:
      "Replicate runs open-source models behind a uniform HTTP API. Auth is Bearer with an r8_... token. Models are referenced as owner/name; predictions are async by default with a callback / polling pattern.",
    howToGet: [
      "Sign in at replicate.com.",
      "Open Account → API Tokens.",
      "Generate a token starting with r8_.",
      "Paste it here.",
    ],
    commonErrors: baseErrors,
    security: baseSecurity,
    pricing:
      "Replicate bills per second of GPU time. Different models run on different hardware tiers (T4, A40, A100, H100) with different per-second rates.",
    faqs: [
      { q: "Are predictions sync or async?", a: "Async by default — POST returns a prediction id you poll. Some smaller models support sync via Prefer: wait header." },
      { q: "How do I list available models?", a: "Replicate has tens of thousands. Use the featured-models collection or browse replicate.com/explore." },
      { q: "Can I run my own model?", a: "Yes — push a Cog image and it becomes an endpoint." },
      { q: "Free tier?", a: "Sign-up credits exist; no permanent free tier." },
      { q: "Does Replicate support webhooks?", a: "Yes — set webhook on the prediction and get a POST when it finishes." },
      { q: "Can I cancel a prediction?", a: "Yes, via the cancel endpoint." },
    ],
    relatedGuides: guides(["api-key-security-best-practices", "free-llm-api-keys-for-testing"]),
  },
  ollama: {
    lede: "Confirm your local Ollama host is reachable and list the models you've pulled.",
    whatItDoes:
      "Ollama is a local model runner — no API key. Auth is just network reachability to the host (usually localhost:11434). Use this page to confirm the daemon is up and your model is loaded.",
    howToGet: [
      "Install Ollama from ollama.com/download.",
      "Pull a model: ollama pull llama3.2.",
      "By default the daemon listens on http://localhost:11434.",
      "Paste your host URL here. For remote Ollama set OLLAMA_HOST=0.0.0.0:11434 and use the LAN IP.",
    ],
    commonErrors: [
      { code: "ECONNREFUSED", fix: "The daemon isn't running. Start ollama serve or open the Ollama desktop app." },
      { code: "404 model not found", fix: "Pull the model first: ollama pull <model>." },
      { code: "Timeout", fix: "Cold model load can take 30+ seconds for large models. Re-run after the first request loads it into memory." },
    ],
    security: [
      "Don't expose Ollama on a public IP without a reverse proxy + auth.",
      "If you must allow LAN access, restrict the listen address to a specific interface.",
      "Pulled models live on disk in ~/.ollama — treat that directory like any other code dependency.",
    ],
    pricing: "Free — you pay for the hardware.",
    faqs: [
      { q: "Why no API key?", a: "Ollama is a local runtime. Network reachability is the auth boundary." },
      { q: "Can I use OpenAI's SDK with Ollama?", a: "Yes — Ollama exposes an OpenAI-compatible /v1/chat/completions on the same port." },
      { q: "How do I expose Ollama to other machines?", a: "Set OLLAMA_HOST=0.0.0.0:11434 and put it behind your VPN or a reverse proxy with auth." },
      { q: "Which model is fastest on Mac?", a: "On Apple Silicon, llama3.2 (3B), phi-3-mini, and qwen2.5-coder-3b are great for interactive use." },
      { q: "Can I run Ollama in production?", a: "Sure, but add auth, rate limiting, and a queue. The default daemon is single-tenant." },
      { q: "How do I see GPU usage?", a: "ollama ps shows what's loaded. nvidia-smi or asitop shows GPU utilisation." },
    ],
    relatedGuides: guides(["api-key-security-best-practices", "free-llm-api-keys-for-testing"]),
  },
};

export function getProviderContent(id: ProviderId): ProviderContent {
  return content[id];
}
