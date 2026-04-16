/**
 * Beverly's Academy — The Salon Owner's Launch Kit
 */
import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, TrendingUp, AlertTriangle } from "lucide-react";

const GOLD = "#C9A84C";

export default function SalonOwnerPlaybook() {
  const { user } = useAuth();
  const slug = "salon-owners-launch-kit";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // KPI Simulator
  const [newClients, setNewClients] = useState<number>(10);
  const [returningClients, setReturningClients] = useState<number>(40);
  const [totalRevenue, setTotalRevenue] = useState<number>(5000);
  const [retailSales, setRetailSales] = useState<number>(300);

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

  // Calculations
  const totalClients = newClients + returningClients;
  const avgTicket = totalClients > 0 ? totalRevenue / totalClients : 0;
  const retailPct = totalRevenue > 0 ? (retailSales / totalRevenue) * 100 : 0;
  
  // Health checks
  const isTicketHealthy = avgTicket >= 100;
  const isRetailHealthy = retailPct >= 10;
  const isRetentionHealthy = totalClients > 0 ? (returningClients / totalClients) >= 0.7 : false;

  const pct = Math.round((Object.values(completed).filter(Boolean).length / 1) * 100);

  return (
    <PortalLayout>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "32px", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
          Master · Toolkit
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.1, margin: "0 0 16px" }}>
          The Salon Owner's <em style={{ color: GOLD, fontStyle: "italic" }}>Launch Kit.</em>
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", lineHeight: 1.65 }}>
          Everything Teddy wishes he'd known before opening Beverly's. Use the KPI Dashboard Simulator below to diagnose the health of your salon business instantly.
        </p>
      </div>

      {/* Lesson 1: KPI Simulator */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>01</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>KPI Dashboard Simulator</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.6, maxWidth: "700px" }}>
          Input your numbers from last week. The simulator will instantly flag areas where you are losing money and provide actionable advice to fix it.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", background: "#111", padding: "32px", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.2)" }}>
          
          {/* Inputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "8px" }}>Last Week's Numbers</h3>
            
            <label style={labelStyle}>New Clients</label>
            <input type="number" value={newClients} onChange={e => setNewClients(Number(e.target.value))} style={inputStyle} />

            <label style={labelStyle}>Returning Clients</label>
            <input type="number" value={returningClients} onChange={e => setReturningClients(Number(e.target.value))} style={inputStyle} />

            <label style={labelStyle}>Total Service Revenue ($)</label>
            <input type="number" value={totalRevenue} onChange={e => setTotalRevenue(Number(e.target.value))} style={inputStyle} />

            <label style={labelStyle}>Total Retail Sales ($)</label>
            <input type="number" value={retailSales} onChange={e => setRetailSales(Number(e.target.value))} style={inputStyle} />
          </div>

          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "8px" }}>Health Diagnosis</h3>
            
            {/* Avg Ticket */}
            <div style={{ ...resultCard, borderColor: isTicketHealthy ? "rgba(255,255,255,0.1)" : "rgba(255,107,107,0.5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={resultLabel}>Average Ticket</div>
                {!isTicketHealthy && <AlertTriangle size={14} color="#ff6b6b" />}
              </div>
              <div style={resultValue}>${avgTicket.toFixed(2)}</div>
              <div style={{ ...resultSub, color: isTicketHealthy ? "rgba(255,255,255,0.5)" : "#ff6b6b" }}>
                {isTicketHealthy ? "Healthy. You are pricing appropriately." : "Warning: Below $100. You need to raise prices or add upsells (treatments, toners)."}
              </div>
            </div>

            {/* Retail % */}
            <div style={{ ...resultCard, borderColor: isRetailHealthy ? "rgba(255,255,255,0.1)" : "rgba(255,107,107,0.5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={resultLabel}>Retail / Total %</div>
                {!isRetailHealthy && <AlertTriangle size={14} color="#ff6b6b" />}
              </div>
              <div style={resultValue}>{retailPct.toFixed(1)}%</div>
              <div style={{ ...resultSub, color: isRetailHealthy ? "rgba(255,255,255,0.5)" : "#ff6b6b" }}>
                {isRetailHealthy ? "Healthy. Great job recommending home care." : "Warning: Below 10%. You are leaving easy money on the table. Recommend 1 product per client."}
              </div>
            </div>

            {/* Retention */}
            <div style={{ ...resultCard, borderColor: isRetentionHealthy ? "rgba(255,255,255,0.1)" : "rgba(255,107,107,0.5)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <div style={resultLabel}>Retention Rate</div>
                {!isRetentionHealthy && <AlertTriangle size={14} color="#ff6b6b" />}
              </div>
              <div style={resultValue}>{totalClients > 0 ? Math.round((returningClients / totalClients) * 100) : 0}%</div>
              <div style={{ ...resultSub, color: isRetentionHealthy ? "rgba(255,255,255,0.5)" : "#ff6b6b" }}>
                {isRetentionHealthy ? "Healthy. Your clients love you." : "Warning: Below 70%. You have a leaky bucket. Focus on client experience, not marketing for new ones."}
              </div>
            </div>

          </div>
        </div>
        
        <div style={{ marginTop: "24px" }}>
          <button onClick={() => toggleDone("kpi")} style={doneBtn(completed["kpi"])}>
            {completed["kpi"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
            {completed["kpi"] ? "Completed" : "Mark as Complete"}
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

const resultSub: React.CSSProperties = {
  fontSize: "12px",
  lineHeight: 1.5,
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
