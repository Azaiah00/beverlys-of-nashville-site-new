/**
 * Beverly's Academy Portal — Protected Route
 *
 * Usage:
 *   <ProtectedRoute>                            // requires any signed-in user
 *   <ProtectedRoute requireTier="artisan">      // requires Artisan or higher
 *   <ProtectedRoute requireProduct="slug">      // requires product access
 *
 * ADMIN BYPASS: Any user with is_admin=true or email in ADMIN_EMAILS
 * automatically passes every gate — no paywall, no login prompt if already
 * signed in, no tier check.
 */
import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import type { Tier } from "@/lib/supabase";

interface Props {
  children: React.ReactNode;
  requireTier?: Tier;
  requireProduct?: string;
  /** Where to redirect unauthenticated users */
  loginRedirect?: string;
  /** Where to redirect under-entitled users */
  upgradeRedirect?: string;
}

export default function ProtectedRoute({
  children,
  requireTier,
  requireProduct,
  loginRedirect = "/login",
  upgradeRedirect = "/pricing",
}: Props) {
  const { loading, user, isAdmin, portalDemoUnlock, can, hasTier } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    if (loading) return;

    // 1. Not logged in → redirect to login (skip when demo unlock flag is on)
    if (!user && !portalDemoUnlock) {
      setLocation(`${loginRedirect}?next=${encodeURIComponent(location)}`);
      return;
    }

    // 2. Admin or demo unlock — always allow past auth / paywall gates
    if (isAdmin || portalDemoUnlock) return;

    // 3. Product-specific check
    if (requireProduct && !can(requireProduct)) {
      setLocation(upgradeRedirect);
      return;
    }

    // 4. Tier check
    if (requireTier && !hasTier(requireTier)) {
      setLocation(upgradeRedirect);
      return;
    }
  }, [
    loading,
    user,
    isAdmin,
    portalDemoUnlock,
    requireProduct,
    requireTier,
    can,
    hasTier,
    setLocation,
    location,
    loginRedirect,
    upgradeRedirect,
  ]);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#1a1a1a",
          color: "#C9A84C",
          fontFamily: "Georgia, serif",
          fontSize: "14px",
          letterSpacing: "3px",
          textTransform: "uppercase",
        }}
      >
        Loading Portal…
      </div>
    );
  }

  if (!user && !portalDemoUnlock) return null; // redirect will fire
  if (!isAdmin && !portalDemoUnlock && requireProduct && !can(requireProduct)) return null;
  if (!isAdmin && !portalDemoUnlock && requireTier && !hasTier(requireTier)) return null;

  return <>{children}</>;
}
