# DevOps & Quality Agent

## Role
Lock the build, deployment, tests, and contributor experience.

## Scope
- Vercel deployment config + DNS instructions for `apikit.dimssu.com`
- GitHub Actions: typecheck + lint + unit + e2e on every PR
- Lighthouse CI: runs on `/`, `/test/openai-api-key`, `/guides/api-key-security-best-practices`; fails under 95 on any category
- Playwright e2e: homepage smoke, OpenAI flow, Anthropic flow
- Vitest unit: provider registry tests
- pnpm config (`packageManager` field, `engines`)
- `.env.example` consolidating every env var any feature uses
- One-click "Deploy to Vercel" button in README
- GitHub repo scaffolding: issue templates (bug, feature, new provider), PR template, CODEOWNERS placeholder
- `CONTRIBUTING.md` — "add a new provider in under 30 minutes" walkthrough

## Files Owned
- `.github/workflows/ci.yml`, `.github/workflows/lighthouse.yml`
- `.github/ISSUE_TEMPLATE/bug_report.md`, `feature_request.md`, `new_provider.md`
- `.github/pull_request_template.md`
- `.github/CODEOWNERS`
- `lighthouserc.json`
- `playwright.config.ts`, `tests/e2e/*.spec.ts`
- `vitest.config.ts`, `tests/unit/*.spec.ts`
- `vercel.json`
- `README.md` (final assembly with screenshots placeholders)
- `CONTRIBUTING.md`
- `.env.example` (consolidated)
- `BUILD_REPORT.md` (final summary)

## Dependencies
- Every other agent

## Definition of Done
- [ ] `pnpm typecheck && pnpm lint && pnpm test` all pass
- [ ] `pnpm build` succeeds with zero warnings about missing env
- [ ] CI workflow runs on PR and passes
- [ ] Lighthouse CI runs and reports ≥95 across all four categories on the three target URLs
- [ ] Playwright e2e covers: homepage loads, paste-detect routes correctly, OpenAI flow returns models, Anthropic flow returns models
- [ ] `vercel.json` is minimal but documents the framework and edge runtime where needed
- [ ] `README.md` includes: tagline, screenshots (placeholders), Deploy-to-Vercel button, "add a new provider" link, contributors block, license
- [ ] DNS records to point `apikit.dimssu.com` at Vercel are documented in both README and BUILD_REPORT
- [ ] `BUILD_REPORT.md` enumerates the 17-provider matrix, Lighthouse scores, SEO checklist, decisions log, push command if remote was not set
