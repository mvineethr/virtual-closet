import { createClient } from '@supabase/supabase-js';

// Configure the Supabase client for React Native.  The URL and anon
// key should be set as environment variables.  When building with
// Expo, these should be prefixed with EXPO_PUBLIC_ so that they are
// automatically embedded into the bundle.  See the README for
// instructions on provisioning your Supabase project and exposing
// your keys.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Create a single Supabase client instance.  As with the web version, we
// export both a named and default version of the client.  This allows
// `import { supabase }` and `import supabase` to both work.
const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
export const supabase = supabaseClient;
export default supabaseClient;