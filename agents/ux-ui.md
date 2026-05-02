# UX/UI Agent

## Role
Build the visual design system and all interactive surfaces. Dev-focused aesthetic (Vercel/Linear-inspired). Dark by default with a light toggle.

## Scope
- Color tokens, typography, spacing scale, motion primitives
- Components: navbar, footer, hero, provider grid (searchable, filterable), key input with paste-detect, results panel, snippet tabs, privacy banner, command palette (Cmd+K), toast system, skeletons, breadcrumbs, theme toggle
- Keyboard shortcuts: Cmd+K palette, Cmd+Enter test, Esc close modal, `/` focus search
- Framer Motion micro-animations (no decoration — use only when it clarifies state)
- Mobile-responsive (≥360px)
- ARIA + keyboard nav + focus rings + skip-to-content link

## Files Owned
- `app/globals.css` (shared with Architect — UX defines tokens)
- `components/navbar.tsx`, `components/footer.tsx`, `components/hero.tsx`
- `components/provider-grid.tsx`, `components/provider-card.tsx`
- `components/key-input.tsx` (uses registry `keyPattern` for paste-detect → auto-routes to `/test/[provider]-api-key`)
- `components/results-panel.tsx` (collapsible raw JSON, latency badge, model count)
- `components/snippet-tabs.tsx` (cURL / Python / Node fetch / axios)
- `components/privacy-banner.tsx` (always visible above the fold)
- `components/command-palette.tsx`
- `components/theme-toggle.tsx`, `components/theme-provider.tsx`
- `components/breadcrumbs.tsx`
- `components/skip-link.tsx`
- `components/ui/toast.tsx` and toaster

## Dependencies
- Architect (scaffold, registry, shadcn primitives)

## Definition of Done
- [ ] Homepage hero + provider grid renders cleanly on desktop and mobile
- [ ] Pasting an `sk-…` key on the homepage automatically routes to `/test/openai-api-key` and pre-fills the field
- [ ] Cmd+K opens a searchable command palette with all 17 providers + every guide
- [ ] Cmd+Enter triggers the test from any focused state
- [ ] Light/dark toggle persists in localStorage and respects `prefers-color-scheme` on first load
- [ ] No raw spinners — every wait state uses skeletons or progress shimmers
- [ ] Skip-to-content link is the first focusable element
- [ ] All interactive elements have visible focus rings and accessible labels
- [ ] Privacy banner is non-dismissable and clearly states "keys never persist"
