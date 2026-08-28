import { createClient } from "@supabase/supabase-js";
import ws from "ws";
const supabaseUrl = "https://qsblarqjstkimojzishv.supabase.co";
const supabaseAnonKey = "sb_publishable_XDuS_CUmCRsAJfnL3adc8A_EEhP5ay5";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    realtime: {
      transport: ws,
    },
  }
);
