import { Check } from "lucide-react";
import { getAdminStats } from "@/app/lib/admin/queries";

const PLANS = [
  { key: "free", name: "Free", price: "₹0", desc: "For individuals getting started", features: ["5 presentations/month", "500 MB storage", "PDF & PPTX export"], popular: false },
  { key: "pro", name: "Pro", price: "₹499", desc: "For educators and serious students", features: ["Unlimited presentations", "5 GB storage", "All export formats"], popular: true },
  { key: "team", name: "Team", price: "₹2,499", desc: "For schools and institutions", features: ["Everything in Pro", "Unlimited storage", "Priority AI queue"], popular: false },
];

export default async function BillingPage() {
  const stats = await getAdminStats();
  const planCounts: Record<string, number> = {
    free: stats.freeUsers, pro: stats.proUsers, team: stats.teamUsers,
  };

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-text-strong">Billing & Plans</div>
      <div className="mb-5 text-[12px] text-text-muted">Manage subscription tiers and user plan distribution</div>

      {/* Metrics */}
      <div className="mb-5 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2">
        {[
          { label: "Free Users", val: stats.freeUsers.toLocaleString(), sub: stats.totalUsers > 0 ? `${Math.round((stats.freeUsers / stats.totalUsers) * 100)}% of total` : "0%" },
          { label: "Pro Users", val: stats.proUsers.toLocaleString(), sub: stats.totalUsers > 0 ? `${Math.round((stats.proUsers / stats.totalUsers) * 100)}% of total` : "0%" },
          { label: "Team Users", val: stats.teamUsers.toLocaleString(), sub: stats.totalUsers > 0 ? `${Math.round((stats.teamUsers / stats.totalUsers) * 100)}% of total` : "0%" },
          { label: "Total Users", val: stats.totalUsers.toLocaleString(), sub: `+${stats.newUsersThisMonth} this month` },
        ].map(({ label, val, sub }) => (
          <div key={label} className="rounded-xl border border-border-soft bg-surface-1 p-4">
            <div className="mb-1.5 text-[11px] text-text-muted">{label}</div>
            <div className="text-[24px] font-bold leading-none tracking-tight text-text-strong">{val}</div>
            <div className="mt-1.5 text-[11px] text-text-muted">{sub}</div>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      <div className="mb-5 grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
        {PLANS.map(({ key, name, price, desc, features, popular }) => (
          <div
            key={name}
            className={`rounded-xl border p-4 text-center ${
              popular ? "border-brand bg-brand-tint" : "border-border-soft bg-surface-1"
            }`}
          >
            {popular && (
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.8px] text-brand">
                Most Popular
              </div>
            )}
            <div className="text-[13px] font-bold text-text-strong">{name}</div>
            <div className="my-2 text-[26px] font-bold leading-none text-brand">
              {price}<span className="text-[12px] font-normal text-text-muted">/mo</span>
            </div>
            <div className="mb-1 text-[11px] text-text-muted">{desc}</div>
            <div className="mb-3 text-[18px] font-semibold text-text-strong">
              {(planCounts[key] ?? 0).toLocaleString()}{" "}
              <span className="text-[12px] font-normal text-text-muted">active users</span>
            </div>
            {features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 border-b border-border-soft py-1.5 text-left text-[12px] text-text-muted last:border-none">
                <Check className="h-3.5 w-3.5 shrink-0 text-brand" /> {f}
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-border-soft bg-surface-1 px-4 py-6 text-center text-[13px] text-text-muted">
        Payment transaction history requires a billing integration (e.g. Razorpay, Stripe).
        Connect a payment provider to view revenue and subscription events here.
      </div>
    </div>
  );
}
