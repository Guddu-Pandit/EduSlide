import { createAdminClient } from "@/app/lib/supabase/admin";
import { formatRelativeTime } from "@/app/lib/dashboard/format";

async function getErrorPresentations() {
  const admin = createAdminClient();
  const { data } = await admin
    .from("presentations")
    .select("id, name, created_at, error_message, user_id")
    .eq("status", "error")
    .order("created_at", { ascending: false })
    .limit(50);

  if (!data || data.length === 0) return [];

  const userIds = [...new Set(data.map((p) => p.user_id))];
  const { data: profiles } = await admin
    .from("profiles")
    .select("id, full_name")
    .in("id", userIds);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p.full_name]));

  return data.map((p) => ({
    id: p.id,
    name: p.name,
    created_at: p.created_at,
    error_message: p.error_message ?? "Unknown error",
    owner: profileMap.get(p.user_id) ?? p.user_id,
  }));
}

export default async function ReportsPage() {
  const errors = await getErrorPresentations();

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-admin-text">Reports</div>
      <div className="mb-5 text-[12px] text-admin-muted">Failed presentations and platform error logs</div>

      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
        <div className="border-b border-admin-border px-4 py-3">
          <div className="text-[13px] font-semibold text-admin-text">
            Failed Presentations ({errors.length})
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-admin-border">
                {["Presentation", "Owner", "Error", "Date"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-admin-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {errors.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-4 py-10 text-center text-[13px] text-admin-muted">
                    No failed presentations — everything looks good
                  </td>
                </tr>
              ) : (
                errors.map((e) => (
                  <tr key={e.id} className="border-b border-admin-divider last:border-none hover:bg-admin-hover">
                    <td className="px-4 py-3 font-medium text-admin-text">{e.name}</td>
                    <td className="px-4 py-3 text-admin-body">{e.owner}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-[#fff1f1] px-2 py-0.5 text-[11px] text-[#dc2626]">{e.error_message}</span>
                    </td>
                    <td className="px-4 py-3 text-admin-body">{formatRelativeTime(e.created_at)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
