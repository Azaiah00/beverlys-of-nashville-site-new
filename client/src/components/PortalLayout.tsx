/**
 * Beverly's Academy Portal — Layout Shell
 *
 * Sidebar + top bar + content area. Used by every /portal/* route.
 * Shows ADMIN badge for admin users so Couture/Teddy/Monica know
 * they're in admin mode.
 */
import { ReactNode, useState } from "react";
import { Link, useLocation } from "wouter";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Library,
  Wrench,
  Trophy,
  User,
  Shield,
  LogOut,
  Menu,
  X,
  Sparkles,
  ArrowLeft,
} from "lucide-react";

const GOLD = "#C9A84C";
const GOLD_DARK = "#A8883A";
const CHARCOAL = "#1A1A1A";

const navItems = [
  { path: "/portal", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { path: "/portal/library", label: "Library", icon: Library },
  { path: "/portal/tools", label: "Tools", icon: Wrench },
  { path: "/portal/progress", label: "Progress", icon: Trophy },
  { path: "/portal/account", label: "Account", icon: User },
];

export default function PortalLayout({ children }: { children: ReactNode }) {
  const { user, profile, tier, isAdmin, portalDemoUnlock, isUnrestricted, signOut } = useAuth();
  const [location] = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const displayName =
    portalDemoUnlock && !user ? "Demo walkthrough" : profile?.full_name || user?.email?.split("@")[0] || "Member";
  const tierLabel = tier === "free" ? "Free" : tier.charAt(0).toUpperCase() + tier.slice(1);

  const isActive = (path: string, exact: boolean | undefined) =>
    exact ? location === path : location.startsWith(path);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f0f0f",
        color: "#fff",
        fontFamily: "Lato, Arial, sans-serif",
        display: "flex",
      }}
    >
      {/* ── Sidebar ── */}
      <aside
        style={{
          width: drawerOpen ? "260px" : "260px",
          background: "#141414",
          borderRight: "1px solid rgba(201,168,76,0.15)",
          padding: "32px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          position: "sticky",
          top: 0,
          height: "100vh",
          transition: "all .25s",
        }}
        className="portal-sidebar"
      >
        {/* Brand */}
        <Link href="/portal">
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", cursor: "pointer" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "50%",
                background: GOLD,
                color: CHARCOAL,
                display: "grid",
                placeItems: "center",
                fontFamily: "Georgia, serif",
                fontWeight: 700,
                fontSize: "18px",
              }}
            >
              B
            </div>
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "16px", color: "#fff" }}>
                Beverly's
              </div>
              <div style={{ fontSize: "9px", letterSpacing: "3px", color: GOLD, textTransform: "uppercase" }}>
                Academy
              </div>
            </div>
          </div>
        </Link>

        {/* Tier Badge */}
        <div
          style={{
            background: isUnrestricted ? GOLD : "rgba(201,168,76,0.1)",
            color: isUnrestricted ? CHARCOAL : GOLD,
            fontSize: "10px",
            letterSpacing: "2px",
            textTransform: "uppercase",
            padding: "8px 12px",
            borderRadius: "4px",
            fontWeight: 700,
            textAlign: "center",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "6px",
          }}
        >
          {portalDemoUnlock && !isAdmin ? (
            <>
              <Sparkles size={12} strokeWidth={2.5} /> Demo — all unlocked
            </>
          ) : isAdmin ? (
            <>
              <Shield size={12} strokeWidth={2.5} /> Admin Mode
            </>
          ) : (
            <>
              <Sparkles size={12} strokeWidth={2.5} /> {tierLabel} Tier
            </>
          )}
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1 }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path, item.exact);
            return (
              <Link key={item.path} href={item.path}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 14px",
                    borderRadius: "6px",
                    background: active ? "rgba(201,168,76,0.12)" : "transparent",
                    color: active ? GOLD : "rgba(255,255,255,0.7)",
                    fontSize: "14px",
                    cursor: "pointer",
                    borderLeft: active ? `3px solid ${GOLD}` : "3px solid transparent",
                    transition: "all .15s",
                  }}
                >
                  <Icon size={18} />
                  {item.label}
                </div>
              </Link>
            );
          })}
          {isAdmin && (
            <Link href="/portal/admin">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "12px 14px",
                  borderRadius: "6px",
                  background: location.startsWith("/portal/admin") ? "rgba(201,168,76,0.12)" : "transparent",
                  color: location.startsWith("/portal/admin") ? GOLD : "rgba(255,255,255,0.5)",
                  fontSize: "14px",
                  cursor: "pointer",
                  borderLeft: location.startsWith("/portal/admin") ? `3px solid ${GOLD}` : "3px solid transparent",
                  marginTop: "12px",
                  borderTop: "1px solid rgba(255,255,255,0.05)",
                  paddingTop: "20px",
                }}
              >
                <Shield size={18} />
                Admin
              </div>
            </Link>
          )}
        </nav>

        {/* Footer: user info + sign out */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "16px" }}>
          <div style={{ fontSize: "13px", color: "#fff", marginBottom: "2px", fontWeight: 600 }}>{displayName}</div>
          <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.5)", marginBottom: "16px", wordBreak: "break-all" }}>
            {portalDemoUnlock && !user ? "VITE_PORTAL_DEMO_UNLOCK=true — no sign-in" : user?.email}
          </div>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <Link href="/">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.8)",
                  fontSize: "12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <ArrowLeft size={14} /> Back to Website
              </div>
            </Link>

            {user ? (
              <button
                type="button"
                onClick={() => signOut()}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.7)",
                  fontSize: "12px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  width: "100%",
                  justifyContent: "center",
                  transition: "all 0.2s",
                }}
              >
                <LogOut size={14} /> Sign out
              </button>
            ) : (
              <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", lineHeight: 1.5, textAlign: "center" }}>
                Remove demo flag from <code style={{ color: GOLD }}>.env.local</code> to require login again.
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, minWidth: 0, padding: "40px 48px 80px" }}>
        {children}
      </main>

      {/* Mobile hamburger — visible ≤900px */}
      <button
        type="button"
        aria-label="Toggle portal menu"
        onClick={() => setDrawerOpen(!drawerOpen)}
        className="portal-mobile-toggle"
        style={{
          position: "fixed",
          top: "16px",
          left: "16px",
          zIndex: 200,
          width: "44px",
          height: "44px",
          borderRadius: "8px",
          background: CHARCOAL,
          border: `1px solid ${GOLD}`,
          color: GOLD,
          display: "none",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.5)",
        }}
      >
        {drawerOpen ? <X size={22} /> : <Menu size={22} />}
      </button>

      {/* Backdrop overlay when drawer is open on mobile */}
      {drawerOpen && (
        <div
          className="portal-backdrop"
          onClick={() => setDrawerOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            zIndex: 99,
            display: "none",
          }}
        />
      )}

      <style>{`
        @media (max-width: 900px) {
          .portal-sidebar {
            position: fixed !important;
            left: ${drawerOpen ? "0" : "-280px"} !important;
            z-index: 150;
            width: 260px !important;
            overflow-y: auto;
          }
          .portal-mobile-toggle {
            display: flex !important;
          }
          .portal-backdrop {
            display: block !important;
          }
          main {
            padding: 24px 16px 60px !important;
          }
        }
      `}</style>
    </div>
  );
}
