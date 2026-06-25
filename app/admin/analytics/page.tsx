import { getAnalyticsData } from "@/app/lib/admin/queries";

export default async function AnalyticsPage() {
  const { byStatus, byType, months, signupMonths, totalPres, totalDocs } =
    await getAnalyticsData();

  const maxMonth = Math.max(...months.map((m) => m.count), 1);
  const maxSignup = Math.max(...signupMonths.map((m) => m.count), 1);

  const statusColors: Record<string, string> = {
    done: "var(--brand)", generating: "#f59e0b", queued: "#9aa1ab", error: "#dc2626",
  };
  const statusLabels: Record<string, string> = {
    done: "Done", generating: "Generating", queued: "Queued", error: "Error",
  };
  const typeColors: Record<string, string> = {
    pdf: "#dc2626", docx: "var(--brand)", txt: "#9ca3af",
  };

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-text-strong">Analytics</div>
      <div className="mb-5 text-[12px] text-text-muted">Platform usage trends and performance data</div>

      {/* Metrics */}
      <div className="mb-4 grid grid-cols-4 gap-3 max-[1000px]:grid-cols-2">
        {[
          { label: "Total Presentations", val: totalPres.toLocaleString() },
          { label: "Successful", val: (byStatus.done ?? 0).toLocaleString() },
          { label: "Total Documents", val: totalDocs.toLocaleString() },
          { label: "Failed", val: (byStatus.error ?? 0).toLocaleString() },
        ].map(({ label, val }) => (
          <div key={label} className="rounded-xl border border-border-soft bg-surface-1 p-4">
            <div className="mb-1.5 text-[11px] text-text-muted">{label}</div>
            <div className="text-[24px] font-bold leading-none tracking-tight text-text-strong">{val}</div>
          </div>
        ))}
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        {/* Presentation status */}
        <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
          <div className="mb-4 text-[13px] font-semibold text-text-strong">Presentations by Status</div>
          {Object.entries(byStatus).map(([key, count]) => {
            const pct = totalPres > 0 ? Math.round((count / totalPres) * 100) : 0;
            return (
              <div key={key} className="mb-3 last:mb-0">
                <div className="mb-1 flex justify-between text-[12px] text-text-muted">
                  <span>{statusLabels[key] ?? key}</span>
                  <span className="font-semibold text-text-strong">{count} ({pct}%)</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-surface-3">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, background: statusColors[key] ?? "#9ca3af" }} />
                </div>
              </div>
            );
          })}
        </div>

        {/* File types */}
        <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
          <div className="mb-4 text-[13px] font-semibold text-text-strong">Top File Types Uploaded</div>
          {Object.entries(byType).map(([type, count]) => {
            const pct = totalDocs > 0 ? Math.round((count / totalDocs) * 100) : 0;
            return (
              <div key={type} className="flex items-center justify-between border-b border-border-soft py-2 last:border-none">
                <span className="text-[13px] text-text-muted">{type.toUpperCase()}</span>
                <div className="flex items-center gap-2.5">
                  <div className="h-1.5 w-[120px] overflow-hidden rounded-full bg-surface-3">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: typeColors[type] ?? "var(--brand)" }} />
                  </div>
                  <span className="w-10 text-right text-[13px] font-semibold text-text-strong">
                    {count} ({pct}%)
                  </span>
                </div>
              </div>
            );
          })}
          {totalDocs === 0 && (
            <div className="py-4 text-center text-[12px] text-text-muted">No documents yet</div>
          )}
        </div>
      </div>

      {/* Monthly presentations */}
      <div className="mb-4 rounded-xl border border-border-soft bg-surface-1 p-4">
        <div className="mb-4 text-[13px] font-semibold text-text-strong">Monthly Presentations (last 6 months)</div>
        {totalPres === 0 ? (
          <div className="flex h-[120px] items-center justify-center text-[12px] text-text-muted">No presentations yet</div>
        ) : (
          <>
            <div className="flex items-end gap-2.5" style={{ height: 120 }}>
              {months.map(({ label, count }) => (
                <div
                  key={label}
                  className="flex-1 rounded-t-[4px] transition-colors hover:bg-brand"
                  style={{ height: `${Math.round((count / maxMonth) * 100)}%`, minHeight: 2, background: "var(--brand-tint)" }}
                  title={`${label}: ${count} presentations`}
                />
              ))}
            </div>
            <div className="mt-1.5 flex gap-2.5">
              {months.map(({ label }) => (
                <div key={label} className="flex-1 text-center text-[11px] text-text-muted">{label}</div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Monthly signups */}
      <div className="rounded-xl border border-border-soft bg-surface-1 p-4">
        <div className="mb-4 text-[13px] font-semibold text-text-strong">Monthly Signups (last 6 months)</div>
        <div className="flex items-end gap-2.5" style={{ height: 100 }}>
          {signupMonths.map(({ label, count }) => (
            <div
              key={label}
              className="flex-1 rounded-t-[4px] transition-colors hover:bg-brand"
              style={{ height: `${Math.round((count / maxSignup) * 100)}%`, minHeight: count > 0 ? 4 : 2, background: "var(--brand-tint)" }}
              title={`${label}: ${count} signups`}
            />
          ))}
        </div>
        <div className="mt-1.5 flex gap-2.5">
          {signupMonths.map(({ label }) => (
            <div key={label} className="flex-1 text-center text-[11px] text-text-muted">{label}</div>
          ))}
        </div>
      </div>
    </div>
  );
}
