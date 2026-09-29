/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Static fallbacks ensure the client works reliably in both sandbox (development)
// and production builds, even when environment variables are not injected.
const SUPABASE_URL = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  'https://qcyhdahclaewvzjpowvr.supabase.co';

const SUPABASE_ANON_KEY = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_ANON_KEY) || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeWhkYWhjbGFld3Z6anBvd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODQ2NjYsImV4cCI6MjA3NzU2MDY2Nn0.tSqXIVppqVVU2YKTJJCCt121HDnHzA5DBnCpucTqOF4';

// Initialize client with lightweight options suitable for public analytics logging
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});
