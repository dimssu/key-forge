# SEO Agent

## Role
The most important agent. Make APIKit dominate organic search for LLM-key-related queries. Has **veto power** over any UX choice that hurts ranking.

## Scope
- Static per-provider landing pages at `/test/[provider]-api-key` via `generateStaticParams`
- `/sitemap.xml` and `/robots.txt`
- JSON-LD on every page: `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `HowTo`
- Dynamic OG + Twitter card images via `@vercel/og` at `/api/og`
- Canonical URLs, hreflang (single locale for now, scaffolded for future)
- Internal linking matrix: each provider page links to 3 sibling provider pages + 2 relevant guides + the privacy page
- Long-form content shell on each provider page (consumes Content Agent's MDX bodies)
- `/guides/*` index + 8 articles, each with their own JSON-LD `Article` schema
- Breadcrumbs (semantic + JSON-LD), `<h1>` → `<h6>` discipline, semantic landmarks
- Core Web Vitals budget: LCP <2.5s, CLS <0.1, INP <200ms; font subsetting; no blocking CSS; image optimization
- Lighthouse 95+ across perf / a11y / best-practices / seo

## Files Owned
- `app/sitemap.ts`, `app/robots.ts`
- `app/test/[provider]-api-key/page.tsx` (final SEO version, replaces Architect's shell)
- `app/(marketing)/guides/page.tsx`, `app/(marketing)/guides/[slug]/page.tsx`
- `app/api/og/route.tsx`
- `lib/seo/jsonld.ts` (builders for all four schemas)
- `lib/seo/meta.ts` (canonical + OG metadata helpers)
- `components/breadcrumbs.tsx` (shared with UX agent)
- `components/related-providers.tsx`
- `components/related-guides.tsx`

## Dependencies
- Architect (registry)
- Content (provider bodies + guide articles)
- UX/UI (component primitives — but SEO can override with semantic markup)

## Definition of Done
- [ ] `pnpm build` emits 17 static `/test/{provider}-api-key` pages + 8 static `/guides/{slug}` pages
- [ ] `view-source:/test/openai-api-key` shows: meta description ~150 chars, canonical, OG, Twitter card, all four JSON-LD blocks, `<h1>` matching the page title
- [ ] `/sitemap.xml` lists every static URL with `lastmod` and a sane `priority`
- [ ] `/robots.txt` allows everything except `/api/`, references the sitemap
- [ ] `/api/og?provider=openai` returns a 1200×630 image
- [ ] Each provider page has 3 sibling-provider links and 2 guide links rendered statically
- [ ] Lighthouse run on `/` and `/test/openai-api-key` ≥ 95 in all four categories
- [ ] Heading hierarchy linted: every page has exactly one `<h1>`, no skipped levels
