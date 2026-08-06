-- Storage bucket + policies for gallery images.
--
-- Creates a PUBLIC bucket named "gallery":
--   * public read  → gallery images load directly / via the image CDN
--   * writes/deletes restricted to authenticated users (the admin)

-- Create the bucket (public = objects are readable without a signed URL).
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do update set public = true;

-- Storage RLS policies (on storage.objects) ----------------------------------

-- Public read of objects in the gallery bucket.
create policy "Public can read gallery objects"
  on storage.objects
  for select
  using (bucket_id = 'gallery');

-- Authenticated users may upload.
create policy "Authenticated can upload gallery objects"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'gallery');

-- Authenticated users may update (e.g. replace) objects.
create policy "Authenticated can update gallery objects"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'gallery')
  with check (bucket_id = 'gallery');

-- Authenticated users may delete objects.
create policy "Authenticated can delete gallery objects"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'gallery');
