"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import AccessGate from "@/components/auth/AccessGate";
import type { UserRole } from "@/lib/auth";

type AdminUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  role: UserRole;
  approved: boolean;
  created_at?: string;
  updated_at?: string;
};

function getStatusLabel(user: AdminUser) {
  if (user.role === "admin") return "Administrador";
  if (user.role === "importer") return "Importador ativo";
  return "Cliente";
}

function AdminImportersContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/admin/users", {
        method: "GET",
        cache: "no-store",
        credentials: "include",
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(json?.error || "Não foi possível carregar importadores.");
      }

      setUsers(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Erro inesperado ao carregar importadores."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const importerUsers = useMemo(
    () => users.filter((user) => user.role === "importer"),
    [users]
  );

  const summary = useMemo(() => {
    const active = importerUsers.length;
    const clients = users.filter((user) => user.role === "client").length;
    const admins = users.filter((user) => user.role === "admin").length;

    return {
      total: users.length,
      active,
      clients,
      admins,
    };
  }, [importerUsers, users]);

  async function runAction(userId: string, action: "approve" | "reject") {
    try {
      setBusyId(userId);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/importers/${userId}/${action}`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(
          data?.error || `Não foi possível ${action === "approve" ? "liberar" : "remover"} o importador.`
        );
      }

      setSuccess(
        action === "approve"
          ? "Conta marcada como importador com sucesso."
          : "Conta revertida para cliente com sucesso."
      );

      await loadUsers();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado ao atualizar status."
      );
    } finally {
      setBusyId(null);
    }
  }

  return (
    <main className="page-shell">
      <section className="content-section">
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            display: "grid",
            gap: 24,
          }}
        >
          <div className="summary-card">
            <span className="section-eyebrow">Administração</span>
            <h1 style={{ marginTop: 10 }}>Importadores no Supabase</h1>
            <p
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
              }}
            >
              Nesta versão corrigida, o atacado não depende de aprovação manual. Esta área serve para
              promover clientes para importador ou reverter importadores para cliente quando necessário.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            <div className="summary-card">
              <strong>Total de usuários</strong>
              <div style={{ marginTop: 8 }}>{summary.total}</div>
            </div>

            <div className="summary-card">
              <strong>Importadores ativos</strong>
              <div style={{ marginTop: 8 }}>{summary.active}</div>
            </div>

            <div className="summary-card">
              <strong>Clientes</strong>
              <div style={{ marginTop: 8 }}>{summary.clients}</div>
            </div>

            <div className="summary-card">
              <strong>Admins</strong>
              <div style={{ marginTop: 8 }}>{summary.admins}</div>
            </div>
          </div>

          {success ? (
            <div className="summary-card" style={{ color: "#d1fae5" }}>
              {success}
            </div>
          ) : null}

          {error ? (
            <div className="summary-card" style={{ color: "#fecaca" }}>
              {error}
            </div>
          ) : null}

          <div style={{ display: "grid", gap: 16 }}>
            {loading ? (
              <div className="summary-card">Carregando importadores...</div>
            ) : users.length === 0 ? (
              <div className="summary-card">Nenhum usuário encontrado.</div>
            ) : (
              users.map((user) => {
                const isBusy = busyId === user.id;

                return (
                  <article
                    key={user.id}
                    className="summary-card"
                    style={{
                      display: "grid",
                      gap: 18,
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 16,
                        flexWrap: "wrap",
                        alignItems: "start",
                      }}
                    >
                      <div>
                        <h2 style={{ fontSize: 24 }}>
                          {user.full_name?.trim() || "Usuário sem nome"}
                        </h2>
                        <div
                          style={{
                            marginTop: 10,
                            color: "rgba(255,255,255,0.72)",
                            lineHeight: 1.7,
                          }}
                        >
                          {user.email || "Sem e-mail"}
                        </div>
                      </div>

                      <div className="summary-card" style={{ padding: "10px 14px" }}>
                        {getStatusLabel(user)}
                      </div>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 16,
                        flexWrap: "wrap",
                        color: "rgba(255,255,255,0.78)",
                        fontSize: 14,
                      }}
                    >
                      <span>Role: {user.role}</span>
                      <span>Atacado: {user.role === "importer" ? "Liberado" : "Bloqueado"}</span>
                      <span>
                        Atualizado em:{" "}
                        {user.updated_at
                          ? new Date(user.updated_at).toLocaleString("pt-BR")
                          : "—"}
                      </span>
                    </div>

                    <div
                      style={{
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                      }}
                    >
                      <button
                        type="button"
                        className="primary-button"
                        disabled={isBusy || user.role === "importer" || user.role === "admin"}
                        onClick={() => runAction(user.id, "approve")}
                      >
                        {isBusy ? "Processando..." : "Definir como importador"}
                      </button>

                      <button
                        type="button"
                        className="secondary-button"
                        disabled={isBusy || user.role !== "importer"}
                        onClick={() => runAction(user.id, "reject")}
                      >
                        Voltar para cliente
                      </button>
                    </div>
                  </article>
                );
              })
            )}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/admin" className="secondary-button button-link">
              Voltar ao painel
            </Link>

            <Link href="/admin/usuarios" className="secondary-button button-link">
              Gerenciar usuários
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AdminImportersPage() {
  return (
    <AccessGate requireAuth requireAdmin>
      <AdminImportersContent />
    </AccessGate>
  );
}
