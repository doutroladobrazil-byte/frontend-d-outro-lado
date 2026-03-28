import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { CartProvider } from "@/components/CartContext";

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
        <CartProvider>
          <div className="page-shell">
            <div className="topbar">
              <div className="topbar-inner" style={{ justifyContent: "center" }}>
                <span>Brasil sofisticado para o mundo</span>
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
                      strokeLinejoin="round"
                    >
                      <path d="M4 7h16" />
                      <path d="M4 12h16" />
                      <path d="M4 17h16" />
                    </svg>
                  </button>
                </div>

                <div className="site-header__center">
                  <Link href="/" aria-label="Ir para a página inicial">
                    <div className="brand-mark">D&apos;OUTRO LADO</div>
                  </Link>
                </div>

                <div className="site-header__right">
                  <nav
                    className="nav-links only-desktop"
                    aria-label="Navegação principal"
                  >
                    <Link href="/" className="nav-link">
                      Home
                    </Link>
                    <Link
                      href="/produtos/moda-estilo-e-acessorios"
                      className="nav-link"
                    >
                      Moda
                    </Link>
                    <Link href="/produtos/casa-e-decoracao" className="nav-link">
                      Casa
                    </Link>
                    <Link href="/atacado" className="nav-link">
                      Atacado
                    </Link>
                    <Link href="/sobre" className="nav-link">
                      Sobre
                    </Link>
                    <Link href="/contato" className="nav-link">
                      Contato
                    </Link>
                  </nav>

                  <div className="nav-actions">
                    <button
                      type="button"
                      className="chip-button only-desktop"
                      aria-label="Idioma"
                    >
                      EN
                    </button>

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
                        strokeLinejoin="round"
                      >
                        <circle cx="11" cy="11" r="6.5" />
                        <path d="M16 16l4 4" />
                      </svg>
                    </button>

                    <Link
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
                    </Link>

                    <Link href="/bag" className="icon-button" aria-label="Sacola">
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
                    </Link>
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
                      Curadoria premium de peças brasileiras com estética
                      refinada, presença internacional e experiência de compra
                      sofisticada.
                    </p>
                  </div>

                  <div className="footer-group">
                    <div className="footer-group__title">Navegação</div>
                    <Link href="/" className="footer-link">
                      Home
                    </Link>
                    <Link
                      href="/produtos/moda-estilo-e-acessorios"
                      className="footer-link"
                    >
                      Moda, vestuário e acessórios
                    </Link>
                    <Link href="/produtos/casa-e-decoracao" className="footer-link">
                      Casa, decoração e enxoval
                    </Link>
                    <Link href="/atacado" className="footer-link">
                      Atacado
                    </Link>
                  </div>

                  <div className="footer-group">
                    <div className="footer-group__title">Institucional</div>
                    <Link href="/sobre" className="footer-link">
                      Sobre
                    </Link>
                    <Link href="/contato" className="footer-link">
                      Contato
                    </Link>
                    <Link href="/login" className="footer-link">
                      Minha conta
                    </Link>
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
        </CartProvider>
      </body>
    </html>
  );
}