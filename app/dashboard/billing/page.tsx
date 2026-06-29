"use client";

import { Check, Crown, Receipt, Sparkles, Users, XCircle, Zap } from "lucide-react";
import { getDashboardStats, getPaymentHistory, getProfile } from "@/app/lib/dashboard/queries";
import { useDashboardQuery } from "@/app/lib/dashboard/useDashboardQuery";
import { upgradePlan } from "@/app/lib/dashboard/actions";
import { PLAN_LIMITS, PLAN_ORDER, presentationUsage, storageUsage, type Plan } from "@/app/lib/dashboard/plan";
import { formatBytes } from "@/app/lib/dashboard/format";
import { CardSkeleton } from "@/app/components/dashboard/Skeleton";
import { RazorpayButton } from "@/app/components/dashboard/RazorpayButton";

const PLAN_ICON: Record<Plan, typeof Sparkles> = { free: Sparkles, pro: Zap, team: Users };
const POPULAR_PLAN: Plan = "pro";

function formatPaise(paise: number) {
  return "₹" + (paise / 100).toLocaleString("en-IN");
}

export default function BillingPage() {
  const { data, loading } = useDashboardQuery(async (supabase, userId) => {
    const [profile, stats, payments] = await Promise.all([
      getProfile(supabase, userId),
      getDashboardStats(supabase, userId),
      getPaymentHistory(supabase, userId),
    ]);
    return { profile, stats, payments };
  });

  if (loading || !data) {
    return (
      <div className="px-4 py-5 md:px-7 md:py-6">
        <CardSkeleton className="h-72" />
      </div>
    );
  }

  const { profile, stats, payments } = data;
  const limits = PLAN_LIMITS[profile.plan];
  const presUsage = presentationUsage(limits.presentationLimit, stats);
  const storUsage = storageUsage(limits.storageBytes, stats.storageBytes);

  return (
    <div className="px-4 py-5 md:px-7 md:py-6">
      {/* Current plan card */}
      <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
        <div className="mb-4 text-sm font-bold text-text-strong">Current plan</div>

        <div className="mb-4 flex items-center justify-between rounded-lg bg-brand-tint px-4 py-4">
          <div>
            <div className="text-base font-bold text-brand">{limits.label} plan</div>
            <div className="text-[13px] text-brand opacity-70">{limits.price}</div>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="flex items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-bold text-brand">
              <Crown className="h-2.5 w-2.5" /> Active
            </span>
            {profile.plan !== "free" && profile.plan_expires_at && (
              <span className="text-[11px] text-brand opacity-70">
                Expires {new Date(profile.plan_expires_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
              </span>
            )}
          </div>
        </div>

        <div className="mb-1.5 flex justify-between text-xs">
          <span className="font-medium text-text-muted">Presentations</span>
          <span className="text-text-muted">{presUsage.label}</span>
        </div>
        <div className="mb-3.5 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${presUsage.pct}%` }} />
        </div>

        <div className="mb-1.5 flex justify-between text-xs">
          <span className="font-medium text-text-muted">Storage</span>
          <span className="text-text-muted">
            {formatBytes(stats.storageBytes)} / {storUsage.cap === null ? "Unlimited" : formatBytes(storUsage.cap)}
          </span>
        </div>
        <div className="mb-4 h-1.5 overflow-hidden rounded-full bg-surface-3">
          <div className="h-1.5 rounded-full bg-brand" style={{ width: `${storUsage.pct}%` }} />
        </div>

        <p className="text-[13px] text-text-muted">
          Payments are processed securely via Razorpay. Paid plans are valid for 1 month from purchase.
        </p>
      </div>

      {/* Plan cards */}
      <div className="mt-6 mb-4">
        <div className="text-sm font-bold text-text-strong">Plans</div>
        <p className="text-[13px] text-text-muted">Pick the plan that fits how much you generate.</p>
      </div>

      <div className="grid grid-cols-3 gap-5 max-[900px]:grid-cols-1">
        {PLAN_ORDER.map((planKey) => {
          const planInfo = PLAN_LIMITS[planKey];
          const Icon = PLAN_ICON[planKey];
          const isCurrent = profile.plan === planKey;
          const isPopular = planKey === POPULAR_PLAN && !isCurrent;
          const isUpgrade = PLAN_ORDER.indexOf(planKey) > PLAN_ORDER.indexOf(profile.plan);

          return (
            <div
              key={planKey}
              className={`relative flex flex-col rounded-2xl border bg-surface-1 p-6 transition-shadow ${
                isCurrent
                  ? "border-brand shadow-[0_0_0_3px_var(--color-brand-tint)]"
                  : isPopular
                    ? "border-brand/60 shadow-lg shadow-brand/5"
                    : "border-border-soft hover:shadow-md"
              }`}
            >
              {isPopular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-brand px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                  Most popular
                </span>
              )}

              <div className="mb-4 flex items-center gap-2.5">
                <span
                  className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${
                    isCurrent ? "bg-brand text-white" : "bg-brand-tint text-brand"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div>
                  <div className="text-sm font-bold leading-tight text-text-strong">{planInfo.label}</div>
                  <div className="text-[11px] leading-tight text-text-muted">{planInfo.tagline}</div>
                </div>
                {isCurrent && (
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-bold text-brand">
                    <Crown className="h-2.5 w-2.5" /> Current
                  </span>
                )}
              </div>

              <div className="mb-5">
                <span className="text-3xl font-bold tracking-tight text-text-strong">{planInfo.price.split(" / ")[0]}</span>
                <span className="text-[13px] text-text-muted"> / {planInfo.price.split(" / ")[1]}</span>
              </div>

              <ul className="mb-6 flex flex-1 flex-col gap-2.5 border-t border-border-soft pt-5">
                {planInfo.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-[13px] text-text-muted">
                    <Check className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-emerald-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <button
                  type="button"
                  disabled
                  className="cursor-default rounded-lg border border-border-mid px-3.5 py-2.5 text-[13px] font-semibold text-text-muted"
                >
                  Current plan
                </button>
              ) : planInfo.amountInPaise > 0 ? (
                <RazorpayButton
                  plan={planKey}
                  label={isUpgrade ? `Upgrade to ${planInfo.label}` : `Switch to ${planInfo.label}`}
                  className={`w-full rounded-lg px-3.5 py-2.5 text-[13px] font-semibold transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60 ${
                    isPopular ? "bg-brand text-white" : "border border-border-mid bg-surface-1 text-text-strong"
                  }`}
                />
              ) : (
                <form action={upgradePlan}>
                  <input type="hidden" name="plan" value={planKey} />
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-border-mid bg-surface-1 px-3.5 py-2.5 text-[13px] font-semibold text-text-strong transition-opacity hover:opacity-90"
                  >
                    Switch to Free
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      {/* Payment history */}
      <div className="mt-8">
        <div className="mb-3 flex items-center gap-2">
          <Receipt className="h-4 w-4 text-text-muted" />
          <div className="text-sm font-bold text-text-strong">Payment history</div>
        </div>

        {payments.length === 0 ? (
          <div className="rounded-xl border border-border-soft bg-surface-1 px-4 py-8 text-center text-[13px] text-text-muted">
            No payments yet. Upgrade to a paid plan to see your history here.
          </div>
        ) : (
          <div className="rounded-xl border border-border-soft bg-surface-1 overflow-hidden">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-border-soft bg-surface-2">
                  <th className="px-4 py-3 text-left font-semibold text-text-muted">Date</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-muted">Plan</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-muted">Amount</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-muted">Status</th>
                  <th className="px-4 py-3 text-left font-semibold text-text-muted">Details</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((p) => (
                  <tr key={p.id} className="border-b border-border-soft last:border-none hover:bg-surface-2">
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap">
                      {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-brand-tint px-2.5 py-0.5 text-[11px] font-semibold capitalize text-brand">
                        {p.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-semibold text-text-strong whitespace-nowrap">
                      {p.status === "failed" ? (
                        <span className="text-text-muted line-through">{formatPaise(p.amount_paise)}</span>
                      ) : (
                        formatPaise(p.amount_paise)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {p.status === "success" ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                          Success
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2.5 py-0.5 text-[11px] font-semibold text-red-600">
                          <XCircle className="h-3 w-3" />
                          Failed
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[11px] text-text-muted max-w-[180px]">
                      {p.status === "success"
                        ? p.razorpay_payment_id
                          ? <span className="font-mono">{p.razorpay_payment_id}</span>
                          : "—"
                        : p.error_description ?? "Payment declined"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
