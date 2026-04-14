/**
 * Beverly's Academy Portal — Home / Dashboard
 */
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { PRODUCTS, TOOLS } from "@/lib/products";
import { Lock, PlayCircle, Sparkles, Trophy, ArrowUpRight } from "lucide-react";

const GOLD = "#C9A84C";
const CHARCOAL = "#1A1A1A";

export default function PortalHome() {
  const { profile, user, tier, isAdmin, can } = useAuth();
  const name = profile?.full_name?.split(" ")[0] || user?.email?.split("@")[0] || "there";

  const accessible = PRODUCTS.filter((p) => can(p.slug));
  const locked = PRODUCTS.filter((p) => !can(p.slug));

  return (
    <PortalLayout>
      {/* Welcome Hero */}
      <div style={{ marginBottom: "48px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "10px" }}>
          {isAdmin ? "Admin Dashboard" : "Your Academy"}
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 4vw, 46px)", margin: "0 0 12px", lineHeight: 1.15 }}>
          Welcome back, <em style={{ color: GOLD, fontStyle: "italic" }}>{name}.</em>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "620px" }}>
          {accessible.length} {accessible.length === 1 ? "product" : "products"} unlocked. Pick up where you left off or start something new.
        </p>
      </div>

      {/* Stats row */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "16px",
          marginBottom: "48px",
        }}
      >
        <Stat icon={<Sparkles size={20} color={GOLD} />} label="Current Tier" value={isAdmin ? "Admin" : tier.charAt(0).toUpperCase() + tier.slice(1)} />
        <Stat icon={<PlayCircle size={20} color={GOLD} />} label="Unlocked" value={`${accessible.length} products`} />
        <Stat icon={<Trophy size={20} color={GOLD} />} label="Certificates" value="0" />
        <Stat icon={<ArrowUpRight size={20} color={GOLD} />} label="Streak" value="Day 1" />
      </div>

      {/* Continue learning */}
      <SectionHeader title="Continue Learning" subtitle="Jump back in where you left off" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "48px" }}>
        {accessible.slice(0, 3).map((p) => (
          <Link key={p.slug} href={p.path}>
            <div style={productCard(false)}>
              <div style={{ fontSize: "10px", letterSpacing: "2px", color: GOLD, textTransform: "uppercase", marginBottom: "8px" }}>
                {p.category}
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", marginBottom: "8px", lineHeight: 1.2 }}>{p.title}</div>
              <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{p.subtitle}</div>
              <div style={{ marginTop: "16px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                {p.duration} · {p.lessonCount} lessons
              </div>
            </div>
          </Link>
        ))}
      </div>

      {/* Locked / upgrade tease */}
      {locked.length > 0 && !isAdmin && (
        <>
          <SectionHeader
            title="Unlock More"
            subtitle="Upgrade your tier to access every masterclass Teddy has ever recorded"
          />
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginBottom: "48px" }}>
            {locked.slice(0, 3).map((p) => (
              <Link key={p.slug} href="/pricing">
                <div style={productCard(true)}>
                  <Lock size={18} color={GOLD} style={{ position: "absolute", top: "16px", right: "16px" }} />
                  <div style={{ fontSize: "10px", letterSpacing: "2px", color: GOLD, textTransform: "uppercase", marginBottom: "8px" }}>
                    Requires {p.requiredTier}
                  </div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", marginBottom: "8px", lineHeight: 1.2 }}>{p.title}</div>
                  <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{p.subtitle}</div>
                </div>
              </Link>
            ))}
          </div>
          <div style={{ textAlign: "center", marginBottom: "40px" }}>
            <Link href="/pricing">
              <button
                style={{
                  padding: "14px 32px",
                  background: GOLD,
                  color: CHARCOAL,
                  border: "none",
                  borderRadius: "4px",
                  fontSize: "12px",
                  fontWeight: 700,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  cursor: "pointer",
                }}
              >
                See All Tiers →
              </button>
            </Link>
          </div>
        </>
      )}

      {/* Tools */}
      <SectionHeader title="Interactive Tools" subtitle="The magic that no PDF could ever deliver" />
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {TOOLS.map((t) => {
          const unlocked = can(t.slug);
          return (
            <Link key={t.slug} href={unlocked ? t.path : "/pricing"}>
              <div style={productCard(!unlocked)}>
                {!unlocked && <Lock size={18} color={GOLD} style={{ position: "absolute", top: "16px", right: "16px" }} />}
                <div style={{ fontSize: "10px", letterSpacing: "2px", color: GOLD, textTransform: "uppercase", marginBottom: "8px" }}>
                  {unlocked ? "Tool · Open" : `Requires ${t.requiredTier}`}
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "8px", lineHeight: 1.2 }}>{t.title}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{t.subtitle}</div>
              </div>
            </Link>
          );
        })}
      </div>
    </PortalLayout>
  );
}

function Stat({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "20px" }}>
      <div style={{ marginBottom: "12px" }}>{icon}</div>
      <div style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "4px" }}>
        {label}
      </div>
      <div style={{ fontFamily: "Georgia, serif", fontSize: "22px" }}>{value}</div>
    </div>
  );
}

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: "26px", margin: "0 0 4px" }}>{title}</h2>
      <p style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>{subtitle}</p>
    </div>
  );
}

const productCard = (locked: boolean): React.CSSProperties => ({
  background: locked ? "rgba(255,255,255,0.02)" : "#1a1a1a",
  border: locked ? "1px dashed rgba(201,168,76,0.3)" : "1px solid rgba(255,255,255,0.06)",
  borderRadius: "8px",
  padding: "24px",
  cursor: "pointer",
  position: "relative",
  transition: "all .2s",
  minHeight: "180px",
});
