/**
 * Beverly's Academy — Wig Construction Masterclass Companion
 */
import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, Scissors, Ruler } from "lucide-react";

const GOLD = "#C9A84C";

export default function WigConstructionCompanion() {
  const { user } = useAuth();
  const slug = "wig-construction-companion";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Measurements
  const [circumference, setCircumference] = useState<number>(22);
  const [frontToNape, setFrontToNape] = useState<number>(14);
  const [earToEar, setEarToEar] = useState<number>(13);

  // Load existing progress
  useEffect(() => {
    if (!user) return;
    supabase
      .from("progress")
      .select("lesson_id, completed")
      .eq("user_id", user.id)
      .eq("product_slug", slug)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, boolean> = {};
          data.forEach((row: any) => (map[row.lesson_id] = row.completed));
          setCompleted(map);
        }
      });
  }, [user]);

  const toggleDone = async (lessonId: string) => {
    const next = !completed[lessonId];
    setCompleted((c) => ({ ...c, [lessonId]: next }));
    if (!user) return;
    await supabase.from("progress").upsert(
      {
        user_id: user.id,
        product_slug: slug,
        lesson_id: lessonId,
        completed: next,
        completed_at: next ? new Date().toISOString() : null,
      },
      { onConflict: "user_id,product_slug,lesson_id" }
    );
  };

  // Logic
  const getBlockSize = () => {
    if (circumference < 21) return "20 (Small)";
    if (circumference <= 22.5) return "22 (Medium)";
    return "23+ (Large)";
  };

  const getDartAdvice = () => {
    if (frontToNape < 13.5) return "Client has a shallow nape. You will need to add a 1-inch horizontal dart at the crown to prevent bagging.";
    if (frontToNape > 14.5) return "Client has a deep nape. Ensure your cap has enough stretch, or use a larger block.";
    return "Standard front-to-nape. No horizontal darts required.";
  };

  const pct = Math.round((Object.values(completed).filter(Boolean).length / 1) * 100);

  return (
    <PortalLayout>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "32px", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
          Artisan · Masterclass
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.1, margin: "0 0 16px" }}>
          Wig Construction <em style={{ color: GOLD, fontStyle: "italic" }}>Companion.</em>
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", lineHeight: 1.65 }}>
          From hair selection to flawless install. Use the Custom Cap Calculator to translate your client's head measurements into exact block sizes and dart placements.
        </p>
      </div>

      {/* Lesson 1: Cap Calculator */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>01</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>Custom Cap Calculator</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.6, maxWidth: "700px" }}>
          Input your client's 3 primary head measurements (in inches). The calculator will determine the correct canvas block size and whether you need to sew darts into the cap.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", background: "#111", padding: "32px", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.2)" }}>
          
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "8px" }}>Measurements (Inches)</h3>
            
            <label style={labelStyle}>Circumference</label>
            <input type="number" step="0.5" value={circumference} onChange={e => setCircumference(Number(e.target.value))} style={inputStyle} />

            <label style={labelStyle}>Front to Nape</label>
            <input type="number" step="0.5" value={frontToNape} onChange={e => setFrontToNape(Number(e.target.value))} style={inputStyle} />

            <label style={labelStyle}>Ear to Ear (Across Top)</label>
            <input type="number" step="0.5" value={earToEar} onChange={e => setEarToEar(Number(e.target.value))} style={inputStyle} />
          </div>

          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "8px" }}>Construction Blueprint</h3>
            
            <div style={{ ...resultCard, borderColor: GOLD, background: "rgba(201,168,76,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Ruler size={16} color={GOLD} />
                <div style={{...resultLabel, color: GOLD, marginBottom: 0}}>Canvas Block Size</div>
              </div>
              <div style={{...resultValue, color: GOLD}}>{getBlockSize()}</div>
            </div>

            <div style={resultCard}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                <Scissors size={16} color="rgba(255,255,255,0.5)" />
                <div style={{...resultLabel, marginBottom: 0}}>Dart Placement</div>
              </div>
              <div style={{ fontSize: "14px", color: "#fff", lineHeight: 1.6 }}>{getDartAdvice()}</div>
            </div>

            <div style={resultCard}>
              <div style={resultLabel}>Track Spacing (Ear to Ear)</div>
              <div style={{ fontSize: "14px", color: "#fff", lineHeight: 1.6 }}>
                Based on {earToEar} inches across the top, space your tracks approximately <b>0.5 inches</b> apart in the back, and <b>0.25 inches</b> apart at the crown for maximum density without bulk.
              </div>
            </div>

          </div>
        </div>
        
        <div style={{ marginTop: "24px" }}>
          <button onClick={() => toggleDone("cap")} style={doneBtn(completed["cap"])}>
            {completed["cap"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {completed["cap"] ? "Completed" : "Mark as Complete"}
          </button>
        </div>
      </div>

    </PortalLayout>
  );
}

// Styles
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "11px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  marginBottom: "8px",
};

const inputStyle: React.CSSProperties = {
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.1)",
  color: "#fff",
  fontSize: "16px",
  padding: "12px 16px",
  borderRadius: "4px",
  width: "100%",
  outline: "none",
  fontFamily: "inherit",
};

const resultCard: React.CSSProperties = {
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "6px",
  padding: "20px",
};

const resultLabel: React.CSSProperties = {
  fontSize: "11px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
};

const resultValue: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "28px",
  color: "#fff",
  marginBottom: "4px",
};

const doneBtn = (isDone: boolean): React.CSSProperties => ({
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  background: isDone ? "rgba(201,168,76,0.1)" : "transparent",
  color: isDone ? GOLD : "rgba(255,255,255,0.5)",
  border: `1px solid ${isDone ? GOLD : "rgba(255,255,255,0.2)"}`,
  padding: "10px 20px",
  borderRadius: "4px",
  fontSize: "12px",
  letterSpacing: "1px",
  textTransform: "uppercase",
  cursor: "pointer",
  transition: "all 0.2s",
});
