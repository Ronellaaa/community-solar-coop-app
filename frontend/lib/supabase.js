// frontend/lib/supabase.js

import { createClient } from "@supabase/supabase-js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

const webStorage = {
  async getItem(key) {
    return typeof window === "undefined"
      ? null
      : window.localStorage.getItem(key);
  },
  async setItem(key, value) {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(key, value);
    }
  },
  async removeItem(key) {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(key);
    }
  },
};

const storage = Platform.OS === "web" ? webStorage : AsyncStorage;

// 👇 Get these from Supabase Dashboard → Settings → API
const supabaseUrl = "https://qsblarqjstkimojzishv.supabase.co";
const supabaseAnonKey = "sb_publishable_XDuS_CUmCRsAJfnL3adc8A_EEhP5ay5";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
