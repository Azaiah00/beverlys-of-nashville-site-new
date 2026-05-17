/**
 * Beverly's of Nashville — Shared Layout Components
 * Design: "Craftsman's Gold" — dark charcoal + gold, Georgia serif, sharp rectangles
 * Nav and Footer match uploaded HTML files exactly
 */
import { useState, useEffect, useLayoutEffect } from "react";
import { Link, useLocation } from "wouter";

/** Promo banner height in px — must match CSS used in Nav layout math below. */
const FREE_GUIDE_BANNER_H = 36;
const NAV_BAR_H = 70;

// ── NAV ──────────────────────────────────────────────────────────────────
export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  /** Session-only: closing the bar hides it until the page is refreshed (no localStorage). */
  const [freeGuideBannerDismissed, setFreeGuideBannerDismissed] = useState(false);
  const [location] = useLocation();

  const headerOffsetPx = freeGuideBannerDismissed ? NAV_BAR_H : FREE_GUIDE_BANNER_H + NAV_BAR_H;

  // Keep first hero sections aligned under the fixed header (banner + nav).
  useLayoutEffect(() => {
    document.documentElement.style.setProperty("--site-fixed-header-height", `${headerOffsetPx}px`);
  }, [headerOffsetPx]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/#services", label: "Services" },
    { href: "/#wigs", label: "Wigs" },
    { href: "/#gallery", label: "Gallery" },
    { href: "/the-reveal", label: "The Reveal" },
    { href: "/academy", label: "Academy" },
    /** Logged-out users hit /login first; signed-in users see the dashboard. */
    { href: "/portal", label: "Member Portal", activePrefix: "/portal" },
    { href: "/blog", label: "Journal" },
  ];

  const navItemActive = (link: (typeof navLinks)[number]) => {
    if ("activePrefix" in link && link.activePrefix) return location.startsWith(link.activePrefix);
    return location === link.href;
  };

  return (
    <>
      {/* Fixed stack: dismissible free-guide promo (session state) + main nav */}
      <header
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          display: "flex",
          flexDirection: "column",
        }}
      >
        {!freeGuideBannerDismissed && (
          <div
            style={{
              height: `${FREE_GUIDE_BANNER_H}px`,
              background: "#C9A84C",
              color: "#111",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingLeft: "12px",
              paddingRight: "4px",
              fontFamily: '"DM Sans", "Helvetica Neue", Arial, sans-serif',
              fontSize: "12px",
              fontWeight: 600,
              letterSpacing: "0.02em",
              borderRadius: 0,
            }}
          >
            <Link
              href="/free-guide"
              style={{
                flex: 1,
                minWidth: 0,
                color: "#111",
                textDecoration: "none",
                display: "flex",
                alignItems: "center",
                height: "100%",
                padding: "0 8px",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              ✦ FREE DOWNLOAD: The Master Colorist's Cheat Sheet — Get Yours →
            </Link>
            <button
              type="button"
              aria-label="Dismiss free guide announcement"
              onClick={() => setFreeGuideBannerDismissed(true)}
              style={{
                flexShrink: 0,
                width: "32px",
                height: "32px",
                border: "none",
                background: "transparent",
                color: "#111",
                fontSize: "18px",
                lineHeight: 1,
                cursor: "pointer",
                borderRadius: 0,
              }}
            >
              ×
            </button>
          </div>
        )}
        <nav style={{
          height: `${NAV_BAR_H}px`,
          background: scrolled ? "rgba(17,17,17,0.97)" : "rgba(17,17,17,0.85)",
          backdropFilter: "blur(12px)",
          borderBottom: scrolled ? "1px solid rgba(201,168,76,0.2)" : "1px solid transparent",
          transition: "all 0.3s ease",
          display: "flex", alignItems: "center"
        }}>
        <div className="container" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
          {/* Logo — sits flush left with breathing room before nav links */}
          <Link href="/" style={{ display: "flex", alignItems: "center", textDecoration: "none", lineHeight: 0, flexShrink: 0, marginRight: "auto" }}>
            <img
              src="/assets/beverlys-logo.png"
              alt="Beverly's of Nashville logo"
              style={{
                height: "38px",
                width: "auto",
                maxWidth: "min(200px, 44vw)",
                objectFit: "contain",
                display: "block",
              }}
            />
          </Link>

          {/* Desktop nav links — pushed right, tighter spacing */}
          <div style={{ display: "flex", alignItems: "center", gap: "22px" }} className="nav-desktop">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                style={{
                  fontSize: "10px", letterSpacing: "1.5px", textTransform: "uppercase",
                  color: navItemActive(link) ? "#C9A84C" : "rgba(255,255,255,0.7)",
                  textDecoration: "none", transition: "color 0.2s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = navItemActive(link) ? "#C9A84C" : "rgba(255,255,255,0.7)")}
              >
                {link.label}
              </a>
            ))}
            <a
              href="https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-gold"
              style={{ fontSize: "9px", padding: "10px 20px", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Book Now
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="nav-mobile-toggle"
            style={{ background: "none", border: "none", cursor: "pointer", padding: "8px", display: "none" }}
            aria-label="Toggle menu"
          >
            <div style={{ width: "24px", display: "flex", flexDirection: "column", gap: "5px" }}>
              <span style={{ display: "block", height: "1px", background: "#C9A84C", transition: "all 0.3s", transform: mobileOpen ? "rotate(45deg) translate(4px, 4px)" : "none" }} />
              <span style={{ display: "block", height: "1px", background: "#C9A84C", transition: "all 0.3s", opacity: mobileOpen ? 0 : 1 }} />
              <span style={{ display: "block", height: "1px", background: "#C9A84C", transition: "all 0.3s", transform: mobileOpen ? "rotate(-45deg) translate(4px, -4px)" : "none" }} />
            </div>
          </button>
        </div>
        </nav>
      </header>

      {/* Mobile menu drawer */}
      <div style={{
        position: "fixed", top: `${headerOffsetPx}px`, left: 0, right: 0, bottom: 0, zIndex: 999,
        background: "rgba(17,17,17,0.98)", backdropFilter: "blur(12px)",
        borderBottom: "1px solid rgba(201,168,76,0.2)",
        padding: mobileOpen ? "24px 0 32px" : "0",
        maxHeight: mobileOpen ? "100dvh" : "0",
        overflowY: "auto",
        overflowX: "hidden",
        transition: "all 0.3s ease",
        display: "none"
      }} className="nav-mobile-drawer">
        <div className="container">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              style={{
                display: "block", padding: "14px 0",
                fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase",
                color: "rgba(255,255,255,0.8)", textDecoration: "none",
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                transition: "color 0.2s"
              }}
            >
              {link.label}
            </a>
          ))}
          <a
            href="https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-gold"
            style={{ display: "block", textAlign: "center", marginTop: "20px", padding: "14px" }}
          >
            Book Your Appointment
          </a>
          <div style={{ marginTop: "20px", display: "flex", gap: "20px", justifyContent: "center" }}>
            <a href="https://instagram.com/bofnsalon" target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Instagram</a>
            <a href="https://www.facebook.com/bofnsalon" target="_blank" rel="noopener noreferrer" style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.4)", textDecoration: "none" }}>Facebook</a>
            <a href="tel:6154974215" style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", textDecoration: "none" }}>(615) 497-4215</a>
          </div>
        </div>
      </div>
    </>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────
export function Footer() {
  return (
    <footer style={{ background: "#0a0a0a", borderTop: "1px solid rgba(201,168,76,0.15)", padding: "60px 0 32px" }}>
      <div className="container">
        <div className="footer-grid" style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 1fr", gap: "48px", marginBottom: "48px" }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: "16px" }}>
              <Link href="/" style={{ display: "inline-flex", textDecoration: "none", lineHeight: 0 }}>
                <img
                  src="/assets/beverlys-logo.png"
                  alt="Beverly's of Nashville logo"
                  style={{
                    height: "48px",
                    width: "auto",
                    maxWidth: "260px",
                    objectFit: "contain",
                    display: "block",
                  }}
                />
              </Link>
            </div>
            <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, maxWidth: "260px", marginBottom: "20px" }}>
              Nashville's premier hair salon. 30+ years of master-level artistry in color, styling, and custom wigs. Led by Teddy Chisom.
            </p>
            <div style={{ display: "flex", gap: "12px" }}>
              {[
                { href: "https://instagram.com/bofnsalon", label: "IG" },
                { href: "https://www.facebook.com/bofnsalon", label: "FB" },
                { href: "https://tiktok.com/@beverlysofnashville", label: "TK" },
              ].map(s => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    width: "36px", height: "36px", border: "1px solid rgba(201,168,76,0.3)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "9px", letterSpacing: "1px", color: "#C9A84C", textDecoration: "none",
                    transition: "all 0.2s"
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#C9A84C"; e.currentTarget.style.color = "#111"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C9A84C"; }}
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>

          {/* Salon */}
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "20px" }}>Salon</div>
            {[
              { href: "/#services", label: "Services" },
              { href: "/the-reveal", label: "The Reveal Session" },
              { href: "/#wigs", label: "Wig Boutique" },
              { href: "/#gallery", label: "Gallery" },
              { href: "/#about", label: "About Teddy" },
              { href: "/#contact", label: "Contact" },
              { href: "https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville", label: "Book Online", external: true },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                target={link.external ? "_blank" : undefined}
                rel={link.external ? "noopener noreferrer" : undefined}
                style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Academy */}
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "20px" }}>Academy</div>
            {[
              { href: "/academy", label: "The Academy" },
              { href: "/portal", label: "Member Portal" },
              { href: "/academy#curriculum", label: "Curriculum" },
              { href: "/free-guide", label: "Free Color Guide" },
              { href: "/academy#waitlist", label: "Join Waitlist" },
            ].map(link => (
              <a
                key={link.label}
                href={link.href}
                style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: "10px", transition: "color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Contact */}
          <div>
            <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "20px" }}>Contact</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.7, marginBottom: "16px" }}>
              3304 Nolensville Pike<br />Nashville, TN 37211
            </div>
            <a href="tel:6154974215" style={{ display: "block", fontSize: "13px", color: "rgba(255,255,255,0.45)", textDecoration: "none", marginBottom: "8px", transition: "color 0.2s" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.45)")}
            >(615) 497-4215</a>
            <a href="mailto:hello@beverlysofnashville.com" style={{ display: "block", fontSize: "12px", color: "rgba(255,255,255,0.35)", textDecoration: "none", marginBottom: "16px", transition: "color 0.2s", wordBreak: "break-all" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.35)")}
            >hello@beverlysofnashville.com</a>
            <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", lineHeight: 1.6 }}>
              Mon–Sat: 9:00 AM – 6:00 PM<br />Sun: By Appointment
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)" }}>
            © {new Date().getFullYear()} Beverly's of Nashville Salon. All rights reserved.
          </div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.25)", letterSpacing: "1px" }}>
            Salon only · Not affiliated with the barbershop
          </div>
        </div>
      </div>
    </footer>
  );
}
