import Link from "next/link";
import { ArrowUp, ExternalLink, UserPlus, FileText, Monitor } from "lucide-react";
import { getAdminStats, getRecentActivity } from "@/app/lib/admin/queries";
import { formatRelativeTime } from "@/app/lib/dashboard/format";

export default async function AdminOverviewPage() {
  const [stats, activity] = await Promise.all([
    getAdminStats(),
    getRecentActivity(),
  ]);

  const metrics = [
    { label: "Total Users", val: stats.totalUsers.toLocaleString(), delta: `+${stats.newUsersThisMonth} this month`, neutral: false },
    { label: "Presentations", val: stats.totalPresentations.toLocaleString(), delta: `${stats.totalDocuments} documents`, neutral: true },
    { label: "Free / Pro / Team", val: `${stats.freeUsers} / ${stats.proUsers} / ${stats.teamUsers}`, delta: "users by plan", neutral: true },
    { label: "Storage Used", val: stats.storageFormatted, delta: `across ${stats.totalDocuments} files`, neutral: true },
  ];

  const activityIconMap = {
    signup: { Icon: UserPlus, bg: "#edfaf3", color: "#16a34a" },
    document: { Icon: FileText, bg: "#eef3ff", color: "#3b6ef8" },
    presentation_done: { Icon: Monitor, bg: "#edfaf3", color: "#16a34a" },
    presentation_error: { Icon: Monitor, bg: "#fff1f1", color: "#dc2626" },
  };

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-admin-text">Dashboard Overview</div>
      <div className="mb-5 text-[12px] text-admin-muted">Platform health and key metrics at a glance</div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2">
        {metrics.map(({ label, val, delta, neutral }) => (
          <div key={label} className="rounded-xl border border-admin-border bg-admin-surface p-4">
            <div className="mb-1.5 text-[11px] text-admin-muted">{label}</div>
            <div className="text-[22px] font-bold leading-none tracking-tight text-admin-text">{val}</div>
            <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${neutral ? "text-admin-muted" : "text-[#16a34a]"}`}>
              {!neutral && <ArrowUp className="h-3 w-3" />}
              {delta}
            </div>
          </div>
        ))}
      </div>

      {/* Two col */}
      <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {/* Plan breakdown */}
        <div className="rounded-xl border border-admin-border bg-admin-surface p-4">
          <div className="mb-4 text-[13px] font-semibold text-admin-text">Users by Plan</div>
          {[
            { label: "Free", count: stats.freeUsers, total: stats.totalUsers, color: "#9ca3af" },
            { label: "Pro", count: stats.proUsers, total: stats.totalUsers, color: "#3b6ef8" },
            { label: "Team", count: stats.teamUsers, total: stats.totalUsers, color: "#16a34a" },
          ].map(({ label, count, total, color }) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={label} className="mb-3 last:mb-0">
                <div className="mb-1 flex justify-between text-[12px] text-admin-body">
                  <span>{label}</span>
                  <span className="font-semibold">{count} ({pct}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-admin-input">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity feed */}
        <div className="rounded-xl border border-admin-border bg-admin-surface p-4">
          <div className="mb-3 text-[13px] font-semibold text-admin-text">Recent Activity</div>
          {activity.length === 0 && (
            <div className="py-4 text-center text-[12px] text-admin-muted">No recent activity</div>
          )}
          {activity.map((item, i) => {
            const { Icon, bg, color } = activityIconMap[item.kind];
            return (
              <div key={i} className="flex items-start gap-2.5 border-b border-admin-divider py-2 last:border-none">
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded" style={{ background: bg, color }}>
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 text-[12px] leading-[1.55] text-admin-body">{item.label}</div>
                <div className="whitespace-nowrap pl-1.5 text-[11px] text-admin-muted">
                  {formatRelativeTime(item.at)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform summary */}
      <div className="rounded-xl border border-admin-border bg-admin-surface">
        <div className="flex items-center justify-between border-b border-admin-border px-4 py-3">
          <div className="text-[13px] font-semibold text-admin-text">Platform Summary</div>
          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 rounded-md border border-admin-border px-3 py-1.5 text-[12px] font-medium text-admin-body hover:bg-admin-hover"
          >
            <ExternalLink className="h-3 w-3" /> View users
          </Link>
        </div>
        <div className="divide-y divide-admin-divider">
          {[
            { label: "Total registered users", value: stats.totalUsers.toLocaleString() },
            { label: "New users this month", value: `+${stats.newUsersThisMonth}` },
            { label: "Total presentations", value: stats.totalPresentations.toLocaleString() },
            { label: "Total documents", value: stats.totalDocuments.toLocaleString() },
            { label: "Total storage used", value: stats.storageFormatted },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 text-[13px]">
              <span className="text-admin-body">{label}</span>
              <span className="font-semibold text-admin-text">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
