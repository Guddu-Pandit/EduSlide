import { Check } from "lucide-react";
import { getAdminStats } from "@/app/lib/admin/queries";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: "₹0",
    desc: "For individuals getting started",
    features: ["5 presentations/month", "500 MB storage", "PDF & PPTX export"],
    popular: false,
  },
  {
    key: "pro",
    name: "Pro",
    price: "₹499",
    desc: "For educators and serious students",
    features: ["Unlimited presentations", "5 GB storage", "All export formats"],
    popular: true,
  },
  {
    key: "team",
    name: "Team",
    price: "₹2,499",
    desc: "For schools and institutions",
    features: ["Everything in Pro", "Unlimited storage", "Priority AI queue"],
    popular: false,
  },
];

export default async function BillingPage() {
  const stats = await getAdminStats();

  const planCounts: Record<string, number> = {
    free: stats.freeUsers,
    pro: stats.proUsers,
    team: stats.teamUsers,
  };

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">Billing & Plans</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">
        Manage subscription tiers and user plan distribution
      </div>

      {/* Metrics */}
      <div className="mb-5 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2">
        {[
          {
            label: "Free Users",
            val: stats.freeUsers.toLocaleString(),
            sub:
              stats.totalUsers > 0
                ? `${Math.round((stats.freeUsers / stats.totalUsers) * 100)}% of total`
                : "0% of total",
          },
          {
            label: "Pro Users",
            val: stats.proUsers.toLocaleString(),
            sub:
              stats.totalUsers > 0
                ? `${Math.round((stats.proUsers / stats.totalUsers) * 100)}% of total`
                : "0% of total",
          },
          {
            label: "Team Users",
            val: stats.teamUsers.toLocaleString(),
            sub:
              stats.totalUsers > 0
                ? `${Math.round((stats.teamUsers / stats.totalUsers) * 100)}% of total`
                : "0% of total",
          },
          {
            label: "Total Users",
            val: stats.totalUsers.toLocaleString(),
            sub: `+${stats.newUsersThisMonth} this month`,
          },
        ].map(({ label, val, sub }) => (
          <div key={label} className="rounded-xl border border-[#e4e6eb] bg-white p-4">
            <div className="mb-1.5 text-[11px] text-[#9ca3af]">{label}</div>
            <div className="text-[24px] font-bold leading-none tracking-tight text-[#111827]">
              {val}
            </div>
            <div className="mt-1.5 text-[11px] text-[#9ca3af]">{sub}</div>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      <div className="mb-5 grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
        {PLANS.map(({ key, name, price, desc, features, popular }) => (
          <div
            key={name}
            className="rounded-xl border p-4 text-center"
            style={
              popular
                ? { borderColor: "#3b6ef8", background: "#eef3ff" }
                : { borderColor: "#e4e6eb", background: "#fff" }
            }
          >
            {popular && (
              <div
                className="mb-1 text-[10px] font-bold uppercase tracking-[0.8px]"
                style={{ color: "#3b6ef8" }}
              >
                Most Popular
              </div>
            )}
            <div className="text-[13px] font-bold text-[#111827]">{name}</div>
            <div
              className="my-2 text-[26px] font-bold leading-none"
              style={{ color: "#3b6ef8" }}
            >
              {price}
              <span className="text-[12px] font-normal text-[#9ca3af]">/mo</span>
            </div>
            <div className="mb-1 text-[11px] text-[#9ca3af]">{desc}</div>
            <div className="mb-3 text-[18px] font-semibold text-[#111827]">
              {(planCounts[key] ?? 0).toLocaleString()}{" "}
              <span className="text-[12px] font-normal text-[#9ca3af]">active users</span>
            </div>
            {features.map((f) => (
              <div
                key={f}
                className="flex items-center gap-1.5 border-b border-[#edeef2] py-1.5 text-left text-[12px] text-[#4b5563] last:border-none"
              >
                <Check className="h-3.5 w-3.5 shrink-0 text-[#16a34a]" /> {f}
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* No payments table note */}
      <div className="rounded-xl border border-[#e4e6eb] bg-white px-4 py-6 text-center text-[13px] text-[#9ca3af]">
        Payment transaction history requires a billing integration (e.g. Razorpay, Stripe).
        Connect a payment provider to view revenue and subscription events here.
      </div>
    </div>
  );
}
