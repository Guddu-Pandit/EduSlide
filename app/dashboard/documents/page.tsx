"use client";

import { useState } from "react";
import Link from "next/link";
import { Files, Sparkles, Trash2 } from "lucide-react";
import { getDocuments, getProfile } from "@/app/lib/dashboard/queries";
import { useDashboardQuery } from "@/app/lib/dashboard/useDashboardQuery";
import { deleteDocument } from "@/app/lib/dashboard/actions";
import { formatBytes, formatDate } from "@/app/lib/dashboard/format";
import FileIcon from "@/app/components/dashboard/FileIcon";
import { TableSkeleton } from "@/app/components/dashboard/Skeleton";
import { ConvertModal } from "@/app/components/dashboard/ConvertModal";
import type { DocumentWithCount } from "@/app/lib/dashboard/types";

export default function DocumentsPage() {
  const [converting, setConverting] = useState<DocumentWithCount | null>(null);

  const { data, loading } = useDashboardQuery(async (supabase, userId) => {
    const [documents, profile] = await Promise.all([
      getDocuments(supabase, userId),
      getProfile(supabase, userId),
    ]);
    return { documents, profile };
  });

  if (loading || !data) {
    return (
      <div className="px-4 py-5 md:px-7 md:py-6">
        <TableSkeleton />
      </div>
    );
  }

  const { documents, profile } = data;

  return (
    <div className="px-4 py-5 md:px-7 md:py-6">
      <div className="overflow-hidden rounded-xl border border-border-soft bg-surface-1">
        {documents.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-16 text-center text-text-muted">
            <Files className="h-8 w-8" />
            <p className="text-sm">No documents uploaded yet</p>
            <Link href="/dashboard/upload" className="mt-1 text-sm font-medium text-brand hover:text-brand-hover">
              Upload your first document →
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-180 text-[13px]">
              <thead>
                <tr className="border-b border-border-soft text-left text-[11px] font-semibold uppercase tracking-wide text-text-muted">
                  <th className="py-2.5 pl-5 pr-4 font-semibold">Document</th>
                  <th className="px-4 py-2.5 font-semibold">Size</th>
                  <th className="px-4 py-2.5 font-semibold">Uploaded</th>
                  <th className="px-4 py-2.5 font-semibold">Presentations</th>
                  <th className="py-2.5 pl-4 pr-5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((d) => (
                  <tr key={d.id} className="border-b border-border-soft last:border-none hover:bg-surface-3/50">
                    <td className="py-3 pl-5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <FileIcon type={d.file_type} />
                        <div>
                          <div className="font-medium text-text-strong">{d.name}</div>
                          <div className="text-[11px] uppercase text-text-muted">{d.file_type}</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-text-muted">{formatBytes(d.size_bytes)}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-xs text-text-muted">{formatDate(d.created_at)}</td>
                    <td className="whitespace-nowrap px-4 py-3">
                      {d.presentationCount > 0 ? (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                          {d.presentationCount} made
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-surface-3 px-2.5 py-1 text-[11px] font-semibold text-text-muted">
                          Not converted
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-3 pl-4 pr-5">
                      <div className="flex gap-1.5">
                        <button
                          type="button"
                          onClick={() => setConverting(d)}
                          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold ${
                            d.presentationCount === 0
                              ? "border-brand bg-brand text-white hover:opacity-90"
                              : "border-border-mid bg-surface-1 text-text-strong hover:bg-surface-3"
                          }`}
                        >
                          <Sparkles className="h-3 w-3" />
                          {d.presentationCount === 0 ? "Convert now" : "Convert"}
                        </button>
                        <form action={deleteDocument}>
                          <input type="hidden" name="id" value={d.id} />
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
          </div>
        )}
      </div>

      {converting && (
        <ConvertModal
          doc={converting}
          plan={profile.plan}
          defaultTemplate={profile.default_template}
          onClose={() => setConverting(null)}
        />
      )}
    </div>
  );
}
