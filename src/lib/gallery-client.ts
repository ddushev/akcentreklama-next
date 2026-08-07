import { STORAGE_BUCKET } from "@/lib/gallery";

/**
 * Builds the public URL for a stored image (the original object).
 *
 * We intentionally do NOT use Supabase's on-the-fly image transformation
 * (`render/image?width=...`) — that's a paid feature and returns 403
 * "FeatureNotEnabled" on the free plan. Instead we serve the original and let
 * Next.js's own image optimizer (`next/image`) resize it and emit WebP at the
 * sizes each context needs.
 *
 * Pure function — safe to import in both client and server components.
 */
export function imageUrl(storagePath: string): string {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  return `${base}/storage/v1/object/public/${STORAGE_BUCKET}/${storagePath}`;
}
