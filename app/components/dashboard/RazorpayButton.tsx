"use client";

import { useState } from "react";
import { createRazorpayOrder } from "@/app/lib/dashboard/razorpay-actions";
import type { Plan } from "@/app/lib/dashboard/plan";

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open(): void };
  }
}

interface RazorpayFailedResponse {
  error: {
    code: string;
    description: string;
    source: string;
    step: string;
    reason: string;
    metadata: {
      order_id: string;
      payment_id?: string;
    };
  };
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (window.Razorpay) { resolve(true); return; }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

interface Props {
  plan: Plan;
  label: string;
  className: string;
}

export function RazorpayButton({ plan, label, className }: Props) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      const loaded = await loadRazorpayScript();
      if (!loaded) {
        alert("Failed to load payment gateway. Please try again.");
        setLoading(false);
        return;
      }

      const order = await createRazorpayOrder(plan);

      const options = {
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "EduSlide",
        description: `Upgrade to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan`,
        order_id: order.orderId,
        prefill: { name: order.prefillName, email: order.prefillEmail },
        theme: { color: "#6366f1" },

        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          const res = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, plan }),
          });

          if (res.ok) {
            window.location.href =
              "/dashboard/billing?toast=" +
              encodeURIComponent(`Upgraded to ${plan.charAt(0).toUpperCase() + plan.slice(1)} plan!`);
          } else {
            alert("Payment verification failed. Contact support if your money was deducted.");
            setLoading(false);
          }
        },

        "payment.failed": async (response: RazorpayFailedResponse) => {
          // Record the failed attempt silently — don't await, just fire
          fetch("/api/razorpay/failed", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.error.metadata.order_id,
              razorpay_payment_id: response.error.metadata.payment_id ?? null,
              plan,
              error_description: response.error.description || response.error.reason || "Payment failed",
            }),
          });
          // Razorpay keeps the modal open for retry after failure — don't reset loading
        },

        modal: {
          ondismiss: () => setLoading(false),
        },
      };

      new window.Razorpay(options).open();
    } catch {
      alert("Could not initiate payment. Please try again.");
      setLoading(false);
    }
  }

  return (
    <button type="button" onClick={handleClick} disabled={loading} className={className}>
      {loading ? "Processing…" : label}
    </button>
  );
}
