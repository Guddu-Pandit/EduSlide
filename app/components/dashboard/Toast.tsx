"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

export default function Toast() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const message = searchParams.get("toast");

  const [shownMessage, setShownMessage] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);

  if (message && message !== shownMessage) {
    setShownMessage(message);
    setText(message);
    setVisible(true);
  }

  useEffect(() => {
    if (!message) return;

    const params = new URLSearchParams(searchParams.toString());
    params.delete("toast");
    const next = params.toString() ? `${pathname}?${params.toString()}` : pathname;
    router.replace(next, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [message]);

  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(() => setVisible(false), 3200);
    return () => clearTimeout(timer);
  }, [visible]);

  return (
    <div
      className={`fixed bottom-5 right-5 z-[999] flex max-w-[320px] items-center gap-2 rounded-lg bg-[#15181c] px-[17px] py-[11px] text-[13px] font-medium text-white shadow-lg transition-all duration-200 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-1.5 opacity-0"
      }`}
    >
      <CheckCircle2 className="h-[15px] w-[15px] flex-shrink-0 text-brand" />
      <span>{text}</span>
    </div>
  );
}
