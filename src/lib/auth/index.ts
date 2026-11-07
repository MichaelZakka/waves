import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  SESSION_COOKIE,
  createSessionToken,
  safeEqual,
  sessionKey,
  verifyPasswordHash,
  verifySessionToken,
} from "./session";
import { readAuthSettings, type AuthSettings } from "./store";

function keyFor(settings: AuthSettings) {
  return sessionKey(process.env.ADMIN_SESSION_SECRET || settings.secret, settings.epoch);
}

/** True once there's a password: one set from the dashboard, or ADMIN_PASSWORD. */
export async function isAdminConfigured() {
  const settings = await readAuthSettings();
  return Boolean(settings.passwordHash || process.env.ADMIN_PASSWORD);
}

/** Checks a password against the dashboard password, or ADMIN_PASSWORD if none is set. */
export async function passwordIsCorrect(candidate: string, settings?: AuthSettings) {
  const { passwordHash } = settings ?? (await readAuthSettings());
  if (passwordHash) return verifyPasswordHash(candidate, passwordHash);
  const fromEnvironment = process.env.ADMIN_PASSWORD;
  return Boolean(fromEnvironment) && safeEqual(candidate, fromEnvironment!);
}

export async function isAdmin() {
  // Session expiry depends on the current time, so this always runs per request.
  await connection();
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return false;
  return verifySessionToken(token, keyFor(await readAuthSettings()));
}

/** Use at the top of every admin page and Server Function. */
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/admin/login");
}

/** Signs this browser in (or re-signs it after the session key changed). */
export async function startSession(settings?: AuthSettings) {
  const current = settings ?? (await readAuthSettings());
  (await cookies()).set(SESSION_COOKIE, createSessionToken(keyFor(current), current.sessionDays), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: current.sessionDays * 24 * 60 * 60,
  });
}

export async function endSession() {
  (await cookies()).delete(SESSION_COOKIE);
}

/** Who's making this request, for the sign-in log and lockouts. */
export async function requestInfo() {
  const list = await headers();
  return {
    ip:
      list.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      list.get("x-real-ip")?.trim() ||
      "unknown",
    agent: (list.get("user-agent") ?? "").slice(0, 200),
  };
}
