// One-time migration: upload the old repo's gallery images into Supabase
// Storage and insert a metadata row per image.
//
// Usage (from akcentreklama-next/):
//   node scripts/migrate-images.mjs           # upload + insert
//   node scripts/migrate-images.mjs --dry-run # list what would happen, no writes
//
// Safe to re-run: storage uploads use upsert, and rows are upserted on the
// unique storage_path, so existing images are updated in place rather than
// duplicated.
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.
// The secret key bypasses RLS — this script is server-side/local only.

import { createClient } from "@supabase/supabase-js";
import { readFileSync, readdirSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

// Old static site lives next to the new project.
const OLD_IMAGES_DIR = resolve(PROJECT_ROOT, "../akcentreklama.bg/images");

const STORAGE_BUCKET = "gallery";
const DRY_RUN = process.argv.includes("--dry-run");

// old folder name -> new category slug (must match the DB CHECK constraint)
const CATEGORY_DIRS = {
  "screen-printing": "screen-printing",
  "vehicle-branding": "vehicle-branding",
  "outside-branding": "outdoor-advertising",
};

// --- load env from .env.local (no dotenv dependency) -----------------------
function loadEnv() {
  const raw = readFileSync(join(PROJECT_ROOT, ".env.local"), "utf8");
  const env = {};
  for (const line of raw.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim();
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.NEXT_PUBLIC_SUPABASE_URL;
const SECRET_KEY = env.SUPABASE_SECRET_KEY;

if (!SUPABASE_URL || !SECRET_KEY) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SECRET_KEY in .env.local",
  );
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SECRET_KEY, {
  auth: { persistSession: false, autoRefreshToken: false },
});

// Natural sort so "2.jpg" comes before "10.jpg".
const naturalSort = (a, b) =>
  a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" });

// Originals only — skip the pre-baked "Nthumb.jpg" thumbnails (Supabase
// generates thumbnails on the fly from the originals).
const isOriginalJpg = (name) =>
  /\.jpe?g$/i.test(name) && !/thumb/i.test(name);

async function migrateCategory(oldDir, category) {
  const dir = join(OLD_IMAGES_DIR, oldDir);
  let files;
  try {
    files = readdirSync(dir).filter(isOriginalJpg).sort(naturalSort);
  } catch {
    console.warn(`  ! folder not found, skipping: ${dir}`);
    return { uploaded: 0, failed: 0 };
  }

  console.log(`\n${category}  (${files.length} images from ${oldDir}/)`);

  let uploaded = 0;
  let failed = 0;

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const storagePath = `${category}/${file}`;
    const position = i;

    if (DRY_RUN) {
      console.log(`  [dry] ${storagePath}  (position ${position})`);
      uploaded++;
      continue;
    }

    try {
      const buffer = await readFile(join(dir, file));

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKET)
        .upload(storagePath, buffer, {
          contentType: "image/jpeg",
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { error: dbError } = await supabase
        .from("images")
        .upsert(
          { category, storage_path: storagePath, position },
          { onConflict: "storage_path" },
        );
      if (dbError) throw dbError;

      uploaded++;
      console.log(`  ✓ ${storagePath}  (position ${position})`);
    } catch (err) {
      failed++;
      console.error(`  ✗ ${storagePath}: ${err.message ?? err}`);
    }
  }

  return { uploaded, failed };
}

async function main() {
  console.log(
    `Migrating images -> Supabase Storage bucket "${STORAGE_BUCKET}"` +
      (DRY_RUN ? "  [DRY RUN — no writes]" : ""),
  );
  console.log(`Source: ${OLD_IMAGES_DIR}`);

  let totalUploaded = 0;
  let totalFailed = 0;

  for (const [oldDir, category] of Object.entries(CATEGORY_DIRS)) {
    const { uploaded, failed } = await migrateCategory(oldDir, category);
    totalUploaded += uploaded;
    totalFailed += failed;
  }

  console.log(
    `\nDone. ${totalUploaded} image(s) ${DRY_RUN ? "planned" : "migrated"}, ${totalFailed} failed.`,
  );
  if (totalFailed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
