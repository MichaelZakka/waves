"use server";

import { refresh } from "next/cache";
import { headers } from "next/headers";
import { requireAdmin } from "@/lib/auth";
import { readContent } from "@/lib/content";
import { mediaStorage } from "@/lib/content/storage";
import { findUnusedUploads, formatBytes, pagesToCheck, type Severity } from "@/lib/health";

export type PageCheck = {
  path: string;
  label: string;
  status: number | null;
  ms: number;
  severity: Severity;
  note?: string;
};

/** Responses slower than this are flagged. */
const SLOW_MS = 3000;
const TIMEOUT_MS = 15000;

/** The site's own address: SITE_URL if set, otherwise the address the admin is using. */
async function siteOrigin() {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/+$/, "");
  const list = await headers();
  const host = list.get("x-forwarded-host") ?? list.get("host") ?? "localhost:3000";
  const protocol = list.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

async function timedRequest(url: string): Promise<Omit<PageCheck, "path" | "label">> {
  const started = performance.now();
  try {
    const response = await fetch(url, {
      cache: "no-store",
      redirect: "manual",
      signal: AbortSignal.timeout(TIMEOUT_MS),
      headers: { "user-agent": "ProfessionalWaves-HealthCheck" },
    });
    await response.arrayBuffer();
    const ms = Math.round(performance.now() - started);
    if (response.status !== 200) {
      return { status: response.status, ms, severity: "problem", note: `Answered with error ${response.status}` };
    }
    return ms > SLOW_MS
      ? { status: 200, ms, severity: "warning", note: "Slow to load" }
      : { status: 200, ms, severity: "ok" };
  } catch (error) {
    const ms = Math.round(performance.now() - started);
    const timedOut = error instanceof DOMException && error.name === "TimeoutError";
    return {
      status: null,
      ms,
      severity: "problem",
      note: timedOut ? `No answer within ${TIMEOUT_MS / 1000} seconds` : "Couldn't be reached",
    };
  }
}

/** Requests every public page (and one resized image) and reports how each answered. */
export async function checkPages(): Promise<PageCheck[]> {
  await requireAdmin();
  const origin = await siteOrigin();
  const pages = await pagesToCheck();
  const { hero } = (await readContent()).home;

  const checks = pages.map(async ({ path, label }) => ({ path, label, ...(await timedRequest(origin + path)) }));
  if (hero.image.src) {
    const path = `/_next/image?url=${encodeURIComponent(hero.image.src)}&w=640&q=75`;
    checks.push(
      timedRequest(origin + path).then((result) => ({ path, label: "Image resizing", ...result })),
    );
  }
  return Promise.all(checks);
}

export async function removeUnusedUploads(): Promise<{ count: number; freed: string }> {
  await requireAdmin();
  const unused = await findUnusedUploads();
  await Promise.all(unused.map((file) => mediaStorage.remove(file.fileName)));
  refresh();
  return {
    count: unused.length,
    freed: formatBytes(unused.reduce((sum, file) => sum + file.size, 0)),
  };
}
