import { Suspense } from "react";
import { redirect } from "next/navigation";
import { createClient, getCachedUser } from "@/app/lib/supabase/server";
import { getPresentations, getProfile } from "@/app/lib/dashboard/queries";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Topbar from "@/app/components/dashboard/Topbar";
import Toast from "@/app/components/dashboard/Toast";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const [profile, presentations] = await Promise.all([
    getProfile(supabase, user.id),
    getPresentations(supabase, user.id),
  ]);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-surface-3">
      <Sidebar
        fullName={profile.full_name}
        email={user.email}
        plan={profile.plan}
        presentationsCount={presentations.length}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Topbar />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <Suspense>
        <Toast />
      </Suspense>
    </div>
  );
}
