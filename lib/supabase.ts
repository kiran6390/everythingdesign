import * as SecureStore from "expo-secure-store";
import { createClient } from "@supabase/supabase-js";

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const SUPABASE_URL = "https://bohujtyfypijphfcrlua.supabase.co";
export const SUPABASE_ANON = "sb_publishable_uDraEjmGZs1UFGWbZBJEFg_H9RiL_3g";

export const supabase = createClient(
  SUPABASE_URL,
  SUPABASE_ANON,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
);
