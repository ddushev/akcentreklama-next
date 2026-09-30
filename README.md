# Akcent — Screen Printing & Advertising

Production website for **Akcent**, a screen-printing and advertising agency in Burgas, Bulgaria.
It replaces the agency's old static HTML site with a Next.js app that has a trilingual public site and a
gallery the agency manages itself, without a developer.

**Live site:** [akcentreklama.bg](https://akcentreklama.bg/)

**Demo:** the public site, language switching, and the admin gallery (upload, lightbox, delete).

https://github.com/user-attachments/assets/15e2024d-8419-425f-add9-9377e11d46f9

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · next-intl · Supabase (PostgreSQL, Storage, Auth) · Netlify

## Highlights

- **App Router architecture.** Pages are React Server Components that fetch from Supabase on the server.
  Client components are used only where there is interaction (upload, lightbox, language switcher).
- **Self-service gallery CMS.** Admins sign in and manage three portfolio galleries in place: drag-and-drop
  multi-file upload, delete with confirmation, and ordered display. There is no separate admin panel.
- **Client-side image pipeline.** Uploads are downscaled and re-encoded to WebP in the browser (Canvas API)
  against a size budget before they reach storage, which keeps storage and bandwidth costs low.
- **Security in the database.** PostgreSQL Row Level Security allows public read, but restricts every
  write (table rows and storage objects) to admins. Admins are identified by a JWT `app_metadata` role
  that users cannot grant themselves. The schema and policies are versioned as SQL migrations.
- **Internationalization.** Bulgarian, English and Russian via next-intl, with localized routing
  (`/about`, `/en/about`, `/ru/about`) and rich-text translations.
- **Performance.** `next/image` with build-time blur placeholders and responsive `sizes`, one-year
  caching for gallery images, eager loading only above the fold, and a static map image instead of
  a third-party Google Maps embed.
- **Safe migration from the old site.** 301 redirects keep the old site's gallery URLs working, so
  existing links and search rankings carry over.

## Tech stack

| Area      | Tools                                                                     |
| --------- | ------------------------------------------------------------------------- |
| Framework | Next.js 16 (App Router, Turbopack), React 19, TypeScript                  |
| Styling   | Tailwind CSS v4 (CSS-first `@theme` tokens), shadcn/ui on Base UI, Lucide |
| i18n      | next-intl (middleware routing, `bg` / `en` / `ru`)                        |
| Backend   | Supabase: PostgreSQL + RLS, Storage, Auth (`@supabase/ssr`)               |
| UI extras | react-dropzone, yet-another-react-lightbox, Sonner                        |
| Hosting   | Netlify                                                                   |

## Project structure

```
src/
  app/[locale]/       Localized routes: home, about, gallery/[category], contacts, admin
  components/         Site components; ui/ holds the shadcn/ui primitives
  i18n/               next-intl routing and request config
  lib/                Supabase clients, gallery data access, image pipeline, service config
  messages/           Translations (bg, en, ru)
  middleware.ts       Locale routing + Supabase session refresh
supabase/migrations/  Schema, storage bucket and RLS policies
scripts/              One-off maintenance scripts (image migration, cache headers)
```

## Getting started

Requires Node.js 20+ and a Supabase project.

```bash
git clone https://github.com/ddushev/akcentreklama-next.git
cd akcentreklama-next
npm install
cp .env.example .env.local   # then fill in the three values
```

| Variable                               | Where to find it                                 |
| -------------------------------------- | ------------------------------------------------ |
| `NEXT_PUBLIC_SUPABASE_URL`             | Supabase → Settings → General                    |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Supabase → Settings → API Keys                   |
| `SUPABASE_SECRET_KEY`                  | Supabase → Settings → API Keys (server-only)     |

Apply the database schema:

```bash
npx supabase link --project-ref <your-project-ref>
npx supabase db push
```

Create an admin: add a user under **Authentication → Users**, then give it the admin role in the SQL editor:

```sql
update auth.users
set raw_app_meta_data = raw_app_meta_data || '{"role":"admin"}'
where email = 'you@example.com';
```

Run it:

```bash
npm run dev     # http://localhost:3000, sign in at /admin
```

## Scripts

| Command                                  | Purpose                                                  |
| ---------------------------------------- | -------------------------------------------------------- |
| `npm run dev` / `build` / `start`        | Develop, build and serve                                 |
| `npm run lint`                           | ESLint                                                   |
| `node scripts/migrate-images.mjs`        | One-time import of the old site's images into Supabase   |
| `node scripts/refresh-cache-headers.mjs` | Re-upload stored images with long-lived `Cache-Control`  |

Both scripts support `--dry-run`.
