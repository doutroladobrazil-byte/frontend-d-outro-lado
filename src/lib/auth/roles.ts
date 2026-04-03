import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { UserProfile, UserRole } from "@/lib/auth";

function normalizeRole(value: unknown): UserRole {
  if (value === "admin") return "admin";
  if (value === "importer") return "importer";
  return "client";
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

export async function getCurrentUserProfile(): Promise<UserProfile | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, full_name, role, approved")
    .eq("id", user.id)
    .maybeSingle();

  return data ? normalizeProfile(data) : null;
}

export const getCurrentProfile = getCurrentUserProfile;

export async function requireAuth() {
  const profile = await getCurrentUserProfile();
  if (!profile) redirect("/login");
  return profile;
}

export async function requireAdmin() {
  const profile = await requireAuth();
  if (profile.role !== "admin") redirect("/acesso-negado");
  return profile;
}

export async function requireApprovedImporterOrAdmin() {
  const profile = await requireAuth();
  const allowed = profile.role === "admin" || profile.role === "importer";
  if (!allowed) {
    redirect("/acesso-negado");
  }
  return profile;
}
