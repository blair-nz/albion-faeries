# Albion Faeries — albionfaeries.org.uk

Local site root for the Radical Faeries of Albion public hearth, event minisites, and Circles.

**Handoff:** [`STATUS.md`](STATUS.md). Staging setup: [`STAGING.md`](STAGING.md). Tech Circle GitHub map: [`design/github-staging-flow.html`](design/github-staging-flow.html).

## Themes

- Stonehenge (default)
- Deep Glade
- Faery Fire
- Accessible

## Languages

English · Cymraeg (Welsh) · Scots

## Local preview

```bash
npm install
npm run db:migrate:local
npm run db:migrate:local:tech
npx wrangler pages dev . --d1=CIRCLES_DB --local
```

Circle passphrase (bootstrap): `faerie-hearth` — override with `CIRCLE_PASSPHRASE` in `.dev.vars`.

## Deploy

- **Staging:** push the `staging` branch. Cloudflare Pages preview deploys to **https://staging.albionfaeries.org.uk** (own D1). See [`STAGING.md`](STAGING.md).
- **Live:** merge `staging` into `main`. Pages production deploys to **https://albionfaeries.org.uk**.

Do not push feature work straight to `main`. Do not `wrangler pages deploy` from a dirty tree.

Account: blair.solutions / `e9b13349d94ef8f35c5b1e4470f12b6f`

## Design kit

Earlier visual direction work lives under [`design/`](design/) (open `design/index.html` locally). The GitHub / staging map uses the live Stonehenge chrome: [`design/github-staging-flow.html`](design/github-staging-flow.html).
