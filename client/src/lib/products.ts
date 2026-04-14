/**
 * Beverly's Academy Portal — Product Catalog & Tier Configuration
 * ----------------------------------------------------------------
 * Single source of truth for:
 *   - What products exist
 *   - What tier unlocks each product
 *   - What route each product lives at
 *   - What tools exist and which tier unlocks them
 *
 * To add a new product:
 *   1. Add entry below
 *   2. Create page at client/src/pages/portal/products/[slug].tsx
 *   3. Register route in App.tsx
 *   4. Done. Tier gating is automatic.
 */
import type { Tier } from "./supabase";

export type ProductCategory = "ebook" | "masterclass" | "toolkit" | "tool";

export interface Product {
  slug: string;
  title: string;
  subtitle: string;
  category: ProductCategory;
  /** Lowest tier required to access. 'free' = anyone signed in. */
  requiredTier: Tier;
  /** Route path under /portal */
  path: string;
  /** Display order in Library */
  order: number;
  /** Source HTML filename (for reference) */
  sourceHtml?: string;
  /** Hero thumbnail image */
  thumbnail?: string;
  /** Estimated duration to complete */
  duration?: string;
  /** # of lessons/modules */
  lessonCount?: number;
  /** Preview — first lesson available to lower tiers for marketing */
  freePreview?: boolean;
}

export const PRODUCTS: Product[] = [
  {
    slug: "master-colorists-cheat-sheet",
    title: "The Master Colorist's Cheat Sheet",
    subtitle: "The interactive color reference every stylist keeps open behind the chair.",
    category: "ebook",
    requiredTier: "free",
    path: "/portal/products/master-colorists-cheat-sheet",
    order: 1,
    sourceHtml: "01-Master-Colorists-Cheat-Sheet.html",
    duration: "30 min read",
    lessonCount: 8,
  },
  {
    slug: "silk-press-blueprint",
    title: "The Silk Press Blueprint",
    subtitle: "Teddy's complete silk press system — consultation to flawless finish.",
    category: "masterclass",
    requiredTier: "apprentice",
    path: "/portal/products/silk-press-blueprint",
    order: 2,
    sourceHtml: "02-Silk-Press-Blueprint.html",
    duration: "2.5 hours",
    lessonCount: 10,
  },
  {
    slug: "hair-color-mastery-guide",
    title: "Hair Color Mastery Guide",
    subtitle: "The flagship formulation system — consultation, application, correction, toning.",
    category: "masterclass",
    requiredTier: "artisan",
    path: "/portal/products/hair-color-mastery-guide",
    order: 3,
    sourceHtml: "03-Hair-Color-Mastery-Guide.html",
    duration: "4 hours",
    lessonCount: 14,
  },
  {
    slug: "wig-construction-companion",
    title: "Wig Construction Masterclass Companion",
    subtitle: "From hair selection to flawless install — the Beverly's wig methodology.",
    category: "masterclass",
    requiredTier: "artisan",
    path: "/portal/products/wig-construction-companion",
    order: 4,
    sourceHtml: "04-Wig-Construction-Companion.html",
    duration: "3 hours",
    lessonCount: 9,
    freePreview: true, // Chapter 1 free for Apprentice as upsell teaser
  },
  {
    slug: "pricing-profit-playbook",
    title: "The Stylist's Pricing & Profit Playbook",
    subtitle: "Stop charging what you're worth. Start charging what the work is worth.",
    category: "ebook",
    requiredTier: "apprentice",
    path: "/portal/products/pricing-profit-playbook",
    order: 5,
    sourceHtml: "05-Pricing-Profit-Playbook.html",
    duration: "90 min read",
    lessonCount: 7,
  },
  {
    slug: "consultation-vault",
    title: "The Consultation Vault",
    subtitle: "The exact questions, scripts, and red-flag checks Teddy uses in every consult.",
    category: "toolkit",
    requiredTier: "artisan",
    path: "/portal/products/consultation-vault",
    order: 6,
    sourceHtml: "06-Consultation-Vault.html",
    duration: "2 hours",
    lessonCount: 11,
  },
  {
    slug: "salon-owners-launch-kit",
    title: "The Salon Owner's Launch Kit",
    subtitle: "Everything Teddy wishes he'd known before opening Beverly's.",
    category: "toolkit",
    requiredTier: "artisan",
    path: "/portal/products/salon-owners-launch-kit",
    order: 7,
    sourceHtml: "06-Salon-Owners-Launch-Kit.html",
    duration: "3.5 hours",
    lessonCount: 12,
  },
];

/** Interactive tools — separate from product catalog, live under /portal/tools/* */
export const TOOLS: Product[] = [
  {
    slug: "color-formulator",
    title: "Color Formulator",
    subtitle: "Input current + target. Output: Teddy's formula.",
    category: "tool",
    requiredTier: "artisan",
    path: "/portal/tools/formulator",
    order: 1,
  },
  {
    slug: "consultation-decision-tree",
    title: "Consultation Decision Tree",
    subtitle: "Branching quiz that ends in the exact protocol for every client scenario.",
    category: "tool",
    requiredTier: "artisan",
    path: "/portal/tools/consultation",
    order: 2,
  },
];

/** ───── Tier Utilities ───── */

/** Rank tiers so we can compare access. Higher rank unlocks lower ranks. */
const TIER_RANK: Record<Tier, number> = {
  free: 0,
  apprentice: 1,
  artisan: 2,
  master: 3,
};

/** Does a given tier satisfy the minimum tier required for a product? */
export function tierSatisfies(userTier: Tier, required: Tier): boolean {
  return TIER_RANK[userTier] >= TIER_RANK[required];
}

/** Lookup product by slug. */
export function getProduct(slug: string): Product | undefined {
  return [...PRODUCTS, ...TOOLS].find((p) => p.slug === slug);
}

/** All products + tools. */
export const ALL_PRODUCTS: Product[] = [...PRODUCTS, ...TOOLS];

/** ───── Pricing ───── */

export const PRICING = {
  apprentice: {
    tier: "apprentice" as Tier,
    name: "Apprentice",
    tagline: "The foundation. Every foundational product, all four ebooks, completion certificates.",
    monthly: 29,
    annual: 297,
    annualSavings: 51, // 29*12 - 297
    features: [
      "All 4 foundational ebooks (Cheat Sheet, Silk Press, Pricing Playbook + Chapter 1 Wig Construction)",
      "Progress tracking across the library",
      "Completion certificates",
      "New foundational content added monthly",
      "Access to Beverly's Academy community",
      "Cancel anytime",
    ],
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_APPRENTICE_MONTHLY ?? "price_apprentice_monthly",
    stripePriceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_APPRENTICE_ANNUAL ?? "price_apprentice_annual",
  },
  artisan: {
    tier: "artisan" as Tier,
    name: "Artisan",
    tagline: "The serious stylist's choice. Flagship masterclasses, interactive tools, monthly live Q&A.",
    monthly: 49,
    annual: 497,
    annualSavings: 91,
    founding: { monthly: 39, annual: 397 }, // First 100 signups
    mostPopular: true,
    features: [
      "Everything in Apprentice",
      "Hair Color Mastery Guide (flagship course)",
      "Wig Construction Masterclass (full)",
      "The Consultation Vault + decision tree tool",
      "The Salon Owner's Launch Kit",
      "Color Formulator — Teddy's live formula engine",
      "Monthly live Q&A with Teddy",
      "Premium completion certificates",
    ],
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_ARTISAN_MONTHLY ?? "price_artisan_monthly",
    stripePriceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_ARTISAN_ANNUAL ?? "price_artisan_annual",
    stripePriceIdFoundingMonthly: import.meta.env.VITE_STRIPE_PRICE_ARTISAN_FOUNDING_MONTHLY ?? "price_artisan_founding_monthly",
    stripePriceIdFoundingAnnual: import.meta.env.VITE_STRIPE_PRICE_ARTISAN_FOUNDING_ANNUAL ?? "price_artisan_founding_annual",
  },
  master: {
    tier: "master" as Tier,
    name: "Master",
    tagline: "For the stylist building a legacy. Everything + 1:1 mentorship with Teddy.",
    monthly: 99,
    annual: 997,
    annualSavings: 191,
    features: [
      "Everything in Artisan",
      "2 × 1:1 mentorship sessions per quarter with Teddy",
      "Private Master community (Artisan community + direct line to Teddy)",
      "Accredited completion certificates",
      "Early access to new products before public launch",
      "Annual in-person retreat eligibility (Nashville)",
    ],
    stripePriceIdMonthly: import.meta.env.VITE_STRIPE_PRICE_MASTER_MONTHLY ?? "price_master_monthly",
    stripePriceIdAnnual: import.meta.env.VITE_STRIPE_PRICE_MASTER_ANNUAL ?? "price_master_annual",
  },
} as const;
