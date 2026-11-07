import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { seedContent } from "./seed";
import { siteContentSchema, type SiteContent } from "./schema";
import { contentStorage } from "./storage";

/** Cache tag on everything rendered from the content; saving invalidates it. */
export const CONTENT_TAG = "site-content";

/** Reads the saved content straight from storage, falling back to the seed. */
export async function readContent(): Promise<SiteContent> {
  const raw = await contentStorage.read();
  if (raw === null) return seedContent;
  const parsed = siteContentSchema.safeParse(raw);
  if (parsed.success) return parsed.data;
  // Shouldn't happen (every save is validated), but never take the site down over it.
  console.error("Saved site content is invalid; showing the default content.", parsed.error.issues);
  return seedContent;
}

/** Content for rendering the public site. Cached until an admin save invalidates it. */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("max");
  cacheTag(CONTENT_TAG);
  return readContent();
}
