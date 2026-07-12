"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { AlertTriangle, X } from "lucide-react";

/**
 * Blocking popup for `?popup=` messages (limit / quota errors), the modal
 * counterpart of the `?toast=` mechanism in Toast.tsx. Stays open until the
 * user dismisses it.
 */
export default function LimitPopup() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const message = searchParams.get("popup");

  const [shownMessage, setShownMessage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [title, setTitle] = useState("Limit exceeded");
  const [open, setOpen] = useState(false);

  if (message && message !== shownMessage) {
    setShownMessage(message);
    setText(message);
    setTitle(searchParams.get("popupTitle") ?? "Limit exceeded");
    setOpen(true);
  }

  useEffect(() => {
    if (!message) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("popup");
    params.delete("popupTitle");
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(next, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border-soft bg-surface-1 shadow-2xl">
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
            </span>
            <div className="text-[15px] font-bold text-text-strong">{title}</div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="px-5 py-4 text-[13px] leading-relaxed text-text-muted">{text}</div>

        <div className="flex items-center justify-end border-t border-border-soft px-5 py-4">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
