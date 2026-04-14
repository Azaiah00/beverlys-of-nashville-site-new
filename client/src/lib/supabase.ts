/**
 * Beverly's Academy Portal — Supabase Client
 *
 * Expects two env vars (Vite):
 *   VITE_SUPABASE_URL
 *   VITE_SUPABASE_ANON_KEY
 *
 * Install: pnpm add @supabase/supabase-js
 */
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!url || !anonKey) {
  // eslint-disable-next-line no-console
  console.warn(
    "[Beverly's Portal] Supabase env vars missing. " +
      "Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to enable the portal.",
  );
}

export const supabase: SupabaseClient = createClient(
  url ?? "https://placeholder.supabase.co",
  anonKey ?? "placeholder-anon-key",
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  },
);

export type Tier = "free" | "apprentice" | "artisan" | "master";

export type Profile = {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  stripe_customer_id: string | null;
  role: string | null; // 'stylist' | 'owner' | 'enthusiast'
  is_admin: boolean;
  created_at: string;
};

export type Subscription = {
  id: string;
  user_id: string;
  tier: Tier;
  status: "active" | "canceled" | "past_due" | "trialing" | "incomplete";
  stripe_subscription_id: string | null;
  current_period_end: string | null;
  cancel_at_period_end: boolean;
  created_at: string;
};

export type Entitlement = {
  user_id: string;
  product_slug: string;
  source: "subscription" | "one-time" | "gift" | "admin";
  granted_at: string;
  expires_at: string | null;
};

export type Progress = {
  user_id: string;
  product_slug: string;
  lesson_id: string;
  progress_pct: number;
  completed_at: string | null;
  last_watched_at: string | null;
  watch_seconds: number;
};
