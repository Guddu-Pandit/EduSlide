"use client";

import { ArrowDown, ArrowUp, Download } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

const TONES = [
  { label: "Academic", pct: 38, color: "#3b6ef8" },
  { label: "Simplified", pct: 29, color: "#22c55e" },
  { label: "Professional", pct: 21, color: "#f59e0b" },
  { label: "Training", pct: 12, color: "#ec4899" },
];

const FILE_TYPES = [
  { label: "PDF", pct: 62 },
  { label: "DOCX", pct: 28 },
  { label: "TXT / MD", pct: 10 },
];

const REVENUE_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const REVENUE_VALS = [180000, 220000, 195000, 310000, 280000, 420000];
const MAX_REV = Math.max(...REVENUE_VALS);

export default function AnalyticsPage() {
  const toast = useAdminToast();

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">Analytics</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">Platform usage trends and performance data</div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2">
        {[
          { label: "Avg. Session Time", val: "8m 34s", delta: "+1m 12s vs last week", up: true },
          { label: "AI API Calls (today)", val: "5,821", delta: "-3.1% vs yesterday", up: false },
          { label: "Conversion Rate", val: "7.4%", delta: "+0.8% this month", up: true },
          { label: "Churn Rate (MoM)", val: "2.1%", delta: "-0.4% improved", up: true },
        ].map(({ label, val, delta, up }) => (
          <div key={label} className="rounded-xl border border-[#e4e6eb] bg-white p-4">
            <div className="mb-1.5 text-[11px] text-[#9ca3af]">{label}</div>
            <div className="text-[24px] font-bold leading-none tracking-tight text-[#111827]">{val}</div>
            <div className={`mt-1.5 flex items-center gap-1 text-[11px] ${up ? "text-[#16a34a]" : "text-[#dc2626]"}`}>
              {up ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
              {delta}
            </div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {/* Tone chart */}
        <div className="rounded-xl border border-[#e4e6eb] bg-white p-4">
          <div className="mb-4 text-[13px] font-semibold text-[#111827]">Presentations by Tone</div>
          {TONES.map(({ label, pct, color }) => (
            <div key={label} className="mb-3 last:mb-0">
              <div className="mb-1 flex justify-between text-[12px] text-[#4b5563]">
                <span>{label}</span>
                <span className="font-semibold">{pct}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[#f0f1f5]">
                <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
              </div>
            </div>
          ))}
        </div>

        {/* File types */}
        <div className="rounded-xl border border-[#e4e6eb] bg-white p-4">
          <div className="mb-4 text-[13px] font-semibold text-[#111827]">Top File Types Uploaded</div>
          {FILE_TYPES.map(({ label, pct }) => (
            <div key={label} className="flex items-center justify-between border-b border-[#edeef2] py-2 last:border-none">
              <span className="text-[13px] text-[#4b5563]">{label}</span>
              <div className="flex items-center gap-2.5">
                <div className="h-1.5 w-[120px] overflow-hidden rounded-full bg-[#f0f1f5]">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "#3b6ef8" }} />
                </div>
                <span className="w-8 text-right text-[13px] font-semibold text-[#111827]">{pct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue */}
      <div className="rounded-xl border border-[#e4e6eb] bg-white p-4">
        <div className="mb-4 flex items-center justify-between">
          <div className="text-[13px] font-semibold text-[#111827]">Monthly Revenue (₹)</div>
          <button
            onClick={() => toast("Exported to CSV")}
            className="flex items-center gap-1.5 rounded-md border border-[#e4e6eb] px-3 py-1.5 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]"
          >
            <Download className="h-3 w-3" /> Export
          </button>
        </div>
        <div className="flex items-end gap-2.5" style={{ height: 120 }}>
          {REVENUE_VALS.map((v, i) => (
            <div
              key={i}
              className="flex-1 rounded-t-[4px] transition-colors hover:bg-[#3b6ef8]"
              style={{ height: `${Math.round((v / MAX_REV) * 100)}%`, background: "#eef3ff" }}
              title={`${REVENUE_MONTHS[i]}: ₹${(v / 100000).toFixed(1)}L`}
            />
          ))}
        </div>
        <div className="mt-1.5 flex gap-2.5">
          {REVENUE_MONTHS.map((m) => (
            <div key={m} className="flex-1 text-center text-[11px] text-[#9ca3af]">{m}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
