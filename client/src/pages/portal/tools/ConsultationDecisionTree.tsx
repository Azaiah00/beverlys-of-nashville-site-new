/**
 * Beverly's Academy — Consultation Decision Tree (Artisan+)
 *
 * An interactive branching consultation that walks a stylist through a new
 * client conversation and produces recommended services, red flags, and
 * upsells — all from Teddy's playbook.
 */
import { useState } from "react";
import PortalLayout from "@/components/PortalLayout";
import { ArrowLeft, CheckCircle2, Sparkles } from "lucide-react";

const GOLD = "#C9A84C";
const CHARCOAL = "#1A1A1A";

type NodeId =
  | "start" | "history" | "chemical" | "virgin" | "damage_high" | "damage_low"
  | "color_goal" | "style_goal" | "dimensional" | "solid" | "vivid" | "gray"
  | "result_repair" | "result_balayage" | "result_full" | "result_vivid" | "result_gray_blend";

type TreeNode = {
  id: NodeId;
  prompt: string;
  subtitle?: string;
  options?: { label: string; next: NodeId; tag?: string }[];
  result?: { title: string; services: string[]; redFlags: string[]; upsell: string; price: string };
};

const TREE: Record<NodeId, TreeNode> = {
  start: {
    id: "start",
    prompt: "What did the client book for?",
    subtitle: "This is the easiest place to start the consult — then work backward from their real goal.",
    options: [
      { label: "Color service", next: "history" },
      { label: "Cut / style only", next: "style_goal" },
    ],
  },
  history: {
    id: "history",
    prompt: "Any chemical history we need to know about?",
    subtitle: "Box dye, bleach, keratin, perms — anything that changes how the hair will behave.",
    options: [
      { label: "Yes — chemical history", next: "chemical" },
      { label: "No — virgin hair", next: "virgin" },
    ],
  },
  chemical: {
    id: "chemical",
    prompt: "How's the condition?",
    subtitle: "Run the strand test. Check elasticity, dryness, and scalp.",
    options: [
      { label: "Damaged / fragile", next: "damage_high" },
      { label: "Healthy", next: "damage_low" },
    ],
  },
  virgin: { id: "virgin", prompt: "What's the color goal?", options: [
    { label: "Dimensional (highlights / balayage)", next: "dimensional" },
    { label: "All-over solid color", next: "solid" },
    { label: "Vivid / fashion color", next: "vivid" },
    { label: "Cover gray", next: "gray" },
  ] },
  damage_high: { id: "damage_high", prompt: "Repair first.", result: {
    title: "Recovery protocol before color",
    services: ["Bond-building treatment (Olaplex stand-alone)", "Deep reconstructing mask", "Trim dead ends", "Rebook for color in 2 weeks"],
    redFlags: ["Do NOT lift today — breakage risk is high", "Avoid 30/40 vol developer", "No bleach near damaged ends"],
    upsell: "Recovery Series — 3 bond treatments over 4 weeks",
    price: "$180",
  }},
  damage_low: { id: "damage_low", prompt: "What's the color goal?", options: [
    { label: "Dimensional", next: "dimensional" },
    { label: "Solid", next: "solid" },
    { label: "Vivid", next: "vivid" },
    { label: "Gray blend", next: "gray" },
  ] },
  color_goal: { id: "color_goal", prompt: "What's the color goal?", options: [
    { label: "Dimensional", next: "dimensional" },
    { label: "Solid", next: "solid" },
    { label: "Vivid", next: "vivid" },
    { label: "Gray blend", next: "gray" },
  ] },
  style_goal: { id: "style_goal", prompt: "Cut goal?", options: [
    { label: "Refresh / trim", next: "result_repair" },
    { label: "Major change", next: "result_full" },
  ]},
  dimensional: { id: "dimensional", prompt: "", result: {
    title: "Partial or Full Balayage",
    services: ["Face-framing balayage", "Root smudge", "Glossing toner", "Blow-out finish"],
    redFlags: ["Don't promise platinum in one session on Level 4-5", "Set expectation: 2-3 sessions for dramatic lift"],
    upsell: "Add gloss refresh at week 4 ($65)",
    price: "$280 – $380",
  }},
  solid: { id: "solid", prompt: "", result: {
    title: "All-Over Color",
    services: ["Single-process color", "Glossing toner", "Moisture mask"],
    redFlags: ["Check regrowth line — skip bleach pull-through on fresh dye"],
    upsell: "Take-home Color Wow + 6-week touch-up booking",
    price: "$140 – $180",
  }},
  vivid: { id: "vivid", prompt: "", result: {
    title: "Vivid / Fashion Color",
    services: ["Lightening session to Level 9+", "Tone out yellow to platinum", "Apply vivid (Pulp Riot / Pravana)", "Seal with cool rinse"],
    redFlags: ["Consult pricing — 2 sessions likely", "Fade in 4-6 weeks — upsell refresh", "No hot tools without heat protectant"],
    upsell: "Vivid Maintenance Kit + 4-week refresh bundle",
    price: "$450+",
  }},
  gray: { id: "gray", prompt: "", result: {
    title: "Gray Blending / Coverage",
    services: ["Pre-soften resistant gray", "Root touch-up with N series base", "Add demi gloss for shine", "Blend with lowlights if 50%+ gray"],
    redFlags: ["100% resistant gray — pre-soften 5 min", "Don't over-lift — stay within 2 levels"],
    upsell: "Book 4-week root touch-up series",
    price: "$120 – $160",
  }},
  result_repair: { id: "result_repair", prompt: "", result: {
    title: "Precision Trim + Gloss",
    services: ["Dusting trim", "Clear gloss to boost shine", "Style finish"],
    redFlags: [],
    upsell: "Home care kit + rebook 6 weeks",
    price: "$75 – $95",
  }},
  result_balayage: { id: "result_balayage", prompt: "", result: { title: "Balayage", services: [], redFlags: [], upsell: "", price: "" }},
  result_full: { id: "result_full", prompt: "", result: {
    title: "Signature Cut + Blowout",
    services: ["Consultation + full cut", "Deep condition", "Blowout styling"],
    redFlags: ["Bring inspo photos", "Show client cut in stages if dramatic"],
    upsell: "Add gloss service ($55)",
    price: "$120",
  }},
  result_vivid: { id: "result_vivid", prompt: "", result: { title: "Vivid", services: [], redFlags: [], upsell: "", price: "" }},
  result_gray_blend: { id: "result_gray_blend", prompt: "", result: { title: "Gray blend", services: [], redFlags: [], upsell: "", price: "" }},
};

export default function ConsultationDecisionTree() {
  const [path, setPath] = useState<NodeId[]>(["start"]);
  const [tags, setTags] = useState<string[]>([]);
  const current = TREE[path[path.length - 1]];

  const choose = (next: NodeId, tag?: string) => {
    setPath((p) => [...p, next]);
    if (tag) setTags((t) => [...t, tag]);
  };

  const back = () => {
    if (path.length > 1) setPath((p) => p.slice(0, -1));
  };

  const reset = () => {
    setPath(["start"]);
    setTags([]);
  };

  return (
    <PortalLayout>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "10px" }}>
          Interactive Tool
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "38px", margin: "0 0 8px" }}>
          The Consultation Decision Tree.
        </h1>
        <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.6)", maxWidth: "640px" }}>
          Walk new clients through Teddy's consultation flow in 90 seconds. The tree spits out recommended services,
          red flags to watch, pricing range, and the upsell that fits.
        </p>
      </div>

      {/* Breadcrumb */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        {path.length > 1 && (
          <button onClick={back} style={{ ...btnGhost, padding: "8px 14px", fontSize: "10px" }}>
            <ArrowLeft size={12} /> Back
          </button>
        )}
        <button onClick={reset} style={{ ...btnGhost, padding: "8px 14px", fontSize: "10px", borderColor: "rgba(255,255,255,0.15)", color: "rgba(255,255,255,0.6)" }}>
          Start over
        </button>
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", letterSpacing: "2px", textTransform: "uppercase" }}>
          Step {path.length}
        </div>
      </div>

      {/* Prompt or Result */}
      {current.options ? (
        <div style={{ background: "#1a1a1a", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px", padding: "36px", maxWidth: "720px" }}>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "28px", margin: "0 0 12px" }}>{current.prompt}</h2>
          {current.subtitle && (
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.55)", margin: "0 0 24px", lineHeight: 1.6 }}>
              {current.subtitle}
            </p>
          )}
          <div style={{ display: "grid", gap: "10px" }}>
            {current.options.map((o) => (
              <button
                key={o.label}
                onClick={() => choose(o.next, o.tag)}
                style={{
                  padding: "16px 20px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  color: "#fff",
                  fontSize: "15px",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  transition: "all .15s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = GOLD;
                  e.currentTarget.style.background = "rgba(201,168,76,0.06)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)";
                  e.currentTarget.style.background = "transparent";
                }}
              >
                {o.label}
              </button>
            ))}
          </div>
        </div>
      ) : current.result ? (
        <ResultCard result={current.result} onReset={reset} />
      ) : null}
    </PortalLayout>
  );
}

function ResultCard({ result, onReset }: { result: NonNullable<TreeNode["result"]>; onReset: () => void }) {
  return (
    <div
      style={{
        background: "linear-gradient(135deg, rgba(201,168,76,0.10), rgba(201,168,76,0.02))",
        border: `1px solid ${GOLD}`,
        borderRadius: "12px",
        padding: "36px",
        maxWidth: "780px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <Sparkles size={18} color={GOLD} />
        <span style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase" }}>Recommended</span>
      </div>
      <h2 style={{ fontFamily: "Georgia, serif", fontSize: "32px", margin: "0 0 24px" }}>{result.title}</h2>

      {result.services.length > 0 && (
        <Section title="Services">
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {result.services.map((s) => (
              <li key={s} style={{ display: "flex", gap: "10px", padding: "6px 0", fontSize: "15px", color: "rgba(255,255,255,0.85)" }}>
                <CheckCircle2 size={16} color={GOLD} style={{ flexShrink: 0, marginTop: "3px" }} />
                {s}
              </li>
            ))}
          </ul>
        </Section>
      )}

      {result.redFlags.length > 0 && (
        <Section title="Red flags">
          <ul style={{ margin: 0, paddingLeft: "20px", color: "rgba(255,180,60,0.9)", fontSize: "14px", lineHeight: 1.7 }}>
            {result.redFlags.map((f) => <li key={f}>{f}</li>)}
          </ul>
        </Section>
      )}

      {result.upsell && (
        <Section title="Upsell">
          <p style={{ fontSize: "15px", color: "#fff", margin: 0, lineHeight: 1.6 }}>{result.upsell}</p>
        </Section>
      )}

      {result.price && (
        <Section title="Price range">
          <div style={{ fontFamily: "Georgia, serif", fontSize: "28px", color: GOLD }}>{result.price}</div>
        </Section>
      )}

      <button onClick={onReset} style={{ ...btnGhost, marginTop: "28px" }}>
        Start a new consultation
      </button>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <div style={{ fontSize: "10px", letterSpacing: "3px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", marginBottom: "10px" }}>
        {title}
      </div>
      {children}
    </div>
  );
}

const btnGhost: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "8px",
  padding: "10px 18px", background: "transparent", color: GOLD,
  border: `1px solid ${GOLD}`, borderRadius: "4px",
  fontSize: "11px", fontWeight: 700, letterSpacing: "2px", textTransform: "uppercase",
  cursor: "pointer", fontFamily: "inherit",
};
