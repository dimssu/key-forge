# Features Agent

## Role
Implement every advanced feature the spec calls for. No exceptions, no "v2 later" — all features ship now.

## Scope (all must ship)
1. **Bulk key tester** — paste many keys (one per line), test all in parallel, export CSV
2. **Model availability matrix** — per provider, table of which models the key can call
3. **Spend / quota viewer** — where the API exposes it (OpenAI, Anthropic, etc.)
4. **Latency benchmark** — 5 pings, p50 / p95 / p99 surfaced in results panel
5. **Cross-provider comparison** — `/compare` page, side-by-side models, latency, $/1M tokens
6. **Rotation reminder** — opt-in, 90-day, signed-JWT email link, no DB; uses Resend if `RESEND_API_KEY` is set, otherwise feature is hidden
7. **Playground** — real prompt, real completion, streaming on by default
8. **Rate-limit calculator** — read response headers (`x-ratelimit-*`) and project remaining quota
9. **Webhook signature validator** — Anthropic and OpenAI webhook signatures
10. **"Is it down?" indicator** — pulls each provider's public status page; cached 5 minutes
11. **Shareable redacted result URLs** — encode result + last 4 chars of key only; signed JWT
12. **Postman / Insomnia / Bruno collection export** — one button per provider
13. **CLI companion** — `npx apikit` stub with `validate <provider>`, `models <provider>`, `bench <provider>` commands

## Files Owned
- `app/bulk/page.tsx`, `components/bulk-tester.tsx`
- `app/compare/page.tsx`, `components/comparison-table.tsx`
- `app/playground/page.tsx`, `components/playground.tsx`
- `app/tools/rate-limit/page.tsx`
- `app/tools/webhook-validator/page.tsx`
- `app/tools/status/page.tsx`, `app/api/status/route.ts`
- `app/share/[token]/page.tsx`, `app/api/share/route.ts`
- `app/api/reminder/route.ts`, `app/api/reminder/confirm/route.ts`
- `lib/csv.ts`, `lib/jwt.ts`, `lib/status-pages.ts`, `lib/webhooks.ts`
- `lib/collections/postman.ts`, `lib/collections/insomnia.ts`, `lib/collections/bruno.ts`
- `cli/package.json`, `cli/bin/apikit.ts`, `cli/src/*`

## Dependencies
- Architect (proxy, registry)
- Provider Integration (adapters expose `fetchQuota`, `streamTest`, `benchmarkLatency`, status URLs)
- UX/UI (component primitives)
- SEO must approve any feature page that's crawlable

## Definition of Done
- [ ] Every feature reachable from homepage or command palette
- [ ] Bulk tester exports a valid CSV (UTF-8, header row)
- [ ] Latency p50/p95/p99 displays on every test run
- [ ] Comparison table loads without keys (uses static pricing data)
- [ ] Playground streams tokens visibly (one chunk at a time, no buffering)
- [ ] Reminder flow returns a JWT-signed link via Resend; the entire feature is hidden when `RESEND_API_KEY` is unset
- [ ] Rate-limit calculator parses headers from at least OpenAI, Anthropic, Groq
- [ ] Webhook validator verifies a real Anthropic and OpenAI webhook signature
- [ ] Status indicator returns "operational / degraded / down / unknown" for each provider
- [ ] Share URL never echoes the full key — only last 4 chars
- [ ] Collection exports import cleanly into Postman, Insomnia, Bruno
- [ ] `pnpm --filter cli run build` builds the CLI; `node cli/dist/apikit.js --help` prints usage
