"use client";

import { Suspense, useState } from "react";
import Sidebar from "@/app/components/dashboard/Sidebar";
import Topbar from "@/app/components/dashboard/Topbar";
import Toast from "@/app/components/dashboard/Toast";
import type { Plan } from "@/app/lib/dashboard/plan";

export default function DashboardShell({
  fullName,
  email,
  plan,
  presentationsCount,
  children,
}: {
  fullName: string | null;
  email: string | undefined;
  plan: Plan;
  presentationsCount: number;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="fixed inset-0 flex overflow-hidden bg-surface-3">
      <Sidebar
        fullName={fullName}
        email={email}
        plan={plan}
        presentationsCount={presentationsCount}
        mobileOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
      />
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <Topbar onMenuClick={() => setMobileOpen(true)} />
        <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
      </div>
      <Suspense>
        <Toast />
      </Suspense>
    </div>
  );
}
