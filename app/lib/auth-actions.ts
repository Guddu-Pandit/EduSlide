"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/app/lib/supabase/server";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signUp({
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Check your email to confirm your account");
}

export async function sendMagicLink(formData: FormData) {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { error } = await supabase.auth.signInWithOtp({
    email: formData.get("email") as string,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect("/login?message=Check your email for a magic link");
}

export async function signInWithGoogle() {
  const supabase = await createClient();
  const origin = (await headers()).get("origin");

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
    },
  });

  if (error || !data.url) {
    redirect("/login?error=Could not authenticate with Google");
  }

  redirect(data.url);
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
