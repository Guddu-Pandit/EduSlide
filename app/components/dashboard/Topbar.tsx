"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Plus, Search } from "lucide-react";

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

export default function Topbar() {
  const pathname = usePathname();
  const title = TITLES[pathname] ?? "Dashboard";

  return (
    <div className="flex flex-shrink-0 items-center gap-3.5 border-b border-border-soft bg-surface-1 px-7 py-3.5">
      <div className="flex-1 text-base font-bold text-text-strong">{title}</div>

      <form
        action="/dashboard/presentations"
        method="GET"
        className="flex min-w-[200px] items-center gap-2 rounded-lg border border-border-soft bg-surface-3 px-3 py-1.5"
      >
        <Search className="h-[15px] w-[15px] flex-shrink-0 text-text-muted" />
        <input
          type="text"
          name="q"
          placeholder="Search presentations…"
          className="w-36 border-none bg-transparent text-[13px] text-text-strong placeholder:text-text-muted focus:outline-none"
        />
      </form>

      <button
        type="button"
        title="Notifications"
        className="flex items-center gap-1.5 rounded-lg border border-border-mid bg-surface-1 px-3.5 py-2 text-[13px] font-semibold text-text-strong transition-colors hover:bg-surface-3"
      >
        <Bell className="h-[15px] w-[15px]" />
      </button>

      <Link
        href="/dashboard/upload"
        className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        <Plus className="h-[15px] w-[15px]" />
        New presentation
      </Link>
    </div>
  );
}
