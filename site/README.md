# Albion Faeries — public site

Scaffold for the live site build. Deployed separately from the design kit in `../design/`.

## Local preview

```bash
cd site
python -m http.server 8766
```

Then open `http://127.0.0.1:8766/`.

## Deploy (Cloudflare Pages)

Project: `albion-faeries-site`  
Interim host: `https://albion-faeries.blair.solutions` (CNAME → this project's `*.pages.dev`)

```bash
CLOUDFLARE_ACCOUNT_ID=e9b13349d94ef8f35c5b1e4470f12b6f npx wrangler pages deploy site --project-name=albion-faeries-site
```

Create the project once (if it does not exist yet):

```bash
CLOUDFLARE_ACCOUNT_ID=e9b13349d94ef8f35c5b1e4470f12b6f npx wrangler pages project create albion-faeries-site --production-branch=main
```

## Notes

- Tokens in `css/tokens.css` are copied from `design/tokens.css` (Foxglove Glade) so this Pages root stays self-contained. Sync when the kit direction lands.
- IA targets: public hearth, event minisites, signed-in Circles — see `design/site-structure.html`.
