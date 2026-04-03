"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  ChevronRight,
  Home,
  ShoppingBag,
  Gem,
  Globe,
  User,
  ShieldCheck,
  Package,
  Phone,
} from "lucide-react";

type MenuDrawerProps = {
  open: boolean;
  onClose: () => void;
  className?: string;
};

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
};

const primaryLinks: NavItem[] = [
  { href: "/", label: "Início", icon: Home },
  { href: "/produtos", label: "Categorias", icon: ShoppingBag },
  { href: "/produtos", label: "Novidades", icon: Gem },
  { href: "/atacado", label: "Atacado", icon: Package, badge: "B2B" },
  { href: "/login", label: "Login", icon: User },
  { href: "/admin", label: "Admin", icon: ShieldCheck },
];

const supportLinks: NavItem[] = [
  { href: "/sobre", label: "Sobre", icon: Globe },
  { href: "/contato", label: "Contato", icon: Phone },
];

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function MenuDrawer({
  open,
  onClose,
  className,
}: MenuDrawerProps) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <>
      {/* OVERLAY */}
      <div
        className={cn(
          "fixed inset-0 z-[120] transition-all duration-300",
          open
            ? "pointer-events-auto bg-black/60 backdrop-blur-[2px]"
            : "pointer-events-none bg-black/0"
        )}
        onClick={onClose}
      />

      {/* DRAWER */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-[130] h-screen w-[88vw] max-w-[380px]",
          "border-r border-white/10 bg-[#07090d]/95 text-white shadow-2xl",
          "backdrop-blur-2xl transition-transform duration-300",
          open ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="flex h-full flex-col">
          {/* HEADER */}
          <div className="border-b border-white/10 px-5 pb-5 pt-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[10px] tracking-[0.38em] text-white/45">
                  D&apos;OUTRO LADO
                </p>
                <h2 className="mt-2 text-lg font-semibold text-white">
                  Menu
                </h2>
              </div>

              <button
                onClick={onClose}
                className="h-10 w-10 rounded-full border border-white/12 bg-white/[0.06] flex items-center justify-center"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* LINKS */}
          <div className="flex-1 overflow-y-auto px-4 py-4">
            <nav className="space-y-2">
              {primaryLinks.map((item) => {
                const Icon = item.icon;
                const active = pathname?.startsWith(item.href);

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center justify-between px-4 py-3 rounded-[20px] transition",
                      active
                        ? "bg-white/10 border border-white/20"
                        : "hover:bg-white/5"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </div>

                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                );
              })}
            </nav>

            <div className="my-5 h-px bg-white/10" />

            <nav className="space-y-2">
              {supportLinks.map((item) => {
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className="flex items-center justify-between px-4 py-3 rounded-[18px] hover:bg-white/5"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span className="text-sm">{item.label}</span>
                    </div>

                    <ChevronRight className="h-4 w-4 opacity-40" />
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </aside>
    </>
  );
}