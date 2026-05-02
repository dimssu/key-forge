## What

<!-- Brief description of the change. -->

## Why

<!-- The problem or improvement this addresses. -->

## How to test

- [ ] `pnpm typecheck`
- [ ] `pnpm test`
- [ ] `pnpm build`
- [ ] Manual smoke (described below):

## Checklist

- [ ] No keys / secrets committed (run `git diff` once more before pushing)
- [ ] No `console.log` of headers, request bodies, or error objects that might echo a key
- [ ] If a new provider was added, it follows the registry contract and ships with snippets + tests
- [ ] If a new public route was added, it's in the sitemap / robots / breadcrumb chain
