import { createClient } from '@supabase/supabase-js';

// Initialize a Supabase client for browser usage.
//
// The URL and anon key are expected to be provided via environment
// variables. For the web app these should be prefixed with
// NEXT_PUBLIC so that Next.js exposes them at build time. The values
// themselves should be configured in an `.env.local` file or via
// your deployment platform's environment settings. See the README
// for details on configuring Supabase.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;

// Create a single Supabase client instance.  Many of the pages in this
// application import the client as a default export (e.g. `import supabase from '../lib/supabaseClient'`).
// To support both default and named imports we export the same client twice.
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

// Named export for explicit imports: `import { supabase } from '../lib/supabaseClient'`.
export const supabase = supabaseClient;

// Default export for convenience: `import supabase from '../lib/supabaseClient'`.
export default supabaseClient;