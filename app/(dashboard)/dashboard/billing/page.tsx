"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { CheckCircle2, Zap, Star, Crown, ArrowRight, CreditCard, FileText } from "lucide-react";

const plans = [
  {
    id: "starter", name: "Starter", price: "$9.99", scripts: 4, current: true,
    accentColor: "#00D4FF", glowColor: "rgba(0,212,255,0.08)",
    borderColor: "rgba(0,212,255,0.2)",
    features: ["4 full AI scripts/month","120 AI thumbnail assets","Chrome Extension","Outlier scores & analytics","Style profiles","Production board"],
  },
  {
    id: "pro", name: "Pro", price: "$29.99", scripts: 15, current: false,
    tag: "Most Popular", accentColor: "#00D4FF", glowColor: "rgba(0,212,255,0.06)",
    borderColor: "rgba(0,212,255,0.35)",
    features: ["15 full AI scripts/month","300 AI thumbnail assets","Everything in Starter","Niche Finder database","Similar Channels finder","Team collaboration","Multiple channel profiles","Priority generation"],
  },
  {
    id: "elite", name: "Elite AI", price: "$99.99", scripts: 30, current: false,
    tag: "Premium", accentColor: "#facc15", glowColor: "rgba(250,204,21,0.06)",
    borderColor: "rgba(250,204,21,0.3)",
    features: ["30 full AI scripts/month","600 AI thumbnail assets","Everything in Pro","AI consulting chat","Personal YouTube mentor","Strategy & growth advice","Priority support"],
  },
];

export default function BillingPage() {
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Billing" subtitle="Manage your plan and usage" />

      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Current plan card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20,
          padding: "22px 26px", borderRadius: 16, marginBottom: 36,
          background: "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(0,212,255,0.02))",
          border: "1px solid rgba(0,212,255,0.18)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13, flexShrink: 0,
            background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Zap size={22} color="#00D4FF" fill="#00D4FF" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>Starter Plan</span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 99,
                background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", color: "#00D4FF",
              }}>Current Plan</span>
            </div>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>$9.99/month · Renews May 13, 2026</p>
            <div style={{ display: "flex", gap: 20, marginTop: 6 }}>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Scripts: <strong style={{ color: "#e2e8f0" }}>0 / 4 used</strong></span>
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Thumbnails: <strong style={{ color: "#e2e8f0" }}>0 / 120 used</strong></span>
            </div>
          </div>
          <button style={{
            padding: "10px 20px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)", color: "#94a3b8",
            fontSize: 13, cursor: "pointer", transition: "all 0.2s",
          }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.18)")}
            onMouseLeave={e => (e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)")}
          >Manage Subscription</button>
        </div>

        {/* Toggle */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-0.5px" }}>Upgrade Your Plan</h2>
          <div style={{
            display: "inline-flex", padding: 4, borderRadius: 12,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
          }}>
            {(["monthly", "annual"] as const).map((b) => (
              <button key={b} onClick={() => setBilling(b)} style={{
                padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600,
                cursor: "pointer", transition: "all 0.2s", border: "none",
                background: billing === b ? "rgba(0,212,255,0.1)" : "transparent",
                color: billing === b ? "#00D4FF" : "#475569",
                outline: billing === b ? "1px solid rgba(0,212,255,0.2)" : "none",
                display: "flex", alignItems: "center", gap: 8,
              }}>
                {b === "monthly" ? "Monthly" : "Annual"}
                {b === "annual" && <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 99, background: "rgba(52,211,153,0.15)", color: "#34d399", fontWeight: 700 }}>Save 20%</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 40 }}>
          {plans.map((plan) => (
            <div key={plan.id} style={{
              borderRadius: 18, overflow: "hidden", position: "relative",
              background: `linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))`,
              border: `1px solid ${plan.borderColor}`,
              opacity: plan.current ? 0.75 : 1,
            }}>
              {/* Glow */}
              <div style={{
                position: "absolute", inset: 0, pointerEvents: "none",
                background: `radial-gradient(ellipse at 50% 0%, ${plan.glowColor}, transparent 70%)`,
              }} />

              {plan.tag && (
                <div style={{ position: "absolute", top: 16, right: 16 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99,
                    background: plan.id === "elite" ? "rgba(250,204,21,0.15)" : "rgba(0,212,255,0.15)",
                    color: plan.id === "elite" ? "#facc15" : "#00D4FF",
                    border: `1px solid ${plan.id === "elite" ? "rgba(250,204,21,0.3)" : "rgba(0,212,255,0.3)"}`,
                  }}>{plan.tag}</span>
                </div>
              )}

              <div style={{ padding: "26px 24px", position: "relative" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                  {plan.id === "starter" && <Zap size={16} color="#00D4FF" />}
                  {plan.id === "pro" && <Star size={16} color="#00D4FF" fill="#00D4FF" />}
                  {plan.id === "elite" && <Crown size={16} color="#facc15" fill="#facc15" />}
                  <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{plan.name}</span>
                </div>

                <div style={{ marginBottom: 4 }}>
                  <span style={{ fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>
                    {billing === "annual" ? `$${(parseFloat(plan.price.slice(1)) * 0.8).toFixed(2)}` : plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: "#94a3b8" }}>/mo</span>
                </div>
                <p style={{ fontSize: 12, color: plan.accentColor, fontWeight: 600, marginBottom: 20 }}>
                  {plan.scripts} scripts/month
                </p>

                {plan.current ? (
                  <button disabled style={{
                    width: "100%", padding: "11px", borderRadius: 11,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                    color: "#94a3b8", fontSize: 13, fontWeight: 700, cursor: "not-allowed",
                  }}>Current Plan</button>
                ) : (
                  <button style={{
                    width: "100%", padding: "11px", borderRadius: 11,
                    background: plan.id === "elite"
                      ? "linear-gradient(135deg, #facc15, #f59e0b)"
                      : "linear-gradient(135deg, #00D4FF, #0080cc)",
                    color: plan.id === "elite" ? "#1a0a00" : "#04080F",
                    fontSize: 13, fontWeight: 800, cursor: "pointer", border: "none",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    boxShadow: plan.id === "elite" ? "0 0 20px rgba(250,204,21,0.25)" : "0 0 20px rgba(0,212,255,0.25)",
                    transition: "all 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.filter = "brightness(1.1)")}
                    onMouseLeave={e => (e.currentTarget.style.filter = "brightness(1)")}
                  >
                    Upgrade to {plan.name} <ArrowRight size={14} />
                  </button>
                )}

                <ul style={{ marginTop: 22, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                  {plan.features.map((f) => (
                    <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                      <CheckCircle2 size={13} color={plan.accentColor} style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Invoice History */}
        <div style={{
          borderRadius: 16, overflow: "hidden",
          background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
          border: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
            <FileText size={14} color="#00D4FF" />
            <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Invoice History</span>
          </div>
          <div style={{ padding: "40px 22px", textAlign: "center" }}>
            <CreditCard size={28} color="#334155" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>No invoices yet</p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Your billing history will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}
