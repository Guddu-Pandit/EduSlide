import { signInWithGoogle, signup } from "@/app/lib/auth-actions";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <>
      <h1 className="mb-1.5 font-display text-2xl font-bold tracking-tight text-text-strong">
        Create your account
      </h1>
      <p className="mb-6 text-sm text-text-muted">
        Free for your first 10 decks. No credit card required.
      </p>

      {error && (
        <p className="mb-5 rounded-lg bg-[#fbeaea] px-3.5 py-2.5 text-[13px] text-[#b3261e]">
          {error}
        </p>
      )}

      <form action={signup} className="flex flex-col gap-3.5">
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
            minLength={8}
            placeholder="At least 8 characters"
            className="w-full rounded-lg border border-border-mid bg-surface-1 px-3.5 py-2.5 text-sm text-text-strong outline-none focus:border-brand"
          />
        </div>
        <button
          type="submit"
          className="mt-1 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
        >
          Create account
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
        Already have an account?{" "}
        <a href="/login" className="font-medium text-brand">
          Sign in
        </a>
      </p>
    </>
  );
}
