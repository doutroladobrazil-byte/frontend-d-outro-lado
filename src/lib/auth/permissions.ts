import type { UserRole } from "@/lib/auth";

export function isAdmin(role: UserRole | null | undefined) {
  return role === "admin";
}

export function isApprovedImporter(role: UserRole | null | undefined) {
  return role === "importer";
}

export function isClient(role: UserRole | null | undefined) {
  return role === "client";
}

export function canAccessWholesale(role: UserRole | null | undefined) {
  return role === "admin" || role === "importer";
}

export function canAccessAdmin(role: UserRole | null | undefined) {
  return role === "admin";
}
