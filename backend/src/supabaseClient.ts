import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseKey = process.env.SUPABASE_KEY || 'placeholder-service-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return process.env.SUPABASE_URL && process.env.SUPABASE_KEY;
};

// Get mock user ID for development
export const getMockUserId = () => {
  return '00000000-0000-0000-0000-000000000001';
};
