import React, { createContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "../backend/supabase";
import type { User } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  signOut: async () => {},
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get initial session on mount
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
    });

    // Subscribe to auth state changes
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};
