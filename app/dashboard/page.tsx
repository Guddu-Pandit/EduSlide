import { logout } from "@/app/lib/auth-actions";
import { createClient } from "@/app/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex min-h-screen flex-col bg-surface-3">
      <nav className="flex items-center justify-between border-b border-border-soft bg-surface-1 px-6 py-4 sm:px-10">
        <div className="font-display text-xl font-bold tracking-tight text-text-strong">
          Edu<span className="text-brand">Slide</span>
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-lg border border-border-strong px-4 py-2 text-sm text-text-strong transition-colors hover:bg-surface-2"
          >
            Sign out
          </button>
        </form>
      </nav>

      <main className="mx-auto w-full max-w-4xl flex-1 px-6 py-14 sm:px-10">
        <h1 className="mb-2 font-display text-2xl font-bold tracking-tight text-text-strong">
          Welcome{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="text-sm text-text-muted">
          Your workspace is empty. Upload a document from the home page to
          generate your first deck.
        </p>
      </main>
    </div>
  );
}
