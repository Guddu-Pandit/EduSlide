export default function StatCard({
  label,
  icon: Icon,
  iconClassName,
  value,
  sub,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  iconClassName?: string;
  value: string | number;
  sub: string;
}) {
  return (
    <div className="rounded-xl border border-border-soft bg-surface-1 px-5 py-[18px]">
      <div className="mb-2 flex items-center gap-1.5 text-xs text-text-muted">
        <Icon className={`h-[15px] w-[15px] ${iconClassName ?? "text-brand"}`} />
        {label}
      </div>
      <div className="mb-1 text-[26px] font-bold tracking-tight text-text-strong">{value}</div>
      <div className="text-xs text-text-muted">{sub}</div>
    </div>
  );
}
