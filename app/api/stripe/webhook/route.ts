import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient as createServiceClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2026-03-25.dahlia",
});

// Service role client bypasses RLS — only for server-side webhook use
function getServiceSupabase() {
  return createServiceClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

function planFromPriceId(priceId: string): "pro" | "elite" | "starter" {
  const starterIds = [
    process.env.STRIPE_PRICE_STARTER_MONTHLY,
    process.env.STRIPE_PRICE_STARTER_ANNUAL,
  ].filter(Boolean);
  const proIds = [
    process.env.STRIPE_PRICE_PRO_MONTHLY,
    process.env.STRIPE_PRICE_PRO_ANNUAL,
  ].filter(Boolean);
  const eliteIds = [
    process.env.STRIPE_PRICE_ELITE_MONTHLY,
    process.env.STRIPE_PRICE_ELITE_ANNUAL,
  ].filter(Boolean);
  if (starterIds.includes(priceId)) return "starter";
  if (proIds.includes(priceId)) return "pro";
  if (eliteIds.includes(priceId)) return "elite";
  return "starter";
}

async function upsertSubscription(fields: {
  userId: string;
  plan: string;
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId: string;
  status: string;
  currentPeriodEnd: number; // Unix timestamp
}) {
  const supabase = getServiceSupabase();
  const { error } = await supabase.from("user_subscriptions").upsert(
    {
      user_id: fields.userId,
      plan: fields.plan,
      stripe_customer_id: fields.stripeCustomerId,
      stripe_subscription_id: fields.stripeSubscriptionId,
      stripe_price_id: fields.stripePriceId,
      status: fields.status,
      current_period_end: new Date(fields.currentPeriodEnd * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
  if (error) console.error("[webhook] upsert error:", error);
}

// Disable body parsing — Stripe needs the raw body for signature verification
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !secret) {
    return NextResponse.json({ error: "Missing stripe-signature or STRIPE_WEBHOOK_SECRET" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret);
  } catch (err) {
    console.error("[webhook] signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== "subscription" || !session.subscription) break;

        const userId = session.metadata?.user_id;
        if (!userId) { console.error("[webhook] no user_id in metadata"); break; }

        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        const priceId = subscription.items.data[0].price.id;

        await upsertSubscription({
          userId,
          plan: planFromPriceId(priceId),
          stripeCustomerId: session.customer as string,
          stripeSubscriptionId: subscription.id,
          stripePriceId: priceId,
          status: subscription.status,
          currentPeriodEnd: subscription.items.data[0].current_period_end,
        });
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const priceId = sub.items.data[0].price.id;

        // Look up user_id via stripe_customer_id
        const supabase = getServiceSupabase();
        const { data: row } = await supabase
          .from("user_subscriptions")
          .select("user_id")
          .eq("stripe_customer_id", sub.customer as string)
          .maybeSingle();

        if (row?.user_id) {
          await upsertSubscription({
            userId: row.user_id,
            plan: planFromPriceId(priceId),
            stripeCustomerId: sub.customer as string,
            stripeSubscriptionId: sub.id,
            stripePriceId: priceId,
            status: sub.status,
            currentPeriodEnd: sub.items.data[0].current_period_end,
          });
        }
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const supabase = getServiceSupabase();
        await supabase
          .from("user_subscriptions")
          .update({
            plan: "starter",
            status: "canceled",
            stripe_subscription_id: null,
            stripe_price_id: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", sub.customer as string);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subId = invoice.parent?.subscription_details?.subscription;
        if (!subId) break;
        const supabase = getServiceSupabase();
        await supabase
          .from("user_subscriptions")
          .update({ status: "past_due", updated_at: new Date().toISOString() })
          .eq("stripe_subscription_id", typeof subId === "string" ? subId : subId.id);
        break;
      }

      default:
        break;
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("[webhook] handler error:", err);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
