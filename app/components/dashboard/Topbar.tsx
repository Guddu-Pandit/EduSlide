"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Menu, Plus, Search, ShieldCheck } from "lucide-react";

const TITLES: Record<string, string> = {
  "/dashboard": "Overview",
  "/dashboard/presentations": "Presentations",
  "/dashboard/documents": "Documents",
  "/dashboard/upload": "New upload",
  "/dashboard/templates": "Templates",
  "/dashboard/analytics": "Analytics",
  "/dashboard/settings": "Settings",
  "/dashboard/billing": "Billing",
};

export default function Topbar({ onMenuClick, isAdmin }: { onMenuClick: () => void; isAdmin?: boolean }) {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <div className="flex flex-shrink-0 items-center gap-2.5 border-b border-border-soft bg-surface-1 px-4 py-3.5 sm:gap-3.5 md:px-7">
      <button
        type="button"
        onClick={onMenuClick}
        title="Open menu"
        className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-text-strong hover:bg-surface-3 md:hidden"
      >
        <Menu className="h-[18px] w-[18px]" />
      </button>

      <div className="flex-1 truncate text-base font-bold text-text-strong">{title}</div>

      <form
        action="/dashboard/presentations"
        method="GET"
        className="hidden min-w-[160px] items-center gap-2 rounded-lg border border-border-soft bg-surface-3 px-3 py-1.5 sm:flex"
      >
        <Search className="h-[15px] w-[15px] flex-shrink-0 text-text-muted" />
        <input
          type="text"
          name="q"
          placeholder="Search presentations…"
          className="w-28 border-none bg-transparent text-[13px] text-text-strong placeholder:text-text-muted focus:outline-none md:w-36"
        />
      </form>

      {isAdmin && (
        <Link
          href="/admin"
          className="hidden flex-shrink-0 items-center gap-1.5 rounded-lg border border-[#c7d6fd] bg-[#eef3ff] px-3 py-2 text-[13px] font-semibold text-[#3b6ef8] transition-opacity hover:opacity-80 sm:flex"
          title="Go to Admin Panel"
        >
          <ShieldCheck className="h-[15px] w-[15px]" />
          Admin Panel
        </Link>
      )}

      <button
        type="button"
        title="Notifications"
        className="flex flex-shrink-0 items-center gap-1.5 rounded-lg border border-border-mid bg-surface-1 px-3 py-2 text-[13px] font-semibold text-text-strong transition-colors hover:bg-surface-3 sm:px-3.5"
      >
        <Bell className="h-[15px] w-[15px]" />
      </button>

      <Link
        href="/dashboard/upload"
        className="flex flex-shrink-0 items-center gap-1.5 rounded-lg bg-brand px-3 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 sm:px-3.5"
      >
        <Plus className="h-[15px] w-[15px]" />
        <span className="hidden sm:inline">New presentation</span>
      </Link>
    </div>
  );
}
