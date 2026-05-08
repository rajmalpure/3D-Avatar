import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const isPlaceholderSession = !rawUrl || rawUrl === 'YOUR_SUPABASE_URL_HERE' || !rawKey || rawKey === 'YOUR_SUPABASE_ANON_KEY_HERE';

// Fallback to a dummy valid URL so the app doesn't crash before you set it up
const supabaseUrl = isPlaceholderSession ? 'https://placeholder.supabase.co' : rawUrl;
const supabaseAnonKey = isPlaceholderSession ? 'public-anon-key' : rawKey;

if (isPlaceholderSession) {
  console.warn('🚨 Supabase URL or Anon Key is missing or invalid. Make sure they are set correctly in your .env file!');
}

export const isSupabaseConfigured = !isPlaceholderSession;
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
  }
});
