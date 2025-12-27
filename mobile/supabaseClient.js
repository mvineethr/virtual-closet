<<<<<<< HEAD
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
=======
import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';

// Configure the Supabase client for React Native. These values must be
// provided via Expo env vars (prefixed with EXPO_PUBLIC_ so they bundle
// correctly). See the README for provisioning steps.
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase configuration. Set EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.'
  );
}

const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);

export const supabase = supabaseClient;
export default supabaseClient;
>>>>>>> e7e72862 (adding updates and changes)
