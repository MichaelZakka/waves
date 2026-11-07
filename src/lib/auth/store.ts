import "server-only";
import { randomBytes } from "node:crypto";
import { z } from "zod";
import { settingsStorage } from "@/lib/content/storage";

/* Admin login settings, kept next to the site content. */

export const SESSION_LENGTHS = [1, 7, 30] as const;

/** Sign-in attempts allowed from one address within the window before it's locked out. */
export const LOCKOUT = { attempts: 5, windowMinutes: 15 };

/** How many recent sign-in attempts are remembered. */
const EVENT_LIMIT = 50;

const signInEventSchema = z.object({
  at: z.string(),
  ok: z.boolean(),
  ip: z.string(),
  agent: z.string(),
});

const authSettingsSchema = z.object({
  /** scrypt hash set from the dashboard; null means ADMIN_PASSWORD is used. */
  passwordHash: z.string().nullable(),
  passwordChangedAt: z.string().nullable(),
  /** Random key that signs sessions (unless ADMIN_SESSION_SECRET is set). */
  secret: z.string().min(32),
  /** Bumped to invalidate every existing session. */
  epoch: z.number().int().min(0),
  sessionDays: z.union([z.literal(1), z.literal(7), z.literal(30)]),
  /** Newest first. */
  events: z.array(signInEventSchema),
});

export type SignInEvent = z.infer<typeof signInEventSchema>;
export type AuthSettings = z.infer<typeof authSettingsSchema>;

const KEY = "admin-auth";

function freshSettings(): AuthSettings {
  return {
    passwordHash: null,
    passwordChangedAt: null,
    secret: randomBytes(32).toString("hex"),
    epoch: 0,
    sessionDays: 7,
    events: [],
  };
}

// One write at a time, so a sign-in and a settings change can't overwrite each other.
let queue: Promise<unknown> = Promise.resolve();

async function readStored() {
  const parsed = authSettingsSchema.safeParse(await settingsStorage.read(KEY));
  return parsed.success ? parsed.data : null;
}

/** Applies a change to the settings and saves them (creating them on first use). */
export function updateAuthSettings(change: (settings: AuthSettings) => AuthSettings) {
  const run = queue.then(async () => {
    const next = change((await readStored()) ?? freshSettings());
    await settingsStorage.write(KEY, next);
    return next;
  });
  queue = run.catch(() => undefined);
  return run;
}

export async function readAuthSettings(): Promise<AuthSettings> {
  // The first read creates the settings, so the signing key stays stable.
  return (await readStored()) ?? updateAuthSettings((settings) => settings);
}

export function recordSignIn(event: SignInEvent) {
  return updateAuthSettings((settings) => ({
    ...settings,
    events: [event, ...settings.events].slice(0, EVENT_LIMIT),
  }));
}

/** Milliseconds until `ip` may try again, or 0 if it isn't locked out. */
export function lockedOutFor(settings: AuthSettings, ip: string, now = Date.now()) {
  const windowMs = LOCKOUT.windowMinutes * 60 * 1000;
  const recentFailures: SignInEvent[] = [];
  for (const event of settings.events) {
    if (event.ip !== ip) continue;
    if (event.ok || now - Date.parse(event.at) > windowMs) break;
    recentFailures.push(event);
  }
  if (recentFailures.length < LOCKOUT.attempts) return 0;
  const unlockAt = Date.parse(recentFailures[LOCKOUT.attempts - 1].at) + windowMs;
  return Math.max(0, unlockAt - now);
}
