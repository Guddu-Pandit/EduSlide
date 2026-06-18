import { createClient } from "@/app/lib/supabase/server";
import { getProfile } from "@/app/lib/dashboard/queries";
import UploadForm from "@/app/components/dashboard/UploadForm";

export default async function UploadPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const profile = await getProfile(supabase, user.id);

  return (
    <div className="px-7 py-6">
      <UploadForm defaultTemplate={profile.default_template} />
    </div>
  );
}
