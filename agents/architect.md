# Architect Agent

## Role
Lay the foundation every other agent builds on. Decide structural patterns, scaffolding, and the registry abstraction.

## Scope
- Next.js 14 App Router project (TypeScript strict mode)
- Tailwind CSS + shadcn/ui primitives
- Provider registry pattern (interface + central registry)
- Stateless server proxy at `/api/proxy/[provider]`
- One reference adapter wired end-to-end (OpenAI)
- Project-wide config: `tsconfig`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `package.json`, `.env.example`

## Files Owned
- `package.json`, `pnpm-workspace.yaml` (if needed), `tsconfig.json`
- `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/globals.css`
- `app/layout.tsx`, `app/page.tsx` (skeleton — UX agent extends)
- `app/test/[provider]-api-key/page.tsx` (skeleton — SEO + UX agents extend)
- `app/api/proxy/[provider]/route.ts`
- `lib/providers/_types.ts`, `lib/providers/_registry.ts`, `lib/providers/openai.ts`
- `lib/utils.ts`
- `components/ui/*` (shadcn primitives — install button, input, card, badge, tabs, dialog, command)
- `.env.example`

## Dependencies
None. Architect runs first.

## Definition of Done
- [ ] `pnpm install && pnpm dev` boots without warnings
- [ ] Visiting `/` renders a placeholder homepage with the registry-driven provider list
- [ ] Visiting `/test/openai-api-key` renders the test shell
- [ ] `POST /api/proxy/openai` with `x-keyforge-key` header forwards to OpenAI and returns `{ status, data, latencyMs }`
- [ ] `lib/providers/_registry.ts` exports a typed array consumed everywhere downstream
- [ ] No keys are logged anywhere; `route.ts` audit confirms no `console.log` of headers/bodies
- [ ] `pnpm build` succeeds and emits the expected static `/test/openai-api-key` page
