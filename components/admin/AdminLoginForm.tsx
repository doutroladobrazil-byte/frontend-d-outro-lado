"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("admin@doutrolado.com");
  const [password, setPassword] = useState("DoutroLado@123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await adminApi.login(email, password);
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Não foi possível entrar");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      <input className="input-field" placeholder="E-mail do administrador" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className="input-field" placeholder="Senha" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="primary-button" type="submit" disabled={loading}>{loading ? "Entrando..." : "Entrar no painel"}</button>
      {error ? <p className="form-error">{error}</p> : null}
      <p className="auth-tip">Autenticação persistente via cookie HTTP-only segura para ambiente real.</p>
    </form>
  );
}
