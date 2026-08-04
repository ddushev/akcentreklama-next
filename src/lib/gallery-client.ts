import { STORAGE_BUCKET } from "@/lib/gallery";

/**
 * Builds a public URL for a stored image, optionally with an on-the-fly
 * transform (width/height/quality) served by Supabase's image CDN.
 * Pure function — safe to import in both client and server components.
 */
export function imageUrl(
  storagePath: string,
  transform?: { width?: number; height?: number; quality?: number },
): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const params = new URLSearchParams();
  if (transform?.width) params.set("width", String(transform.width));
  if (transform?.height) params.set("height", String(transform.height));
  if (transform?.quality) params.set("quality", String(transform.quality));

  const kind = params.toString() ? "render/image" : "object";
  const query = params.toString() ? `?${params}` : "";
  return `${base}/storage/v1/${kind}/public/${STORAGE_BUCKET}/${storagePath}${query}`;
}
