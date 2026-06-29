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

    const planInfo = PLAN_LIMITS[plan as Plan];
    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ plan: plan as Plan, plan_expires_at: expiresAt.toISOString() })
      .eq("id", user.id);

    if (profileError) {
      console.error("Failed to update plan in DB:", profileError.message);
      return Response.json({ error: "Plan update failed after payment" }, { status: 500 });
    }

    await supabase.from("payments").insert({
      user_id: user.id,
      razorpay_order_id,
      razorpay_payment_id,
      plan,
      amount_paise: planInfo.amountInPaise,
      status: "success",
      error_description: null,
    });

    revalidatePath("/dashboard/billing");
    revalidatePath("/dashboard");

    return Response.json({ success: true, plan });
  } catch {
    return Response.json({ error: "Payment verification failed" }, { status: 500 });
  }
}
