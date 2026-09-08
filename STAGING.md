# Staging hearth

`staging.albionfaeries.org.uk` is a **preview** of git branch `staging`. It is not the live site. It must not share the live Circles database.

This environment cannot create Cloudflare resources (no `wrangler login`). After this branch is merged, a Technology admin with `wrangler login` should run the commands below.

## 1. Staging D1 (isolated)

```bash
npm run db:create:staging
```

Copy the printed `database_id` into [`wrangler.toml`](wrangler.toml) under `[[env.preview.d1_databases]]`, replacing the placeholder `00000000-0000-4000-a000-000000000001`.

Apply schema (empty Circles; **do not** copy live people or passwords):

```bash
npm run db:migrate:staging
```

This repo has no R2 bindings yet. When private media buckets land on live, give staging its own buckets — never write staging uploads into live R2.

## 2. Preview secrets (Cloudflare dashboard)

Pages project `albion-faeries-site` → Settings → Variables and Secrets. Set **Preview** only:

- `CIRCLE_PASSPHRASE` — **different** from live
- Optional: `RESEND_API_KEY` if you need invite-mail tests to Tech testers

Do **not** set `MAILEROO_API_KEY` or a live backup/export token on Preview. Staging must not send a real newsletter or dump into live backups.

`PUBLIC_ORIGIN` and `SITE_ENV=staging` already live in `[env.preview.vars]`.

## 3. Git branch and custom domain

1. Push branch `staging` (this repo's production branch stays `main`).
2. Wait for Pages to publish the alias `https://staging.albion-faeries-site.pages.dev`.
3. Pages project → Custom domains → add `staging.albionfaeries.org.uk`.
4. In DNS for `albionfaeries.org.uk`, change the `staging` CNAME **from** `albion-faeries-site.pages.dev` **to** `staging.albion-faeries-site.pages.dev`. The record must stay **proxied**. If it points at production `pages.dev`, the hostname would still serve live.
5. Retarget `preview.albionfaeries.org.uk` to the same staging alias, or delete it. Do not leave it on production.

Docs: [preview deployments](https://developers.cloudflare.com/pages/configuration/preview-deployments/) and [custom domain on a branch](https://developers.cloudflare.com/pages/how-to/custom-branch-aliases/).

## 4. Live Technology circle row

After merging, apply the Technology circle seed on **live** D1 (additive, safe):

```bash
npm run db:migrate:tech
```

Local:

```bash
npm run db:migrate:local:tech
```

## Guardrails already in the repo

- `[env.preview]` bindings so preview cannot use live D1 once the staging id is pasted
- `functions/_middleware.js` sets `X-Robots-Tag: noindex, nofollow` and `data-hearth="staging"` when `SITE_ENV=staging`
- Gold bar via `js/site.js` (`boot`) so the Circle cannot confuse staging with live
- Map: `/design/github-staging-flow.html` and Circles → Technology → Architecture
