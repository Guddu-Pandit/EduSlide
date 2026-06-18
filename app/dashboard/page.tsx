import Link from "next/link";
import {
  CheckCircle2,
  Clock,
  Crown,
  Files,
  HardDrive,
  Presentation as PresentationIcon,
  Sparkles,
  Upload,
} from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import {
  getDashboardStats,
  getPresentations,
  getProfile,
  getRecentActivity,
} from "@/app/lib/dashboard/queries";
import { PLAN_LIMITS } from "@/app/lib/dashboard/plan";
import { formatBytes, formatDate, formatRelativeTime } from "@/app/lib/dashboard/format";
import { templateName } from "@/app/lib/dashboard/templates";
import StatCard from "@/app/components/dashboard/StatCard";
import StatusPill from "@/app/components/dashboard/StatusPill";

const ACTIVITY_STYLES = {
  document_uploaded: { className: "bg-amber-50 text-amber-700", icon: Upload },
  done: { className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  generating: { className: "bg-brand-tint text-brand", icon: Sparkles },
  queued: { className: "bg-amber-50 text-amber-700", icon: Sparkles },
  error: { className: "bg-red-50 text-red-700", icon: Sparkles },
} as const;

export default async function OverviewPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [stats, recentPresentations, activity, profile] = await Promise.all([
    getDashboardStats(supabase, user.id),
    getPresentations(supabase, user.id),
    getRecentActivity(supabase, user.id),
    getProfile(supabase, user.id),
  ]);

  const limits = PLAN_LIMITS[profile.plan];
  const presLimitLabel = limits.presentationsPerMonth
    ? `${stats.presentationsThisMonth} / ${limits.presentationsPerMonth}`
    : `${stats.presentationsCount} / unlimited`;
  const presPct = limits.presentationsPerMonth
    ? Math.min(100, Math.round((stats.presentationsThisMonth / limits.presentationsPerMonth) * 100))
    : 100;
  const storagePct = Math.min(100, Math.round((stats.storageBytes / limits.storageBytes) * 100));

  return (
    <div className="px-7 py-6">
      <div className="mb-6 grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2">
        <StatCard
          label="Presentations"
          icon={PresentationIcon}
          value={stats.presentationsCount}
          sub={stats.presentationsThisMonth > 0 ? `+${stats.presentationsThisMonth} this month` : "None this month yet"}
        />
        <StatCard
          label="Documents"
          icon={Files}
          iconClassName="text-emerald-600"
          value={stats.documentsCount}
          sub={`${stats.documentsNotConverted} not yet converted`}
        />
        <StatCard
          label="Slides generated"
          icon={Sparkles}
          iconClassName="text-amber-600"
          value={stats.slidesGenerated}
          sub="Across all presentations"
        />
        <StatCard
          label="Storage used"
          icon={HardDrive}
          iconClassName="text-orange-700"
          value={formatBytes(stats.storageBytes)}
          sub={`of ${formatBytes(limits.storageBytes)} on ${limits.label}`}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
          <div className="mb-4 flex items-center justify-between text-sm font-bold text-text-strong">
            Recent presentations
            <Link href="/dashboard/presentations" className="text-xs font-medium text-brand hover:text-brand-hover">
              View all →
            </Link>
          </div>
          {recentPresentations.length === 0 ? (
            <EmptyRow />
          ) : (
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border-soft text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  <th className="pb-2.5 font-semibold">Name</th>
                  <th className="pb-2.5 font-semibold">Status</th>
                  <th className="pb-2.5 font-semibold">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentPresentations.slice(0, 4).map((p) => (
                  <tr key={p.id} className="border-b border-border-soft last:border-none">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
                          <PresentationIcon className="h-4 w-4" />
                        </span>
                        <div>
                          <div className="text-[13px] font-medium text-text-strong">{p.name}</div>
                          <div className="text-[11px] text-text-muted">
                            {p.slide_count > 0 ? `${p.slide_count} slides` : templateName(p.template)}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <StatusPill status={p.status} />
                    </td>
                    <td className="py-3 text-xs text-text-muted">{formatDate(p.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
          <div className="mb-4 text-sm font-bold text-text-strong">Activity</div>
          {activity.length === 0 ? (
            <EmptyRow />
          ) : (
            activity.map((item) => {
              const styleKey = item.kind === "document_uploaded" ? "document_uploaded" : item.status;
              const { className, icon: Icon } = ACTIVITY_STYLES[styleKey];
              const title =
                item.kind === "document_uploaded"
                  ? `${item.name} uploaded`
                  : item.status === "done"
                    ? `${item.name} ready`
                    : item.status === "error"
                      ? `${item.name} failed to generate`
                      : `${item.name} queued for generation`;

              return (
                <div key={`${item.kind}-${item.id}`} className="flex items-start gap-3 border-b border-border-soft py-3 last:border-none">
                  <span className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${className}`}>
                    <Icon className="h-3.5 w-3.5" />
                  </span>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-text-strong">{title}</div>
                    <div className="mt-0.5 text-[11px] text-text-muted">{formatRelativeTime(item.at)}</div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
        <div className="mb-4 flex items-center justify-between text-sm font-bold text-text-strong">
          Monthly usage
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-bold text-brand">
            <Crown className="h-2.5 w-2.5" /> {limits.label}
          </span>
        </div>
        <UsageRow label="Presentations generated" value={presLimitLabel} pct={presPct} barClass="bg-emerald-500" />
        <UsageRow
          label="Storage used"
          value={`${formatBytes(stats.storageBytes)} / ${formatBytes(limits.storageBytes)}`}
          pct={storagePct}
        />
      </div>
    </div>
  );
}

function UsageRow({
  label,
  value,
  pct,
  barClass = "bg-brand",
}: {
  label: string;
  value: string;
  pct: number;
  barClass?: string;
}) {
  return (
    <div className="mb-3.5 last:mb-0">
      <div className="mb-1.5 flex justify-between text-xs">
        <span className="font-medium text-text-muted">{label}</span>
        <span className="text-text-muted">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-surface-3">
        <div className={`h-1.5 rounded-full ${barClass}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function EmptyRow() {
  return (
    <div className="flex flex-col items-center gap-2 py-9 text-center text-text-muted">
      <Clock className="h-7 w-7" />
      <p className="text-[13px]">Nothing here yet</p>
    </div>
  );
}
