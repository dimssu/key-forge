# Contributing to KeyForge

Thanks for considering a contribution. KeyForge is small enough that one person can hold the whole codebase in their head — let's keep it that way.

## Local setup

```sh
pnpm install
pnpm dev
```

You don't need any environment variables to run the core key-testing flow. The optional features (rotation reminders, share links) require:

- `KEYFORGE_SIGNING_SECRET` — generate with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.
- `RESEND_API_KEY` — only needed for reminder emails.

The reminder UI auto-hides when these are unset, so you can develop everything else without them.

## Add a new provider in under 30 minutes

This is the most common contribution. The registry pattern makes it boring on purpose.

1. **Pick the file.** Create `lib/providers/<id>.ts`. The id is the URL slug (lowercase, hyphenated).
2. **Implement `ProviderAdapter`.** The interface lives in `lib/providers/_types.ts`. You need at minimum:
   - `id`, `name`, `slug`, `tagline`, `keyPattern`, `keyExample`, `docsUrl`, `consoleUrl`
   - `validateKey`, `listModels`, `benchmarkLatency`, `snippets`
   - Optional: `fetchQuota`, `streamTest`, `statusPageUrl`, `pricingUrl`, `categories`
3. **OpenAI-compatible providers** can use the helper at `lib/providers/_openai-compat.ts`. Three lines of config + the static fields and you're done.
4. **Register it.** Open `lib/providers/_registry.ts` and add the import + push to the `providers` array. Order matters for paste detection — most-specific patterns must come before more general ones.
5. **Add the content.** Open `lib/provider-content.ts` and add a key for your provider id with a `lede`, `whatItDoes`, `howToGet` steps, `commonErrors` overrides (or just spread `baseErrors`), `security`, optional `pricing`, 6–10 `faqs`, and a list of `relatedGuides`.
6. **Run tests.**
   ```sh
   pnpm typecheck
   pnpm test
   pnpm build
   ```
   The registry test asserts every adapter satisfies the interface. The build verifies a static `/test/<your-slug>-api-key` page is generated.
7. **Verify in the browser.** `pnpm dev`, navigate to `/test/<your-slug>-api-key`, paste a real key, confirm validate + list models + benchmark all work.
8. **Open a PR** with a screenshot of the page and a one-paragraph description of the provider.

## Code style

- TypeScript strict mode is non-negotiable.
- Default to no comments. Explain *why* in the PR description; the code should explain *what*.
- Component files are named lowercase, hyphenated. Lib files match.
- shadcn/ui primitives live in `components/ui/`. Don't add new heavyweight UI dependencies without a justification in the PR.

## Security review

Any change that touches `lib/providers/`, `app/api/proxy/`, `middleware.ts`, `lib/jwt.ts`, `lib/share.ts`, or any auth-handling path requires a security review. Please do not attempt to merge without one.

## Reporting security issues

See [`/.well-known/security.txt`](public/.well-known/security.txt). Do not open public issues for security reports.
