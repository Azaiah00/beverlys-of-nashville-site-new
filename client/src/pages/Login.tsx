/**
 * Beverly's Academy Portal — Login
 */
import { useState } from "react";
import { Link, useLocation, useSearch } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const GOLD = "#C9A84C";
const CHARCOAL = "#1A1A1A";

export default function Login() {
  const { signIn, signInWithGoogle, sendMagicLink } = useAuth();
  const [, setLocation] = useLocation();
  const search = useSearch();
  const nextUrl = new URLSearchParams(search).get("next") ?? "/portal";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"password" | "magic">("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [magicSent, setMagicSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === "magic") {
      const { error } = await sendMagicLink(email);
      if (error) setError(error);
      else setMagicSent(true);
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    setLoading(false);
    if (error) setError(error);
    else setLocation(nextUrl);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: `linear-gradient(135deg, ${CHARCOAL} 0%, #1f1a0e 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        fontFamily: "Lato, sans-serif",
        color: "#fff",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "440px",
          background: "#141414",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "8px",
          padding: "48px 40px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.6)",
        }}
      >
        <Link href="/">
          <div style={{ textAlign: "center", marginBottom: "32px", cursor: "pointer" }}>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: GOLD, textTransform: "uppercase", marginBottom: "4px" }}>
              Beverly's Academy
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "28px" }}>Welcome back.</div>
          </div>
        </Link>

        {magicSent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "8px" }}>
              Check your inbox.
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
              We sent a sign-in link to <strong style={{ color: "#fff" }}>{email}</strong>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              autoComplete="email"
            />

            {mode === "password" && (
              <>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={inputStyle}
                  autoComplete="current-password"
                />
              </>
            )}

            {error && (
              <div
                style={{
                  color: "#ff6b6b",
                  fontSize: "13px",
                  marginBottom: "16px",
                  padding: "10px",
                  background: "rgba(255,107,107,0.08)",
                  border: "1px solid rgba(255,107,107,0.2)",
                  borderRadius: "4px",
                }}
              >
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} style={primaryBtn}>
              {loading ? "Working…" : mode === "password" ? "Sign in" : "Email me a link"}
            </button>

            <button
              type="button"
              onClick={() => setMode(mode === "password" ? "magic" : "password")}
              style={linkBtn}
            >
              {mode === "password" ? "Email me a magic link instead" : "Use password instead"}
            </button>

            <div style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "20px 0" }}>
              OR
            </div>

            <button
              type="button"
              onClick={() => signInWithGoogle()}
              style={{ ...primaryBtn, background: "#fff", color: CHARCOAL, marginBottom: "16px" }}
            >
              Continue with Google
            </button>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
          New to Beverly's Academy?{" "}
          <Link href="/signup">
            <span style={{ color: GOLD, cursor: "pointer", textDecoration: "underline" }}>Create an account</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "10px",
  letterSpacing: "2px",
  textTransform: "uppercase",
  color: "rgba(255,255,255,0.5)",
  marginBottom: "6px",
  marginTop: "14px",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "12px 14px",
  background: "#0e0e0e",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "4px",
  color: "#fff",
  fontSize: "15px",
  marginBottom: "4px",
  outline: "none",
  fontFamily: "inherit",
};

const primaryBtn: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  background: GOLD,
  color: CHARCOAL,
  border: "none",
  borderRadius: "4px",
  fontSize: "13px",
  fontWeight: 700,
  letterSpacing: "2px",
  textTransform: "uppercase",
  cursor: "pointer",
  marginTop: "20px",
  fontFamily: "inherit",
};

const linkBtn: React.CSSProperties = {
  width: "100%",
  padding: "10px",
  background: "transparent",
  color: "rgba(255,255,255,0.6)",
  border: "none",
  fontSize: "12px",
  cursor: "pointer",
  marginTop: "10px",
  textDecoration: "underline",
  fontFamily: "inherit",
};
