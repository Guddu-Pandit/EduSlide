"use client";

import { ArrowUp, Check, Download } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

const TRANSACTIONS = [
  { user: "Rahul M.", plan: "Pro (monthly)", amount: "₹499", date: "Today", status: "Paid" },
  { user: "Anjali T.", plan: "Enterprise (annual)", amount: "₹2,499", date: "Yesterday", status: "Paid" },
  { user: "Vikram N.", plan: "Pro (monthly)", amount: "₹499", date: "2d ago", status: "Pending" },
  { user: "Sunita R.", plan: "Pro (monthly)", amount: "₹499", date: "3d ago", status: "Failed" },
];

const STATUS_BADGE: Record<string, string> = {
  Paid: "bg-[#edfaf3] text-[#16a34a]",
  Pending: "bg-[#fff8e7] text-[#ca8a04]",
  Failed: "bg-[#fff1f1] text-[#dc2626]",
};

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    desc: "For individuals getting started",
    features: ["5 presentations/month", "500 MB storage", "PDF & PPTX export"],
    popular: false,
  },
  {
    name: "Pro",
    price: "₹499",
    desc: "For educators and serious students",
    features: ["Unlimited presentations", "5 GB storage", "All export formats"],
    popular: true,
  },
  {
    name: "Enterprise",
    price: "₹2,499",
    desc: "For schools and institutions",
    features: ["Everything in Pro", "Unlimited storage", "Priority AI queue"],
    popular: false,
  },
];

export default function BillingPage() {
  const toast = useAdminToast();

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">Billing & Plans</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">Manage subscription tiers and review revenue</div>

      {/* Metrics */}
      <div className="mb-5 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2">
        {[
          { label: "Free Users", val: "1,890", delta: "66% of total", neutral: true },
          { label: "Pro Users", val: "812", delta: "+34 this week", up: true },
          { label: "Enterprise", val: "139", delta: "+5 this month", up: true },
          { label: "MRR", val: "₹4.2L", delta: "+12.4% MoM", up: true },
        ].map(({ label, val, delta, up, neutral }) => (
          <div key={label} className="rounded-xl border border-[#e4e6eb] bg-white p-4">
            <div className="mb-1.5 text-[11px] text-[#9ca3af]">{label}</div>
            <div className="text-[24px] font-bold leading-none tracking-tight text-[#111827]">{val}</div>
            <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${neutral ? "text-[#9ca3af]" : "text-[#16a34a]"}`}>
              {!neutral && up && <ArrowUp className="h-3 w-3" />}
              {delta}
            </div>
          </div>
        ))}
      </div>

      {/* Plan cards */}
      <div className="mb-5 grid grid-cols-3 gap-4 max-[900px]:grid-cols-1">
        {PLANS.map(({ name, price, desc, features, popular }) => (
          <div
            key={name}
            className="rounded-xl border p-4 text-center"
            style={popular ? { borderColor: "#3b6ef8", background: "#eef3ff" } : { borderColor: "#e4e6eb", background: "#fff" }}
          >
            {popular && (
              <div className="mb-1 text-[10px] font-bold uppercase tracking-[0.8px]" style={{ color: "#3b6ef8" }}>Most Popular</div>
            )}
            <div className="text-[13px] font-bold text-[#111827]">{name}</div>
            <div className="my-2 text-[26px] font-bold leading-none" style={{ color: "#3b6ef8" }}>
              {price}<span className="text-[12px] font-normal text-[#9ca3af]">/mo</span>
            </div>
            <div className="mb-3 text-[11px] text-[#9ca3af]">{desc}</div>
            {features.map((f) => (
              <div key={f} className="flex items-center gap-1.5 border-b border-[#edeef2] py-1.5 text-left text-[12px] text-[#4b5563] last:border-none">
                <Check className="h-3.5 w-3.5 shrink-0 text-[#16a34a]" /> {f}
              </div>
            ))}
            <button
              onClick={() => toast("Plan editor opened")}
              className="mt-3 w-full rounded-lg py-2 text-[13px] font-medium"
              style={popular ? { background: "#3b6ef8", color: "#fff" } : { border: "0.5px solid #e4e6eb", color: "#4b5563" }}
            >
              Edit Plan
            </button>
          </div>
        ))}
      </div>

      {/* Transactions */}
      <div className="rounded-xl border border-[#e4e6eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#e4e6eb] px-4 py-3">
          <div className="text-[13px] font-semibold text-[#111827]">Recent Transactions</div>
          <button onClick={() => toast("Exported to CSV")} className="flex items-center gap-1.5 rounded-lg border border-[#e4e6eb] px-3 py-1.5 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e4e6eb]">
                {["User", "Plan", "Amount", "Date", "Status"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TRANSACTIONS.map((t, i) => (
                <tr key={i} className="border-b border-[#edeef2] last:border-none hover:bg-[#f7f8fa]">
                  <td className="px-4 py-3 text-[#111827]">{t.user}</td>
                  <td className="px-4 py-3 text-[#4b5563]">{t.plan}</td>
                  <td className="px-4 py-3 text-[#111827]">{t.amount}</td>
                  <td className="px-4 py-3 text-[#4b5563]">{t.date}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[t.status]}`}>{t.status}</span>
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
