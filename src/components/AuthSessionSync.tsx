"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * Client-side component to sync auth session state with server cookies.
 * This ensures the client auth state matches server cookies after page loads/refreshes.
 */
export default function AuthSessionSync() {
  useEffect(() => {
    // Sync session on mount
    supabase.auth.getSession();
  }, []);

  return null;
}
