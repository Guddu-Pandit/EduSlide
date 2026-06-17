"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";
import GoogleIcon from "./GoogleIcon";
import { login, sendMagicLink, signInWithGoogle } from "@/app/lib/auth-actions";

export default function LoginForm({
  error,
  message,
}: {
  error?: string;
  message?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<"password" | "magic-link">("password");

  return (
    <div className="flex flex-col gap-4">
      {error && (
        <p className="rounded-lg bg-[#fbeaea] px-3.5 py-2.5 text-[13px] text-[#b3261e]">
          {error}
        </p>
      )}
      {message && (
        <p className="rounded-lg bg-brand-tint px-3.5 py-2.5 text-[13px] text-brand">
          {message}
        </p>
      )}

      <form action={signInWithGoogle}>
        <button
          type="submit"
          className="flex w-full items-center justify-center gap-2.5 rounded-xl border border-border-mid bg-surface-1 px-4 py-3 text-sm font-medium text-text-strong transition-colors hover:bg-surface-2"
        >
          <GoogleIcon />
          Continue with Google
        </button>
      </form>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border-soft" />
        <span className="text-xs text-text-muted">or continue with email</span>
        <span className="h-px flex-1 bg-border-soft" />
      </div>

      <form
        action={mode === "password" ? login : sendMagicLink}
        className="flex flex-col gap-4"
      >
        <label className="flex flex-col gap-1.5">
          <span className="text-sm font-medium text-text-strong">Email</span>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@school.edu"
              className="w-full rounded-xl border border-border-mid bg-surface-1 py-3 pl-10 pr-3.5 text-sm text-text-strong placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint"
            />
          </div>
        </label>

        {mode === "password" && (
          <label className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-strong">
                Password
              </span>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-brand hover:text-brand-hover"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full rounded-xl border border-border-mid bg-surface-1 py-3 pl-10 pr-10 text-sm text-text-strong placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted transition-colors hover:text-text-strong"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </label>
        )}

        <button
          type="submit"
          className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-hover"
        >
          {mode === "password" ? "Sign in" : "Send magic link"}
          <ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <button
        type="button"
        onClick={() =>
          setMode((m) => (m === "password" ? "magic-link" : "password"))
        }
        className="text-center text-sm font-medium text-brand hover:text-brand-hover"
      >
        {mode === "password"
          ? "Sign in with a magic link instead"
          : "Sign in with a password instead"}
      </button>

      <p className="mt-2 text-center text-sm text-text-muted">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="font-medium text-brand hover:text-brand-hover">
          Sign up free
        </Link>
      </p>
    </div>
  );
}
