"use client";

import { getProfile } from "@/app/lib/dashboard/queries";
import { useDashboardQuery } from "@/app/lib/dashboard/useDashboardQuery";
import { setDefaultTemplate } from "@/app/lib/dashboard/actions";
import { TEMPLATES } from "@/app/lib/dashboard/templates";

export default function TemplatesPage() {
  const { data: profile, loading } = useDashboardQuery((supabase, userId) => getProfile(supabase, userId));

  return (
    <div className="px-7 py-6">
      <div className="mb-4 text-[13px] text-text-muted">
        Click a template to set it as your default for new uploads.
      </div>

      <div className="grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-2">
        {TEMPLATES.map((t) => {
          const isDefault = !loading && profile?.default_template === t.id;
          return (
            <form key={t.id} action={setDefaultTemplate}>
              <input type="hidden" name="template" value={t.id} />
              <button
                type="submit"
                className={`w-full overflow-hidden rounded-xl border text-left transition-transform hover:-translate-y-0.5 ${
                  isDefault ? "border-2 border-brand" : "border-border-soft hover:border-border-mid"
                }`}
              >
                <div className="flex h-[110px] flex-col gap-1.5 p-3" style={{ background: t.bg }}>
                  <div className="h-2.5 w-3/5 rounded" style={{ background: t.titleColor, opacity: 0.9 }} />
                  <div className="h-[5px] w-4/5 rounded" style={{ background: t.accentColor, opacity: 0.8 }} />
                  <div className="h-[5px] w-[65%] rounded" style={{ background: t.bodyColor }} />
                  <div className="h-[5px] w-1/2 rounded" style={{ background: t.bodyColor }} />
                </div>
                <div className="border-t border-border-soft p-3">
                  <div className="mb-0.5 flex items-center gap-1.5 text-[13px] font-semibold text-text-strong">
                    {t.name}
                    {isDefault && (
                      <span className="rounded-full bg-brand-tint px-2 py-0.5 text-[10px] font-bold text-brand">
                        Default
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-text-muted">{t.description}</div>
                </div>
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
