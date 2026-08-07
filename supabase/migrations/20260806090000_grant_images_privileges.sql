-- Grant table privileges to the standard Supabase roles.
--
-- RLS policies decide *which rows* a role may touch, but Postgres still checks
-- table-level GRANTs first. The `images` table was created without the usual
-- blanket grants, so the API roles hit "permission denied for table images"
-- (SQLSTATE 42501) even though the RLS policies allow the operation.
--
-- Grants here are intentionally broad; RLS remains the real access control:
--   * anon / authenticated  → gated by the RLS policies on the table
--   * service_role           → bypasses RLS (used by the secret key / scripts)

grant select on public.images to anon, authenticated;
grant select, insert, update, delete on public.images to service_role;
grant insert, update, delete on public.images to authenticated;
