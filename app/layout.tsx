import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "D'OUTRO LADO",
  description:
    "Brasil sofisticado para o mundo. Curadoria premium de moda, couro, acessórios, cerâmica, decoração e enxoval.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <div className="page-shell">
          <div className="topbar">
            <div className="topbar-inner">
              <span>Brasil sofisticado para o mundo</span>
              <span>Curadoria premium • Exportação internacional</span>
            </div>
          </div>

          <header className="site-header site-header--solid">
            <div className="site-header__inner">
              <div className="site-header__left">
                <button
                  type="button"
                  className="menu-trigger"
                  aria-label="Abrir menu"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  >
                    <path d="M4 7h16" />
                    <path d="M4 12h16" />
                    <path d="M4 17h16" />
                  </svg>
                </button>

                <div className="nav-meta only-desktop">
                  <button type="button" className="chip-button">
                    EN
                  </button>
                  <button type="button" className="chip-button">
                    Europe
                  </button>
                  <button type="button" className="chip-button">
                    EUR
                  </button>
                </div>
              </div>

              <div className="site-header__center">
                <a href="/" aria-label="Ir para a página inicial">
                  <div className="brand-mark">D&apos;OUTRO LADO</div>
                  <div className="brand-subtitle">Brasil sofisticado para o mundo</div>
                </a>
              </div>

              <div className="site-header__right">
                <div className="nav-links only-desktop">
                  <a href="/" className="nav-link">
                    Home
                  </a>
                  <a href="/produtos/moda-estilo-e-acessorios" className="nav-link">
                    Moda
                  </a>
                  <a href="/produtos/casa-e-decoracao" className="nav-link">
                    Casa
                  </a>
                  <a href="/sobre" className="nav-link">
                    Sobre
                  </a>
                  <a href="/contato" className="nav-link">
                    Contato
                  </a>
                </div>

                <div className="nav-actions">
                  <button
                    type="button"
                    className="nav-search-button"
                    aria-label="Pesquisar"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                    >
                      <circle cx="11" cy="11" r="6.5" />
                      <path d="M16 16l4 4" />
                    </svg>
                  </button>

                  <a
                    href="/login"
                    className="icon-button"
                    aria-label="Entrar na conta"
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 21a8 8 0 0 0-16 0" />
                      <circle cx="12" cy="8" r="4" />
                    </svg>
                  </a>

                  <a href="/bag" className="icon-button" aria-label="Sacola">
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M6 8h12l-1 12H7L6 8Z" />
                      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </header>

          <main>{children}</main>

          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-top">
                <div className="footer-brand">
                  <div className="footer-title">D&apos;OUTRO LADO</div>
                  <p className="footer-text">
                    Curadoria premium de peças brasileiras com estética refinada,
                    presença internacional e experiência de compra sofisticada.
                  </p>
                </div>

                <div className="footer-group">
                  <div className="footer-group__title">Navegação</div>
                  <a href="/" className="footer-link">
                    Home
                  </a>
                  <a
                    href="/produtos/moda-estilo-e-acessorios"
                    className="footer-link"
                  >
                    Moda, vestuário e acessórios
                  </a>
                  <a href="/produtos/casa-e-decoracao" className="footer-link">
                    Casa, decoração e enxoval
                  </a>
                </div>

                <div className="footer-group">
                  <div className="footer-group__title">Institucional</div>
                  <a href="/sobre" className="footer-link">
                    Sobre
                  </a>
                  <a href="/contato" className="footer-link">
                    Contato
                  </a>
                  <a href="/login" className="footer-link">
                    Minha conta
                  </a>
                </div>

                <div className="footer-group">
                  <div className="footer-group__title">Atendimento</div>
                  <span className="footer-text">Exportação internacional</span>
                  <span className="footer-text">Suporte premium</span>
                  <span className="footer-text">Experiência multilíngue</span>
                </div>
              </div>

              <div className="footer-bottom">
                <span className="footer-copy">
                  © 2026 D&apos;OUTRO LADO. Todos os direitos reservados.
                </span>
                <span className="footer-copy">
                  Brasil sofisticado para o mundo.
                </span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}