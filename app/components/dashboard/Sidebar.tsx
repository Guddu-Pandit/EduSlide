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
  X,
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
  onNavigate,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number;
  collapsed: boolean;
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onNavigate}
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
  planExpiresAt,
  presentationsCount,
  mobileOpen,
  onClose,
}: {
  fullName: string | null;
  email: string | undefined;
  plan: Plan;
  planExpiresAt: string | null;
  presentationsCount: number;
  mobileOpen: boolean;
  onClose: () => void;
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

  // The drawer always shows full labels on mobile — collapsing only makes
  // sense for the persistent desktop rail, not a transient overlay.
  const iconOnly = collapsed && !mobileOpen;

  const displayName = fullName || email || "Your account";
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={onClose} aria-hidden="true" />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[240px] flex-shrink-0 flex-col overflow-y-auto overflow-x-hidden border-r border-border-soft bg-surface-1 transition-transform duration-200 md:static md:z-auto md:translate-x-0 md:transition-[width] ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        } ${collapsed ? "md:w-[68px]" : "md:w-[220px]"}`}
      >
        <div
          className={`flex items-center border-b border-border-soft px-4 pb-3 pt-[18px] ${
            iconOnly ? "flex-col gap-2.5" : "justify-between gap-2"
          }`}
        >
          <Link
            href="/dashboard"
            onClick={onClose}
            className={`flex items-center gap-2.5 overflow-hidden font-display text-base font-bold tracking-tight text-text-strong ${
              iconOnly ? "justify-center" : ""
            }`}
          >
            <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[7px] bg-brand text-sm font-bold text-white">
              E
            </span>
            {!iconOnly && (
              <span className="whitespace-nowrap">
                Edu<span className="text-brand">Slide</span>
              </span>
            )}
          </Link>
          <button
            type="button"
            onClick={toggleCollapsed}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="hidden h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong md:flex"
          >
            {collapsed ? <PanelLeftOpen className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={onClose}
            title="Close menu"
            className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong md:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
          {!iconOnly && (
            <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Main</div>
          )}
          {mainItems.map((item) => (
            <NavLink
              key={item.href}
              {...item}
              collapsed={iconOnly}
              onNavigate={onClose}
              badge={item.href === "/dashboard/presentations" ? presentationsCount : undefined}
            />
          ))}
        </nav>

        {iconOnly && <div className="mx-3 my-1 h-px bg-border-soft" aria-hidden="true" />}
        <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
          {!iconOnly && (
            <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Manage
            </div>
          )}
          {manageItems.map((item) => (
            <NavLink key={item.href} {...item} collapsed={iconOnly} onNavigate={onClose} />
          ))}
        </nav>

        {iconOnly && <div className="mx-3 my-1 h-px bg-border-soft" aria-hidden="true" />}
        <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
          {!iconOnly && (
            <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
              Account
            </div>
          )}
          {accountItems.map((item) => (
            <NavLink key={item.href} {...item} collapsed={iconOnly} onNavigate={onClose} />
          ))}
          <button
            type="button"
            title={iconOnly ? "Help" : undefined}
            className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong ${
              iconOnly ? "justify-center" : ""
            }`}
          >
            <HelpCircle className="h-[17px] w-[17px] flex-shrink-0" />
            {!iconOnly && "Help"}
          </button>
        </nav>

        <div className="mt-auto border-t border-border-soft px-2.5 py-3">
          <Link
            href="/dashboard/settings"
            onClick={onClose}
            title={iconOnly ? displayName : undefined}
            className={`flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-3 ${
              iconOnly ? "justify-center" : ""
            }`}
          >
            <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
              {initials || "?"}
            </span>
            {!iconOnly && (
              <>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-semibold text-text-strong">{displayName}</span>
                  <span className="block text-[11px] text-text-muted">
                    {PLAN_LABEL[plan]}
                    {planExpiresAt && plan !== "free" && (
                      <> · renews {new Date(planExpiresAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</>
                    )}
                  </span>
                </span>
                <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-text-muted" />
              </>
            )}
          </Link>
          <form action={logout}>
            <button
              type="submit"
              title={iconOnly ? "Sign out" : undefined}
              className={`mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong ${
                iconOnly ? "justify-center" : ""
              }`}
            >
              <LogOut className="h-[17px] w-[17px] flex-shrink-0" />
              {!iconOnly && "Sign out"}
            </button>
          </form>
        </div>
      </aside>
    </>
  );
}
