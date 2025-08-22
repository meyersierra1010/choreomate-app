import { createClient } from "@supabase/supabase-js";

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  }
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLIC_KEY
);

export default supabase;
