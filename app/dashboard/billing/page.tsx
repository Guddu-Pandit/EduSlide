import { Crown } from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import { getDashboardStats, getProfile } from "@/app/lib/dashboard/queries";
import { PLAN_LIMITS } from "@/app/lib/dashboard/plan";
import { formatBytes } from "@/app/lib/dashboard/format";

export default async function BillingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const [profile, stats] = await Promise.all([
    getProfile(supabase, user.id),
    getDashboardStats(supabase, user.id),
  ]);

  const limits = PLAN_LIMITS[profile.plan];
  const presLabel = limits.presentationsPerMonth
    ? `${stats.presentationsThisMonth} / ${limits.presentationsPerMonth}`
    : `${stats.presentationsCount} / unlimited`;
  const presPct = limits.presentationsPerMonth
    ? Math.min(100, Math.round((stats.presentationsThisMonth / limits.presentationsPerMonth) * 100))
    : 100;
  const storagePct = Math.min(100, Math.round((stats.storageBytes / limits.storageBytes) * 100));

  return (
    <div className="px-7 py-6">
      <div className="max-w-[560px]">
        <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
          <div className="mb-4 text-sm font-bold text-text-strong">Current plan</div>

          <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-tint px-4 py-4">
            <div>
              <div className="text-base font-bold text-brand">{limits.label} plan</div>
              <div className="text-[13px] text-brand opacity-70">{limits.price}</div>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-brand">
              <Crown className="h-2.5 w-2.5" /> Active
            </span>
          </div>

          <div className="mb-1.5 flex justify-between text-xs">
            <span className="font-medium text-text-muted">Presentations this month</span>
            <span className="text-text-muted">{presLabel}</span>
          </div>
          <div className="mb-3.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
            <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${presPct}%` }} />
          </div>

          <div className="mb-1.5 flex justify-between text-xs">
            <span className="font-medium text-text-muted">Storage</span>
            <span className="text-text-muted">
              {formatBytes(stats.storageBytes)} / {formatBytes(limits.storageBytes)}
            </span>
          </div>
          <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-3">
            <div className="h-1.5 rounded-full bg-brand" style={{ width: `${storagePct}%` }} />
          </div>

          <p className="text-[13px] text-text-muted">
            Payment processing isn&apos;t connected yet — plan changes and billing history will appear here once it
            is.
          </p>
        </div>
      </div>
    </div>
  );
}
