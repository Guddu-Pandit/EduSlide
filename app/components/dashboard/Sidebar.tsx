"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChevronRight,
  CreditCard,
  Files,
  HelpCircle,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
  Presentation,
  Settings,
  Upload,
} from "lucide-react";
import { logout } from "@/app/lib/auth-actions";
import type { Plan } from "@/app/lib/dashboard/plan";

const COLLAPSE_KEY = "eduslide-sidebar-collapsed";

const mainItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, exact: true },
  { href: "/dashboard/presentations", label: "Presentations", icon: Presentation },
  { href: "/dashboard/documents", label: "Documents", icon: Files },
  { href: "/dashboard/upload", label: "New upload", icon: Upload },
];

const manageItems = [
  { href: "/dashboard/templates", label: "Templates", icon: LayoutTemplate },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

const accountItems = [{ href: "/dashboard/billing", label: "Billing", icon: CreditCard }];

const PLAN_LABEL: Record<Plan, string> = { free: "Free plan", pro: "Pro plan", team: "Team plan" };

function NavLink({
  href,
  label,
  icon: Icon,
  exact,
  badge,
  collapsed,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number;
  collapsed: boolean;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
        collapsed ? "justify-center" : ""
      } ${active ? "bg-brand-tint text-brand" : "text-text-muted hover:bg-surface-3 hover:text-text-strong"}`}
    >
      <Icon className="h-[17px] w-[17px] flex-shrink-0" />
      {!collapsed && label}
      {!collapsed && !!badge && (
        <span className="ml-auto min-w-[18px] rounded-full bg-brand px-1.5 py-px text-center text-[10px] font-bold text-white">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function Sidebar({
  fullName,
  email,
  plan,
  presentationsCount,
}: {
  fullName: string | null;
  email: string | undefined;
  plan: Plan;
  presentationsCount: number;
}) {
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    setCollapsed(localStorage.getItem(COLLAPSE_KEY) === "1");
  }, []);

  function toggleCollapsed() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  }

  const displayName = fullName || email || "Your account";
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <aside
      className={`flex flex-shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-border-soft bg-surface-1 transition-[width] duration-200 ${
        collapsed ? "w-[68px]" : "w-[220px]"
      }`}
    >
      <div
        className={`flex items-center border-b border-border-soft px-4 pb-3 pt-[18px] ${
          collapsed ? "flex-col gap-2" : "justify-between gap-2"
        }`}
      >
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 overflow-hidden font-display text-base font-bold tracking-tight text-text-strong"
        >
          <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[7px] bg-brand text-sm font-bold text-white">
            E
          </span>
          {!collapsed && (
            <span className="whitespace-nowrap">
              Edu<span className="text-brand">Slide</span>
            </span>
          )}
        </Link>
        <button
          type="button"
          onClick={toggleCollapsed}
          title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
        >
          {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
        </button>
      </div>

      <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
        {!collapsed && (
          <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Main</div>
        )}
        {mainItems.map((item) => (
          <NavLink
            key={item.href}
            {...item}
            collapsed={collapsed}
            badge={item.href === "/dashboard/presentations" ? presentationsCount : undefined}
          />
        ))}
      </nav>

      <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
        {!collapsed && (
          <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Manage</div>
        )}
        {manageItems.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} />
        ))}
      </nav>

      <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
        {!collapsed && (
          <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Account</div>
        )}
        {accountItems.map((item) => (
          <NavLink key={item.href} {...item} collapsed={collapsed} />
        ))}
        <button
          type="button"
          title={collapsed ? "Help" : undefined}
          className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <HelpCircle className="h-[17px] w-[17px] flex-shrink-0" />
          {!collapsed && "Help"}
        </button>
      </nav>

      <div className="mt-auto border-t border-border-soft px-2.5 py-3">
        <Link
          href="/dashboard/settings"
          title={collapsed ? displayName : undefined}
          className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-3 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
            {initials || "?"}
          </span>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-semibold text-text-strong">{displayName}</span>
                <span className="block text-[11px] text-text-muted">{PLAN_LABEL[plan]}</span>
              </span>
              <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-text-muted" />
            </>
          )}
        </Link>
        <form action={logout}>
          <button
            type="submit"
            title={collapsed ? "Sign out" : undefined}
            className={`mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <LogOut className="h-[17px] w-[17px] flex-shrink-0" />
            {!collapsed && "Sign out"}
          </button>
        </form>
      </div>
    </aside>
  );
}
