"use client";

import { useEffect, useRef, useState } from "react";
import { Download, RefreshCw, Search } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

const LOG_LINES = [
  { lvl: "INFO", msg: "[auth] User guddu@school.edu logged in — IP 122.168.1.4", t: "00:00:01" },
  { lvl: "INFO", msg: "[ai] Processing job #7821 started — Genetics_Module4.pdf", t: "00:00:04" },
  { lvl: "WARN", msg: "[storage] Usage at 62.4% — approaching alert threshold", t: "00:00:09" },
  { lvl: "INFO", msg: "[billing] Payment ₹499 received — Rahul M. (Pro monthly)", t: "00:00:15" },
  { lvl: "ERROR", msg: "[billing] Payment ₹499 FAILED — Sunita R. — card_declined", t: "00:00:22" },
  { lvl: "INFO", msg: "[ai] Job #7821 completed — 8 slides generated in 4.3s", t: "00:00:31" },
  { lvl: "INFO", msg: "[api] POST /v1/generate 200 OK — 4312ms", t: "00:00:38" },
  { lvl: "WARN", msg: "[rate-limit] IP 103.52.7.89 — 4th failed login attempt", t: "00:00:45" },
  { lvl: "INFO", msg: "[webhook] Slack alert sent — report.flagged event", t: "00:00:52" },
  { lvl: "INFO", msg: "[auth] Admin panel accessed — guddu@school.edu", t: "00:01:00" },
];

const LVL_COLOR: Record<string, string> = { INFO: "#64748b", WARN: "#f59e0b", ERROR: "#ef4444" };

export default function LogsPage() {
  const toast = useAdminToast();
  const [lines, setLines] = useState<typeof LOG_LINES>([]);
  const [key, setKey] = useState(0);
  const streamRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setLines([]);
    const timers: ReturnType<typeof setTimeout>[] = [];
    LOG_LINES.forEach((l, i) => {
      timers.push(setTimeout(() => {
        setLines((prev) => [...prev, l]);
        if (streamRef.current) {
          streamRef.current.scrollTop = streamRef.current.scrollHeight;
        }
      }, i * 120));
    });
    return () => timers.forEach(clearTimeout);
  }, [key]);

  function refresh() {
    setKey((k) => k + 1);
    toast("Log stream refreshed");
  }

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">System Logs</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">Real-time platform events and error tracking</div>

      <div className="mb-4 flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af]" />
          <input
            className="h-9 w-full rounded-lg border border-[#e4e6eb] bg-white pl-8 pr-3 text-[13px] text-[#111827] outline-none focus:border-[#3b6ef8]"
            placeholder="Filter logs…"
          />
        </div>
        <select className="h-9 rounded-lg border border-[#e4e6eb] bg-white px-2.5 text-[13px] text-[#4b5563] outline-none">
          <option>All levels</option>
          <option>Error</option>
          <option>Warning</option>
          <option>Info</option>
        </select>
        <button onClick={refresh} className="flex items-center gap-1.5 rounded-lg border border-[#e4e6eb] bg-white px-3 py-2 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
        <button onClick={() => toast("Logs exported")} className="flex items-center gap-1.5 rounded-lg border border-[#e4e6eb] bg-white px-3 py-2 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border" style={{ background: "#0f1117", borderColor: "#2a2d3a" }}>
        <div className="flex items-center justify-between border-b px-4 py-2.5" style={{ borderColor: "#2a2d3a" }}>
          <span className="text-[12px] font-semibold uppercase tracking-[0.8px]" style={{ color: "#64748b" }}>Live Log Stream</span>
          <span className="inline-block h-2 w-2 animate-pulse rounded-full" style={{ background: "#22c55e" }} />
        </div>
        <div
          ref={streamRef}
          className="max-h-[340px] overflow-y-auto p-4"
          style={{ fontFamily: "'JetBrains Mono','Fira Mono',monospace", fontSize: 12, lineHeight: 1.8 }}
        >
          {lines.map((l, i) => (
            <div key={i} style={{ color: LVL_COLOR[l.lvl] ?? "#94a3b8" }}>
              <span style={{ color: "#475569" }}>[{l.t}]</span>{" "}
              <span style={{ fontWeight: 700 }}>{l.lvl}</span>{" "}
              <span style={{ color: "#cbd5e1" }}>{l.msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
