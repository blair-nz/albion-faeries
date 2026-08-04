/**
 * Shared Circles helpers for Pages Functions.
 * Passphrase from CIRCLE_PASSPHRASE env (fallback for bootstrap only).
 */

const COOKIE = "af_circle_session";

export function json(data, status = 200, headers = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...headers,
    },
  });
}

export function getCookie(request, name) {
  const raw = request.headers.get("Cookie") || "";
  const parts = raw.split(";").map((p) => p.trim());
  for (const p of parts) {
    const i = p.indexOf("=");
    if (i === -1) continue;
    if (p.slice(0, i) === name) return decodeURIComponent(p.slice(i + 1));
  }
  return null;
}

export function passphrase(env) {
  return env.CIRCLE_PASSPHRASE || "faerie-hearth";
}

export async function requireSession(request, env) {
  const token = getCookie(request, COOKIE);
  if (!token || !env.CIRCLES_DB) return null;
  const row = await env.CIRCLES_DB.prepare(
    "SELECT token FROM sessions WHERE token = ? AND expires_at > datetime('now')"
  )
    .bind(token)
    .first();
  return row ? token : null;
}

export function sessionCookie(token, secure = true, maxAgeDays = 14) {
  const maxAge = maxAgeDays * 24 * 60 * 60;
  const sec = secure ? "; Secure" : "";
  return `${COOKIE}=${encodeURIComponent(token)}; Path=/; HttpOnly${sec}; SameSite=Lax; Max-Age=${maxAge}`;
}

export function clearSessionCookie(secure = true) {
  const sec = secure ? "; Secure" : "";
  return `${COOKIE}=; Path=/; HttpOnly${sec}; SameSite=Lax; Max-Age=0`;
}

export function isSecureRequest(request) {
  return new URL(request.url).protocol === "https:";
}

export { COOKIE };
