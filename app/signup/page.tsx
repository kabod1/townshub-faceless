"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (signUpError) {
        // "User already registered" → nudge them to login
        if (signUpError.message.toLowerCase().includes("already")) {
          setError("An account with this email already exists. Try signing in instead.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      // If Supabase returned a session immediately → email confirmation OFF → go to dashboard
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // No session → email confirmation is required → show "check your email" screen
      setEmailSent(true);
      setLoading(false);

    } catch (err) {
      console.error("Signup error:", err);
      setError("Connection failed. Please check your internet and try again.");
      setLoading(false);
    }
  };

  const inputStyle = (filled: boolean) => ({
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.9)",
    border: `1px solid ${filled ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "12px", padding: "13px 16px",
    fontSize: "14px", color: "#E8F4FF",
    outline: "none", transition: "border-color 0.2s",
  });

  // ── Email confirmation sent screen ─────────────────────────
  if (emailSent) {
    return (
      <div style={{
        minHeight: "100vh", background: "#060B14",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: "400px", textAlign: "center" }}>
          <div style={{
            width: 72, height: 72, borderRadius: "50%",
            background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.3)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", fontSize: 32,
          }}>📧</div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.4px" }}>
            Check your email
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 8px", lineHeight: 1.6 }}>
            We sent a confirmation link to
          </p>
          <p style={{ fontSize: 15, fontWeight: 700, color: "#00D4FF", margin: "0 0 28px" }}>{email}</p>
          <div style={{
            background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
            borderRadius: 14, padding: "16px 20px", marginBottom: 24, textAlign: "left",
          }}>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.8 }}>
              <strong style={{ color: "#e2e8f0" }}>1.</strong> Open the email from Townshub<br />
              <strong style={{ color: "#e2e8f0" }}>2.</strong> Click the confirmation link<br />
              <strong style={{ color: "#e2e8f0" }}>3.</strong> You&apos;ll be signed in automatically
            </p>
          </div>
          <Link href="/login" style={{
            display: "block", padding: "13px", borderRadius: 12,
            background: "linear-gradient(135deg, #00D4FF, #0070BB)",
            color: "#04080F", fontSize: 14, fontWeight: 700, textDecoration: "none",
            marginBottom: 14,
          }}>
            Go to Sign In →
          </Link>
          <p style={{ fontSize: 12, color: "#334155" }}>
            Didn&apos;t receive it? Check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  // ── Signup form ────────────────────────────────────────────
  return (
    <div style={{
      minHeight: "100vh", background: "#060B14",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "24px 16px", position: "relative", overflow: "hidden",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    }}>
      <div style={{
        position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
        width: "460px", height: "260px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(0,212,255,0.16), transparent)",
        filter: "blur(60px)", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-60px", right: "20%",
        width: "240px", height: "140px", borderRadius: "50%",
        background: "radial-gradient(ellipse, rgba(120,80,220,0.10), transparent)",
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
            Join <span style={{ color: "#00D4FF" }}>Townshub</span>
          </div>
          <div style={{ fontSize: "13px", color: "#64748b", marginTop: "4px" }}>
            Start your faceless YouTube journey — free
          </div>
        </div>

        {/* Card */}
        <div style={{
          background: "linear-gradient(135deg, rgba(20,30,50,0.98), rgba(10,18,34,1))",
          border: "1px solid rgba(0,212,255,0.14)", borderRadius: "20px", padding: "32px",
          boxShadow: "0 32px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.03)",
        }}>

          {error && (
            <div style={{
              display: "flex", alignItems: "flex-start", gap: "10px",
              padding: "12px 14px", borderRadius: "12px", marginBottom: "20px",
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.22)",
            }}>
              <span style={{ color: "#F87171", fontSize: "15px", flexShrink: 0 }}>✕</span>
              <p style={{ fontSize: "13px", color: "#F87171", margin: 0, lineHeight: 1.4 }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px",
              }}>Full Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" autoComplete="name" required
                style={inputStyle(!!name)}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                onBlur={e => e.currentTarget.style.borderColor = name ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px",
              }}>Email</label>
              <input
                type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email" required
                style={inputStyle(!!email)}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                onBlur={e => e.currentTarget.style.borderColor = email ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={{
                display: "block", fontSize: "11px", fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "8px",
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" autoComplete="new-password" required minLength={8}
                  style={{ ...inputStyle(!!password), paddingRight: "44px" }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                  onBlur={e => e.currentTarget.style.borderColor = password ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: "14px", top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: "16px", color: "#475569",
                }}>{showPw ? "🙈" : "👁"}</button>
              </div>
              {password && password.length < 8 && (
                <p style={{ fontSize: 11, color: "#f87171", marginTop: 6 }}>Password must be at least 8 characters</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || password.length < 8}
              style={{
                width: "100%", padding: "14px",
                background: loading ? "rgba(0,212,255,0.35)" : "linear-gradient(135deg, #00D4FF, #0070BB)",
                border: "none", borderRadius: "12px",
                fontSize: "14px", fontWeight: 700, color: "#04080F",
                cursor: loading || !name || !email || password.length < 8 ? "not-allowed" : "pointer",
                opacity: !name || !email || password.length < 8 ? 0.55 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: "0 0 24px rgba(0,212,255,0.28)",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: "14px", height: "14px", border: "2px solid rgba(4,8,15,0.3)",
                    borderTop: "2px solid #04080F", borderRadius: "50%",
                    animation: "th-spin 0.7s linear infinite", display: "inline-block",
                  }} />
                  Creating account…
                </>
              ) : "Create Free Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#475569", marginTop: "20px" }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#00D4FF", fontWeight: 600, textDecoration: "none" }}>
              Sign in
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
