"use client";

import Link from "next/link";
import { ShieldCheck, Store } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export default function PermissionLinks() {
  const { canSeeWholesale, canSeeAdmin } = useAuth();

  return (
    <>
      {canSeeWholesale && (
        <Link
          href="/atacado"
          className="rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
        >
          <span className="inline-flex items-center gap-2">
            <Store size={14} />
            Atacado
          </span>
        </Link>
      )}

      {canSeeAdmin && (
        <Link
          href="/admin"
          className="rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/80 transition hover:border-white/30 hover:bg-white/5 hover:text-white"
        >
          <span className="inline-flex items-center gap-2">
            <ShieldCheck size={14} />
            Admin
          </span>
        </Link>
      )}
    </>
  );
}