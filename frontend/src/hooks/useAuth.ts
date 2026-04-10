import { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { supabase } from '@/lib/supabase';

export function useAuth() {
  const { user, session, loading, setSession, setLoading, signIn, signUp, signOut, resetPassword } = useAuthStore();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setSession, setLoading]);

  return { user, session, loading, signIn, signUp, signOut, resetPassword, isAuthenticated: !!user };
}
