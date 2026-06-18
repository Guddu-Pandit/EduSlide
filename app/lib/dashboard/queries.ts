import type { SupabaseClient } from "@supabase/supabase-js";
import type {
  DocumentRow,
  DocumentWithCount,
  PresentationRow,
  PresentationStatus,
  ProfileRow,
} from "./types";

export async function getProfile(
  supabase: SupabaseClient,
  userId: string,
): Promise<ProfileRow> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) throw new Error("Could not load profile");
  return data as ProfileRow;
}

export interface DashboardData {
  documents: DocumentWithCount[];
  presentations: PresentationRow[];
}

/**
 * Fetches documents and presentations together in a single round-trip pair
 * (one query each, run in parallel) so callers that need both — or derive
 * stats/activity from both — never issue duplicate requests for the same
 * tables.
 */
export async function getDashboardData(
  supabase: SupabaseClient,
  userId: string,
): Promise<DashboardData> {
  const [{ data: documents, error: docsError }, { data: presentations, error: presError }] =
    await Promise.all([
      supabase
        .from("documents")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      supabase
        .from("presentations")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
    ]);

  if (docsError) throw new Error("Could not load documents");
  if (presError) throw new Error("Could not load presentations");

  const counts = new Map<string, number>();
  for (const p of (presentations ?? []) as PresentationRow[]) {
    if (p.document_id) counts.set(p.document_id, (counts.get(p.document_id) ?? 0) + 1);
  }

  const documentsWithCount = ((documents ?? []) as DocumentRow[]).map((d) => ({
    ...d,
    presentationCount: counts.get(d.id) ?? 0,
  }));

  return { documents: documentsWithCount, presentations: (presentations ?? []) as PresentationRow[] };
}

export async function getDocuments(
  supabase: SupabaseClient,
  userId: string,
): Promise<DocumentWithCount[]> {
  const { documents } = await getDashboardData(supabase, userId);
  return documents;
}

export async function getPresentations(
  supabase: SupabaseClient,
  userId: string,
  opts: { status?: PresentationStatus; q?: string } = {},
): Promise<PresentationRow[]> {
  let query = supabase
    .from("presentations")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (opts.status) query = query.eq("status", opts.status);
  if (opts.q) query = query.ilike("name", `%${opts.q}%`);

  const { data, error } = await query;
  if (error) throw new Error("Could not load presentations");
  return (data ?? []) as PresentationRow[];
}

export interface DashboardStats {
  presentationsCount: number;
  presentationsThisMonth: number;
  documentsCount: number;
  documentsNotConverted: number;
  slidesGenerated: number;
  storageBytes: number;
}

export function computeDashboardStats(
  documents: DocumentWithCount[],
  presentations: PresentationRow[],
): DashboardStats {
  const now = new Date();
  const presentationsThisMonth = presentations.filter((p) => {
    const d = new Date(p.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;

  return {
    presentationsCount: presentations.length,
    presentationsThisMonth,
    documentsCount: documents.length,
    documentsNotConverted: documents.filter((d) => d.presentationCount === 0).length,
    slidesGenerated: presentations.reduce((sum, p) => sum + p.slide_count, 0),
    storageBytes: documents.reduce((sum, d) => sum + d.size_bytes, 0),
  };
}

export async function getDashboardStats(
  supabase: SupabaseClient,
  userId: string,
): Promise<DashboardStats> {
  const { documents, presentations } = await getDashboardData(supabase, userId);
  return computeDashboardStats(documents, presentations);
}

export type ActivityItem =
  | { kind: "document_uploaded"; id: string; name: string; at: string }
  | { kind: "presentation_created"; id: string; name: string; status: PresentationStatus; at: string };

export function computeRecentActivity(
  documents: DocumentWithCount[],
  presentations: PresentationRow[],
  limit = 6,
): ActivityItem[] {
  const items: ActivityItem[] = [
    ...documents.map((d) => ({
      kind: "document_uploaded" as const,
      id: d.id,
      name: d.name,
      at: d.created_at,
    })),
    ...presentations.map((p) => ({
      kind: "presentation_created" as const,
      id: p.id,
      name: p.name,
      status: p.status,
      at: p.completed_at ?? p.created_at,
    })),
  ];

  return items
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, limit);
}
