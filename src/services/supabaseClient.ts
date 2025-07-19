// src/services/supabaseClient.ts

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase environment variables are missing!");
  // You might want to throw here or handle this scenario accordingly
}

console.log("Supabase URL:", supabaseUrl);
console.log("Supabase Anon Key:", supabaseAnonKey?.substring(0, 5) + "...");

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);
