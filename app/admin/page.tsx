"use client";

import Link from "next/link";
import { ArrowUp, ExternalLink, Eye } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

const SIGNUP_DATA = [
  { day: "Mon", val: 18 },
  { day: "Tue", val: 24 },
  { day: "Wed", val: 31 },
  { day: "Thu", val: 19 },
  { day: "Fri", val: 42 },
  { day: "Sat", val: 27 },
  { day: "Sun", val: 14 },
];
const MAX_SIGNUP = Math.max(...SIGNUP_DATA.map((d) => d.val));

const ACTIVITY = [
  { color: "#16a34a", text: <>New user <b>Priya S.</b> signed up — Free plan</>, time: "2m ago" },
  { color: "#3b6ef8", text: <><b>Rahul M.</b> upgraded from Free → Pro</>, time: "14m ago" },
  { color: "#dc2626", text: <>Presentation report flagged by <b>Anjali T.</b></>, time: "41m ago" },
  { color: "#ca8a04", text: <>Storage at 62% — approaching 65% alert threshold</>, time: "1h ago" },
  { color: "#16a34a", text: <>AI processing queue cleared — all 34 jobs done</>, time: "2h ago" },
];

const NEW_USERS = [
  { initials: "PS", ibg: "#eef3ff", itc: "#3b6ef8", name: "Priya Sharma", email: "priya@edu.in", plan: "Free", joined: "Today", status: "Active" },
  { initials: "RM", ibg: "#fef3c7", itc: "#92400e", name: "Rahul Mehra", email: "rahul@iit.ac.in", plan: "Pro", joined: "Today", status: "Active" },
  { initials: "AT", ibg: "#fff1f1", itc: "#dc2626", name: "Anjali Thakur", email: "anjali@college.edu", plan: "Free", joined: "Yesterday", status: "Review" },
];

const PLAN_BADGE: Record<string, string> = {
  Free: "bg-[#f0f1f5] text-[#9ca3af]",
  Pro: "bg-[#eef3ff] text-[#3b6ef8]",
  Enterprise: "bg-[#edfaf3] text-[#16a34a]",
};
const STATUS_BADGE: Record<string, string> = {
  Active: "bg-[#edfaf3] text-[#16a34a]",
  Review: "bg-[#fff8e7] text-[#ca8a04]",
  Suspended: "bg-[#fff1f1] text-[#dc2626]",
};

export default function AdminOverviewPage() {
  const toast = useAdminToast();

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">Dashboard Overview</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">Platform health and key metrics at a glance</div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2">
        {[
          { label: "Total Users", val: "2,841", delta: "+128 this month", up: true },
          { label: "Presentations Generated", val: "18,432", delta: "+1.2k this week", up: true },
          { label: "Revenue (MRR)", val: "₹4.2L", delta: "+12.4% MoM", up: true },
          { label: "Storage Used", val: "312 GB", delta: "of 500 GB capacity", neutral: true },
        ].map(({ label, val, delta, up, neutral }) => (
          <div key={label} className="rounded-xl border border-[#e4e6eb] bg-white p-4">
            <div className="mb-1.5 text-[11px] text-[#9ca3af]">{label}</div>
            <div className="text-[24px] font-bold leading-none tracking-tight text-[#111827]">{val}</div>
            <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${neutral ? "text-[#9ca3af]" : up ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
              {!neutral && <ArrowUp className="h-3 w-3" />}
              {delta}
            </div>
          </div>
        ))}
      </div>

      {/* Two col */}
      <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {/* Bar chart */}
        <div className="rounded-xl border border-[#e4e6eb] bg-white p-4">
          <div className="mb-4 text-[13px] font-semibold text-[#111827]">Weekly Signups (last 7 days)</div>
          <div className="flex items-end gap-1.5" style={{ height: 100 }}>
            {SIGNUP_DATA.map(({ day, val }) => (
              <div
                key={day}
                className="flex-1 rounded-t-[4px] transition-colors hover:bg-[#3b6ef8]"
                style={{ height: `${Math.round((val / MAX_SIGNUP) * 100)}%`, background: "#eef3ff" }}
                title={`${day}: ${val} signups`}
              />
            ))}
          </div>
          <div className="mt-1.5 flex gap-1.5">
            {SIGNUP_DATA.map(({ day }) => (
              <div key={day} className="flex-1 text-center text-[10px] text-[#9ca3af]">{day}</div>
            ))}
          </div>
          <div className="mt-1 text-right text-[11px] text-[#9ca3af]">Hover bars for details</div>
        </div>

        {/* Activity */}
        <div className="rounded-xl border border-[#e4e6eb] bg-white p-4">
          <div className="mb-3 text-[13px] font-semibold text-[#111827]">Recent Activity</div>
          {ACTIVITY.map(({ color, text, time }, i) => (
            <div key={i} className="flex items-start gap-2.5 border-b border-[#edeef2] py-2 last:border-none">
              <div className="mt-1 h-2 w-2 shrink-0 rounded-full" style={{ background: color }} />
              <div className="flex-1 text-[12px] leading-[1.55] text-[#4b5563]">{text}</div>
              <div className="whitespace-nowrap pl-1.5 text-[11px] text-[#9ca3af]">{time}</div>
            </div>
          ))}
        </div>
      </div>

      {/* New users table */}
      <div className="rounded-xl border border-[#e4e6eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#e4e6eb] px-4 py-3">
          <div className="text-[13px] font-semibold text-[#111827]">New Users (pending review)</div>
          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 rounded-md border border-[#e4e6eb] px-3 py-1.5 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]"
          >
            <ExternalLink className="h-3 w-3" /> View all
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e4e6eb]">
                {["Name", "Email", "Plan", "Joined", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {NEW_USERS.map((u) => (
                <tr key={u.email} className="border-b border-[#edeef2] last:border-none hover:bg-[#f7f8fa]">
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold" style={{ background: u.ibg, color: u.itc }}>{u.initials}</div>
                      {u.name}
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-[#4b5563]">{u.email}</td>
                  <td className="px-4 py-2.5"><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${PLAN_BADGE[u.plan]}`}>{u.plan}</span></td>
                  <td className="px-4 py-2.5 text-[#4b5563]">{u.joined}</td>
                  <td className="px-4 py-2.5"><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[u.status]}`}>{u.status}</span></td>
                  <td className="px-4 py-2.5">
                    <button onClick={() => toast("User details opened")} className="flex h-7 w-7 items-center justify-center rounded text-[#4b5563] hover:bg-[#f0f1f5]">
                      <Eye className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
