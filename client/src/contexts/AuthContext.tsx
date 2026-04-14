/**
 * Beverly's Academy Portal — Auth Context
 * ----------------------------------------------------------------
 * Wraps the entire app. Exposes:
 *   - session (Supabase session)
 *   - user (currently authed user)
 *   - profile (Supabase profile row, including is_admin)
 *   - subscription (current active subscription, or null)
 *   - tier ('free' | 'apprentice' | 'artisan' | 'master')
 *   - isAdmin (auto-bypass-paywall flag)
 *   - can(productSlug) -> boolean (tier OR admin check)
 *   - signIn / signUp / signOut / signInWithGoogle / sendMagicLink
 *
 * Admin bypass: if isAdmin === true, can() ALWAYS returns true for every product.
 * That's what lets Teddy, Monica, and Couture House walk through every paywall.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase, type Profile, type Subscription, type Tier } from "@/lib/supabase";
import { isAdminEmail } from "@/lib/admins";
import { getProduct, tierSatisfies } from "@/lib/products";

interface AuthContextValue {
  loading: boolean;
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  subscription: Subscription | null;
  tier: Tier;
  isAdmin: boolean;

  /** True if current user can access a given product slug. Admin always true. */
  can: (productSlug: string) => boolean;

  /** True if current user's tier (or admin status) satisfies the required tier. */
  hasTier: (requiredTier: Tier) => boolean;

  /** Auth actions */
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithGoogle: () => Promise<{ error: string | null }>;
  sendMagicLink: (email: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const loadProfileAndSubscription = useCallback(async (u: User) => {
    const [{ data: profileData }, { data: subData }] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", u.id).maybeSingle(),
      supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", u.id)
        .in("status", ["active", "trialing"])
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    // If no profile yet, create one (first-login bootstrap).
    if (!profileData) {
      const newProfile = {
        id: u.id,
        email: u.email ?? "",
        full_name: u.user_metadata?.full_name ?? null,
        avatar_url: u.user_metadata?.avatar_url ?? null,
        is_admin: isAdminEmail(u.email),
      };
      const { data: inserted } = await supabase
        .from("profiles")
        .insert(newProfile)
        .select()
        .single();
      setProfile((inserted as Profile) ?? null);
    } else {
      // Auto-sync: if email is in ADMIN_EMAILS but DB hasn't been updated, patch it.
      const shouldBeAdmin = isAdminEmail(u.email);
      if (shouldBeAdmin && !profileData.is_admin) {
        const { data: updated } = await supabase
          .from("profiles")
          .update({ is_admin: true })
          .eq("id", u.id)
          .select()
          .single();
        setProfile((updated as Profile) ?? (profileData as Profile));
      } else {
        setProfile(profileData as Profile);
      }
    }

    setSubscription((subData as Subscription) ?? null);
  }, []);

  useEffect(() => {
    let mounted = true;

    // Initial session load
    supabase.auth.getSession().then(async ({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setUser(data.session?.user ?? null);
      if (data.session?.user) {
        await loadProfileAndSubscription(data.session.user);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (_event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      if (s?.user) {
        await loadProfileAndSubscription(s.user);
      } else {
        setProfile(null);
        setSubscription(null);
      }
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, [loadProfileAndSubscription]);

  // ── Compute tier & admin flag ──
  const isAdmin = Boolean(profile?.is_admin) || isAdminEmail(user?.email);

  const tier: Tier = (() => {
    if (!user) return "free";
    if (subscription && subscription.status === "active") {
      return subscription.tier;
    }
    if (subscription && subscription.status === "trialing") {
      return subscription.tier;
    }
    return "free";
  })();

  // ── Access check (with admin bypass) ──
  const can = useCallback(
    (productSlug: string): boolean => {
      // 1. Admin always wins.
      if (isAdmin) return true;

      // 2. Product lookup
      const product = getProduct(productSlug);
      if (!product) return false;

      // 3. Free products only require auth.
      if (product.requiredTier === "free") return Boolean(user);

      // 4. Tier check.
      return tierSatisfies(tier, product.requiredTier);
    },
    [isAdmin, tier, user],
  );

  const hasTier = useCallback(
    (requiredTier: Tier): boolean => {
      if (isAdmin) return true;
      return tierSatisfies(tier, requiredTier);
    },
    [isAdmin, tier],
  );

  // ── Auth actions ──
  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/portal`,
      },
    });
    return { error: error?.message ?? null };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/portal` },
    });
    return { error: error?.message ?? null };
  };

  const sendMagicLink = async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/portal` },
    });
    return { error: error?.message ?? null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSubscription(null);
  };

  const refresh = async () => {
    if (user) await loadProfileAndSubscription(user);
  };

  const value: AuthContextValue = {
    loading,
    session,
    user,
    profile,
    subscription,
    tier,
    isAdmin,
    can,
    hasTier,
    signUp,
    signIn,
    signInWithGoogle,
    sendMagicLink,
    signOut,
    refresh,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
