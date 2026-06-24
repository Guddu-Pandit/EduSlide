"use client";

import { useState } from "react";
import { Ban, Plus, Search, Trash2, UserPlus, X } from "lucide-react";
import { useAdminToast } from "@/app/components/admin/AdminToast";

type UserEntry = {
  name: string;
  email: string;
  plan: "Free" | "Pro" | "Enterprise";
  pres: number;
  joined: string;
  status: "Active" | "Review" | "Suspended";
  initials: string;
  ibg: string;
  itc: string;
};

const INITIAL_USERS: UserEntry[] = [
  { name: "Guddu Kumar", email: "guddu@school.edu", plan: "Pro", pres: 24, joined: "Mar 2025", status: "Active", initials: "GK", ibg: "#eef3ff", itc: "#3b6ef8" },
  { name: "Priya Sharma", email: "priya@edu.in", plan: "Free", pres: 3, joined: "Today", status: "Active", initials: "PS", ibg: "#eef3ff", itc: "#3b6ef8" },
  { name: "Rahul Mehra", email: "rahul@iit.ac.in", plan: "Pro", pres: 17, joined: "Today", status: "Active", initials: "RM", ibg: "#fef3c7", itc: "#92400e" },
  { name: "Anjali Thakur", email: "anjali@college.edu", plan: "Free", pres: 6, joined: "Yesterday", status: "Review", initials: "AT", ibg: "#fff1f1", itc: "#dc2626" },
  { name: "Vikram Nair", email: "vikram@nit.ac.in", plan: "Enterprise", pres: 41, joined: "Jan 2025", status: "Active", initials: "VN", ibg: "#f3e8ff", itc: "#7c3aed" },
  { name: "Sunita Rao", email: "sunita@school.edu", plan: "Pro", pres: 9, joined: "Feb 2025", status: "Suspended", initials: "SR", ibg: "#f0f1f5", itc: "#9ca3af" },
];

const PLAN_BADGE: Record<string, string> = {
  Free: "bg-[#f0f1f5] text-[#9ca3af]",
  Pro: "bg-[#eef3ff] text-[#3b6ef8]",
  Enterprise: "bg-[#edfaf3] text-[#16a34a]",
};
const STATUS_BADGE: Record<string, string> = {
  Active: "bg-[#edfaf3] text-[#16a34a]",
  Review: "bg-[#fff8e7] text-[#ca8a04]",
  Suspended: "bg-[#fff1f1] text-[#dc2626]",
};

export default function UsersPage() {
  const toast = useAdminToast();
  const [users, setUsers] = useState<UserEntry[]>(INITIAL_USERS);
  const [query, setQuery] = useState("");
  const [planFilter, setPlanFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPlan, setNewPlan] = useState<"Free" | "Pro" | "Enterprise">("Free");
  const [newStatus, setNewStatus] = useState<"Active" | "Suspended">("Active");

  const filtered = users.filter((u) => {
    const matchQ = !query || u.name.toLowerCase().includes(query.toLowerCase()) || u.email.toLowerCase().includes(query.toLowerCase());
    const matchP = !planFilter || u.plan === planFilter;
    return matchQ && matchP;
  });

  function addUser() {
    if (!newName.trim() || !newEmail.trim()) { toast("Please fill all fields"); return; }
    const initials = newName.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    setUsers([{ name: newName, email: newEmail, plan: newPlan, pres: 0, joined: "Just now", status: newStatus, initials, ibg: "#eef3ff", itc: "#3b6ef8" }, ...users]);
    setNewName(""); setNewEmail(""); setNewPlan("Free"); setNewStatus("Active");
    setShowModal(false);
    toast(`${newName} added successfully`);
  }

  function deleteUser(email: string, name: string) {
    setUsers((prev) => prev.filter((u) => u.email !== email));
    toast(`${name} removed`);
  }

  const inputCls = "h-9 w-full rounded-lg border border-[#e4e6eb] bg-[#f7f8fa] px-3 text-[13px] text-[#111827] outline-none focus:border-[#3b6ef8] focus:ring-2 focus:ring-[#eef3ff]";

  return (
    <div className="p-6">
      <div className="mb-1 text-[17px] font-semibold text-[#111827]">User Management</div>
      <div className="mb-5 text-[12px] text-[#9ca3af]">View, edit, suspend, or delete platform users</div>

      {/* Search bar */}
      <div className="mb-4 flex items-center gap-2.5">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[#9ca3af]" />
          <input
            className={`${inputCls} pl-8`}
            placeholder="Search by name, email or plan…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <select
          value={planFilter}
          onChange={(e) => setPlanFilter(e.target.value)}
          className="h-9 rounded-lg border border-[#e4e6eb] bg-white px-2.5 text-[13px] text-[#4b5563] outline-none"
        >
          <option value="">All plans</option>
          <option value="Free">Free</option>
          <option value="Pro">Pro</option>
          <option value="Enterprise">Enterprise</option>
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
      <div className="overflow-hidden rounded-xl border border-[#e4e6eb] bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="border-b border-[#e4e6eb]">
                {["User", "Email", "Plan", "Presentations", "Joined", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] font-semibold uppercase tracking-[0.6px] text-[#9ca3af]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u) => (
                <tr key={u.email} className="border-b border-[#edeef2] last:border-none hover:bg-[#f7f8fa]">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold" style={{ background: u.ibg, color: u.itc }}>{u.initials}</div>
                      <span className="font-medium text-[#111827]">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[#4b5563]">{u.email}</td>
                  <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${PLAN_BADGE[u.plan]}`}>{u.plan}</span></td>
                  <td className="px-4 py-3 text-[#4b5563]">{u.pres}</td>
                  <td className="px-4 py-3 text-[#4b5563]">{u.joined}</td>
                  <td className="px-4 py-3"><span className={`rounded px-2 py-0.5 text-[10px] font-semibold ${STATUS_BADGE[u.status]}`}>{u.status}</span></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => toast(`${u.name} suspended`)} className="flex h-7 w-7 items-center justify-center rounded text-[#4b5563] hover:bg-[#f0f1f5]" title="Suspend">
                        <Ban className="h-3.5 w-3.5" />
                      </button>
                      <button onClick={() => deleteUser(u.email, u.name)} className="flex h-7 w-7 items-center justify-center rounded text-[#4b5563] hover:bg-[#fff1f1] hover:text-[#dc2626]" title="Delete">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-2 text-[12px] text-[#9ca3af]">Showing {filtered.length} of {users.length} users</div>

      {/* Add User Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/35">
          <div className="w-[420px] max-w-[90vw] rounded-xl bg-white p-6 shadow-2xl">
            <div className="mb-1 flex items-center justify-between">
              <div className="text-[15px] font-semibold text-[#111827]">Add new user</div>
              <button onClick={() => setShowModal(false)} className="flex h-7 w-7 items-center justify-center rounded text-[#9ca3af] hover:bg-[#f0f1f5]">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mb-4 text-[12px] text-[#9ca3af]">Create a user account directly from admin</div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#4b5563]">Full name</label>
                <input className={inputCls} placeholder="e.g. Priya Sharma" value={newName} onChange={(e) => setNewName(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#4b5563]">Email</label>
                <input className={inputCls} placeholder="user@school.edu" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#4b5563]">Plan</label>
                <select className={`${inputCls} cursor-pointer`} value={newPlan} onChange={(e) => setNewPlan(e.target.value as "Free" | "Pro" | "Enterprise")}>
                  <option>Free</option><option>Pro</option><option>Enterprise</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-[12px] font-medium text-[#4b5563]">Status</label>
                <select className={`${inputCls} cursor-pointer`} value={newStatus} onChange={(e) => setNewStatus(e.target.value as "Active" | "Suspended")}>
                  <option>Active</option><option>Suspended</option>
                </select>
              </div>
            </div>
            <div className="mt-5 flex justify-end gap-2.5">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-[#e4e6eb] px-4 py-2 text-[13px] font-medium text-[#4b5563] hover:bg-[#f7f8fa]">Cancel</button>
              <button
                onClick={addUser}
                className="flex items-center gap-1.5 rounded-lg px-4 py-2 text-[13px] font-medium text-white"
                style={{ background: "#3b6ef8" }}
              >
                <UserPlus className="h-4 w-4" /> Add user
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
