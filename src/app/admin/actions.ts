"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { z } from "zod";
import {
  endSession,
  passwordIsCorrect,
  requestInfo,
  requireAdmin,
  startSession,
} from "@/lib/auth";
import { lockedOutFor, readAuthSettings, recordSignIn } from "@/lib/auth/store";
import { CONTENT_TAG, readContent } from "@/lib/content";
import {
  CONTENT_SECTIONS,
  emptyImage,
  siteContentSchema,
  type ContentSection,
  type Service,
  type SiteContent,
} from "@/lib/content/schema";
import { contentStorage } from "@/lib/content/storage";

export type SaveResult =
  | { ok: true; savedAt: string; slug?: string }
  | { ok: false; message: string; issues: string[] };

/* -------------------------------------------------------------------------- */
/* Sign in / out                                                              */
/* -------------------------------------------------------------------------- */

export type LoginState = { error?: string };

export async function login(_previous: LoginState, formData: FormData): Promise<LoginState> {
  const settings = await readAuthSettings();
  if (!settings.passwordHash && !process.env.ADMIN_PASSWORD) {
    return { error: "The admin password hasn't been set on the server yet." };
  }

  const { ip, agent } = await requestInfo();
  const waitMs = lockedOutFor(settings, ip);
  if (waitMs > 0) {
    const minutes = Math.ceil(waitMs / 60_000);
    return {
      error: `Too many wrong passwords. Try again in ${minutes} minute${minutes === 1 ? "" : "s"}.`,
    };
  }

  const ok = await passwordIsCorrect(String(formData.get("password") ?? ""), settings);
  await recordSignIn({ at: new Date().toISOString(), ok, ip, agent });
  if (!ok) {
    // Slow down password guessing.
    await new Promise((resolve) => setTimeout(resolve, 800));
    return { error: "That password isn't right. Please try again." };
  }

  await startSession();
  const next = String(formData.get("next") ?? "");
  redirect(next.startsWith("/admin") && !next.startsWith("/admin/login") ? next : "/admin");
}

export async function logout() {
  await endSession();
  redirect("/admin/login");
}

/* -------------------------------------------------------------------------- */
/* Saving                                                                     */
/* -------------------------------------------------------------------------- */

// One save at a time, so two quick saves can't overwrite each other's changes.
let queue: Promise<unknown> = Promise.resolve();

/** "home.hero.titleLine1" → "Home › Hero › Title line 1" */
function describePath(path: PropertyKey[]) {
  return path
    .map((part) =>
      typeof part === "number"
        ? `#${part + 1}`
        : String(part)
            .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
            .toLowerCase()
            .replace(/^\w/, (c) => c.toUpperCase()),
    )
    .join(" › ");
}

function describeIssues(issues: z.core.$ZodIssue[]) {
  return issues.slice(0, 8).map((issue) => `${describePath(issue.path)}: ${issue.message}`);
}

/** Read → change → validate → write → refresh the site, under the save lock. */
async function commit(
  change: (content: SiteContent) => SiteContent | { error: string },
): Promise<SaveResult> {
  const run = queue.then(async (): Promise<SaveResult> => {
    const next = change(await readContent());
    if ("error" in next) return { ok: false, message: next.error, issues: [] };

    const parsed = siteContentSchema.safeParse(next);
    if (!parsed.success) {
      return {
        ok: false,
        message: "Some fields need fixing before this can be saved.",
        issues: describeIssues(parsed.error.issues),
      };
    }

    await contentStorage.write(parsed.data);
    updateTag(CONTENT_TAG);
    return { ok: true, savedAt: new Date().toISOString() };
  });
  queue = run.catch(() => undefined);

  try {
    return await run;
  } catch (error) {
    console.error("Saving content failed", error);
    return { ok: false, message: "The changes couldn't be saved. Please try again.", issues: [] };
  }
}

/** Saves whole sections (e.g. { home }), replacing what's stored for them. */
export async function saveContent(patch: Partial<SiteContent>): Promise<SaveResult> {
  await requireAdmin();
  const keys = Object.keys(patch) as ContentSection[];
  if (keys.length === 0 || !keys.every((key) => CONTENT_SECTIONS.includes(key))) {
    return { ok: false, message: "Nothing to save.", issues: [] };
  }
  return commit((current) => ({ ...current, ...patch }));
}

/* -------------------------------------------------------------------------- */
/* Services                                                                   */
/* -------------------------------------------------------------------------- */

function newService(slug: string): Service {
  return {
    slug,
    title: "New Service",
    description: "",
    image: emptyImage(),
    badge: "",
    subtitle: "",
    overview: "",
    capabilitiesEyebrow: "Core Capabilities",
    capabilities: [],
    gallery: [],
  };
}

export async function createService() {
  await requireAdmin();
  let slug = "";
  const result = await commit((content) => {
    const taken = new Set(content.services.map((service) => service.slug));
    slug = "new-service";
    for (let n = 2; taken.has(slug); n++) slug = `new-service-${n}`;
    return { ...content, services: [...content.services, newService(slug)] };
  });
  if (!result.ok) return result;
  redirect(`/admin/services/${slug}`);
}

/** Saves one service. `originalSlug` finds it even when the slug itself was changed. */
export async function saveService(originalSlug: string, service: Service): Promise<SaveResult> {
  await requireAdmin();
  const result = await commit((content) => {
    const index = content.services.findIndex((item) => item.slug === originalSlug);
    if (index === -1) return { error: "This service no longer exists. It may have been deleted." };
    const services = [...content.services];
    services[index] = service;
    return { ...content, services };
  });
  return result.ok ? { ...result, slug: service.slug } : result;
}

export async function deleteService(slug: string): Promise<SaveResult> {
  await requireAdmin();
  return commit((content) => ({
    ...content,
    services: content.services.filter((service) => service.slug !== slug),
  }));
}

export async function moveService(slug: string, direction: -1 | 1): Promise<SaveResult> {
  await requireAdmin();
  return commit((content) => {
    const services = [...content.services];
    const from = services.findIndex((service) => service.slug === slug);
    const to = from + direction;
    if (from === -1 || to < 0 || to >= services.length) return content;
    [services[from], services[to]] = [services[to], services[from]];
    return { ...content, services };
  });
}
