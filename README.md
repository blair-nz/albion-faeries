# Albion Faeries

Local design and rebuild work for [albionfaeries.org.uk](https://albionfaeries.org.uk/) — a stylish, fun digital home for the Radical Faeries of Albion.

## Design kit

Open locally (no build step):

- [`design/index.html`](design/index.html) — choose a direction

Active options (same IA; different light):

1. **Foxglove Glade** — [`style-guide.html`](design/style-guide.html) · [`site-structure.html`](design/site-structure.html)
2. **Sarsen Dawn** — [`style-guide-sarsen-dawn.html`](design/style-guide-sarsen-dawn.html) · [`site-structure-sarsen-dawn.html`](design/site-structure-sarsen-dawn.html)
3. **Sarsen Night** — [`style-guide-sarsen-night.html`](design/style-guide-sarsen-night.html) · [`site-structure-sarsen-night.html`](design/site-structure-sarsen-night.html)

Tokens and assets:

- [`design/tokens.css`](design/tokens.css) · [`tokens-sarsen-dawn.css`](design/tokens-sarsen-dawn.css) · [`tokens-sarsen-night.css`](design/tokens-sarsen-night.css)
- [`design/assets/sarsen/`](design/assets/sarsen/) — original stone / sky textures and animated henge SVGs

Archived (hidden from the kit index): [`design/archive/`](design/archive/)

Or from this folder:

```bash
cd design
python -m http.server 8765
```

Then visit `http://127.0.0.1:8765/`.

## Live preview

Cloudflare Pages project `albion-faeries` on the blair.solutions account:

- https://albion-faeries.pages.dev/
- https://albionfaeries.blair.solutions/ (custom domain; needs CNAME `albionfaeries` → `albion-faeries.pages.dev` if not already present)

Redeploy the design folder:

```bash
CLOUDFLARE_ACCOUNT_ID=e9b13349d94ef8f35c5b1e4470f12b6f npx wrangler pages deploy design --project-name=albion-faeries
```

## Scope in the design

Three layers, one look within each option: public hearth, event minisites, and a signed-in Circles space for notes, actions, and templates. Detailed Digital Homecoming planning docs stay outside this public repo for now.
