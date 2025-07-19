import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  useContext,
} from "react";
import { supabase } from "../backend/supabase";
import type { User, Session } from "@supabase/supabase-js";

// -----------------
// Context Interface
// -----------------
interface AuthContextType {
  user: User | null;
  session: Session | null;
  signOut: () => Promise<void>;
}

// -----------------
// Context Creation
// -----------------
export const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  signOut: async () => {},
});

// -----------------
// Auth Provider
// -----------------
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    // Fetch initial session on mount
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error("Error getting session:", error.message);
      } else {
        setUser(data.session?.user ?? null);
        setSession(data.session ?? null);
      }
    };

    fetchSession();

    // Listen for auth changes
    const { data: subscription } = supabase.auth.onAuthStateChange(
      (_event, newSession) => {
        setUser(newSession?.user ?? null);
        setSession(newSession ?? null);
      }
    );

    return () => {
      subscription.subscription?.unsubscribe();
    };
  }, []);

  // Sign out logic
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Sign out failed:", error.message);
    }
    setUser(null);
    setSession(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

// -----------------
// Custom Hook (optional)
export const useAuth = () => useContext(AuthContext);
