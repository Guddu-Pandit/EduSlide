"use client";

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
  Presentation,
  Settings,
  Upload,
} from "lucide-react";
import { logout } from "@/app/lib/auth-actions";
import type { Plan } from "@/app/lib/dashboard/plan";

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
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
  badge?: number;
}) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname.startsWith(href);

  return (
    <Link
      href={href}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors ${
        active ? "bg-brand-tint text-brand" : "text-text-muted hover:bg-surface-3 hover:text-text-strong"
      }`}
    >
      <Icon className="h-[17px] w-[17px] flex-shrink-0" />
      {label}
      {!!badge && (
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
  const displayName = fullName || email || "Your account";
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  return (
    <aside className="flex w-[220px] flex-shrink-0 flex-col overflow-y-auto border-r border-border-soft bg-surface-1">
      <div className="border-b border-border-soft px-4 pb-3 pt-[18px]">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-display text-base font-bold tracking-tight text-text-strong">
          <span className="flex h-[30px] w-[30px] flex-shrink-0 items-center justify-center rounded-[7px] bg-brand text-sm font-bold text-white">
            E
          </span>
          Edu<span className="text-brand">Slide</span>
        </Link>
      </div>

      <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
        <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Main</div>
        {mainItems.map((item) => (
          <NavLink key={item.href} {...item} badge={item.href === "/dashboard/presentations" ? presentationsCount : undefined} />
        ))}
      </nav>

      <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
        <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Manage</div>
        {manageItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
      </nav>

      <nav className="flex flex-col gap-0.5 px-2.5 pb-1.5 pt-2.5">
        <div className="mb-1 px-1.5 text-[10px] font-semibold uppercase tracking-wider text-text-muted">Account</div>
        {accountItems.map((item) => (
          <NavLink key={item.href} {...item} />
        ))}
        <button
          type="button"
          className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
        >
          <HelpCircle className="h-[17px] w-[17px] flex-shrink-0" />
          Help
        </button>
      </nav>

      <div className="mt-auto border-t border-border-soft px-2.5 py-3">
        <Link
          href="/dashboard/settings"
          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition-colors hover:bg-surface-3"
        >
          <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
            {initials || "?"}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-semibold text-text-strong">{displayName}</span>
            <span className="block text-[11px] text-text-muted">{PLAN_LABEL[plan]}</span>
          </span>
          <ChevronRight className="h-3.5 w-3.5 flex-shrink-0 text-text-muted" />
        </Link>
        <form action={logout}>
          <button
            type="submit"
            className="mt-1 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
          >
            <LogOut className="h-[17px] w-[17px] flex-shrink-0" />
            Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}
