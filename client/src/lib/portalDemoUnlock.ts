/**
 * Temporary demo mode: opens /portal without Supabase auth and unlocks all products.
 *
 * Set in .env.local:
 *   VITE_PORTAL_DEMO_UNLOCK=true
 *
 * Remove or set to false before production — never ship public demos with this on.
 */
export function isPortalDemoUnlock(): boolean {
  return import.meta.env.VITE_PORTAL_DEMO_UNLOCK === "true";
}
