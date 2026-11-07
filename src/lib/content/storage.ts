import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, readFile, readdir, rename, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";
import type { SiteContent } from "./schema";

/*
 * Where edited content, uploaded images and admin settings live. Each sits
 * behind a small interface so the file-based versions below can be swapped
 * for a database and cloud storage (e.g. on a serverless host) without
 * touching the rest of the app.
 */

export type StoredFile = { fileName: string; size: number; modified: Date };

export interface ContentStorage {
  /** The saved content, or null if nothing has been saved yet. */
  read(): Promise<unknown | null>;
  write(content: SiteContent): Promise<void>;
  /** Size and time of the last save, or null before the first save. */
  stat(): Promise<{ size: number; modified: Date } | null>;
  /** Earlier saved versions as raw JSON, newest first. */
  history(): Promise<{ savedAt: Date; json: string }[]>;
}

export interface MediaStorage {
  /** Stores an image and returns the public URL it's served from. */
  save(data: Buffer, extension: string): Promise<string>;
  /** Reads an uploaded file by its file name, or null if it doesn't exist. */
  read(fileName: string): Promise<Buffer | null>;
  list(): Promise<StoredFile[]>;
  remove(fileName: string): Promise<void>;
}

/** Small JSON documents such as the admin login settings. */
export interface SettingsStorage {
  read(key: string): Promise<unknown | null>;
  write(key: string, value: unknown): Promise<void>;
}

/** Root folder for saved data. Must be on a persistent disk in production. */
export const STORAGE_DIR = path.resolve(
  // Runtime data, not source: keep the bundler from tracing the whole project from here.
  /*turbopackIgnore: true*/ process.env.CONTENT_DIR ?? path.join(process.cwd(), "storage"),
);
const CONTENT_FILE = path.join(STORAGE_DIR, "site-content.json");
const HISTORY_DIR = path.join(STORAGE_DIR, "history");
const UPLOADS_DIR = path.join(STORAGE_DIR, "uploads");
const SETTINGS_DIR = path.join(STORAGE_DIR, "settings");
/** Previous versions kept, so an accidental save can be rolled back by hand. */
const HISTORY_LIMIT = 30;

/** Upload file names are generated, never user-supplied: <uuid>.<ext>. */
export const UPLOAD_NAME_PATTERN = /^[0-9a-f-]{36}\.(webp|png|jpg)$/;

function isMissing(error: unknown) {
  return (error as NodeJS.ErrnoException).code === "ENOENT";
}

async function writeAtomically(file: string, data: string | Buffer) {
  await mkdir(path.dirname(file), { recursive: true });
  const temp = `${file}.${randomUUID()}.tmp`;
  await writeFile(temp, data);
  await rename(temp, file);
}

async function readJson(file: string) {
  try {
    return JSON.parse(await readFile(file, "utf8")) as unknown;
  } catch (error) {
    if (isMissing(error)) return null;
    throw error;
  }
}

async function listFiles(dir: string, accept: (name: string) => boolean): Promise<StoredFile[]> {
  let names: string[];
  try {
    names = await readdir(dir);
  } catch (error) {
    if (isMissing(error)) return [];
    throw error;
  }
  return Promise.all(
    names.filter(accept).map(async (fileName) => {
      const info = await stat(path.join(dir, fileName));
      return { fileName, size: info.size, modified: info.mtime };
    }),
  );
}

const fileContentStorage: ContentStorage = {
  read: () => readJson(CONTENT_FILE),

  async write(content) {
    const json = JSON.stringify(content, null, 2);
    await writeAtomically(CONTENT_FILE, json);

    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await writeAtomically(path.join(HISTORY_DIR, `${stamp}.json`), json);
    const versions = (await readdir(HISTORY_DIR)).filter((name) => name.endsWith(".json")).sort();
    await Promise.all(
      versions
        .slice(0, Math.max(0, versions.length - HISTORY_LIMIT))
        .map((name) => rm(path.join(HISTORY_DIR, name), { force: true })),
    );
  },

  async stat() {
    try {
      const info = await stat(CONTENT_FILE);
      return { size: info.size, modified: info.mtime };
    } catch (error) {
      if (isMissing(error)) return null;
      throw error;
    }
  },

  async history() {
    const versions = await listFiles(HISTORY_DIR, (name) => name.endsWith(".json"));
    const sorted = versions.sort((a, b) => b.modified.getTime() - a.modified.getTime());
    return Promise.all(
      sorted.map(async ({ fileName, modified }) => ({
        savedAt: modified,
        json: await readFile(path.join(HISTORY_DIR, fileName), "utf8"),
      })),
    );
  },
};

const fileMediaStorage: MediaStorage = {
  async save(data, extension) {
    const fileName = `${randomUUID()}.${extension}`;
    await writeAtomically(path.join(UPLOADS_DIR, fileName), data);
    return `/uploads/${fileName}`;
  },

  async read(fileName) {
    if (!UPLOAD_NAME_PATTERN.test(fileName)) return null;
    try {
      return await readFile(path.join(UPLOADS_DIR, fileName));
    } catch (error) {
      if (isMissing(error)) return null;
      throw error;
    }
  },

  list: () => listFiles(UPLOADS_DIR, (name) => UPLOAD_NAME_PATTERN.test(name)),

  async remove(fileName) {
    if (!UPLOAD_NAME_PATTERN.test(fileName)) return;
    await rm(path.join(UPLOADS_DIR, fileName), { force: true });
  },
};

const fileSettingsStorage: SettingsStorage = {
  read: (key) => readJson(path.join(SETTINGS_DIR, `${key}.json`)),
  write: (key, value) =>
    writeAtomically(path.join(SETTINGS_DIR, `${key}.json`), JSON.stringify(value, null, 2)),
};

export const contentStorage: ContentStorage = fileContentStorage;
export const mediaStorage: MediaStorage = fileMediaStorage;
export const settingsStorage: SettingsStorage = fileSettingsStorage;
