import {
  Brain,
  FileOutput,
  History,
  LayoutGrid,
  SlidersHorizontal,
  Users,
} from "lucide-react";

const stats = [
  { num: "10×", label: "faster than manual" },
  { num: "50+", label: "slide layouts" },
  { num: "100%", label: "tenant isolated" },
  { num: "AES-256", label: "encryption at rest" },
];

const features = [
  {
    icon: Brain,
    title: "Adaptive AI structure",
    desc: "The AI reads your document's hierarchy and decides what becomes a title slide, a bullet list, a chart, or a diagram — not you.",
  },
  {
    icon: LayoutGrid,
    title: "Consistent design system",
    desc: "Every deck you produce follows the same visual grammar. Your institution's brand stays intact slide to slide.",
  },
  {
    icon: FileOutput,
    title: "Export anywhere",
    desc: "Download as PPTX or PDF, or push directly to Google Slides. Fully editable after export — no lock-in.",
  },
  {
    icon: History,
    title: "Version history",
    desc: "Every generation is saved. Revert to any prior version, compare outputs, and pick the best one — without re-uploading.",
  },
  {
    icon: SlidersHorizontal,
    title: "Slide-level editing",
    desc: "Don't like one slide? Regenerate it in isolation without touching the rest of your deck.",
  },
  {
    icon: Users,
    title: "Team workspaces",
    desc: "Faculty members get isolated workspaces. No one sees another user's documents or output — ever.",
  },
];

export default function Features() {
  return (
    <section
      id="features"
      className="border-y border-border-soft bg-surface-1"
    >
      <div className="mx-auto max-w-4xl px-6 py-18 sm:px-10">
        <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-brand">
          Features
        </div>
        <h2 className="mb-3.5 font-display text-[34px] font-bold leading-tight tracking-tight text-text-strong">
          Built for educators and learners
        </h2>
        <p className="max-w-md text-base leading-relaxed text-text-muted">
          Not another generic AI tool. EduSlide is designed around how
          teachers prepare and how students study.
        </p>

        <div className="mt-11 flex flex-col overflow-hidden rounded-xl border border-border-soft bg-surface-1 sm:flex-row">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`flex-1 px-6 py-5 text-center ${
                i !== stats.length - 1
                  ? "border-b border-border-soft sm:border-b-0 sm:border-r"
                  : ""
              }`}
            >
              <div className="font-display text-3xl font-bold tracking-tight text-brand">
                {stat.num}
              </div>
              <div className="mt-1 text-xs text-text-muted">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-2xl border border-border-soft bg-surface-2 p-[22px]"
            >
              <div className="mb-3.5 flex h-10 w-10 items-center justify-center rounded-[10px] border border-border-soft bg-surface-1 text-brand">
                <feature.icon className="h-[18px] w-[18px]" />
              </div>
              <div className="mb-1.5 text-[15px] font-medium text-text-strong">
                {feature.title}
              </div>
              <p className="text-[13px] leading-relaxed text-text-muted">
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
