import { createClient } from "@supabase/supabase-js";
import { Database } from "./schema";

export const supabaseServiceClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);
