"use client";

import { BarChart3, Clock, Presentation as PresentationIcon, Sparkles } from "lucide-react";
import { getDashboardData } from "@/app/lib/dashboard/queries";
import { useDashboardQuery } from "@/app/lib/dashboard/useDashboardQuery";
import { templateName } from "@/app/lib/dashboard/templates";
import StatCard from "@/app/components/dashboard/StatCard";
import { CardSkeleton, StatGridSkeleton } from "@/app/components/dashboard/Skeleton";

export default function AnalyticsPage() {
  const { data, loading } = useDashboardQuery((supabase, userId) => getDashboardData(supabase, userId));

  if (loading || !data) {
    return (
      <div className="px-7 py-6">
        <StatGridSkeleton />
        <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
          <CardSkeleton />
          <CardSkeleton />
        </div>
        <CardSkeleton className="h-32" />
      </div>
    );
  }

  const { documents, presentations } = data;

  const totalSlides = presentations.reduce((sum, p) => sum + p.slide_count, 0);

  const doneWithDuration = presentations.filter((p) => p.status === "done" && p.completed_at);
  const avgSeconds = doneWithDuration.length
    ? Math.round(
        doneWithDuration.reduce(
          (sum, p) => sum + (new Date(p.completed_at!).getTime() - new Date(p.created_at).getTime()) / 1000,
          0,
        ) / doneWithDuration.length,
      )
    : null;

  const byTemplate = new Map<string, number>();
  for (const p of presentations) byTemplate.set(p.template, (byTemplate.get(p.template) ?? 0) + 1);
  const templateBars = [...byTemplate.entries()].sort((a, b) => b[1] - a[1]);
  const maxTemplate = Math.max(1, ...templateBars.map(([, v]) => v));

  const slideBars = presentations
    .filter((p) => p.slide_count > 0)
    .sort((a, b) => b.slide_count - a.slide_count)
    .slice(0, 6);
  const maxSlides = Math.max(1, ...slideBars.map((p) => p.slide_count));

  const days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const label = d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const count = [...presentations, ...documents].filter(
      (item) => new Date(item.created_at).toDateString() === d.toDateString(),
    ).length;
    days.push({ label, count });
  }
  const maxDay = Math.max(1, ...days.map((d) => d.count));

  return (
    <div className="px-7 py-6">
      <div className="mb-6 grid grid-cols-3 gap-3.5 max-[900px]:grid-cols-1">
        <StatCard label="Total generated" icon={PresentationIcon} value={presentations.length} sub="All time" />
        <StatCard
          label="Total slides"
          icon={Sparkles}
          iconClassName="text-emerald-600"
          value={totalSlides}
          sub="Across all presentations"
        />
        <StatCard
          label="Avg generation time"
          icon={Clock}
          iconClassName="text-amber-600"
          value={avgSeconds !== null ? `${avgSeconds}s` : "—"}
          sub={avgSeconds !== null ? `Across ${doneWithDuration.length} completed` : "No completed presentations yet"}
        />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
        <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
          <div className="mb-4 text-sm font-bold text-text-strong">Presentations by template</div>
          {templateBars.length === 0 ? (
            <EmptyChart />
          ) : (
            templateBars.map(([id, count]) => (
              <BarRow key={id} label={templateName(id)} value={count} max={maxTemplate} barClass="bg-brand" />
            ))
          )}
        </div>

        <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
          <div className="mb-4 text-sm font-bold text-text-strong">Slides per presentation</div>
          {slideBars.length === 0 ? (
            <EmptyChart />
          ) : (
            slideBars.map((p) => (
              <BarRow key={p.id} label={p.name} value={p.slide_count} max={maxSlides} barClass="bg-emerald-500" />
            ))
          )}
        </div>
      </div>

      <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
        <div className="mb-4 text-sm font-bold text-text-strong">Activity this week</div>
        <div className="flex h-20 items-end gap-2 pb-1">
          {days.map((d) => (
            <div key={d.label} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end rounded bg-surface-3">
                <div
                  className={`w-full rounded transition-all ${d.count ? "bg-brand" : "bg-surface-3"}`}
                  style={{ height: d.count ? `${Math.max(20, Math.round((d.count / maxDay) * 100))}%` : "4px" }}
                />
              </div>
              <div className="whitespace-nowrap text-[10px] text-text-muted">{d.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function BarRow({ label, value, max, barClass }: { label: string; value: number; max: number; barClass: string }) {
  return (
    <div className="mb-2.5 flex items-center gap-2.5 last:mb-0">
      <div className="w-24 flex-shrink-0 truncate text-xs text-text-muted">{label}</div>
      <div className="h-2 flex-1 overflow-hidden rounded bg-surface-3">
        <div className={`h-2 rounded ${barClass}`} style={{ width: `${Math.round((value / max) * 100)}%` }} />
      </div>
      <div className="w-5 flex-shrink-0 text-right text-xs text-text-muted">{value}</div>
    </div>
  );
}

function EmptyChart() {
  return (
    <div className="flex flex-col items-center gap-2 py-8 text-center text-text-muted">
      <BarChart3 className="h-6 w-6" />
      <p className="text-xs">No data yet</p>
    </div>
  );
}
