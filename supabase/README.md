# Supabase setup

One-time setup for the project's database, storage, and admin user.

## 1. Apply migrations

The schema and storage bucket live in `supabase/migrations/` and are applied
with the Supabase CLI (already linked to the project):

```bash
cd akcentreklama-next
supabase db push        # applies any pending migrations to the linked project
```

Migrations (run in timestamp order):

1. `*_init_images_table.sql` — `images` table, index, and RLS policies.
2. `*_init_gallery_bucket.sql` — public `gallery` storage bucket + storage RLS.

Supabase tracks applied migrations, so `db push` only runs new ones. To add a
future change: `supabase migration new <name>`, edit the file, `supabase db push`.

## 2. Create the admin user

Dashboard → **Authentication → Users → Add user**. Use a strong password.
This is the only account that can log in at `/admin`.

There is no public sign-up — the app never exposes a registration flow, and RLS
only grants write/delete to the `authenticated` role.

## 3. Environment variables

`.env.local` (already created, git-ignored) must contain:

```
NEXT_PUBLIC_SUPABASE_URL=...            # Settings → General
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...# Settings → API Keys (sb_publishable_...)
SUPABASE_SECRET_KEY=...                 # Settings → API Keys (sb_secret_..., server-only)
```

For deployment, add the same three variables in Netlify → Site settings →
Environment variables.

## Notes

- The `gallery` bucket is **public** so images load without signed URLs and can
  use Supabase's on-the-fly image transformation (thumbnails via `?width=...`).
- Access control lives in RLS: anyone can read, only the authenticated admin can
  insert/update/delete — both for table rows and storage objects.
