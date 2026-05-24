/**
 * Supabase client — single instance shared across the app.
 *
 * Reads credentials from `.env` at build time (Vite injects them).
 * Throws early in development if env vars are missing so you don't
 * silently render an empty site.
 */
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // eslint-disable-next-line no-console
  console.error(
    "[Supabase] Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. " +
      "Add them to your .env file and restart `npm run dev`."
  );
}

export const supabase = createClient(
  SUPABASE_URL ?? "",
  SUPABASE_ANON_KEY ?? ""
);
