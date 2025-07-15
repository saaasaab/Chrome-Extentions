import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://qaoxpbdgegverissemqn.supabase.co'; // TODO: Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhb3hwYmRnZWd2ZXJpc3NlbXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwMTI1NjQsImV4cCI6MjA2NzU4ODU2NH0.NoI0B69kXAEO3AjhXWqNphEGrlp0SuQ11LEuzEwvNW8'; // TODO: Replace with your Supabase anon/public key

// Create Supabase client with error handling
let supabase;
try {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false // Disable to prevent issues in extension context
    }
  });
} catch (error) {
  console.error('Failed to create Supabase client:', error);
  // Create a fallback client
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

export { supabase }; 