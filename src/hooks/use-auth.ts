"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAppStore } from "@/store";

export const useAuth = () => {
  const router = useRouter();
  const { auth, setAuthState, setAuthLoading } = useAppStore();

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session?.user) {
        setAuthState({
          authenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email || "",
            created_at: session.user.created_at || "",
            updated_at: session.user.updated_at || "",
          },
        });
      } else {
        setAuthState({
          authenticated: false,
          user: null,
        });
      }

      setAuthLoading(false);
    };

    getInitialSession();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event: string, session: any) => {
      if (session?.user) {
        setAuthState({
          authenticated: true,
          user: {
            id: session.user.id,
            email: session.user.email || "",
            created_at: session.user.created_at || "",
            updated_at: session.user.updated_at || "",
          },
        });
      } else {
        setAuthState({
          authenticated: false,
          user: null,
        });
      }

      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [setAuthState, setAuthLoading]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw error;
    }
  };

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    router.push("/auth");
  };

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });

    if (error) {
      throw error;
    }
  };

  return {
    user: auth.user,
    authenticated: auth.authenticated,
    loading: auth.loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};
