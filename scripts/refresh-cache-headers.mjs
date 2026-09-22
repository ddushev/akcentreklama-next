// One-time maintenance: re-upload every gallery object in place so it carries a
// long Cache-Control header.
//
// Older objects were stored with Supabase's default `max-age=3600`, so browsers
// re-request the full-size lightbox images every hour. Re-uploading the same
// bytes to the same path with `cacheControl` fixed gives them a year instead.
//
// Nothing else changes: same storage paths, and the `images` table is never
// touched, so gallery order (the `position` column) stays exactly as it is.
//
// Usage (from akcentreklama-next/):
//   node scripts/refresh-cache-headers.mjs           # re-upload what needs it
//   node scripts/refresh-cache-headers.mjs --dry-run # list, no writes
//   node scripts/refresh-cache-headers.mjs --all     # re-upload everything
//
// Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SECRET_KEY.
// The secret key bypasses RLS — local/server-side only.

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "node:fs";
import { join, dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = resolve(__dirname, "..");

const STORAGE_BUCKET = "gallery";
const CACHE_CONTROL = "31536000"; // one year, in seconds
const DRY_RUN = process.argv.includes("--dry-run");
const FORCE_ALL = process.argv.includes("--all");

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

/** Lists every object under a folder, paging through the 100-item default. */
async function listFolder(folder) {
  const objects = [];
  const pageSize = 100;
  for (let offset = 0; ; offset += pageSize) {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .list(folder, { limit: pageSize, offset });
    if (error) throw error;
    if (!data || data.length === 0) break;
    // Entries without metadata are sub-folders, not files.
    objects.push(...data.filter((entry) => entry.metadata));
    if (data.length < pageSize) break;
  }
  return objects;
}

/** The categories are top-level folders in the bucket. */
async function listFolders() {
  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .list("", { limit: 100 });
  if (error) throw error;
  return (data ?? []).filter((entry) => !entry.metadata).map((e) => e.name);
}

async function refreshObject(path, metadata) {
  // Download the exact bytes we already have, then put them back with the
  // header fixed. `upsert` keeps the same path, so no URL changes.
  const { data: blob, error: downloadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .download(path);
  if (downloadError) throw downloadError;

  const buffer = Buffer.from(await blob.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, {
      contentType: metadata.mimetype ?? blob.type ?? "image/jpeg",
      cacheControl: CACHE_CONTROL,
      upsert: true,
    });
  if (uploadError) throw uploadError;
}

async function main() {
  console.log(
    `Refreshing Cache-Control to max-age=${CACHE_CONTROL} in bucket "${STORAGE_BUCKET}"` +
      (DRY_RUN ? "  [DRY RUN — no writes]" : ""),
  );

  const folders = await listFolders();
  let updated = 0;
  let skipped = 0;
  let failed = 0;

  for (const folder of folders) {
    const objects = await listFolder(folder);
    console.log(`\n${folder}  (${objects.length} objects)`);

    for (const object of objects) {
      const path = `${folder}/${object.name}`;
      const current = object.metadata?.cacheControl ?? "";

      if (!FORCE_ALL && current === `max-age=${CACHE_CONTROL}`) {
        skipped++;
        continue;
      }

      if (DRY_RUN) {
        console.log(`  [dry] ${path}  (${current || "no cacheControl"})`);
        updated++;
        continue;
      }

      try {
        await refreshObject(path, object.metadata ?? {});
        updated++;
        console.log(`  ✓ ${path}  (was ${current || "unset"})`);
      } catch (err) {
        failed++;
        console.error(`  ✗ ${path}: ${err.message ?? err}`);
      }
    }
  }

  console.log(
    `\nDone. ${updated} ${DRY_RUN ? "would be updated" : "updated"}, ` +
      `${skipped} already current, ${failed} failed.`,
  );
  if (failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
