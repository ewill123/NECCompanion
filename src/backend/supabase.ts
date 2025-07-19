import { createClient } from "@supabase/supabase-js";

// Load from environment variables
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Sanity check: warn if env vars are missing
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "❌ Supabase credentials are missing. Make sure EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY are defined in your .env file or app config."
  );
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
