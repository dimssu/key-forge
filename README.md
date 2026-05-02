# KeyForge

**Test any LLM API key in seconds.**

KeyForge is a free, universal LLM API key tester. Paste an API key from any major provider, instantly verify it works, see which models you have access to, benchmark latency, and copy ready-to-use cURL / Python / Node snippets.

Zero signup. Open source. MIT-licensed.

🌐 Live: **[keyforge.dimssu.com](https://keyforge.dimssu.com)**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fdimssu%2Fkey-forge)

## Screenshots

> _Replace these placeholders with real screenshots after first deploy._

- `docs/screenshots/home.png` — homepage with provider grid
- `docs/screenshots/test-openai.png` — OpenAI test page with results panel
- `docs/screenshots/playground.png` — playground streaming a response
- `docs/screenshots/bulk.png` — bulk tester CSV export

## Why

Every major LLM has its own dashboard, key shape, and validation flow. Switching between OpenAI, Anthropic, Gemini, Groq, and a dozen others means a dozen browser tabs, a dozen `curl` invocations, and a dozen ways to leak a key into a log. KeyForge gives you one place to:

- Validate a pasted key against the upstream provider.
- See which models the key can call.
- Benchmark latency (p50 / p95 / p99 over 5 pings).
- Copy ready-to-paste snippets for cURL, Python, Node fetch, and axios.
- Compare providers side-by-side.
- Drop in for the bulk tester when you're rotating a stack of keys at once.

The proxy that does the upstream call is **stateless** — your key is forwarded once, the response comes back, and the key is forgotten. No DB, no logs of headers, no analytics on key values.

## Supported providers

OpenAI · Anthropic · Google Gemini · Mistral · Cohere · Groq · DeepSeek · xAI Grok · Perplexity · Together AI · Fireworks AI · OpenRouter · Azure OpenAI · AWS Bedrock · Hugging Face · Replicate · Ollama (local)

That's 17 today. [Add another in under 30 minutes →](CONTRIBUTING.md#add-a-new-provider-in-under-30-minutes)

## Local development

```sh
pnpm install
pnpm dev
```

The site runs at <http://localhost:3000>. No env vars are required for the core flow. Optional env vars (in `.env.local`):

- `KEYFORGE_SIGNING_SECRET` — enables shareable redacted result URLs and rotation reminders.
- `RESEND_API_KEY` — enables the rotation-reminder email feature (hidden when unset).
- `NEXT_PUBLIC_SITE_URL` — overrides the canonical / OG base URL (defaults to `https://keyforge.dimssu.com`).

## Build

```sh
pnpm build
pnpm start
```

`pnpm build` statically generates 17 provider test pages and 8 guide articles (plus the homepage, compare, bulk, playground, and tools pages). The proxy + share + reminder routes are server-rendered.

## Tests

```sh
pnpm typecheck       # TypeScript strict
pnpm lint            # next lint
pnpm test            # Vitest unit tests (provider registry, csv, webhooks, jwt)
pnpm test:e2e        # Playwright (homepage, OpenAI, Anthropic flows)
pnpm lhci            # Lighthouse CI — fails under 95 on any category
```

## Deploy to Vercel

The one-click button at the top of this README is the fast path. After deploying:

1. Open your Vercel project → **Settings → Domains**.
2. Add `keyforge.dimssu.com` as a custom domain.
3. Add the DNS records below at your registrar (Namecheap, Cloudflare, Route 53, etc.).

### DNS for `keyforge.dimssu.com`

| Type  | Host       | Value                  | TTL  |
| ----- | ---------- | ---------------------- | ---- |
| CNAME | keyforge   | cname.vercel-dns.com.  | Auto |

If you're hosting `dimssu.com` on Cloudflare, set the proxy mode to **DNS only** (grey cloud) — Vercel handles its own TLS.

### Optional env vars on Vercel

Set under **Settings → Environment Variables**:

| Name                          | Required? | Purpose                                            |
| ----------------------------- | --------- | -------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`        | no        | Defaults to `https://keyforge.dimssu.com`.         |
| `KEYFORGE_SIGNING_SECRET`     | optional  | Enables share links + rotation reminders.          |
| `RESEND_API_KEY`              | optional  | Enables rotation reminder emails.                  |
| `REMINDER_FROM_EMAIL`         | optional  | Defaults to `no-reply@keyforge.dimssu.com`.        |
| `KEYFORGE_RATE_LIMIT_PER_MINUTE` | optional | Per-IP rate limit on `/api/proxy/*`. Default 30. |

## CLI companion

```sh
KEYFORGE_KEY=sk-... npx keyforge validate openai
KEYFORGE_KEY=sk-ant-... npx keyforge models anthropic
KEYFORGE_KEY=gsk_... npx keyforge bench groq 10
```

See [`cli/README.md`](cli/README.md).

## Privacy

The privacy story is the product. The short version:

- Your key is sent through a stateless proxy and forwarded directly upstream.
- We never log, store, or persist it.
- Share URLs encode only the last 4 characters of the key.
- The reminder feature signs a JWT with `{ email, providerId, expiresAt }` — never the key.

The long version is on [/privacy](https://keyforge.dimssu.com/privacy).

## Architecture

```
app/                        # Next.js 14 App Router
  api/proxy/[provider]/     # The trust boundary — stateless, never logs the key
  test/[provider]-api-key/  # SEO surface, generateStaticParams over registry
  (marketing)/              # Homepage, guides, privacy, security
  bulk, compare, playground, tools/{rate-limit,webhook-validator,status}
components/                 # UI: navbar, footer, key-input, command palette, results, snippets
lib/
  providers/                # Registry + 17 adapters + OpenAI-compat helper
  seo/                      # Metadata + JSON-LD builders
  collections/              # Postman / Insomnia / Bruno exports
  rate-limit, jwt, share, status-pages, csv, webhooks, snippets
content/, lib/guides-content.ts  # Long-form copy
agents/                     # Per-agent specs + completion logs
cli/                        # `npx keyforge` companion
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Adding a new provider should take under 30 minutes; the guide walks you through it step-by-step.

## License

MIT. Use it, fork it, deploy your own copy. See [LICENSE](LICENSE).

## Contributors

- [@dimssu](https://github.com/dimssu) — author + maintainer

If you submit a PR that lands, you'll be added here. KeyForge is a community project; we especially welcome new provider adapters and guide articles.
