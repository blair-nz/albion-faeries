import {
  json,
  passphrase,
  requireSession,
  sessionCookie,
  clearSessionCookie,
  isSecureRequest,
} from "./_lib.js";

function id() {
  return crypto.randomUUID();
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const action = url.searchParams.get("action") || "login";

  const secure = isSecureRequest(request);

  if (action === "logout") {
    const token = await requireSession(request, env);
    if (token && env.CIRCLES_DB) {
      await env.CIRCLES_DB.prepare("DELETE FROM sessions WHERE token = ?").bind(token).run();
    }
    return json({ ok: true }, 200, { "Set-Cookie": clearSessionCookie(secure) });
  }

  if (action === "login") {
    let body;
    try {
      body = await request.json();
    } catch {
      return json({ error: "invalid_json" }, 400);
    }
    if (!body?.passphrase || body.passphrase !== passphrase(env)) {
      return json({ error: "bad_passphrase" }, 401);
    }
    const token = id();
    const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
      .toISOString()
      .replace("T", " ")
      .slice(0, 19);
    if (env.CIRCLES_DB) {
      await env.CIRCLES_DB.prepare(
        "INSERT INTO sessions (token, expires_at) VALUES (?, ?)"
      )
        .bind(token, expires)
        .run();
    }
    return json({ ok: true }, 200, { "Set-Cookie": sessionCookie(token, secure) });
  }

  if (action === "note") {
    const session = await requireSession(request, env);
    if (!session) return json({ error: "unauthorized" }, 401);
    const body = await request.json();
    if (!body?.circle_id || !body?.body) return json({ error: "missing_fields" }, 400);
    const noteId = id();
    await env.CIRCLES_DB.prepare(
      "INSERT INTO notes (id, circle_id, body) VALUES (?, ?, ?)"
    )
      .bind(noteId, body.circle_id, body.body)
      .run();
    return json({ id: noteId, circle_id: body.circle_id, body: body.body });
  }

  if (action === "action") {
    const session = await requireSession(request, env);
    if (!session) return json({ error: "unauthorized" }, 401);
    const body = await request.json();
    if (!body?.circle_id || !body?.title) return json({ error: "missing_fields" }, 400);
    const actionId = id();
    await env.CIRCLES_DB.prepare(
      "INSERT INTO actions (id, circle_id, title, owner, status) VALUES (?, ?, ?, ?, 'open')"
    )
      .bind(actionId, body.circle_id, body.title, body.owner || null)
      .run();
    return json({
      id: actionId,
      circle_id: body.circle_id,
      title: body.title,
      owner: body.owner || null,
      status: "open",
    });
  }

  return json({ error: "unknown_action" }, 400);
}

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const session = await requireSession(request, env);

  if (url.searchParams.get("action") === "session") {
    return json({ authenticated: Boolean(session) });
  }

  if (!session) return json({ error: "unauthorized" }, 401);

  const circleId = url.searchParams.get("circle");
  if (!circleId) {
    const circles = await env.CIRCLES_DB.prepare(
      "SELECT id, name, sort_order FROM circles ORDER BY sort_order"
    ).all();
    return json({ circles: circles.results || [] });
  }

  const notes = await env.CIRCLES_DB.prepare(
    "SELECT id, body, created_at FROM notes WHERE circle_id = ? ORDER BY created_at DESC"
  )
    .bind(circleId)
    .all();
  const actions = await env.CIRCLES_DB.prepare(
    "SELECT id, title, owner, status, created_at FROM actions WHERE circle_id = ? ORDER BY created_at DESC"
  )
    .bind(circleId)
    .all();

  return json({
    circle_id: circleId,
    notes: notes.results || [],
    actions: actions.results || [],
  });
}
