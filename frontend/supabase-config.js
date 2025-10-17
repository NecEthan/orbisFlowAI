// Supabase Configuration
// Copy this file to .env.local and replace the values with your actual Supabase credentials

export const supabaseConfig = {
  url: 'https://your-project-id.supabase.co',
  anonKey: 'your-anon-key-here'
};

// To use this:
// 1. Create a file called .env.local in the frontend directory
// 2. Add these lines to .env.local:
//    VITE_SUPABASE_URL=https://your-project-id.supabase.co
//    VITE_SUPABASE_ANON_KEY=your-anon-key-here
// 3. Replace the values with your actual Supabase project credentials
