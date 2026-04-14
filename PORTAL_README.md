# Beverly's Academy Portal — Setup Guide

Everything you need to take the new digital products portal from "files on disk" to
"live at beverlysofnashville.com/portal with real subscribers."

## What was built

```
client/src/
├── lib/
│   ├── admins.ts              # Hardcoded admin email whitelist (Couture, Teddy, Monica)
│   ├── supabase.ts            # Supabase client + shared types
│   └── products.ts            # Product catalog + PRICING block + tier logic
├── contexts/
│   └── AuthContext.tsx        # Auth + subscription + can() / hasTier() / isAdmin
├── components/
│   ├── ProtectedRoute.tsx     # Route gate — admins ALWAYS bypass paywalls
│   └── PortalLayout.tsx       # Sidebar shell for all portal pages
├── pages/
│   ├── Login.tsx              # Email+password, magic link, Google OAuth
│   ├── Signup.tsx
│   ├── Pricing.tsx            # 3 tiers, monthly/annual toggle, founding member
│   └── portal/
│       ├── PortalHome.tsx     # Dashboard
│       ├── Library.tsx        # All products with filters + lock state
│       ├── Progress.tsx       # Certificates + in-progress
│       ├── Account.tsx        # Profile + Stripe Customer Portal link
│       ├── products/
│       │   └── MasterColoristsCheatSheet.tsx  # Free — reference implementation
│       └── tools/
│           ├── ColorFormulator.tsx
│           └── ConsultationDecisionTree.tsx
supabase/
├── schema.sql                              # Run this in SQL Editor first
└── functions/
    ├── stripe-webhook/index.ts             # Keeps subs + tiers in sync
    ├── create-checkout-session/index.ts    # Starts a Stripe Checkout
    └── create-portal-session/index.ts      # Opens Stripe billing portal
```

## Admin bypass (critical)

The Couture House team, Teddy, and Monica should never hit a paywall. This is
enforced at **four** layers:

1. `client/src/lib/admins.ts` — hardcoded email whitelist (client-side fast path)
2. `profiles.is_admin` column in Postgres (server truth)
3. `handle_new_user()` trigger auto-flips `is_admin = true` for whitelisted emails on first login
4. `AuthContext.can()` short-circuits to `true` for admins for every product check

To add/remove an admin later:
- Update `ADMIN_EMAILS` in `client/src/lib/admins.ts` AND
- Run `update profiles set is_admin = true, role='admin' where lower(email)='NEW_EMAIL'`

## 1. Install dependencies

```bash
cd beverlys-new-site-teddy
pnpm add @supabase/supabase-js
# (stripe runs server-side inside the edge functions, no client install needed)
```

## 2. Create the Supabase project

1. Go to https://supabase.com/dashboard → **New project** → Free tier is fine to start
2. Copy `Project URL` + `anon public` key into `.env.local`:
   ```
   VITE_SUPABASE_URL=https://xxxxx.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGci...
   ```
3. Go to **SQL Editor** → paste the entire contents of `supabase/schema.sql` → **Run**
4. Under **Authentication → Providers** enable: Email (passwordless + password) and Google OAuth

## 3. Create Stripe products

Log into Stripe Dashboard → **Products**. Create three products:

| Product    | Monthly | Annual | Notes                         |
|------------|---------|--------|-------------------------------|
| Apprentice | $29/mo  | $297/yr | Always-on                     |
| Artisan    | $49/mo  | $497/yr | Plus founding: $39/mo, $397/yr |
| Master     | $99/mo  | $997/yr | Plus 1:1 add-on               |

Copy each price ID (starts with `price_...`) and paste them into:
- `client/src/lib/products.ts` → `PRICING` block (stripePriceIdMonthly / Annual / Founding)
- Supabase → **Edge Functions → Secrets** → set:
  ```
  PRICE_APPRENTICE_MONTHLY=price_xxx
  PRICE_APPRENTICE_ANNUAL=price_xxx
  PRICE_ARTISAN_MONTHLY=price_xxx
  PRICE_ARTISAN_ANNUAL=price_xxx
  PRICE_ARTISAN_FOUNDING_MONTHLY=price_xxx
  PRICE_ARTISAN_FOUNDING_ANNUAL=price_xxx
  PRICE_MASTER_MONTHLY=price_xxx
  PRICE_MASTER_ANNUAL=price_xxx
  ```

## 4. Deploy edge functions

```bash
npm install -g supabase
supabase login
supabase link --project-ref <your-project-ref>

supabase functions deploy stripe-webhook --no-verify-jwt
supabase functions deploy create-checkout-session --no-verify-jwt
supabase functions deploy create-portal-session --no-verify-jwt
```

Set secrets:
```bash
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx    # from step 5
supabase secrets set PORTAL_URL=https://beverlysofnashville.com
```

## 5. Configure Stripe webhook

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. URL: `https://<project>.functions.supabase.co/stripe-webhook`
3. Events:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
4. Copy the **Signing secret** (starts with `whsec_`) and run the `supabase secrets set STRIPE_WEBHOOK_SECRET=...` from step 4

## 6. Wire Netlify to call the edge functions

The client uses `/api/create-checkout-session` and `/api/create-portal-session`.
Add a redirect in `netlify.toml`:

```toml
[[redirects]]
  from = "/api/create-checkout-session"
  to = "https://<project>.functions.supabase.co/create-checkout-session"
  status = 200
  force = true

[[redirects]]
  from = "/api/create-portal-session"
  to = "https://<project>.functions.supabase.co/create-portal-session"
  status = 200
  force = true
```

## 7. First admin login

1. Run the site locally: `pnpm dev`
2. Go to `/signup` → sign up with **hello@couturehouse.co**
3. The Postgres trigger auto-flips `is_admin = true`
4. Navigate to `/portal` — you should see the gold **ADMIN** badge and full access

Repeat for `teddy@beverlysofnashville.com` and `monica@beverlysofnashville.com`.

## 8. Port the remaining 6 HTML products

See `CURSOR_PROMPT.md` — drop that into Cursor/Claude, point it at one of the
remaining HTML files in `Digital Products&Courses/`, and it will produce a React
module matching the `MasterColoristsCheatSheet.tsx` pattern.

Remaining to port:
- `02-Silk-Press-Blueprint.html` → `SilkPressBlueprint.tsx` (Apprentice)
- `03-Hair-Color-Mastery-Guide.html` → `HairColorMasteryGuide.tsx` (Artisan)
- `04-Curl-Pattern-Decoder.html` → `CurlPatternDecoder.tsx` (Apprentice)
- `05-Chair-Confidence.html` → `ChairConfidence.tsx` (Artisan)
- `06-Consultation-Vault.html` → `ConsultationVault.tsx` (Artisan)
- `07-Salon-Owner-Playbook.html` → `SalonOwnerPlaybook.tsx` (Master)

After each port:
1. Add a route in `App.tsx` with `<ProtectedRoute requireProduct="slug">`
2. The product slug is already in `client/src/lib/products.ts` — no catalog edit needed

## 9. Optional: Cloudflare Stream for video lessons

Teddy's interactive courses can embed video via Cloudflare Stream. Sign up, upload,
grab the embed code, drop it into any lesson module. No DRM, no hotlinking.

## Testing the paywall

1. Open an incognito window → `/signup` with a non-admin email
2. Confirm email → redirected to `/portal` (free tier)
3. Navigate to `/portal/library` → all paid products show a lock icon
4. Click a locked product → redirects to `/pricing`
5. Pay via Stripe test card `4242 4242 4242 4242` → webhook fires → tier upgraded → access unlocked

## Gotchas

- **Google OAuth** needs the redirect URL `https://beverlysofnashville.com/login` (and localhost) whitelisted in both Supabase Auth and the Google Cloud Console.
- **Free tier Supabase** caps at 50K MAU and 500MB DB — plenty for launch.
- **Stripe test vs live**: keep TWO sets of price IDs; swap env vars before going live.
- **Founding member cap (100 slots)**: track via `subscriptions.founding_member = true` — add a UI "86 of 100 left" banner once counts cross 50.

---

Questions? hello@couturehouse.co
