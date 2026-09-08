/**
 * Staging guardrails: noindex, and mark HTML so the hearth bar can show.
 * Preview env sets SITE_ENV=staging. Also treat staging hostnames as staging
 * even if a deploy is mis-labelled.
 */

function isStagingRequest(context) {
  const env = context.env || {};
  if (String(env.SITE_ENV || "").toLowerCase() === "staging") return true;
  try {
    const host = new URL(context.request.url).hostname.toLowerCase();
    if (host === "staging.albionfaeries.org.uk") return true;
    if (host === "staging.albion-faeries-site.pages.dev") return true;
  } catch {
    /* ignore */
  }
  return false;
}

export async function onRequest(context) {
  const response = await context.next();
  if (!isStagingRequest(context)) return response;

  const headers = new Headers(response.headers);
  headers.set("X-Robots-Tag", "noindex, nofollow");

  const type = headers.get("content-type") || "";
  if (!type.includes("text/html")) {
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  }

  let html = await response.text();
  html = html.replace(/<html\b([^>]*)>/i, (match, attrs) => {
    if (/\bdata-hearth\s*=/.test(attrs)) return match;
    return `<html data-hearth="staging"${attrs}>`;
  });
  if (!/<meta\s[^>]*name=["']robots["']/i.test(html)) {
    html = html.replace(/<\/head>/i, `  <meta name="robots" content="noindex, nofollow" />\n</head>`);
  }

  return new Response(html, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}
