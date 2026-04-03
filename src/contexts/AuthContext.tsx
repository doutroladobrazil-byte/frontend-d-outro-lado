"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";
import {
  canAccessAdmin,
  canAccessWholesale,
  ensureUserProfile,
  getUserProfile,
  signOutUser,
  type UserProfile,
} from "@/lib/auth";

type AuthContextValue = {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  isAuthenticated: boolean;
  canSeeWholesale: boolean;
  canSeeAdmin: boolean;
  refreshProfile: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshProfile() {
    if (!user) {
      setProfile(null);
      return;
    }

    const nextProfile = await getUserProfile(user.id);
    setProfile(nextProfile);
  }

  async function logout() {
    await signOutUser();
    setUser(null);
    setSession(null);
    setProfile(null);
  }

  useEffect(() => {
    let mounted = true;

    async function bootstrap() {
      try {
        const {
          data: { session: initialSession },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        setSession(initialSession ?? null);
        setUser(initialSession?.user ?? null);

        if (initialSession?.user) {
          await ensureUserProfile(initialSession.user);
          const initialProfile = await getUserProfile(initialSession.user.id);

          if (mounted) {
            setProfile(initialProfile);
          }
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error("Erro ao inicializar autenticação:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    bootstrap();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event: AuthChangeEvent, nextSession: Session | null) => {
        if (!mounted) return;

        setSession(nextSession ?? null);
        setUser(nextSession?.user ?? null);

        if (nextSession?.user) {
          await ensureUserProfile(nextSession.user);
          const nextProfile = await getUserProfile(nextSession.user.id);

          if (mounted) {
            setProfile(nextProfile);
          }
        } else {
          setProfile(null);
        }

        if (mounted) {
          setLoading(false);
        }
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      session,
      profile,
      loading,
      isAuthenticated: Boolean(user),
      canSeeWholesale: canAccessWholesale(profile),
      canSeeAdmin: canAccessAdmin(profile),
      refreshProfile,
      logout,
    }),
    [user, session, profile, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de <AuthProvider />.");
  }

  return context;
}
