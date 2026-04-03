"use client";

import { useState } from "react";

export function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Login:", { email, password });
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto mt-10 w-full max-w-md rounded-2xl border border-white/10 bg-black p-6 text-white shadow-xl"
    >
      <h2 className="mb-6 text-center text-lg tracking-wide">
        Acesso administrativo
      </h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="mb-4 w-full rounded border border-white/20 bg-black px-3 py-2 outline-none focus:border-white"
      />

      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="mb-6 w-full rounded border border-white/20 bg-black px-3 py-2 outline-none focus:border-white"
      />

      <button
        type="submit"
        className="w-full rounded bg-white py-2 text-black transition hover:opacity-80"
      >
        Entrar
      </button>
    </form>
  );
}