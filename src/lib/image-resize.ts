/**
 * Client-side downscale + re-encode, applied to every gallery upload.
 *
 * The bucket stores exactly one "master" per image; `next/image` derives the
 * grid thumbnails from it on demand. So the master only has to be large enough
 * for the lightbox — the grid never needs more than ~840 device px. Anything
 * bigger is pure storage and egress cost, and (because the lightbox renders a
 * plain <img> from the raw object) a direct download hit for the visitor.
 *
 * Browser-only: uses `createImageBitmap` and `<canvas>`. A Node equivalent
 * would need `sharp` instead.
 */

/** Longest edge of a stored master. Sized for the lightbox, not the grid. */
const MAX_EDGE = 1600;

/** Quality steps down until the blob fits or hits the floor. */
const MAX_BYTES = 600_000;

const QUALITY_START = 0.8;
const QUALITY_FLOOR = 0.6;
const QUALITY_STEP = 0.08;

/** Formats to leave untouched when a file is already small. */
const PASSTHROUGH_TYPES = new Set(["image/jpeg", "image/webp"]);

export interface PreparedImage {
  blob: Blob;
  /** Extension matching `blob.type` — the storage path must agree with it. */
  extension: string;
  contentType: string;
  /** True when the original was uploaded as-is (already within budget). */
  passthrough: boolean;
}

/**
 * Whether this browser can *encode* WebP from a canvas.
 *
 * Worth checking explicitly: per spec, `toBlob`/`toDataURL` silently fall back
 * to PNG for an unsupported type rather than failing. Encoding a photo as PNG
 * is the exact problem this module exists to prevent, so we never want to hit
 * that path by accident. Safari supported WebP *decoding* long before it
 * supported encoding, so this is a real branch, not a theoretical one.
 */
let webpEncodable: boolean | undefined;
function canEncodeWebp(): boolean {
  if (webpEncodable === undefined) {
    const probe = document.createElement("canvas");
    probe.width = probe.height = 1;
    webpEncodable = probe.toDataURL("image/webp").startsWith("data:image/webp");
  }
  return webpEncodable;
}

function encode(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/**
 * Resizes `file` to fit within MAX_EDGE and re-encodes it under MAX_BYTES.
 *
 * Returns the original untouched when it's already within budget and in a
 * format we'd have produced anyway — re-encoding those would spend a second
 * generation of lossy compression for nothing.
 *
 * Throws on undecodable input; callers should skip that file rather than fall
 * back to uploading the original, which would defeat the purpose.
 */
export async function prepareImageForUpload(file: File): Promise<PreparedImage> {
  let source: ImageBitmap;
  try {
    source = await createImageBitmap(file);
  } catch {
    throw new Error("could not be decoded as an image");
  }

  try {
    const longEdge = Math.max(source.width, source.height);

    if (
      longEdge <= MAX_EDGE &&
      file.size <= MAX_BYTES &&
      PASSTHROUGH_TYPES.has(file.type)
    ) {
      return {
        blob: file,
        extension: file.type === "image/webp" ? "webp" : "jpg",
        contentType: file.type,
        passthrough: true,
      };
    }

    // Never upscale — a small PNG still gets re-encoded, just not enlarged.
    const scale = Math.min(1, MAX_EDGE / longEdge);
    const width = Math.round(source.width * scale);
    const height = Math.round(source.height * scale);

    // `resizeQuality: "high"` matters here: a plain drawImage downscale from
    // 4000px to 1600px in one step comes out soft and aliased.
    const scaled =
      scale < 1
        ? await createImageBitmap(source, {
            resizeWidth: width,
            resizeHeight: height,
            resizeQuality: "high",
          })
        : source;

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("canvas is unavailable");

    /** JPEG has no alpha — flatten onto white so transparency doesn't go black. */
    const paint = (target: string) => {
      ctx.clearRect(0, 0, width, height);
      if (target === "image/jpeg") {
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, width, height);
      }
      ctx.drawImage(scaled, 0, 0, width, height);
    };

    let type = canEncodeWebp() ? "image/webp" : "image/jpeg";
    paint(type);

    let quality = QUALITY_START;
    let blob = await encode(canvas, type, quality);

    // Belt-and-braces against the silent PNG fallback described above: repaint
    // from the bitmap (not the canvas — that would composite it onto itself)
    // so the white backdrop lands underneath the image rather than over it.
    if (blob && blob.type !== type) {
      webpEncodable = false;
      type = "image/jpeg";
      paint(type);
      blob = await encode(canvas, type, quality);
    }

    // Step quality down until it fits. Rarely fires — a 1600px photo at q80 is
    // typically 150-300 KB; only genuinely noisy content overshoots.
    while (blob && blob.size > MAX_BYTES && quality > QUALITY_FLOOR) {
      quality = Math.max(QUALITY_FLOOR, quality - QUALITY_STEP);
      blob = await encode(canvas, type, quality);
    }

    if (scaled !== source) scaled.close();
    if (!blob) throw new Error("could not be re-encoded");

    return {
      blob,
      extension: blob.type === "image/webp" ? "webp" : "jpg",
      contentType: blob.type,
      passthrough: false,
    };
  } finally {
    source.close();
  }
}
