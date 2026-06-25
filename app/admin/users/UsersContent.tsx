"use client";

import { useState, useTransition } from "react";
import { Ban, Plus, Search, Trash2, UserPlus, X } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";
import { adminDeleteUser, adminCreateUser } from "@/app/lib/admin/actions";
import type { AdminUser } from "@/app/lib/admin/queries";

const PLAN_BADGE: Record<string, string> = {
  free: "bg-[#f0f1f5] text-[#9ca3af]",
  pro: "bg-[#eef3ff] text-[#3b6ef8]",
  team: "bg-[#edfaf3] text-[#16a34a]",
  admin: "bg-[#f3e8ff] text-[#7c3aed]",
};

function getInitials(name: string | null, email: string) {
  const source = name || email;
  return source.split(/[\s@.]+/).filter(Boolean).slice(0, 2).map((s) => s[0]?.toUpperCase()).join("");
}

const inputCls =
  "h-9 w-full rounded-lg border border-admin-border bg-admin-input px-3 text-[13px] text-admin-text outline-none focus:border-[#3b6ef8] focus:ring-2 focus:ring-[#eef3ff]";

export default function UsersContent({ users }: { users: AdminUser[] }) {
  const toast = useAdminToast();
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isPending, startTransition] = useTransition();

  const filtered = users.filter((u) => {
    const matchQ =
      !query ||
      (u.full_name ?? "").toLowerCase().includes(query.toLowerCase()) ||
      u.email.toLowerCase().includes(query.toLowerCase());
    const matchP = !planFilter || u.plan === planFilter;
    return matchQ && matchP;
  });

  function handleDelete(user: AdminUser) {
    if (!confirm(`Delete ${user.email}? This cannot be undone.`)) return;
    startTransition(async () => {
      const { error } = await adminDeleteUser(user.id);
      if (error) toast(`Error: ${error}`);
      else toast(`${user.email} deleted`);
    });
  }

  async function handleAddUser(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const { error } = await adminCreateUser(fd);
      if (error) toast(`Error: ${error}`);
      else { toast(`User ${fd.get("email")} created`); setShowModal(false); }
    });
  }

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-admin-text">User Management</div>
      <div className="mb-5 text-[12px] text-admin-muted">View, edit, suspend, or delete platform users</div>

      {/* Search bar */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-admin-muted" />
          <input
            className={`${inputCls} pl-8`}
            placeholder="Search by name or email…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="h-9 rounded-lg border border-admin-border bg-admin-surface px-2.5 text-[13px] text-admin-body outline-none"
        >
          <option value="">All plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="team">Team</option>
        </select>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-medium text-white"
          style={{ background: "#3b6ef8" }}
        >
          <Plus className="h-4 w-4" /> Add user
        </button>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-admin-border bg-admin-surface">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-admin-border">
                {["User", "Email", "Plan", "Role", "Presentations", "Joined", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-admin-muted">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => {
                const initials = getInitials(u.full_name, u.email);
                return (
                  <tr key={u.id} className="border-b border-admin-divider last:border-none hover:bg-admin-hover">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div
                          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold"
                          style={{ background: "#eef3ff", color: "#3b6ef8" }}
                        >
                          {initials || "?"}
                        </div>
                        <span className="font-medium text-admin-text">{u.full_name || "—"}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-admin-body">{u.email}</td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${PLAN_BADGE[u.plan] ?? PLAN_BADGE.free}`}>
                        {u.plan}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${u.role === "admin" ? "bg-[#f3e8ff] text-[#7c3aed]" : "bg-[#f0f1f5] text-[#9ca3af]"}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-admin-body">{u.presentations_count}</td>
                    <td className="px-4 py-3 text-admin-body">
                      {new Date(u.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => toast(`${u.email} — suspend not implemented`)}
                          className="flex h-7 w-7 items-center justify-center rounded text-admin-body hover:bg-admin-input"
                          title="Suspend"
                        >
                          <Ban className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(u)}
                          disabled={isPending}
                          className="flex h-7 w-7 items-center justify-center rounded text-admin-body hover:bg-[#fff1f1] hover:text-[#dc2626] disabled:opacity-50"
                          title="Delete"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-2 text-[12px] text-admin-muted">
        Showing {filtered.length} of {users.length} users
      </div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
          <div className="w-[420px] max-w-[90vw] rounded-xl border border-admin-border bg-admin-surface p-6 shadow-2xl">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-[15px] font-semibold text-admin-text">Add new user</div>
              <button onClick={() => setShowModal(false)} className="flex h-7 w-7 items-center justify-center rounded text-admin-muted hover:bg-admin-input">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4 text-[12px] text-admin-muted">Create a user account directly from admin</div>
            <form onSubmit={handleAddUser} className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-admin-body">Full name</label>
                <input name="full_name" className={inputCls} placeholder="e.g. Priya Sharma" />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-admin-body">
                  Email <span className="text-[#dc2626]">*</span>
                </label>
                <input name="email" type="email" required className={inputCls} placeholder="user@school.edu" />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-admin-body">
                  Password <span className="text-[#dc2626]">*</span>
                </label>
                <input name="password" type="password" required minLength={8} className={inputCls} placeholder="Min 8 characters" />
              </div>
              <div className="col-span-2 mt-3 flex justify-end gap-2.5">
                <button type="button" onClick={() => setShowModal(false)} className="rounded-lg border border-admin-border px-4 py-2 text-[13px] font-medium text-admin-body hover:bg-admin-hover">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isPending}
                  className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium text-white disabled:opacity-60"
                  style={{ background: "#3b6ef8" }}
                >
                  <UserPlus className="h-4 w-4" />
                  {isPending ? "Creating…" : "Add user"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
