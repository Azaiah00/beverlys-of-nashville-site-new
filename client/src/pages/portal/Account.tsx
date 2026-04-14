/**
 * Beverly's Academy Portal — Account
 * Links to Stripe Customer Portal for billing changes.
 */
import { useAuth } from "@/contexts/AuthContext";
import PortalLayout from "@/components/PortalLayout";
import { CreditCard, Mail, Shield } from "lucide-react";

const GOLD = "#C9A84C";
const CHARCOAL = "#1A1A1A";

export default function Account() {
  const { user, profile, subscription, tier, isAdmin } = useAuth();

  const openStripePortal = async () => {
    const res = await fetch("/api/create-portal-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user?.id }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
  };

  return (
    <PortalLayout>
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontSize: "11px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase", marginBottom: "10px" }}>
          Account
        </div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: "36px", margin: 0 }}>Your account</h1>
      </div>

      {/* Profile card */}
      <Card>
        <Row icon={<Mail size={18} color={GOLD} />} label="Email" value={user?.email ?? ""} />
        <Row icon={<Shield size={18} color={GOLD} />} label="Role" value={isAdmin ? "Admin (all tiers unlocked)" : tier.charAt(0).toUpperCase() + tier.slice(1)} />
        {profile?.full_name && <Row icon={null} label="Name" value={profile.full_name} />}
      </Card>

      {/* Subscription card */}
      <Card title="Subscription & Billing">
        {isAdmin ? (
          <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)" }}>
            Admin accounts don't need a subscription — you have full access automatically.
          </p>
        ) : subscription ? (
          <>
            <Row label="Tier" value={subscription.tier} />
            <Row label="Status" value={subscription.status} />
            {subscription.current_period_end && (
              <Row
                label="Next billing"
                value={new Date(subscription.current_period_end).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              />
            )}
            {subscription.cancel_at_period_end && (
              <div style={{ marginTop: "16px", padding: "12px", background: "rgba(255,180,60,0.08)", border: "1px solid rgba(255,180,60,0.3)", borderRadius: "4px", fontSize: "13px", color: "#ffc660" }}>
                Your subscription will cancel at the end of the current period.
              </div>
            )}
            <button onClick={openStripePortal} style={{ ...primaryBtn, marginTop: "20px" }}>
              <CreditCard size={16} /> Manage Billing
            </button>
          </>
        ) : (
          <>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", marginBottom: "16px" }}>
              You're on the free tier. Upgrade to unlock the full Academy.
            </p>
            <a href="/pricing">
              <button style={primaryBtn}>See Tiers</button>
            </a>
          </>
        )}
      </Card>
    </PortalLayout>
  );
}

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div
      style={{
        background: "#1a1a1a",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "8px",
        padding: "28px",
        marginBottom: "20px",
        maxWidth: "640px",
      }}
    >
      {title && (
        <h2 style={{ fontFamily: "Georgia, serif", fontSize: "20px", marginBottom: "20px", marginTop: 0 }}>{title}</h2>
      )}
      {children}
    </div>
  );
}

function Row({ icon, label, value }: { icon?: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "14px", padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      {icon && <div style={{ width: "20px" }}>{icon}</div>}
      <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.5)", textTransform: "uppercase", width: "120px" }}>
        {label}
      </div>
      <div style={{ fontSize: "14px", color: "#fff", flex: 1 }}>{value}</div>
    </div>
  );
}

const primaryBtn: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "12px 24px",
  background: GOLD,
  color: CHARCOAL,
  border: "none",
  borderRadius: "4px",
  fontSize: "12px",
  fontWeight: 700,
  letterSpacing: "2px",
  textTransform: "uppercase",
  cursor: "pointer",
  fontFamily: "inherit",
};
