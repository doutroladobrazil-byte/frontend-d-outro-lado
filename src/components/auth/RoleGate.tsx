import { ReactNode } from "react";
import { getCurrentUserProfile } from "@/lib/auth/roles";

type RoleGateProps = {
  children: ReactNode;
  fallback?: ReactNode;
  allowAdmin?: boolean;
  allowApprovedImporter?: boolean;
  allowCliente?: boolean;
};

export default async function RoleGate({
  children,
  fallback = null,
  allowAdmin = false,
  allowApprovedImporter = false,
  allowCliente = false,
}: RoleGateProps) {
  const profile = await getCurrentUserProfile();

  if (!profile) return <>{fallback}</>;

  const allowed =
    (allowAdmin && profile.role === "admin") ||
    (allowCliente && profile.role === "client") ||
    (allowApprovedImporter &&
      profile.role === "importer" && profile.approved);

  if (!allowed) return <>{fallback}</>;

  return <>{children}</>;
}