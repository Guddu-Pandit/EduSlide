"use client";

import { Check, Crown } from "lucide-react";
import { getDashboardStats, getProfile } from "@/app/lib/dashboard/queries";
import { useDashboardQuery } from "@/app/lib/dashboard/useDashboardQuery";
import { upgradePlan } from "@/app/lib/dashboard/actions";
import { PLAN_LIMITS, PLAN_ORDER } from "@/app/lib/dashboard/plan";
import { formatBytes } from "@/app/lib/dashboard/format";
import { CardSkeleton } from "@/app/components/dashboard/Skeleton";

export default function BillingPage() {
  const { data, loading } = useDashboardQuery(async (supabase, userId) => {
    const [profile, stats] = await Promise.all([
      getProfile(supabase, userId),
      getDashboardStats(supabase, userId),
    ]);
    return { profile, stats };
  });

  if (loading || !data) {
    return (
      <div className="px-7 py-6">
        <CardSkeleton className="h-72" />
      </div>
    );
  }

  const { profile, stats } = data;
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
          Payment processing isn&apos;t connected yet — switching plans below applies instantly without charging you.
        </p>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
        {PLAN_ORDER.map((planKey) => {
          const planInfo = PLAN_LIMITS[planKey];
          const isCurrent = profile.plan === planKey;
          const isUpgrade = PLAN_ORDER.indexOf(planKey) > PLAN_ORDER.indexOf(profile.plan);

          return (
            <div
              key={planKey}
              className={`flex flex-col rounded-xl border p-5 ${
                isCurrent ? "border-brand bg-brand-tint/40" : "border-border-soft bg-surface-1"
              }`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span className="text-sm font-bold text-text-strong">{planInfo.label}</span>
                {isCurrent && (
                  <span className="flex items-center gap-1 rounded-full bg-white px-2 py-0.5 text-[10px] font-bold text-brand">
                    <Crown className="h-2.5 w-2.5" /> Current
                  </span>
                )}
              </div>
              <div className="mb-4 text-xl font-bold text-text-strong">{planInfo.price}</div>

              <ul className="mb-5 flex flex-1 flex-col gap-2">
                {planInfo.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[13px] text-text-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-brand" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  type="button"
                  disabled
                  className="cursor-default rounded-lg border border-border-mid px-3.5 py-2 text-[13px] font-semibold text-text-muted"
                >
                  Current plan
                </button>
              ) : (
                <form action={upgradePlan}>
                  <input type="hidden" name="plan" value={planKey} />
                  <button
                    type="submit"
                    className="w-full rounded-lg bg-brand px-3.5 py-2 text-[13px] font-semibold text-white hover:opacity-90"
                  >
                    {isUpgrade ? `Upgrade to ${planInfo.label}` : `Switch to ${planInfo.label}`}
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
