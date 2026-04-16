/**
 * Beverly's Academy — The Stylist's Pricing & Profit Playbook
 */
import { useEffect, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, DollarSign, TrendingUp, Calculator } from "lucide-react";

const GOLD = "#C9A84C";
const CHARCOAL = "#1A1A1A";

export default function PricingProfitPlaybook() {
  const { user } = useAuth();
  const slug = "pricing-profit-playbook";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  // Calculator State
  const [desiredSalary, setDesiredSalary] = useState<number>(80000);
  const [weeklyHours, setWeeklyHours] = useState<number>(35);
  const [weeksOff, setWeeksOff] = useState<number>(4);
  const [monthlyRent, setMonthlyRent] = useState<number>(1200);
  const [monthlySupplies, setMonthlySupplies] = useState<number>(800);
  const [monthlyOther, setMonthlyOther] = useState<number>(400);

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
  const annualExpenses = (monthlyRent + monthlySupplies + monthlyOther) * 12;
  const totalRevenueNeeded = desiredSalary + annualExpenses;
  const workingWeeks = 52 - weeksOff;
  const totalWorkingHours = workingWeeks * weeklyHours;
  const targetHourlyRate = totalWorkingHours > 0 ? totalRevenueNeeded / totalWorkingHours : 0;

  const pct = Math.round((Object.values(completed).filter(Boolean).length / 3) * 100);

  return (
    <PortalLayout>
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "32px", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
          Apprentice · E-Book & Tool
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.1, margin: "0 0 16px" }}>
          The Stylist's Pricing & <em style={{ color: GOLD, fontStyle: "italic" }}>Profit Playbook.</em>
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", lineHeight: 1.65 }}>
          Stop guessing your prices based on what the salon down the street charges. Use this interactive calculator to find your True Hourly Rate, then build a menu that actually pays your bills.
        </p>
        
        {/* Progress */}
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

      {/* Lesson 1: The Calculator */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>01</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>True Hourly Rate Calculator</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "32px", lineHeight: 1.6, maxWidth: "700px" }}>
          Input your real life numbers below. We will calculate exactly how much you need to generate per hour behind the chair to hit your take-home goal, after expenses and vacations.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "32px", background: "#111", padding: "32px", borderRadius: "8px", border: "1px solid rgba(201,168,76,0.2)" }}>
          
          {/* Inputs */}
          <div>
            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "20px" }}>Your Goals & Schedule</h3>
            
            <label style={labelStyle}>Desired Take-Home Salary (Annual)</label>
            <div style={inputWrapper}>
              <DollarSign size={16} color="rgba(255,255,255,0.4)" />
              <input type="number" value={desiredSalary} onChange={e => setDesiredSalary(Number(e.target.value))} style={inputStyle} />
            </div>

            <label style={labelStyle}>Hours Behind Chair (Weekly)</label>
            <input type="number" value={weeklyHours} onChange={e => setWeeklyHours(Number(e.target.value))} style={{...inputStyle, padding: "12px", width: "100%"}} />

            <label style={labelStyle}>Weeks Off / Vacation (Annual)</label>
            <input type="number" value={weeksOff} onChange={e => setWeeksOff(Number(e.target.value))} style={{...inputStyle, padding: "12px", width: "100%"}} />

            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, margin: "32px 0 20px" }}>Monthly Expenses</h3>
            
            <label style={labelStyle}>Booth Rent / Suite Lease</label>
            <div style={inputWrapper}>
              <DollarSign size={16} color="rgba(255,255,255,0.4)" />
              <input type="number" value={monthlyRent} onChange={e => setMonthlyRent(Number(e.target.value))} style={inputStyle} />
            </div>

            <label style={labelStyle}>Color & Supplies</label>
            <div style={inputWrapper}>
              <DollarSign size={16} color="rgba(255,255,255,0.4)" />
              <input type="number" value={monthlySupplies} onChange={e => setMonthlySupplies(Number(e.target.value))} style={inputStyle} />
            </div>

            <label style={labelStyle}>Other (Insurance, Booking App, Marketing)</label>
            <div style={inputWrapper}>
              <DollarSign size={16} color="rgba(255,255,255,0.4)" />
              <input type="number" value={monthlyOther} onChange={e => setMonthlyOther(Number(e.target.value))} style={inputStyle} />
            </div>
          </div>

          {/* Outputs */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: GOLD, marginBottom: "4px" }}>The Reality Check</h3>
            
            <div style={resultCard}>
              <div style={resultLabel}>Total Revenue Needed</div>
              <div style={resultValue}>${totalRevenueNeeded.toLocaleString()} / yr</div>
              <div style={resultSub}>To cover ${annualExpenses.toLocaleString()} in expenses + your salary.</div>
            </div>

            <div style={resultCard}>
              <div style={resultLabel}>Total Working Hours</div>
              <div style={resultValue}>{totalWorkingHours.toLocaleString()} hrs / yr</div>
              <div style={resultSub}>Based on {workingWeeks} weeks at {weeklyHours} hrs/week.</div>
            </div>

            <div style={{ ...resultCard, background: "rgba(201,168,76,0.1)", borderColor: GOLD }}>
              <div style={{...resultLabel, color: GOLD}}>Your True Hourly Rate</div>
              <div style={{...resultValue, color: GOLD, fontSize: "36px"}}>${Math.ceil(targetHourlyRate)} / hr</div>
              <div style={resultSub}>Every service on your menu must generate this much per hour.</div>
            </div>

            <div style={{ marginTop: "16px", padding: "16px", background: "rgba(255,255,255,0.03)", borderRadius: "4px", fontSize: "13px", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              <b style={{color: "#fff"}}>Example:</b> If a partial highlight takes you 2.5 hours, you must charge at least <b>${Math.ceil(targetHourlyRate * 2.5)}</b> just to hit your baseline goals.
            </div>
          </div>
        </div>
        
        <button onClick={() => toggleDone("calc")} style={doneBtn(completed["calc"])}>
          {completed["calc"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {completed["calc"] ? "Completed" : "Mark as Complete"}
        </button>
      </div>

      {/* Lesson 2: Menu Mapping */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>02</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>Menu Mapping Strategy</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "24px", lineHeight: 1.6, maxWidth: "700px" }}>
          Now that you know your True Hourly Rate (${Math.ceil(targetHourlyRate)}/hr), you need to audit your current menu. Most stylists are losing money on toners, root smudges, and "quick trims".
        </p>
        <ul style={{ color: "rgba(255,255,255,0.7)", lineHeight: 1.8, fontSize: "15px", paddingLeft: "20px", marginBottom: "32px" }}>
          <li><b>Time every service:</b> Include consultation, mixing, processing, washing, and styling.</li>
          <li><b>Multiply by your rate:</b> Time × ${Math.ceil(targetHourlyRate)}. This is your absolute floor price.</li>
          <li><b>Add product cost:</b> If a color correction takes $40 in product, add that to the floor price.</li>
          <li><b>Stop itemizing:</b> Clients don't want to buy "2 bowls of lightener and a toner". They want to buy a result. Package your services.</li>
        </ul>
        <button onClick={() => toggleDone("menu")} style={doneBtn(completed["menu"])}>
          {completed["menu"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {completed["menu"] ? "Completed" : "Mark as Complete"}
        </button>
      </div>

      {/* Lesson 3: The Price Increase Script */}
      <div style={{ marginBottom: "60px" }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "16px", marginBottom: "24px" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: "32px", color: GOLD }}>03</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: 0 }}>The Price Increase Script</h2>
        </div>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", marginBottom: "24px", lineHeight: 1.6, maxWidth: "700px" }}>
          Raising prices is terrifying the first time. Here is the exact script Teddy uses to communicate price increases without losing loyal clients.
        </p>
        <div style={{ background: "rgba(255,255,255,0.03)", padding: "24px", borderRadius: "8px", borderLeft: `4px solid ${GOLD}`, marginBottom: "32px", fontFamily: "Georgia, serif", fontSize: "16px", lineHeight: 1.7, color: "#fff" }}>
          "Hi [Client Name],<br/><br/>
          I'm reaching out to let you know that starting [Date - 30 days out], my service menu and pricing will be updating.<br/><br/>
          To continue providing the premium products, education, and dedicated 1-on-1 time you deserve, my [Service Name] will now be [New Price].<br/><br/>
          I value you so much as a client, and I want to ensure you have time to plan. If you'd like to pre-book your next appointment before the change takes effect, let me know and we'll get you on the schedule at the current rate.<br/><br/>
          Thank you for trusting me with your hair and supporting my business."
        </div>
        <button onClick={() => toggleDone("script")} style={doneBtn(completed["script"])}>
          {completed["script"] ? <CheckCircle2 size={18} /> : <Circle size={18} />}
          {completed["script"] ? "Completed" : "Mark as Complete"}
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
  marginBottom: "8px",
};

const inputWrapper: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  background: "#0a0a0a",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "4px",
  padding: "0 12px",
  marginBottom: "20px",
};

const inputStyle: React.CSSProperties = {
  background: "transparent",
  border: "none",
  color: "#fff",
  fontSize: "16px",
  padding: "12px 8px",
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
  marginBottom: "8px",
};

const resultValue: React.CSSProperties = {
  fontFamily: "Georgia, serif",
  fontSize: "24px",
  color: "#fff",
  marginBottom: "4px",
};

const resultSub: React.CSSProperties = {
  fontSize: "12px",
  color: "rgba(255,255,255,0.4)",
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
