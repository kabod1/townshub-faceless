"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    router.push(from);
    router.refresh();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#060B14",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px 16px",
      position: "relative",
      overflow: "hidden",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      {/* Background glow */}
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
            width: "52px", height: "52px", borderRadius: "14px",
            background: "linear-gradient(135deg, #00D4FF, #0070BB)",
            boxShadow: "0 0 32px rgba(0,212,255,0.45)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 14px", fontSize: "22px",
          }}>⚡</div>
          <div style={{ fontSize: "22px", fontWeight: 800, color: "#fff", letterSpacing: "-0.3px" }}>
            Townshub <span style={{ color: "#00D4FF" }}>Faceless</span>
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
            Sign in to your workspace
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(20,30,50,0.98), rgba(10,18,34,1))",
          border: "1px solid rgba(0,212,255,0.14)",
          borderRadius: "20px",
          padding: "32px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
        }}>

          {/* Error */}
          {error && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              padding: "12px 14px", borderRadius: "12px", marginBottom: "20px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)",
            }}>
              <span style={{ color: "#F87171", flexShrink: 0, fontSize: "15px" }}>✕</span>
              <p style={{ fontSize: "13px", color: "#F87171", margin: 0, lineHeight: 1.4 }}>{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 14px", borderRadius: "12px", marginBottom: "20px",
              background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.22)",
            }}>
              <span style={{ color: "#34D399", fontSize: "15px" }}>✓</span>
              <p style={{ fontSize: "13px", color: "#34D399", margin: 0 }}>Signing you in…</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: "8px",
              }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
                style={{
                  width: "100%", boxSizing: "border-box",
                  background: "rgba(8,13,26,0.9)",
                  border: `1px solid ${email ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: "12px", padding: "13px 16px",
                  fontSize: "14px", color: "#E8F4FF",
                  outline: "none", transition: "border-color 0.2s",
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                onBlur={e => e.currentTarget.style.borderColor = email ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
              />
            </div>

            {/* Password */}
            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase",
                marginBottom: "8px",
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Your password"
                  autoComplete="current-password"
                  required
                  style={{
                    width: "100%", boxSizing: "border-box",
                    background: "rgba(8,13,26,0.9)",
                    border: `1px solid ${password ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}`,
                    borderRadius: "12px", padding: "13px 44px 13px 16px",
                    fontSize: "14px", color: "#E8F4FF",
                    outline: "none", transition: "border-color 0.2s",
                  }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                  onBlur={e => e.currentTarget.style.borderColor = password ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  style={{
                    position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer",
                    fontSize: "16px", color: "#475569", padding: "2px",
                  }}
                >{showPw ? "🙈" : "👁"}</button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success || !email || !password}
              style={{
                width: "100%", padding: "14px",
                background: loading || success ? "rgba(0,212,255,0.35)"
                  : "linear-gradient(135deg, #00D4FF, #0070BB)",
                border: "none", borderRadius: "12px",
                fontSize: "14px", fontWeight: 700, color: "#04080F",
                cursor: loading || success || !email || !password ? "not-allowed" : "pointer",
                opacity: !email || !password ? 0.55 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: "0 0 24px rgba(0,212,255,0.28)",
                transition: "opacity 0.2s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "14px", height: "14px", border: "2px solid rgba(4,8,15,0.3)",
                    borderTop: "2px solid #04080F", borderRadius: "50%",
                    animation: "th-spin 0.7s linear infinite", display: "inline-block",
                  }} />
                  Signing in…
                </>
              ) : success ? "Redirecting…" : "Sign In"}
            </button>
          </form>

          {/* Footer */}
          <p style={{ textAlign: "center", fontSize: "13px", color: "#475569", marginTop: "20px" }}>
            No account?{" "}
            <Link href="/signup" style={{ color: "#00D4FF", fontWeight: 600, textDecoration: "none" }}>
              Create one free
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", color: "#1e293b", marginTop: "20px" }}>
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
