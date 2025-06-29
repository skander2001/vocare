import { createClient } from "@supabase/supabase-js"

// IMPORTANT
// In the browser we are ONLY allowed to expose the anon (public) key.
// In Vercel add the following environment variables:
//    NEXT_PUBLIC_SUPABASE_URL
//    NEXT_PUBLIC_SUPABASE_ANON_KEY
//
// In dev you can add them to  `.env.local`
//    NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
//    NEXT_PUBLIC_SUPABASE_ANON_KEY=xxxxx

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? ""
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ""

/**
 * Throw a clear error during development when the
 * credentials are missing instead of failing with
 * “Invalid API key” inside the Supabase client.
 */
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Supabase credentials are missing.\n" +
      "Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
      "in your environment variables.",
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
