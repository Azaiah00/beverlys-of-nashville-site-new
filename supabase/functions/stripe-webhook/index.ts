/**
 * Beverly's Academy — Stripe Webhook
 *
 * Deploy:
 *   supabase functions deploy stripe-webhook --no-verify-jwt
 *
 * Env secrets (set in Supabase dashboard):
 *   STRIPE_SECRET_KEY
 *   STRIPE_WEBHOOK_SECRET
 *   SUPABASE_URL
 *   SUPABASE_SERVICE_ROLE_KEY
 *
 * Stripe → Webhooks → Add endpoint:
 *   https://<project>.functions.supabase.co/stripe-webhook
 *   Events: checkout.session.completed, customer.subscription.updated,
 *           customer.subscription.deleted, invoice.payment_succeeded,
 *           invoice.payment_failed
 */
import Stripe from "https://esm.sh/stripe@14.21.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  apiVersion: "2024-12-18.acacia",
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } }
);

const WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

// Map Stripe price IDs → portal tier.
// IMPORTANT: keep in sync with client/src/lib/products.ts PRICING block.
const PRICE_TO_TIER: Record<string, "apprentice" | "artisan" | "master"> = {
  [Deno.env.get("PRICE_APPRENTICE_MONTHLY") ?? ""]: "apprentice",
  [Deno.env.get("PRICE_APPRENTICE_ANNUAL") ?? ""]: "apprentice",
  [Deno.env.get("PRICE_ARTISAN_MONTHLY") ?? ""]: "artisan",
  [Deno.env.get("PRICE_ARTISAN_ANNUAL") ?? ""]: "artisan",
  [Deno.env.get("PRICE_ARTISAN_FOUNDING_MONTHLY") ?? ""]: "artisan",
  [Deno.env.get("PRICE_ARTISAN_FOUNDING_ANNUAL") ?? ""]: "artisan",
  [Deno.env.get("PRICE_MASTER_MONTHLY") ?? ""]: "master",
  [Deno.env.get("PRICE_MASTER_ANNUAL") ?? ""]: "master",
};

const FOUNDING_PRICE_IDS = new Set<string>([
  Deno.env.get("PRICE_ARTISAN_FOUNDING_MONTHLY") ?? "",
  Deno.env.get("PRICE_ARTISAN_FOUNDING_ANNUAL") ?? "",
]);

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const signature = req.headers.get("stripe-signature");
  const body = await req.text();

  let event: Stripe.Event;
  try {
    event = await stripe.webhooks.constructEventAsync(body, signature!, WEBHOOK_SECRET);
  } catch (err) {
    console.error("⚠️  Webhook signature verification failed:", (err as Error).message);
    return new Response(`Webhook Error: ${(err as Error).message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.created": {
        const sub = event.data.object as Stripe.Subscription;
        await syncSubscription(sub);
        break;
      }
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        await cancelSubscription(sub);
        break;
      }
      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        if (invoice.subscription) {
          await supabase
            .from("subscriptions")
            .update({ status: "past_due", updated_at: new Date().toISOString() })
            .eq("stripe_subscription_id", invoice.subscription as string);
        }
        break;
      }
      default:
        // Ignore other events silently
        break;
    }
    return new Response(JSON.stringify({ received: true }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Webhook handler error:", err);
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});

// ── Handlers ────────────────────────────────────────────────────────────────

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const customerId = session.customer as string;
  const userId = session.metadata?.user_id;
  const email = session.customer_email ?? session.customer_details?.email ?? null;

  if (!customerId || (!userId && !email)) {
    console.warn("checkout.session.completed missing customer or user info");
    return;
  }

  // Link stripe_customer_id to profile
  if (userId) {
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
      .eq("id", userId);
  } else if (email) {
    await supabase
      .from("profiles")
      .update({ stripe_customer_id: customerId, updated_at: new Date().toISOString() })
      .ilike("email", email);
  }

  // The subscription object will follow in customer.subscription.created
}

async function syncSubscription(sub: Stripe.Subscription) {
  const customerId = sub.customer as string;

  // Find profile by stripe_customer_id
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) {
    console.warn("No profile for stripe customer", customerId);
    return;
  }

  const priceId = sub.items.data[0]?.price?.id ?? "";
  const tier = PRICE_TO_TIER[priceId] ?? "free";
  const founding = FOUNDING_PRICE_IDS.has(priceId);

  await supabase.from("subscriptions").upsert(
    {
      user_id: profile.id,
      tier,
      status: sub.status as any,
      stripe_subscription_id: sub.id,
      stripe_price_id: priceId,
      current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
      cancel_at_period_end: sub.cancel_at_period_end,
      founding_member: founding,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );
}

async function cancelSubscription(sub: Stripe.Subscription) {
  const customerId = sub.customer as string;
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("stripe_customer_id", customerId)
    .single();

  if (!profile) return;

  await supabase
    .from("subscriptions")
    .update({
      tier: "free",
      status: "canceled",
      cancel_at_period_end: false,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", profile.id);
}
