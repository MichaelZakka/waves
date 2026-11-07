import { mediaStorage } from "@/lib/content/storage";

const CONTENT_TYPES: Record<string, string> = {
  webp: "image/webp",
  png: "image/png",
  jpg: "image/jpeg",
};

/**
 * Serves images uploaded from the admin. They live outside public/ because
 * Next.js only serves public/ files that existed at build time.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const data = await mediaStorage.read(file);
  if (!data) return new Response("Not found", { status: 404 });

  return new Response(new Uint8Array(data), {
    headers: {
      "Content-Type": CONTENT_TYPES[file.split(".").pop() ?? ""] ?? "application/octet-stream",
      // Every upload gets a new name, so a file never changes.
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
