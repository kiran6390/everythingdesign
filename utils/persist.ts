import { Platform } from "react-native";
import * as SecureStore from "expo-secure-store";

// Small cross-platform key/value for non-sensitive flags (onboarding state, etc.).
// Native → SecureStore (Keychain/Keystore); Web → localStorage. Sensitive auth
// tokens are handled separately by the Supabase client's SecureStore adapter.
export async function getFlag(key: string): Promise<string | null> {
  try {
    if (Platform.OS === "web") {
      return typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    }
    return await SecureStore.getItemAsync(key);
  } catch {
    return null;
  }
}

export async function setFlag(key: string, value: string): Promise<void> {
  try {
    if (Platform.OS === "web") {
      if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  } catch {
    // ignore
  }
}

export const ONBOARDED_KEY = "getin_onboarded";
