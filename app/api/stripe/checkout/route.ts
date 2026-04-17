import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@/lib/supabase/server";
import { getStripePriceId } from "@/lib/plan-config";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
  timeout: 8000,
  maxNetworkRetries: 0,
});

export async function POST(req: NextRequest) {
  try {
    const { plan, billing = "monthly" } = await req.json();

    if (!["starter", "pro", "elite"].includes(plan)) {
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const priceId = getStripePriceId(plan as "starter" | "pro" | "elite", billing as "monthly" | "annual");
    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price not configured. Add STRIPE_PRICE_${plan.toUpperCase()}_${(billing as string).toUpperCase()} to your environment variables.` },
        { status: 500 }
      );
    }

    // Look up existing Stripe customer (if they've subscribed before)
    const { data: sub } = await supabase
      .from("user_subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .maybeSingle();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://faceless.townshub.com";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(sub?.stripe_customer_id
        ? { customer: sub.stripe_customer_id }
        : { customer_email: user.email ?? undefined }),
      metadata: { user_id: user.id, plan, billing },
      subscription_data: {
        metadata: { user_id: user.id, plan },
        trial_period_days: 3,
      },
      success_url: `${appUrl}/dashboard/billing?session_id={CHECKOUT_SESSION_ID}&success=1`,
      cancel_url: `${appUrl}/dashboard/billing`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err: unknown) {
    console.error("[stripe/checkout] ERROR:", err);
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message, debug: String(err) }, { status: 500 });
  }
}
