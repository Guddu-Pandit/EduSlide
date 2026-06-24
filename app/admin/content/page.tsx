"use client";

import { Download, Eye, FileText, Filter, Monitor, Search, Trash2 } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

const FILES = [
  { name: "Photosynthesis_Ch3.pdf", owner: "Guddu K.", type: "PDF", size: "124 KB", uploaded: "Today", status: "Processed", iconBg: "#fff1f1", iconColor: "#dc2626", Icon: FileText },
  { name: "Cell_Division_Notes.docx", owner: "Priya S.", type: "DOCX", size: "88 KB", uploaded: "Yesterday", status: "Processed", iconBg: "#eef3ff", iconColor: "#3b6ef8", Icon: FileText },
  { name: "Genetics_Module4.pdf", owner: "Rahul M.", type: "PDF", size: "210 KB", uploaded: "2d ago", status: "Processing", iconBg: "#fff1f1", iconColor: "#dc2626", Icon: FileText },
  { name: "Quantum Physics — 10 slides", owner: "Anjali T.", type: "PPTX", size: "1.2 MB", uploaded: "3d ago", status: "Done", iconBg: "#edfaf3", iconColor: "#16a34a", Icon: Monitor },
  { name: "Economics_Intro.md", owner: "Vikram N.", type: "MD", size: "22 KB", uploaded: "4d ago", status: "Processed", iconBg: "#f3e8ff", iconColor: "#7c3aed", Icon: FileText },
];

const STATUS_BADGE: Record<string, string> = {
  Processed: "bg-[#edfaf3] text-[#16a34a]",
  Processing: "bg-[#fff8e7] text-[#ca8a04]",
  Done: "bg-[#edfaf3] text-[#16a34a]",
};

export default function ContentPage() {
  const toast = useAdminToast();

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">Content Management</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">All documents and presentations uploaded to the platform</div>

      <div className="mb-4 flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af]" />
          <input
            className="h-9 w-full rounded-lg border border-[#e4e6eb] bg-white py-0 pl-8 pr-3 text-[13px] text-[#111827] outline-none focus:border-[#3b6ef8]"
            placeholder="Search files…"
          />
        </div>
        <button onClick={() => toast("Filter panel coming soon")} className="flex items-center gap-1.5 rounded-lg border border-[#e4e6eb] bg-white px-3 py-2 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]">
          <Filter className="h-3.5 w-3.5" /> Filter
        </button>
        <button onClick={() => toast("Exported to CSV")} className="flex items-center gap-1.5 rounded-lg border border-[#e4e6eb] bg-white px-3 py-2 text-[12px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]">
          <Download className="h-3.5 w-3.5" /> Export
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-[#e4e6eb] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e4e6eb]">
                {["File", "Owner", "Type", "Size", "Uploaded", "Status", ""].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FILES.map((f) => (
                <tr key={f.name} className="border-b border-[#edeef2] last:border-none hover:bg-[#f7f8fa]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[12px]" style={{ background: f.iconBg, color: f.iconColor }}>
                        <f.Icon className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[#111827]">{f.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#4b5563]">{f.owner}</td>
                  <td className="px-4 py-3 text-[#4b5563]">{f.type}</td>
                  <td className="px-4 py-3 text-[#4b5563]">{f.size}</td>
                  <td className="px-4 py-3 text-[#4b5563]">{f.uploaded}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[f.status]}`}>{f.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toast("File preview opened")} className="flex h-7 w-7 items-center justify-center rounded text-[#4b5563] hover:bg-[#f0f1f5]">
                        <Eye className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => toast("File deleted")} className="flex h-7 w-7 items-center justify-center rounded text-[#4b5563] hover:bg-[#fff1f1] hover:text-[#dc2626]">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
