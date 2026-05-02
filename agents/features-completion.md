# Features — completion log

| Feature | Status | Where |
| --- | --- | --- |
| Bulk key tester (CSV export) | ✅ | `/bulk` + `components/bulk-tester.tsx` |
| Model availability matrix | ✅ | Per-provider tester results panel |
| Spend / quota viewer | ✅ partial | OpenRouter via `/v1/credits`. Other providers don't expose it; we surface a graceful "—". |
| Latency benchmark (5 pings, p50/p95/p99) | ✅ | "Run latency benchmark" button on every provider page |
| Cross-provider comparison | ✅ | `/compare` static table |
| Rotation reminder (90-day, signed JWT, opt-in) | ✅ | `/api/reminder` + `/api/reminder/confirm` (hidden when `RESEND_API_KEY` unset) |
| Playground (real prompt, streaming) | ✅ | `/playground` + `components/playground.tsx` |
| Rate-limit calculator | ✅ | `/tools/rate-limit` + `lib/rate-limit-headers.ts` |
| Webhook signature validator | ✅ | `/tools/webhook-validator` + `lib/webhooks.ts` (Anthropic + OpenAI) |
| "Is it down?" indicator | ✅ | `/tools/status` + `lib/status-pages.ts` (cached 5 min) |
| Shareable, key-redacted result URLs | ✅ | `/api/share` + `/share/[token]` (signed JWT, last 4 chars only) |
| Postman / Insomnia / Bruno collection export | ✅ | `/api/collections/[provider]/[format]` |
| CLI companion (`npx apikit`) | ✅ | `cli/` workspace with validate / models / bench / providers commands |

## Assumptions
- Reminders use Resend; falls back to feature-hidden when `RESEND_API_KEY` is unset.
- Share links require `KEYFORGE_SIGNING_SECRET`; the share endpoint returns 503 if absent.
- Webhook validator runs entirely in the browser — no body or secret is sent to our server.
- Status indicator only follows `statuspage.io`-compatible feeds; providers without one show "unknown".

## Handoff
- Trust agent: confirm share JWT only contains last 4 chars + status + model ids. ✅ verified in `lib/share.ts`.
- DevOps agent: bulk tester e2e is a future addition; current Playwright suite covers homepage + OpenAI + Anthropic.
