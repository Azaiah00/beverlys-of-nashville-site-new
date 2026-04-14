/**
 * Beverly's Academy Portal — Signup
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";

const GOLD = "#C9A84C";
const CHARCOAL = "#1A1A1A";

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const [, setLocation] = useLocation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await signUp(email, password, fullName);
    setLoading(false);
    if (error) setError(error);
    else setSent(true);
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
          maxWidth: "460px",
          background: "#141414",
          border: "1px solid rgba(201,168,76,0.2)",
          borderRadius: "8px",
          padding: "48px 40px",
        }}
      >
        <Link href="/">
          <div style={{ textAlign: "center", marginBottom: "28px", cursor: "pointer" }}>
            <div style={{ fontSize: "10px", letterSpacing: "4px", color: GOLD, textTransform: "uppercase", marginBottom: "4px" }}>
              Beverly's Academy
            </div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "28px" }}>Join the Academy.</div>
            <div style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginTop: "8px" }}>
              Free account — grab the Master Colorist's Cheat Sheet + explore the Portal.
            </div>
          </div>
        </Link>

        {sent ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✉</div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: "22px", marginBottom: "8px" }}>
              Confirm your email.
            </div>
            <div style={{ color: "rgba(255,255,255,0.6)", fontSize: "14px" }}>
              We sent a confirmation link to <strong style={{ color: "#fff" }}>{email}</strong>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit}>
            <Label>Full name</Label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} />

            <Label>Email</Label>
            <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />

            <Label>Password (8+ characters)</Label>
            <Input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />

            {error && (
              <div
                style={{
                  color: "#ff6b6b",
                  fontSize: "13px",
                  margin: "12px 0",
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
              {loading ? "Creating account…" : "Create my free account"}
            </button>

            <div style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.4)", margin: "16px 0" }}>
              OR
            </div>

            <button
              type="button"
              onClick={() => signInWithGoogle()}
              style={{ ...primaryBtn, background: "#fff", color: CHARCOAL }}
            >
              Sign up with Google
            </button>

            <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.4)", textAlign: "center", marginTop: "16px" }}>
              By signing up you agree to Beverly's Terms & Privacy Policy.
            </div>
          </form>
        )}

        <div style={{ textAlign: "center", marginTop: "24px", fontSize: "13px", color: "rgba(255,255,255,0.5)" }}>
          Already a member?{" "}
          <Link href="/login">
            <span style={{ color: GOLD, cursor: "pointer", textDecoration: "underline" }}>Sign in</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

const Label = ({ children }: { children: React.ReactNode }) => (
  <label
    style={{
      display: "block",
      fontSize: "10px",
      letterSpacing: "2px",
      textTransform: "uppercase",
      color: "rgba(255,255,255,0.5)",
      marginBottom: "6px",
      marginTop: "14px",
    }}
  >
    {children}
  </label>
);

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    style={{
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
    }}
  />
);

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
