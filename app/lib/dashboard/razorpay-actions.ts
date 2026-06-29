"use server";

import Razorpay from "razorpay";
import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";
import { createClient } from "@/app/lib/supabase/server";
import { PLAN_LIMITS, type Plan } from "./plan";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

async function requireUser(supabase: SupabaseClient) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return user;
}

export async function createRazorpayOrder(plan: Plan): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  prefillName: string;
  prefillEmail: string;
}> {
  const supabase = await createClient();
  const user = await requireUser(supabase);

  const planInfo = PLAN_LIMITS[plan];
  if (!planInfo || planInfo.amountInPaise === 0) {
    throw new Error("Invalid plan for payment");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name")
    .eq("id", user.id)
    .single();

  const order = await razorpay.orders.create({
    amount: planInfo.amountInPaise,
    currency: "INR",
    receipt: `rcpt_${user.id.slice(0, 8)}_${Date.now()}`,
    notes: { userId: user.id, plan },
  });

  return {
    orderId: order.id,
    amount: planInfo.amountInPaise,
    currency: "INR",
    keyId: process.env.RAZORPAY_KEY_ID!,
    prefillName: profile?.full_name ?? "",
    prefillEmail: user.email ?? "",
  };
}
