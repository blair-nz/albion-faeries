# Albion Faeries site — status & handoff

Last updated: 8 September 2026 (staging hearth + Tech Circle GitHub map)

Repo: https://github.com/blair-nz/albion-faeries (private)

## Where things live

| What | Where |
|------|--------|
| Public hearth (live) | https://albionfaeries.org.uk |
| Staging (own D1, `staging` branch) | https://staging.albionfaeries.org.uk |
| Pages project | `albion-faeries-site` (Cloudflare account `e9b13349d94ef8f35c5b1e4470f12b6f`) |
| Stable Pages URL | https://albion-faeries-site.pages.dev |
| Staging Pages alias | https://staging.albion-faeries-site.pages.dev |

DNS: zone is on Cloudflare. Apex and `www` point at production. `staging` must be a **proxied** CNAME to `staging.albion-faeries-site.pages.dev` (not the production `pages.dev`). Mail stays on MXRouting. Do not touch MX, SPF, DKIM, or DMARC.

`preview.albionfaeries.org.uk` used to be a production alias of the live hearth. Point it at the staging branch alias, or retire it. Do not leave it on production.

Pushing `main` updates **live** only. Pushing `staging` updates the staging hearth. Ask before commit/push to `main`.

## GitHub for Technology Circle

See the Stonehenge map: [`design/github-staging-flow.html`](design/github-staging-flow.html) and Circles → Technology → Architecture.

1. Blair invites Tech Circle GitHub accounts as collaborators.
2. Clone, check out `staging`.
3. Push `staging` (or merge a short-lived branch into it). Check staging.albionfaeries.org.uk
4. When the Circle is happy, pull request `staging` → `main`.

## Day-to-day on a laptop

```bash
git pull
npm install          # first time / after package changes
npm run db:migrate:local
npm run db:migrate:local:tech
npm run dev
```

Circle passphrase: copy `.dev.vars.example` → `.dev.vars`.

**Do not** commit `.dev.vars`, `node_modules/`, or `.wrangler/`.

## Conventions worth keeping

- Public pages are static HTML + `/css/site.css` + `/js/site.js` (`boot({ current: "…" })`)
- Copy via `i18n/en.json` (+ `cy` / `sco`); missing keys leave HTML fallback
- Staging Pages preview uses `[env.preview]` in `wrangler.toml` (own D1, `SITE_ENV=staging`)

## Open questions / watch-outs

- Pushing `main` is production. Ask before commit/push, DNS, or anything that could take the live hearth down.
- Create the staging D1 and paste its id into `wrangler.toml` `[env.preview]` before the first Circles-capable staging deploy. See [`STAGING.md`](STAGING.md).
- Do **not** delete D1, the Pages project, the GitHub repo, or the Cloudflare zone.
