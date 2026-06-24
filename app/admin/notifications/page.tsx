"use client";

import { useState } from "react";
import { Bell, Check, CreditCard, Database, Flag, UserPlus } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

const NOTIFS = [
  {
    id: 1,
    Icon: Flag,
    iconBg: "#fff1f1",
    iconColor: "#dc2626",
    title: "New content report flagged",
    sub: "Anjali T. reported Genetics_Module4.pdf for copyright concerns",
    time: "41m ago",
    unread: true,
  },
  {
    id: 2,
    Icon: UserPlus,
    iconBg: "#edfaf3",
    iconColor: "#16a34a",
    title: "128 new users this month",
    sub: "Monthly signup milestone reached — growth up 18% MoM",
    time: "2h ago",
    unread: true,
  },
  {
    id: 3,
    Icon: Database,
    iconBg: "#fff8e7",
    iconColor: "#ca8a04",
    title: "Storage reaching 65% threshold",
    sub: "Currently at 312 GB / 500 GB. Consider expanding capacity.",
    time: "4h ago",
    unread: true,
  },
  {
    id: 4,
    Icon: CreditCard,
    iconBg: "#eef3ff",
    iconColor: "#3b6ef8",
    title: "Payment failed — Sunita R.",
    sub: "Pro plan renewal for ₹499 failed — card declined",
    time: "1d ago",
    unread: false,
  },
  {
    id: 5,
    Icon: Check,
    iconBg: "#f0f1f5",
    iconColor: "#4b5563",
    title: "Scheduled maintenance complete",
    sub: "AI processing infrastructure updated successfully — v2.4.1",
    time: "2d ago",
    unread: false,
  },
];

export default function NotificationsPage() {
  const toast = useAdminToast();
  const [read, setRead] = useState<Set<number>>(new Set());

  function markAllRead() {
    setRead(new Set([1, 2, 3]));
    toast("All notifications marked as read");
  }

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">Notifications</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">Platform alerts, user activity, and system messages</div>

      <div className="rounded-xl border border-[#e4e6eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#e4e6eb] px-4 py-3">
          <div className="text-[13px] font-semibold text-[#111827]">All Notifications</div>
          <button
            onClick={markAllRead}
            className="rounded-lg border border-[#e4e6eb] px-3 py-1.5 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]"
          >
            Mark all as read
          </button>
        </div>
        <div className="divide-y divide-[#edeef2]">
          {NOTIFS.map(({ id, Icon, iconBg, iconColor, title, sub, time, unread }) => {
            const isUnread = unread && !read.has(id);
            return (
              <div
                key={id}
                className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-[#f7f8fa]"
                onClick={() => setRead((prev) => new Set([...prev, id]))}
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-[15px]" style={{ background: iconBg, color: iconColor }}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1">
                  <div className="text-[13px] font-medium text-[#111827]">{title}</div>
                  <div className="mt-0.5 text-[11px] text-[#9ca3af]">{sub}</div>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <div className="text-[11px] text-[#9ca3af]">{time}</div>
                  {isUnread && <div className="h-1.5 w-1.5 rounded-full" style={{ background: "#3b6ef8" }} />}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
