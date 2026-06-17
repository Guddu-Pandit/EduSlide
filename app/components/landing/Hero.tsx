import Link from "next/link";
import { ArrowRight, BarChart3, Play, Sparkles, Upload } from "lucide-react";

export default function Hero() {
  return (
    <section className="border-b border-border-soft bg-surface-1 px-6 py-16 text-center sm:px-10 sm:py-20">
      <div className="mb-6 inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-3.5 py-1.5 text-xs font-medium uppercase tracking-wider text-brand">
        <Sparkles className="h-3.5 w-3.5" />
        AI-powered · Secure · Private
      </div>

      <h1 className="mx-auto max-w-2xl font-display text-4xl font-bold leading-tight tracking-tight text-text-strong sm:text-5xl lg:text-[52px]">
        Turn documents into <span className="text-brand">polished slides</span> in seconds
      </h1>

      <p className="mx-auto mt-5 max-w-lg text-base leading-relaxed text-text-muted sm:text-[17px]">
        Upload your lecture notes, research papers, or course materials —
        EduSlide&apos;s AI converts them into professional presentations.
        Fully isolated per user. Nothing ever shared.
      </p>

      <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/signup"
          className="flex items-center gap-2 rounded-xl bg-brand px-7 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-hover"
        >
          <ArrowRight className="h-4 w-4" />
          Try it free
        </Link>
        <button className="flex items-center gap-2 rounded-xl border border-border-strong px-7 py-3.5 text-[15px] text-text-strong transition-colors hover:bg-surface-2">
          <Play className="h-4 w-4" />
          Watch demo
        </button>
      </div>

      <div className="mx-auto mt-13 max-w-xl rounded-2xl border border-border-soft bg-surface-2 p-7">
        <div className="mb-4 flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-[#F09595]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#EF9F27]" />
          <span className="h-2.5 w-2.5 rounded-full bg-brand" />
          <span className="ml-2 text-xs text-text-muted">
            eduslide.app · your workspace
          </span>
        </div>

        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3">
          <div className="relative flex aspect-[16/10] flex-col gap-1.5 overflow-hidden rounded-lg border-[1.5px] border-brand bg-surface-1 p-2.5">
            <span className="absolute inset-x-0 top-0 h-[3px] rounded-t-lg bg-brand" />
            <div className="h-[7px] w-[70%] rounded bg-border-mid" />
            <div className="h-[5px] w-[65%] rounded bg-border-soft" />
            <div className="mt-1 flex gap-1">
              <div className="h-[18px] flex-1 rounded bg-border-soft" />
              <div className="h-[18px] flex-1 rounded bg-border-soft" />
            </div>
          </div>

          <div className="relative flex aspect-[16/10] flex-col gap-1.5 overflow-hidden rounded-lg border border-border-soft bg-surface-1 p-2.5">
            <span className="absolute inset-x-0 top-0 h-[3px] rounded-t-lg bg-brand" />
            <div className="h-[7px] w-[70%] rounded bg-border-mid" />
            <div className="h-[5px] w-[90%] rounded bg-border-soft" />
            <div className="h-[5px] w-[65%] rounded bg-border-soft" />
            <div className="h-[5px] w-[45%] rounded bg-border-soft" />
          </div>

          <div className="relative flex aspect-[16/10] flex-col gap-1.5 overflow-hidden rounded-lg border border-border-soft bg-surface-1 p-2.5">
            <span className="absolute inset-x-0 top-0 h-[3px] rounded-t-lg bg-brand" />
            <div className="flex h-5 w-5 items-center justify-center rounded-[5px] bg-brand-tint text-brand">
              <BarChart3 className="h-3 w-3" />
            </div>
            <div className="h-[5px] w-[65%] rounded bg-border-soft" />
            <div className="h-[5px] w-[45%] rounded bg-border-soft" />
          </div>
        </div>

        <div className="mt-3 flex cursor-pointer items-center justify-center gap-2.5 rounded-lg border-[1.5px] border-dashed border-border-mid bg-surface-1 p-4 text-center transition-colors hover:border-brand">
          <Upload className="h-[18px] w-[18px] text-brand" />
          <p className="text-[13px] text-text-muted">
            Drop your PDF, DOCX, or notes ·{" "}
            <span className="font-medium text-brand">Browse files</span>
          </p>
        </div>
      </div>
    </section>
  );
}
