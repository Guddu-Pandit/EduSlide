import { redirect } from "next/navigation";
import { getCachedUser, createClient } from "@/app/lib/supabase/server";
import { getProfile } from "@/app/lib/dashboard/queries";
import AdminShell from "@/app/components/admin/AdminShell";

export const metadata = { title: "EduSlide — Admin" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCachedUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);

  if (profile.role !== "admin") redirect("/dashboard");

  return (
    <AdminShell fullName={profile.full_name} email={user.email}>
      {children}
    </AdminShell>
  );
}
