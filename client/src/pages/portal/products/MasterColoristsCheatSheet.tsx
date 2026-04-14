/**
 * Beverly's Academy — The Master Colorist's Cheat Sheet
 * FREE product. Gated only by login (free tier + authenticated).
 *
 * This is the reference implementation for porting HTML products into React.
 * It preserves the original interactive widgets (level chart, underlying pigment
 * slider, developer picker, toner wheel, formula worksheet) and adds portal
 * chrome (sidebar, progress tracking) via <PortalLayout/>.
 */
import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import PortalLayout from "@/components/PortalLayout";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

const GOLD = "#C9A84C";
const GOLD_DARK = "#A8883A";
const CHARCOAL = "#1A1A1A";

// ── Data ────────────────────────────────────────────────────────────────────
const LEVELS = [
  { n: 1, hex: "#0d0d0d", name: "Jet Black", underlying: "None / Blue-Black" },
  { n: 2, hex: "#1a0f0a", name: "Darkest Brown", underlying: "Blue" },
  { n: 3, hex: "#2a1810", name: "Dark Brown", underlying: "Blue-Red" },
  { n: 4, hex: "#3d2416", name: "Medium Brown", underlying: "Red" },
  { n: 5, hex: "#5c3820", name: "Light Brown", underlying: "Red-Orange" },
  { n: 6, hex: "#855330", name: "Dark Blonde", underlying: "Orange" },
  { n: 7, hex: "#a87545", name: "Medium Blonde", underlying: "Yellow-Orange" },
  { n: 8, hex: "#c8a063", name: "Light Blonde", underlying: "Yellow" },
  { n: 9, hex: "#dfc489", name: "Very Light Blonde", underlying: "Pale Yellow" },
  { n: 10, hex: "#eedcb0", name: "Lightest Blonde", underlying: "Palest Yellow" },
];

const DEVELOPERS = [
  { vol: 10, use: "Tone · deposit only", lifts: "0 levels" },
  { vol: 20, use: "Gray coverage · 1 level lift", lifts: "1 level" },
  { vol: 30, use: "2 levels lift", lifts: "2 levels" },
  { vol: 40, use: "3 levels lift (strong)", lifts: "3 levels" },
];

const SECTIONS = [
  { id: "levels", num: "01", title: "The Level System", sub: "What every number actually means." },
  { id: "pigment", num: "02", title: "Underlying Pigment", sub: "Predict what's exposed when you lift." },
  { id: "developer", num: "03", title: "Developer Volume", sub: "Choose the right strength, every time." },
  { id: "toner", num: "04", title: "Toning & The Color Wheel", sub: "Cancel unwanted warmth with precision." },
  { id: "formula", num: "05", title: "The Formula Worksheet", sub: "Build your formula in 5 steps." },
];

// ── Main ────────────────────────────────────────────────────────────────────
export default function MasterColoristsCheatSheet() {
  const { user, isAdmin } = useAuth();
  const slug = "master-colorists-cheat-sheet";
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

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

  const doneCount = Object.values(completed).filter(Boolean).length;
  const pct = Math.round((doneCount / SECTIONS.length) * 100);

  return (
    <PortalLayout>
      {/* Hero */}
      <div style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", paddingBottom: "32px", marginBottom: "40px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
          Free · Masterclass
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(32px, 5vw, 54px)", lineHeight: 1.1, margin: "0 0 16px" }}>
          The Master Colorist's <em style={{ color: GOLD, fontStyle: "italic" }}>Cheat Sheet.</em>
        </h1>
        <p style={{ fontSize: "17px", color: "rgba(255,255,255,0.7)", maxWidth: "640px", lineHeight: 1.65 }}>
          The interactive color reference every stylist should keep open behind the chair. Five lessons, roughly 25 minutes,
          zero fluff — built to give you confidence the next time a client says "surprise me."
        </p>
        <div style={{ display: "flex", gap: "20px", marginTop: "28px", fontSize: "13px", color: "rgba(255,255,255,0.55)" }}>
          <span>
            By <b style={{ color: "#fff" }}>Teddy Chisom</b>
          </span>
          <span>· 25 min</span>
          <span>· {SECTIONS.length} lessons</span>
          {isAdmin && <span style={{ color: GOLD }}>· Admin preview</span>}
        </div>

        {/* Progress */}
        <div style={{ marginTop: "24px", maxWidth: "420px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: "rgba(255,255,255,0.5)", marginBottom: "8px" }}>
            <span>Your progress</span>
            <span style={{ color: GOLD }}>{pct}%</span>
          </div>
          <div style={{ height: "4px", background: "rgba(255,255,255,0.08)", borderRadius: "2px", overflow: "hidden" }}>
            <div style={{ height: "100%", width: `${pct}%`, background: GOLD, transition: "width .3s" }} />
          </div>
        </div>
      </div>

      {/* Lessons */}
      <LessonShell section={SECTIONS[0]} done={!!completed.levels} onToggle={() => toggleDone("levels")}>
        <LevelSystemWidget />
      </LessonShell>

      <LessonShell section={SECTIONS[1]} done={!!completed.pigment} onToggle={() => toggleDone("pigment")}>
        <PigmentSliderWidget />
      </LessonShell>

      <LessonShell section={SECTIONS[2]} done={!!completed.developer} onToggle={() => toggleDone("developer")}>
        <DeveloperPickerWidget />
      </LessonShell>

      <LessonShell section={SECTIONS[3]} done={!!completed.toner} onToggle={() => toggleDone("toner")}>
        <TonerWheelWidget />
      </LessonShell>

      <LessonShell section={SECTIONS[4]} done={!!completed.formula} onToggle={() => toggleDone("formula")}>
        <FormulaWorksheet />
      </LessonShell>

      {/* Upsell */}
      <div
        style={{
          marginTop: "48px",
          padding: "40px",
          borderRadius: "12px",
          background: "linear-gradient(135deg, rgba(201,168,76,0.12), rgba(201,168,76,0.04))",
          border: `1px solid ${GOLD}`,
          textAlign: "center",
        }}
      >
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "12px" }}>
          Next step
        </div>
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "30px", margin: "0 0 12px" }}>
          Ready to dive deeper into color?
        </h2>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.7)", maxWidth: "540px", margin: "0 auto 24px", lineHeight: 1.6 }}>
          The full <em>Hair Color Mastery Guide</em> — 47 lessons, decision trees, the interactive Color Formulator, and the
          Consultation Vault — is included in the <b>Artisan</b> tier.
        </p>
        <Link href="/pricing">
          <button
            style={{
              background: GOLD,
              color: CHARCOAL,
              border: "none",
              padding: "14px 32px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "2px",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            Unlock the Artisan Tier <ArrowRight size={14} />
          </button>
        </Link>
      </div>
    </PortalLayout>
  );
}

// ── Lesson shell ────────────────────────────────────────────────────────────
function LessonShell({
  section,
  done,
  onToggle,
  children,
}: {
  section: (typeof SECTIONS)[number];
  done: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <section id={section.id} style={{ padding: "40px 0", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
      <div style={{ display: "flex", gap: "20px", alignItems: "flex-start", marginBottom: "24px" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: "44px", color: GOLD, lineHeight: 1, minWidth: "64px" }}>
          {section.num}
        </div>
        <div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "30px", margin: 0, lineHeight: 1.15 }}>{section.title}</h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.55)", marginTop: "6px" }}>{section.sub}</p>
        </div>
      </div>

      {children}

      <button
        onClick={onToggle}
        style={{
          marginTop: "24px",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 20px",
          background: done ? GOLD : "transparent",
          color: done ? CHARCOAL : "rgba(255,255,255,0.6)",
          border: `1px solid ${done ? GOLD : "rgba(255,255,255,0.15)"}`,
          borderRadius: "40px",
          fontSize: "11px",
          fontWeight: 700,
          letterSpacing: "2px",
          textTransform: "uppercase",
          cursor: "pointer",
          fontFamily: "inherit",
        }}
      >
        {done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
        {done ? "Completed" : "Mark complete"}
      </button>
    </section>
  );
}

// ── Widget: Level System ────────────────────────────────────────────────────
function LevelSystemWidget() {
  const [active, setActive] = useState(6);
  const level = LEVELS[active - 1];
  return (
    <div>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: "16px" }}>
        Every box of color has a level — a number from 1 (black) to 10 (lightest blonde). Click a swatch below to see what
        it looks like on paper and what pigment lives underneath.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(10, 1fr)", gap: "6px", margin: "16px 0" }}>
        {LEVELS.map((l) => (
          <button
            key={l.n}
            onClick={() => setActive(l.n)}
            style={{
              aspectRatio: "1/1.6",
              borderRadius: "8px",
              background: l.hex,
              color: "#fff",
              border: active === l.n ? `2px solid ${GOLD}` : "2px solid transparent",
              cursor: "pointer",
              fontFamily: "Georgia, serif",
              fontWeight: 700,
              fontSize: "17px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              padding: "6px 4px",
              transform: active === l.n ? "translateY(-3px)" : "none",
              boxShadow: active === l.n ? "0 8px 24px rgba(201,168,76,.45)" : "none",
              transition: "all .15s",
              textShadow: "0 1px 2px rgba(0,0,0,.4)",
            }}
          >
            {l.n}
          </button>
        ))}
      </div>

      <div
        style={{
          padding: "20px",
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px",
          minHeight: "110px",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "6px" }}>
          Level {level.n} · {level.name}
        </div>
        <div style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>
          Underlying pigment when lifted:{" "}
          <span style={{ color: GOLD, fontWeight: 700 }}>{level.underlying}</span>
        </div>
      </div>
    </div>
  );
}

// ── Widget: Underlying Pigment Slider ────────────────────────────────────────
function PigmentSliderWidget() {
  const [val, setVal] = useState(6);
  const readout = LEVELS[val - 1];

  const neutralMap: Record<string, { color: string; tone: string }> = {
    "Blue": { color: "#c9a54c", tone: "Gold / yellow toner" },
    "Blue-Red": { color: "#d4b06b", tone: "Gold-orange toner" },
    "Red": { color: "#4aae54", tone: "Green-based toner" },
    "Red-Orange": { color: "#3a99a6", tone: "Blue-green toner" },
    "Orange": { color: "#2e6bbd", tone: "Blue-based toner" },
    "Yellow-Orange": { color: "#4a6fbd", tone: "Blue-violet toner" },
    "Yellow": { color: "#7a4db5", tone: "Violet toner" },
    "Pale Yellow": { color: "#9b6cbd", tone: "Soft violet toner" },
    "Palest Yellow": { color: "#b28ed6", tone: "Pearl / lavender toner" },
    "None / Blue-Black": { color: "#555", tone: "No lift required" },
  };
  const neutral = neutralMap[readout.underlying] || neutralMap["Orange"];

  return (
    <div>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: "16px" }}>
        Drag the slider to a natural level. The strip below shows the exposed pigment as you lift — this is what your
        toner has to fight.
      </p>

      <div
        style={{
          position: "relative",
          height: "44px",
          borderRadius: "8px",
          overflow: "hidden",
          background:
            "linear-gradient(to right,#1a0f08 0%,#3d0e0a 12%,#7a1f12 25%,#b34a16 38%,#d97a1d 52%,#e9b13a 66%,#f2d878 80%,#f9eaa9 92%,#fbf3c8 100%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: "-4px",
            left: `${((val - 1) / 9) * 100}%`,
            width: "6px",
            height: "52px",
            background: "#fff",
            border: "2px solid #1a1a1a",
            borderRadius: "3px",
            transform: "translateX(-50%)",
            transition: "left .15s",
            boxShadow: "0 0 0 2px rgba(201,168,76,.4)",
          }}
        />
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        style={{ width: "100%", marginTop: "10px", accentColor: GOLD }}
      />

      <div
        style={{
          marginTop: "16px",
          padding: "20px",
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: "20px" }}>
          At Level {val}, you'll expose:{" "}
          <span style={{ color: GOLD }}>{readout.underlying}</span>
        </div>
        <div style={{ marginTop: "10px", display: "flex", alignItems: "center", gap: "10px", fontSize: "14px", color: "rgba(255,255,255,0.7)" }}>
          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: neutral.color }} />
          Neutralize with: <b style={{ color: "#fff" }}>{neutral.tone}</b>
        </div>
      </div>
    </div>
  );
}

// ── Widget: Developer Picker ─────────────────────────────────────────────────
function DeveloperPickerWidget() {
  const [vol, setVol] = useState(20);
  const pick = DEVELOPERS.find((d) => d.vol === vol)!;

  return (
    <div>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: "16px" }}>
        Developer volume determines how many levels you lift. More isn't always better — use the lowest volume that gets
        the job done.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "10px" }}>
        {DEVELOPERS.map((d) => (
          <button
            key={d.vol}
            onClick={() => setVol(d.vol)}
            style={{
              padding: "20px 12px",
              background: vol === d.vol ? "rgba(201,168,76,0.12)" : "#1a1a1a",
              border: `1px solid ${vol === d.vol ? GOLD : "rgba(255,255,255,0.08)"}`,
              borderRadius: "10px",
              cursor: "pointer",
              textAlign: "center",
              fontFamily: "inherit",
              color: "#fff",
            }}
          >
            <div style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: GOLD_DARK, fontWeight: 600 }}>
              {d.vol}
            </div>
            <div style={{ fontSize: "9px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginTop: "6px" }}>
              Volume
            </div>
          </button>
        ))}
      </div>

      <div
        style={{
          marginTop: "16px",
          padding: "20px",
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px",
        }}
      >
        <div style={{ fontFamily: "Georgia, serif", fontSize: "20px", marginBottom: "6px" }}>
          {pick.vol} Volume · Lifts {pick.lifts}
        </div>
        <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.65)" }}>{pick.use}</div>
      </div>
    </div>
  );
}

// ── Widget: Toner / Color Wheel ──────────────────────────────────────────────
function TonerWheelWidget() {
  const pairs = [
    { warm: "Orange", cancel: "Blue", hex: "#d97a1d", tone: "#2e6bbd" },
    { warm: "Yellow", cancel: "Violet", hex: "#e9b13a", tone: "#7a4db5" },
    { warm: "Red", cancel: "Green", hex: "#b34a16", tone: "#4aae54" },
  ];
  const [active, setActive] = useState(0);
  const p = pairs[active];
  return (
    <div>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: "16px" }}>
        Complementary colors cancel each other. Pick the warmth you want to kill — the wheel picks the toner family.
      </p>
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {pairs.map((x, i) => (
          <button
            key={x.warm}
            onClick={() => setActive(i)}
            style={{
              padding: "12px 20px",
              background: active === i ? "rgba(201,168,76,0.12)" : "#1a1a1a",
              border: `1px solid ${active === i ? GOLD : "rgba(255,255,255,0.08)"}`,
              borderRadius: "40px",
              color: "#fff",
              cursor: "pointer",
              fontSize: "13px",
              fontFamily: "inherit",
            }}
          >
            Cancel {x.warm.toLowerCase()}
          </button>
        ))}
      </div>
      <div
        style={{
          marginTop: "20px",
          padding: "24px",
          background: "#1a1a1a",
          border: "1px solid rgba(255,255,255,0.06)",
          borderRadius: "10px",
          display: "flex",
          alignItems: "center",
          gap: "20px",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: p.hex }} />
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>Warm tone</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "20px" }}>{p.warm}</div>
          </div>
        </div>
        <div style={{ fontSize: "24px", color: GOLD }}>→</div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "44px", height: "44px", borderRadius: "50%", background: p.tone }} />
          <div>
            <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase" }}>
              Cancel with
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "20px" }}>{p.cancel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Widget: Formula Worksheet ───────────────────────────────────────────────
function FormulaWorksheet() {
  const [natural, setNatural] = useState(5);
  const [target, setTarget] = useState(8);
  const lift = Math.max(0, target - natural);
  const devVol = lift === 0 ? 10 : lift <= 1 ? 20 : lift <= 2 ? 30 : 40;
  const exposed = target >= 8 ? "Yellow" : target >= 6 ? "Orange" : target >= 4 ? "Red" : "Blue";
  const toner = exposed === "Yellow" ? "Violet (V)" : exposed === "Orange" ? "Blue (B)" : exposed === "Red" ? "Green (G)" : "None";

  return (
    <div>
      <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.75)", lineHeight: 1.65, marginBottom: "20px" }}>
        Plug in the client's natural level and target. Teddy's recipe spits out below.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", maxWidth: "480px" }}>
        <Field label="Natural level" value={natural} onChange={setNatural} />
        <Field label="Target level" value={target} onChange={setTarget} />
      </div>

      <div
        style={{
          marginTop: "24px",
          padding: "24px",
          background: "linear-gradient(135deg, rgba(201,168,76,0.10), rgba(201,168,76,0.02))",
          border: `1px solid ${GOLD}`,
          borderRadius: "12px",
        }}
      >
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "14px" }}>
          Teddy's Recipe
        </div>
        <Row k="Lift required" v={`${lift} level${lift === 1 ? "" : "s"}`} />
        <Row k="Developer" v={`${devVol} volume`} />
        <Row k="Exposed pigment" v={exposed} />
        <Row k="Neutralize with" v={toner} />
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: number; onChange: (n: number) => void }) {
  return (
    <label style={{ display: "block" }}>
      <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "8px" }}>
        {label}
      </div>
      <select
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{
          width: "100%",
          padding: "12px",
          background: "#1a1a1a",
          color: "#fff",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: "6px",
          fontSize: "16px",
          fontFamily: "inherit",
        }}
      >
        {LEVELS.map((l) => (
          <option key={l.n} value={l.n}>
            Level {l.n} — {l.name}
          </option>
        ))}
      </select>
    </label>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <span style={{ fontSize: "13px", color: "rgba(255,255,255,0.6)" }}>{k}</span>
      <span style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#fff" }}>{v}</span>
    </div>
  );
}
