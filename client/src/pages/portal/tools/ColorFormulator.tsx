/**
 * Beverly's Academy — Color Formulator Tool (Artisan+)
 *
 * Build a full color formula from natural level + target + porosity + gray %.
 * Outputs: developer volume, processing time, toner, and a branded printable
 * formula card stylists can hand off or archive.
 */
import { useMemo, useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { Download, Printer, Sparkles } from "lucide-react";

const GOLD = "#C9A84C";
const CHARCOAL = "#1A1A1A";

const LEVELS = [
  { n: 1, name: "Jet Black" }, { n: 2, name: "Darkest Brown" }, { n: 3, name: "Dark Brown" },
  { n: 4, name: "Medium Brown" }, { n: 5, name: "Light Brown" }, { n: 6, name: "Dark Blonde" },
  { n: 7, name: "Medium Blonde" }, { n: 8, name: "Light Blonde" }, { n: 9, name: "Very Light Blonde" },
  { n: 10, name: "Lightest Blonde" },
];

type Porosity = "low" | "medium" | "high";
type GrayPct = 0 | 25 | 50 | 75 | 100;

export default function ColorFormulator() {
  const [natural, setNatural] = useState(5);
  const [target, setTarget] = useState(8);
  const [porosity, setPorosity] = useState<Porosity>("medium");
  const [gray, setGray] = useState<GrayPct>(0);
  const [clientName, setClientName] = useState("");

  const formula = useMemo(() => buildFormula({ natural, target, porosity, gray }), [natural, target, porosity, gray]);

  return (
    <PortalLayout>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "10px" }}>
          Interactive Tool
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "38px", margin: "0 0 8px" }}>
          The Color Formulator.
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "640px" }}>
          Plug in the client's starting point and your target. Teddy's logic handles the rest — developer volume,
          processing time, toner family, and a printable formula card.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "minmax(280px, 1fr) minmax(320px, 1.2fr)", gap: "24px" }}>
        {/* Inputs */}
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "24px" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", margin: "0 0 20px" }}>Client inputs</h2>

          <Field label="Client (optional)">
            <input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="e.g. Andrea — Tuesday 3pm"
              style={inputStyle}
            />
          </Field>

          <Field label="Natural level">
            <Select value={natural} onChange={(v) => setNatural(Number(v))}>
              {LEVELS.map((l) => <option key={l.n} value={l.n}>Level {l.n} — {l.name}</option>)}
            </Select>
          </Field>

          <Field label="Target level">
            <Select value={target} onChange={(v) => setTarget(Number(v))}>
              {LEVELS.map((l) => <option key={l.n} value={l.n}>Level {l.n} — {l.name}</option>)}
            </Select>
          </Field>

          <Field label="Porosity">
            <Pills value={porosity} onChange={(v) => setPorosity(v as Porosity)} options={["low", "medium", "high"]} />
          </Field>

          <Field label="Gray coverage needed">
            <Pills
              value={String(gray)}
              onChange={(v) => setGray(Number(v) as GrayPct)}
              options={["0", "25", "50", "75", "100"]}
              render={(v) => `${v}%`}
            />
          </Field>
        </div>

        {/* Output */}
        <div
          style={{
            background: "linear-gradient(135deg, rgba(201,168,76,0.10), rgba(201,168,76,0.02))",
            border: `1px solid ${GOLD}`,
            borderRadius: "12px",
            padding: "28px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px" }}>
            <Sparkles size={18} color={GOLD} />
            <span style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase" }}>
              Teddy's Recipe
            </span>
          </div>
          {clientName && (
            <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.5)", marginBottom: "14px" }}>
              For <b style={{ color: "#fff" }}>{clientName}</b>
            </div>
          )}
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "26px", margin: "0 0 20px" }}>
            Level {natural} → Level {target}
          </h2>

          <OutRow k="Lift required" v={`${formula.lift} level${formula.lift === 1 ? "" : "s"}`} />
          <OutRow k="Developer" v={`${formula.devVol} volume`} />
          <OutRow k="Base tube" v={formula.base} />
          <OutRow k="Toner family" v={formula.toner} />
          {gray > 0 && <OutRow k="Gray coverage mod" v={formula.grayMod} />}
          <OutRow k="Processing time" v={`${formula.processing} min`} />
          <OutRow k="Ratio" v={formula.ratio} />

          <div style={{ marginTop: "20px", padding: "16px", background: "rgba(0,0,0,0.2)", borderRadius: "8px", fontSize: "13px", color: "rgba(255,255,255,0.7)", lineHeight: 1.6 }}>
            <b style={{ color: GOLD }}>Teddy's note:</b> {formula.note}
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <button onClick={() => window.print()} style={btnPrimary}>
              <Printer size={14} /> Print card
            </button>
            <button onClick={() => downloadFormula({ natural, target, porosity, gray, clientName, formula })} style={btnGhost}>
              <Download size={14} /> Save as .txt
            </button>
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

// ── Logic ────────────────────────────────────────────────────────────────────
function buildFormula({ natural, target, porosity, gray }: {
  natural: number; target: number; porosity: Porosity; gray: GrayPct;
}) {
  const lift = Math.max(0, target - natural);
  const deposit = target < natural;

  let devVol = 10;
  if (lift === 0 && !deposit) devVol = 10;
  else if (lift === 1) devVol = 20;
  else if (lift === 2) devVol = 30;
  else if (lift >= 3) devVol = 40;
  if (deposit) devVol = 10;
  if (gray >= 50) devVol = Math.max(devVol, 20);

  const exposed =
    target >= 9 ? "Palest Yellow" :
    target >= 8 ? "Yellow" :
    target >= 7 ? "Yellow-Orange" :
    target >= 6 ? "Orange" :
    target >= 5 ? "Red-Orange" :
    target >= 4 ? "Red" : "Blue-Red";

  const toner =
    exposed.includes("Yellow") ? "Violet / Pearl (V / P)" :
    exposed.includes("Orange") ? "Blue / Ash (B / A)" :
    exposed.includes("Red") ? "Green / Matte (G)" : "None needed";

  const base = deposit
    ? `Level ${target} N (natural)`
    : `Level ${target} N + secondary tone driver`;

  let processing = lift >= 3 ? 50 : lift === 2 ? 40 : lift === 1 ? 35 : 25;
  if (porosity === "high") processing = Math.max(15, processing - 10);
  if (porosity === "low") processing += 10;
  if (gray >= 75) processing = Math.max(processing, 45);

  const ratio = devVol === 40 ? "1:2" : "1:1.5";

  const grayMod =
    gray === 0 ? "—" :
    gray <= 25 ? "+ 1/4 N series" :
    gray <= 50 ? "+ 1/2 N series" :
    gray <= 75 ? "+ 3/4 N series" : "Full N series base";

  const notes: string[] = [];
  if (lift >= 3) notes.push("High lift — strand test mandatory. Watch for breakage at the midshaft.");
  if (porosity === "high") notes.push("Porous hair grabs cool tones fast. Pull early.");
  if (gray >= 50) notes.push("For resistant gray, pre-soften for 5 min before applying formula.");
  if (deposit) notes.push("Deposit-only formula. Start at midshaft, pull through ends last 5 min.");
  if (notes.length === 0) notes.push("Standard application. Apply roots first, midshaft/ends after 15 min.");

  return { lift, devVol, base, toner, grayMod, processing, ratio, note: notes.join(" ") };
}

function downloadFormula(args: any) {
  const { natural, target, porosity, gray, clientName, formula } = args;
  const text = `BEVERLY'S OF NASHVILLE — COLOR FORMULA
${clientName ? `Client: ${clientName}\n` : ""}Date: ${new Date().toLocaleDateString()}

Natural Level: ${natural}
Target Level: ${target}
Porosity: ${porosity}
Gray coverage: ${gray}%

── FORMULA ──
Lift: ${formula.lift} levels
Developer: ${formula.devVol} volume
Base: ${formula.base}
Toner: ${formula.toner}
Gray mod: ${formula.grayMod}
Processing: ${formula.processing} min
Ratio: ${formula.ratio}

Note: ${formula.note}
`;
  const blob = new Blob([text], { type: "text/plain" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `formula-${clientName || "client"}-${Date.now()}.txt`;
  a.click();
}

// ── Styled primitives ──────────────────────────────────────────────────────
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "18px" }}>
      <div style={{ fontSize: "10px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </div>
      {children}
    </div>
  );
}

function Select({ value, onChange, children }: { value: any; onChange: (v: string) => void; children: React.ReactNode }) {
  return <select value={value} onChange={(e) => onChange(e.target.value)} style={inputStyle}>{children}</select>;
}

function Pills({ value, onChange, options, render }: { value: string; onChange: (v: string) => void; options: string[]; render?: (v: string) => string }) {
  return (
    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
      {options.map((o) => (
        <button
          key={o}
          onClick={() => onChange(o)}
          style={{
            padding: "10px 16px",
            background: value === o ? GOLD : "transparent",
            color: value === o ? CHARCOAL : "rgba(255,255,255,0.7)",
            border: `1px solid ${value === o ? GOLD : "rgba(255,255,255,0.15)"}`,
            borderRadius: "40px",
            fontSize: "12px",
            fontWeight: 700,
            letterSpacing: "1.5px",
            textTransform: "uppercase",
            cursor: "pointer",
            fontFamily: "inherit",
          }}
        >
          {render ? render(o) : o}
        </button>
      ))}
    </div>
  );
}

function OutRow({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{k}</span>
      <span style={{ fontFamily: "Georgia, serif", fontSize: "15px", color: "#fff" }}>{v}</span>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px",
  background: "#0f0f0f",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "6px",
  fontSize: "14px",
  fontFamily: "inherit",
};

const btnPrimary: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "8px",
  padding: "10px 18px", background: GOLD, color: CHARCOAL,
  border: "none", borderRadius: "4px",
  fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
  cursor: "pointer", fontFamily: "inherit",
};

const btnGhost: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "8px",
  padding: "10px 18px", background: "transparent", color: GOLD,
  border: `1px solid ${GOLD}`, borderRadius: "4px",
  fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
  cursor: "pointer", fontFamily: "inherit",
};
