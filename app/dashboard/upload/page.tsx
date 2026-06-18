"use client";

import { getProfile } from "@/app/lib/dashboard/queries";
import { useDashboardQuery } from "@/app/lib/dashboard/useDashboardQuery";
import UploadForm from "@/app/components/dashboard/UploadForm";
import { CardSkeleton } from "@/app/components/dashboard/Skeleton";

export default function UploadPage() {
  const { data: profile, loading } = useDashboardQuery((supabase, userId) => getProfile(supabase, userId));

  if (loading || !profile) {
    return (
      <div className="grid grid-cols-2 gap-4 px-7 py-6 max-[900px]:grid-cols-1">
        <CardSkeleton className="h-64" />
        <CardSkeleton className="h-64" />
      </div>
    );
  }

  return (
    <div className="px-7 py-6">
      <UploadForm defaultTemplate={profile.default_template} />
    </div>
  );
}
