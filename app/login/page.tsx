"use client";

import Link from "next/link";
import { useState } from "react";

type LoginTab = "cliente" | "lojista" | "importador";

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<LoginTab>("cliente");

  return (
    <main className="auth-layout">
      <div className="container">
        <section className="page-hero">
          <div className="page-hero__grid">
            <div className="page-hero__content">
              <div className="page-hero__content-inner">
                <span className="eyebrow">Acesso premium</span>
                <h1 className="page-title">Minha conta</h1>
                <p className="page-text">
                  Entre para acompanhar pedidos, salvar preferências, acessar
                  condições especiais e viver a experiência completa da
                  D&apos;OUTRO LADO.
                </p>
              </div>
            </div>

            <div className="page-hero__media">
              <img
                src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80"
                alt="Editorial elegante de moda e acessórios"
              />
            </div>
          </div>
        </section>

        <section className="section-lg">
          <div className="auth-grid">
            <div className="auth-card">
              <div className="auth-card__header">
                <span className="eyebrow">Entrar</span>
                <h2 className="section-title">Acesse sua área</h2>
                <p className="section-text">
                  Escolha o perfil de acesso e entre com seus dados.
                </p>
              </div>

              <div className="tabs">
                <button
                  type="button"
                  className={`tab-button ${
                    activeTab === "cliente" ? "is-active" : ""
                  }`}
                  onClick={() => setActiveTab("cliente")}
                >
                  Cliente
                </button>

                <button
                  type="button"
                  className={`tab-button ${
                    activeTab === "lojista" ? "is-active" : ""
                  }`}
                  onClick={() => setActiveTab("lojista")}
                >
                  Lojista
                </button>

                <button
                  type="button"
                  className={`tab-button ${
                    activeTab === "importador" ? "is-active" : ""
                  }`}
                  onClick={() => setActiveTab("importador")}
                >
                  Importador cadastrado
                </button>
              </div>

              <form className="form-grid form-grid--single">
                <label className="form-label">
                  E-mail
                  <input
                    type="email"
                    className="text-input"
                    placeholder="seuemail@exemplo.com"
                  />
                </label>

                <label className="form-label">
                  Senha
                  <input
                    type="password"
                    className="text-input"
                    placeholder="Digite sua senha"
                  />
                </label>

                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    flexWrap: "wrap",
                  }}
                >
                  <label
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      color: "var(--foreground-soft)",
                      fontSize: "0.92rem",
                    }}
                  >
                    <input type="checkbox" />
                    Manter conectado
                  </label>

                  <Link
                    href="/recuperar-senha"
                    style={{
                      color: "var(--gold)",
                      fontSize: "0.92rem",
                    }}
                  >
                    Esqueci minha senha
                  </Link>
                </div>

                <button type="submit" className="primary-button">
                  Entrar como{" "}
                  {activeTab === "cliente"
                    ? "cliente"
                    : activeTab === "lojista"
                    ? "lojista"
                    : "importador"}
                </button>
              </form>
            </div>

            <div className="auth-card">
              <div className="auth-card__header">
                <span className="eyebrow">Cadastro</span>
                <h2 className="section-title">Ainda não tem conta?</h2>
                <p className="section-text">
                  Crie seu acesso para comprar, salvar favoritos e acompanhar
                  pedidos com mais facilidade.
                </p>
              </div>

              <form className="form-grid">
                <label className="form-label">
                  Nome completo
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Seu nome completo"
                  />
                </label>

                <label className="form-label">
                  E-mail
                  <input
                    type="email"
                    className="text-input"
                    placeholder="seuemail@exemplo.com"
                  />
                </label>

                <label className="form-label">
                  Telefone
                  <input
                    type="tel"
                    className="text-input"
                    placeholder="+55 16 99197-7845"
                  />
                </label>

                <label className="form-label">
                  País / região
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Brasil"
                  />
                </label>

                <label className="form-label">
                  Senha
                  <input
                    type="password"
                    className="text-input"
                    placeholder="Crie uma senha"
                  />
                </label>

                <label className="form-label">
                  Confirmar senha
                  <input
                    type="password"
                    className="text-input"
                    placeholder="Repita sua senha"
                  />
                </label>
              </form>

              <div
                style={{
                  display: "grid",
                  gap: "12px",
                  marginTop: "8px",
                }}
              >
                <label
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "10px",
                    color: "var(--foreground-soft)",
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                  }}
                >
                  <input type="checkbox" style={{ marginTop: "3px" }} />
                  Aceito os termos e políticas da plataforma.
                </label>

                <button type="submit" className="secondary-button">
                  Criar conta
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="section">
          <div className="account-panel-grid">
            <div className="account-stat">
              <div className="account-stat__label">Cliente</div>
              <div className="account-stat__value">Compra simples</div>
            </div>

            <div className="account-stat">
              <div className="account-stat__label">Lojista</div>
              <div className="account-stat__value">Condições especiais</div>
            </div>

            <div className="account-stat">
              <div className="account-stat__label">Importador</div>
              <div className="account-stat__value">Área diferenciada</div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}