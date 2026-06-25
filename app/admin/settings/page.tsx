"use client";

import { useState } from "react";
import { Check, LogOut } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative h-[21px] w-[38px] shrink-0 rounded-full border transition-colors ${
        checked ? "border-brand bg-brand" : "border-border-soft bg-surface-2"
      }`}
    >
      <span
        className="absolute top-[2.5px] h-[15px] w-[15px] rounded-full bg-white shadow-sm transition-transform"
        style={{ left: "2.5px", transform: checked ? "translateX(17px)" : "translateX(0)" }}
      />
    </button>
  );
}

function ToggleRow({ label, sub, checked, onChange }: { label: string; sub: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between border-b border-border-soft py-2.5 last:border-none">
      <div>
        <div className="text-[13px] font-medium text-text-strong">{label}</div>
        <div className="mt-0.5 text-[11px] text-text-muted">{sub}</div>
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

const inputCls = "h-9 w-full rounded-lg border border-border-soft bg-surface-2 px-3 text-[13px] text-text-strong outline-none focus:border-brand focus:ring-2 focus:ring-brand-tint";

export default function SettingsPage() {
  const toast = useAdminToast();
  const [features, setFeatures] = useState({ ai: true, google: true, trial: false, maintenance: false, autoDelete: true });
  const [security, setSecurity] = useState({ twofa: true, rateLimit: true });

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-text-strong">Platform Settings</div>
      <div className="mb-5 text-[12px] text-text-muted">Control global behaviour, security, and integrations</div>

      <div className="grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <div className="flex flex-col gap-4">
          {/* General */}
          <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
            <div className="mb-4 text-[13px] font-semibold text-text-strong">General</div>
            {[
              { label: "Platform name", defaultValue: "EduSlide" },
              { label: "Support email", defaultValue: "support@eduslide.in" },
            ].map(({ label, defaultValue }) => (
              <div key={label} className="mb-3">
                <label className="mb-1 block text-[12px] font-medium text-text-muted">{label}</label>
                <input className={inputCls} defaultValue={defaultValue} />
              </div>
            ))}
            <div className="mb-4">
              <label className="mb-1 block text-[12px] font-medium text-text-muted">Default language</label>
              <select className={`${inputCls} cursor-pointer`}>
                <option>English</option>
                <option>Hindi</option>
              </select>
            </div>
            <button
              onClick={() => toast("Settings saved successfully")}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" /> Save changes
            </button>
          </div>

          {/* Storage & Limits */}
          <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
            <div className="mb-4 text-[13px] font-semibold text-text-strong">Storage & Limits</div>
            {[
              { label: "Free plan storage (GB)", value: "0.5" },
              { label: "Pro plan storage (GB)", value: "5" },
              { label: "Max file size (MB)", value: "20" },
            ].map(({ label, value }) => (
              <div key={label} className="mb-3">
                <label className="mb-1 block text-[12px] font-medium text-text-muted">{label}</label>
                <input type="number" className={inputCls} defaultValue={value} />
              </div>
            ))}
            <button
              onClick={() => toast("Limits updated")}
              className="flex items-center gap-1.5 rounded-lg bg-brand px-3.5 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
            >
              <Check className="h-3.5 w-3.5" /> Save
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {/* Feature Toggles */}
          <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
            <div className="mb-3 text-[13px] font-semibold text-text-strong">Feature Toggles</div>
            <ToggleRow label="AI Presentation Generation" sub="Allow users to generate slides from documents" checked={features.ai} onChange={(v) => setFeatures((p) => ({ ...p, ai: v }))} />
            <ToggleRow label="Google Sign-In" sub="Allow OAuth login via Google accounts" checked={features.google} onChange={(v) => setFeatures((p) => ({ ...p, google: v }))} />
            <ToggleRow label="Free Trial" sub="Offer 7-day Pro trial on signup" checked={features.trial} onChange={(v) => setFeatures((p) => ({ ...p, trial: v }))} />
            <ToggleRow label="Maintenance Mode" sub="Block all user logins except admins" checked={features.maintenance} onChange={(v) => setFeatures((p) => ({ ...p, maintenance: v }))} />
            <ToggleRow label="Auto-delete files after 30 days" sub="Free plan users only" checked={features.autoDelete} onChange={(v) => setFeatures((p) => ({ ...p, autoDelete: v }))} />
          </div>

          {/* Security */}
          <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
            <div className="mb-3 text-[13px] font-semibold text-text-strong">Security</div>
            <ToggleRow label="Enforce 2FA for admins" sub="Required on all admin accounts" checked={security.twofa} onChange={(v) => setSecurity((p) => ({ ...p, twofa: v }))} />
            <ToggleRow label="Login rate limiting" sub="Block after 5 failed attempts" checked={security.rateLimit} onChange={(v) => setSecurity((p) => ({ ...p, rateLimit: v }))} />
            <div className="mt-3">
              <button
                onClick={() => toast("Sessions cleared for all users")}
                className="flex items-center gap-1.5 rounded-lg bg-[#fff1f1] px-3.5 py-2 text-[13px] font-medium text-[#dc2626] transition-opacity hover:opacity-80"
              >
                <LogOut className="h-3.5 w-3.5" /> Force logout all users
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
