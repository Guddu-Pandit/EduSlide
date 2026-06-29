import { createHmac } from "crypto";
import { revalidatePath } from "next/cache";
import { createClient } from "@/app/lib/supabase/server";
import { PLAN_LIMITS, type Plan } from "@/app/lib/dashboard/plan";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } =
      await request.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !plan) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (!(plan in PLAN_LIMITS)) {
      return Response.json({ error: "Invalid plan" }, { status: 400 });
    }

    const expectedSignature = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return Response.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error: dbError } = await supabase
      .from("profiles")
      .update({ plan: plan as Plan })
      .eq("id", user.id);

    if (dbError) {
      console.error("Failed to update plan in DB:", dbError.message);
      return Response.json({ error: "Plan update failed after payment" }, { status: 500 });
    }

    revalidatePath("/dashboard/billing");
    revalidatePath("/dashboard");

    return Response.json({ success: true, plan });
  } catch {
    return Response.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
