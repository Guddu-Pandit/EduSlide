import Link from "next/link";
import { Lock, ShieldCheck, Sparkles, Zap } from "lucide-react";

const highlights = [
  { icon: Zap, text: "Generate polished slides from any document in seconds" },
  { icon: Lock, text: "AWS KMS encryption with per-tenant data isolation" },
  { icon: ShieldCheck, text: "Zero-trust API — no long-lived credentials" },
];

export default function AuthLayout({
  children,
  title,
  subtitle,
}: {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex min-h-screen bg-surface-1">
      <div className="hidden w-[44%] flex-col justify-between bg-surface-3 px-12 py-12 lg:flex">
        <Link
          href="/"
          className="font-display text-xl font-bold tracking-tight text-text-strong"
        >
          Edu<span className="text-brand">Slide</span>
        </Link>

        <div>
          <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-brand">
            <Sparkles className="h-3.5 w-3.5" />
            AI-powered · Secure · Private
          </div>
          <h2 className="max-w-sm font-display text-3xl font-bold leading-tight tracking-tight text-text-strong">
            Turn documents into polished slides in seconds
          </h2>

          <ul className="mt-9 flex flex-col gap-4">
            {highlights.map((h) => (
              <li key={h.text} className="flex items-start gap-3">
                <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-[9px] bg-surface-1 text-brand">
                  <h.icon className="h-4 w-4" />
                </div>
                <p className="pt-1.5 text-sm leading-relaxed text-text-muted">
                  {h.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-text-muted">
          © 2026 EduSlide · Privacy-first AI for education
        </p>
      </div>

      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 sm:px-10">
        <div className="w-full max-w-sm">
          <Link
            href="/"
            className="mb-8 flex items-center justify-center font-display text-xl font-bold tracking-tight text-text-strong lg:hidden"
          >
            Edu<span className="text-brand">Slide</span>
          </Link>

          <h1 className="font-display text-2xl font-bold tracking-tight text-text-strong">
            {title}
          </h1>
          <p className="mt-2 text-sm text-text-muted">{subtitle}</p>

          <div className="mt-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
