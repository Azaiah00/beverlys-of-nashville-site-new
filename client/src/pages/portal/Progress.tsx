/**
 * Beverly's Academy Portal — Progress Dashboard
 */
import PortalLayout from "@/components/PortalLayout";
import { PRODUCTS } from "@/lib/products";
import { useAuth } from "@/contexts/AuthContext";
import { Trophy } from "lucide-react";

const GOLD = "#C9A84C";

export default function ProgressPage() {
  const { can } = useAuth();
  const accessible = PRODUCTS.filter((p) => can(p.slug));

  return (
    <PortalLayout>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "10px" }}>
          Your Progress
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "36px", margin: 0 }}>Where you are.</h1>
      </div>

      <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "8px", padding: "28px", marginBottom: "24px", maxWidth: "760px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "16px" }}>
          <Trophy size={32} color={GOLD} />
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "24px" }}>0 certificates earned</div>
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>Complete a masterclass to earn your first.</div>
          </div>
        </div>
      </div>

      <h2 style={{ fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "16px" }}>In progress</h2>
      {accessible.map((p) => (
        <div
          key={p.slug}
          style={{
            background: "#1a1a1a",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: "8px",
            padding: "20px 24px",
            marginBottom: "12px",
            maxWidth: "760px",
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "17px" }}>{p.title}</div>
              <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)" }}>{p.duration} · {p.lessonCount} lessons</div>
            </div>
            <div style={{ fontSize: "13px", color: GOLD }}>0%</div>
          </div>
          <div style={{ width: "100%", height: "4px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: "0%", background: GOLD }} />
          </div>
        </div>
      ))}
    </PortalLayout>
  );
}
