"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/server";
import { createAdminClient } from "@/app/lib/supabase/admin";
import { PLAN_LIMITS, type Plan } from "./plan";
import type { DocumentFileType } from "./types";

const EXT_TO_TYPE: Record<string, DocumentFileType> = {
  pdf: "pdf",
  docx: "docx",
  txt: "txt",
};

async function requireUser(supabase: SupabaseClient): Promise<User> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

function toastRedirect(path: string, message: string): never {
  redirect(`${path}?toast=${encodeURIComponent(message)}`);
}

export async function uploadDocument(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    toastRedirect("/dashboard/upload", "Choose a file first");
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  const fileType = EXT_TO_TYPE[ext];
  if (!fileType) {
    toastRedirect("/dashboard/upload", "Unsupported file type — use PDF, DOCX, or TXT");
  }
  if (file.size > 25 * 1024 * 1024) {
    toastRedirect("/dashboard/upload", "File exceeds the 25 MB limit");
  }

  const path = `${user.id}/${Date.now()}-${file.name}`;
  const { error: uploadError } = await supabase.storage
    .from("documents")
    .upload(path, file, { contentType: file.type || undefined });

  if (uploadError) {
    toastRedirect("/dashboard/upload", `Upload failed: ${uploadError.message}`);
  }

  const { data: doc, error: insertError } = await supabase
    .from("documents")
    .insert({
      user_id: user.id,
      name: file.name,
      file_path: path,
      file_type: fileType,
      size_bytes: file.size,
    })
    .select()
    .single();

  if (insertError || !doc) {
    await supabase.storage.from("documents").remove([path]);
    toastRedirect("/dashboard/upload", "Could not save the document record");
  }

  const autoGenerate = formData.get("autoGenerate") === "on";
  const template = (formData.get("template") as string) || "corporate";

  if (autoGenerate) {
    await supabase.from("presentations").insert({
      user_id: user.id,
      document_id: doc.id,
      name: file.name.replace(/\.[^./]+$/, ""),
      template,
      status: "queued",
    });
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard/presentations");

  toastRedirect(
    "/dashboard/documents",
    autoGenerate ? "Document uploaded — generation queued" : "Document uploaded",
  );
}

export async function convertDocument(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const documentId = formData.get("documentId") as string;
  const template = (formData.get("template") as string) || "corporate";

  const { data: doc } = await supabase
    .from("documents")
    .select("name")
    .eq("id", documentId)
    .eq("user_id", user.id)
    .single();

  if (!doc) toastRedirect("/dashboard/documents", "Document not found");

  await supabase.from("presentations").insert({
    user_id: user.id,
    document_id: documentId,
    name: doc.name.replace(/\.[^./]+$/, ""),
    template,
    status: "queued",
  });

  revalidatePath("/dashboard/presentations");
  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");

  toastRedirect("/dashboard/presentations", "Generation queued");
}

export async function deleteDocument(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const id = formData.get("id") as string;

  const { data: doc } = await supabase
    .from("documents")
    .select("file_path")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (doc) {
    await supabase.storage.from("documents").remove([doc.file_path]);
  }
  await supabase.from("documents").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard/documents");
  revalidatePath("/dashboard");

  toastRedirect("/dashboard/documents", "Document deleted");
}

export async function deletePresentation(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const id = formData.get("id") as string;

  await supabase.from("presentations").delete().eq("id", id).eq("user_id", user.id);

  revalidatePath("/dashboard/presentations");
  revalidatePath("/dashboard");

  toastRedirect("/dashboard/presentations", "Presentation deleted");
}

export async function retryPresentation(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const id = formData.get("id") as string;

  await supabase
    .from("presentations")
    .update({ status: "queued", error_message: null, slide_count: 0, completed_at: null })
    .eq("id", id)
    .eq("user_id", user.id);

  revalidatePath("/dashboard/presentations");

  toastRedirect("/dashboard/presentations", "Generation re-queued");
}

export async function updateProfile(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const fullName = (formData.get("fullName") as string)?.trim() || null;
  const institution = (formData.get("institution") as string)?.trim() || null;
  const email = (formData.get("email") as string)?.trim();

  await supabase
    .from("profiles")
    .update({ full_name: fullName, institution })
    .eq("id", user.id);

  let message = "Profile saved";
  if (email && email !== user.email) {
    const { error } = await supabase.auth.updateUser({ email });
    message = error
      ? "Profile saved — email change failed"
      : "Profile saved — confirm the email change via the link we sent";
  }

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");

  toastRedirect("/dashboard/settings", message);
}

export async function updatePreferences(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  await supabase
    .from("profiles")
    .update({
      default_template: (formData.get("defaultTemplate") as string) || "corporate",
      speaker_notes_default: formData.get("speakerNotesDefault") === "on",
      email_on_completion: formData.get("emailOnCompletion") === "on",
      auto_delete_uploads: formData.get("autoDeleteUploads") === "on",
    })
    .eq("id", user.id);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard/upload");

  toastRedirect("/dashboard/settings", "Preferences updated");
}

export async function setDefaultTemplate(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  const template = formData.get("template") as string;

  await supabase.from("profiles").update({ default_template: template }).eq("id", user.id);

  revalidatePath("/dashboard/templates");
  revalidatePath("/dashboard/upload");

  toastRedirect("/dashboard/templates", "Default template updated");
}

export async function sendPasswordReset() {
  const supabase = await createClient();
  const user = await requireUser(supabase);
  if (!user.email) toastRedirect("/dashboard/settings", "No email on file");

  const { error } = await supabase.auth.resetPasswordForEmail(user.email);

  toastRedirect(
    "/dashboard/settings",
    error ? "Could not send reset email" : "Password reset email sent",
  );
}

export async function upgradePlan(formData: FormData) {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const plan = formData.get("plan") as Plan;
  if (!(plan in PLAN_LIMITS)) {
    toastRedirect("/dashboard/billing", "Invalid plan");
  }

  await supabase.from("profiles").update({ plan }).eq("id", user.id);

  revalidatePath("/dashboard/billing");
  revalidatePath("/dashboard");

  toastRedirect("/dashboard/billing", `Switched to the ${PLAN_LIMITS[plan].label} plan`);
}

export async function deleteAccount() {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const { data: docs } = await supabase
    .from("documents")
    .select("file_path")
    .eq("user_id", user.id);

  if (docs?.length) {
    await supabase.storage.from("documents").remove(docs.map((d) => d.file_path));
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    toastRedirect("/dashboard/settings", "Could not delete account — try again or contact support");
  }

  await supabase.auth.signOut();
  redirect("/login?message=Your account has been deleted");
}
