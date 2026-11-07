import "server-only";
import { access, mkdir, rm, statfs, writeFile } from "node:fs/promises";
import path from "node:path";
import nextPackage from "next/package.json";
import { readAuthSettings, LOCKOUT } from "@/lib/auth/store";
import { readContent } from "@/lib/content";
import { SOCIAL_LABELS, serviceHref } from "@/lib/content/links";
import { siteContentSchema, type SiteContent, type SiteImage } from "@/lib/content/schema";
import { STORAGE_DIR, contentStorage, mediaStorage } from "@/lib/content/storage";

/* Checks behind the admin's Website health page. */

export type Severity = "ok" | "warning" | "problem";

export type Check = {
  label: string;
  value: string;
  severity: Severity;
  /** A time to show after the value, in the viewer's timezone. */
  at?: string;
  detail?: string;
};

export type ContentIssue = {
  severity: Exclude<Severity, "ok">;
  where: string;
  message: string;
  /** The admin page where it can be fixed. */
  href: string;
};

export type HealthReport = {
  content: ContentIssue[];
  storage: Check[];
  unusedUploads: { count: number; bytes: number };
  security: Check[];
  server: Check[];
};

const UPLOAD_REFERENCE = /\/uploads\/([0-9a-f-]{36}\.(?:webp|png|jpg))/g;

export function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  const units = ["KB", "MB", "GB", "TB"];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

function formatDuration(seconds: number) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (days) return `${days} day${days === 1 ? "" : "s"}, ${hours} h`;
  if (hours) return `${hours} h ${minutes} min`;
  return `${minutes} min`;
}

/* ---------- Content ---------- */

type ImageSlot = { image: SiteImage; where: string; href: string; required?: boolean };

function imageSlots(content: SiteContent): ImageSlot[] {
  const slots: ImageSlot[] = [
    { image: content.home.hero.image, where: "Home › Hero", href: "/admin/home", required: true },
    { image: content.home.about.image, where: "Home › About section", href: "/admin/home" },
    { image: content.about.hero.image, where: "About › Hero", href: "/admin/about", required: true },
    { image: content.about.whoWeAre.image, where: "About › Who we are", href: "/admin/about" },
  ];
  content.about.experience.items.forEach((item, i) =>
    slots.push({
      image: item.image,
      where: `About › Experience › ${item.title || `#${i + 1}`}`,
      href: "/admin/about",
    }),
  );
  for (const service of content.services) {
    const href = `/admin/services/${service.slug}`;
    slots.push({ image: service.image, where: `Services › ${service.title} › Card`, href });
    service.gallery.forEach((image, i) =>
      slots.push({ image, where: `Services › ${service.title} › Photo ${i + 1}`, href }),
    );
  }
  content.works.projects.forEach((project, p) =>
    project.shots.forEach((shot, s) =>
      slots.push({
        image: shot.image,
        where: `Works › ${project.title || `Project ${p + 1}`} › ${shot.caption || `Photo ${s + 1}`}`,
        href: "/admin/works",
      }),
    ),
  );
  return slots;
}

async function imageExists(src: string, uploads: Set<string>) {
  if (src.startsWith("/uploads/")) return uploads.has(src.slice("/uploads/".length));
  try {
    await access(path.join(/*turbopackIgnore: true*/ process.cwd(), "public", decodeURIComponent(src)));
    return true;
  } catch {
    return false;
  }
}

/** Placeholder social links point at the platform's home page rather than a profile. */
function isPlaceholderUrl(url: string) {
  try {
    const { pathname, search } = new URL(url);
    return (pathname === "/" || pathname === "") && !search;
  } catch {
    return true;
  }
}

async function contentIssues(content: SiteContent): Promise<ContentIssue[]> {
  const issues: ContentIssue[] = [];
  const uploads = new Set((await mediaStorage.list()).map((file) => file.fileName));

  for (const { image, where, href, required } of imageSlots(content)) {
    if (!image.src) {
      issues.push({
        severity: required ? "problem" : "warning",
        where,
        message: required ? "Has no image." : "No photo yet, so the frame shows empty.",
        href,
      });
    } else if (!(await imageExists(image.src, uploads))) {
      issues.push({ severity: "problem", where, message: "The image file is missing.", href });
    } else if (!image.alt) {
      issues.push({ severity: "warning", where, message: "Image has no description for screen readers.", href });
    }
  }

  const { contact } = content;
  if (!contact.email) {
    issues.push({
      severity: "problem",
      where: "Contact › Email",
      message: "No email address, so quote requests have nowhere to go.",
      href: "/admin/contact",
    });
  }
  if (!contact.phone) {
    issues.push({ severity: "warning", where: "Contact › Phone", message: "No phone number.", href: "/admin/contact" });
  }
  for (const social of contact.socials) {
    if (isPlaceholderUrl(social.url)) {
      issues.push({
        severity: "warning",
        where: `Contact › Social links › ${SOCIAL_LABELS[social.platform]}`,
        message: "Points to the platform's home page, not your profile.",
        href: "/admin/contact",
      });
    }
  }

  if (content.services.length === 0) {
    issues.push({ severity: "warning", where: "Services", message: "There are no services.", href: "/admin/services" });
  }
  for (const service of content.services) {
    const where = `Services › ${service.title}`;
    const href = `/admin/services/${service.slug}`;
    if (!service.description) issues.push({ severity: "warning", where, message: "Card has no text.", href });
    if (!service.overview) issues.push({ severity: "warning", where, message: "Page has no overview paragraph.", href });
    if (service.capabilities.length === 0) {
      issues.push({ severity: "warning", where, message: "Page lists no capabilities.", href });
    }
  }
  content.works.projects.forEach((project, i) => {
    if (!project.title) {
      issues.push({ severity: "warning", where: `Works › Project ${i + 1}`, message: "Project has no name.", href: "/admin/works" });
    }
  });

  return issues.sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "problem" ? -1 : 1));
}

/* ---------- Storage ---------- */

/** Uploaded files that neither the current content nor any kept version uses. */
export async function findUnusedUploads() {
  const referenced = new Set<string>();
  const texts = [JSON.stringify(await readContent()), ...(await contentStorage.history()).map((v) => v.json)];
  for (const text of texts) {
    for (const match of text.matchAll(UPLOAD_REFERENCE)) referenced.add(match[1]);
  }
  return (await mediaStorage.list()).filter((file) => !referenced.has(file.fileName));
}

async function storageWritable() {
  try {
    await mkdir(STORAGE_DIR, { recursive: true });
    const probe = path.join(STORAGE_DIR, `.health-${process.pid}.tmp`);
    await writeFile(probe, "ok");
    await rm(probe, { force: true });
    return true;
  } catch {
    return false;
  }
}

async function storageChecks(): Promise<{ checks: Check[]; unusedUploads: HealthReport["unusedUploads"] }> {
  const checks: Check[] = [];
  const production = process.env.NODE_ENV === "production";

  checks.push(
    (await storageWritable())
      ? { label: "Storage folder", value: "Can be written to", severity: "ok", detail: STORAGE_DIR }
      : { label: "Storage folder", value: "Can't be written to, so saves and uploads will fail", severity: "problem", detail: STORAGE_DIR },
  );
  checks.push(
    production && !process.env.CONTENT_DIR
      ? {
          label: "Location",
          value: "Inside the site's own folder",
          severity: "warning",
          detail: "A redeploy could replace it. Set CONTENT_DIR to a folder outside the site and back it up.",
        }
      : { label: "Location", value: process.env.CONTENT_DIR ? "Set by CONTENT_DIR" : "Default folder", severity: "ok" },
  );

  const saved = await contentStorage.stat();
  const raw = await contentStorage.read();
  if (!saved || raw === null) {
    checks.push({ label: "Saved content", value: "Nothing saved yet; showing the default content", severity: "ok" });
  } else if (!siteContentSchema.safeParse(raw).success) {
    checks.push({
      label: "Saved content",
      value: "Unreadable, so the site is showing the default content",
      severity: "problem",
      detail: "Restore a recent version from the history folder.",
    });
  } else {
    checks.push({ label: "Saved content", value: `${formatBytes(saved.size)}, last saved`, at: saved.modified.toISOString(), severity: "ok" });
  }

  const versions = await contentStorage.history();
  checks.push({
    label: "Earlier versions kept",
    value: versions.length ? `${versions.length}, oldest from` : "None yet",
    at: versions.at(-1)?.savedAt.toISOString(),
    severity: "ok",
  });

  const uploads = await mediaStorage.list();
  checks.push({
    label: "Uploaded images",
    value: `${uploads.length} (${formatBytes(uploads.reduce((sum, file) => sum + file.size, 0))})`,
    severity: "ok",
  });

  const unused = await findUnusedUploads();
  const unusedBytes = unused.reduce((sum, file) => sum + file.size, 0);

  try {
    const disk = await statfs(STORAGE_DIR);
    const free = disk.bavail * disk.bsize;
    const total = disk.blocks * disk.bsize;
    checks.push({
      label: "Free disk space",
      value: `${formatBytes(free)} of ${formatBytes(total)}`,
      severity: free < 200 * 1024 ** 2 ? "problem" : free < 1024 ** 3 ? "warning" : "ok",
    });
  } catch {
    checks.push({ label: "Free disk space", value: "Couldn't be measured", severity: "warning" });
  }

  return { checks, unusedUploads: { count: unused.length, bytes: unusedBytes } };
}

/* ---------- Security & server ---------- */

async function securityChecks(): Promise<Check[]> {
  const settings = await readAuthSettings();
  const checks: Check[] = [];

  if (settings.passwordHash) {
    checks.push({ label: "Admin password", value: "Set in the dashboard on", at: settings.passwordChangedAt ?? undefined, severity: "ok" });
  } else {
    const weak = (process.env.ADMIN_PASSWORD ?? "").length < 10;
    checks.push({
      label: "Admin password",
      value: weak ? "The server password is short" : "From the server's ADMIN_PASSWORD setting",
      severity: weak ? "warning" : "ok",
      detail: weak ? "Change it in Login settings to at least 10 characters." : undefined,
    });
  }

  checks.push({
    label: "Sign-ins last",
    value: `${settings.sessionDays} day${settings.sessionDays === 1 ? "" : "s"}`,
    severity: "ok",
  });

  const dayAgo = Date.now() - 24 * 60 * 60 * 1000;
  const failed = settings.events.filter((event) => !event.ok && Date.parse(event.at) > dayAgo).length;
  checks.push({
    label: "Wrong passwords (24 h)",
    value: String(failed),
    severity: failed >= LOCKOUT.attempts ? "warning" : "ok",
    detail: failed >= LOCKOUT.attempts ? "Someone may be guessing. Review Login settings › Recent sign-ins." : undefined,
  });

  const production = process.env.NODE_ENV === "production";
  checks.push({
    label: "Secure sign-in cookie",
    value: production ? "Sent over HTTPS only" : "Not enforced (development mode)",
    severity: production ? "ok" : "warning",
  });
  return checks;
}

function serverChecks(): Check[] {
  const production = process.env.NODE_ENV === "production";
  return [
    { label: "Mode", value: production ? "Production" : "Development", severity: production ? "ok" : "warning" },
    { label: "Running for", value: formatDuration(process.uptime()), severity: "ok" },
    { label: "Memory in use", value: formatBytes(process.memoryUsage().rss), severity: "ok" },
    { label: "Next.js", value: nextPackage.version, severity: "ok" },
    { label: "Node.js", value: process.version.replace(/^v/, ""), severity: "ok" },
  ];
}

export async function getHealthReport(): Promise<HealthReport> {
  const content = await readContent();
  const [issues, storage, security] = await Promise.all([
    contentIssues(content),
    storageChecks(),
    securityChecks(),
  ]);
  return {
    content: issues,
    storage: storage.checks,
    unusedUploads: storage.unusedUploads,
    security,
    server: serverChecks(),
  };
}

/** Problem and warning counts across a report (page checks are counted separately). */
export function summarise(report: HealthReport) {
  const all = [...report.content, ...report.storage, ...report.security, ...report.server];
  return {
    problems: all.filter((item) => item.severity === "problem").length,
    warnings: all.filter((item) => item.severity === "warning").length,
  };
}

/** Public pages to request in the live check. */
export async function pagesToCheck() {
  const { services } = await readContent();
  return [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/services", label: "Services" },
    ...services.map((service) => ({ path: serviceHref(service), label: service.title })),
    { path: "/works", label: "Works" },
    { path: "/contact", label: "Contact" },
  ];
}
