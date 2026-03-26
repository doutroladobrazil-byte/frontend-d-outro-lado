"use client";

import Link from "next/link";
import { X } from "lucide-react";

export default function MenuDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* OVERLAY */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          open ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      />

      {/* MENU */}
      <div
        className={`fixed left-0 top-0 z-50 h-full w-[320px] bg-black border-r border-white/10 transform transition-transform duration-400 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 border-b border-white/10">
          <span
            className="text-[14px] tracking-[0.4em]"
            style={{ fontFamily: "serif" }}
          >
            D&apos;OUTRO LADO
          </span>

          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <nav className="flex flex-col gap-6 px-6 py-8 text-sm">
          <Link href="/" onClick={onClose}>
            Home
          </Link>

          <Link href="/produtos/moda-estilo-e-acessorios" onClick={onClose}>
            Moda e Acessórios
          </Link>

          <Link href="/produtos/casa-e-decoracao" onClick={onClose}>
            Casa e Decoração
          </Link>

          <Link href="/importadores" onClick={onClose}>
            Importadores
          </Link>

          <Link href="/lojistas" onClick={onClose}>
            Lojistas
          </Link>

          <Link href="/sobre" onClick={onClose}>
            Sobre
          </Link>

          <Link href="/contato" onClick={onClose}>
            Contato
          </Link>
        </nav>
      </div>
    </>
  );
}