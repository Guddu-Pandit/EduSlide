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
} from "lucide-react";
import { logout } from "@/app/lib/auth-actions";

type NavItem = {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number;
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
      { href: "/admin/users", label: "Users", icon: Users, badge: 12 },
      { href: "/admin/content", label: "Content", icon: Files },
      { href: "/admin/reports", label: "Reports", icon: Flag, badge: 3, badgeWarn: true },
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

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-[220px] shrink-0 flex-col overflow-y-auto border-r border-[#e4e6eb] bg-white">
      <div className="flex-1 py-3">
        {NAV_SECTIONS.map(({ label, items }) => (
          <div key={label}>
            <div className="px-4 pb-1.5 pt-3.5 text-[10px] font-semibold uppercase tracking-[1.2px] text-[#9ca3af]">
              {label}
            </div>
            {items.map(({ href, label: itemLabel, icon: Icon, badge, badgeWarn, exact }) => {
              const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-4 py-2 text-[13px] transition-colors ${
                    active
                      ? "bg-[#eef3ff] font-medium text-[#3b6ef8]"
                      : "text-[#4b5563] hover:bg-[#f7f8fa]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {itemLabel}
                  {badge !== undefined && (
                    <span
                      className="ml-auto rounded-full px-1.5 py-px text-[10px] font-bold text-white"
                      style={{ background: badgeWarn ? "#ca8a04" : "#dc2626" }}
                    >
                      {badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      <div className="border-t border-[#e4e6eb]">
        <form action={logout}>
          <button
            type="submit"
            className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13px] text-[#4b5563] hover:bg-[#f7f8fa]"
          >
            <LogOut className="h-4 w-4 shrink-0" />
            Sign out
          </button>
        </form>
        <div className="px-4 py-2.5 text-[11px] text-[#9ca3af]">Admin Panel v2.4.0</div>
      </div>
    </aside>
  );
}
