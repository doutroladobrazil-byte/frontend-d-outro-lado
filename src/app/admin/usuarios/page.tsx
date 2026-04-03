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

const ROLE_LABEL: Record<UserRole, string> = {
  client: "Cliente",
  importer: "Importador",
  admin: "Admin",
};

function getApprovalLabel(user: AdminUser) {
  if (user.role === "admin") return "Acesso total";
  if (user.role === "client") return "Varejo";
  return "Atacado liberado";
}

function AdminUsersContent() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [savingId, setSavingId] = useState<string | null>(null);

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
        throw new Error(json?.error || "Não foi possível carregar os usuários.");
      }

      setUsers(Array.isArray(json?.data) ? json.data : []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado ao carregar usuários."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const summary = useMemo(() => {
    return {
      total: users.length,
      admins: users.filter((user) => user.role === "admin").length,
      importers: users.filter((user) => user.role === "importer").length,
      approvedImporters: users.filter((user) => user.role === "importer").length,
    };
  }, [users]);

  async function updateRole(userId: string, role: UserRole) {
    try {
      setSavingId(userId);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ role }),
      });

      const json = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(json?.error || "Não foi possível atualizar a função.");
      }

      setUsers((current) =>
        current.map((user) => (user.id === userId ? { ...user, ...json.data } : user))
      );
      setSuccess("Função do usuário atualizada com sucesso.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erro inesperado ao atualizar função."
      );
    } finally {
      setSavingId(null);
    }
  }

  return (
    <main className="page-shell">
      <section className="content-section">
        <div
          style={{
            maxWidth: 1320,
            margin: "0 auto",
            display: "grid",
            gap: 24,
          }}
        >
          <div className="summary-card">
            <span className="section-eyebrow">Administração</span>
            <h1 style={{ marginTop: 10 }}>Usuários e permissões</h1>
            <p
              style={{
                marginTop: 16,
                color: "rgba(255,255,255,0.72)",
                lineHeight: 1.7,
              }}
            >
              Esta tela agora está ligada ao Supabase. Aqui você consegue ver os
              perfis reais cadastrados e trocar a função de acesso de cada usuário.
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
              <strong>Admins</strong>
              <div style={{ marginTop: 8 }}>{summary.admins}</div>
            </div>
            <div className="summary-card">
              <strong>Importadores</strong>
              <div style={{ marginTop: 8 }}>{summary.importers}</div>
            </div>
            <div className="summary-card">
              <strong>Atacado liberado</strong>
              <div style={{ marginTop: 8 }}>{summary.approvedImporters}</div>
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

          <div className="summary-card" style={{ overflowX: "auto" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                marginBottom: 18,
              }}
            >
              <div>
                <h2>Perfis cadastrados</h2>
                <p
                  style={{
                    marginTop: 8,
                    color: "rgba(255,255,255,0.68)",
                    lineHeight: 1.7,
                  }}
                >
                  Mudanças feitas aqui afetam diretamente a tabela <strong>profiles</strong>{" "}
                  do Supabase.
                </p>
              </div>
            </div>

            {loading ? (
              <div>Carregando usuários...</div>
            ) : users.length === 0 ? (
              <div>Nenhum usuário encontrado.</div>
            ) : (
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  minWidth: 940,
                }}
              >
                <thead>
                  <tr style={{ textAlign: "left", borderBottom: "1px solid rgba(255,255,255,0.12)" }}>
                    <th style={{ padding: "14px 12px" }}>Nome</th>
                    <th style={{ padding: "14px 12px" }}>E-mail</th>
                    <th style={{ padding: "14px 12px" }}>Função atual</th>
                    <th style={{ padding: "14px 12px" }}>Status comercial</th>
                    <th style={{ padding: "14px 12px" }}>Alterar função</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => {
                    const isSaving = savingId === user.id;

                    return (
                      <tr
                        key={user.id}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}
                      >
                        <td style={{ padding: "16px 12px", verticalAlign: "top" }}>
                          <div style={{ fontWeight: 600 }}>
                            {user.full_name?.trim() || "Usuário sem nome"}
                          </div>
                          <div
                            style={{
                              marginTop: 8,
                              fontSize: 12,
                              color: "rgba(255,255,255,0.52)",
                            }}
                          >
                            ID: {user.id}
                          </div>
                        </td>
                        <td style={{ padding: "16px 12px", verticalAlign: "top" }}>
                          {user.email || "—"}
                        </td>
                        <td style={{ padding: "16px 12px", verticalAlign: "top" }}>
                          {ROLE_LABEL[user.role]}
                        </td>
                        <td style={{ padding: "16px 12px", verticalAlign: "top" }}>
                          {getApprovalLabel(user)}
                        </td>
                        <td style={{ padding: "16px 12px", verticalAlign: "top" }}>
                          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                            <select
                              value={user.role}
                              disabled={isSaving}
                              onChange={(event) =>
                                updateRole(user.id, event.target.value as UserRole)
                              }
                              className="input-field"
                              style={{ minWidth: 180 }}
                            >
                              <option value="client">Cliente</option>
                              <option value="importer">Importador</option>
                              <option value="admin">Admin</option>
                            </select>
                            <span
                              style={{
                                fontSize: 12,
                                color: "rgba(255,255,255,0.56)",
                              }}
                            >
                              {isSaving ? "Salvando..." : ""}
                            </span>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/admin" className="secondary-button button-link">
              Voltar ao painel
            </Link>
            <Link href="/admin/importadores" className="secondary-button button-link">
              Ver importadores
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function AdminUsersPage() {
  return (
    <AccessGate requireAuth requireAdmin>
      <AdminUsersContent />
    </AccessGate>
  );
}
