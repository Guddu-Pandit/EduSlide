import { Building2, EyeOff, Lock, ShieldCheck } from "lucide-react";

const points = [
  {
    icon: Lock,
    title: "AWS KMS encryption",
    desc: "Every file encrypted at rest with AWS KMS. Each tenant holds a unique key — your files are unreadable to anyone else.",
  },
  {
    icon: Building2,
    title: "Per-tenant data isolation",
    desc: "Row-level security enforced at the database layer. Requests are scoped to your tenant ID on every query.",
  },
  {
    icon: ShieldCheck,
    title: "Zero-trust API layer",
    desc: "All API calls require short-lived tokens scoped to a single operation. No long-lived credentials, no lateral access.",
  },
  {
    icon: EyeOff,
    title: "No public internet exposure",
    desc: "Document pipelines run inside private subnets. Your content never touches the public internet in transit.",
  },
];

export default function Security() {
  return (
    <section id="security" className="bg-surface-3">
      <div className="mx-auto max-w-4xl px-6 py-18 sm:px-10">
        <div className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-brand">
          Security
        </div>
        <h2 className="mb-3.5 font-display text-[34px] font-bold leading-tight tracking-tight text-text-strong">
          Zero-trust by design
        </h2>
        <p className="max-w-md text-base leading-relaxed text-text-muted">
          Your documents are sensitive. EduSlide treats privacy as
          architecture, not a policy checkbox.
        </p>

        <div className="mt-11 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {points.map((point) => (
            <div
              key={point.title}
              className="flex gap-3.5 rounded-2xl border border-border-soft bg-surface-1 p-[22px]"
            >
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-[9px] bg-brand-tint text-brand">
                <point.icon className="h-[17px] w-[17px]" />
              </div>
              <div>
                <div className="mb-1 text-sm font-medium text-text-strong">
                  {point.title}
                </div>
                <p className="text-[13px] leading-relaxed text-text-muted">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
