import { createClient, getCachedUser } from "@/app/lib/supabase/server";
import { getProfile } from "@/app/lib/dashboard/queries";
import UploadForm from "@/app/components/dashboard/UploadForm";

export default async function UploadPage() {
  const user = await getCachedUser();
  if (!user) return null;
  const supabase = await createClient();

  const profile = await getProfile(supabase, user.id);

  return (
    <div className="px-7 py-6">
      <UploadForm defaultTemplate={profile.default_template} />
    </div>
  );
}
