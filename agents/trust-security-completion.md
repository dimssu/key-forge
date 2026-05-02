# Trust & Security — completion log

## What was built
- `next.config.mjs` security headers: HSTS (2yr + preload), X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy locked, strict CSP (`default-src 'self'`, no third-party origins).
- Per-IP sliding-window rate limit on `/api/proxy/*` via `lib/rate-limit.ts` (default 30/min, configurable via `KEYFORGE_RATE_LIMIT_PER_MINUTE`).
- `/privacy` page with the precise step-by-step of what happens to a key.
- `/security` page with the threat model + scope of trust.
- `public/security.txt` and `public/.well-known/security.txt` with disclosure contact.
- Production-mode console removal in `next.config.mjs` (`removeConsole: { exclude: ["error", "warn"] }`).

## Audit pass
Performed at the end of the build:

- `grep -r "console.log" app lib components` — only present inside generated snippet strings (safe; they live in displayed code samples, not in our runtime).
- `grep -r "localStorage\|sessionStorage" components lib` — used only for theme persistence and the brief paste-handoff (consumed and removed immediately).
- Proxy route audit (`app/api/proxy/[provider]/route.ts`): no `console.*` of headers / bodies; error responses return generic messages, not echoed input.
- Share token (`lib/share.ts`): `keyTail` is exactly `key.slice(-4)`. The full key never enters the JWT.
- Reminder token (`app/api/reminder/route.ts`): JWT payload is `{ email, providerId, expiresAt }`. The full key is not signed, not stored, not transmitted.
- OG image route (`app/api/og/route.tsx`): only reads `title` and `provider` query params; never the key.

## Defenses that are out of scope
- Cross-region rate limiting at scale — explicitly documented as best-effort on `/security`.
- DDoS protection — relies on the deploy host (Vercel's edge).
- Self-host integrity — if a downstream fork modifies the proxy to log keys, that's their problem; the source license requires no logging by default.

## Handoff
- DevOps agent: please add the rate-limit assertion to the Playwright suite when there's bandwidth (current suite is light to keep CI fast).
