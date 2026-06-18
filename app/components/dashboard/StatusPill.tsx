import { CheckCircle2, CircleDashed, Loader2, XCircle } from "lucide-react";
import type { PresentationStatus } from "@/app/lib/dashboard/types";

const CONFIG: Record<
  PresentationStatus,
  { label: string; className: string; icon: React.ComponentType<{ className?: string }> }
> = {
  done: { label: "Done", className: "bg-emerald-50 text-emerald-700", icon: CheckCircle2 },
  generating: { label: "Generating", className: "bg-brand-tint text-brand", icon: Loader2 },
  queued: { label: "Queued", className: "bg-amber-50 text-amber-700", icon: CircleDashed },
  error: { label: "Error", className: "bg-red-50 text-red-700", icon: XCircle },
};

export default function StatusPill({ status }: { status: PresentationStatus }) {
  const { label, className, icon: Icon } = CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-semibold ${className}`}>
      <Icon className={`h-2.5 w-2.5 ${status === "generating" ? "animate-spin" : ""}`} />
      {label}
    </span>
  );
}
