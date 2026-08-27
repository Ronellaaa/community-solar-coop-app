// frontend/lib/supabase.js

import { createClient } from "@supabase/supabase-js";
// ❌ REMOVE THIS LINE - causing WASM error on web
// import "expo-sqlite/localStorage/install";

// ✅ Custom storage adapter (works on web + native)
const storage = {
  getItem: (key) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return window.localStorage.getItem(key);
      }
      return null;
    } catch {
      return null;
    }
  },
  setItem: (key, value) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.setItem(key, value);
      }
    } catch {}
  },
  removeItem: (key) => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        window.localStorage.removeItem(key);
      }
    } catch {}
  },
};

// 👇 Get these from Supabase Dashboard → Settings → API
const supabaseUrl = "https://qsblarqjstkimojzishv.supabase.co";
const supabaseAnonKey = "sb_publishable_XDuS_CUmCRsAJfnL3adc8A_EEhP5ay5";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: storage, // ✅ Using custom adapter
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});