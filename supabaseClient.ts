import { createClient } from '@supabase/supabase-js';
const supabaseUrl = "https://nfytxnqdlkfnvdzzfxil.supabase.co"; 
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5meXR4bnFkbGtmbnZkenpmeGlsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMDgzNDUsImV4cCI6MjA4OTU4NDM0NX0.XuF2UPzAn-u1LyhvU7hRMfyQw97hwpR6Zw-f_j3vz3U";

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Critical Error: Supabase connection keys are missing.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);