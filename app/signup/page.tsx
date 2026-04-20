"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [showPw, setShowPw]       = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [emailSent, setEmailSent] = useState(false);

  const pwOk = password.length >= 8;

  const handleSubmit = async (e: { preventDefault(): void }) => {
    e.preventDefault();
    if (!name || !email || !pwOk) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: name },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (signUpError) {
        const m = signUpError.message.toLowerCase();
        if (m.includes("already") || m.includes("registered") || m.includes("exists")) {
          setError("An account with this email already exists. Try signing in instead.");
        } else {
          setError(signUpError.message);
        }
        setLoading(false);
        return;
      }

      // Session returned immediately = email confirmation is OFF → go straight to dashboard
      if (data.session) {
        router.push("/dashboard");
        router.refresh();
        return;
      }

      // No session = email confirmation required → show check-your-email screen
      setEmailSent(true);
      setLoading(false);

    } catch (err) {
      console.error("Signup error:", err);
      setError("Connection failed. Please check your internet and try again.");
      setLoading(false);
    }
  };

  const inp = (filled: boolean, extra?: string) => ({
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.9)",
    border: `1px solid ${filled ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: "12px", padding: extra ?? "13px 16px",
    fontSize: "14px", color: "#E8F4FF",
    outline: "none", transition: "border-color 0.2s",
  });

  // ── Check-your-email screen ────────────────────────────────
  if (emailSent) {
    return (
      <div style={{
        minHeight: "100vh", background: "#060B14",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px 16px",
        fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}>
        <div style={{ width: "100%", maxWidth: "420px", textAlign: "center" }}>

          <div style={{
            width: 80, height: 80, borderRadius: "50%",
            background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.25)",
            display: "flex", alignItems: "center", justifyContent: "center",
            margin: "0 auto 24px", fontSize: 36,
          }}>📧</div>

          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.4px" }}>
            Check your email
          </h1>
          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 6px", lineHeight: 1.6 }}>
            We sent a confirmation link to:
          </p>
          <p style={{ fontSize: 16, fontWeight: 700, color: "#00D4FF", margin: "0 0 32px" }}>{email}</p>

          <div style={{
            background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.12)",
            borderRadius: 14, padding: "18px 20px", marginBottom: 28, textAlign: "left",
          }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.08em" }}>
              Next steps
            </p>
            {[
              "Open the email from Townshub",
              "Click the confirmation link",
              "You'll be signed in and taken to your dashboard",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, marginBottom: i < 2 ? 8 : 0 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 800, color: "#00D4FF",
                }}>{i + 1}</div>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{step}</p>
              </div>
            ))}
          </div>

          <Link href="/login" style={{
            display: "block", padding: "13px", borderRadius: 12,
            background: "linear-gradient(135deg, #00D4FF, #0070BB)",
            color: "#04080F", fontSize: 14, fontWeight: 700, textDecoration: "none",
            marginBottom: 14,
          }}>
            Go to Sign In
          </Link>

          <p style={{ fontSize: 12, color: "#334155" }}>
            Didn&apos;t get it? Check your spam folder or{" "}
            <button
              onClick={() => { setEmailSent(false); setEmail(""); }}
              style={{ background: "none", border: "none", color: "#00D4FF", cursor: "pointer", fontSize: 12, fontWeight: 600, padding: 0 }}
            >try a different email</button>.
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
        <div style={{ textAlign: "center", marginBottom: 32 }}>
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
            Join <span style={{ color: "#00D4FF" }}>Townshub</span>
          </div>
          <div style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
            Start your faceless YouTube journey — free
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
              <span style={{ color: "#F87171", fontSize: 15, flexShrink: 0 }}>✕</span>
              <div>
                <p style={{ fontSize: 13, color: "#F87171", margin: "0 0 4px", lineHeight: 1.4 }}>{error}</p>
                {error.includes("already exists") && (
                  <Link href="/login" style={{ fontSize: 12, color: "#00D4FF", textDecoration: "none", fontWeight: 600 }}>
                    Sign in instead →
                  </Link>
                )}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8,
              }}>Full Name</label>
              <input
                type="text" value={name} onChange={e => setName(e.target.value)}
                placeholder="Your name" autoComplete="name" required
                style={inp(!!name)}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                onBlur={e => e.currentTarget.style.borderColor = name ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
              />
            </div>

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
            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontSize: 11, fontWeight: 700,
                color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 8,
              }}>Password</label>
              <div style={{ position: "relative" }}>
                <input
                  type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" autoComplete="new-password" required
                  style={inp(!!password, "13px 44px 13px 16px")}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.55)"}
                  onBlur={e => e.currentTarget.style.borderColor = password ? "rgba(0,212,255,0.35)" : "rgba(255,255,255,0.1)"}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{
                  position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 16, color: "#475569",
                }}>{showPw ? "🙈" : "👁"}</button>
              </div>
              {password.length > 0 && !pwOk && (
                <p style={{ fontSize: 11, color: "#f87171", margin: "6px 0 0" }}>
                  Password must be at least 8 characters
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !name || !email || !pwOk}
              style={{
                width: "100%", padding: "14px", border: "none", borderRadius: 12,
                background: loading ? "rgba(0,212,255,0.35)" : "linear-gradient(135deg, #00D4FF, #0070BB)",
                fontSize: 14, fontWeight: 700, color: "#04080F",
                cursor: loading || !name || !email || !pwOk ? "not-allowed" : "pointer",
                opacity: !name || !email || !pwOk ? 0.55 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                boxShadow: "0 0 24px rgba(0,212,255,0.28)", transition: "opacity 0.15s",
              }}
            >
              {loading ? (
                <>
                  <span style={{
                    width: 14, height: 14, border: "2px solid rgba(4,8,15,0.3)",
                    borderTop: "2px solid #04080F", borderRadius: "50%",
                    animation: "th-spin 0.7s linear infinite", display: "inline-block",
                  }} />
                  Creating account…
                </>
              ) : "Create Free Account →"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: 13, color: "#475569", marginTop: 20 }}>
            Already have an account?{" "}
            <Link href="/login" style={{ color: "#00D4FF", fontWeight: 600, textDecoration: "none" }}>
              Sign in
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
