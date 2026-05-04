"use client";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import { getSupabaseEnvironment } from "@/lib/supabase/shared";
import type { Database } from "@/lib/supabase/types";

let browserClient: SupabaseClient<Database> | null = null;

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    const { url, anonKey } = getSupabaseEnvironment();

    browserClient = createClient<Database>(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }

  return browserClient;
}
