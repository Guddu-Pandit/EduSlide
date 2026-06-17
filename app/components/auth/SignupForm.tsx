"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import GoogleIcon from "./GoogleIcon";

export default function SignupForm() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <form className="flex flex-col gap-4">
      <button
        type="button"
        className="flex items-center justify-center gap-2.5 rounded-xl border border-border-mid bg-surface-1 px-4 py-3 text-sm font-medium text-text-strong transition-colors hover:bg-surface-2"
      >
        <GoogleIcon />
        Continue with Google
      </button>

      <div className="flex items-center gap-3 py-1">
        <span className="h-px flex-1 bg-border-soft" />
        <span className="text-xs text-text-muted">or sign up with email</span>
        <span className="h-px flex-1 bg-border-soft" />
      </div>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-strong">Full name</span>
        <div className="relative">
          <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="text"
            required
            autoComplete="name"
            placeholder="Jordan Lee"
            className="w-full rounded-xl border border-border-mid bg-surface-1 py-3 pl-10 pr-3.5 text-sm text-text-strong placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-strong">Email</span>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type="email"
            required
            autoComplete="email"
            placeholder="you@school.edu"
            className="w-full rounded-xl border border-border-mid bg-surface-1 py-3 pl-10 pr-3.5 text-sm text-text-strong placeholder:text-text-muted focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand-tint"
          />
        </div>
      </label>

      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-text-strong">Password</span>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          <input
            type={showPassword ? "text" : "password"}
            required
            minLength={8}
            autoComplete="new-password"
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
        <span className="text-xs text-text-muted">
          Use 8+ characters with a mix of letters and numbers.
        </span>
      </label>

      <label className="flex items-start gap-2 text-sm text-text-muted">
        <input
          type="checkbox"
          required
          className="mt-0.5 h-4 w-4 rounded border-border-mid text-brand focus:ring-2 focus:ring-brand-tint"
        />
        <span>
          I agree to the{" "}
          <Link href="/terms" className="font-medium text-brand hover:text-brand-hover">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="font-medium text-brand hover:text-brand-hover">
            Privacy Policy
          </Link>
        </span>
      </label>

      <button
        type="submit"
        className="mt-1 flex items-center justify-center gap-2 rounded-xl bg-brand px-5 py-3.5 text-[15px] font-medium text-white transition-colors hover:bg-brand-hover"
      >
        Create account
        <ArrowRight className="h-4 w-4" />
      </button>

      <p className="mt-2 text-center text-sm text-text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:text-brand-hover">
          Sign in
        </Link>
      </p>
    </form>
  );
}
