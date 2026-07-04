"use client";

import { useState } from "react";
import AdminSidebar from "./AdminSidebar";
import AdminTopbar from "./AdminTopbar";
import { AdminToastProvider } from "./AdminToast";

export default function AdminShell({
  fullName,
  email,
  children,
}: {
  fullName: string | null;
  email: string | undefined;
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <AdminToastProvider>
      <div className="fixed inset-0 flex flex-col overflow-hidden bg-admin-bg">
        <AdminTopbar fullName={fullName} email={email} onMenuClick={() => setMobileOpen(true)} />
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
          <main className="min-h-0 flex-1 overflow-y-auto">{children}</main>
        </div>
      </div>
    </AdminToastProvider>
  );
}
