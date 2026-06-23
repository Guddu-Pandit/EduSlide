"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";
import { getPresentation } from "@/app/lib/dashboard/queries";
import { useDashboardQuery } from "@/app/lib/dashboard/useDashboardQuery";
import { formatDate } from "@/app/lib/dashboard/format";
import { TEMPLATES, templateName } from "@/app/lib/dashboard/templates";
import StatusPill from "@/app/components/dashboard/StatusPill";
import { CardSkeleton } from "@/app/components/dashboard/Skeleton";

export default function PresentationDetail({ id }: { id: string }) {
  const { data: presentation, loading, error } = useDashboardQuery(
    (supabase, userId) => getPresentation(supabase, userId, id),
    [id],
  );

  if (loading) {
    return (
      <div className="px-4 py-5 md:px-7 md:py-6">
        <CardSkeleton className="h-64" />
      </div>
    );
  }

  if (error || !presentation) {
    return (
      <div className="px-4 py-5 md:px-7 md:py-6">
        <Link href="/dashboard/presentations" className="text-sm font-medium text-brand hover:text-brand-hover">
          ← Back to presentations
        </Link>
        <p className="mt-4 text-sm text-text-muted">{error ?? "Presentation not found"}</p>
      </div>
    );
  }

  const template = TEMPLATES.find((t) => t.id === presentation.template) ?? TEMPLATES[0];

  return (
    <div className="px-4 py-5 md:px-7 md:py-6">
      <Link
        href="/dashboard/presentations"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand hover:text-brand-hover"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to presentations
      </Link>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="break-words text-lg font-bold text-text-strong">{presentation.name}</h1>
          <p className="text-[13px] text-text-muted">
            {templateName(presentation.template)} · {formatDate(presentation.created_at)}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {presentation.status === "done" && (
            <a
              href={`/dashboard/presentations/${presentation.id}/export`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border-soft px-3 py-1.5 text-[13px] font-medium text-text-strong hover:bg-surface-1"
            >
              <Download className="h-3.5 w-3.5" /> <span className="max-[420px]:hidden">Download .pptx</span>
              <span className="hidden max-[420px]:inline">.pptx</span>
            </a>
          )}
          <StatusPill status={presentation.status} />
        </div>
      </div>

      {presentation.status === "error" && (
        <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {presentation.error_message ?? "Generation failed"}
        </div>
      )}

      {presentation.status !== "done" || !presentation.content ? (
        <div className="rounded-xl border border-border-soft bg-surface-1 p-10 text-center text-sm text-text-muted">
          {presentation.status === "generating" ? "Generating slides…" : "No slides generated yet"}
        </div>
      ) : (
        <div className="grid grid-cols-2 items-start gap-4 max-[900px]:grid-cols-1">
          {presentation.content.slides.map((slide, i) => {
            const slideType = slide.slideType ?? "content";
            const isTitleSlide = slideType === "title";

            return (
              <div
                key={i}
                className="overflow-hidden rounded-xl border border-border-soft shadow-sm"
                style={{ backgroundColor: template.bg }}
              >
                {isTitleSlide ? (
                  <div className="relative aspect-video">
                    {slide.imageUrl && (
                      <>
                        <img src={slide.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
                        <div
                          className="absolute inset-0"
                          style={{ background: "linear-gradient(180deg, rgba(0,0,0,.1), rgba(0,0,0,.7))" }}
                        />
                      </>
                    )}
                    <div className="relative flex h-full flex-col justify-end px-4 py-4 sm:px-6 sm:py-5">
                      <div
                        className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: slide.imageUrl ? "rgba(255,255,255,.7)" : template.accentColor }}
                      >
                        Title slide
                      </div>
                      <h3
                        className="text-lg font-bold sm:text-xl"
                        style={{ color: slide.imageUrl ? "#ffffff" : template.titleColor }}
                      >
                        {slide.title}
                      </h3>
                    </div>
                  </div>
                ) : (
                  <>
                    {slide.imageUrl && (
                      <img src={slide.imageUrl} alt="" className="h-28 w-full object-cover" />
                    )}
                    <div className="px-4 py-4 sm:px-6 sm:py-5">
                      <div
                        className="mb-1.5 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide"
                        style={{ color: template.accentColor }}
                      >
                        <span>Slide {i + 1}</span>
                        <span className="opacity-50">·</span>
                        <span className="opacity-70">{slideType}</span>
                      </div>
                      <h3 className="mb-3 text-base font-bold" style={{ color: template.titleColor }}>
                        {slide.title}
                      </h3>
                      {slide.bullets.length > 0 && (
                        <ul className="space-y-1.5 text-[13px]" style={{ color: template.bodyColor }}>
                          {slide.bullets.map((bullet, j) => (
                            <li key={j} className="flex gap-2">
                              <span style={{ color: template.accentColor }}>•</span>
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </>
                )}
                {slide.notes && (
                  <div className="border-t border-white/10 bg-black/10 px-4 py-2.5 text-[12px] italic sm:px-6" style={{ color: template.bodyColor }}>
                    Notes: {slide.notes}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
