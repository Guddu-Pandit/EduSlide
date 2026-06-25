"use client";

import { useState, useTransition } from "react";
import { FileText, Monitor, Search, Trash2 } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";
import { adminDeleteDocument, adminDeletePresentation } from "@/app/lib/admin/actions";
import { formatBytes, formatRelativeTime } from "@/app/lib/dashboard/format";
import type { AdminDoc, AdminPresentation } from "@/app/lib/admin/queries";

const STATUS_BADGE: Record<string, string> = {
  done: "bg-[#edfaf3] text-[#16a34a]",
  generating: "bg-[#fff8e7] text-[#ca8a04]",
  queued: "bg-[#eef3ff] text-[#3b6ef8]",
  error: "bg-[#fff1f1] text-[#dc2626]",
};

type Tab = "documents" | "presentations";

export default function ContentClient({
  documents,
  presentations,
}: {
  documents: AdminDoc[];
  presentations: AdminPresentation[];
}) {
  const toast = useAdminToast();
  const [tab, setTab] = useState<Tab>("documents");
  const [query, setQuery] = useState("");
  const [isPending, startTransition] = useTransition();

  const filteredDocs = documents.filter(
    (d) =>
      !query ||
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.owner_email.toLowerCase().includes(query.toLowerCase())
  );

  const filteredPres = presentations.filter(
    (p) =>
      !query ||
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.owner_email.toLowerCase().includes(query.toLowerCase())
  );

  function deleteDoc(doc: AdminDoc) {
    if (!confirm(`Delete "${doc.name}"?`)) return;
    startTransition(async () => {
      const { error } = await adminDeleteDocument(doc.id);
      if (error) toast(`Error: ${error}`);
      else toast(`"${doc.name}" deleted`);
    });
  }

  function deletePres(pres: AdminPresentation) {
    if (!confirm(`Delete "${pres.name}"?`)) return;
    startTransition(async () => {
      const { error } = await adminDeletePresentation(pres.id);
      if (error) toast(`Error: ${error}`);
      else toast(`"${pres.name}" deleted`);
    });
  }

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-admin-text">Content Management</div>
      <div className="mb-5 text-[12px] text-admin-muted">All documents and presentations on the platform</div>

      {/* Tabs */}
      <div className="mb-4 flex w-fit items-center gap-1 rounded-lg border border-admin-border bg-admin-input p-0.5">
        {(["documents", "presentations"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => { setTab(t); setQuery(""); }}
            className="rounded-md px-4 py-1.5 text-[13px] font-medium capitalize transition-colors"
            style={
              tab === t
                ? { background: "var(--admin-surface)", color: "var(--admin-text)", boxShadow: "0 1px 3px rgba(0,0,0,.08)" }
                : { color: "var(--admin-muted)" }
            }
          >
            {t === "documents" ? `Documents (${documents.length})` : `Presentations (${presentations.length})`}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4 w-full max-w-sm">
        <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-admin-muted" />
        <input
          className="h-9 w-full rounded-lg border border-admin-border bg-admin-surface py-0 pl-8 pr-3 text-[13px] text-admin-text outline-none focus:border-[#3b6ef8]"
          placeholder={tab === "documents" ? "Search documents…" : "Search presentations…"}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {tab === "documents" ? (
        <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-admin-border">
                  {["File", "Owner", "Type", "Size", "Uploaded", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-admin-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDocs.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-[13px] text-admin-muted">No documents found</td></tr>
                ) : (
                  filteredDocs.map((d) => (
                    <tr key={d.id} className="border-b border-admin-divider last:border-none hover:bg-admin-hover">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "#fff1f1", color: "#dc2626" }}>
                            <FileText className="h-3.5 w-3.5" />
                          </div>
                          <span className="text-admin-text">{d.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-admin-body">{d.owner_name || d.owner_email}</td>
                      <td className="px-4 py-3 uppercase text-admin-body">{d.file_type}</td>
                      <td className="px-4 py-3 text-admin-body">{formatBytes(d.size_bytes)}</td>
                      <td className="px-4 py-3 text-admin-body">{formatRelativeTime(d.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deleteDoc(d)}
                          disabled={isPending}
                          className="flex h-7 w-7 items-center justify-center rounded text-admin-body hover:bg-[#fff1f1] hover:text-[#dc2626] disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-admin-border">
                  {["Presentation", "Owner", "Status", "Slides", "Created", ""].map((h) => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-admin-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredPres.length === 0 ? (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-[13px] text-admin-muted">No presentations found</td></tr>
                ) : (
                  filteredPres.map((p) => (
                    <tr key={p.id} className="border-b border-admin-divider last:border-none hover:bg-admin-hover">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md" style={{ background: "#edfaf3", color: "#16a34a" }}>
                            <Monitor className="h-3.5 w-3.5" />
                          </div>
                          <div>
                            <div className="text-admin-text">{p.name}</div>
                            {p.error_message && <div className="text-[10px] text-[#dc2626]">{p.error_message}</div>}
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-admin-body">{p.owner_name || p.owner_email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[p.status] ?? "bg-[#f0f1f5] text-[#9ca3af]"}`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-admin-body">{p.slide_count ?? "—"}</td>
                      <td className="px-4 py-3 text-admin-body">{formatRelativeTime(p.created_at)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => deletePres(p)}
                          disabled={isPending}
                          className="flex h-7 w-7 items-center justify-center rounded text-admin-body hover:bg-[#fff1f1] hover:text-[#dc2626] disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
