# Provider Integration Agent

## Role
Implement adapters for every supported LLM provider, conforming to the `ProviderAdapter` interface defined by the Architect.

## Scope
17 provider adapters under `lib/providers/`:

| ID | Name | Key prefix / pattern |
| --- | --- | --- |
| openai | OpenAI | `sk-…` (Architect's reference adapter) |
| anthropic | Anthropic | `sk-ant-…` |
| gemini | Google Gemini | `AIza…` |
| mistral | Mistral | 32+ alnum |
| cohere | Cohere | 40 alnum |
| groq | Groq | `gsk_…` |
| deepseek | DeepSeek | `sk-…` (DeepSeek-issued) |
| xai | xAI Grok | `xai-…` |
| perplexity | Perplexity | `pplx-…` |
| together | Together AI | 64-hex |
| fireworks | Fireworks AI | `fw_…` |
| openrouter | OpenRouter | `sk-or-…` |
| azure-openai | Azure OpenAI | resource + key pair |
| bedrock | AWS Bedrock | AWS access key id + secret |
| huggingface | Hugging Face | `hf_…` |
| replicate | Replicate | `r8_…` |
| ollama | Ollama (local) | host URL, no key |

Each adapter implements: `validateKey`, `listModels`, `fetchQuota?`, `streamTest?`, `benchmarkLatency`, plus static fields (`id`, `name`, `slug`, `keyPattern`, `keyExample`, `docsUrl`, `consoleUrl`, `statusPageUrl?`, `pricingUrl?`).

## Files Owned
- `lib/providers/anthropic.ts`
- `lib/providers/gemini.ts`
- `lib/providers/mistral.ts`
- `lib/providers/cohere.ts`
- `lib/providers/groq.ts`
- `lib/providers/deepseek.ts`
- `lib/providers/xai.ts`
- `lib/providers/perplexity.ts`
- `lib/providers/together.ts`
- `lib/providers/fireworks.ts`
- `lib/providers/openrouter.ts`
- `lib/providers/azure-openai.ts`
- `lib/providers/bedrock.ts`
- `lib/providers/huggingface.ts`
- `lib/providers/replicate.ts`
- `lib/providers/ollama.ts`
- Updates to `lib/providers/_registry.ts` to include all adapters

## Dependencies
- Architect must finish first (interface + reference adapter + registry)

## Definition of Done
- [ ] All 17 adapters export and implement `ProviderAdapter`
- [ ] `_registry.ts` exports an array of all 17, ordered for paste-detect priority (most-specific patterns first)
- [ ] Unit test in `tests/unit/registry.spec.ts` asserts every adapter has required fields and matches its `keyExample` against `keyPattern`
- [ ] Each adapter handles 401/403 by returning a typed error with a fix suggestion (no raw error bodies that might echo the key)
- [ ] Latency benchmark in each adapter does N pings (default 5) against a cheap "list models" or equivalent endpoint
- [ ] AWS Bedrock and Azure OpenAI gracefully accept their composite credentials via JSON-encoded payload in the `x-apikit-key` header
