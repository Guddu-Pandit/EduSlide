import Link from "next/link";
import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface-3 px-6 py-16">
      <Link
        href="/"
        className="mb-8 font-display text-xl font-bold tracking-tight text-text-strong"
      >
        Edu<span className="text-brand">Slide</span>
      </Link>
      <div className="w-full max-w-sm rounded-2xl border border-border-soft bg-surface-1 p-8">
        {children}
      </div>
    </div>
  );
}
