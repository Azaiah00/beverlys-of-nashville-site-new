/**
 * Beverly's of Nashville — Blog Post Pages
 * Design: matches uploaded blog post HTML files exactly
 * Dark charcoal + Gold, Georgia serif, editorial layout
 */
import { useEffect } from "react";
import { useParams, Link } from "wouter";
import { BevListCheck } from "@/components/BevLucide";
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

// ── Blog post content ─────────────────────────────────────────────────────
const POSTS: Record<string, {
  category: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  heroImage: string;
  content: { type: string; text?: string; items?: string[]; heading?: string }[];
}> = {
  "color-mistakes-stylists": {
    category: "Education",
    title: "5 Color Mistakes Every Stylist Makes",
    subtitle: "(And How to Fix Them)",
    date: "March 15, 2025",
    readTime: "8 min read",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/color-work_c073b08e.jpg",
    content: [
      { type: "intro", text: "After 30+ years behind the chair at Beverly's of Nashville, I've seen every color disaster imaginable — and fixed most of them. The truth is, most color mistakes come down to the same five errors. Master these, and you'll save yourself hours of correction work and keep your clients coming back." },
      { type: "h2", heading: "Mistake #1: Skipping the Consultation" },
      { type: "p", text: "The consultation isn't a formality — it's the foundation of every successful color service. Too many stylists rush through it or skip it entirely when they're busy. This is where you discover the client's hair history, their maintenance habits, their lifestyle, and — most importantly — the gap between what they want and what their hair can realistically achieve." },
      { type: "p", text: "My rule: never pick up a brush until you've asked at least these five questions: What's your current hair history? How much time do you spend on maintenance? What's your budget for upkeep? Can you show me three photos of what you want? And — what's the one thing you absolutely don't want?" },
      { type: "h2", heading: "Mistake #2: Not Doing a Strand Test" },
      { type: "p", text: "I know, I know — strand tests take time. But a five-minute strand test can save you a four-hour correction appointment. This is especially critical on previously colored hair, relaxed hair, or any hair with an unknown history. The strand test tells you how the hair will respond to the formula before you commit to the whole head." },
      { type: "p", text: "If a client refuses a strand test, document it. Have them sign off that they declined. This protects you legally and professionally." },
      { type: "h2", heading: "Mistake #3: Incorrect Developer Volume" },
      { type: "p", text: "Developer volume is one of the most misunderstood elements of color chemistry. Using too high a volume doesn't just lift faster — it can cause irreversible damage, uneven results, and scalp burns. Using too low a volume means you won't achieve the lift you need." },
      { type: "list", items: ["10 Vol: Deposit only, no lift. Use for toning and refreshing color.", "20 Vol: 1–2 levels of lift. The standard for most color services.", "30 Vol: 2–3 levels of lift. Use with caution on fine or damaged hair.", "40 Vol: Maximum lift. Reserve for resistant hair only, never on the scalp."] },
      { type: "h2", heading: "Mistake #4: Ignoring Underlying Pigment" },
      { type: "p", text: "This is the one that trips up even experienced stylists. When you lift hair, you don't just remove color — you reveal underlying warm pigments. A client with dark brown hair who wants platinum blonde will go through yellow, orange, and red stages before reaching their goal. If you don't account for this and neutralize appropriately, you'll end up with brassy, orange results." },
      { type: "p", text: "The solution: understand the color wheel. Violet neutralizes yellow. Blue neutralizes orange. Green neutralizes red. Always tone after lifting, and always use a toner that addresses the specific underlying pigment you're dealing with." },
      { type: "h2", heading: "Mistake #5: Rushing the Processing Time" },
      { type: "p", text: "Processing time isn't a suggestion — it's chemistry. Cutting it short means incomplete color development, uneven results, and poor longevity. Going over means damage and over-processing. Set a timer. Check the strand. Trust the process." },
      { type: "p", text: "The most common reason stylists rush processing? They're double-booked. If you can't give a color service your full attention, don't take the booking. Your reputation depends on every result you put out the door." },
      { type: "cta", text: "Want Teddy's complete color formulation system? Join the Beverly's Academy waitlist and get the free '5 Color Mistakes' PDF guide — plus early access to the Hair Color Mastery Guide." },
    ]
  },
  "wigs-cancer-nashville": {
    category: "Wig Boutique",
    title: "Finding the Right Wig After Cancer",
    subtitle: "A Nashville Guide from Beverly's",
    date: "February 28, 2025",
    readTime: "6 min read",
    heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/wig-consultation_ded7bfc7.jpg",
    content: [
      { type: "intro", text: "Losing your hair during cancer treatment is one of the most emotional experiences a person can face. It's not just about appearance — it's about identity, dignity, and feeling like yourself during one of the hardest chapters of your life. At Beverly's of Nashville, we walk alongside you with compassion, expertise, and the finest custom wigs in Tennessee." },
      { type: "h2", heading: "You Deserve to Feel Beautiful" },
      { type: "p", text: "We want to say this clearly: you are not defined by your hair. But we also understand that having a wig that looks natural, fits comfortably, and feels like you can make an enormous difference in how you feel during treatment. That's why we take every medical wig consultation seriously — and why we offer private, one-on-one appointments for our medical clients." },
      { type: "h2", heading: "When to Start Looking for a Wig" },
      { type: "p", text: "If possible, we recommend coming in before you begin treatment. This allows us to match your natural hair color, texture, and style while you still have your hair. We can document your look and create a custom unit that's as close to your natural hair as possible." },
      { type: "p", text: "If you're already in treatment or have already experienced hair loss, that's completely okay too. We work with clients at every stage, and we'll create something beautiful regardless of where you are in your journey." },
      { type: "h2", heading: "Understanding Your Options" },
      { type: "list", items: [
        "Synthetic Wigs ($150–$400): Affordable, low-maintenance, and available in a wide range of styles. Great for everyday wear.",
        "Human Hair Wigs ($400–$1,200): The most natural-looking option. Can be styled with heat tools, colored, and worn for years with proper care.",
        "Cranial Prostheses ($350–$3,500+): Medical-grade custom units designed specifically for hair loss due to medical conditions. May be covered by insurance.",
      ]},
      { type: "h2", heading: "Insurance Reimbursement for Wigs" },
      { type: "p", text: "Many insurance plans — including Medicare — cover wigs (classified as 'cranial prostheses') for patients experiencing hair loss due to cancer treatment. Coverage varies by plan, but reimbursements can range from $350 to $3,500+." },
      { type: "p", text: "At Beverly's, we can help you navigate the insurance process. We recommend calling your insurance provider before your appointment to ask specifically about 'cranial prosthesis' coverage. Bring your insurance card and any documentation from your oncologist to your consultation." },
      { type: "h2", heading: "What to Expect at Your Consultation" },
      { type: "p", text: "Your consultation at Beverly's is a private, unhurried appointment. We'll talk about your hair history, your lifestyle, your preferences, and your budget. We'll take measurements, discuss construction options, and help you choose a style that makes you feel like yourself. There's no pressure, no rush, and no judgment." },
      { type: "p", text: "Many of our medical clients tell us that their consultation at Beverly's was the first time they felt hopeful and beautiful since their diagnosis. That means everything to us." },
      { type: "cta", text: "Ready to schedule a private wig consultation? Call us at (615) 497-4215 or book online. We're here for you." },
    ]
  },
};

// Generic post for slugs not in our database
const GENERIC_POST = {
  category: "Beverly's Journal",
  title: "Article Coming Soon",
  subtitle: "Beverly's of Nashville",
  date: "2025",
  readTime: "5 min read",
  heroImage: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddy-in-salon_3b149114.jpg",
  content: [
    { type: "intro", text: "This article is being written by Teddy Chisom and will be published soon. Join the Beverly's Academy waitlist to be notified when new content drops." },
    { type: "cta", text: "In the meantime, explore our services or book an appointment at Beverly's of Nashville." },
  ]
};

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  useFadeUp();

  const post = (slug && POSTS[slug]) ? POSTS[slug] : GENERIC_POST;

  return (
    <div style={{ background: "#1a1a1a", color: "#fff", minHeight: "100vh" }}>
      <Nav />

      {/* Hero */}
      <section style={{
        position: "relative", minHeight: "60vh",
        display: "flex", alignItems: "flex-end",
        background: "#111", overflow: "hidden", paddingBottom: "60px"
      }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: "3px", background: "linear-gradient(90deg, transparent, #C9A84C, transparent)" }} />
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `url(${post.heroImage})`,
          backgroundSize: "cover", backgroundPosition: "center",
          opacity: 0.25
        }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(17,17,17,0.95) 40%, rgba(17,17,17,0.5))" }} />
        <div className="container" style={{ position: "relative", zIndex: 2, paddingTop: "100px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <Link href="/blog" style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", transition: "color 0.2s" }}
              onMouseEnter={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "#C9A84C")}
              onMouseLeave={(e: React.MouseEvent<HTMLAnchorElement>) => (e.currentTarget.style.color = "rgba(255,255,255,0.5)")}
            >← The Journal</Link>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span style={{ fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C" }}>{post.category}</span>
          </div>
          <h1 className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(28px, 4.5vw, 52px)", fontWeight: 400, lineHeight: 1.1, marginBottom: "8px", maxWidth: "800px" }}>
            {post.title}
          </h1>
          <h2 className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(20px, 3vw, 36px)", fontWeight: 400, color: "#C9A84C", fontStyle: "italic", marginBottom: "20px" }}>
            {post.subtitle}
          </h2>
          <div className="fade-up" style={{ display: "flex", gap: "16px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>By Teddy Chisom</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{post.date}</span>
            <span style={{ color: "rgba(255,255,255,0.3)" }}>·</span>
            <span style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{post.readTime}</span>
          </div>
        </div>
      </section>

      {/* Article content */}
      <section className="bev-section" style={{ background: "#1a1a1a" }}>
        <div className="container" style={{ maxWidth: "760px" }}>
          {post.content.map((block, i) => {
            if (block.type === "intro") return (
              <p key={i} className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(16px, 2vw, 20px)", color: "rgba(255,255,255,0.85)", lineHeight: 1.8, marginBottom: "40px", borderLeft: "3px solid #C9A84C", paddingLeft: "24px" }}>
                {block.text}
              </p>
            );
            if (block.type === "h2") return (
              <h2 key={i} className="fade-up" style={{ fontFamily: "Georgia, serif", fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 400, color: "#fff", margin: "48px 0 16px" }}>
                {(block as { type: string; heading: string }).heading}
              </h2>
            );
            if (block.type === "p") return (
              <p key={i} className="fade-up" style={{ fontSize: "16px", color: "rgba(255,255,255,0.75)", lineHeight: 1.85, marginBottom: "20px" }}>
                {block.text}
              </p>
            );
            if (block.type === "list") return (
              <ul key={i} className="fade-up" style={{ margin: "20px 0 32px", paddingLeft: "0", listStyle: "none" }}>
                {(block as { type: string; items: string[] }).items?.map((item: string, j: number) => (
                  <li key={j} style={{ display: "flex", gap: "12px", fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.7, marginBottom: "12px", paddingLeft: "0" }}>
                    <BevListCheck marginTop="6px" />
                    {item}
                  </li>
                ))}
              </ul>
            );
            if (block.type === "cta") return (
              <div key={i} className="fade-up" style={{ background: "#111", border: "1px solid rgba(201,168,76,0.25)", padding: "32px 36px", margin: "48px 0", borderLeft: "4px solid #C9A84C" }}>
                <p style={{ fontSize: "16px", color: "rgba(255,255,255,0.8)", lineHeight: 1.7, marginBottom: "20px" }}>{block.text}</p>
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <a href="/academy" className="btn-gold">Join the Academy Waitlist</a>
                  <a href="https://booksy.com/en-us/899079_beverlys-of-nashville_hair-salon_15_nashville" target="_blank" rel="noopener noreferrer" className="btn-outline-gold">Book an Appointment</a>
                </div>
              </div>
            );
            return null;
          })}

          {/* Author bio */}
          <div className="fade-up" style={{ borderTop: "1px solid rgba(201,168,76,0.2)", paddingTop: "40px", marginTop: "48px", display: "flex", gap: "24px", alignItems: "flex-start" }}>
            <img
              src="https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddyinsalon3_4a47c75a.jpg"
              alt="Teddy Chisom"
              style={{ width: "80px", height: "80px", objectFit: "cover", objectPosition: "top", flexShrink: 0, border: "2px solid rgba(201,168,76,0.3)" }}
            />
            <div>
              <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "6px" }}>About the Author</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "18px", marginBottom: "8px" }}>Teddy Chisom</div>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.7 }}>
                Theodore "Teddy" Chisom is the founder and lead stylist of Beverly's of Nashville. With 30+ years of experience as a master colorist, silk press specialist, and custom wig artisan, Teddy is one of Nashville's most trusted hair professionals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related posts */}
      <section className="bev-section" style={{ background: "#111" }}>
        <div className="container">
          <p className="eyebrow fade-up">Keep Reading</p>
          <h2 className="section-title fade-up">More from The Journal</h2>
          <div className="hr-gold fade-up" />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "4px", marginTop: "32px" }}>
            {[
              { slug: "color-mistakes-stylists", category: "Education", title: "5 Color Mistakes Every Stylist Makes", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/color-work_c073b08e.jpg" },
              { slug: "wigs-cancer-nashville", category: "Wig Boutique", title: "Finding the Right Wig After Cancer", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/wig-consultation_ded7bfc7.jpg" },
              { slug: "silk-press-guide", category: "Technique", title: "The Perfect Silk Press: Teddy's 30-Year Method", image: "https://d2xsxph8kpxj0f.cloudfront.net/310519663497099941/gxRiXS3mGqaq9yk3PkuwhP/teddy-in-salon_3b149114.jpg" },
            ].filter(p => p.slug !== slug).slice(0, 2).map(p => (
              <Link key={p.slug} href={`/blog/${p.slug}`}>
                <div className="fade-up" style={{ background: "#1a1a1a", cursor: "pointer" }}>
                  <div style={{ aspectRatio: "16/10", overflow: "hidden" }}>
                    <img src={p.image} alt={p.title} style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s" }}
                      onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.05)")}
                      onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}
                    />
                  </div>
                  <div style={{ padding: "24px" }}>
                    <div style={{ fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: "#C9A84C", marginBottom: "10px" }}>{p.category}</div>
                    <h3 style={{ fontFamily: "Georgia, serif", fontSize: "18px", fontWeight: 400, lineHeight: 1.3 }}>{p.title}</h3>
                  </div>
                </div>
              </Link>
            ))}
            <div className="fade-up" style={{ background: "#1a1a1a", padding: "32px 28px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
              <p className="eyebrow" style={{ marginBottom: "16px" }}>The Academy</p>
              <h3 style={{ fontFamily: "Georgia, serif", fontSize: "20px", marginBottom: "16px", lineHeight: 1.3 }}>Learn from Teddy — Join the Waitlist</h3>
              <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.7, marginBottom: "24px" }}>Get early access to Beverly's Academy courses, e-books, and webinars.</p>
              <Link href="/academy" className="btn-gold" style={{ display: "inline-block", textAlign: "center" }}>Explore The Academy</Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
