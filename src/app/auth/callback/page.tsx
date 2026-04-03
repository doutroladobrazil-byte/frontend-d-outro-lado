"use client";

import { useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ensureUserProfile, getUserProfile } from "@/lib/auth";
import { supabase } from "@/lib/supabaseClient";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ranRef = useRef(false);

  useEffect(() => {
    if (ranRef.current) return;
    ranRef.current = true;

    async function finalizeLogin() {
      try {
        const nextPath = searchParams.get("next") || "/";
        const errorMessage =
          searchParams.get("error_description") || searchParams.get("error");

        if (errorMessage) {
          router.replace(`/login?error=${encodeURIComponent(errorMessage)}`);
          return;
        }

        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session?.user) {
          router.replace("/login?error=Falha%20ao%20concluir%20o%20login");
          return;
        }

        await ensureUserProfile(session.user);
        const profile = await getUserProfile(session.user.id);

        if (nextPath.startsWith("/admin")) {
          router.replace(profile?.role === "admin" ? nextPath : "/acesso-negado");
          return;
        }

        if (nextPath.startsWith("/atacado")) {
          const canAccessWholesale =
            profile?.role === "admin" || profile?.role === "importer";

          router.replace(canAccessWholesale ? nextPath : "/acesso-negado");
          return;
        }

        router.replace(nextPath);
      } catch (error) {
        console.error("Erro no callback de autenticação:", error);
        router.replace("/login?error=Falha%20ao%20processar%20o%20login");
      }
    }

    finalizeLogin();
  }, [router, searchParams]);

  return (
    <main className="min-h-screen bg-[#050816] px-4 py-12 text-white">
      <div className="mx-auto flex min-h-[60vh] max-w-2xl items-center justify-center">
        <div className="w-full rounded-3xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur-md">
          <h1 className="text-3xl font-semibold">Finalizando acesso</h1>
          <p className="mt-3 text-sm text-white/65">
            Aguarde enquanto validamos sua sessão.
          </p>

          <div className="mt-8 flex items-center justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        </div>
      </div>
    </main>
  );
}
