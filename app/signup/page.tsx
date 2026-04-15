"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setLoading(true);
    setError("");

    try {
      const supabase = createClient();

      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: name } },
      });

      if (signUpError) {
        setError(signUpError.message);
        setLoading(false);
        return;
      }

      // Auto sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (!signInError) {
        setSuccess(true);
        router.push("/dashboard");
        router.refresh();
      } else {
        setError("Account created! Check your email or try signing in.");
        setLoading(false);
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError("Connection failed. Check your internet and try again.");
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
      {/* Background glows */}
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
              background: error.includes("created") ? "rgba(52,211,153,0.08)" : "rgba(239,68,68,0.08)",
              border: `1px solid ${error.includes("created") ? "rgba(52,211,153,0.22)" : "rgba(239,68,68,0.22)"}`,
            }}>
              <span style={{ color: error.includes("created") ? "#34D399" : "#F87171", fontSize: "15px" }}>
                {error.includes("created") ? "✓" : "✕"}
              </span>
              <p style={{ fontSize: "13px", color: error.includes("created") ? "#34D399" : "#F87171", margin: 0, lineHeight: 1.4 }}>{error}</p>
            </div>
          )}

          {success && !error && (
            <div style={{
              display: "flex", alignItems: "center", gap: "10px",
              padding: "12px 14px", borderRadius: "12px", marginBottom: "20px",
              background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.22)",
            }}>
              <span style={{ color: "#34D399", fontSize: "15px" }}>✓</span>
              <p style={{ fontSize: "13px", color: "#34D399", margin: 0 }}>Account created! Taking you in…</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Name */}
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

            {/* Email */}
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

            {/* Password */}
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
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success || !name || !email || !password}
              style={{
                width: "100%", padding: "14px",
                background: loading || success ? "rgba(0,212,255,0.35)"
                  : "linear-gradient(135deg, #00D4FF, #0070BB)",
                border: "none", borderRadius: "12px",
                fontSize: "14px", fontWeight: 700, color: "#04080F",
                cursor: loading || success || !name || !email || !password ? "not-allowed" : "pointer",
                opacity: !name || !email || !password ? 0.55 : 1,
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                boxShadow: "0 0 24px rgba(0,212,255,0.28)",
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
              ) : success ? "Setting up…" : "Create Free Account"}
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
