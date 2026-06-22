import { createClient } from "@/app/lib/supabase/server";
import { buildPptxBuffer } from "@/app/lib/dashboard/pptx";
import type { PresentationRow } from "@/app/lib/dashboard/types";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { data, error } = await supabase
    .from("presentations")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error || !data) return new Response("Presentation not found", { status: 404 });

  const presentation = data as PresentationRow;
  if (presentation.status !== "done" || !presentation.content) {
    return new Response("Presentation is not ready yet", { status: 409 });
  }

  const buffer = await buildPptxBuffer(presentation.content, presentation.template);
  const fileName = `${presentation.name.replace(/[^a-z0-9-_ ]/gi, "_") || "presentation"}.pptx`;

  return new Response(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
