"use client";

import { useRef, useState } from "react";
import { CloudUpload } from "lucide-react";
import { uploadDocument } from "@/app/lib/dashboard/actions";
import { TEMPLATES } from "@/app/lib/dashboard/templates";

const STAGES = [
  { pct: 20, label: "Uploading file…" },
  { pct: 55, label: "Sending to secure storage…" },
  { pct: 80, label: "Saving document record…" },
];

export default function UploadForm({ defaultTemplate }: { defaultTemplate: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleFile(file: File | undefined) {
    if (!file) return;
    setFileName(file.name);
    setSubmitting(true);
    setProgress(0);
    setStatus("Preparing upload…");

    STAGES.forEach((stage, i) => {
      setTimeout(() => {
        setProgress(stage.pct);
        setStatus(stage.label);
      }, (i + 1) * 350);
    });

    setTimeout(() => formRef.current?.requestSubmit(), STAGES.length * 350 + 200);
  }

  return (
    <form ref={formRef} action={uploadDocument} className="grid grid-cols-2 items-start gap-4 max-[900px]:grid-cols-1">
      <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
        <div className="mb-4 text-sm font-bold text-text-strong">Upload a document</div>

        {!submitting ? (
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
              handleFile(e.dataTransfer.files?.[0]);
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
            <input
              ref={fileInputRef}
              type="file"
              name="file"
              accept=".pdf,.docx,.txt"
              className="hidden"
              onChange={(e) => handleFile(e.target.files?.[0])}
            />
          </div>
        ) : (
          <div className="rounded-lg bg-surface-3 p-4">
            <div className="mb-2 flex justify-between text-[13px] font-medium text-text-strong">
              <span>{fileName}</span>
              <span className="font-bold text-brand">{progress}%</span>
            </div>
            <div className="h-[5px] overflow-hidden rounded-full bg-border-soft">
              <div className="h-[5px] rounded-full bg-brand transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-1.5 text-xs text-text-muted">{status}</div>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border-soft bg-surface-1 p-5">
        <div className="mb-4 text-sm font-bold text-text-strong">Options</div>

        <div className="flex items-start justify-between gap-5 py-3.5 max-[420px]:flex-col max-[420px]:items-stretch max-[420px]:gap-2">
          <div>
            <h4 className="mb-0.5 text-sm font-semibold text-text-strong">Template</h4>
            <p className="text-[13px] leading-relaxed text-text-muted">Choose the visual style for your presentation</p>
          </div>
          <select
            name="template"
            defaultValue={defaultTemplate}
            className="w-44 max-w-full rounded-lg border border-border-mid bg-surface-1 px-3 py-2 text-[13px] text-text-strong focus:border-brand focus:outline-none max-[420px]:w-full"
          >
            {TEMPLATES.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-start justify-between gap-5 border-t border-border-soft py-3.5">
          <div>
            <h4 className="mb-0.5 text-sm font-semibold text-text-strong">Auto-generate on upload</h4>
            <p className="text-[13px] leading-relaxed text-text-muted">
              Queue generation immediately after the file finishes uploading
            </p>
          </div>
          <label className="relative inline-flex h-[22px] w-10 flex-shrink-0 cursor-pointer items-center">
            <input type="checkbox" name="autoGenerate" className="peer sr-only" />
            <span className="absolute inset-0 rounded-full bg-border-mid transition-colors peer-checked:bg-brand" />
            <span className="absolute left-[3px] h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-[18px]" />
          </label>
        </div>
      </div>
    </form>
  );
}
