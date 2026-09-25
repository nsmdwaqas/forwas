/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Using your provided Supabase project URL
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qcyhdahclaewvzjpowvr.supabase.co';

// Public Supabase Anon Key (safe for client-side usage with Supabase RLS)
const supabaseAnonKey = 
  import.meta.env.VITE_SUPABASE_ANON_KEY || 
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFjeWhkYWhjbGFld3Z6anBvd3ZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE5ODQ2NjYsImV4cCI6MjA3NzU2MDY2Nn0.tSqXIVppqVVU2YKTJJCCt121HDnHzA5DBnCpucTqOF4';

// Create a single supabase client for interacting with your database
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
