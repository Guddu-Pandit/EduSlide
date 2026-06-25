import { createAdminClient } from "@/app/lib/supabase/admin";
import { formatBytes } from "@/app/lib/dashboard/format";

export type AdminUser = {
  id: string;
  email: string;
  full_name: string | null;
  role: string;
  plan: string;
  created_at: string;
  presentations_count: number;
};

export type AdminDoc = {
  id: string;
  name: string;
  file_type: string;
  size_bytes: number;
  created_at: string;
  user_id: string;
  owner_email: string;
  owner_name: string | null;
};

export type AdminPresentation = {
  id: string;
  name: string;
  status: string;
  slide_count: number;
  created_at: string;
  user_id: string;
  owner_email: string;
  owner_name: string | null;
  error_message: string | null;
};

export type AdminStats = {
  totalUsers: number;
  totalPresentations: number;
  totalDocuments: number;
  storageBytes: number;
  storageFormatted: string;
  freeUsers: number;
  proUsers: number;
  teamUsers: number;
  newUsersThisMonth: number;
};

export type ActivityItem = {
  kind: "signup" | "document" | "presentation_done" | "presentation_error";
  label: string;
  at: string;
};

async function buildUserMap() {
  const admin = createAdminClient();
  const [{ data: authData }, { data: profiles }] = await Promise.all([
    admin.auth.admin.listUsers({ page: 1, perPage: 1000 }),
    admin.from("profiles").select("id, full_name, role, plan, created_at"),
  ]);

  const profileMap = new Map((profiles ?? []).map((p) => [p.id, p]));
  const emailMap = new Map(
    (authData?.users ?? []).map((u) => [u.id, u.email ?? ""])
  );

  return { profileMap, emailMap, authUsers: authData?.users ?? [] };
}

export async function getAdminStats(): Promise<AdminStats> {
  const admin = createAdminClient();

  const [{ authUsers, profileMap }, { data: documents }, pres] =
    await Promise.all([
      buildUserMap(),
      admin.from("documents").select("size_bytes"),
      admin
        .from("presentations")
        .select("id", { count: "exact", head: true }),
    ]);

  const storageBytes =
    documents?.reduce((s, d) => s + (d.size_bytes ?? 0), 0) ?? 0;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const newUsersThisMonth = authUsers.filter(
    (u) => new Date(u.created_at) >= monthStart
  ).length;

  const plans = [...profileMap.values()];
  return {
    totalUsers: authUsers.length,
    totalPresentations: pres.count ?? 0,
    totalDocuments: documents?.length ?? 0,
    storageBytes,
    storageFormatted: formatBytes(storageBytes),
    freeUsers: plans.filter((p) => p.plan === "free").length,
    proUsers: plans.filter((p) => p.plan === "pro").length,
    teamUsers: plans.filter((p) => p.plan === "team").length,
    newUsersThisMonth,
  };
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const admin = createAdminClient();
  const { authUsers, profileMap, emailMap } = await buildUserMap();

  const { data: presCounts } = await admin
    .from("presentations")
    .select("user_id");
  const countMap = new Map<string, number>();
  for (const p of presCounts ?? []) {
    countMap.set(p.user_id, (countMap.get(p.user_id) ?? 0) + 1);
  }

  return authUsers.map((u) => ({
    id: u.id,
    email: emailMap.get(u.id) ?? u.email ?? "",
    full_name: profileMap.get(u.id)?.full_name ?? null,
    role: profileMap.get(u.id)?.role ?? "user",
    plan: profileMap.get(u.id)?.plan ?? "free",
    created_at: profileMap.get(u.id)?.created_at ?? u.created_at,
    presentations_count: countMap.get(u.id) ?? 0,
  }));
}

export async function getAdminDocuments(): Promise<AdminDoc[]> {
  const admin = createAdminClient();
  const [{ data: docs }, { authUsers, profileMap }] = await Promise.all([
    admin
      .from("documents")
      .select("*")
      .order("created_at", { ascending: false }),
    buildUserMap(),
  ]);

  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));

  return (docs ?? []).map((d) => ({
    id: d.id,
    name: d.name,
    file_type: d.file_type,
    size_bytes: d.size_bytes,
    created_at: d.created_at,
    user_id: d.user_id,
    owner_email: emailMap.get(d.user_id) ?? "—",
    owner_name: profileMap.get(d.user_id)?.full_name ?? null,
  }));
}

export async function getAdminPresentations(): Promise<AdminPresentation[]> {
  const admin = createAdminClient();
  const [{ data: pres }, { authUsers, profileMap }] = await Promise.all([
    admin
      .from("presentations")
      .select("id,name,status,slide_count,created_at,user_id,error_message")
      .order("created_at", { ascending: false }),
    buildUserMap(),
  ]);

  const emailMap = new Map(authUsers.map((u) => [u.id, u.email ?? ""]));

  return (pres ?? []).map((p) => ({
    id: p.id,
    name: p.name,
    status: p.status,
    slide_count: p.slide_count,
    created_at: p.created_at,
    user_id: p.user_id,
    owner_email: emailMap.get(p.user_id) ?? "—",
    owner_name: profileMap.get(p.user_id)?.full_name ?? null,
    error_message: p.error_message,
  }));
}

export async function getAnalyticsData() {
  const admin = createAdminClient();

  const [{ data: pres }, { data: docs }, { authUsers }] = await Promise.all([
    admin.from("presentations").select("status, created_at"),
    admin.from("documents").select("file_type, created_at"),
    buildUserMap(),
  ]);

  // Presentations by status
  const byStatus: Record<string, number> = {
    done: 0,
    generating: 0,
    queued: 0,
    error: 0,
  };
  for (const p of pres ?? []) byStatus[p.status] = (byStatus[p.status] ?? 0) + 1;

  // Docs by file type
  const byType: Record<string, number> = { pdf: 0, docx: 0, txt: 0 };
  for (const d of docs ?? []) byType[d.file_type] = (byType[d.file_type] ?? 0) + 1;

  // Monthly presentations — last 6 months
  const now = new Date();
  const months: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short" });
    const count = (pres ?? []).filter((p) => {
      const pd = new Date(p.created_at);
      return pd.getMonth() === d.getMonth() && pd.getFullYear() === d.getFullYear();
    }).length;
    months.push({ label, count });
  }

  // Monthly signups — last 6 months
  const signupMonths: { label: string; count: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const label = d.toLocaleString("default", { month: "short" });
    const count = authUsers.filter((u) => {
      const ud = new Date(u.created_at);
      return ud.getMonth() === d.getMonth() && ud.getFullYear() === d.getFullYear();
    }).length;
    signupMonths.push({ label, count });
  }

  const totalPres = Object.values(byStatus).reduce((a, b) => a + b, 0);
  const totalDocs = Object.values(byType).reduce((a, b) => a + b, 0);

  return { byStatus, byType, months, signupMonths, totalPres, totalDocs };
}

export async function getRecentActivity(): Promise<ActivityItem[]> {
  const admin = createAdminClient();
  const [{ data: recentDocs }, { data: recentPres }, { authUsers }] =
    await Promise.all([
      admin
        .from("documents")
        .select("name, created_at")
        .order("created_at", { ascending: false })
        .limit(5),
      admin
        .from("presentations")
        .select("name, status, created_at")
        .in("status", ["done", "error"])
        .order("created_at", { ascending: false })
        .limit(5),
      buildUserMap(),
    ]);

  const items: ActivityItem[] = [
    ...authUsers
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .slice(0, 5)
      .map((u) => ({
        kind: "signup" as const,
        label: `${u.email ?? "User"} signed up`,
        at: u.created_at,
      })),
    ...(recentDocs ?? []).map((d) => ({
      kind: "document" as const,
      label: `Document uploaded: ${d.name}`,
      at: d.created_at,
    })),
    ...(recentPres ?? []).map((p) => ({
      kind: (p.status === "done" ? "presentation_done" : "presentation_error") as ActivityItem["kind"],
      label:
        p.status === "done"
          ? `Presentation ready: ${p.name}`
          : `Generation failed: ${p.name}`,
      at: p.created_at,
    })),
  ];

  return items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);
}
