"use client";

import { useMemo, useState } from "react";
import { ShieldCheck, Sparkles, Globe2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import type { RegisterAccountType } from "@/lib/auth";
import {
  resetPassword,
  signInWithApple,
  signInWithEmail,
  signInWithGoogle,
  signUpWithEmail,
} from "@/lib/auth";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const nextPath = useMemo(() => searchParams.get("next") || "/", [searchParams]);
  const initialError = useMemo(() => searchParams.get("error"), [searchParams]);

  const [mode, setMode] = useState<"login" | "register">("login");
  const [accountType, setAccountType] =
    useState<RegisterAccountType>("client");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(initialError);

  async function handleEmailAuth(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      if (mode === "login") {
        const { error } = await signInWithEmail(email, password);
        if (error) throw error;
        window.location.href = nextPath;
      } else {
        const { error, data } = await signUpWithEmail(
          email,
          password,
          accountType,
          fullName
        );

        if (error) throw error;

        if (data.session) {
          window.location.href = nextPath;
          return;
        }

        setMessage(
          "Conta criada com sucesso. Verifique seu e-mail para confirmar o cadastro."
        );
      }
    } catch (error: any) {
      setErrorMessage(error?.message || "Erro ao processar autenticação.");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!email) {
      setErrorMessage("Digite seu e-mail para recuperar a senha.");
      return;
    }

    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const { error } = await resetPassword(email);
      if (error) throw error;
      setMessage("Enviamos o link de recuperação para seu e-mail.");
    } catch (error: any) {
      setErrorMessage(error?.message || "Erro ao enviar recuperação de senha.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const { error } = await signInWithGoogle(nextPath);
      if (error) throw error;
    } catch (error: any) {
      setErrorMessage(error?.message || "Erro ao entrar com Google.");
      setLoading(false);
    }
  }

  async function handleAppleLogin() {
    setLoading(true);
    setMessage(null);
    setErrorMessage(null);

    try {
      const { error } = await signInWithApple(nextPath);
      if (error) throw error;
    } catch (error: any) {
      setErrorMessage(error?.message || "Erro ao entrar com Apple.");
      setLoading(false);
    }
  }

  return (
    <main className="login-store-page">
      <div className="login-store-shell">
        <section className="login-store-hero">
          <div className="login-store-badge">Acesso premium</div>

          <h1>
            Loja elegante,
            <br />
            acesso pronto para conversão.
          </h1>

          <p>
            Mantivemos seu padrão escuro sofisticado e elevamos a leitura visual
            da página de login para um nível mais comercial e confiável.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-card">
              <ShieldCheck size={18} />
              <div>
                <strong>Autenticação segura</strong>
                <span>Google, Apple, e-mail e recuperação de senha.</span>
              </div>
            </div>

            <div className="login-feature-card">
              <Sparkles size={18} />
              <div>
                <strong>Importador dinâmico</strong>
                <span>Cadastro de atacado com acesso a preços mais vantajosos.</span>
              </div>
            </div>

            <div className="login-feature-card">
              <Globe2 size={18} />
              <div>
                <strong>Estrutura internacional</strong>
                <span>Pronto para expansão com idioma, região e moeda.</span>
              </div>
            </div>
          </div>
        </section>

        <section className="login-store-panel">
          <div className="login-panel-top">
            <p className="login-panel-kicker">
              {mode === "login" ? "Entrar" : "Criar conta"}
            </p>
            <h2>
              {mode === "login"
                ? "Acesse sua conta"
                : "Abra sua conta premium"}
            </h2>
            <span>
              Entre no D&apos;OUTRO LADO com uma experiência mais refinada e pronta
              para loja real.
            </span>
          </div>

          <div className="login-social-grid">
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="login-social-button"
            >
              Continuar com Google
            </button>

            <button
              type="button"
              onClick={handleAppleLogin}
              disabled={loading}
              className="login-social-button"
            >
              Continuar com Apple
            </button>
          </div>

          <div className="login-divider">
            <span>ou entre com e-mail</span>
          </div>

          <form onSubmit={handleEmailAuth} className="login-form-grid">
            {mode === "register" ? (
              <>
                <div>
                  <label className="login-label">Nome completo</label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="login-input"
                    placeholder="Seu nome"
                  />
                </div>

                <div>
                  <label className="login-label">Tipo de conta</label>
                  <div className="account-type-grid">
                    <button
                      type="button"
                      onClick={() => setAccountType("client")}
                      className={`account-type-card ${
                        accountType === "client" ? "active" : ""
                      }`}
                    >
                      <strong>Cliente</strong>
                      <span>Compra padrão com experiência premium.</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccountType("importer")}
                      className={`account-type-card ${
                        accountType === "importer" ? "active" : ""
                      }`}
                    >
                      <strong>Importador</strong>
                      <span>Área de atacado e preços mais estratégicos.</span>
                    </button>
                  </div>
                </div>
              </>
            ) : null}

            <div>
              <label className="login-label">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="login-input"
                placeholder="seuemail@exemplo.com"
              />
            </div>

            <div>
              <label className="login-label">Senha</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="login-input"
                placeholder="Digite sua senha"
              />
            </div>

            <div className="login-row-actions">
              <button type="button" onClick={handleForgotPassword} className="login-text-button">
                Esqueci minha senha
              </button>

              <span className="login-bio-note">
                Biometria do celular pode ser vinculada após o primeiro acesso.
              </span>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="login-primary-button"
            >
              {loading
                ? "Processando..."
                : mode === "login"
                  ? "Entrar"
                  : "Criar conta"}
            </button>
          </form>

          <div className="login-footer-actions">
            <button
              type="button"
              onClick={() =>
                setMode((prev) => (prev === "login" ? "register" : "login"))
              }
              className="login-text-button"
            >
              {mode === "login" ? "Criar uma conta" : "Já tenho uma conta"}
            </button>
          </div>

          {message && <div className="login-message success">{message}</div>}
          {errorMessage && <div className="login-message error">{errorMessage}</div>}
        </section>
      </div>
    </main>
  );
}
