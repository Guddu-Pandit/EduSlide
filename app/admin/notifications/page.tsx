import { FileText, Monitor, UserPlus } from "lucide-react";
import { getRecentActivity } from "@/app/lib/admin/queries";
import { formatRelativeTime } from "@/app/lib/dashboard/format";

const iconConfig = {
  signup: { Icon: UserPlus, bg: "#edfaf3", color: "#16a34a" },
  document: { Icon: FileText, bg: "#eef3ff", color: "#3b6ef8" },
  presentation_done: { Icon: Monitor, bg: "#edfaf3", color: "#16a34a" },
  presentation_error: { Icon: Monitor, bg: "#fff1f1", color: "#dc2626" },
};

export default async function NotificationsPage() {
  const activity = await getRecentActivity();

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">Notifications</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">
        Platform alerts, user activity, and system messages
      </div>

      <div className="rounded-xl border border-[#e4e6eb] bg-white">
        <div className="flex items-center justify-between border-b border-[#e4e6eb] px-4 py-3">
          <div className="text-[13px] font-semibold text-[#111827]">Recent Activity</div>
          <span className="rounded-full bg-[#eef3ff] px-2.5 py-0.5 text-[11px] font-semibold text-[#3b6ef8]">
            {activity.length} events
          </span>
        </div>

        {activity.length === 0 ? (
          <div className="px-4 py-10 text-center text-[13px] text-[#9ca3af]">
            No recent activity
          </div>
        ) : (
          <div className="divide-y divide-[#edeef2]">
            {activity.map((item, i) => {
              const { Icon, bg, color } = iconConfig[item.kind];
              return (
                <div
                  key={i}
                  className="flex cursor-pointer items-start gap-3 px-4 py-3 hover:bg-[#f7f8fa]"
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
                    style={{ background: bg, color }}
                  >
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[13px] font-medium text-[#111827]">{item.label}</div>
                    <div className="mt-0.5 text-[11px] text-[#9ca3af]">
                      {new Date(item.at).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="text-[11px] text-[#9ca3af]">
                    {formatRelativeTime(item.at)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
