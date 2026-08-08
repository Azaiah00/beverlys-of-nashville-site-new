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

/**
 * Temporary member-preview mode.
 *
 * Netlify Edge protects every /portal route with a server-side passcode cookie.
 * Once that gate succeeds, this flag unlocks the existing course UI without
 * requiring unfinished Supabase/Stripe member accounts.
 */
export function isAcademyPasscodeMode(): boolean {
  return import.meta.env.VITE_ACADEMY_PASSCODE_MODE === "true";
}
