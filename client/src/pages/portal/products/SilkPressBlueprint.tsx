/**
 * Beverly's Academy — The Silk Press Blueprint
 */
import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, Flame, ShieldAlert, Droplets } from "lucide-react";

const GOLD = "#C9A84C";

export default function SilkPressBlueprint() {
  const { user } = useAuth();
  const slug = "silk-press-blueprint";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Heat Calculator State
  const [texture, setTexture] = useState<"fine" | "medium" | "coarse">("medium");
  const [porosity, setPorosity] = useState<"low" | "normal" | "high">("normal");
  const [chemical, setChemical] = useState<"virgin" | "color" | "bleach" | "relaxer">("virgin");

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

  // Heat Logic
  const getHeatRecommendation = () => {
    let temp = 400;
    let passes = 2;
    let warnings = [];

    if (texture === "fine") temp -= 30;
    if (texture === "coarse") temp += 20;

    if (porosity === "high") {
      temp -= 20;
      warnings.push("High porosity: Hair will absorb and lose moisture quickly. Heavy heat protectant required.");
    }

    if (chemical === "bleach") {
      temp -= 40;
      passes = 1;
      warnings.push("Bleached hair: Extremely high risk of heat damage. Do not exceed 1 pass.");
    } else if (chemical === "relaxer") {
      temp -= 30;
      passes = 1;
      warnings.push("Relaxed hair: Structural integrity is compromised. Keep heat low.");
    } else if (chemical === "color") {
      temp -= 10;
    }

    // Floor and ceiling
    if (temp > 450) temp = 450;
    if (temp < 320) temp = 320;

    return { temp, passes, warnings };
  };

  const rec = getHeatRecommendation();
  const pct = Math.round((Object.values(completed).filter(Boolean).length / 2) * 100);

  return (
    <PortalLayout>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "32px", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
          Apprentice · Masterclass
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.1, margin: "0 0 16px" }}>
          The Silk Press <em style={{ color: GOLD, fontStyle: "italic" }}>Blueprint.</em>
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", lineHeight: 1.65 }}>
          Zero heat damage. Maximum shine. Use the interactive Heat Risk Calculator to determine the exact flat iron temperature and pass count for any client's hair type.
        </p>
        
        <div style={{ marginTop: "24px", maxWidth: "420px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
            <span>Your progress</span>
            <span style={{ color: GOLD }}>{pct}%</span>
          </div>
          <div style={{ height: "2px", background: "rgba(255,255,255,0.1)", width: "100%" }}>
            <div style={{ height: "100%", background: GOLD, width: `${pct}%`, transition: "width 0.3s" }} />
          </div>
        </div>
      </div>

      {/* Lesson 1: Heat Calculator */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>01</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>Heat Risk Calculator</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.6, maxWidth: "700px" }}>
          Input your client's hair profile. The calculator will output the maximum safe flat iron temperature and the strict limit on passes per section.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", background: "#111", padding: "32px", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.2)" }}>
          
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <div>
              <label style={labelStyle}>Hair Texture (Strand Thickness)</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {["fine", "medium", "coarse"].map(t => (
                  <button key={t} onClick={() => setTexture(t as any)} style={toggleBtn(texture === t)}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Porosity</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                {["low", "normal", "high"].map(p => (
                  <button key={p} onClick={() => setPorosity(p as any)} style={toggleBtn(porosity === p)}>
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label style={labelStyle}>Chemical History</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                {["virgin", "color", "bleach", "relaxer"].map(c => (
                  <button key={c} onClick={() => setChemical(c as any)} style={toggleBtn(chemical === c)}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "rgba(201,168,76,0.1)", border: `1px solid ${GOLD}`, borderRadius: "6px", padding: "24px", textAlign: "center" }}>
              <Flame size={32} color={GOLD} style={{ marginBottom: "12px" }} />
              <div style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "8px" }}>Max Safe Temp</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "48px", color: "#fff", lineHeight: 1 }}>{rec.temp}°F</div>
            </div>

            <div style={{ background: "#0a0a0a", border: "1px solid rgba(255,255,255,0.05)", borderRadius: "6px", padding: "20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <div style={{ fontSize: "11px", letterSpacing: "1px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "4px" }}>Max Passes Per Section</div>
                <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.7)" }}>Do not exceed this limit.</div>
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: "#fff" }}>{rec.passes}</div>
            </div>

            {rec.warnings.length > 0 && (
              <div style={{ background: "rgba(255,107,107,0.1)", border: "1px solid rgba(255,107,107,0.3)", borderRadius: "6px", padding: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#ff6b6b", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" }}>
                  <ShieldAlert size={16} /> High Risk Factors
                </div>
                <ul style={{ margin: 0, paddingLeft: "20px", color: "rgba(255,255,255,0.8)", fontSize: "13px", lineHeight: 1.6 }}>
                  {rec.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        <div style={{ marginTop: "24px" }}>
          <button onClick={() => toggleDone("calc")} style={doneBtn(completed["calc"])}>
            {completed["calc"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {completed["calc"] ? "Completed" : "Mark as Complete"}
          </button>
        </div>
      </div>

      {/* Lesson 2: The Wash Protocol */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>02</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>The Wash & Prep Protocol</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "24px", lineHeight: 1.6, maxWidth: "700px" }}>
          A flawless silk press is 80% prep and 20% flat iron. If the hair is not properly cleansed and hydrated, no amount of heat will make it move.
        </p>
        
        <div style={{ display: "grid", gap: "16px", maxWidth: "700px", marginBottom: "32px" }}>
          <div style={{ background: "#111", padding: "20px", borderRadius: "6px", borderLeft: `3px solid ${GOLD}` }}>
            <h4 style={{ margin: "0 0 8px", fontSize: "16px", color: "#fff" }}>1. Clarify (The Reset)</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Remove all product buildup, oils, and minerals. The hair should literally squeak. If it doesn't squeak, wash it again.</p>
          </div>
          <div style={{ background: "#111", padding: "20px", borderRadius: "6px", borderLeft: `3px solid ${GOLD}` }}>
            <h4 style={{ margin: "0 0 8px", fontSize: "16px", color: "#fff" }}>2. Hydrate (The Foundation)</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Apply a moisture-rich shampoo. Clarifying strips the hair; this step puts the essential moisture back in before heat is applied.</p>
          </div>
          <div style={{ background: "#111", padding: "20px", borderRadius: "6px", borderLeft: `3px solid ${GOLD}` }}>
            <h4 style={{ margin: "0 0 8px", fontSize: "16px", color: "#fff" }}>3. Condition & Detangle</h4>
            <p style={{ margin: 0, fontSize: "14px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>Apply conditioner and detangle from ends to roots using a wide-tooth comb or detangling brush. Rinse with cool water to seal the cuticle.</p>
          </div>
        </div>

        <button onClick={() => toggleDone("wash")} style={doneBtn(completed["wash"])}>
          {completed["wash"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {completed["wash"] ? "Completed" : "Mark as Complete"}
        </button>
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
