"use client";

import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";

export default function AuthStatus() {
  const { user, profile, loading, logout } = useAuth();

  if (loading) {
    return <div className="text-sm text-white/60">Verificando acesso...</div>;
  }

  if (!user) {
    return (
      <Link
        href="/login"
        className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
      >
        Entrar
      </Link>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <div className="text-sm font-medium text-white">
          {profile?.fullName || user.email || "Usuário"}
        </div>
        <div className="text-xs uppercase tracking-wide text-white/50">
          {profile?.role || "client"}
        </div>
      </div>

      <button
        onClick={logout}
        className="rounded-xl border border-white/10 px-4 py-2 text-sm text-white/80 transition hover:bg-white/5 hover:text-white"
      >
        Sair
      </button>
    </div>
  );
}