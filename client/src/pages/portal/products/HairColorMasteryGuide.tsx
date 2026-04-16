/**
 * Beverly's Academy — Hair Color Mastery Guide
 */
import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, Droplets, AlertTriangle } from "lucide-react";

const GOLD = "#C9A84C";

export default function HairColorMasteryGuide() {
  const { user } = useAuth();
  const slug = "hair-color-mastery-guide";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Correction Engine
  const [currentLevel, setCurrentLevel] = useState<number>(10);
  const [targetLevel, setTargetLevel] = useState<number>(5);
  const [tone, setTone] = useState<"warm" | "cool" | "neutral">("neutral");

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
  const getCorrectionPlan = () => {
    if (currentLevel <= targetLevel) {
      return {
        type: "lift",
        title: "Lifting Required",
        steps: [
          `Lift hair ${targetLevel - currentLevel} levels using lightener or high-lift color.`,
          `Expect to expose underlying pigment at level ${targetLevel}.`,
          `Tone with a ${tone === "cool" ? "cool/ash" : tone === "warm" ? "warm/gold" : "neutral"} base to achieve target.`
        ]
      };
    } else {
      const levelsDown = currentLevel - targetLevel;
      if (levelsDown >= 3) {
        // Needs a filler
        let fillerPigment = "Copper/Gold";
        if (targetLevel <= 4) fillerPigment = "Red/Copper";
        if (targetLevel <= 2) fillerPigment = "Red";

        return {
          type: "fill",
          title: "Color Fill Required (Going Darker)",
          steps: [
            `WARNING: You are dropping ${levelsDown} levels. You MUST fill the hair first or it will turn muddy/green.`,
            `STEP 1: Apply a level ${targetLevel + 1} ${fillerPigment} demi-permanent color to replace missing underlying pigment. Process and wash.`,
            `STEP 2: Apply target level ${targetLevel} ${tone} color over the filled hair.`
          ]
        };
      } else {
        return {
          type: "deposit",
          title: "Standard Deposit",
          steps: [
            `You are dropping ${levelsDown} levels. No filler required.`,
            `Formulate level ${targetLevel} with 10 volume developer (deposit only).`,
            `Process for full 30-35 minutes for maximum longevity.`
          ]
        };
      }
    }
  };

  const plan = getCorrectionPlan();
  const pct = Math.round((Object.values(completed).filter(Boolean).length / 1) * 100);

  return (
    <PortalLayout>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "32px", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
          Artisan · Masterclass
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.1, margin: "0 0 16px" }}>
          Hair Color <em style={{ color: GOLD, fontStyle: "italic" }}>Mastery Guide.</em>
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", lineHeight: 1.65 }}>
          The flagship formulation system. Use the Advanced Color Correction Engine below to generate step-by-step instructions for complex color transformations.
        </p>
      </div>

      {/* Lesson 1: Correction Engine */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>01</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>Color Correction Engine</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.6, maxWidth: "700px" }}>
          Input the client's current level and their target level. The engine will tell you exactly how to get there, including whether you need to fill the hair to avoid muddy results.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", background: "#111", padding: "32px", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.2)" }}>
          
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={labelStyle}>Current Starting Level (1-10)</label>
              <input type="range" min="1" max="10" value={currentLevel} onChange={e => setCurrentLevel(Number(e.target.value))} style={{ width: "100%", marginTop: "8px" }} />
              <div style={{ textAlign: "center", fontSize: "24px", fontFamily: "Georgia, serif", color: "#fff", marginTop: "8px" }}>Level {currentLevel}</div>
            </div>

            <div>
              <label style={labelStyle}>Target Desired Level (1-10)</label>
              <input type="range" min="1" max="10" value={targetLevel} onChange={e => setTargetLevel(Number(e.target.value))} style={{ width: "100%", marginTop: "8px" }} />
              <div style={{ textAlign: "center", fontSize: "24px", fontFamily: "Georgia, serif", color: GOLD, marginTop: "8px" }}>Level {targetLevel}</div>
            </div>

            <div>
              <label style={labelStyle}>Target Tone</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {["warm", "neutral", "cool"].map(t => (
                  <button key={t} onClick={() => setTone(t as any)} style={toggleBtn(tone === t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "8px" }}>Action Plan</h3>
            
            <div style={{ ...resultCard, borderColor: plan.type === "fill" ? "#ff6b6b" : GOLD, background: plan.type === "fill" ? "rgba(255,107,107,0.05)" : "rgba(201,168,76,0.05)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                {plan.type === "fill" ? <AlertTriangle size={20} color="#ff6b6b" /> : <Droplets size={20} color={GOLD} />}
                <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", color: plan.type === "fill" ? "#ff6b6b" : GOLD }}>{plan.title}</div>
              </div>
              
              <ul style={{ margin: 0, paddingLeft: "20px", color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.7 }}>
                {plan.steps.map((step, i) => <li key={i} style={{ marginBottom: "8px" }}>{step}</li>)}
              </ul>
            </div>

          </div>
        </div>
        
        <div style={{ marginTop: "24px" }}>
          <button onClick={() => toggleDone("engine")} style={doneBtn(completed["engine"])}>
            {completed["engine"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {completed["engine"] ? "Completed" : "Mark as Complete"}
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
};

const toggleBtn = (active: boolean): React.CSSProperties => ({
  flex: 1,
  padding: "10px",
  background: active ? GOLD : "transparent",
  color: active ? "#111" : "#fff",
  border: `1px solid ${active ? GOLD : "rgba(255,255,255,0.2)"}`,
  borderRadius: "4px",
  fontSize: "13px",
  fontWeight: active ? "bold" : "normal",
  cursor: "pointer",
  transition: "all 0.2s",
});

const resultCard: React.CSSProperties = {
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.05)",
  borderRadius: "6px",
  padding: "24px",
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
