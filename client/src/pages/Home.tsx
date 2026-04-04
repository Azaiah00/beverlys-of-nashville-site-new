/**
 * Beverly's of Nashville — Home Page
 * Design: "Craftsman's Gold" — matches uploaded index.html exactly
 * Dark charcoal #1A1A1A + Gold #C9A84C, Georgia serif, sharp rectangles
 * Uses ONLY real uploaded photos + AI-generated images matching salon aesthetic
 */
import { useEffect, useRef } from "react";
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

// ── Real photo CDN URLs (uploaded by client) ──────────────────────────────
const PHOTOS = {
  teddyHero:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddy-in-salon_3b149114.jpg",
  teddySalon2:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddyinsalon2_5fc523b8.jpg",
  teddySalon3:  "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddyinsalon3_4a47c75a.jpg",
  interior:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/saloninterior-1_24b3a8a4.jpg",
  gallery1:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/hairgallery_c3886879.jpg",
  gallery2:     "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/hairgallerybluebuzz_6874d450.jpeg",
  fb1:          "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/86790898_100198144919002_4841327315470254080_n_f5a19046.jpg",
  fb2:          "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/488466365_1220721643388128_2928759630973482530_n_1eec219c.jpg",
  fb3:          "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/489114787_1224555033004789_7003720473379721468_n_4e76f7f4.jpg",
  fb4:          "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/489669394_1224555093004783_1491903556562294114_n_62ef1f40.jpg",
  fb5:          "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/489914605_1224555289671430_5797016941782362400_n_45699ac1.jpg",
  fb6:          "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/490416405_1227912196002406_9031811210377746322_n_816343db.jpg",
  fb7:          "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/473420572_1108225034116303_531114487233909498_n_b5181a9e.jpg",
  // AI-generated matching salon aesthetic
  wigConsult:   "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/wig-consultation_ded7bfc7.jpg",
  colorWork:    "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/color-work_c073b08e.jpg",
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

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "70px" }}>
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
          <div className="fade-up" style={{ display: "flex", gap: "48px", marginTop: "64px", paddingTop: "40px", borderTop: "1px solid rgba(201,168,76,0.2)", flexWrap: "wrap" }}>
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
            <div className="fade-up" style={{ position: "relative" }}>
              <img
                src={PHOTOS.teddySalon2}
                alt="Teddy Chisom — Master Stylist at Beverly's of Nashville"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top" }}
              />
              <div style={{
                position: "absolute", bottom: "-20px", right: "-20px",
                width: "120px", height: "120px", background: "#C9A84C",
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
          <p className="fade-up" style={{ color: "rgba(255,255,255,0.6)", textAlign: "center", marginTop: "10px", fontSize: "14px" }}>Every transformation tells a story.</p>

          <div className="gallery-grid">
            {[
              { src: PHOTOS.fb4, alt: "Hair transformation by Teddy Chisom" },
              { src: PHOTOS.fb5, alt: "Custom color work at Beverly's of Nashville" },
              { src: PHOTOS.fb6, alt: "Styling at Beverly's of Nashville" },
              { src: PHOTOS.gallery1, alt: "Hair gallery — Beverly's of Nashville" },
              { src: PHOTOS.gallery2, alt: "Blue buzz cut — Beverly's of Nashville" },
              { src: PHOTOS.fb2, alt: "Color transformation — Beverly's of Nashville" },
              { src: PHOTOS.fb3, alt: "Salon work by Teddy Chisom" },
              { src: PHOTOS.fb7, alt: "Hair artistry at Beverly's of Nashville" },
              { src: PHOTOS.fb1, alt: "Beverly's of Nashville hair work" },
            ].map((img, i) => (
              <div key={i} className="gallery-item fade-up">
                <img src={img.src} alt={img.alt} loading="lazy" />
              </div>
            ))}
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

          <div style={{ display: "inline-block", background: "#C9A84C", color: "#111", fontSize: "9px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", padding: "6px 16px", marginBottom: "32px" }}>
            Coming Soon
          </div>

          <div className="academy-products">
            {[
              { type: "E-Book", name: "Hair Color Mastery Guide", desc: "Teddy's complete color formulation system — from theory to application. Used by professional stylists across Nashville.", price: "$49" },
              { type: "Online Course", name: "Wig Construction Masterclass", desc: "Step-by-step video course covering lace front construction, customization, and client consultation.", price: "$199" },
              { type: "E-Book", name: "The Silk Press Blueprint", desc: "The exact technique Teddy has perfected over 30 years. Zero heat damage, maximum results.", price: "$29" },
              { type: "Webinar Series", name: "Salon Business Bootcamp", desc: "How to build and sustain a profitable salon business — pricing, hiring, retention, and marketing from 30+ years of experience.", price: "$49 / session" },
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
                <div style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#C9A84C" }}>{p.price}</div>
              </div>
            ))}
          </div>

          {/* Waitlist */}
          <div className="fade-up" style={{ background: "#111", border: "1px solid rgba(201,168,76,0.2)", padding: "48px 40px", marginTop: "40px", maxWidth: "680px" }}>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: "24px", marginBottom: "8px" }}>Join the Academy Waitlist</h3>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "28px" }}>
              Be the first to access Teddy's educational products. Waitlist members get early-bird pricing and exclusive bonuses — including the free "5 Color Mistakes" guide instantly.
            </p>
            <WaitlistForm />
          </div>

          <div className="fade-up" style={{ marginTop: "32px" }}>
            <a href="/academy" className="btn-gold">Explore The Academy →</a>
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
              <div className="fade-up" style={{ background: "#111", border: "1px solid rgba(201,168,76,0.15)", padding: "16px 20px", fontSize: "13px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6 }}>
                Beverly's of Nashville Salon is led by Teddy Chisom. For salon appointments, please use the salon number: (615) 497-4215. Walk-ins welcome based on availability.
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

// ── Waitlist Form Component ───────────────────────────────────────────────
function WaitlistForm() {
  const formRef = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    form.style.display = "none";
    const success = document.getElementById("waitlist-success");
    if (success) success.style.display = "block";
  };

  return (
    <>
      <form ref={formRef} onSubmit={handleSubmit} style={{ display: "flex", gap: "0" }}>
        <input
          type="email"
          required
          placeholder="Your email address"
          style={{
            flex: 1, padding: "14px 16px",
            background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.25)",
            borderRight: "none", color: "#fff", fontSize: "14px", outline: "none",
            fontFamily: "Helvetica Neue, Arial, sans-serif"
          }}
        />
        <button type="submit" className="btn-gold" style={{ whiteSpace: "nowrap" }}>
          Join Waitlist
        </button>
      </form>
      <div id="waitlist-success" style={{ display: "none", textAlign: "center", padding: "24px 0" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "12px" }}>
          <BadgeCheck size={40} strokeWidth={1.5} color="#C9A84C" aria-hidden />
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#C9A84C", marginBottom: "8px" }}>You're on the list!</div>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>Check your inbox for the free "5 Color Mistakes" guide.</p>
      </div>
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", marginTop: "12px" }}>No spam, ever. Unsubscribe anytime.</p>
    </>
  );
}
