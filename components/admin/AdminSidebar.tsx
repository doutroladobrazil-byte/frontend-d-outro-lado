import Link from "next/link";
import { BarChart3, Boxes, Globe2, LayoutDashboard, PackageCheck, Settings2 } from "lucide-react";

const items = [
  { label: "Visão geral", icon: LayoutDashboard, href: "/admin" },
  { label: "Pedidos", icon: PackageCheck, href: "/admin#pedidos" },
  { label: "Catálogo", icon: Boxes, href: "/admin#catalogo" },
  { label: "Mercados", icon: Globe2, href: "/admin#mercados" },
  { label: "Relatórios", icon: BarChart3, href: "/admin#relatorios" },
  { label: "Configurações", icon: Settings2, href: "/admin#configuracoes" }
];

export function AdminSidebar() {
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar-top">
        <span className="section-eyebrow">Painel administrativo</span>
        <h1>D&apos;OUTRO LADO</h1>
        <p>Gestão visual do catálogo, operações internacionais e pedidos premium.</p>
      </div>

      <nav className="admin-nav">
        {items.map(({ label, icon: Icon, href }) => (
          <Link key={label} href={href} className="admin-nav-link">
            <Icon size={17} />
            <span>{label}</span>
          </Link>
        ))}
      </nav>

      <div className="admin-sidebar-foot">
        <span className="admin-pill">Modo visual</span>
        <p>Estrutura pronta para integrar autenticação, banco, NFe e analytics reais.</p>
      </div>
    </aside>
  );
}
