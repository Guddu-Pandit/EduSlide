import { redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/app/lib/supabase/server";
import { getPresentations, getProfile } from "@/app/lib/dashboard/queries";
import DashboardShell from "@/app/components/dashboard/DashboardShell";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const [profile, presentations] = await Promise.all([
    getProfile(supabase, user.id),
    getPresentations(supabase, user.id),
  ]);

  return (
    <DashboardShell
      fullName={profile.full_name}
      email={user.email}
      plan={profile.plan}
      presentationsCount={presentations.length}
    >
      {children}
    </DashboardShell>
  );
}
