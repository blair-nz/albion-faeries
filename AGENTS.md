# Agent notes — Albion Faeries

- Static Cloudflare Pages site; project `albion-faeries-site`
- Live: https://albionfaeries.org.uk — git branch `main`
- Staging: https://staging.albionfaeries.org.uk — git branch `staging`, own D1 (`[env.preview]` in `wrangler.toml`)
- Deploy live: merge `staging` into `main`. Do not push feature work straight to `main`. Ask before commit/push to `main`.
- Do not `wrangler pages deploy` from a dirty tree.
- DNS: never touch MX, SPF, DKIM, or DMARC. Staging CNAME must target `staging.albion-faeries-site.pages.dev`.
- Staging D1 setup: [`STAGING.md`](STAGING.md). Map for Tech Circle: `/design/github-staging-flow.html`
- Do not commit `.dev.vars`, `node_modules/`, or `.wrangler/`.
