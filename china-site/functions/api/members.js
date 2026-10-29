const ALLOWED_TITLES = new Set([
  "CEO", "Chief Slacking Officer", "Chief Nothing Officer", "Global Sleep Director",
  "VP of Doing Nothing", "Chief Financial Freedom Officer", "Head of Talent Rejection",
  "Chief Unemployment Officer", "Director of Strategic Procrastination",
  "Chief Work-Life Balance Officer", "Intern",
]);

const TEXT_PATTERN = /^[\p{L}\p{N}\p{M} .,'’&()\-·]+$/u;
const KEY_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const GITHUB_ORIGIN = "https://gujiu667.github.io";

function cors(request) {
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin": origin === GITHUB_ORIGIN ? origin : "https://nothing-inc-cn.pages.dev",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Cache-Control": "no-store",
    "Vary": "Origin",
  };
}

function json(request, body, status = 200) {
  return Response.json(body, { status, headers: cors(request) });
}

function normalize(value, max) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function memberJson(row) {
  return {
    applicationId: row.request_key,
    name: row.nickname,
    role: row.title,
    joined: row.joined,
    id: `NØ-${String(row.member_number).padStart(6, "0")}`,
  };
}

async function fingerprint(request) {
  const ip = request.headers.get("CF-Connecting-IP") || "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(`${day}|${ip}|nothing-inc-cn-v1`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function rateAllowed(request, db) {
  const key = await fingerprint(request);
  const windowStart = Math.floor(Date.now() / 60_000) * 60_000;
  const row = await db.prepare(`
    INSERT INTO rate_limits (fingerprint, window_start, attempts) VALUES (?, ?, 1)
    ON CONFLICT(fingerprint) DO UPDATE SET
      window_start = CASE WHEN window_start = excluded.window_start THEN window_start ELSE excluded.window_start END,
      attempts = CASE WHEN window_start = excluded.window_start THEN attempts + 1 ELSE 1 END
    RETURNING attempts
  `).bind(key, windowStart).first();
  return (row?.attempts || 1) <= 6;
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: cors(request) });
}

export async function onRequestGet({ request, env }) {
  const applicationId = new URL(request.url).searchParams.get("application") || "";
  if (!KEY_PATTERN.test(applicationId)) return json(request, { error: "Invalid application reference." }, 400);
  const row = await env.DB.prepare(`SELECT request_key, member_number, nickname, title, joined FROM member_requests WHERE request_key = ? AND member_number IS NOT NULL`).bind(applicationId).first();
  return row ? json(request, { member: memberJson(row) }) : json(request, { error: "Credential not found." }, 404);
}

export async function onRequestPost({ request, env }) {
  try {
    if (!(await rateAllowed(request, env.DB))) return json(request, { error: "Too many applications. Please wait one minute." }, 429);
    const payload = await request.json();
    const applicationId = normalize(payload.applicationId, 36);
    const name = normalize(payload.name, 24);
    const role = normalize(payload.role, 42);
    const custom = payload.custom === true;
    if (!KEY_PATTERN.test(applicationId)) return json(request, { error: "Invalid application reference." }, 400);
    if (name.length < 2 || name.length > 24 || !TEXT_PATTERN.test(name)) return json(request, { error: "Nickname must contain 2–24 valid characters." }, 400);
    if (role.length < 2 || role.length > 42 || !TEXT_PATTERN.test(role) || (!custom && !ALLOWED_TITLES.has(role))) return json(request, { error: "Please choose or enter a valid title." }, 400);

    const existing = await env.DB.prepare(`SELECT request_key, member_number, nickname, title, joined FROM member_requests WHERE request_key = ?`).bind(applicationId).first();
    if (existing) {
      if (existing.nickname !== name || existing.title !== role) return json(request, { error: "This application reference is already in use." }, 409);
      return json(request, { member: memberJson(existing) });
    }

    const joined = new Date().toISOString().slice(0, 10);
    await env.DB.prepare(`INSERT INTO member_requests (request_key, nickname, title, joined) VALUES (?, ?, ?, ?) ON CONFLICT(request_key) DO NOTHING`).bind(applicationId, name, role, joined).run();
    const member = await env.DB.prepare(`SELECT request_key, member_number, nickname, title, joined FROM member_requests WHERE request_key = ? AND member_number IS NOT NULL`).bind(applicationId).first();
    if (!member) throw new Error("Number allocation failed");
    return json(request, { member: memberJson(member) }, 201);
  } catch (error) {
    console.error("Membership allocation failed", error);
    return json(request, { error: "Nothing encountered something. Please try again." }, 500);
  }
}
