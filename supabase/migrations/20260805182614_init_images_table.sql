-- Images table: one row per gallery image.
create table if not exists public.images (
  id           uuid primary key default gen_random_uuid(),
  category     text not null check (category in (
                 'screen-printing', 'vehicle-branding', 'outdoor-advertising'
               )),
  storage_path text not null unique,
  caption      text,
  position     integer not null default 0,
  created_at   timestamptz not null default now()
);

-- Fast ordering within a category (matches the gallery query).
create index if not exists images_category_position_idx
  on public.images (category, position, created_at);

-- Row Level Security ---------------------------------------------------------
alter table public.images enable row level security;

-- Anyone (anonymous visitors) may read image metadata — the galleries are public.
create policy "Public can read images"
  on public.images
  for select
  using (true);

-- Only authenticated users (the admin) may insert / update / delete.
create policy "Authenticated can insert images"
  on public.images
  for insert
  to authenticated
  with check (true);

create policy "Authenticated can update images"
  on public.images
  for update
  to authenticated
  using (true)
  with check (true);

create policy "Authenticated can delete images"
  on public.images
  for delete
  to authenticated
  using (true);
