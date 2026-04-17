"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/dashboard/topbar";
import { usePlan } from "@/lib/hooks/use-plan";
import { PLAN_LIMITS } from "@/lib/plan-config";
import {
  CheckCircle2, Zap, Star, Crown, ArrowRight, CreditCard,
  FileText, Loader2, AlertCircle, ExternalLink,
} from "lucide-react";

const plans = [
  {
    id: "starter" as const,
    name: "Starter",
    features: [
      "4 full AI scripts/month",
      "120 AI thumbnail assets",
      "Chrome Extension (analytics, tags, outlier scores)",
      "Score review & analysis",
      "Style profiles",
      "Research import (URLs, PDFs)",
      "Production board",
    ],
    accentColor: "#00D4FF",
    glowColor: "rgba(0,212,255,0.08)",
    borderColor: "rgba(0,212,255,0.2)",
  },
  {
    id: "pro" as const,
    name: "Pro",
    tag: "Most Popular",
    features: [
      "15 full AI scripts/month",
      "300 AI thumbnail assets",
      "Everything in Starter",
      "Niche Finder database",
      "Similar Channels finder",
      "Saved Channels",
      "Niche Bending tool",
      "Team collaboration (5 seats)",
      "Multiple channel profiles",
      "Priority generation",
    ],
    accentColor: "#00D4FF",
    glowColor: "rgba(0,212,255,0.06)",
    borderColor: "rgba(0,212,255,0.35)",
  },
  {
    id: "elite" as const,
    name: "Townshub AI",
    tag: "Premium",
    features: [
      "30 full AI scripts/month",
      "600 AI thumbnail assets",
      "Everything in Pro",
      "Townshub AI consulting chat",
      "Personal YouTube mentor",
      "Strategy & growth advice",
      "Niche & trend analysis",
      "Priority support",
    ],
    accentColor: "#facc15",
    glowColor: "rgba(250,204,21,0.06)",
    borderColor: "rgba(250,204,21,0.3)",
  },
];

export default function BillingPage() {
  const { plan: currentPlan, scriptsUsed, scriptsLimit, currentPeriodEnd, status, loading } = usePlan();
  const searchParams = useSearchParams();
  const [billing, setBilling] = useState<"monthly" | "annual">("monthly");
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Clear stale errors on mount; detect post-checkout success redirect
  useEffect(() => {
    setError(null);
    if (searchParams.get("success") === "1") setSuccess(true);
  }, [searchParams]);

  const currentLimits = PLAN_LIMITS[currentPlan];

  const renewalDate = currentPeriodEnd
    ? new Date(currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    : null;

  async function handleUpgrade(planId: "starter" | "pro" | "elite") {
    setError(null);
    setLoadingPlan(planId);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planId, billing }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Failed to create checkout session.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  }

  async function handleManageSubscription() {
    setError(null);
    setPortalLoading(true);
    try {
      const res = await fetch("/api/stripe/portal", { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.url) {
        setError(data.error || "Failed to open billing portal.");
        return;
      }
      window.location.href = data.url;
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setPortalLoading(false);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Billing" subtitle="Manage your plan and usage" />

      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Success banner */}
        {success && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12,
            background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.25)", marginBottom: 24,
          }}>
            <CheckCircle2 size={15} color="#34d399" />
            <span style={{ fontSize: 13, color: "#34d399", flex: 1, fontWeight: 600 }}>
              You&apos;re all set! Your subscription is now active. Welcome to {currentLimits.label}.
            </span>
            <button onClick={() => setSuccess(false)} style={{ background: "none", border: "none", color: "#34d399", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div style={{
            display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", borderRadius: 12,
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)", marginBottom: 24,
          }}>
            <AlertCircle size={15} color="#f87171" />
            <span style={{ fontSize: 13, color: "#f87171", flex: 1 }}>
              {error.includes("connection to Stripe")
                ? "Could not reach Stripe. Please check your connection and try again."
                : error}
            </span>
            <button onClick={() => setError(null)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>×</button>
          </div>
        )}

        {/* Current plan card */}
        <div style={{
          display: "flex", alignItems: "center", gap: 20, padding: "22px 26px",
          borderRadius: 16, marginBottom: 36,
          background: "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(0,212,255,0.02))",
          border: "1px solid rgba(0,212,255,0.18)",
        }}>
          <div style={{
            width: 48, height: 48, borderRadius: 13, flexShrink: 0,
            background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {currentPlan === "elite" ? <Crown size={22} color="#facc15" fill="#facc15" /> :
             currentPlan === "pro"   ? <Star size={22} color="#00D4FF" fill="#00D4FF" /> :
                                       <Zap size={22} color="#00D4FF" fill="#00D4FF" />}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 16, fontWeight: 800, color: "#fff" }}>
                {loading ? "Loading…" : currentLimits.label + " Plan"}
              </span>
              <span style={{
                fontSize: 11, fontWeight: 700, padding: "2px 9px", borderRadius: 99,
                background: status === "past_due" ? "rgba(239,68,68,0.12)" : "rgba(0,212,255,0.12)",
                border: status === "past_due" ? "1px solid rgba(239,68,68,0.3)" : "1px solid rgba(0,212,255,0.25)",
                color: status === "past_due" ? "#f87171" : "#00D4FF",
              }}>
                {status === "past_due" ? "Payment Due" : "Active"}
              </span>
            </div>
            {!loading && (
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>
                {currentPlan === "starter"
                  ? `$${currentLimits.priceMonthly}/month`
                  : `$${billing === "annual" ? currentLimits.priceAnnual : currentLimits.priceMonthly}/month`}
                {renewalDate ? ` · Renews ${renewalDate}` : ""}
              </p>
            )}
            {!loading && (
              <div style={{ display: "flex", gap: 24, marginTop: 8 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>
                      Scripts: <strong style={{ color: "#e2e8f0" }}>{scriptsUsed} / {scriptsLimit} used</strong>
                    </span>
                  </div>
                  <div style={{ width: 160, height: 4, borderRadius: 99, background: "rgba(0,212,255,0.08)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      width: `${Math.min((scriptsUsed / scriptsLimit) * 100, 100)}%`,
                      background: scriptsUsed >= scriptsLimit ? "linear-gradient(90deg, #f87171, #ef4444)" : "linear-gradient(90deg, #00D4FF, #0080cc)",
                    }} />
                  </div>
                </div>
              </div>
            )}
          </div>
          <button
            onClick={handleManageSubscription}
            disabled={portalLoading || currentPlan === "starter"}
            style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 18px", borderRadius: 10,
              border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)",
              color: currentPlan === "starter" ? "#475569" : "#94a3b8",
              fontSize: 13, cursor: (portalLoading || currentPlan === "starter") ? "not-allowed" : "pointer",
              opacity: (portalLoading || currentPlan === "starter") ? 0.6 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={e => { if (!portalLoading && currentPlan !== "starter") (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.18)"; }}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.08)"}
            title={currentPlan === "starter" ? "Upgrade to access the billing portal" : "Manage your Stripe subscription"}
          >
            {portalLoading
              ? <><Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> Opening…</>
              : <><ExternalLink size={13} /> Manage Subscription</>}
          </button>
        </div>

        {/* Toggle */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: "#fff", marginBottom: 16, letterSpacing: "-0.5px" }}>
            {currentPlan === "starter" ? "Upgrade Your Plan" : "Change Your Plan"}
          </h2>
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
                {b === "annual" && (
                  <span style={{ fontSize: 10, padding: "1px 7px", borderRadius: 99, background: "rgba(52,211,153,0.15)", color: "#34d399", fontWeight: 700 }}>
                    Save 20%
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Plans grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 18, marginBottom: 40 }}>
          {plans.map((p) => {
            const limits = PLAN_LIMITS[p.id];
            const isCurrent = currentPlan === p.id;
            const isLoading = loadingPlan === p.id;
            const price = billing === "annual" ? limits.priceAnnual : limits.priceMonthly;

            return (
              <div key={p.id} style={{
                borderRadius: 18, overflow: "hidden", position: "relative",
                background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
                border: `1px solid ${isCurrent ? p.accentColor + "55" : p.borderColor}`,
                boxShadow: isCurrent ? `0 0 30px ${p.glowColor}` : "none",
              }}>
                <div style={{
                  position: "absolute", inset: 0, pointerEvents: "none",
                  background: `radial-gradient(ellipse at 50% 0%, ${p.glowColor}, transparent 70%)`,
                }} />

                {(p.tag || isCurrent) && (
                  <div style={{ position: "absolute", top: 16, right: 16 }}>
                    <span style={{
                      fontSize: 10, fontWeight: 800, padding: "3px 10px", borderRadius: 99,
                      background: isCurrent
                        ? "rgba(52,211,153,0.15)"
                        : p.id === "elite" ? "rgba(250,204,21,0.15)" : "rgba(0,212,255,0.15)",
                      color: isCurrent ? "#34d399"
                        : p.id === "elite" ? "#facc15" : "#00D4FF",
                      border: `1px solid ${isCurrent ? "rgba(52,211,153,0.3)" : p.id === "elite" ? "rgba(250,204,21,0.3)" : "rgba(0,212,255,0.3)"}`,
                    }}>
                      {isCurrent ? "Current Plan" : p.tag}
                    </span>
                  </div>
                )}

                <div style={{ padding: "26px 24px", position: "relative" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
                    {p.id === "starter" && <Zap size={16} color="#00D4FF" />}
                    {p.id === "pro"     && <Star size={16} color="#00D4FF" fill="#00D4FF" />}
                    {p.id === "elite"   && <Crown size={16} color="#facc15" fill="#facc15" />}
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>{p.name}</span>
                  </div>

                  <div style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 38, fontWeight: 800, color: "#fff", letterSpacing: "-1px" }}>
                      ${price.toFixed(2)}
                    </span>
                    <span style={{ fontSize: 13, color: "#94a3b8" }}>/mo</span>
                  </div>
                  <p style={{ fontSize: 12, color: p.accentColor, fontWeight: 600, marginBottom: 20 }}>
                    {limits.scripts} scripts/month
                    {billing === "annual" && <span style={{ marginLeft: 6, color: "#34d399" }}>· billed annually</span>}
                  </p>

                  {isCurrent ? (
                    <button disabled style={{
                      width: "100%", padding: "11px", borderRadius: 11,
                      background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)",
                      color: "#34d399", fontSize: 13, fontWeight: 700, cursor: "not-allowed",
                    }}>
                      ✓ Current Plan
                    </button>
                  ) : (
                    <button
                      onClick={() => handleUpgrade(p.id as "starter" | "pro" | "elite")}
                      disabled={!!loadingPlan}
                      style={{
                        width: "100%", padding: "11px", borderRadius: 11,
                        background: p.id === "elite"
                          ? "linear-gradient(135deg, #facc15, #f59e0b)"
                          : "linear-gradient(135deg, #00D4FF, #0080cc)",
                        color: p.id === "elite" ? "#1a0a00" : "#04080F",
                        fontSize: 13, fontWeight: 800, cursor: loadingPlan ? "not-allowed" : "pointer",
                        border: "none", opacity: loadingPlan ? 0.7 : 1,
                        display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                        boxShadow: p.id === "elite" ? "0 0 20px rgba(250,204,21,0.25)" : "0 0 20px rgba(0,212,255,0.25)",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={e => { if (!loadingPlan) (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1.1)"; }}
                      onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.filter = "brightness(1)"}
                    >
                      {isLoading
                        ? <><Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> Redirecting…</>
                        : <>{p.id === "starter" ? "Get Started" : currentPlan !== "starter" ? `Switch to ${p.name}` : `Upgrade to ${p.name}`} <ArrowRight size={14} /></>}
                    </button>
                  )}

                  <ul style={{ marginTop: 22, listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: 10 }}>
                    {p.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 9 }}>
                        <CheckCircle2 size={13} color={p.accentColor} style={{ flexShrink: 0, marginTop: 1 }} />
                        <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.4 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
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
            <CreditCard size={28} color="#64748b" style={{ margin: "0 auto 12px" }} />
            <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
              {currentPlan === "starter" ? "No invoices yet" : "View invoices in the billing portal"}
            </p>
            <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>
              {currentPlan !== "starter"
                ? <button onClick={handleManageSubscription} style={{ background: "none", border: "none", color: "#00D4FF", fontSize: 11, cursor: "pointer", textDecoration: "underline" }}>Open billing portal →</button>
                : "Your billing history will appear here after upgrading"}
            </p>
          </div>
        </div>

        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}
