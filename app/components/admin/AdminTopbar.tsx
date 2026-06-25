"use client";

import Link from "next/link";
import { Bell, LayoutDashboard, Search, ShieldCheck } from "lucide-react";

export default function AdminTopbar({
  fullName,
  email,
}: {
  fullName: string | null;
  email: string | undefined;
}) {
  const displayName = fullName || email || "Admin";
  const initials = displayName
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");

  const shortName = displayName.split(" ").slice(0, 2).join(" ");

  return (
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-border-soft bg-surface-1 px-5">
      <div className="flex items-center gap-2">
        <Link href="/admin" className="flex items-center gap-2 font-display text-[15px] font-bold tracking-tight text-text-strong">
          <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[6px] bg-brand text-xs font-bold text-white">
            E
          </span>
          Edu<span className="text-brand">Slide</span>
        </Link>
        <span className="flex items-center gap-1 rounded-md bg-brand-tint px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.8px] text-brand">
          <ShieldCheck className="h-3 w-3" />
          Admin
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-lg border border-border-soft bg-surface-2 px-3 py-1.5 text-[13px] font-medium text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
          title="Back to Dashboard"
        >
          <LayoutDashboard className="h-[15px] w-[15px]" />
          Dashboard
        </Link>
        <Link
          href="/admin/notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-brand" />
        </Link>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
          title="Search"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
        <span className="text-[13px] text-text-muted">{shortName}</span>
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-tint text-xs font-bold text-brand">
          {initials || "A"}
        </span>
      </div>
    </header>
  );
}
