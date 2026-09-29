-- Restrict gallery writes to admins.

-- Helper ---------------------------------------------------------------------

create or replace function public.is_admin()
returns boolean
language sql
stable
set search_path = ''
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = 'admin', false);
$$;

-- public.images --------------------------------------------------------------
-- `(select public.is_admin())` lets Postgres evaluate it once per statement
-- rather than once per row.

drop policy if exists "Authenticated can insert images" on public.images;
drop policy if exists "Authenticated can update images" on public.images;
drop policy if exists "Authenticated can delete images" on public.images;

create policy "Admins can insert images"
  on public.images
  for insert
  to authenticated
  with check ((select public.is_admin()));

create policy "Admins can update images"
  on public.images
  for update
  to authenticated
  using ((select public.is_admin()))
  with check ((select public.is_admin()));

create policy "Admins can delete images"
  on public.images
  for delete
  to authenticated
  using ((select public.is_admin()));

-- storage.objects (gallery bucket) -------------------------------------------

drop policy if exists "Authenticated can upload gallery objects" on storage.objects;
drop policy if exists "Authenticated can update gallery objects" on storage.objects;
drop policy if exists "Authenticated can delete gallery objects" on storage.objects;

create policy "Admins can upload gallery objects"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery' and (select public.is_admin()));

create policy "Admins can update gallery objects"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'gallery' and (select public.is_admin()))
  with check (bucket_id = 'gallery' and (select public.is_admin()));

create policy "Admins can delete gallery objects"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'gallery' and (select public.is_admin()));
