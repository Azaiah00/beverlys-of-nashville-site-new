/**
 * Beverly's Academy — Create Stripe Checkout Session
 *
 * Called from client Pricing.tsx. Returns a URL to redirect the user to.
 *
 * Deploy: supabase functions deploy create-checkout-session
 * Env: STRIPE_SECRET_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PORTAL_URL
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

const PORTAL_URL = Deno.env.get("PORTAL_URL") ?? "https://beverlysofnashville.com";

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: CORS });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: CORS });

  try {
    const { priceId, userId, tier } = await req.json();

    if (!priceId || !userId) {
      return new Response(JSON.stringify({ error: "Missing priceId or userId" }), {
        status: 400,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Look up profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, email, stripe_customer_id")
      .eq("id", userId)
      .single();

    if (!profile) {
      return new Response(JSON.stringify({ error: "Profile not found" }), {
        status: 404,
        headers: { ...CORS, "Content-Type": "application/json" },
      });
    }

    // Reuse existing customer or let Stripe create one keyed by email
    const customerArg = profile.stripe_customer_id
      ? { customer: profile.stripe_customer_id }
      : { customer_email: profile.email };

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [{ price: priceId, quantity: 1 }],
      ...customerArg,
      client_reference_id: userId,
      metadata: { user_id: userId, tier: tier ?? "" },
      subscription_data: {
        trial_period_days: tier === "artisan" ? 7 : undefined,
        metadata: { user_id: userId, tier: tier ?? "" },
      },
      success_url: `${PORTAL_URL}/portal?checkout=success`,
      cancel_url: `${PORTAL_URL}/pricing?checkout=canceled`,
      allow_promotion_codes: true,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("checkout error:", err);
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...CORS, "Content-Type": "application/json" },
    });
  }
});
