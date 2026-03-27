"use client";

import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="internal-page">
      <section className="internal-shell">
        <div className="internal-header">
          <p className="internal-kicker">ACESSO</p>
          <h1 className="internal-title">Entrar</h1>
          <p className="internal-text">
            Acesse sua conta para acompanhar pedidos, favoritos e condições
            especiais de compra.
          </p>
        </div>

        <div className="auth-grid">
          <div className="auth-card">
            <p className="auth-card__kicker">Cliente</p>
            <h2 className="auth-card__title">Login principal</h2>

            <form className="auth-form">
              <div className="field">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" placeholder="seuemail@exemplo.com" />
              </div>

              <div className="field">
                <label htmlFor="password">Senha</label>
                <input id="password" type="password" placeholder="••••••••" />
              </div>

              <div className="auth-row">
                <Link href="/recuperar-senha" className="auth-link">
                  Esqueci minha senha
                </Link>
              </div>

              <button type="submit" className="primary-button">
                Entrar
              </button>
            </form>
          </div>

          <div className="auth-card">
            <p className="auth-card__kicker">Lojistas e importadores</p>
            <h2 className="auth-card__title">Acesso profissional</h2>
            <p className="auth-card__text">
              Solicite aprovação para visualizar condições especiais, atacado e
              fluxos exclusivos para parceiros.
            </p>

            <div className="auth-actions">
              <Link href="/atacado" className="secondary-button">
                Ver área de atacado
              </Link>

              <Link href="/contato" className="ghost-button">
                Solicitar cadastro
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}