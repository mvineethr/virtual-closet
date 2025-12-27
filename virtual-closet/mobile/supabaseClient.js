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
