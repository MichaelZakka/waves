import sharp from "sharp";
import { isAdmin } from "@/lib/auth";
import { mediaStorage } from "@/lib/content/storage";

/** Largest file accepted from the browser (also allowed through the proxy in next.config.ts). */
const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;
/** Longest side of the stored image; plenty for full-width heroes, light enough to serve. */
const MAX_DIMENSION = 2400;
const ACCEPTED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif", "image/gif"]);

function fail(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

/**
 * Receives an image from the admin, normalises it (orientation, max size, WebP)
 * and stores it. Returns what an image slot needs: src, size and a blur preview.
 */
export async function POST(request: Request) {
  if (!(await isAdmin())) return fail("Your session has expired. Please sign in again.", 401);

  const file = (await request.formData()).get("file");
  if (!(file instanceof File)) return fail("No image was sent.", 400);
  if (file.size > MAX_UPLOAD_BYTES) return fail("That image is larger than 15 MB.", 413);
  if (!ACCEPTED_TYPES.has(file.type)) {
    return fail("Please upload a JPG, PNG, WebP, AVIF or GIF image.", 415);
  }

  try {
    const { data, info } = await sharp(Buffer.from(await file.arrayBuffer()), {
      limitInputPixels: 120_000_000,
    })
      .rotate()
      .resize({
        width: MAX_DIMENSION,
        height: MAX_DIMENSION,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82 })
      .toBuffer({ resolveWithObject: true });

    const blur = await sharp(data).resize(16, 16, { fit: "inside" }).webp({ quality: 40 }).toBuffer();
    const src = await mediaStorage.save(data, "webp");

    return Response.json({
      src,
      width: info.width,
      height: info.height,
      blurDataURL: `data:image/webp;base64,${blur.toString("base64")}`,
    });
  } catch (error) {
    console.error("Image upload failed", error);
    return fail("That file couldn't be read as an image.", 422);
  }
}
