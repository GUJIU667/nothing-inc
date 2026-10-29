# Nothing Inc. China-access deployment

Independent static frontend plus Cloudflare Pages Functions and D1 persistence.

## Build

```bash
pnpm install
pnpm run build
```

## Data model

`migrations/0001_members.sql` creates an atomic database trigger for globally
sequential member numbers. The browser never allocates or increments an ID.

## Deploy

Apply the D1 migration, then deploy `dist` and `functions` through Cloudflare
Pages using `wrangler.jsonc`. The production project is `nothing-inc-cn`.

