import Link from "next/link";
import { Presentation as PresentationIcon, RefreshCw, Trash2 } from "lucide-react";
import { createClient } from "@/app/lib/supabase/server";
import { getPresentations } from "@/app/lib/dashboard/queries";
import { deletePresentation, retryPresentation } from "@/app/lib/dashboard/actions";
import { formatDate } from "@/app/lib/dashboard/format";
import { templateName } from "@/app/lib/dashboard/templates";
import StatusPill from "@/app/components/dashboard/StatusPill";
import type { PresentationStatus } from "@/app/lib/dashboard/types";

const FILTERS: { key: PresentationStatus | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "done", label: "Done" },
  { key: "generating", label: "Generating" },
  { key: "queued", label: "Queued" },
  { key: "error", label: "Errors" },
];

export default async function PresentationsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; q?: string }>;
}) {
  const { status, q } = await searchParams;
  const activeStatus = (status as PresentationStatus) || undefined;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const presentations = await getPresentations(supabase, user.id, { status: activeStatus, q });

  return (
    <div className="px-7 py-6">
      <div className="mb-5 flex items-center justify-between">
        <div className="flex gap-2">
          {FILTERS.map((f) => {
            const active = (f.key === "all" && !activeStatus) || f.key === activeStatus;
            const href = f.key === "all" ? "/dashboard/presentations" : `/dashboard/presentations?status=${f.key}`;
            return (
              <Link
                key={f.key}
                href={href}
                className={`rounded-lg border px-2.5 py-[5px] text-xs font-medium transition-colors ${
                  active
                    ? "border-brand bg-brand text-white"
                    : "border-border-mid bg-surface-1 text-text-strong hover:bg-surface-3"
                }`}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
        <div className="text-[13px] text-text-muted">
          {presentations.length} presentation{presentations.length === 1 ? "" : "s"}
          {q ? ` matching "${q}"` : ""}
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-border-soft bg-surface-1">
        {presentations.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-text-muted">
            <PresentationIcon className="h-8 w-8" />
            <p className="text-sm">No presentations here yet</p>
            <Link href="/dashboard/upload" className="mt-1 text-sm font-medium text-brand hover:text-brand-hover">
              Upload a document to get started →
            </Link>
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-border-soft text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                <th className="py-2.5 pl-5 font-semibold">Presentation</th>
                <th className="py-2.5 font-semibold">Template</th>
                <th className="py-2.5 font-semibold">Slides</th>
                <th className="py-2.5 font-semibold">Status</th>
                <th className="py-2.5 font-semibold">Created</th>
                <th className="py-2.5 pr-5 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {presentations.map((p) => (
                <tr key={p.id} className="border-b border-border-soft last:border-none hover:bg-surface-3/50">
                  <td className="py-3 pl-5">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-brand-tint text-brand">
                        <PresentationIcon className="h-4 w-4" />
                      </span>
                      <span className="font-medium text-text-strong">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 text-xs text-text-muted">{templateName(p.template)}</td>
                  <td className="py-3 text-text-muted">{p.slide_count || "—"}</td>
                  <td className="py-3">
                    <StatusPill status={p.status} />
                  </td>
                  <td className="py-3 text-xs text-text-muted">{formatDate(p.created_at)}</td>
                  <td className="py-3 pr-5">
                    <div className="flex gap-1.5">
                      {p.status === "error" && (
                        <form action={retryPresentation}>
                          <input type="hidden" name="id" value={p.id} />
                          <button
                            type="submit"
                            className="flex items-center gap-1 rounded-lg border border-brand bg-brand px-2.5 py-1.5 text-xs font-semibold text-white hover:opacity-90"
                          >
                            <RefreshCw className="h-3 w-3" /> Retry
                          </button>
                        </form>
                      )}
                      <form action={deletePresentation}>
                        <input type="hidden" name="id" value={p.id} />
                        <button
                          type="submit"
                          className="flex items-center gap-1 rounded-lg border border-border-mid px-2.5 py-1.5 text-xs font-medium text-text-strong hover:bg-surface-3"
                        >
                          <Trash2 className="h-3 w-3 text-red-600" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
