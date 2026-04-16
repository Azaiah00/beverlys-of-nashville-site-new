/**
 * Beverly's of Nashville — The Reveal Session landing page
 * Hair + Makeup + In-salon photography — premium package detail page
 */
import { useEffect } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Briefcase,
  Building2,
  Cake,
  Camera,
  Gem,
  PartyPopper,
  Scissors,
  Smartphone,
  Sparkles,
  Star,
} from "lucide-react";
import { BevListCheck } from "@/components/BevLucide";
import { Nav, Footer } from "@/components/Layout";

const PHOTOS = {
  teddySalon3:
    "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddyinsalon3_4a47c75a.jpg",
};

const BOOK_MAILTO =
  "mailto:teddy@beverlysofnashville.com?subject=The%20Reveal%20Session%20Booking";

function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add("visible");
      }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function TheReveal() {
  useFadeUp();

  return (
    <div style={{ background: "#0D0D0D", color: "#fff", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section
        style={{
          position: "relative",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          background: "#0D0D0D",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `url(${PHOTOS.teddySalon3})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.25,
          }}
          aria-hidden
        />
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(180deg, rgba(13,13,13,0.75) 0%, rgba(13,13,13,0.92) 100%)",
          }}
          aria-hidden
        />
        <div className="container fade-up" style={{ position: "relative", zIndex: 2, paddingTop: "var(--site-fixed-header-height, 106px)", paddingBottom: "80px", maxWidth: "800px" }}>
          <p style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "20px" }}>
            BEVERLY&apos;S OF NASHVILLE PRESENTS
          </p>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 400, lineHeight: 1.06, marginBottom: "20px" }}>
            The Reveal Session.
          </h1>
          <p style={{ fontSize: "clamp(17px, 2.2vw, 22px)", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, maxWidth: "560px", marginBottom: "36px" }}>
            Nashville&apos;s first luxury all-in-one Hair + Makeup + Photography experience.
          </p>
          <a href={BOOK_MAILTO} className="btn-gold">
            Book Your Session →
          </a>
        </div>
      </section>

      {/* What's included */}
      <section className="bev-section" style={{ background: "#0D0D0D" }}>
        <div className="container">
          <p className="eyebrow fade-up">The Experience</p>
          <h2 className="section-title fade-up">What&apos;s Included</h2>
          <div className="hr-gold fade-up" />
          <div className="reveal-included-grid">
            {(
              [
                {
                  Icon: Scissors,
                  title: "The Hair",
                  sub: "Signature Style by Teddy",
                  desc: "Your service begins with Teddy — blowout, silk press, custom styling, or whatever look you're going for. 30+ years of expertise, starting your session right.",
                  time: "~45 minutes",
                },
                {
                  Icon: Sparkles,
                  title: "The Glam",
                  sub: "Full Makeup Application",
                  desc: "Our professional makeup artist takes over — full glam, natural glow, or anything in between. You choose the vibe.",
                  time: "~30 minutes",
                },
                {
                  Icon: Camera,
                  title: "The Photos",
                  sub: "10 Professional Photos",
                  desc: "Our photographer uses Beverly's salon as your backdrop — the dark walls, gold lighting, and luxury aesthetic do the heavy lifting. 10 fully edited digital images delivered within 48 hours.",
                  time: "~30 minutes",
                },
              ] as { Icon: LucideIcon; title: string; sub: string; desc: string; time: string }[]
            ).map(card => (
              <div
                key={card.title}
                className="fade-up"
                style={{ background: "#111", padding: "40px 28px", borderRadius: 0 }}
              >
                <div style={{ color: "#C9A84C", marginBottom: "16px" }}>
                  <card.Icon size={28} strokeWidth={1.5} aria-hidden />
                </div>
                <div style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "8px" }}>{card.title}</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "14px", lineHeight: 1.2 }}>{card.sub}</h3>
                <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.75, marginBottom: "20px" }}>{card.desc}</p>
                <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.35)" }}>{card.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perfect for */}
      <section className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          <p className="eyebrow fade-up">WHO IS THIS FOR</p>
          <h2 className="section-title fade-up">Every Woman Who Deserves to Be Seen.</h2>
          <div className="hr-gold fade-up" />
          <div className="wig-cats" style={{ marginTop: "40px" }}>
            {(
              [
                { Icon: Briefcase, name: "Entrepreneurs & Executives", desc: "Professional headshots that actually look like you." },
                { Icon: Cake, name: "Birthday Celebrations", desc: "Document your best year yet." },
                { Icon: Sparkles, name: "Milestone Moments", desc: "Divorce glow-up. Weight loss. New chapter. Celebrate it." },
                { Icon: Smartphone, name: "Content Creators", desc: "Professional content shot in a luxury studio backdrop." },
                { Icon: Gem, name: "Brides & Bridal Parties", desc: "Bridal party glam sessions before the big day." },
                { Icon: Building2, name: "Real Estate & Corporate", desc: "The headshot your LinkedIn profile has been waiting for." },
                { Icon: PartyPopper, name: "Special Occasions", desc: "Anniversary, promotion, graduation — moments worth remembering." },
                { Icon: Star, name: "Just Because", desc: "You don't need a reason to feel beautiful." },
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
        </div>
      </section>

      {/* Pricing */}
      <section className="bev-section" style={{ background: "#111" }}>
        <div className="container" style={{ maxWidth: "640px", margin: "0 auto" }}>
          <h2 className="section-title fade-up" style={{ textAlign: "center" }}>Investment</h2>
          <div className="hr-gold fade-up" style={{ marginLeft: "auto", marginRight: "auto" }} />
          <div
            className="fade-up"
            style={{
              marginTop: "48px",
              background: "#0D0D0D",
              border: "2px solid #C9A84C",
              padding: "clamp(28px, 6vw, 48px) clamp(20px, 5vw, 40px)",
              borderRadius: 0,
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "12px" }}>
              The Reveal Session — Complete Package
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "clamp(40px, 10vw, 56px)", color: "#C9A84C", lineHeight: 1, marginBottom: "8px" }}>$375</div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.45)", marginBottom: "28px" }}>($550+ combined value)</div>
            <div style={{ height: "1px", background: "rgba(201,168,76,0.25)", marginBottom: "28px" }} aria-hidden />
            <div style={{ textAlign: "left", maxWidth: "420px", margin: "0 auto 32px", display: "flex", flexDirection: "column", gap: "12px" }}>
              {[
                "Hair styling service with Teddy Chisom",
                "Full professional makeup application",
                "30-minute in-salon photo session",
                "10 professionally edited digital photos",
                "48-hour photo delivery",
                "Use Beverly's luxury salon as your backdrop",
              ].map(line => (
                <div key={line} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  <BevListCheck />
                  <span>{line}</span>
                </div>
              ))}
            </div>
            <a href={BOOK_MAILTO} className="btn-gold" style={{ display: "inline-block" }}>
              Book Your Reveal Session →
            </a>
            <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", marginTop: "20px", marginBottom: 0 }}>
              By appointment only · Limited weekly availability
            </p>
          </div>

          <p className="eyebrow fade-up" style={{ textAlign: "center", marginTop: "56px", marginBottom: "8px" }}>
            Add-ons
          </p>
          <div className="reveal-addons-grid" style={{ marginTop: "24px" }}>
            {[
              { title: "Extra Outfit Change", price: "+$50" },
              { title: "Rush 24hr Photo Delivery", price: "+$35" },
              { title: "Extended Photo Session (60 min)", price: "+$75" },
            ].map(a => (
              <div key={a.title} className="fade-up" style={{ background: "#1a1a1a", border: "1px solid rgba(201,168,76,0.2)", padding: "24px 20px", textAlign: "center", borderRadius: 0 }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "15px", marginBottom: "10px", lineHeight: 1.3 }}>{a.title}</div>
                <div style={{ fontSize: "18px", color: "#C9A84C", fontWeight: 600 }}>{a.price}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bev-section" style={{ background: "#0D0D0D", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "720px", margin: "0 auto" }}>
          <blockquote className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3.5vw, 32px)", fontStyle: "italic", color: "rgba(255,255,255,0.9)", lineHeight: 1.5, margin: "0 0 36px", border: "none", padding: 0 }}>
            You&apos;ve always deserved a photoshoot. Now you can get your hair, your makeup, and your photos — all at Beverly&apos;s.
          </blockquote>
          <a href={BOOK_MAILTO} className="btn-gold fade-up" style={{ display: "inline-block" }}>
            Reserve Your Session →
          </a>
        </div>
      </section>

      <Footer />
    </div>
  );
}
