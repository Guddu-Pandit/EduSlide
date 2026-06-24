"use client";

import { useState } from "react";
import { Plus, Send, Trash2 } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

const API_KEYS = [
  { name: "Production", key: "sk-edu-••••••••••••ab3f", created: "Mar 1, 2025", lastUsed: "2h ago", status: "Active" },
  { name: "Staging", key: "sk-edu-••••••••••••7c12", created: "Jan 15, 2025", lastUsed: "5d ago", status: "Limited" },
];

const WEBHOOKS = [
  { endpoint: "https://hooks.zapier.com/edu123", events: "user.signup, payment.success", lastDelivery: "14m ago", status: "200 OK" },
  { endpoint: "https://api.slack.com/webhooks/T0...", events: "report.flagged", lastDelivery: "41m ago", status: "200 OK" },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="relative h-[21px] w-[38px] shrink-0 rounded-full border transition-colors"
      style={{ background: checked ? "#3b6ef8" : "#f0f1f5", borderColor: checked ? "#3b6ef8" : "#e4e6eb" }}
    >
      <span
        className="absolute top-[2.5px] h-[15px] w-[15px] rounded-full bg-white shadow-sm transition-transform"
        style={{ left: "2.5px", transform: checked ? "translateX(17px)" : "translateX(0)" }}
      />
    </button>
  );
}

export default function ApiPage() {
  const toast = useAdminToast();
  const [integrations, setIntegrations] = useState({ openai: true, drive: true, razorpay: true, slack: false });

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">API & Integrations</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">Manage API keys, webhooks, and third-party connections</div>

      {/* API Keys */}
      <div className="mb-4 rounded-xl border border-[#e4e6eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#e4e6eb] px-4 py-3">
          <div className="text-[13px] font-semibold text-[#111827]">API Keys</div>
          <button
            onClick={() => toast("New API key generated")}
            className="flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-[12px] font-medium text-white"
            style={{ background: "#3b6ef8" }}
          >
            <Plus className="h-3.5 w-3.5" /> Generate key
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e4e6eb]">
                {["Name", "Key", "Created", "Last used", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {API_KEYS.map((k) => (
                <tr key={k.name} className="border-b border-[#edeef2] last:border-none hover:bg-[#f7f8fa]">
                  <td className="px-4 py-3 font-medium text-[#111827]">{k.name}</td>
                  <td className="px-4 py-3">
                    <code className="rounded bg-[#f0f1f5] px-1.5 py-0.5 text-[12px] text-[#4b5563]">{k.key}</code>
                  </td>
                  <td className="px-4 py-3 text-[#4b5563]">{k.created}</td>
                  <td className="px-4 py-3 text-[#4b5563]">{k.lastUsed}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${k.status === "Active" ? "bg-[#edfaf3] text-[#16a34a]" : "bg-[#fff8e7] text-[#ca8a04]"}`}>{k.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => toast("Key revoked")} className="flex h-7 w-7 items-center justify-center rounded text-[#4b5563] hover:bg-[#fff1f1] hover:text-[#dc2626]">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Webhooks */}
      <div className="mb-4 rounded-xl border border-[#e4e6eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#e4e6eb] px-4 py-3">
          <div className="text-[13px] font-semibold text-[#111827]">Webhooks</div>
          <button onClick={() => toast("Webhook editor opened")} className="flex items-center gap-1.5 rounded-lg border border-[#e4e6eb] px-3 py-1.5 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]">
            <Plus className="h-3.5 w-3.5" /> Add webhook
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e4e6eb]">
                {["Endpoint", "Events", "Last delivery", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {WEBHOOKS.map((w) => (
                <tr key={w.endpoint} className="border-b border-[#edeef2] last:border-none hover:bg-[#f7f8fa]">
                  <td className="px-4 py-3"><code className="text-[12px] text-[#4b5563]">{w.endpoint}</code></td>
                  <td className="px-4 py-3 text-[#4b5563]">{w.events}</td>
                  <td className="px-4 py-3 text-[#4b5563]">{w.lastDelivery}</td>
                  <td className="px-4 py-3"><span className="rounded bg-[#edfaf3] px-2 py-0.5 text-[10px] font-semibold text-[#16a34a]">{w.status}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => toast("Test ping sent")} className="flex h-7 w-7 items-center justify-center rounded text-[#4b5563] hover:bg-[#f0f1f5]">
                      <Send className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connected Integrations */}
      <div className="rounded-xl border border-[#e4e6eb] bg-white p-4">
        <div className="mb-3 text-[13px] font-semibold text-[#111827]">Connected Integrations</div>
        {[
          { key: "openai" as const, label: "OpenAI / Anthropic API", sub: "Powers AI slide generation" },
          { key: "drive" as const, label: "Google Drive export", sub: "Export slides directly to Drive" },
          { key: "razorpay" as const, label: "Razorpay Payments", sub: "Subscription billing gateway" },
          { key: "slack" as const, label: "Slack Alerts", sub: "Admin notifications to Slack" },
        ].map(({ key, label, sub }) => (
          <div key={key} className="flex items-center justify-between border-b border-[#edeef2] py-2.5 last:border-none">
            <div>
              <div className="text-[13px] font-medium text-[#111827]">{label}</div>
              <div className="mt-0.5 text-[11px] text-[#9ca3af]">{sub}</div>
            </div>
            <Toggle checked={integrations[key]} onChange={(v) => setIntegrations((p) => ({ ...p, [key]: v }))} />
          </div>
        ))}
      </div>
    </div>
  );
}
