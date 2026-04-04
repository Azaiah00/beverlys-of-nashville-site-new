/**
 * Beverly's of Nashville — Free Guide Landing Page
 * Design: matches uploaded free-guide.html exactly
 * Dark charcoal + Gold, Georgia serif, sharp rectangles
 */
import { useEffect, useState } from "react";
import { Nav, Footer } from "@/components/Layout";

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

export default function FreeGuide() {
  useFadeUp();
  const [submitted, setSubmitted] = useState(false);

  return (
    <div style={{ background: "#1a1a1a", color: "#fff", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{
        position: "relative", minHeight: "75vh",
        display: "flex", alignItems: "center",
        background: "linear-gradient(135deg, #111 0%, #1a150a 100%)",
        overflow: "hidden"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/color-work_c073b08e.jpg)`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.15
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(17,17,17,0.92) 55%, rgba(17,17,17,0.5))" }} />

        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "70px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "center" }}>
            {/* Left: Copy */}
            <div>
              <div style={{ display: "inline-block", background: "#C9A84C", color: "#111", fontSize: "9px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", padding: "6px 16px", marginBottom: "24px" }}>
                Free Download
              </div>
              <h1 className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 56px)", fontWeight: 400, lineHeight: 1.1, marginBottom: "12px" }}>
                5 Color Mistakes<br />
                <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Every Stylist Makes</em>
              </h1>
              <h2 className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(18px, 2.5vw, 26px)", fontWeight: 400, color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>
                (And How to Fix Them)
              </h2>
              <p className="fade-up" style={{ fontSize: "16px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "32px", maxWidth: "480px" }}>
                A free PDF guide from Teddy Chisom — 30+ years of Nashville hair mastery distilled into the five most common color errors and exactly how to correct them.
              </p>
              <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
                {[
                  "Why skipping the consultation costs you clients",
                  "The developer volume mistake that damages hair",
                  "How to neutralize underlying pigment correctly",
                  "The strand test shortcut that saves hours",
                  "Processing time: why rushing destroys results",
                ].map(item => (
                  <div key={item} style={{ display: "flex", alignItems: "flex-start", gap: "12px", fontSize: "14px", color: "rgba(255,255,255,0.75)" }}>
                    <span style={{ color: "#C9A84C", fontSize: "10px", marginTop: "4px", flexShrink: 0 }}>✦</span>
                    {item}
                  </div>
                ))}
              </div>
              <div className="fade-up" style={{ fontSize: "12px", color: "rgba(255,255,255,0.35)", letterSpacing: "1px" }}>
                Instant download · No credit card required · 100% free
              </div>
            </div>

            {/* Right: Form */}
            <div className="fade-up">
              <div style={{ background: "#111", border: "1px solid rgba(201,168,76,0.25)", padding: "48px 40px" }}>
                {!submitted ? (
                  <>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "24px", marginBottom: "8px" }}>Get the Free Guide</h3>
                    <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.5)", lineHeight: 1.6, marginBottom: "32px" }}>
                      Enter your details below and we'll send the PDF guide to your inbox instantly — plus early access to Beverly's Academy when it launches.
                    </p>
                    <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>
                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>First Name</label>
                        <input type="text" required placeholder="Your first name" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                      </div>
                      <div style={{ marginBottom: "20px" }}>
                        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>Email Address</label>
                        <input type="email" required placeholder="your@email.com" style={{ width: "100%", padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.2)", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit", boxSizing: "border-box" }} />
                      </div>
                      <div style={{ marginBottom: "28px" }}>
                        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>I Am A...</label>
                        <select required defaultValue="" style={{ width: "100%", padding: "14px 16px", background: "#0a0a0a", border: "1px solid rgba(201,168,76,0.2)", color: "#fff", fontSize: "14px", outline: "none", cursor: "pointer", appearance: "none", fontFamily: "inherit", boxSizing: "border-box" }}>
                          <option value="" disabled>Select your role</option>
                          <option value="student">Cosmetology Student</option>
                          <option value="new">New Stylist (0–3 years)</option>
                          <option value="experienced">Experienced Stylist (3+ years)</option>
                          <option value="owner">Salon Owner</option>
                          <option value="enthusiast">Hair Enthusiast / DIY</option>
                        </select>
                      </div>
                      <button type="submit" className="btn-gold" style={{ width: "100%", padding: "16px", fontSize: "11px" }}>
                        Send Me the Free Guide →
                      </button>
                      <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.3)", textAlign: "center", marginTop: "16px", lineHeight: 1.5 }}>
                        No spam. Unsubscribe anytime. Guide arrives instantly.
                      </p>
                    </form>
                  </>
                ) : (
                  <div style={{ textAlign: "center", padding: "24px 0" }}>
                    <div style={{ fontSize: "48px", marginBottom: "20px" }}>✦</div>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: "#C9A84C", marginBottom: "12px" }}>Check Your Inbox!</h3>
                    <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.7, marginBottom: "24px" }}>
                      Your free guide is on its way. You'll also be the first to know when Beverly's Academy launches — with exclusive early-bird pricing.
                    </p>
                    <a href="/academy" className="btn-gold" style={{ display: "inline-block" }}>Explore The Academy →</a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What's inside */}
      <section className="bev-section" style={{ background: "#111" }}>
        <div className="container">
          <p className="eyebrow fade-up">What's Inside</p>
          <h2 className="section-title fade-up">The Guide at a Glance</h2>
          <div className="hr-gold fade-up" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2px", marginTop: "40px" }}>
            {[
              { num: "01", title: "The Consultation Framework", desc: "The 5 questions Teddy asks every client before picking up a brush. This alone will save you from 80% of color disasters." },
              { num: "02", title: "Developer Volume Decoded", desc: "A clear breakdown of when to use 10, 20, 30, and 40 volume developer — and the one mistake that damages hair permanently." },
              { num: "03", title: "Understanding Underlying Pigment", desc: "Why your clients end up brassy — and the exact neutralization technique to fix it every time." },
              { num: "04", title: "The Strand Test System", desc: "Teddy's quick strand test protocol that takes 5 minutes and saves hours of correction work." },
              { num: "05", title: "Processing Time Rules", desc: "Why rushing processing destroys results — and the timer system Teddy uses on every color service." },
              { num: "Bonus", title: "Teddy's Academy Preview", desc: "A sneak peek at the full Hair Color Mastery Guide — available exclusively to Beverly's Academy members." },
            ].map(item => (
              <div key={item.num} className="fade-up" style={{ background: "#1a1a1a", padding: "36px 28px" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#C9A84C", lineHeight: 1, marginBottom: "16px" }}>{item.num}</div>
                <h3 style={{ fontFamily: "Georgia, serif", fontSize: "18px", marginBottom: "12px", lineHeight: 1.2 }}>{item.title}</h3>
                <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Teddy */}
      <section className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "80px", alignItems: "center", maxWidth: "900px" }}>
            <div className="fade-up">
              <img
                src="https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddyinsalon2_5fc523b8.jpg"
                alt="Teddy Chisom"
                style={{ width: "100%", aspectRatio: "3/4", objectFit: "cover", objectPosition: "top", border: "1px solid rgba(201,168,76,0.2)" }}
              />
            </div>
            <div>
              <p className="eyebrow fade-up">Your Guide Author</p>
              <h2 className="section-title fade-up" style={{ fontSize: "clamp(28px, 3.5vw, 40px)" }}>Teddy Chisom</h2>
              <div className="hr-gold fade-up" />
              <p className="fade-up" style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "20px" }}>
                Theodore "Teddy" Chisom has spent 30+ years mastering every aspect of the hair industry at Beverly's of Nashville. He's fixed more color disasters than he can count — and now he's sharing the knowledge that took him decades to accumulate.
              </p>
              <p className="fade-up" style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", lineHeight: 1.8, marginBottom: "28px" }}>
                This free guide is the first chapter of Beverly's Academy — Teddy's educational platform for aspiring and seasoned stylists nationwide. It's practical, specific, and based entirely on real experience in the chair.
              </p>
              <div className="fade-up">
                <a href="/academy" className="btn-gold">Explore The Full Academy →</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bev-section" style={{ background: "#111" }}>
        <div className="container">
          <p className="eyebrow fade-up">What Stylists Say</p>
          <h2 className="section-title fade-up">From Teddy's Students</h2>
          <div className="testimonials-grid">
            {[
              { text: "Teddy's color consultation framework alone changed how I approach every single client. I haven't had a color complaint since I started using his system.", author: "Keisha M.", role: "Salon Stylist, Nashville" },
              { text: "I've been doing hair for 12 years and still learned things from Teddy's guide that I wish I'd known on day one. The underlying pigment section is gold.", author: "Tanya R.", role: "Independent Stylist" },
              { text: "The strand test protocol saved me from a disaster on a client with previously relaxed hair. This guide is required reading for anyone who does color work.", author: "Monique L.", role: "Salon Owner, Memphis" },
            ].map(t => (
              <div key={t.author} className="fade-up" style={{ background: "#1a1a1a", padding: "36px 32px", borderLeft: "3px solid #C9A84C" }}>
                <p style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "rgba(255,255,255,0.85)", lineHeight: 1.7, fontStyle: "italic", marginBottom: "20px" }}>
                  "{t.text}"
                </p>
                <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C" }}>{t.author}</div>
                <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)", marginTop: "4px" }}>{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bev-section" style={{ background: "#1a1a1a", textAlign: "center" }}>
        <div className="container">
          <p className="eyebrow fade-up">It's Free. It's Instant.</p>
          <h2 className="section-title fade-up">Get the Guide Now</h2>
          <div className="hr-gold fade-up" style={{ margin: "20px auto" }} />
          <p className="fade-up" style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "0 auto 32px", lineHeight: 1.7 }}>
            30+ years of Nashville hair mastery. Five color mistakes. Zero cost to you.
          </p>
          <div className="fade-up">
            <a href="#hero" className="btn-gold">Download the Free Guide →</a>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
