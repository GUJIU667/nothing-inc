import { env } from "cloudflare:workers";

const allowedTitles = new Set([
  "CEO",
  "Chief Slacking Officer",
  "Chief Nothing Officer",
  "Global Sleep Director",
  "VP of Doing Nothing",
  "Chief Financial Freedom Officer",
  "Head of Talent Rejection",
  "Chief Unemployment Officer",
  "Director of Strategic Procrastination",
  "Chief Work-Life Balance Officer",
  "Intern",
]);

const textPattern = /^[\p{L}\p{N}\p{M} .,'’&()\-·]+$/u;
const requestKeyPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type MemberRow = {
  request_key: string;
  member_number: number;
  nickname: string;
  title: string;
  joined: string;
};

function database() {
  if (!env.DB) throw new Error("D1 binding DB is unavailable.");
  return env.DB;
}

function normalize(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().replace(/\s+/g, " ").slice(0, max) : "";
}

function memberJson(row: MemberRow) {
  return {
    applicationId: row.request_key,
    name: row.nickname,
    role: row.title,
    joined: row.joined,
    id: `NØ-${row.member_number.toString().padStart(6, "0")}`,
  };
}

async function fingerprint(request: Request) {
  const ip = request.headers.get("CF-Connecting-IP") ?? "local-preview";
  const day = new Date().toISOString().slice(0, 10);
  const bytes = new TextEncoder().encode(`${day}|${ip}|nothing-inc-v1.1`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function checkRateLimit(request: Request) {
  const db = database();
  const key = await fingerprint(request);
  const windowStart = Math.floor(Date.now() / 60_000) * 60_000;
  const result = await db.prepare(`
    INSERT INTO rate_limits (fingerprint, window_start, attempts)
    VALUES (?, ?, 1)
    ON CONFLICT(fingerprint) DO UPDATE SET
      window_start = CASE WHEN window_start = excluded.window_start THEN window_start ELSE excluded.window_start END,
      attempts = CASE WHEN window_start = excluded.window_start THEN attempts + 1 ELSE 1 END
    RETURNING attempts
  `).bind(key, windowStart).first<{ attempts: number }>();
  return (result?.attempts ?? 1) <= 6;
}

export async function GET(request: Request) {
  const applicationId = new URL(request.url).searchParams.get("application") ?? "";
  if (!requestKeyPattern.test(applicationId)) {
    return Response.json({ error: "Invalid application reference." }, { status: 400 });
  }

  const row = await database().prepare(`
    SELECT request_key, member_number, nickname, title, joined
    FROM member_requests WHERE request_key = ? AND member_number IS NOT NULL
  `).bind(applicationId).first<MemberRow>();

  if (!row) return Response.json({ error: "Credential not found." }, { status: 404 });
  return Response.json({ member: memberJson(row) }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  try {
    if (!(await checkRateLimit(request))) {
      return Response.json({ error: "Too many applications. Please wait one minute." }, { status: 429 });
    }

    const payload = await request.json() as { applicationId?: unknown; name?: unknown; role?: unknown; custom?: unknown };
    const applicationId = normalize(payload.applicationId, 36);
    const name = normalize(payload.name, 24);
    const role = normalize(payload.role, 42);
    const custom = payload.custom === true;

    if (!requestKeyPattern.test(applicationId)) {
      return Response.json({ error: "Invalid application reference." }, { status: 400 });
    }
    if (name.length < 2 || name.length > 24 || !textPattern.test(name)) {
      return Response.json({ error: "Nickname must contain 2–24 valid characters." }, { status: 400 });
    }
    if (role.length < 2 || role.length > 42 || !textPattern.test(role) || (!custom && !allowedTitles.has(role))) {
      return Response.json({ error: "Please choose or enter a valid title." }, { status: 400 });
    }

    const db = database();
    const existing = await db.prepare(`
      SELECT request_key, member_number, nickname, title, joined
      FROM member_requests WHERE request_key = ?
    `).bind(applicationId).first<MemberRow>();

    if (existing) {
      if (existing.nickname !== name || existing.title !== role) {
        return Response.json({ error: "This application reference is already in use." }, { status: 409 });
      }
      return Response.json({ member: memberJson(existing) }, { headers: { "Cache-Control": "no-store" } });
    }

    const joined = new Date().toISOString().slice(0, 10);
    await db.prepare(`
      INSERT INTO member_requests (request_key, nickname, title, joined)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(request_key) DO NOTHING
    `).bind(applicationId, name, role, joined).run();

    const member = await db.prepare(`
      SELECT request_key, member_number, nickname, title, joined
      FROM member_requests WHERE request_key = ? AND member_number IS NOT NULL
    `).bind(applicationId).first<MemberRow>();

    if (!member) throw new Error("Member number allocation did not complete.");
    return Response.json({ member: memberJson(member) }, { status: 201, headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error("Membership allocation failed", error);
    return Response.json({ error: "Nothing encountered something. Please try again." }, { status: 500 });
  }
}
