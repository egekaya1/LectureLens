import { createBrowserClient } from "@supabase/ssr";

function getSupabaseClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error("Supabase env vars:", {
      url: supabaseUrl ? "SET" : "MISSING",
      key: supabaseAnonKey ? "SET" : "MISSING",
    });
    throw new Error(
      "Missing Supabase environment variables. Check NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in Vercel settings.",
    );
  }

  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export const supabase = getSupabaseClient();
