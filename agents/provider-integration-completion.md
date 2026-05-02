# Provider Integration — completion log

## What was built
17 provider adapters under `lib/providers/`, all conforming to `ProviderAdapter`:

| ID | File | Notes |
| --- | --- | --- |
| openai | `openai.ts` | Reference adapter (Architect-owned). Streaming + snippets. |
| anthropic | `anthropic.ts` | x-api-key header, anthropic-version. Streaming via SSE. |
| gemini | `gemini.ts` | Query-param auth, SSE streaming on streamGenerateContent. |
| mistral | `mistral.ts` | OpenAI-compat. |
| cohere | `cohere.ts` | Native Cohere shape, not OpenAI-compat. |
| groq | `groq.ts` | OpenAI-compat. |
| deepseek | `deepseek.ts` | OpenAI-compat. |
| xai | `xai.ts` | OpenAI-compat. |
| perplexity | `perplexity.ts` | OpenAI-compat with static model list (no /models endpoint). |
| together | `together.ts` | OpenAI-compat with capability inference from model id. |
| fireworks | `fireworks.ts` | OpenAI-compat. |
| openrouter | `openrouter.ts` | OpenAI-compat + `/v1/credits` for quota. |
| azure-openai | `azure-openai.ts` | Composite credential (endpoint + apiKey + apiVersion). |
| bedrock | `bedrock.ts` | Composite IAM credential + manual SigV4 signer. |
| huggingface | `huggingface.ts` | whoami validation, curated model list. |
| replicate | `replicate.ts` | account validation, featured-models collection. |
| ollama | `ollama.ts` | Host-based, no key. |

## Assumptions
- Composite credentials (Azure, Bedrock) accept JSON in the `x-apikit-key` header.
- For providers that do not expose a `/models` endpoint (Perplexity), we ship a curated static list.
- Latency benchmark uses the cheapest authenticated endpoint — usually `/models`.
- We never include the key in error messages — only HTTP status + a generic fix line.

## Handoff
- SEO agent: paste-detect ordering in `_registry.ts` is most-specific-first (anthropic before openai, openrouter before openai, etc.).
- Features agent: every adapter has a working `snippets()` and `benchmarkLatency()` so the playground / bench / share flows have data to display.
