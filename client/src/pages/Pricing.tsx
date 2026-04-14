/**
 * Beverly's Academy Portal — Pricing Page
 *
 * Three-tier comparison with founding member offer.
 * Clicking "Choose" hits Stripe Checkout via the checkout session endpoint.
 */
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import { PRICING } from "@/lib/products";
import { Nav, Footer } from "@/components/Layout";
import { Check, Sparkles, Crown } from "lucide-react";

const GOLD = "#C9A84C";
const GOLD_DARK = "#A8883A";
const CHARCOAL = "#1A1A1A";

export default function Pricing() {
  const { user, isAdmin } = useAuth();
  const [billing, setBilling] = useState<"monthly" | "annual">("annual");
  const [founding, setFounding] = useState(true); // default to founding offer

  const startCheckout = async (tierKey: "apprentice" | "artisan" | "master") => {
    if (!user) {
      window.location.href = `/signup?next=${encodeURIComponent("/pricing")}`;
      return;
    }
    const tier = PRICING[tierKey];
    let priceId: string;
    if (tierKey === "artisan" && founding) {
      priceId =
        billing === "monthly"
          ? tier.stripePriceIdFoundingMonthly!
          : tier.stripePriceIdFoundingAnnual!;
    } else {
      priceId = billing === "monthly" ? tier.stripePriceIdMonthly : tier.stripePriceIdAnnual;
    }

    // Call your Supabase Edge Function / server to create a Stripe Checkout session
    const res = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ priceId, userId: user.id, tier: tierKey }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <div style={{ background: CHARCOAL, color: "#fff", minHeight: "100vh", fontFamily: "Lato, sans-serif" }}>
      <Nav />

      <section style={{ padding: "120px 24px 60px", textAlign: "center", maxWidth: "900px", margin: "0 auto" }}>
        <p style={{ fontSize: "11px", letterSpacing: "4px", color: GOLD, textTransform: "uppercase", marginBottom: "16px" }}>
          Beverly's Academy Portal
        </p>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(40px, 6vw, 64px)", lineHeight: 1.1, margin: "0 0 20px" }}>
          One subscription.<br />
          <em style={{ color: GOLD, fontStyle: "italic" }}>Every product Teddy builds.</em>
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "620px", margin: "0 auto", lineHeight: 1.7 }}>
          Ebooks. Masterclasses. Interactive tools. Live Q&A. Community. All under one roof, on one domain, with progress that
          carries across every course you take.
        </p>

        {isAdmin && (
          <div style={{ background: GOLD, color: CHARCOAL, display: "inline-block", padding: "8px 16px", borderRadius: "4px", fontSize: "11px", fontWeight: 700, letterSpacing: "2px", marginTop: "24px" }}>
            ADMIN — ALL TIERS UNLOCKED
          </div>
        )}

        {/* Billing toggle */}
        <div
          style={{
            display: "inline-flex",
            background: "#1f1f1f",
            border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "40px",
            padding: "4px",
            marginTop: "40px",
          }}
        >
          {(["monthly", "annual"] as const).map((b) => (
            <button
              key={b}
              onClick={() => setBilling(b)}
              style={{
                padding: "10px 20px",
                border: "none",
                borderRadius: "40px",
                background: billing === b ? GOLD : "transparent",
                color: billing === b ? CHARCOAL : "rgba(255,255,255,0.6)",
                fontSize: "12px",
                fontWeight: 700,
                letterSpacing: "2px",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              {b === "annual" ? "Annual — save 2 mo" : "Monthly"}
            </button>
          ))}
        </div>

        {/* Founding banner */}
        <div
          style={{
            marginTop: "24px",
            padding: "14px 20px",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "rgba(201,168,76,0.08)",
            border: `1px dashed ${GOLD}`,
            borderRadius: "4px",
            fontSize: "13px",
            color: GOLD,
          }}
        >
          <Sparkles size={16} />
          <span>
            <strong>Founding Member Offer:</strong> First 100 Artisan signups lock in $39/mo for life.
          </span>
          <label style={{ marginLeft: "12px", cursor: "pointer", color: "#fff" }}>
            <input type="checkbox" checked={founding} onChange={(e) => setFounding(e.target.checked)} style={{ marginRight: "6px" }} />
            Apply
          </label>
        </div>
      </section>

      {/* ── Pricing Cards ── */}
      <section style={{ padding: "20px 24px 80px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
            gap: "24px",
          }}
        >
          <PriceCard
            tier={PRICING.apprentice}
            billing={billing}
            onChoose={() => startCheckout("apprentice")}
          />
          <PriceCard
            tier={PRICING.artisan}
            billing={billing}
            founding={founding}
            featured
            onChoose={() => startCheckout("artisan")}
          />
          <PriceCard
            tier={PRICING.master}
            billing={billing}
            onChoose={() => startCheckout("master")}
          />
        </div>

        <p style={{ textAlign: "center", fontSize: "13px", color: "rgba(255,255,255,0.4)", marginTop: "40px" }}>
          Secure checkout by Stripe · Cancel anytime from your account · 7-day trial on Artisan
        </p>
      </section>

      {/* ── FAQ ── */}
      <section style={{ padding: "40px 24px 100px", maxWidth: "760px", margin: "0 auto" }}>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "36px", textAlign: "center", marginBottom: "40px" }}>
          Common questions
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <Faq q="Can I cancel anytime?">
            Yes. Cancel with one click in your account. You keep access until the end of your billing period.
          </Faq>
          <Faq q="Do I keep lifetime access if I cancel?">
            Your access ends when your current billing period ends. But any completion certificates you've earned are yours
            forever.
          </Faq>
          <Faq q="Can I upgrade or downgrade tiers?">
            Anytime. Stripe prorates the difference automatically. Upgrades are instant.
          </Faq>
          <Faq q="Do you offer refunds?">
            Yes — 14-day money-back guarantee on annual plans. Monthly plans can be canceled before the next charge.
          </Faq>
          <Faq q="Is this for beginners or experienced stylists?">
            Both. The Cheat Sheet and Silk Press Blueprint serve apprentices and early-career stylists. The Color Mastery Guide
            and Consultation Vault are calibrated for 3+ years behind the chair.
          </Faq>
          <Faq q="Will new products be added?">
            Yes — one new interactive module every quarter, automatically unlocked at your tier. Your subscription is a
            lifetime key to a growing library.
          </Faq>
        </div>
      </section>

      <Footer />
    </div>
  );
}

/** ───── Pricing Card Component ───── */
function PriceCard({
  tier,
  billing,
  founding,
  featured,
  onChoose,
}: {
  tier: any;
  billing: "monthly" | "annual";
  founding?: boolean;
  featured?: boolean;
  onChoose: () => void;
}) {
  const showFounding = tier.tier === "artisan" && founding && tier.founding;
  const monthly = showFounding ? tier.founding.monthly : tier.monthly;
  const annual = showFounding ? tier.founding.annual : tier.annual;
  const displayPrice = billing === "monthly" ? monthly : annual;
  const displayCycle = billing === "monthly" ? "/mo" : "/yr";

  return (
    <div
      style={{
        background: featured ? "linear-gradient(180deg, rgba(201,168,76,0.08) 0%, rgba(201,168,76,0.02) 100%)" : "#1a1a1a",
        border: featured ? `2px solid ${GOLD}` : "1px solid rgba(255,255,255,0.08)",
        borderRadius: "12px",
        padding: "32px 28px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {featured && (
        <div
          style={{
            position: "absolute",
            top: "-14px",
            left: "50%",
            transform: "translateX(-50%)",
            background: GOLD,
            color: CHARCOAL,
            fontSize: "10px",
            fontWeight: 700,
            letterSpacing: "2px",
            padding: "6px 14px",
            borderRadius: "40px",
            textTransform: "uppercase",
          }}
        >
          Most Popular
        </div>
      )}
      {tier.tier === "master" && (
        <Crown size={24} color={GOLD} style={{ marginBottom: "12px" }} />
      )}

      <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD_DARK, textTransform: "uppercase", marginBottom: "8px" }}>
        {tier.name}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "8px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "48px", lineHeight: 1 }}>${displayPrice}</div>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)" }}>{displayCycle}</div>
      </div>
      {showFounding && (
        <div style={{ fontSize: "11px", color: GOLD, marginBottom: "8px" }}>
          Founding Member price — locked for life
        </div>
      )}
      {billing === "annual" && (
        <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", marginBottom: "20px" }}>
          Save ${tier.annualSavings}/year vs monthly
        </div>
      )}
      <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.5, marginBottom: "20px", minHeight: "42px" }}>
        {tier.tagline}
      </p>

      <ul style={{ listStyle: "none", padding: 0, margin: "0 0 24px", flex: 1 }}>
        {tier.features.map((f: string) => (
          <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "8px 0", fontSize: "14px", color: "rgba(255,255,255,0.85)", lineHeight: 1.5 }}>
            <Check size={16} color={GOLD} style={{ flexShrink: 0, marginTop: "4px" }} />
            <span>{f}</span>
          </li>
        ))}
      </ul>

      <button
        onClick={onChoose}
        style={{
          width: "100%",
          padding: "14px",
          background: featured ? GOLD : "transparent",
          color: featured ? CHARCOAL : GOLD,
          border: `1px solid ${GOLD}`,
          borderRadius: "4px",
          fontSize: "12px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        Choose {tier.name}
      </button>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", padding: "18px 22px" }}>
      <summary style={{ fontFamily: "Georgia, serif", fontSize: "17px", cursor: "pointer", listStyle: "none" }}>{q}</summary>
      <p style={{ marginTop: "12px", fontSize: "14px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>{children}</p>
    </details>
  );
}
