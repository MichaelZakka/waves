import {
  createHash,
  createHmac,
  randomBytes,
  scrypt as scryptCallback,
  timingSafeEqual,
  type ScryptOptions,
} from "node:crypto";

/*
 * Password hashing and signed session tokens. No Next.js or storage imports,
 * so the proxy can use the cheap checks here too.
 */

export const SESSION_COOKIE = "pw_admin_session";

const DAY_MS = 24 * 60 * 60 * 1000;

function scrypt(password: string, salt: Buffer, length: number, options: ScryptOptions) {
  return new Promise<Buffer>((resolve, reject) =>
    scryptCallback(password, salt, length, options, (error, key) => (error ? reject(error) : resolve(key))),
  );
}

/** Constant-time comparison of two strings of any length. */
export function safeEqual(a: string, b: string) {
  const left = createHash("sha256").update(a).digest();
  const right = createHash("sha256").update(b).digest();
  return timingSafeEqual(left, right);
}

/* ---------- Passwords ---------- */

const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

/** "scrypt$N$r$p$salt$hash" */
export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, 64, SCRYPT);
  return ["scrypt", SCRYPT.N, SCRYPT.r, SCRYPT.p, salt.toString("base64url"), key.toString("base64url")].join("$");
}

export async function verifyPasswordHash(password: string, stored: string) {
  const [algorithm, N, r, p, salt, hash] = stored.split("$");
  if (algorithm !== "scrypt" || !salt || !hash) return false;
  const expected = Buffer.from(hash, "base64url");
  const key = await scrypt(password, Buffer.from(salt, "base64url"), expected.length, {
    N: Number(N),
    r: Number(r),
    p: Number(p),
    maxmem: SCRYPT.maxmem,
  });
  return timingSafeEqual(key, expected);
}

/* ---------- Session tokens: "<expiry ms>.<signature>" ---------- */

export function sessionKey(secret: string, epoch: number) {
  return createHash("sha256").update(`${secret}:${epoch}`).digest("hex");
}

function sign(expires: string, key: string) {
  return createHmac("sha256", key).update(`v2.${expires}`).digest("base64url");
}

export function createSessionToken(key: string, days: number, now = Date.now()) {
  const expires = String(now + days * DAY_MS);
  return `${expires}.${sign(expires, key)}`;
}

export function verifySessionToken(token: string | undefined, key: string, now = Date.now()) {
  if (!tokenLooksValid(token, now)) return false;
  const [expires, signature] = token!.split(".");
  return safeEqual(signature, sign(expires, key));
}

/**
 * Cheap check for the proxy: right shape and not expired. The signature is
 * verified by the app itself, which can read the signing key.
 */
export function tokenLooksValid(token: string | undefined, now = Date.now()) {
  if (!token) return false;
  const [expires, signature] = token.split(".");
  return /^\d+$/.test(expires ?? "") && Boolean(signature) && Number(expires) > now;
}
