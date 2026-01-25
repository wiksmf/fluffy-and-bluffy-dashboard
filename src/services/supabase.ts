import { createClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://xtwujszsbkjywhdcosql.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh0d3Vqc3pzYmtqeXdoZGNvc3FsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2NDQyMDgsImV4cCI6MjA3NjIyMDIwOH0.xOic9X0S1YSWdn0NxXt28FLMphGjw4wpzibIJjMpN8A";

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
