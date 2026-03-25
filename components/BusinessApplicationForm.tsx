"use client";

import { useState } from "react";
import { businessApi } from "@/lib/businessApi";

type Props = {
  userType: "wholesale" | "importer";
  title: string;
  description: string;
};

export function BusinessApplicationForm({ userType, title, description }: Props) {
  const [status, setStatus] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    companyName: "",
    contactName: "",
    email: "",
    password: "",
    region: "France",
    taxId: "",
    notes: ""
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    try {
      setLoading(true);
      const result = await businessApi.apply({ ...form, userType, taxId: form.taxId || undefined, notes: form.notes || undefined });
      setStatus(`${result.message}. Status: ${result.approvalStatus}.`);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Não foi possível enviar o cadastro.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="business-card">
      <span className="section-eyebrow">Acesso comercial</span>
      <h1>{title}</h1>
      <p>{description}</p>

      <form className="auth-form" onSubmit={handleSubmit}>
        <input className="input-field" placeholder="Empresa" value={form.companyName} onChange={(e) => setForm((v) => ({ ...v, companyName: e.target.value }))} />
        <input className="input-field" placeholder="Responsável" value={form.contactName} onChange={(e) => setForm((v) => ({ ...v, contactName: e.target.value }))} />
        <input className="input-field" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} />
        <input className="input-field" type="password" placeholder="Senha" value={form.password} onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} />
        <input className="input-field" placeholder="Região / País" value={form.region} onChange={(e) => setForm((v) => ({ ...v, region: e.target.value }))} />
        <input className="input-field" placeholder="Tax ID / VAT / Documento" value={form.taxId} onChange={(e) => setForm((v) => ({ ...v, taxId: e.target.value }))} />
        <textarea className="input-field textarea-field" placeholder="Observações comerciais" value={form.notes} onChange={(e) => setForm((v) => ({ ...v, notes: e.target.value }))} />
        <button className="primary-button" disabled={loading}>{loading ? "Enviando..." : "Solicitar aprovação"}</button>
      </form>

      {status ? <p className="status-note">{status}</p> : null}
    </div>
  );
}
