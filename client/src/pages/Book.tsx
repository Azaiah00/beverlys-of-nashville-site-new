/**
 * Beverly's of Nashville — Book a Service Page (/book)
 * Dedicated booking funnel: hero → contact form → what-to-expect.
 * Form shares the same Netlify "contact" name as Home.tsx — submissions
 * Notification recipients are configured in the Netlify project dashboard.
 */
import { useEffect, useState } from "react";
import type { CSSProperties } from "react";
import { BadgeCheck, Calendar, MessageCircle, Sparkles } from "lucide-react";
import { Nav, Footer } from "@/components/Layout";

function useFadeUp() {
  useEffect(() => {
    const els = document.querySelectorAll(".fade-up");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = "1";
            (e.target as HTMLElement).style.transform = "translateY(0)";
          }
        });
      },
      { threshold: 0.1 }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, []);
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
  const [selectedService, setSelectedService] = useState("");
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
    const phone = String(fd.get("phone") ?? "").trim();
    const service = String(fd.get("service") ?? "").trim();
    if (botField) return;

    const body = new URLSearchParams();
    body.append("form-name", "contact");
    body.append("bot-field", "");
    body.append("name", name);
    body.append("email", email);
    body.append("phone", phone);
    body.append("service", service);
    body.append("message", message);

    setStatus("submitting");
    try {
      const res = await fetch("/__forms.html", {
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
      <div style={{ marginBottom: "16px" }}>
        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "8px" }}>Phone</label>
        <input name="phone" type="tel" placeholder="(615) 555-1234" style={inputStyle} />
      </div>
      <div style={{ marginBottom: "20px" }}>
        <label style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", display: "block", marginBottom: "12px" }}>Service Interested In</label>
        <input type="hidden" name="service" value={selectedService} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "8px" }}>
          {["Color", "Cuts", "Silk Press", "Extensions", "Custom Wig", "Medical Wig", "The Reveal", "The Academy", "Other"].map((svc) => {
            const selected = selectedService === svc;
            return (
              <button
                key={svc}
                type="button"
                onClick={() => setSelectedService(svc)}
                style={{
                  padding: "12px 10px",
                  background: selected ? "#C9A84C" : "rgba(255,255,255,0.04)",
                  color: selected ? "#111" : "#F4F1EA",
                  border: selected ? "1px solid #C9A84C" : "1px solid #2a2a2a",
                  fontSize: "12px",
                  fontFamily: "inherit",
                  fontWeight: selected ? 700 : 500,
                  letterSpacing: "0.5px",
                  cursor: "pointer",
                  borderRadius: 0,
                  textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                {svc}
              </button>
            );
          })}
        </div>
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
export default function Book() {
  useFadeUp();

  return (
    <>
      <Nav />
      <main style={{ paddingTop: "80px", background: "#0e0e0e", minHeight: "100vh" }}>

        {/* HERO */}
        <section className="bev-section" style={{ background: "#1a1a1a", padding: "96px 0 64px" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <img
              src="/assets/teddy-styling-hero.jpg"
              alt="Teddy Chisom — Master Stylist at Beverly's of Nashville"
              className="fade-up"
              style={{
                width: "240px",
                height: "240px",
                objectFit: "cover",
                margin: "0 auto 32px",
                display: "block",
                border: "1px solid rgba(201,168,76,0.45)",
                boxShadow: "0 14px 44px rgba(0,0,0,0.55), 0 0 0 1px rgba(0,0,0,0.4)",
              }}
            />
            <p className="eyebrow fade-up">Book a Service</p>
            <h1 className="section-title fade-up" style={{ marginBottom: "16px" }}>
              Reserve Your Chair with <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Teddy</em>.
            </h1>
            <p className="fade-up" style={{ maxWidth: "620px", margin: "16px auto 0", color: "#B8B2A3", fontSize: "16px", lineHeight: 1.65 }}>
              Tell us a little about what you&rsquo;re looking for and we&rsquo;ll be in touch within
              one business day. New clients receive a complimentary 15-minute color consultation
              with their first booking.
            </p>
          </div>
        </section>

        {/* FORM */}
        <section className="bev-section" style={{ background: "#0e0e0e", padding: "64px 0" }}>
          <div className="container" style={{ maxWidth: "720px" }}>
            <ContactForm />
          </div>
        </section>

        {/* WHAT TO EXPECT */}
        <section className="bev-section" style={{ background: "#1a1a1a", padding: "80px 0 96px" }}>
          <div className="container">
            <p className="eyebrow fade-up" style={{ textAlign: "center" }}>What to Expect</p>
            <h2 className="section-title fade-up" style={{ textAlign: "center", marginBottom: "48px" }}>
              From inquiry to <em style={{ color: "#C9A84C", fontStyle: "italic" }}>in the chair.</em>
            </h2>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "32px", maxWidth: "1000px", margin: "0 auto" }}>
              {[
                { Icon: MessageCircle, title: "1. Personal Reply", body: "Teddy or the salon front desk replies within one business day. Same-day requests when possible." },
                { Icon: Calendar, title: "2. Your Time, Confirmed", body: "We'll suggest a time that fits your schedule and lock it in. You receive a confirmation by phone or email." },
                { Icon: Sparkles, title: "3. The Chair", body: "Show up. Be welcomed. Get the work that earned Beverly's its reputation — three decades of master technique." },
              ].map(({ Icon, title, body }) => (
                <div key={title} className="fade-up" style={{ padding: "28px 24px", border: "1px solid rgba(201,168,76,0.18)", background: "#161616" }}>
                  <Icon size={28} color="#C9A84C" style={{ marginBottom: "16px" }} />
                  <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", color: "#F4F1EA", margin: "0 0 8px 0", fontWeight: 400 }}>
                    {title}
                  </h3>
                  <p style={{ color: "#9C9789", fontSize: "13.5px", lineHeight: 1.6, margin: 0 }}>{body}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ALT CONTACT */}
        <section style={{ background: "#0e0e0e", padding: "48px 0 96px", borderTop: "1px solid #1f1f1f", textAlign: "center" }}>
          <div className="container">
            <p style={{ fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "16px", fontWeight: 600 }}>
              Prefer to Call?
            </p>
            <p style={{ fontFamily: "Georgia, serif", fontSize: "26px", color: "#F4F1EA", margin: "0 0 8px 0" }}>
              <a href="tel:+16154974215" style={{ color: "inherit", textDecoration: "none", borderBottom: "1px solid #C9A84C" }}>(615) 497-4215</a>
            </p>
            <p style={{ color: "#9C9789", fontSize: "13px", margin: "0 0 4px 0" }}>3304 Nolensville Pike &middot; Nashville, TN 37211</p>
            <p style={{ color: "#9C9789", fontSize: "13px", margin: 0 }}>Tuesday &ndash; Saturday &middot; Sunday by appointment</p>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
