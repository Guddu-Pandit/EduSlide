"use client";

import { useRef, useState } from "react";
import { CloudUpload, Loader2, RefreshCw, Sparkles, Upload, X } from "lucide-react";
import { uploadDocument } from "@/app/lib/dashboard/actions";
import { TEMPLATES } from "@/app/lib/dashboard/templates";
import { PLAN_LIMITS, type Plan } from "@/app/lib/dashboard/plan";
import FileIcon from "@/app/components/dashboard/FileIcon";
import type { DocumentFileType } from "@/app/lib/dashboard/types";

const MAX_FILE_BYTES = 25 * 1024 * 1024;

const EXT_TO_TYPE: Record<string, DocumentFileType> = {
  pdf: "pdf",
  docx: "docx",
  txt: "txt",
};

const UPLOAD_STAGES = [
  { pct: 25, label: "Uploading file…" },
  { pct: 60, label: "Sending to secure storage…" },
  { pct: 90, label: "Saving document record…" },
];

function formatSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function UploadForm({
  defaultTemplate,
  plan,
}: {
  defaultTemplate: string;
  plan: Plan;
}) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<{ name: string; size: number; type: DocumentFileType } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [template, setTemplate] = useState(
    TEMPLATES.some((t) => t.id === defaultTemplate) ? defaultTemplate : TEMPLATES[0].id,
  );
  const [autoGenerate, setAutoGenerate] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const maxSlides = PLAN_LIMITS[plan].maxSlides;
  const planLabel = PLAN_LIMITS[plan].label;

  /** Validates and stages a picked/dropped file — nothing uploads until the user hits the submit button. */
  function stageFile(picked: File | undefined) {
    if (!picked) return;

    const ext = picked.name.split(".").pop()?.toLowerCase() ?? "";
    const type = EXT_TO_TYPE[ext];
    if (!type) {
      setError(`".${ext}" files aren't supported — use PDF, DOCX, or TXT`);
      clearFile();
      return;
    }
    if (picked.size > MAX_FILE_BYTES) {
      setError(`This file is ${formatSize(picked.size)} — the limit is 25 MB`);
      clearFile();
      return;
    }

    setError(null);
    setFile({ name: picked.name, size: picked.size, type });
  }

  function clearFile() {
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleSubmit() {
    // The server action does the real work in one round trip; these staged
    // updates keep the bar honest-ish, then hold on the final label (which
    // covers AI generation — the long part) until the redirect lands.
    setSubmitting(true);
    setProgress(8);
    setStatus("Preparing upload…");

    UPLOAD_STAGES.forEach((stage, i) => {
      setTimeout(() => {
        setProgress(stage.pct);
        setStatus(stage.label);
      }, (i + 1) * 500);
    });

    if (autoGenerate) {
      setTimeout(() => {
        setStatus("Generating slides with AI — this can take up to a minute…");
      }, (UPLOAD_STAGES.length + 1) * 500);
    }
  }

  return (
    <form
      action={uploadDocument}
      onSubmit={handleSubmit}
      className="grid grid-cols-2 items-start gap-4 max-[900px]:grid-cols-1"
    >
      <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
        <div className="mb-4 text-sm font-bold text-text-strong">Upload a document</div>

        {/* Stays mounted across every state below — moving it inside a
            conditional unmounts it (and the File it holds), so the form
            submission would fire with no file in the FormData. */}
        <input
          ref={fileInputRef}
          type="file"
          name="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={(e) => stageFile(e.target.files?.[0])}
        />

        {submitting ? (
          <div className="rounded-lg bg-surface-3 p-4">
            <div className="mb-2 flex justify-between gap-3 text-[13px] font-medium text-text-strong">
              <span className="truncate">{file?.name}</span>
              <span className="flex-shrink-0 font-bold text-brand">{progress}%</span>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-border-soft">
              <div
                className={`h-[5px] rounded-full bg-brand transition-all duration-500 ${progress >= 90 ? "animate-pulse" : ""}`}
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1.5 flex items-center gap-1.5 text-xs text-text-muted">
              <Loader2 className="h-3 w-3 flex-shrink-0 animate-spin" />
              {status}
            </div>
          </div>
        ) : !file ? (
          <>
            <div
              role="button"
              tabIndex={0}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragOver(true);
              }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const dropped = e.dataTransfer.files?.[0];
                // A dropped file never lands in the <input>'s own files list —
                // assign it explicitly so the form submission (which reads
                // from the input) actually includes it.
                if (dropped && fileInputRef.current) {
                  const dt = new DataTransfer();
                  dt.items.add(dropped);
                  fileInputRef.current.files = dt.files;
                }
                stageFile(dropped);
              }}
              className={`cursor-pointer rounded-xl border-[1.5px] border-dashed px-5 py-7 text-center transition-colors sm:px-10 sm:py-9 ${
                dragOver ? "border-brand bg-brand-tint" : "border-border-mid hover:border-brand hover:bg-brand-tint"
              }`}
            >
              <CloudUpload className="mx-auto mb-3 h-9 w-9 text-brand" />
              <div className="mb-1.5 text-[15px] font-semibold text-text-strong">
                Drop your file here or click to browse
              </div>
              <div className="text-[13px] text-text-muted">Supports PDF, DOCX, TXT · Max 25 MB</div>
            </div>
            {error && (
              <p role="alert" className="mt-3 rounded-lg bg-red-50 px-3 py-2 text-[13px] font-medium text-red-700">
                {error}
              </p>
            )}
          </>
        ) : (
          <div className="rounded-lg border border-border-soft bg-surface-3 p-4">
            <div className="flex items-center gap-3">
              <FileIcon type={file.type} />
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-text-strong">{file.name}</div>
                <div className="text-xs text-text-muted">
                  {file.type.toUpperCase()} · {formatSize(file.size)}
                </div>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-1 hover:text-text-strong"
                title="Choose a different file"
              >
                <RefreshCw className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={clearFile}
                className="flex h-7 w-7 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-surface-1 hover:text-text-strong"
                title="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-3 border-t border-border-soft pt-3 text-xs leading-relaxed text-text-muted">
              Review the options, then hit{" "}
              <span className="font-semibold text-text-strong">
                {autoGenerate ? "Upload & Generate" : "Upload"}
              </span>{" "}
              when you&apos;re ready.
            </p>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
        <div className="mb-4 text-sm font-bold text-text-strong">Options</div>

        <input type="hidden" name="template" value={template} />
        <div className="pb-4">
          <h4 className="mb-0.5 text-sm font-semibold text-text-strong">Template</h4>
          <p className="mb-2.5 text-[13px] leading-relaxed text-text-muted">
            Choose the visual style for your presentation
          </p>
          <div className="grid grid-cols-3 gap-2 max-[420px]:grid-cols-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                disabled={submitting}
                onClick={() => setTemplate(t.id)}
                className={`group relative overflow-hidden rounded-xl border-2 transition-all ${
                  template === t.id
                    ? "border-brand shadow-[0_0_0_3px_var(--color-brand-tint)]"
                    : "border-border-soft hover:border-border-mid"
                }`}
              >
                <div className="h-9 w-full" style={{ background: t.bg }}>
                  <div className="flex h-full flex-col justify-center gap-1 px-2.5">
                    <div className="h-1.5 w-3/4 rounded-full" style={{ background: t.titleColor, opacity: 0.9 }} />
                    <div className="h-1 w-1/2 rounded-full" style={{ background: t.bodyColor }} />
                  </div>
                </div>
                <div className="bg-surface-1 px-2 py-1.5 text-left">
                  <div className="text-[11px] font-semibold text-text-strong">{t.name}</div>
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

        <div className="flex items-start justify-between gap-5 border-t border-border-soft py-3.5 max-[420px]:flex-col max-[420px]:items-stretch max-[420px]:gap-2">
          <div>
            <h4 className="mb-0.5 text-sm font-semibold text-text-strong">Auto-generate on upload</h4>
            <p className="text-[13px] leading-relaxed text-text-muted">
              Creates a presentation with up to {maxSlides} slides ({planLabel} plan) right after upload
            </p>
          </div>
          <label className="relative inline-flex h-[22px] w-10 flex-shrink-0 cursor-pointer items-center">
            <input
              type="checkbox"
              name="autoGenerate"
              className="peer sr-only"
              checked={autoGenerate}
              onChange={(e) => setAutoGenerate(e.target.checked)}
              disabled={submitting}
            />
            <span className="absolute inset-0 rounded-full bg-border-mid transition-colors peer-checked:bg-brand" />
            <span className="absolute left-[3px] h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-[18px]" />
          </label>
        </div>

        <button
          type="submit"
          disabled={!file || submitting}
          className="mt-1 flex w-full items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {submitting ? (
            <>
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              {autoGenerate ? "Uploading & generating…" : "Uploading…"}
            </>
          ) : autoGenerate ? (
            <>
              <Sparkles className="h-3.5 w-3.5" />
              Upload &amp; Generate
            </>
          ) : (
            <>
              <Upload className="h-3.5 w-3.5" />
              Upload
            </>
          )}
        </button>
        {!file && !submitting && (
          <p className="mt-2 text-center text-xs text-text-muted">Choose a file first</p>
        )}
      </div>
    </form>
  );
}
