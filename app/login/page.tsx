"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function friendlyError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("invalid login") || m.includes("invalid credentials") || m.includes("wrong"))
    return "Wrong email or password. Please try again.";
  if (m.includes("email not confirmed"))
    return "Please confirm your email before signing in. Check your inbox.";
  if (m.includes("too many"))
    return "Too many attempts. Please wait a few minutes and try again.";
  if (m.includes("network") || m.includes("fetch"))
    return "Connection failed. Check your internet and try again.";
  return msg;
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";
  const urlError = searchParams.get("error");

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(
    urlError === "confirmation_failed" ? "Email confirmation failed. Please try signing up again." : ""
  );
  const [success, setSuccess]   = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

      if (authError) {
        setError(friendlyError(authError.message));
        setLoading(false);
        return;
      }

      setSuccess(true);
      router.push(from);
      router.refresh();
    } catch {
      setError("Connection failed. Check your internet and try again.");
      setLoading(false);
    }
  };

  const inp = (filled: boolean, extraPadding?: string) => ({
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.9)",
    border: `1px solid ${filled ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "12px",
    padding: extraPadding ?? "13px 16px",
    fontSize: "14px", color: "#E8F4FF",
    outline: "none", transition: "border-color 0.2s",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#060B14",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px", position: "relative", overflow: "hidden",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Glows */}
      <div style={{
        position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
        width: "480px", height: "280px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,212,255,0.18), transparent)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", right: "15%",
        width: "260px", height: "160px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(120,80,220,0.12), transparent)",
        filter: "blur(50px)", pointerEvents: "none",
      }} />

      <div style={{ position: "relative", width: "100%", maxWidth: "400px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: 56, height: 56, borderRadius: 14,
            background: "#fff", border: "2px solid #0D2A60",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 4px 24px rgba(0,212,255,0.2)",
          }}>
            <svg viewBox="0 0 64 64" width="38" height="38" fill="none">
              <rect x="3"  y="3"  width="34" height="11" fill="#0D2A60"/>
              <rect x="33" y="3"  width="5"  height="11" fill="#0D2A60"/>
              <rect x="3"  y="14" width="12" height="47" fill="#0D2A60"/>
              <rect x="33" y="18" width="9"  height="43" fill="#0D2A60"/>
              <rect x="33" y="30" width="28" height="10" fill="#0D2A60"/>
              <rect x="52" y="3"  width="9"  height="58" fill="#0D2A60"/>
            </svg>
          </div>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
            Townshub <span style={{ color: "#00D4FF" }}>Faceless</span>
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            Sign in to your workspace
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(20,30,50,0.98), rgba(10,18,34,1))",
          border: "1px solid rgba(0,212,255,0.14)", borderRadius: 20, padding: 32,
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
        }}>

          {error && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: 10,
              padding: "12px 14px", borderRadius: 12, marginBottom: 20,
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)",
            }}>
              <span style={{ color: "#F87171", flexShrink: 0, fontSize: 15 }}>✕</span>
              <p style={{ fontSize: 13, color: "#F87171", margin: 0, lineHeight: 1.4 }}>{error}</p>
            </div>
          )}

          {success && (
            <div style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "12px 14px", borderRadius: 12, marginBottom: 20,
              background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.22)",
            }}>
              <span style={{ color: "#34D399", fontSize: 15 }}>✓</span>
              <p style={{ fontSize: 13, color: "#34D399", margin: 0 }}>Signing you in…</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8,
              }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email" required
                style={inp(!!email)}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                onBlur={e => e.currentTarget.style.borderColor = email ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                <label style={{
                  fontSize: 11, fontWeight: 700,
                  color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase",
                }}>Password</label>
                <Link href="/forgot-password" style={{ fontSize: 11, color: "#00D4FF", textDecoration: "none", fontWeight: 600 }}>
                  Forgot password?
                </Link>
              </div>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Your password" autoComplete="current-password" required
                  style={inp(!!password, "13px 44px 13px 16px")}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                  onBlur={e => e.currentTarget.style.borderColor = password ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#475569", padding: 2,
                }}>{showPw ? "🙈" : "👁"}</button>
              </div>
            </div>

            <div style={{ marginBottom: 24 }} />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success || !email || !password}
              style={{
                width: "100%", padding: "14px", border: "none", borderRadius: 12,
                background: loading || success ? "rgba(0,212,255,0.35)" : "linear-gradient(135deg, #00D4FF, #0070BB)",
                fontSize: 14, fontWeight: 700, color: "#04080F",
                cursor: loading || success || !email || !password ? "not-allowed" : "pointer",
                opacity: !email || !password ? 0.55 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 0 24px rgba(0,212,255,0.28)", transition: "opacity 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(4,8,15,0.3)",
                    borderTop: "2px solid #04080F", borderRadius: "50%",
                    animation: "th-spin 0.7s linear infinite", display: "inline-block",
                  }} />
                  Signing in…
                </>
              ) : success ? "Redirecting…" : "Sign In →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#475569", marginTop: 20 }}>
            No account?{" "}
            <Link href="/signup" style={{ color: "#00D4FF", fontWeight: 600, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: 11, color: "#1e293b", marginTop: 20 }}>
          © 2026 Townshub. All rights reserved.
        </p>
      </div>

      <style>{`@keyframes th-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#060B14" }} />}>
      <LoginForm />
    </Suspense>
  );
}
