import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Admin Supabase client using the SECRET key. Bypasses RLS.
 * SERVER-ONLY — never import this into a Client Component. Use for privileged
 * operations like deleting storage objects from a Server Action / Route Handler.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}
