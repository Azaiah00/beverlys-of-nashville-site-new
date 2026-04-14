/**
 * Beverly's Academy Portal — Library
 * Shows every product with lock/unlock state + filters.
 */
import { useState } from "react";
import { Link } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { PRODUCTS, TOOLS, type Product } from "@/lib/products";
import { Lock, Play, Unlock } from "lucide-react";

const GOLD = "#C9A84C";

type Filter = "all" | "unlocked" | "locked" | "ebook" | "masterclass" | "toolkit";

export default function Library() {
  const { can, isAdmin } = useAuth();
  const [filter, setFilter] = useState<Filter>("all");

  const all: Product[] = [...PRODUCTS, ...TOOLS];

  const filtered = all.filter((p) => {
    if (filter === "all") return true;
    if (filter === "unlocked") return can(p.slug);
    if (filter === "locked") return !can(p.slug);
    return p.category === filter;
  });

  return (
    <PortalLayout>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "10px" }}>
          The Library
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 4vw, 46px)", margin: "0 0 12px" }}>
          Every product Teddy has built.
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px" }}>
          {isAdmin ? "As admin, you have full access to everything." : "Unlock more by upgrading your tier."}
        </p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "28px" }}>
        {(["all", "unlocked", "locked", "ebook", "masterclass", "toolkit"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "8px 16px",
              background: filter === f ? GOLD : "transparent",
              color: filter === f ? "#1A1A1A" : "rgba(255,255,255,0.7)",
              border: `1px solid ${filter === f ? GOLD : "rgba(255,255,255,0.1)"}`,
              borderRadius: "40px",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "inherit",
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
        {filtered.map((p) => {
          const unlocked = can(p.slug);
          return (
            <Link key={p.slug} href={unlocked ? p.path : "/pricing"}>
              <div
                style={{
                  background: unlocked ? "#1a1a1a" : "rgba(255,255,255,0.02)",
                  border: unlocked ? "1px solid rgba(255,255,255,0.06)" : "1px dashed rgba(201,168,76,0.25)",
                  borderRadius: "8px",
                  padding: "24px",
                  cursor: "pointer",
                  position: "relative",
                  minHeight: "200px",
                  transition: "all .2s",
                }}
              >
                <div style={{ position: "absolute", top: "16px", right: "16px" }}>
                  {unlocked ? <Unlock size={16} color={GOLD} /> : <Lock size={16} color={GOLD} />}
                </div>
                <div
                  style={{
                    fontSize: "10px",
                    letterSpacing: "2px",
                    color: GOLD,
                    textTransform: "uppercase",
                    marginBottom: "8px",
                  }}
                >
                  {p.category} {!unlocked && `· Requires ${p.requiredTier}`}
                </div>
                <div style={{ fontFamily: "Georgia, serif", fontSize: "19px", marginBottom: "10px", lineHeight: 1.2 }}>{p.title}</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.55)", lineHeight: 1.5 }}>{p.subtitle}</div>
                {p.lessonCount && (
                  <div style={{ marginTop: "14px", fontSize: "11px", color: "rgba(255,255,255,0.4)" }}>
                    {p.duration} · {p.lessonCount} lessons
                  </div>
                )}
                {unlocked && (
                  <div style={{ marginTop: "14px", display: "flex", alignItems: "center", gap: "6px", fontSize: "12px", color: GOLD }}>
                    <Play size={13} /> Open
                  </div>
                )}
              </div>
            </Link>
          );
        })}
      </div>
    </PortalLayout>
  );
}
