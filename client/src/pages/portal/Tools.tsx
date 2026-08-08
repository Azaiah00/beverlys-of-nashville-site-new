import { Link } from "wouter";
import { ArrowUpRight, FlaskConical, MessagesSquare } from "lucide-react";
import PortalLayout from "@/components/PortalLayout";
import { TOOLS } from "@/lib/products";

const GOLD = "#C9A84C";

export default function Tools() {
  return (
    <PortalLayout>
      <div style={{ marginBottom: "36px" }}>
        <div
          style={{
            fontSize: "11px",
            letterSpacing: "3px",
            color: GOLD,
            textTransform: "uppercase",
            marginBottom: "10px",
          }}
        >
          Interactive resources
        </div>
        <h1
          style={{
            fontFamily: "Georgia, serif",
            fontSize: "clamp(34px, 5vw, 52px)",
            margin: "0 0 12px",
            lineHeight: 1.08,
          }}
        >
          Tools for the work <em style={{ color: GOLD }}>behind the chair.</em>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", maxWidth: "680px", lineHeight: 1.7 }}>
          Turn Teddy’s systems into practical decisions you can use during color planning and client consultations.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "18px",
          maxWidth: "940px",
        }}
      >
        {TOOLS.map((tool, index) => {
          const Icon = index === 0 ? FlaskConical : MessagesSquare;
          return (
            <Link key={tool.slug} href={tool.path}>
              <article
                style={{
                  minHeight: "260px",
                  padding: "28px",
                  borderRadius: "10px",
                  border: "1px solid rgba(201,168,76,0.28)",
                  background:
                    "linear-gradient(145deg, rgba(201,168,76,0.09), rgba(255,255,255,0.025) 55%), #181818",
                  color: "#fff",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                }}
              >
                <Icon size={30} color={GOLD} strokeWidth={1.6} />
                <div
                  style={{
                    marginTop: "36px",
                    fontSize: "10px",
                    letterSpacing: "2.4px",
                    color: GOLD,
                    textTransform: "uppercase",
                  }}
                >
                  Member tool
                </div>
                <h2 style={{ fontFamily: "Georgia, serif", fontSize: "27px", margin: "10px 0 10px", lineHeight: 1.15 }}>
                  {tool.title}
                </h2>
                <p style={{ color: "rgba(255,255,255,0.58)", fontSize: "14px", lineHeight: 1.6, margin: 0 }}>
                  {tool.subtitle}
                </p>
                <ArrowUpRight size={20} color={GOLD} style={{ position: "absolute", right: "24px", bottom: "24px" }} />
              </article>
            </Link>
          );
        })}
      </div>
    </PortalLayout>
  );
}
