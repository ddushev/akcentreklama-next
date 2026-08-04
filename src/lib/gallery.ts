// Gallery categories — the single source of truth shared across the site.
// The `slug` is used in URLs (/gallery/<slug>) and stored on each image row.

export const CATEGORIES = [
  "screen-printing",
  "vehicle-branding",
  "outdoor-advertising",
] as const;

export type CategorySlug = (typeof CATEGORIES)[number];


// Maps a category slug to its i18n key under the "home.services" / "gallery" namespaces.
export const CATEGORY_I18N_KEY: Record<CategorySlug, string> = {
  "screen-printing": "screenPrinting",
  "vehicle-branding": "vehicleBranding",
  "outdoor-advertising": "outdoorAdvertising",
};

export function isCategory(value: string): value is CategorySlug {
  return (CATEGORIES as readonly string[]).includes(value);
}

// A gallery image row as stored in Postgres.
export interface GalleryImage {
  id: string;
  category: CategorySlug;
  storage_path: string;
  caption: string | null;
  position: number;
  created_at: string;
}

export const STORAGE_BUCKET = "gallery";
