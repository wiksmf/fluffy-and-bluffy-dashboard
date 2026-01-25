import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://xtwujszsbkjywhdcosql.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

// Get service role key from environment variables
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

// Create admin client for admin operations (only if service key is available)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

export default supabase;
