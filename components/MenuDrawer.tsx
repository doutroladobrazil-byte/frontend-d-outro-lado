"use client";

import Link from "next/link";
import { X } from "lucide-react";
import { useEffect } from "react";

type MenuDrawerProps = {
  open: boolean;
  onClose: () => void;
};

const links = [
  { href: "/", label: "Home" },
  { href: "/sobre", label: "Sobre" },
  { href: "/atacado", label: "Atacado" },
  { href: "/contato", label: "Contato" },
  { href: "/login", label: "Login" },
  { href: "/bag", label: "Bag" },
  { href: "/produtos/moda-estilo-e-acessorios", label: "Moda, estilo e acessórios" },
  { href: "/produtos/casa-e-decoracao", label: "Casa e decoração" },
];

export default function MenuDrawer({
  open,
  onClose,
}: MenuDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  useEffect(() => {
    function handleEsc(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    if (open) {
      window.addEventListener("keydown", handleEsc);
    }

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="menu-drawer" role="dialog" aria-modal="true">
      <div className="menu-drawer__header">
        <p className="menu-drawer__kicker">MENU</p>

        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar menu"
          className="menu-drawer__close"
        >
          <X size={22} />
        </button>
      </div>

      <div className="menu-drawer__content">
        <nav className="menu-drawer__nav">
          {links.map((link) => (
            <Link key={link.href} href={link.href} onClick={onClose}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}