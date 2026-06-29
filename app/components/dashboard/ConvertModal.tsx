"use client";

import { useRef, useState } from "react";
import { Sparkles, X } from "lucide-react";
import { convertDocument } from "@/app/lib/dashboard/actions";
import { TEMPLATES } from "@/app/lib/dashboard/templates";
import { PLAN_LIMITS, type Plan } from "@/app/lib/dashboard/plan";
import type { DocumentWithCount } from "@/app/lib/dashboard/types";

interface Props {
  doc: DocumentWithCount;
  plan: Plan;
  defaultTemplate: string;
  onClose: () => void;
}

export function ConvertModal({ doc, plan, defaultTemplate, onClose }: Props) {
  const planInfo = PLAN_LIMITS[plan];
  const maxSlides = planInfo.maxSlides;

  const [slideCount, setSlideCount] = useState(Math.min(maxSlides, 5));
  const [template, setTemplate] = useState(defaultTemplate);
  const overlayRef = useRef<HTMLDivElement>(null);

  function handleOverlayClick(e: React.MouseEvent) {
    if (e.target === overlayRef.current) onClose();
  }

  return (
    <div
      ref={overlayRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 backdrop-blur-sm"
    >
      <div className="w-full max-w-lg rounded-2xl border border-border-soft bg-surface-1 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-soft px-5 py-4">
          <div>
            <div className="text-[15px] font-bold text-text-strong">Convert to Presentation</div>
            <div className="mt-0.5 max-w-xs truncate text-[12px] text-text-muted">{doc.name}</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-3 hover:text-text-strong"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form action={convertDocument} onSubmit={onClose}>
          <input type="hidden" name="documentId" value={doc.id} />
          <input type="hidden" name="template" value={template} />
          <input type="hidden" name="slideCount" value={slideCount} />

          <div className="px-5 py-4 space-y-5">
            {/* Slide count */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[13px] font-semibold text-text-strong">
                  Number of slides
                </label>
                <span className="text-[13px] font-bold text-brand">{slideCount}</span>
              </div>
              <input
                type="range"
                min={1}
                max={maxSlides}
                value={slideCount}
                onChange={(e) => setSlideCount(Number(e.target.value))}
                className="w-full accent-brand"
              />
              <div className="mt-1 flex justify-between text-[11px] text-text-muted">
                <span>1</span>
                <span className="flex items-center gap-1">
                  {maxSlides} max
                  <span className="rounded bg-brand-tint px-1.5 py-px text-[10px] font-semibold text-brand capitalize">
                    {planInfo.label}
                  </span>
                </span>
              </div>
              {plan === "free" && (
                <p className="mt-1.5 text-[11px] text-text-muted">
                  Upgrade to Pro or Team to generate more slides per deck.
                </p>
              )}
            </div>

            {/* Theme picker */}
            <div>
              <div className="mb-2.5 text-[13px] font-semibold text-text-strong">Theme</div>
              <div className="grid grid-cols-3 gap-2">
                {TEMPLATES.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTemplate(t.id)}
                    className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                      template === t.id
                        ? "border-brand shadow-[0_0_0_3px_var(--color-brand-tint)]"
                        : "border-border-soft hover:border-border-mid"
                    }`}
                  >
                    {/* Color preview */}
                    <div
                      className="h-10 w-full"
                      style={{ background: t.bg }}
                    >
                      <div className="flex h-full flex-col justify-center gap-1 px-2.5">
                        <div
                          className="h-1.5 w-3/4 rounded-full"
                          style={{ background: t.titleColor, opacity: 0.9 }}
                        />
                        <div
                          className="h-1 w-1/2 rounded-full"
                          style={{ background: t.bodyColor }}
                        />
                      </div>
                    </div>
                    <div className="bg-surface-1 px-2 py-1.5 text-left">
                      <div className="text-[11px] font-semibold text-text-strong">{t.name}</div>
                      <div className="text-[10px] text-text-muted">{t.description}</div>
                    </div>
                    {template === t.id && (
                      <span className="absolute right-1.5 top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand text-white">
                        <svg viewBox="0 0 10 10" className="h-2.5 w-2.5 fill-none stroke-white stroke-2">
                          <polyline points="1.5,5 4,7.5 8.5,2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 border-t border-border-soft px-5 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border-mid px-4 py-2 text-[13px] font-semibold text-text-muted transition-colors hover:bg-surface-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Generate Presentation
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
