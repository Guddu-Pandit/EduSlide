import { FileText } from "lucide-react";
import type { DocumentFileType } from "@/app/lib/dashboard/types";

const STYLES: Record<DocumentFileType, string> = {
  pdf: "bg-red-50 text-red-700",
  docx: "bg-sky-50 text-sky-700",
  txt: "bg-surface-3 text-text-muted",
};

export default function FileIcon({ type }: { type: DocumentFileType }) {
  return (
    <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${STYLES[type]}`}>
      <FileText className="h-4 w-4" />
    </div>
  );
}
