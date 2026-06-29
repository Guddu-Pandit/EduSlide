import { createClient } from "@/app/lib/supabase/server";
import { PLAN_LIMITS, type Plan } from "@/app/lib/dashboard/plan";

export async function POST(request: Request) {
  try {
    const { razorpay_order_id, razorpay_payment_id, plan, error_description } =
      await request.json();

    if (!razorpay_order_id || !plan || !(plan in PLAN_LIMITS)) {
      return Response.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { error: insertError } = await supabase.from("payments").insert({
      user_id: user.id,
      razorpay_order_id,
      razorpay_payment_id: razorpay_payment_id ?? null,
      plan: plan as Plan,
      amount_paise: PLAN_LIMITS[plan as Plan].amountInPaise,
      status: "failed",
      error_description: error_description ?? null,
    });

    if (insertError) {
      console.error("Failed to record payment failure:", insertError.message);
      return Response.json({ error: "Could not save record" }, { status: 500 });
    }

    return Response.json({ success: true });
  } catch (err) {
    console.error("Unexpected error in /api/razorpay/failed:", err);
    return Response.json({ error: "Could not record failure" }, { status: 500 });
  }
}
