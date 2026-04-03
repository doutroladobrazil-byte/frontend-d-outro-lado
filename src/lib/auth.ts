import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabaseClient";

export type UserRole = "client" | "importer" | "admin";
export type RegisterAccountType = Exclude<UserRole, "admin">;

export type UserProfile = {
  id: string;
  email: string | null;
  fullName: string | null;
  role: UserRole;
  approved: boolean;
};

function normalizeRole(value: unknown): UserRole {
  if (value === "admin") return "admin";
  if (value === "importer") return "importer";
  return "client";
}

function extractFullName(user: User | null) {
  if (!user) return null;

  const fullName =
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.user_metadata?.user_name ??
    null;

  return typeof fullName === "string" && fullName.trim().length > 0
    ? fullName.trim()
    : null;
}

function normalizeProfile(data: any): UserProfile {
  return {
    id: String(data.id),
    email: data.email ?? null,
    fullName: data.full_name ?? null,
    role: normalizeRole(data.role),
    approved: Boolean(data.approved),
  };
}

export async function signInWithEmail(email: string, password: string) {
  return supabase.auth.signInWithPassword({
    email,
    password,
  });
}

export async function signUpWithEmail(
  email: string,
  password: string,
  accountType: RegisterAccountType = "client",
  fullName?: string
) {
  return supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role: accountType,
        full_name: fullName?.trim() || undefined,
      },
    },
  });
}

export async function signOutUser() {
  return supabase.auth.signOut();
}

export async function signInWithGoogle(nextPath = "/") {
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
          : undefined,
    },
  });
}

export async function signInWithApple(nextPath = "/") {
  return supabase.auth.signInWithOAuth({
    provider: "apple",
    options: {
      redirectTo:
        typeof window !== "undefined"
          ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`
          : undefined,
    },
  });
}

export async function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo:
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/reset-password`
        : undefined,
  });
}

export async function getCurrentSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return data.session ?? null;
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return data.user ?? null;
}

export async function getUserProfile(
  userId: string
): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, approved")
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    console.error("Erro ao buscar perfil:", error.message);
    return null;
  }

  if (!data) {
    return null;
  }

  return normalizeProfile(data);
}

export async function ensureUserProfile(user: User): Promise<UserProfile | null> {
  const existingProfile = await getUserProfile(user.id);
  const desiredRole = normalizeRole(user.user_metadata?.role);
  const desiredEmail = user.email ?? null;
  const desiredFullName = extractFullName(user);

  if (existingProfile) {
    const needsUpdate =
      existingProfile.email !== desiredEmail ||
      existingProfile.fullName !== desiredFullName ||
      existingProfile.role !== desiredRole;

    if (!needsUpdate) {
      return existingProfile;
    }

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        email: desiredEmail,
        full_name: desiredFullName,
        role: desiredRole,
      })
      .eq("id", user.id);

    if (updateError) {
      console.error("Erro ao atualizar perfil:", updateError.message);
      return existingProfile;
    }

    return await getUserProfile(user.id);
  }

  const payload = {
    id: user.id,
    email: desiredEmail,
    full_name: desiredFullName,
    role: desiredRole,
    approved: desiredRole === "admin" || desiredRole === "importer",
  };

  const { error: insertError } = await supabase.from("profiles").insert(payload);

  if (insertError) {
    console.error("Erro ao criar perfil:", insertError.message);
    return null;
  }

  return await getUserProfile(user.id);
}

export function hasRequiredRole(
  userRole: UserRole | null | undefined,
  allowedRoles?: UserRole[]
) {
  if (!allowedRoles || allowedRoles.length === 0) {
    return true;
  }

  if (!userRole) {
    return false;
  }

  return allowedRoles.includes(userRole);
}

export function isAdmin(profile: UserProfile | null) {
  return profile?.role === "admin";
}

export function isApprovedImporter(profile: UserProfile | null) {
  return profile?.role === "importer" && profile.approved === true;
}

export function canAccessWholesale(profile: UserProfile | null) {
  if (!profile) return false;
  return profile.role === "admin" || profile.role === "importer";
}

export function canAccessAdmin(profile: UserProfile | null) {
  return profile?.role === "admin";
}
