/**
 * Beverly's of Nashville — Home Page
 * Design: "Craftsman's Gold" — matches uploaded index.html exactly
 * Dark charcoal #1A1A1A + Gold #C9A84C, Georgia serif, sharp rectangles
 * Uses ONLY real uploaded photos + AI-generated images matching salon aesthetic
 */
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Briefcase,
  Crown,
  Droplets,
  Flower2,
  Gem,
  Leaf,
  Palette,
  Ribbon,
  Scissors,
  Sparkles,
  Wind,
} from "lucide-react";
import { BevFeatureCheck, BevListCheck } from "@/components/BevLucide";
import { Nav, Footer } from "@/components/Layout";

/** Replace when Kit is configured — home waitlist posts to this Kit form. */
const KIT_FORM_ID_WAITLIST = "KIT_FORM_ID_WAITLIST";
/** Placeholder checkout / product URLs for Academy teaser buttons. */
const EBOOK_URL_1 = "EBOOK_URL_1";
const EBOOK_URL_2 = "EBOOK_URL_2";
const COURSE_URL_1 = "COURSE_URL_1";

/** The Reveal Session — base + clickable add-ons + celebration packages (home estimator). */
const REVEAL_BASE = 375;

const REVEAL_ADDONS = [
  { id: "outfit", label: "Extra Outfit Change", price: 50 },
  { id: "rush", label: "Rush 24hr Photo Delivery", price: 35 },
  { id: "photo60", label: "Extended Photo Session (60 min)", price: 75 },
  { id: "deep", label: "Deep Conditioning Mask", price: 40 },
  { id: "secondlook", label: "Second Hair Look (same visit)", price: 55 },
  { id: "clipin", label: "Clip-in / Extension Blend", price: 45 },
  { id: "brow", label: "Brow Sculpt & Fill", price: 35 },
  { id: "lash", label: "Lash Strip Application", price: 40 },
  { id: "steam", label: "Steam Treatment & Gloss", price: 30 },
  { id: "vip", label: "VIP Buffer (+15 min salon time)", price: 25 },
] as const;

type RevealPackageDef = {
  id: string;
  name: string;
  blurb: string;
  price: number;
  includedAddonIds: readonly string[];
  badge?: string;
};

const REVEAL_PACKAGES: readonly RevealPackageDef[] = [
  {
    id: "prom",
    name: "Prom Night",
    blurb: "Second look energy, rushed gallery, and lashes — camera-ready for the dance floor.",
    price: 458,
    includedAddonIds: ["secondlook", "rush", "lash"],
    badge: "Spring season",
  },
  {
    id: "wedding",
    name: "Bridal & Bridesmaids",
    blurb: "Extended shoot time, outfit change, and deep treatment for veil-ready shine.",
    price: 529,
    includedAddonIds: ["photo60", "outfit", "deep"],
    badge: "Most booked",
  },
  {
    id: "anniversary",
    name: "Anniversary Date Night",
    blurb: "Steam gloss, brows, and rush delivery so you have proofs before your reservation.",
    price: 469,
    includedAddonIds: ["steam", "brow", "rush"],
  },
  {
    id: "birthday",
    name: "Birthday Spotlight",
    blurb: "Clip-ins, outfit change, and VIP buffer — main character energy all day.",
    price: 489,
    includedAddonIds: ["clipin", "outfit", "vip"],
  },
  {
    id: "milestone",
    name: "Milestone Glow-Up",
    blurb: "Deep mask, second look, and extended photos — for new jobs, new chapters, new you.",
    price: 519,
    includedAddonIds: ["deep", "secondlook", "photo60"],
  },
  {
    id: "corporate",
    name: "Executive Headshot Day",
    blurb: "Rush edits, brow cleanup, and steam polish — LinkedIn-ready the next morning.",
    price: 449,
    includedAddonIds: ["rush", "brow", "steam"],
  },
] as const;

function addonPrice(id: string): number {
  return REVEAL_ADDONS.find(a => a.id === id)?.price ?? 0;
}

function packageRetail(pkg: RevealPackageDef): number {
  return REVEAL_BASE + pkg.includedAddonIds.reduce((s, id) => s + addonPrice(id), 0);
}

/** Interactive total, celebration packages, and à la carte toggles for The Reveal Session. */
function RevealSessionEstimator() {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());
  const [activePackageId, setActivePackageId] = useState<string | null>(null);

  const activePkg = activePackageId ? REVEAL_PACKAGES.find(p => p.id === activePackageId) ?? null : null;

  const totalAlaCarte = REVEAL_BASE + Array.from(selected).reduce((s, id) => s + addonPrice(id), 0);
  const total = activePkg ? activePkg.price : totalAlaCarte;
  const compareAt = activePkg ? packageRetail(activePkg) : null;
  const saving = compareAt !== null && compareAt > total ? compareAt - total : 0;

  const toggleAddon = (id: string) => {
    setActivePackageId(null);
    setSelected(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectPackage = (id: string) => {
    setActivePackageId(prev => (prev === id ? null : id));
    setSelected(new Set());
  };

  const clearAll = () => {
    setActivePackageId(null);
    setSelected(new Set());
  };

  const isAddonOn = (id: string) => {
    if (activePkg) return activePkg.includedAddonIds.includes(id);
    return selected.has(id);
  };

  const summaryLines: string[] = [];
  if (activePkg) {
    summaryLines.push(`Package: ${activePkg.name}`);
    summaryLines.push(`Included add-ons: ${activePkg.includedAddonIds.map(i => REVEAL_ADDONS.find(a => a.id === i)?.label ?? i).join(", ")}`);
  } else if (selected.size) {
    summaryLines.push(`À la carte: ${Array.from(selected).map(id => `${REVEAL_ADDONS.find(a => a.id === id)?.label ?? id} (+$${addonPrice(id)})`).join("; ")}`);
  } else {
    summaryLines.push("The Reveal Session base package only");
  }
  summaryLines.push(`Estimate total: $${total}`);

  const mailBody = encodeURIComponent(summaryLines.join("\n"));
  const mailtoEstimate = `mailto:teddy@beverlysofnashville.com?subject=${encodeURIComponent("The Reveal Session — My estimate")}&body=${mailBody}`;

  return (
    <div
      className="fade-up reveal-a-la-carte"
      style={{
        marginTop: "8px",
        paddingTop: "28px",
        borderTop: "1px solid rgba(201,168,76,0.22)",
        maxWidth: "560px",
      }}
    >
      <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "8px" }}>
        Build your session
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "12px 20px", marginBottom: "8px" }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "clamp(40px, 6vw, 52px)", color: "#C9A84C", lineHeight: 1 }}>
          ${total}
        </span>
        {compareAt !== null && compareAt > total && (
          <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", textDecoration: "line-through" }}>
            ${compareAt} à la carte
          </span>
        )}
        {saving > 0 && (
          <span style={{ fontSize: "12px", letterSpacing: "1px", color: "#C9A84C", textTransform: "uppercase" }}>
            Package saves ${saving}
          </span>
        )}
      </div>
      <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "22px", lineHeight: 1.6 }}>
        Tap a celebration package for a bundled rate, or mix your own add-ons. Base Reveal (${REVEAL_BASE}) is always included. Final price confirmed when you book.
      </p>

      <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "12px" }}>
        Celebration packages
      </p>
      <div className="reveal-packages-grid" style={{ marginBottom: "28px" }}>
        {REVEAL_PACKAGES.map(pkg => {
          const on = activePackageId === pkg.id;
          return (
            <button
              key={pkg.id}
              type="button"
              onClick={() => selectPackage(pkg.id)}
              style={{
                textAlign: "left",
                background: on ? "rgba(201,168,76,0.12)" : "rgba(17,17,17,0.9)",
                border: on ? "2px solid #C9A84C" : "1px solid rgba(201,168,76,0.25)",
                padding: "16px 16px 18px",
                borderRadius: 0,
                cursor: "pointer",
                color: "#fff",
                fontFamily: "inherit",
              }}
            >
              {pkg.badge && (
                <span style={{ display: "inline-block", fontSize: "8px", letterSpacing: "2px", textTransform: "uppercase", color: "#111", background: "#C9A84C", padding: "4px 8px", marginBottom: "10px" }}>
                  {pkg.badge}
                </span>
              )}
              <div style={{ fontFamily: "Georgia, serif", fontSize: "17px", color: "#fff", marginBottom: "6px" }}>{pkg.name}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.55)", lineHeight: 1.55, marginBottom: "12px" }}>{pkg.blurb}</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#C9A84C" }}>${pkg.price}</div>
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>Tap again to deselect</div>
            </button>
          );
        })}
      </div>

      <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "12px" }}>
        À la carte add-ons
      </p>
      <div className="reveal-a-la-grid">
        {REVEAL_ADDONS.map(a => {
          const on = isAddonOn(a.id);
          const pkgLocked = Boolean(activePkg);
          return (
            <button
              key={a.id}
              type="button"
              disabled={pkgLocked}
              onClick={() => toggleAddon(a.id)}
              aria-pressed={on}
              style={{
                background: on ? "rgba(201,168,76,0.14)" : "rgba(17,17,17,0.85)",
                border: on ? "2px solid #C9A84C" : "1px solid rgba(201,168,76,0.2)",
                padding: "14px 12px",
                borderRadius: 0,
                textAlign: "center",
                cursor: pkgLocked ? "default" : "pointer",
                opacity: pkgLocked && !on ? 0.4 : 1,
                color: "#fff",
                fontFamily: "inherit",
              }}
            >
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.85)", lineHeight: 1.35, marginBottom: "8px" }}>
                {a.label}
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", color: "#C9A84C" }}>+${a.price}</div>
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "16px", marginTop: "20px" }}>
        {(activePackageId || selected.size > 0) && (
          <button type="button" onClick={clearAll} className="btn-outline" style={{ fontSize: "10px", padding: "10px 18px" }}>
            Clear all
          </button>
        )}
        <a href={mailtoEstimate} className="btn-outline-gold" style={{ fontSize: "10px", padding: "10px 18px", display: "inline-block" }}>
          Email this estimate →
        </a>
      </div>
    </div>
  );
}

// ── Real photo CDN URLs (uploaded by client) ──────────────────────────────
const PHOTOS = {
  teddyHero: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddy-in-salon_3b149114.jpg",
  /** Home About — “The Artist Behind the Chair” (studio portrait with Beverly's branding). */
  teddyAbout: "/assets/teddy-artist-behind-chair.png",
  /** The Reveal Session — right-column hero (Teddy styling client, salon + logo). */
  revealSessionSalon: "/assets/reveal-session-salon.png",
};

// ── Fade-up hook ──────────────────────────────────────────────────────────
function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.12 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Home() {
  useFadeUp();

  return (
    <div style={{ background: "#1a1a1a", color: "#fff", minHeight: "100vh" }}>
      <Nav />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section id="hero" style={{
        position: "relative", minHeight: "100vh",
        display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #111 0%, #2a1f0e 100%)",
        overflow: "hidden"
      }}>
        <div className="hero-accent-line" />
        {/* Real photo background */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${PHOTOS.teddyHero})`,
          backgroundSize: "cover", backgroundPosition: "center 20%",
          opacity: 0.35
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(17,17,17,0.85) 50%, rgba(17,17,17,0.3))" }} />

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "var(--site-fixed-header-height, 106px)" }}>
          <p className="hero-eyebrow fade-up" style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "20px" }}>
            Nashville's Premier Hair Salon — Est. 1994
          </p>
          <h1 className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(42px, 7vw, 80px)", fontWeight: 400, lineHeight: 1.05, marginBottom: "10px" }}>
            Where Hair<br />
            <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Becomes Art.</em>
          </h1>
          <p className="fade-up" style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", maxWidth: "480px", lineHeight: 1.7, margin: "20px 0 36px" }}>
            30+ years of master-level artistry in color, styling, and custom wigs. Led by Teddy Chisom — Nashville's most trusted hair artist.
          </p>
          <div className="fade-up" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville" target="_blank" rel="noopener noreferrer" className="btn-gold">
              Book Your Appointment →
            </a>
            <a href="#services" className="btn-outline">Explore Services</a>
          </div>

          {/* Stats */}
          <div className="fade-up hero-stats" style={{ display: "flex", gap: "48px", marginTop: "64px", paddingTop: "40px", borderTop: "1px solid rgba(201,168,76,0.2)", flexWrap: "wrap" }}>
            {[
              { num: "30+", label: "Years of Excellence" },
              { num: "5,000+", label: "Happy Clients" },
              { num: "3", label: "Revenue Pillars" },
              { num: "100%", label: "Satisfaction Guaranteed" },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "36px", color: "#C9A84C" }}>{s.num}</div>
                <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginTop: "4px" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ ABOUT ═════════════════════════════════════════════════════════════ */}
      <section id="about" className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          <div className="about-grid">
            {/* Image */}
            <div className="fade-up" style={{ position: "relative", overflow: "hidden" }}>
              <img
                src={PHOTOS.teddyAbout}
                alt="Teddy Chisom — Master Stylist at Beverly's of Nashville"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "center 20%" }}
              />
              <div style={{
                position: "absolute", bottom: "0", right: "0",
                width: "clamp(80px, 18vw, 120px)", height: "clamp(80px, 18vw, 120px)", background: "#C9A84C",
                display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"
              }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "36px", color: "#111", lineHeight: 1 }}>30+</div>
                <div style={{ fontSize: "8px", letterSpacing: "1.5px", textTransform: "uppercase", color: "#111", marginTop: "4px", textAlign: "center" }}>Years<br />Mastery</div>
              </div>
            </div>

            {/* Content */}
            <div>
              <p className="eyebrow fade-up">The Artist Behind the Chair</p>
              <h2 className="section-title fade-up">Teddy Chisom —<br /><em style={{ color: "#C9A84C" }}>Nashville's Hair Legend.</em></h2>
              <div className="hr-gold fade-up" />
              <p className="fade-up" style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "20px" }}>
                Theodore "Teddy" Chisom has been transforming hair and lives in Nashville for over three decades. As the founder and lead stylist of Beverly's of Nashville, Teddy has built a reputation as the city's most trusted master colorist, silk press specialist, and custom wig artisan.
              </p>
              <p className="fade-up" style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "28px" }}>
                His work goes beyond the chair — Teddy is a mentor, educator, and community pillar. From his signature color formulations to his hand-crafted custom wigs, every service reflects 30+ years of dedication to the craft.
              </p>
              <div className="about-credentials fade-up" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {[
                  "30+ Years Licensed Cosmetologist — Nashville, TN",
                  "Master Colorist & Silk Press Specialist",
                  "Custom Wig Artisan — Fashion & Medical Units",
                  "Founder, Beverly's Academy (Hair Education Platform)",
                  "Trusted by 5,000+ Nashville clients since 1994",
                ].map(c => (
                  <div key={c} className="credential" style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                    <BevListCheck />
                    {c}
                  </div>
                ))}
              </div>
              <div className="fade-up" style={{ marginTop: "32px", display: "flex", gap: "16px", flexWrap: "wrap" }}>
                <a href="https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville" target="_blank" rel="noopener noreferrer" className="btn-gold">Book with Teddy</a>
                <a href="/academy" className="btn-outline-gold">Explore The Academy</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SERVICES ══════════════════════════════════════════════════════════ */}
      <section id="services" className="bev-section" style={{ background: "#111" }}>
        <div className="container">
          <p className="eyebrow fade-up">What We Do</p>
          <h2 className="section-title fade-up">Salon Services</h2>
          <div className="hr-gold fade-up" />
          <p className="fade-up" style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "600px", lineHeight: 1.7, marginBottom: "0" }}>
            Every service at Beverly's is performed with 30+ years of expertise. We specialize in textured hair, color transformations, and custom wig solutions — all under one roof.
          </p>

          <div className="services-grid">
            {(
              [
                {
                  Icon: Palette,
                  name: "Hair Color & Highlights",
                  desc: "From subtle highlights to dramatic transformations. Teddy's color formulation system delivers vibrant, healthy results every time.",
                  items: ["Full Color", "Highlights & Balayage", "Color Correction", "Toning & Glazing"],
                },
                {
                  Icon: Wind,
                  name: "Silk Press & Blowouts",
                  desc: "Teddy's signature silk press technique — zero heat damage, maximum shine. The smoothest, most natural-looking results in Nashville.",
                  items: ["Silk Press", "Blowout & Style", "Roller Set", "Thermal Styling"],
                },
                {
                  Icon: Crown,
                  name: "Custom Wigs & Units",
                  desc: "Hand-crafted custom wigs for fashion, protection, and medical needs. Consultations available for all hair types and budgets.",
                  items: ["Lace Front Units", "Full Lace Wigs", "Medical/Cranial Units", "Wig Customization"],
                },
                {
                  Icon: Sparkles,
                  name: "Wig Maintenance",
                  desc: "Keep your investment looking flawless. Professional cleaning, conditioning, restyling, and repair for all wig types.",
                  items: ["Deep Cleaning", "Reconditioning", "Restyling", "Lace Repair"],
                },
                {
                  Icon: Scissors,
                  name: "Braids & Protective Styles",
                  desc: "Protective styling that promotes growth and keeps your natural hair healthy. Box braids, knotless, and more.",
                  items: ["Box Braids", "Knotless Braids", "Cornrows", "Faux Locs"],
                },
                {
                  Icon: Droplets,
                  name: "Treatments & Care",
                  desc: "Restore, strengthen, and revitalize your hair with professional-grade treatments tailored to your specific needs.",
                  items: ["Deep Conditioning", "Protein Treatments", "Scalp Treatments", "Keratin Smoothing"],
                },
              ] as { Icon: LucideIcon; name: string; desc: string; items: string[] }[]
            ).map((s) => (
              <div
                key={s.name}
                className="fade-up"
                style={{ background: "#1a1a1a", padding: "36px 28px", transition: "background 0.2s", cursor: "default" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#222")}
                onMouseLeave={e => (e.currentTarget.style.background = "#1a1a1a")}
              >
                <div
                  style={{
                    color: "#C9A84C",
                    fontSize: "14px",
                    letterSpacing: "1px",
                    marginBottom: "16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <s.Icon size={16} strokeWidth={1.75} color="#C9A84C" aria-hidden />
                  Service
                </div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", marginBottom: "12px" }}>{s.name}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "20px" }}>{s.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {s.items.map(item => (
                    <div key={item} style={{ fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)" }}>{item}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="fade-up" style={{ textAlign: "center", marginTop: "48px" }}>
            <a href="https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville" target="_blank" rel="noopener noreferrer" className="btn-gold">
              Book Your Service
            </a>
            <span style={{ display: "inline-block", width: "16px" }} />
            <a href="tel:6154974215" className="btn-outline">Call (615) 497-4215</a>
          </div>
        </div>
      </section>

      {/* ══ THE REVEAL SESSION ═════════════════════════════════════════════════ */}
      <section id="reveal" style={{ background: "#0D0D0D", position: "relative" }}>
        <div style={{ height: "3px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} aria-hidden />
        <div
          className="home-reveal-split"
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 55fr) minmax(0, 45fr)",
            alignItems: "stretch",
            minHeight: "min(640px, 92vh)",
            maxWidth: "1400px",
            margin: "0 auto",
            padding: "0 1.25rem",
          }}
        >
          <div className="reveal-copy fade-up" style={{ padding: "clamp(48px, 8vw, 96px) clamp(20px, 4vw, 56px) clamp(48px, 8vw, 96px) 0", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <p style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "20px" }}>INTRODUCING</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 5vw, 64px)", fontWeight: 400, lineHeight: 1.08, color: "#fff", marginBottom: "20px" }}>
              The Reveal Session.
            </h2>
            <div style={{ width: "48px", height: "2px", background: "#C9A84C", marginBottom: "24px" }} aria-hidden />
            <p style={{ fontSize: "18px", lineHeight: 1.7, color: "#fff", maxWidth: "480px", marginBottom: "20px" }}>
              Hair. Makeup. Photos. All in one appointment — at Beverly&apos;s of Nashville.
            </p>
            <p style={{ fontSize: "14px", lineHeight: 1.75, color: "rgba(255,255,255,0.65)", maxWidth: "520px", marginBottom: "32px" }}>
              We style your hair. Our makeup artist perfects your look. Then our in-salon photographer captures it all in Beverly&apos;s stunning studio space. You leave with 10 professionally edited photos and the best version of yourself.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "stretch", gap: "0", marginBottom: "32px", maxWidth: "520px" }}>
              {[
                { label: "Hair Style", value: "Signature styling" },
                { label: "Full Glam Makeup", value: "Pro application" },
                { label: "10 Edited Photos", value: "Edited & delivered" },
              ].map((item, i) => (
                <div key={item.label} style={{ display: "flex", alignItems: "stretch" }}>
                  {i > 0 && (
                    <div style={{ width: "1px", background: "rgba(201,168,76,0.25)", margin: "0 20px", flexShrink: 0 }} aria-hidden />
                  )}
                  <div style={{ flex: "1 1 100px", minWidth: "0" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "8px" }}>{item.label}</div>
                    <div style={{ fontSize: "15px", color: "#fff", fontWeight: 500 }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.45)", marginBottom: "8px", maxWidth: "520px" }}>
              <span style={{ color: "#C9A84C", fontWeight: 600 }}>$375</span> base Reveal · <span style={{ textDecoration: "line-through", color: "rgba(255,255,255,0.35)" }}>$550+ value</span> — use the builder below to preview add-ons or a celebration package.
            </p>
            <RevealSessionEstimator />
            <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "24px", marginBottom: "8px" }}>
              <a
                href="mailto:teddy@beverlysofnashville.com?subject=The%20Reveal%20Session%20Booking"
                className="btn-gold"
              >
                Book The Reveal →
              </a>
              <a href="/the-reveal" className="btn-outline">
                Learn More
              </a>
            </div>

            <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", margin: "16px 0 0" }}>
              Limited availability — by appointment only
            </p>
          </div>
          <div
            className="reveal-visual fade-up"
            style={{
              position: "relative",
              minHeight: "280px",
              // @ts-expect-error CSS custom property for mobile override in index.css
              "--reveal-bg": `url(${PHOTOS.revealSessionSalon})`,
              backgroundImage: `linear-gradient(to right, rgba(13,13,13,0.88) 0%, rgba(13,13,13,0.2) 38%, transparent 55%), url(${PHOTOS.revealSessionSalon})`,
              backgroundSize: "cover",
              backgroundPosition: "center 25%",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: "20px",
                right: "20px",
                background: "#C9A84C",
                color: "#111",
                fontSize: "9px",
                fontWeight: 700,
                letterSpacing: "3px",
                textTransform: "uppercase",
                padding: "8px 16px",
                borderRadius: 0,
              }}
            >
              NEW SERVICE
            </div>
          </div>
        </div>
      </section>

      {/* ══ WIGS ══════════════════════════════════════════════════════════════ */}
      <section id="wigs" className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          <p className="eyebrow fade-up">Custom Wig Boutique</p>
          <h2 className="section-title fade-up">Hand-Crafted for <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Every Woman.</em></h2>
          <div className="hr-gold fade-up" />
          <p className="fade-up" style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, maxWidth: "680px", marginBottom: "0" }}>
            Beverly's custom wigs are designed for every woman — from fashion-forward style seekers to women navigating medical hair loss. Each unit is hand-crafted by Teddy with 30+ years of expertise, using the finest materials available.
          </p>

          {/* Who We Serve */}
          <p className="eyebrow fade-up" style={{ marginTop: "40px" }}>Who We Serve</p>
          <div className="wig-cats">
            {(
              [
                { Icon: Sparkles, name: "Fashion & Style", desc: "Elevate your look with bold, fashion-forward custom units in any color, length, or texture." },
                { Icon: Leaf, name: "Protective Styling", desc: "Give your natural hair a break while staying flawlessly styled with a custom protective unit." },
                { Icon: Briefcase, name: "Busy Professionals", desc: "Wake up ready. Low-maintenance custom wigs designed for women on the go." },
                { Icon: Ribbon, name: "Cancer Patients", desc: "Compassionate, private consultations. Insurance reimbursement assistance available. You deserve to feel beautiful." },
                { Icon: Flower2, name: "Alopecia & Hair Loss", desc: "Natural-looking solutions for hormonal, genetic, or stress-related hair loss. Discreet and dignified." },
                { Icon: Gem, name: "Bridal & Events", desc: "Flawless custom units for your wedding day and life's most important moments." },
                { Icon: Palette, name: "Color Explorers", desc: "Try any color, any length, any style — without commitment or damage to your natural hair." },
                { Icon: Crown, name: "Luxury Seekers", desc: "100% human hair, undetectable lace, premium construction. The finest custom wigs in Nashville." },
              ] as { Icon: LucideIcon; name: string; desc: string }[]
            ).map(c => (
              <div
                key={c.name}
                className="fade-up"
                style={{ background: "#111", padding: "28px 24px", transition: "background 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.background = "#1e1e1e")}
                onMouseLeave={e => (e.currentTarget.style.background = "#111")}
              >
                <div style={{ marginBottom: "12px", color: "#C9A84C" }}>
                  <c.Icon size={26} strokeWidth={1.5} aria-hidden />
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", marginBottom: "8px" }}>{c.name}</div>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6 }}>{c.desc}</p>
              </div>
            ))}
          </div>

          {/* Wig tiers */}
          <p className="eyebrow fade-up" style={{ marginTop: "48px" }}>Collection Tiers</p>
          <div className="wig-tiers">
            {[
              {
                name: "Signature",
                price: "$150 – $400",
                desc: "Ready-to-wear custom units. Perfect for everyday wear, protective styling, and first-time wig wearers.",
                features: ["Synthetic & Blend Options", "Multiple Textures", "Quick Turnaround"],
                featured: false
              },
              {
                name: "Luxury",
                price: "$400 – $1,200",
                desc: "100% human hair custom units with full lace or lace front construction. Undetectable, natural-looking, and built to last.",
                features: ["100% Human Hair", "Full Lace or Lace Front", "Custom Color Available", "Personalized Consultation"],
                featured: true
              },
              {
                name: "Medical / Cranial",
                price: "$350 – $3,500+",
                desc: "Compassionate custom units for cancer patients and medical hair loss. Insurance reimbursement assistance available. Private consultations provided.",
                features: ["Insurance Friendly", "Cranial Prosthesis Available", "Soft Interior Lining", "Private Consultation"],
                featured: false
              },
            ].map(t => (
              <div
                key={t.name}
                className="fade-up"
                style={{
                  background: t.featured ? "#C9A84C" : "#111",
                  padding: "40px 32px",
                  position: "relative",
                  border: t.featured ? "none" : "1px solid rgba(201,168,76,0.15)"
                }}
              >
                {t.featured && (
                  <div style={{ position: "absolute", top: "-1px", left: "50%", transform: "translateX(-50%)", background: "#111", color: "#C9A84C", fontSize: "9px", letterSpacing: "2px", textTransform: "uppercase", padding: "5px 16px", whiteSpace: "nowrap" }}>
                    Most Popular
                  </div>
                )}
                <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: t.featured ? "#111" : "#fff", marginBottom: "8px" }}>{t.name}</div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: t.featured ? "#111" : "#C9A84C", marginBottom: "16px" }}>{t.price}</div>
                <p style={{ fontSize: "13px", color: t.featured ? "rgba(17,17,17,0.75)" : "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "24px" }}>{t.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {t.features.map(f => (
                    <div key={f} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: t.featured ? "#111" : "rgba(255,255,255,0.7)" }}>
                      <BevFeatureCheck featured={t.featured} />
                      {f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="fade-up" style={{ textAlign: "center", marginTop: "40px" }}>
            <a href="https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville" target="_blank" rel="noopener noreferrer" className="btn-gold">
              Schedule a Wig Consultation
            </a>
            <span style={{ display: "inline-block", width: "16px" }} />
            <a href="tel:6154974215" className="btn-outline-gold">Call (615) 497-4215</a>
          </div>
        </div>
      </section>

      {/* ══ GALLERY ═══════════════════════════════════════════════════════════ */}
      <section id="gallery" style={{ padding: "80px 0 60px", background: "#111" }}>
        <div className="container">
          <p className="eyebrow fade-up" style={{ textAlign: "center" }}>The Work</p>
          <h2 className="section-title fade-up" style={{ textAlign: "center" }}>Hair Gallery</h2>
          <p className="fade-up" style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: "10px", fontSize: "14px" }}>Coming soon — a refreshed gallery of our latest transformations.</p>

          <div
            className="fade-up"
            style={{
              marginTop: "48px",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "640px",
              border: "1px solid rgba(201,168,76,0.28)",
              background: "#0a0a0a",
              padding: "72px 32px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "10px", letterSpacing: "4px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "16px" }}>Hair Gallery</div>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 48px)", fontWeight: 400, color: "#fff", marginBottom: "16px", lineHeight: 1.15 }}>
              Coming Soon
            </h3>
            <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: 0 }}>
              We&apos;re refreshing the gallery with new work. Follow @beverlysofnashville on Instagram for the latest transformations in the meantime.
            </p>
          </div>

          <div className="fade-up" style={{ textAlign: "center", marginTop: "40px" }}>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", letterSpacing: "1px" }}>
              Follow @beverlysofnashville for daily transformations
            </div>
            <a href="https://instagram.com/bofnsalon" target="_blank" rel="noopener noreferrer" className="btn-outline-gold">
              View on Instagram
            </a>
          </div>
        </div>
      </section>

      {/* ══ ACADEMY TEASER ════════════════════════════════════════════════════ */}
      <section id="academy" className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          <p className="eyebrow fade-up">Education Platform</p>
          <h2 className="section-title fade-up">Beverly's Academy<br /><em style={{ color: "#C9A84C", fontStyle: "italic" }}>Learn from the Best.</em></h2>
          <div className="hr-gold fade-up" />
          <p className="fade-up" style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", maxWidth: "680px", lineHeight: 1.8, marginBottom: "32px" }}>
            Teddy Chisom's 30+ years of expertise is now available to aspiring and seasoned stylists nationwide. The Beverly's Academy offers e-books, online courses, webinars, and in-person masterclasses covering everything from color theory to building a six-figure salon business.
          </p>

          <div className="academy-products">
            {[
              {
                type: "E-Book",
                name: "Hair Color Mastery Guide",
                desc: "Teddy's complete color formulation system — from theory to application. Used by professional stylists across Nashville.",
                price: "$49",
                cta: { href: EBOOK_URL_1, label: "Buy Now" },
              },
              {
                type: "Online Course",
                name: "Wig Construction Masterclass",
                desc: "Step-by-step video course covering lace front construction, customization, and client consultation.",
                price: "$199",
                cta: { href: COURSE_URL_1, label: "Enroll →" },
              },
              {
                type: "E-Book",
                name: "The Silk Press Blueprint",
                desc: "The exact technique Teddy has perfected over 30 years. Zero heat damage, maximum results.",
                price: "$29",
                cta: { href: EBOOK_URL_2, label: "Buy Now" },
              },
              {
                type: "Webinar Series",
                name: "Salon Business Bootcamp",
                desc: "How to build and sustain a profitable salon business — pricing, hiring, retention, and marketing from 30+ years of experience.",
                price: "$49 / session",
                cta: { href: "#waitlist", label: "Join Waitlist →" },
              },
            ].map(p => (
              <div
                key={p.name}
                className="fade-up"
                style={{ background: "#111", padding: "32px 28px", borderBottom: "3px solid transparent", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderBottomColor = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "transparent")}
              >
                <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "12px" }}>{p.type}</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", marginBottom: "12px" }}>{p.name}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "20px" }}>{p.desc}</p>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#C9A84C", marginBottom: "16px" }}>{p.price}</div>
                <a href={p.cta.href} className="btn-gold" style={{ display: "inline-block", fontSize: "10px", padding: "12px 20px" }}>{p.cta.label}</a>
              </div>
            ))}
          </div>

          {/* Waitlist */}
          <div className="fade-up" style={{ background: "#111", border: "1px solid rgba(201,168,76,0.2)", padding: "clamp(28px, 6vw, 48px) clamp(20px, 5vw, 40px)", marginTop: "40px", maxWidth: "680px" }}>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "24px", marginBottom: "8px" }}>Join the Academy Waitlist</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "28px" }}>
              Be the first to access Beverly&apos;s Academy products. Waitlist members get early-bird pricing and exclusive bonuses — including the free &quot;5 Color Mistakes&quot; guide instantly.
            </p>
            <WaitlistForm />
          </div>

          <div className="fade-up" style={{ marginTop: "32px" }}>
            <a href="/academy" className="btn-gold">Visit The Academy Shop →</a>
          </div>
        </div>
      </section>

      {/* ══ TESTIMONIALS ══════════════════════════════════════════════════════ */}
      <section id="testimonials" className="bev-section" style={{ background: "#111" }}>
        <div className="container">
          <p className="eyebrow fade-up">Client Love</p>
          <h2 className="section-title fade-up">What Our Clients Say</h2>
          <div className="testimonials-grid">
            {[
              { text: "I've been coming to Beverly's for years. The atmosphere is unmatched and my hair always looks flawless. Teddy truly treats you like family here.", author: "Sarah M.", source: "Yelp" },
              { text: "Got my first custom wig here and I am in love. The consultation was so professional and the result is stunning. Highly recommend for anyone looking for a natural look!", author: "Jessica R.", source: "Google" },
              { text: "Teddy is a true artist. My color transformation was beyond what I imagined. 30 years of experience shows in every single strand.", author: "Monique T.", source: "Facebook" },
              { text: "Best silk press in Nashville. Period. My hair has never felt this healthy and looked this good. I won't go anywhere else.", author: "Tanya W.", source: "Google" },
            ].map(t => (
              <div key={t.author} className="fade-up" style={{ background: "#1a1a1a", padding: "36px 32px", borderLeft: "3px solid #C9A84C" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, fontStyle: "italic", marginBottom: "20px" }}>
                  "{t.text}"
                </p>
                <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C" }}>{t.author}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{t.source}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ CONTACT ═══════════════════════════════════════════════════════════ */}
      <section id="contact" className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          <p className="eyebrow fade-up">Find Us</p>
          <h2 className="section-title fade-up">Visit the Salon</h2>
          <div className="contact-grid">
            <div>
              {[
                { label: "Address", value: "3304 Nolensville Pike\nNashville, TN 37211" },
                { label: "Phone / Text", value: "(615) 497-4215", href: "tel:6154974215" },
                { label: "Email", value: "hello@beverlysofnashville.com", href: "mailto:hello@beverlysofnashville.com" },
                { label: "Hours", value: "Monday – Saturday: 9:00 AM – 6:00 PM\nSunday: By Appointment Only" },
              ].map(info => (
                <div key={info.label} className="fade-up" style={{ marginBottom: "28px" }}>
                  <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "8px" }}>{info.label}</div>
                  {info.href ? (
                    <a href={info.href} style={{ fontSize: "16px", color: "#fff" }}>{info.value}</a>
                  ) : (
                    <div style={{ fontSize: "16px", color: "#fff", whiteSpace: "pre-line" }}>{info.value}</div>
                  )}
                </div>
              ))}
              <div className="fade-up" style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "24px" }}>
                <a href="https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville" target="_blank" rel="noopener noreferrer" className="btn-gold">
                  Book Online via Booksy
                </a>
                <a href="tel:6154974215" className="btn-outline">Call or Text</a>
              </div>
              <div className="fade-up" style={{ background: "#111", border: "1px solid rgba(201,168,76,0.15)", padding: "16px 20px", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "40px" }}>
                Beverly's of Nashville Salon is led by Teddy Chisom. For salon appointments, please use the salon number: (615) 497-4215. Walk-ins welcome based on availability.
              </div>

              <div className="fade-up">
                <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "16px" }}>Send a Message</div>
                <ContactForm />
              </div>
            </div>
            <div className="fade-up">
              <div style={{ width: "100%", height: "400px", border: "1px solid rgba(201,168,76,0.2)", overflow: "hidden" }}>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3225.456!2d-86.7455!3d36.0895!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2s3304+Nolensville+Pike+Nashville+TN+37211!5e0!3m2!1sen!2sus!4v1"
                  width="100%" height="400"
                  style={{ border: 0, filter: "grayscale(80%) invert(90%) contrast(90%)" }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Beverly's of Nashville Location"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Kit (ConvertKit) public form POST — swap KIT_FORM_ID_* when forms are live. ──
async function postKitSubscription(formId: string, payload: Record<string, unknown>) {
  const url = `https://app.kit.com/forms/${formId}/subscriptions`;
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(payload),
  });
}

const inputStyle: CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(201,168,76,0.25)",
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  borderRadius: 0,
  fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
  boxSizing: "border-box",
};

// ── Netlify contact form (registered via static form in index.html + this UI). ──
function ContactForm() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "submitting") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") ?? "").trim();
    const email = String(fd.get("email") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();
    const botField = String(fd.get("bot-field") ?? "").trim();
    if (botField) return;

    const body = new URLSearchParams();
    body.append("form-name", "contact");
    body.append("name", name);
    body.append("email", email);
    body.append("message", message);

    setStatus("submitting");
    try {
      const res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <div style={{ background: "#111", border: "1px solid rgba(201,168,76,0.25)", padding: "32px 28px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <BadgeCheck size={40} strokeWidth={1.5} color="#C9A84C" aria-hidden />
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#C9A84C", marginBottom: "8px" }}>Message received</div>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Thank you — we&apos;ll get back to you as soon as possible.</p>
      </div>
    );
  }

  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      data-netlify-honeypot="bot-field"
      onSubmit={handleSubmit}
      style={{ position: "relative", background: "#111", border: "1px solid rgba(201,168,76,0.2)", padding: "28px 24px" }}
    >
      <input type="hidden" name="form-name" value="contact" />
      <p style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }} aria-hidden="true">
        <label>
          Do not fill this in:
          <input name="bot-field" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </p>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>Name</label>
        <input name="name" type="text" required placeholder="Your name" style={inputStyle} />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>Email</label>
        <input name="email" type="email" required placeholder="your@email.com" style={inputStyle} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>Message</label>
        <textarea name="message" required rows={4} placeholder="How can we help?" style={{ ...inputStyle, resize: "vertical", minHeight: "100px" }} />
      </div>
      {status === "error" && (
        <p style={{ fontSize: "13px", color: "#e88", marginBottom: "12px" }}>Something went wrong. Please call the salon or try again shortly.</p>
      )}
      <button type="submit" className="btn-gold" disabled={status === "submitting"} style={{ width: "100%", padding: "14px", fontSize: "11px" }}>
        {status === "submitting" ? "Sending…" : "Send Message"}
      </button>
    </form>
  );
}

// ── Waitlist Form Component ───────────────────────────────────────────────
function WaitlistForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (status === "loading") return;
    const form = e.currentTarget;
    const fd = new FormData(form);
    const first_name = String(fd.get("first_name") ?? "").trim();
    const email_address = String(fd.get("email_address") ?? "").trim();

    setStatus("loading");
    try {
      const res = await postKitSubscription(KIT_FORM_ID_WAITLIST, {
        first_name,
        email_address,
        tags: "academy-waitlist",
      });
      if (res.ok) {
        setStatus("success");
        form.reset();
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  if (status === "success") {
    return (
      <>
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
            <BadgeCheck size={40} strokeWidth={1.5} color="#C9A84C" aria-hidden />
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#C9A84C", marginBottom: "8px" }}>You&apos;re on the list!</div>
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Check your inbox for the free &quot;5 Color Mistakes&quot; guide.</p>
        </div>
        <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "12px" }}>No spam, ever. Unsubscribe anytime.</p>
      </>
    );
  }

  return (
    <>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Kit receives tags in the JSON body below; this hidden field documents the tag for non-JS builds. */}
        <input type="hidden" name="tags" value="academy-waitlist" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0" }}>
          <input
            name="first_name"
            type="text"
            required
            placeholder="First name"
            style={{
              flex: "1 1 140px",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(201,168,76,0.25)",
              borderBottom: "1px solid rgba(201,168,76,0.25)",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              borderRadius: 0,
              fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
            }}
          />
          <input
            name="email_address"
            type="email"
            required
            placeholder="Your email address"
            style={{
              flex: "2 1 200px",
              padding: "14px 16px",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(201,168,76,0.25)",
              borderLeft: "none",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              borderRadius: 0,
              fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
            }}
          />
        </div>
        {status === "error" && (
          <p style={{ fontSize: "12px", color: "#e88", margin: 0 }}>Could not join right now. Please try again or use the full form on the Academy page.</p>
        )}
        <button type="submit" className="btn-gold" disabled={status === "loading"} style={{ alignSelf: "flex-start", whiteSpace: "nowrap" }}>
          {status === "loading" ? "Joining…" : "Join Waitlist"}
        </button>
      </form>
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "12px" }}>No spam, ever. Unsubscribe anytime.</p>
    </>
  );
}
