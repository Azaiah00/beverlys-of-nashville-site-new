/**
 * Beverly's Academy Portal — Admin Whitelist
 * ----------------------------------------------------------------
 * Every email here automatically bypasses EVERY paywall and tier gate.
 * Couture House team, Teddy, and Monica see every product, tool, and
 * admin panel without ever needing a subscription.
 *
 * TWO layers of protection:
 *   1. This constant (client-side quick check for UI).
 *   2. The `is_admin` boolean column on the Supabase `profiles` table
 *      (server-side truth for row-level security).
 *
 * To grant admin:
 *   - Add email below, AND
 *   - In Supabase, run:  UPDATE profiles SET is_admin = true WHERE email = '...';
 *
 * To revoke:
 *   - Remove from here, AND
 *   - In Supabase, run:  UPDATE profiles SET is_admin = false WHERE email = '...';
 */

export const ADMIN_EMAILS: string[] = [
  // ── Couture House team ──
  "hello@couturehouse.co",

  // ── Beverly's of Nashville ──
  "teddy@beverlysofnashville.com",
  "monica@beverlysofnashville.com",

  // Add additional admin emails below as needed.
  // Make sure to also run the Supabase UPDATE above.
];

/** Case-insensitive admin check for an email. */
export function isAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = email.trim().toLowerCase();
  return ADMIN_EMAILS.some((e) => e.toLowerCase() === normalized);
}
