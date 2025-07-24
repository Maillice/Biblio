import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are properly configured
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables not configured:', {
    VITE_SUPABASE_URL: supabaseUrl ? 'Set' : 'Missing',
    VITE_SUPABASE_ANON_KEY: supabaseAnonKey ? 'Set' : 'Missing'
  });
  throw new Error(
    'Missing Supabase environment variables. Please configure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
  );
}

// Validate URL format
try {
  new URL(supabaseUrl);
} catch (error) {
  throw new Error('Invalid VITE_SUPABASE_URL format. Please check your .env file.');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error);
  
  // Provide more specific error messages
  if (error.message?.includes('NetworkError')) {
    throw new Error('Impossible de se connecter à la base de données. Vérifiez votre configuration Supabase.');
  }
  
  if (error.message?.includes('Invalid API key')) {
    throw new Error('Clé API Supabase invalide. Vérifiez votre configuration.');
  }
  
  throw new Error(error.message || 'Une erreur est survenue lors de la connexion à la base de données');
};

// Helper function to get current user
export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error) handleSupabaseError(error);
  return user;
};

// Helper function to get library user profile
export const getLibraryUserProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('library_users')
    .select('*')
    .eq('user_id', userId)
    .single();
  
  if (error) handleSupabaseError(error);
  return data;
};