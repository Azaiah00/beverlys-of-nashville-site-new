/**
 * Beverly's of Nashville — Academy Page
 * Design: matches uploaded academy.html exactly
 * Dark charcoal + Gold, Georgia serif, sharp rectangles
 */
import { useEffect, useState } from "react";
import { BadgeCheck } from "lucide-react";
import { BevListCheck } from "@/components/BevLucide";
import { Nav, Footer } from "@/components/Layout";

const PHOTOS = {
  teddySalon3: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddyinsalon3_4a47c75a.jpg",
  academyBanner: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/academy-banner_5d97ab00.jpg",
};

function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
      { threshold: 0.1 }
    );
    els.forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

export default function Academy() {
  useFadeUp();

  return (
    <div style={{ background: "#1a1a1a", color: "#fff", minHeight: "100vh" }}>
      <Nav />

      {/* ── Hero ── */}
      <section id="hero" style={{
        position: "relative", minHeight: "85vh",
        display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #111 0%, #1a150a 100%)",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${PHOTOS.academyBanner})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.2
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(17,17,17,0.9) 55%, rgba(17,17,17,0.4))" }} />

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "70px", maxWidth: "760px" }}>
          <div style={{ display: "inline-block", background: "#C9A84C", color: "#111", fontSize: "9px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", padding: "6px 16px", marginBottom: "28px" }}>
            Coming Soon
          </div>
          <p className="fade-up" style={{ fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "16px" }}>
            Hair Education Platform
          </p>
          <h1 className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(40px, 6vw, 72px)", fontWeight: 400, lineHeight: 1.08, marginBottom: "12px" }}>
            Beverly's Academy —<br />
            <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Master Your Craft.</em>
          </h1>
          <p className="fade-up" style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "540px", lineHeight: 1.7, margin: "20px 0 8px" }}>
            30+ years of Nashville hair mastery — now available to stylists everywhere.
          </p>
          <p className="fade-up" style={{ fontSize: "13px", color: "rgba(255,255,255,0.45)", lineHeight: 1.6, maxWidth: "500px", marginBottom: "36px" }}>
            E-books, online courses, webinars, and in-person masterclasses. Join the waitlist for early-bird access and a free guide.
          </p>
          <div className="fade-up" style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            <a href="#waitlist" className="btn-gold">Join the Waitlist →</a>
            <a href="#curriculum" className="btn-outline">See the Curriculum</a>
          </div>
        </div>
      </section>

      {/* ── Waitlist Section ── */}
      <section id="waitlist" className="bev-section" style={{ background: "#111" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start" }}>
            {/* Form */}
            <div className="fade-up" style={{ background: "#1a1a1a", border: "1px solid rgba(201,168,76,0.2)", padding: "48px 40px" }}>
              <h2 style={{ fontFamily: "Georgia, serif", fontSize: "26px", marginBottom: "8px" }}>Join the Academy Waitlist</h2>
              <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "32px" }}>
                Be the first to access Teddy's educational products. Waitlist members get early-bird pricing and exclusive bonuses — including the free "5 Color Mistakes" guide instantly upon signup.
              </p>
              <AcademyForm />
            </div>

            {/* Benefits */}
            <div>
              {[
                { num: "01", title: "Instant Free Guide", desc: "Get Teddy's '5 Color Mistakes Every Stylist Makes (And How to Fix Them)' PDF guide immediately upon joining the waitlist." },
                { num: "02", title: "Early-Bird Pricing", desc: "Waitlist members get 30–40% off all Academy products at launch. Lock in your price before the public release." },
                { num: "03", title: "Exclusive Bonuses", desc: "First-access to live Q&A sessions with Teddy, bonus video content, and members-only community access." },
                { num: "04", title: "Launch Notification", desc: "Be the first to know when each product drops — before it's announced to the public." },
              ].map(b => (
                <div key={b.num} className="fade-up" style={{ display: "flex", gap: "20px", marginBottom: "36px" }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "36px", color: "#C9A84C", lineHeight: 1, flexShrink: 0, width: "36px" }}>{b.num}</div>
                  <div>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", marginBottom: "8px" }}>{b.title}</div>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>{b.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Curriculum ── */}
      <section id="curriculum" className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          <p className="eyebrow fade-up">What You'll Learn</p>
          <h2 className="section-title fade-up">The Curriculum</h2>
          <div className="hr-gold fade-up" />
          <div className="curriculum-grid">
            {[
              {
                type: "E-Book",
                name: "Hair Color Mastery Guide",
                desc: "Teddy's complete color formulation system — from theory to application. Used by professional stylists across Nashville.",
                topics: ["Color theory & the wheel", "Formulation for all skin tones", "Corrective color techniques", "Client consultation scripts"]
              },
              {
                type: "Online Course",
                name: "Wig Construction Masterclass",
                desc: "Step-by-step video course covering lace front construction, customization, and client consultation for all wig types.",
                topics: ["Lace front vs. full lace", "Measuring & fitting clients", "Customization techniques", "Medical wig consultations"]
              },
              {
                type: "E-Book",
                name: "The Silk Press Blueprint",
                desc: "The exact technique Teddy has perfected over 30 years. Zero heat damage, maximum results every single time.",
                topics: ["Heat protection protocols", "Sectioning & tension control", "Finishing & longevity tips", "Client aftercare instructions"]
              },
              {
                type: "Webinar Series",
                name: "Salon Business Bootcamp",
                desc: "How to build and sustain a profitable salon business — pricing, hiring, retention, and marketing from 30+ years of experience.",
                topics: ["Pricing your services profitably", "Building a loyal clientele", "Hiring & managing stylists", "Social media & content strategy"]
              },
              {
                type: "Masterclass",
                name: "Advanced Color Correction",
                desc: "Deep-dive into the most challenging color scenarios. Fix disasters, manage client expectations, and charge premium rates.",
                topics: ["Bleach & tone systems", "Fixing box dye disasters", "Documenting your process", "Pricing corrections fairly"]
              },
              {
                type: "Workshop",
                name: "In-Person Nashville Intensive",
                desc: "A full-day hands-on workshop at Beverly's of Nashville. Limited seats. Work directly with Teddy on live models.",
                topics: ["Live model color work", "Wig construction demo", "Business Q&A with Teddy", "Certificate of completion"]
              },
            ].map(c => (
              <div
                key={c.name}
                className="fade-up"
                style={{ background: "#111", padding: "36px 28px", borderBottom: "3px solid transparent", transition: "border-color 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.borderBottomColor = "#C9A84C")}
                onMouseLeave={e => (e.currentTarget.style.borderBottomColor = "transparent")}
              >
                <div style={{ fontSize: "9px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "12px" }}>{c.type}</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", marginBottom: "12px", lineHeight: 1.2 }}>{c.name}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "24px" }}>{c.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                  {c.topics.map(t => (
                    <div key={t} style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "11px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>
                      <BevListCheck size={12} marginTop="1px" />
                      <span>{t}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Instructor ── */}
      <section id="instructor" className="bev-section" style={{ background: "#111" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "center" }}>
            <div className="fade-up">
              <img
                src={PHOTOS.teddySalon3}
                alt="Teddy Chisom — Beverly's Academy Instructor"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top", border: "1px solid rgba(201,168,76,0.2)" }}
              />
            </div>
            <div>
              <p className="eyebrow fade-up">Your Instructor</p>
              <h2 className="section-title fade-up">Teddy Chisom</h2>
              <div className="hr-gold fade-up" />
              <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                {[
                  { num: "30+", label: "Years in the industry" },
                  { num: "5,000+", label: "Clients served in Nashville" },
                  { num: "100+", label: "Stylists mentored" },
                ].map(s => (
                  <div key={s.label} className="fade-up" style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: "40px", color: "#C9A84C", lineHeight: 1 }}>{s.num}</div>
                    <div style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", lineHeight: 1.4 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <p className="fade-up" style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "20px" }}>
                Theodore "Teddy" Chisom has spent over three decades mastering every aspect of the hair industry — from color chemistry to wig construction to salon business management. His clients include everyday Nashville women, cancer patients, celebrities, and aspiring stylists who've gone on to build their own successful businesses.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {[
                  "Licensed Cosmetologist — 30+ years, Nashville TN",
                  "Master Colorist & Silk Press Specialist",
                  "Custom Wig Artisan — Fashion & Medical Units",
                  "Salon Owner & Business Mentor",
                  "Featured in Nashville hair community since 1994",
                ].map(c => (
                  <div key={c} className="fade-up instructor-cred" style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>
                    <BevListCheck />
                    {c}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Social Proof Quote ── */}
      <section className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          <div className="fade-up" style={{ maxWidth: "720px", margin: "0 auto", textAlign: "center" }}>
            <div style={{ color: "#C9A84C", fontSize: "40px", fontFamily: "Georgia, serif", lineHeight: 1, marginBottom: "16px" }}>"</div>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px, 2.5vw, 26px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.5, fontStyle: "italic", marginBottom: "24px" }}>
              Teddy didn't just teach me how to do hair — he taught me how to build a career. His knowledge of color formulation alone is worth more than any cosmetology school course I took.
            </p>
            <div style={{ fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C" }}>
              — Former Mentee, Now Salon Owner in Nashville
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" className="bev-section" style={{ background: "#111" }}>
        <div className="container">
          <p className="eyebrow fade-up">Questions</p>
          <h2 className="section-title fade-up">Frequently Asked</h2>
          <div className="hr-gold fade-up" />
          <div style={{ marginTop: "48px", maxWidth: "780px" }}>
            <FAQList />
          </div>
        </div>
      </section>

      {/* ── Final CTA ── */}
      <section className="bev-section" style={{ background: "#1a1a1a", textAlign: "center" }}>
        <div className="container">
          <p className="eyebrow fade-up">Ready to Elevate Your Career?</p>
          <h2 className="section-title fade-up">Join the Beverly's Academy Waitlist</h2>
          <div className="hr-gold fade-up" style={{ margin: "20px auto" }} />
          <p className="fade-up" style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "560px", margin: "0 auto 32px", lineHeight: 1.7 }}>
            Get early access, exclusive pricing, and a free guide — all from 30+ years of Nashville's finest hair artistry.
          </p>
          <div className="fade-up">
            <a href="#waitlist" className="btn-gold">Join the Waitlist →</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

// ── Academy Form ──────────────────────────────────────────────────────────
function AcademyForm() {
  const [submitted, setSubmitted] = useState(false);
  const [role, setRole] = useState("");

  if (submitted) {
    return (
      <div style={{ textAlign: "center", padding: "32px 0" }}>
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "16px" }}>
          <BadgeCheck size={44} strokeWidth={1.5} color="#C9A84C" aria-hidden />
        </div>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: "#C9A84C", marginBottom: "10px" }}>You're on the list!</div>
        <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
          Check your inbox for the free "5 Color Mistakes" guide. We'll be in touch soon with early access details.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>First Name</label>
        <input type="text" required placeholder="Your first name" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.25)", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit" }} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>Email Address</label>
        <input type="email" required placeholder="your@email.com" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.25)", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit" }} />
      </div>
      <div style={{ marginBottom: "28px" }}>
        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>I Am A...</label>
        <select
          value={role}
          onChange={e => setRole(e.target.value)}
          required
          style={{ width: "100%", padding: "14px 16px", background: "#111", border: "1px solid rgba(201,168,76,0.25)", color: role ? "#fff" : "rgba(255,255,255,0.3)", fontSize: "14px", outline: "none", cursor: "pointer", appearance: "none", fontFamily: "inherit" }}
        >
          <option value="" disabled>Select your role</option>
          <option value="student">Cosmetology Student</option>
          <option value="new">New Stylist (0–3 years)</option>
          <option value="experienced">Experienced Stylist (3+ years)</option>
          <option value="owner">Salon Owner</option>
          <option value="enthusiast">Hair Enthusiast / DIY</option>
        </select>
      </div>
      <button type="submit" className="btn-gold" style={{ width: "100%", padding: "16px", fontSize: "11px" }}>
        Join the Waitlist — Get Free Guide
      </button>
      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "16px", lineHeight: 1.5 }}>
        No spam, ever. Unsubscribe anytime. Your free guide arrives instantly.
      </p>
    </form>
  );
}

// ── FAQ Accordion ─────────────────────────────────────────────────────────
const FAQS = [
  { q: "When will the Academy launch?", a: "We're targeting a launch in the coming months. Waitlist members will be the first to know and will receive early-bird pricing before the public announcement." },
  { q: "Who are the courses designed for?", a: "Beverly's Academy serves everyone from cosmetology students to 20-year veterans. Each product is clearly labeled with its target skill level. Beginners will find foundational guides, while experienced stylists will find advanced techniques and business content." },
  { q: "Will there be in-person workshops?", a: "Yes! We plan to host in-person intensives at Beverly's of Nashville in Nashville, TN. These will be limited-seat events with hands-on model work directly with Teddy. Waitlist members get first access to register." },
  { q: "How much will the courses cost?", a: "E-books start at $29, online courses range from $99–$299, and in-person workshops will be priced separately. Waitlist members receive 30–40% early-bird discounts on all products." },
  { q: "Is there a certificate of completion?", a: "Yes — all paid courses include a Beverly's Academy Certificate of Completion signed by Teddy Chisom. In-person workshop attendees receive a physical certificate." },
  { q: "Can I get a refund if I'm not satisfied?", a: "Absolutely. All digital products come with a 30-day satisfaction guarantee. If you're not happy, we'll refund you — no questions asked." },
];

function FAQList() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div>
      {FAQS.map((faq, i) => (
        <div
          key={i}
          className="fade-up"
          style={{ borderBottom: "1px solid rgba(201,168,76,0.15)", padding: "24px 0", cursor: "pointer" }}
          onClick={() => setOpen(open === i ? null : i)}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
            <div style={{ fontSize: "16px", color: "#fff", fontFamily: "Georgia, serif", lineHeight: 1.3 }}>{faq.q}</div>
            <div style={{ color: "#C9A84C", fontSize: "20px", flexShrink: 0, transition: "transform 0.3s", transform: open === i ? "rotate(45deg)" : "none" }}>+</div>
          </div>
          {open === i && (
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.8, paddingTop: "16px" }}>{faq.a}</p>
          )}
        </div>
      ))}
    </div>
  );
}
