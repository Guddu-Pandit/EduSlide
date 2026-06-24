"use client";

import { createContext, useCallback, useContext, useRef, useState } from "react";
import { Check } from "lucide-react";

type ShowToast = (msg: string) => void;

const Ctx = createContext<ShowToast>(() => {});

export function useAdminToast() {
  return useContext(Ctx);
}

export function AdminToastProvider({ children }: { children: React.ReactNode }) {
  const [text, setText] = useState("");
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const show = useCallback((msg: string) => {
    setText(msg);
    setVisible(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setVisible(false), 2800);
  }, []);

  return (
    <Ctx.Provider value={show}>
      {children}
      <div
        className={`fixed bottom-5 right-5 z-[999] flex items-center gap-2 rounded-lg px-4 py-2.5 text-[13px] font-medium text-white shadow-xl transition-all duration-200 ${
          visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
        }`}
        style={{ background: "#111827" }}
      >
        <Check className="h-3.5 w-3.5 shrink-0" style={{ color: "#22c55e" }} />
        <span>{text}</span>
      </div>
    </Ctx.Provider>
  );
}
