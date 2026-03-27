"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Eye, EyeOff, LockKeyhole, Mail, Chrome } from "lucide-react";

export default function LoginPage() {
  const [emailOrLogin, setEmailOrLogin] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const isDisabled = useMemo(() => {
    return !emailOrLogin.trim() || !password.trim() || loading;
  }, [emailOrLogin, password, loading]);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);

    try {
      /**
       * INTEGRAÇÃO REAL:
       * 1) validar email/login e senha
       * 2) se rememberMe === true, manter sessão persistente
       * 3) redirecionar para área correta após login
       */
      console.log({
        emailOrLogin,
        password,
        rememberMe,
      });

      alert("Login enviado. Agora conecte esta ação ao backend/Supabase.");
    } catch (error) {
      console.error(error);
      alert("Não foi possível entrar.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    setLoading(true);

    try {
      /**
       * REGRA DO PROJETO:
       * - ao clicar em Google:
       *   1) autentica com Google
       *   2) verifica se já existe cadastro
       *   3) se existir -> login normal
       *   4) se não existir -> redireciona para criar conta / completar cadastro
       */
      alert(
        "Fluxo Google iniciado. Depois conecte ao Supabase/Auth e verifique se o usuário já possui cadastro."
      );
    } catch (error) {
      console.error(error);
      alert("Não foi possível entrar com Google.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f8f6f2] text-neutral-900">
      <section className="mx-auto flex min-h-screen max-w-7xl items-center px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid w-full gap-8 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="hidden min-h-[720px] overflow-hidden rounded-[32px] border border-neutral-200 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.88),_rgba(237,233,225,0.92),_rgba(229,223,212,1))] p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
                Exportadora brasileira
              </p>

              <h1
                className="mt-5 text-5xl font-light tracking-[0.18em] text-neutral-900 xl:text-6xl"
                style={{ fontFamily: "serif" }}
              >
                D&apos;OUTRO LADO
              </h1>

              <p className="mt-6 max-w-xl text-base leading-7 text-neutral-600">
                Acesse sua conta para acompanhar sua bag, continuar sua curadoria
                e finalizar compras com uma experiência premium, elegante e fluida.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-[24px] border border-white/70 bg-white/70 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                  Bag vinculada
                </p>
                <p className="mt-3 text-sm leading-6 text-neutral-700">
                  Seus produtos ficam associados à sua conta.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/70 bg-white/70 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                  Pesquisa inteligente
                </p>
                <p className="mt-3 text-sm leading-6 text-neutral-700">
                  Busca por nomes, descrições e termos semelhantes.
                </p>
              </div>

              <div className="rounded-[24px] border border-white/70 bg-white/70 p-5 backdrop-blur">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                  Acesso seguro
                </p>
                <p className="mt-3 text-sm leading-6 text-neutral-700">
                  Sessão persistente com opção de salvar login.
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div className="w-full max-w-xl rounded-[32px] border border-neutral-200 bg-white p-6 shadow-[0_20px_70px_rgba(0,0,0,0.05)] sm:p-8 md:p-10">
              <div className="mb-8 text-center">
                <p className="text-xs uppercase tracking-[0.35em] text-neutral-500">
                  Bem-vindo
                </p>

                <h2
                  className="mt-3 text-3xl font-light tracking-[0.18em] sm:text-4xl"
                  style={{ fontFamily: "serif" }}
                >
                  D&apos;OUTRO LADO
                </h2>

                <p className="mt-4 text-sm leading-6 text-neutral-500">
                  Entre com seu login e senha ou continue com Google.
                </p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Email ou login
                  </span>

                  <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-[#fbfaf8] px-4 py-3 focus-within:border-neutral-400">
                    <Mail className="h-5 w-5 text-neutral-400" />
                    <input
                      type="text"
                      value={emailOrLogin}
                      onChange={(e) => setEmailOrLogin(e.target.value)}
                      placeholder="Digite seu email ou login"
                      className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                      autoComplete="username"
                    />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs font-medium uppercase tracking-[0.2em] text-neutral-500">
                    Senha
                  </span>

                  <div className="flex items-center gap-3 rounded-2xl border border-neutral-200 bg-[#fbfaf8] px-4 py-3 focus-within:border-neutral-400">
                    <LockKeyhole className="h-5 w-5 text-neutral-400" />

                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Digite sua senha"
                      className="w-full bg-transparent text-sm text-neutral-900 outline-none placeholder:text-neutral-400"
                      autoComplete={rememberMe ? "current-password" : "off"}
                    />

                    <button
                      type="button"
                      aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="text-neutral-500 transition hover:text-neutral-900"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </label>

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <label className="inline-flex items-center gap-3 text-sm text-neutral-600">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={() => setRememberMe((prev) => !prev)}
                      className="h-4 w-4 rounded border-neutral-300"
                    />
                    Salvar login e senha
                  </label>

                  <Link
                    href="/recuperar-senha"
                    className="text-sm text-neutral-600 transition hover:text-neutral-900"
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <button
                  type="submit"
                  disabled={isDisabled}
                  className="w-full rounded-2xl bg-neutral-900 px-5 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Entrando..." : "Entrar"}
                </button>
              </form>

              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-neutral-200" />
                <span className="text-xs uppercase tracking-[0.24em] text-neutral-400">
                  ou
                </span>
                <div className="h-px flex-1 bg-neutral-200" />
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm font-medium text-neutral-900 transition hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Chrome className="h-5 w-5" />
                Entrar com Google
              </button>

              <div className="mt-8 text-center">
                <p className="text-sm text-neutral-500">
                  Ainda não tem acesso?{" "}
                  <Link
                    href="/criar-conta"
                    className="font-medium text-neutral-900 underline underline-offset-4"
                  >
                    Primeiro acesso
                  </Link>
                </p>
              </div>

              <div className="mt-8 rounded-[24px] border border-neutral-200 bg-[#fbfaf8] p-5 lg:hidden">
                <p className="text-xs uppercase tracking-[0.28em] text-neutral-500">
                  Exportadora brasileira
                </p>
                <h3
                  className="mt-3 text-2xl font-light tracking-[0.16em]"
                  style={{ fontFamily: "serif" }}
                >
                  D&apos;OUTRO LADO
                </h3>
                <p className="mt-3 text-sm leading-6 text-neutral-600">
                  Curadoria premium, bag vinculada à conta e experiência elegante
                  em todos os dispositivos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}