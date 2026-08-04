import { createClient } from "@/lib/supabase/server";
import { type CategorySlug, type GalleryImage } from "@/lib/gallery";

export { imageUrl } from "@/lib/gallery-client";

/** Fetches all images for a category, ordered by the admin-defined position. */
export async function getImagesByCategory(
  category: CategorySlug,
): Promise<GalleryImage[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("images")
    .select("*")
    .eq("category", category)
    .order("position", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Failed to fetch gallery images:", error.message);
    return [];
  }
  return (data ?? []) as GalleryImage[];
}
