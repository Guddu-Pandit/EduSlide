export function StatGridSkeleton() {
  return (
    <div className="mb-6 grid grid-cols-4 gap-3.5 max-[900px]:grid-cols-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-[92px] animate-pulse rounded-xl border border-border-soft bg-surface-1" />
      ))}
    </div>
  );
}

export function CardSkeleton({ className = "h-72" }: { className?: string }) {
  return <div className={`animate-pulse rounded-xl border border-border-soft bg-surface-1 ${className}`} />;
}

export function TwoColSkeleton() {
  return (
    <div className="mb-4 grid grid-cols-2 gap-4 max-[900px]:grid-cols-1">
      <CardSkeleton />
      <CardSkeleton />
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl border border-border-soft bg-surface-1 p-5">
      <div className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-10 animate-pulse rounded-lg bg-surface-3" />
        ))}
      </div>
    </div>
  );
}
