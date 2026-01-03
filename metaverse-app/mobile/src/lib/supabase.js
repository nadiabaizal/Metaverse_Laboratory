import { createClient } from "@supabase/supabase-js";
import * as Linking from "expo-linking";

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env variables are missing");
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY,
  {
    auth: {
      detectSessionInUrl: false,
    },
  }
);

Linking.addEventListener("url", async ({ url }) => {
  if (url.includes("access_token")) {
    await supabase.auth.exchangeCodeForSession(url);
  }
});