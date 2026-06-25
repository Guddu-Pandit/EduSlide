"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/app/lib/supabase/admin";

export async function adminDeleteUser(userId: string): Promise<{ error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return {};
}

export async function adminCreateUser(formData: FormData): Promise<{ error?: string }> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const full_name = formData.get("full_name") as string;

  if (!email || !password) return { error: "Email and password are required" };

  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { full_name },
  });
  if (error) return { error: error.message };
  if (data.user && full_name) {
    await admin.from("profiles").upsert({ id: data.user.id, full_name });
  }
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return {};
}

export async function adminSetRole(userId: string, role: "admin" | "user"): Promise<{ error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin.from("profiles").update({ role }).eq("id", userId);
  if (error) return { error: error.message };
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  return {};
}

export async function adminDeleteDocument(docId: string): Promise<{ error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin.from("documents").delete().eq("id", docId);
  if (error) return { error: error.message };
  revalidatePath("/admin/content");
  return {};
}

export async function adminDeletePresentation(presId: string): Promise<{ error?: string }> {
  const admin = createAdminClient();
  const { error } = await admin.from("presentations").delete().eq("id", presId);
  if (error) return { error: error.message };
  revalidatePath("/admin/content");
  return {};
}
