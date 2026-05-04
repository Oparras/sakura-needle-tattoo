import { createClient } from "@supabase/supabase-js";
import { getSupabaseEnvironment } from "@/lib/supabase/shared";
import type { Database } from "@/lib/supabase/types";

export function getSupabaseServerClient() {
  const { url, anonKey } = getSupabaseEnvironment();

  return createClient<Database>(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
