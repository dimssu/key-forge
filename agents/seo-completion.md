# SEO — completion log

## What was built
- 17 static `/test/<slug>-api-key` pages via `generateStaticParams` over the registry.
- 8 static `/guides/<slug>` pages.
- `app/sitemap.ts` (every static URL with `lastmod`, `changeFreq`, `priority`).
- `app/robots.ts` (allows all, disallows `/api/` and `/share/`, references sitemap).
- `app/api/og/route.tsx` — dynamic 1200×630 OG image with provider-aware copy. Edge runtime.
- `lib/seo/jsonld.ts` — builders for `SoftwareApplication`, `FAQPage`, `BreadcrumbList`, `HowTo`, `Article`.
- `lib/seo/meta.ts` — central metadata helper with canonical, OG, Twitter card, robots flags.
- Internal linking matrix on every provider page: 3 sibling provider links + 2 guide links + privacy banner link.
- Heading hierarchy: every page has exactly one `<h1>`. Section headings are `<h2>`. FAQ uses `<dl>/<dt>/<dd>`.
- Breadcrumb component (semantic `<nav aria-label="Breadcrumb">` + JSON-LD) on every non-home page.

## Decisions overruling UX
- Per-provider URL pattern is `/test/<slug>-api-key` (not `/<slug>` or `/providers/<slug>`) because keyword-rich slugs win. SEO agent vetoed the shorter UX pattern.
- The privacy banner stays above the fold on tester pages even though it adds visual weight — trust is a ranking signal in this niche.

## Handoff
- DevOps agent: Lighthouse CI threshold is 95 across perf / a11y / best-practices / SEO.
- Trust agent: `/api/og` is edge runtime — confirm CSP allows it and no key data is ever passed to it.
