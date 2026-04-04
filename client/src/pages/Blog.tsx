/**
 * Beverly's of Nashville — Blog Index Page
 * Design: matches uploaded blog HTML files exactly
 * Dark charcoal + Gold, Georgia serif, sharp rectangles
 */
import { useEffect } from "react";
import { Link } from "wouter";
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

const POSTS = [
  {
    slug: "color-mistakes-stylists",
    category: "Education",
    title: "5 Color Mistakes Every Stylist Makes (And How to Fix Them)",
    excerpt: "After 30+ years behind the chair, Teddy Chisom has seen every color disaster imaginable — and fixed most of them. Here are the five most common mistakes and exactly how to correct them.",
    date: "March 15, 2025",
    readTime: "8 min read",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/color-work_c073b08e.jpg",
  },
  {
    slug: "wigs-cancer-nashville",
    category: "Wig Boutique",
    title: "Finding the Right Wig After Cancer: A Nashville Guide",
    excerpt: "Losing your hair during cancer treatment is one of the most emotional experiences a person can face. At Beverly's of Nashville, we walk alongside you with compassion, expertise, and the finest custom wigs in Tennessee.",
    date: "February 28, 2025",
    readTime: "6 min read",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/wig-consultation_ded7bfc7.jpg",
  },
  {
    slug: "silk-press-guide",
    category: "Technique",
    title: "The Perfect Silk Press: Teddy's 30-Year Method",
    excerpt: "The silk press is one of the most requested services at Beverly's — and one of the most misunderstood. Here's how Teddy achieves that mirror-smooth finish with zero heat damage, every single time.",
    date: "February 10, 2025",
    readTime: "7 min read",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddy-in-salon_3b149114.jpg",
  },
  {
    slug: "custom-wigs-all-women",
    category: "Wig Boutique",
    title: "Custom Wigs Aren't Just for Hair Loss — They're for Every Woman",
    excerpt: "The custom wig market has exploded — and for good reason. Whether you want to protect your natural hair, experiment with color, or simply wake up flawless, a custom unit from Beverly's is the answer.",
    date: "January 22, 2025",
    readTime: "5 min read",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/488466365_1220721643388128_2928759630973482530_n_1eec219c.jpg",
  },
  {
    slug: "salon-business-tips",
    category: "Business",
    title: "How to Build a Six-Figure Salon Career: Lessons from 30 Years",
    excerpt: "Teddy Chisom didn't build Beverly's of Nashville overnight. It took three decades of discipline, client relationships, and smart business decisions. Here are the lessons he wishes he'd known on day one.",
    date: "January 8, 2025",
    readTime: "10 min read",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddyinsalon2_5fc523b8.jpg",
  },
  {
    slug: "nashville-hair-trends",
    category: "Trends",
    title: "Nashville Hair Trends for 2025: What Teddy Is Seeing in the Chair",
    excerpt: "From bold color transformations to protective styling and custom units, Nashville's hair scene is evolving fast. Here's what Teddy is seeing — and what you should know before your next appointment.",
    date: "December 30, 2024",
    readTime: "5 min read",
    image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/hairgallerybluebuzz_6874d450.jpeg",
  },
];

export default function Blog() {
  useFadeUp();

  return (
    <div style={{ background: "#1a1a1a", color: "#fff", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{
        position: "relative", paddingTop: "140px", paddingBottom: "80px",
        background: "linear-gradient(135deg, #111 0%, #1a150a 100%)",
        borderBottom: "1px solid rgba(201,168,76,0.15)"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
        <div className="container">
          <p className="eyebrow fade-up">Knowledge & Craft</p>
          <h1 className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(36px, 5vw, 60px)", fontWeight: 400, lineHeight: 1.1, marginBottom: "16px" }}>
            The Beverly's <em style={{ color: "#C9A84C", fontStyle: "italic" }}>Journal</em>
          </h1>
          <p className="fade-up" style={{ fontSize: "16px", color: "rgba(255,255,255,0.6)", maxWidth: "520px", lineHeight: 1.7 }}>
            Hair education, wig guides, business insights, and behind-the-chair stories from Teddy Chisom and the Beverly's team.
          </p>
        </div>
      </section>

      {/* Posts grid */}
      <section className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container">
          {/* Featured post */}
          <div className="fade-up" style={{ marginBottom: "4px" }}>
            <Link href={`/blog/${POSTS[0].slug}`}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", background: "#111", cursor: "pointer", transition: "opacity 0.2s" }}
                onMouseEnter={e => (e.currentTarget.style.opacity = "0.9")}
                onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
              >
                <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
                  <img src={POSTS[0].image} alt={POSTS[0].title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                    onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.03)")}
                    onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                  />
                </div>
                <div style={{ padding: "48px 40px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "16px" }}>
                    <span style={{ background: "#C9A84C", color: "#111", fontSize: "9px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase", padding: "4px 12px" }}>Featured</span>
                    <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C" }}>{POSTS[0].category}</span>
                  </div>
                  <h2 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 2.5vw, 28px)", fontWeight: 400, lineHeight: 1.2, marginBottom: "16px" }}>{POSTS[0].title}</h2>
                  <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7, marginBottom: "24px" }}>{POSTS[0].excerpt}</p>
                  <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{POSTS[0].date}</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>·</span>
                    <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>{POSTS[0].readTime}</span>
                  </div>
                  <div style={{ marginTop: "24px", color: "#C9A84C", fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase" }}>Read Article →</div>
                </div>
              </div>
            </Link>
          </div>

          {/* Grid of remaining posts */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px", marginTop: "4px" }}>
            {POSTS.slice(1).map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`}>
                <div style={{ background: "#111", cursor: "pointer", transition: "opacity 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.opacity = "0.85")}
                  onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                >
                  <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
                    <img src={post.image} alt={post.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "10px" }}>{post.category}</div>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 400, lineHeight: 1.3, marginBottom: "12px" }}>{post.title}</h3>
                    <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.6, marginBottom: "16px" }}>{post.excerpt.substring(0, 100)}...</p>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.35)" }}>{post.date} · {post.readTime}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bev-section" style={{ background: "#111", textAlign: "center" }}>
        <div className="container">
          <p className="eyebrow fade-up">Stay in the Know</p>
          <h2 className="section-title fade-up">Get New Articles in Your Inbox</h2>
          <div className="hr-gold fade-up" style={{ margin: "20px auto" }} />
          <p className="fade-up" style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "480px", margin: "0 auto 32px", lineHeight: 1.7 }}>
            Join the Beverly's community and get hair education, wig guides, and salon news delivered directly to you.
          </p>
          <div className="fade-up" style={{ display: "flex", maxWidth: "480px", margin: "0 auto", gap: "0" }}>
            <input type="email" placeholder="Your email address" style={{ flex: 1, padding: "14px 16px", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(201,168,76,0.25)", borderRight: "none", color: "#fff", fontSize: "14px", outline: "none", fontFamily: "inherit" }} />
            <button className="btn-gold" style={{ whiteSpace: "nowrap" }}>Subscribe</button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
