"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { canAccessWholesale, isAdmin } from "@/lib/auth";

export type AccessGateProps = {
  children: ReactNode;
  requireAuth?: boolean;
  requireAdmin?: boolean;
  requireWholesale?: boolean;
  title?: string;
  description?: string;
};

export default function AccessGate({
  children,
  requireAuth = false,
  requireAdmin = false,
  requireWholesale = false,
  title,
  description,
}: AccessGateProps) {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <section className="w-full py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">Carregando</h2>
          <p className="mt-3 text-white/70">Verificando permissões...</p>
        </div>
      </section>
    );
  }

  if (requireAuth && !user) {
    return (
      <section className="w-full py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-white/10 bg-white/5 p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">
            {title || "Login necessário"}
          </h2>
          <p className="mt-3 text-white/70">
            {description || "Você precisa entrar na sua conta para acessar esta área."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Ir para login
            </Link>

            <Link
              href="/"
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-medium text-white/80 transition hover:bg-white/5"
            >
              Voltar para a home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (requireAdmin && !isAdmin(profile)) {
    return (
      <section className="w-full py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-red-500/20 bg-red-500/10 p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">
            {title || "Acesso administrativo necessário"}
          </h2>
          <p className="mt-3 text-white/70">
            {description || "Esta área é restrita para administradores."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/"
              className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Voltar para a home
            </Link>
          </div>
        </div>
      </section>
    );
  }

  if (requireWholesale && !canAccessWholesale(profile)) {
    return (
      <section className="w-full py-16">
        <div className="mx-auto max-w-3xl rounded-3xl border border-amber-500/20 bg-amber-500/10 p-8 text-center text-white">
          <h2 className="text-2xl font-semibold">
            {title || "Acesso de importador necessário"}
          </h2>
          <p className="mt-3 text-white/70">
            {description ||
              "Esta área é exclusiva para contas de importador ou administradores."}
          </p>

          <div className="mt-6 flex items-center justify-center gap-3">
            <Link
              href="/login"
              className="rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-white transition hover:bg-white/15"
            >
              Entrar / Criar conta
            </Link>
          </div>
        </div>
      </section>
    );
  }

  return <>{children}</>;
}
