# Trust & Security Agent

## Role
Make APIKit demonstrably trustworthy. Privacy is the product. Audit every other agent's code for accidental key leakage.

## Scope
- Stateless proxy hardening (no logging of headers/bodies, no telemetry on keys)
- Per-IP rate limiting on `/api/proxy/*` (sliding-window in-memory; documented as best-effort)
- Strict CSP, HSTS, X-Frame-Options DENY, X-Content-Type-Options nosniff, Referrer-Policy strict-origin-when-cross-origin, Permissions-Policy locked down
- CORS policy: same-origin by default; document opening up if user wants the proxy from their own apps
- `/security.txt` and `/.well-known/security.txt`
- `/privacy` page: precise step-by-step of what happens to a key when tested
- `/security` page: threat model, scope of trust, what we do and do not do
- Audit:
  - grep for `console.log`, `console.error` near key handling
  - grep for any persistence (localStorage/sessionStorage/cookies/DB) of full keys
  - grep error responses for echoed input
  - confirm OG images and shareable URLs never include the key
  - confirm analytics (if any) never include the key

## Files Owned
- `next.config.mjs` (security headers — shared with Architect; Trust agent finalizes)
- `middleware.ts` (rate limiting + CSP nonce)
- `lib/rate-limit.ts`
- `app/(marketing)/privacy/page.tsx`
- `app/(marketing)/security/page.tsx`
- `public/.well-known/security.txt`, `public/security.txt`
- `agents/trust-security-completion.md` includes the audit grep results

## Dependencies
- All agents (audit happens after their work)
- Architect (proxy route is the trust boundary)
- Features (share / reminder / playground are highest-risk surfaces)

## Definition of Done
- [ ] `curl -I /` returns CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [ ] Rapid-fire 30 requests from one IP to `/api/proxy/openai` triggers 429 after the limit
- [ ] `grep -ri "console.log" app lib components` returns no key-handling code
- [ ] `grep -ri "localStorage\|sessionStorage" components lib` shows only theme/UI state, never keys
- [ ] `/privacy` describes the exact flow: paste → header → upstream call → response → discard
- [ ] `/security` lists the threat model and scope
- [ ] `security.txt` reachable at `/.well-known/security.txt` with a contact and policy URL
- [ ] Share URL audit: encoded payload never contains more than the last 4 chars of any key
- [ ] Reminder email audit: only `{email, providerId, exp}` is signed; the full key is never in the JWT
