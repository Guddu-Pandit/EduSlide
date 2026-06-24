"use client";

import Link from "next/link";
import { Bell, Search } from "lucide-react";

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
    <header className="flex h-[52px] shrink-0 items-center justify-between border-b border-[#e4e6eb] bg-white px-5">
      <div className="flex items-center gap-2">
        <Link href="/admin" className="text-[15px] font-semibold text-[#111827]">
          Edu<span style={{ color: "#3b6ef8" }}>Slide</span>
        </Link>
        <span
          className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.8px]"
          style={{ background: "#eef3ff", color: "#3b6ef8", border: "0.5px solid #c7d6fd" }}
        >
          Admin
        </span>
      </div>

      <div className="flex items-center gap-2.5">
        <Link
          href="/admin/notifications"
          className="relative flex h-8 w-8 items-center justify-center rounded-md text-[#4b5563] hover:bg-[#f7f8fa]"
          title="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-1 top-1 h-1.5 w-1.5 rounded-full bg-red-500 ring-[1.5px] ring-white" />
        </Link>
        <button
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#4b5563] hover:bg-[#f7f8fa]"
          title="Search"
        >
          <Search className="h-[18px] w-[18px]" />
        </button>
        <span className="text-[13px] text-[#4b5563]">{shortName}</span>
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
          style={{ background: "#eef3ff", color: "#3b6ef8" }}
        >
          {initials || "A"}
        </div>
      </div>
    </header>
  );
}
