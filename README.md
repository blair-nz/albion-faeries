# Albion Faeries — albionfaeries.org.uk

Local site root for the Radical Faeries of Albion public hearth, event minisites, and Circles.

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
npx wrangler pages dev . --d1=CIRCLES_DB --local
```

Circle passphrase (bootstrap): `faerie-hearth` — override with `CIRCLE_PASSPHRASE` in `.dev.vars`.

## Deploy

```bash
npx wrangler d1 create albion-faeries-circles
# put database_id into wrangler.toml
npx wrangler d1 execute albion-faeries-circles --remote --file=./migrations/0001_init.sql
npx wrangler pages project create albion-faeries-site --production-branch=main
npx wrangler pages deploy . --project-name=albion-faeries-site
```

Account: blair.solutions / `e9b13349d94ef8f35c5b1e4470f12b6f`
