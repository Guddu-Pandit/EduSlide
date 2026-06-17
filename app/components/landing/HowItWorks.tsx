"use client";

import { useEffect, useState } from "react";
import { Bot, FileText } from "lucide-react";

const steps = [
  {
    title: "Upload your document",
    body: "PDF, DOCX, TXT — any format your material lives in. Your file is encrypted immediately on receipt.",
  },
  {
    title: "AI parses and structures",
    body: "The model extracts key concepts, hierarchy, and data points, then maps them to a clean slide structure.",
  },
  {
    title: "Download your deck",
    body: "Export as PPTX, PDF, or Google Slides. Fully editable, fully branded, ready to present.",
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setProgress(74), 600);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <section id="how-it-works" className="bg-surface-3 px-6 py-18 sm:px-10">
      <div className="mx-auto grid max-w-4xl grid-cols-1 items-start gap-14 lg:grid-cols-2">
        <div>
          <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-brand">
            How it works
          </div>
          <h2 className="mb-3.5 font-display text-[34px] font-bold leading-tight tracking-tight text-text-strong">
            From raw notes to ready slides
          </h2>
          <p className="mb-8 max-w-md text-base leading-relaxed text-text-muted">
            Three steps. No formatting, no copy-pasting, no slide-by-slide work.
          </p>

          <div className="flex flex-col">
            {steps.map((step, i) => (
              <button
                key={step.title}
                onClick={() => setActive(i)}
                className="flex gap-4 border-b border-border-soft py-5 text-left last:border-b-0"
              >
                <span
                  className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg border text-[13px] font-semibold transition-colors ${
                    active === i
                      ? "border-brand bg-brand text-white"
                      : "border-border-soft bg-surface-2 text-text-muted"
                  }`}
                >
                  {i + 1}
                </span>
                <div>
                  <h4 className="mb-1 text-[15px] font-medium text-text-strong">
                    {step.title}
                  </h4>
                  <p className="text-[13px] leading-relaxed text-text-muted">
                    {step.body}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex min-h-[260px] flex-col gap-3.5 rounded-2xl border border-border-soft bg-surface-1 p-6">
          <div className="flex-1 rounded-lg bg-surface-2 p-3">
            <div className="mb-2.5 flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-tint text-brand">
                <FileText className="h-3.5 w-3.5" />
              </div>
              <div>
                <div className="text-xs font-medium text-text-strong">
                  lecture_notes_ch4.pdf
                </div>
                <div className="text-[11px] text-text-muted">
                  Uploaded · 2.1 MB · Encrypted
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              {["90%", "75%", "85%", "60%", "80%"].map((w, i) => (
                <div
                  key={i}
                  className="h-1 rounded bg-border-soft"
                  style={{ width: w }}
                />
              ))}
            </div>
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-tint px-2.5 py-1 text-[11px] font-medium text-brand">
                <Bot className="h-3 w-3" />
                AI processing…
              </span>
              <span className="text-xs text-text-muted">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
              <div
                className="h-full rounded-full bg-brand transition-[width] duration-[1500ms] ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-lg border border-border-soft bg-surface-2 p-2.5">
              <div className="mb-1 text-[11px] text-text-muted">
                Slides generated
              </div>
              <div className="font-display text-xl font-semibold text-brand">
                12
              </div>
            </div>
            <div className="rounded-lg border border-border-soft bg-surface-2 p-2.5">
              <div className="mb-1 text-[11px] text-text-muted">
                Key concepts
              </div>
              <div className="font-display text-xl font-semibold text-brand">
                38
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
