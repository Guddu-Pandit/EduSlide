import { login, sendMagicLink, signInWithGoogle } from "@/app/lib/auth-actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; message?: string }>;
}) {
  const { error, message } = await searchParams;

  return (
    <>
      <h1 className="mb-1.5 font-display text-2xl font-bold tracking-tight text-text-strong">
        Welcome back
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        Sign in to your EduSlide workspace.
      </p>

      {error && (
        <p className="mb-5 rounded-lg bg-[#fbeaea] px-3.5 py-2.5 text-[13px] text-[#b3261e]">
          {error}
        </p>
      )}
      {message && (
        <p className="mb-5 rounded-lg bg-brand-tint px-3.5 py-2.5 text-[13px] text-brand">
          {message}
        </p>
      )}

      <form action={login} className="flex flex-col gap-3.5">
        <div>
          <label
            htmlFor="email"
            className="mb-1.5 block text-[13px] font-medium text-text-strong"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@school.edu"
            className="w-full rounded-lg border border-border-mid bg-surface-1 px-3.5 py-2.5 text-sm text-text-strong outline-none focus:border-brand"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1.5 block text-[13px] font-medium text-text-strong"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            placeholder="••••••••"
            className="w-full rounded-lg border border-border-mid bg-surface-1 px-3.5 py-2.5 text-sm text-text-strong outline-none focus:border-brand"
          />
        </div>
        <button
          type="submit"
          className="mt-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Sign in
        </button>
      </form>

      <form action={sendMagicLink} className="mt-3 flex gap-2">
        <input
          name="email"
          type="email"
          required
          placeholder="Or email me a magic link"
          className="w-full rounded-lg border border-border-mid bg-surface-1 px-3.5 py-2.5 text-sm text-text-strong outline-none focus:border-brand"
        />
        <button
          type="submit"
          className="shrink-0 rounded-lg border border-border-strong px-4 py-2.5 text-sm text-text-strong transition-colors hover:bg-surface-2"
        >
          Send
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <span className="h-px flex-1 bg-border-soft" />
        <span className="text-xs text-text-muted">or</span>
        <span className="h-px flex-1 bg-border-soft" />
      </div>

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="w-full rounded-lg border border-border-mid bg-surface-1 px-5 py-2.5 text-sm font-medium text-text-strong transition-colors hover:bg-surface-2"
        >
          Continue with Google
        </button>
      </form>

      <p className="mt-6 text-center text-[13px] text-text-muted">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="font-medium text-brand">
          Sign up
        </a>
      </p>
    </>
  );
}
