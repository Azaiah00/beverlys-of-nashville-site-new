/**
 * Beverly's Academy — The Consultation Vault
 */
import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, AlertOctagon, ShieldCheck } from "lucide-react";

const GOLD = "#C9A84C";

export default function ConsultationVault() {
  const { user } = useAuth();
  const slug = "consultation-vault";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Red Flag Detector
  const [q1, setQ1] = useState<boolean | null>(null);
  const [q2, setQ2] = useState<boolean | null>(null);
  const [q3, setQ3] = useState<boolean | null>(null);

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
  const flags = [q1, q2, q3].filter(Boolean).length;
  const isComplete = q1 !== null && q2 !== null && q3 !== null;

  const pct = Math.round((Object.values(completed).filter(Boolean).length / 1) * 100);

  return (
    <PortalLayout>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "32px", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
          Artisan · Toolkit
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.1, margin: "0 0 16px" }}>
          The Consultation <em style={{ color: GOLD, fontStyle: "italic" }}>Vault.</em>
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", lineHeight: 1.65 }}>
          The exact questions, scripts, and red-flag checks Teddy uses in every consult. Use the Red Flag Detector below to evaluate risky clients before they sit in your chair.
        </p>
      </div>

      {/* Lesson 1: Red Flag Detector */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>01</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>Red Flag Client Detector</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.6, maxWidth: "700px" }}>
          Answer these 3 questions based on your client's consultation form or messages. We will tell you whether to proceed, require a waiver, or decline the service.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", background: "#111", padding: "32px", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.2)" }}>
          
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            
            <div>
              <label style={labelStyle}>1. Did they use box dye or Sun-In in the last 2 years?</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={() => setQ1(true)} style={toggleBtn(q1 === true, true)}>Yes</button>
                <button onClick={() => setQ1(false)} style={toggleBtn(q1 === false, false)}>No</button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>2. Are they asking for a platinum result in one session from dark hair?</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={() => setQ2(true)} style={toggleBtn(q2 === true, true)}>Yes</button>
                <button onClick={() => setQ2(false)} style={toggleBtn(q2 === false, false)}>No</button>
              </div>
            </div>

            <div>
              <label style={labelStyle}>3. Did they complain extensively about their last 3 stylists?</label>
              <div style={{ display: "flex", gap: "8px", marginTop: "8px" }}>
                <button onClick={() => setQ3(true)} style={toggleBtn(q3 === true, true)}>Yes</button>
                <button onClick={() => setQ3(false)} style={toggleBtn(q3 === false, false)}>No</button>
              </div>
            </div>

          </div>

          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "8px" }}>Teddy's Verdict</h3>
            
            {!isComplete ? (
              <div style={{ padding: "24px", background: "rgba(255,255,255,0.02)", borderRadius: "6px", color: "rgba(255,255,255,0.4)", textAlign: "center", fontStyle: "italic" }}>
                Answer all 3 questions to see the verdict.
              </div>
            ) : flags === 0 ? (
              <div style={{ ...resultCard, borderColor: "#4ade80", background: "rgba(74,222,128,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <ShieldCheck size={24} color="#4ade80" />
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#4ade80" }}>Green Light</div>
                </div>
                <p style={{ margin: 0, color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6 }}>
                  This client is safe to book. Proceed with your standard consultation and service agreement.
                </p>
              </div>
            ) : flags === 1 ? (
              <div style={{ ...resultCard, borderColor: "#fbbf24", background: "rgba(251,191,36,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <AlertOctagon size={24} color="#fbbf24" />
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#fbbf24" }}>Yellow Light — Proceed with Caution</div>
                </div>
                <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6 }}>
                  You have 1 red flag. You MUST do a strand test before booking, and they must sign a chemical waiver.
                </p>
                <div style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", fontSize: "13px", color: "#fff", fontStyle: "italic" }}>
                  "I'd love to help you reach your goal, but based on your hair history, I require an in-person strand test first to ensure we keep your hair healthy."
                </div>
              </div>
            ) : (
              <div style={{ ...resultCard, borderColor: "#ff6b6b", background: "rgba(255,107,107,0.05)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <AlertOctagon size={24} color="#ff6b6b" />
                  <div style={{ fontFamily: "Georgia, serif", fontSize: "24px", color: "#ff6b6b" }}>Red Light — Decline Service</div>
                </div>
                <p style={{ margin: "0 0 12px", color: "rgba(255,255,255,0.8)", fontSize: "14px", lineHeight: 1.6 }}>
                  Multiple red flags. This client will cost you more in stress and refunds than they will pay you. Decline professionally.
                </p>
                <div style={{ padding: "12px", background: "rgba(255,255,255,0.05)", borderRadius: "4px", fontSize: "13px", color: "#fff", fontStyle: "italic" }}>
                  "Thank you so much for reaching out! Unfortunately, based on your hair history and goals, I don't believe I'm the best stylist to achieve the result you're looking for without compromising your hair's health. I wish you the best!"
                </div>
              </div>
            )}

          </div>
        </div>
        
        <div style={{ marginTop: "24px" }}>
          <button onClick={() => toggleDone("flags")} style={doneBtn(completed["flags"])}>
            {completed["flags"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {completed["flags"] ? "Completed" : "Mark as Complete"}
          </button>
        </div>
      </div>

    </PortalLayout>
  );
}

// Styles
const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "13px",
  color: "#fff",
  lineHeight: 1.5,
};

const toggleBtn = (active: boolean, isYes: boolean): React.CSSProperties => {
  let bg = "transparent";
  let border = "rgba(255,255,255,0.2)";
  let color = "#fff";

  if (active) {
    if (isYes) {
      bg = "rgba(255,107,107,0.1)";
      border = "#ff6b6b";
      color = "#ff6b6b";
    } else {
      bg = "rgba(74,222,128,0.1)";
      border = "#4ade80";
      color = "#4ade80";
    }
  }

  return {
    flex: 1,
    padding: "12px",
    background: bg,
    color: color,
    border: `1px solid ${border}`,
    borderRadius: "4px",
    fontSize: "14px",
    fontWeight: active ? "bold" : "normal",
    cursor: "pointer",
    transition: "all 0.2s",
  };
};

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
