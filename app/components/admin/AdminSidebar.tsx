"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bell,
  CreditCard,
  Files,
  Flag,
  LayoutDashboard,
  Link2,
  LogOut,
  Settings,
  Terminal,
  Users,
  X,
} from "lucide-react";
import { logout } from "@/app/lib/auth-actions";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badgeWarn?: boolean;
};

const NAV_SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "Overview",
    items: [
      { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
      { href: "/admin/analytics", label: "Analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Manage",
    items: [
      { href: "/admin/users", label: "Users", icon: Users },
      { href: "/admin/content", label: "Content", icon: Files },
      { href: "/admin/reports", label: "Reports", icon: Flag },
    ],
  },
  {
    label: "Platform",
    items: [
      { href: "/admin/billing", label: "Billing & Plans", icon: CreditCard },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/settings", label: "Settings", icon: Settings },
    ],
  },
  {
    label: "System",
    items: [
      { href: "/admin/logs", label: "System Logs", icon: Terminal },
      { href: "/admin/api", label: "API & Integrations", icon: Link2 },
    ],
  },
];

export default function AdminSidebar({
  mobileOpen,
  onClose,
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] shrink-0 flex-col overflow-y-auto border-r border-border-soft bg-surface-1 transition-transform duration-200 md:static md:z-auto md:w-[220px] md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-end px-4 pt-3 md:hidden">
          <button
            type="button"
            onClick={onClose}
            title="Close menu"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 py-3">
          {NAV_SECTIONS.map(({ label, items }) => (
            <div key={label}>
              <div className="px-4 pb-1.5 pt-3.5 text-[10px] font-semibold uppercase tracking-[1.2px] text-text-muted">
                {label}
              </div>
              {items.map(({ href, label: itemLabel, icon: Icon, exact }) => {
                const active = exact
                  ? pathname === href
                  : pathname === href || pathname.startsWith(href + "/");
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={`flex items-center gap-2.5 rounded-lg mx-2 px-2.5 py-2 text-sm font-medium transition-colors ${
                      active
                        ? "bg-brand-tint text-brand"
                        : "text-text-muted hover:bg-surface-3 hover:text-text-strong"
                    }`}
                  >
                    <Icon className="h-[17px] w-[17px] shrink-0" />
                    {itemLabel}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>

        <div className="border-t border-border-soft">
          <form action={logout}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 rounded-lg mx-2 px-2.5 py-2 text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
            >
              <LogOut className="h-[17px] w-[17px] shrink-0" />
              Sign out
            </button>
          </form>
          <div className="px-4 py-2.5 text-[11px] text-text-muted">Admin Panel v2.4.0</div>
        </div>
      </aside>
    </>
  );
}
