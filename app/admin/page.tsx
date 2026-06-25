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
    signup: { Icon: UserPlus, bgCls: "bg-brand-tint", colorCls: "text-brand" },
    document: { Icon: FileText, bgCls: "bg-surface-3", colorCls: "text-text-muted" },
    presentation_done: { Icon: Monitor, bgCls: "bg-brand-tint", colorCls: "text-brand" },
    presentation_error: { Icon: Monitor, bgCls: "bg-[#fff1f1]", colorCls: "text-[#dc2626]" },
  };

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-text-strong">Dashboard Overview</div>
      <div className="mb-5 text-[12px] text-text-muted">Platform health and key metrics at a glance</div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2">
        {metrics.map(({ label, val, delta, neutral }) => (
          <div key={label} className="rounded-xl border border-border-soft bg-surface-1 p-4">
            <div className="mb-1.5 text-[11px] text-text-muted">{label}</div>
            <div className="text-[22px] font-bold leading-none tracking-tight text-text-strong">{val}</div>
            <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${neutral ? "text-text-muted" : "text-brand"}`}>
              {!neutral && <ArrowUp className="h-3 w-3" />}
              {delta}
            </div>
          </div>
        ))}
      </div>

      {/* Two col */}
      <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {/* Plan breakdown */}
        <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
          <div className="mb-4 text-[13px] font-semibold text-text-strong">Users by Plan</div>
          {[
            { label: "Free", count: stats.freeUsers, total: stats.totalUsers, cls: "bg-surface-3" },
            { label: "Pro", count: stats.proUsers, total: stats.totalUsers, cls: "bg-brand" },
            { label: "Team", count: stats.teamUsers, total: stats.totalUsers, cls: "bg-brand" },
          ].map(({ label, count, total, cls }) => {
            const pct = total > 0 ? Math.round((count / total) * 100) : 0;
            return (
              <div key={label} className="mb-3 last:mb-0">
                <div className="mb-1 flex justify-between text-[12px] text-text-muted">
                  <span>{label}</span>
                  <span className="font-semibold text-text-strong">{count} ({pct}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                  <div className={`h-full rounded-full ${cls}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* Activity feed */}
        <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
          <div className="mb-3 text-[13px] font-semibold text-text-strong">Recent Activity</div>
          {activity.length === 0 && (
            <div className="py-4 text-center text-[12px] text-text-muted">No recent activity</div>
          )}
          {activity.map((item, i) => {
            const { Icon, bgCls, colorCls } = activityIconMap[item.kind];
            return (
              <div key={i} className="flex items-start gap-2.5 border-b border-border-soft py-2 last:border-none">
                <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded ${bgCls} ${colorCls}`}>
                  <Icon className="h-3 w-3" />
                </div>
                <div className="flex-1 text-[12px] leading-[1.55] text-text-muted">{item.label}</div>
                <div className="whitespace-nowrap pl-1.5 text-[11px] text-text-muted">
                  {formatRelativeTime(item.at)}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Platform summary */}
      <div className="rounded-xl border border-border-soft bg-surface-1">
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
          <div className="text-[13px] font-semibold text-text-strong">Platform Summary</div>
          <Link
            href="/admin/users"
            className="flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-1.5 text-[12px] font-medium text-text-muted hover:bg-surface-3 hover:text-text-strong"
          >
            <ExternalLink className="h-3 w-3" /> View users
          </Link>
        </div>
        <div className="divide-y divide-border-soft">
          {[
            { label: "Total registered users", value: stats.totalUsers.toLocaleString() },
            { label: "New users this month", value: `+${stats.newUsersThisMonth}` },
            { label: "Total presentations", value: stats.totalPresentations.toLocaleString() },
            { label: "Total documents", value: stats.totalDocuments.toLocaleString() },
            { label: "Total storage used", value: stats.storageFormatted },
          ].map(({ label, value }) => (
            <div key={label} className="flex items-center justify-between px-4 py-3 text-[13px]">
              <span className="text-text-muted">{label}</span>
              <span className="font-semibold text-text-strong">{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
