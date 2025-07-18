// src/services/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

// Add these lines here to verify environment variables are loaded correctly
console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey?.substring(0, 5) + "...");

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
