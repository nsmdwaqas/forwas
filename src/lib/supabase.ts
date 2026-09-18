/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Using your provided Supabase project URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qcyhdahclaewvzjpowvr.supabase.co';

// IMPORTANT: Add VITE_SUPABASE_ANON_KEY to your AI Studio Environment variables / Secrets!
// Without the Anon Key, the client cannot communicate with Supabase.
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
