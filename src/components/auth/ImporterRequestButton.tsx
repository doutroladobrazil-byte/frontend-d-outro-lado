"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";

export default function ImporterRequestButton() {
  const router = useRouter();
  const { refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  async function handleRequest() {
    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/importer/request", {
        method: "POST",
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || "Erro ao liberar acesso de importador.");
      }

      await refreshProfile();
      setDone(true);
      router.refresh();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Erro inesperado.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-3">
      <button
        onClick={handleRequest}
        disabled={loading || done}
        className="rounded-full border border-white/15 bg-white/10 px-5 py-3 text-sm text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Liberando..."
          : done
          ? "Atacado liberado"
          : "Ativar conta de importador"}
      </button>

      {done ? (
        <p className="text-sm text-emerald-200/90">
          Sua conta foi liberada imediatamente para o atacado.
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-200">{error}</p> : null}
    </div>
  );
}
