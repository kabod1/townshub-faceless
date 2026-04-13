"use client";

import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/dashboard";

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid credentials");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push(from), 500);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#080D1A" }}>

      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-15"
          style={{ background: "radial-gradient(ellipse,#00D4FF,transparent)", filter: "blur(80px)" }} />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[200px] rounded-full opacity-10"
          style={{ background: "radial-gradient(ellipse,#A78BFA,transparent)", filter: "blur(60px)" }} />
        <div className="absolute inset-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(rgba(0,212,255,1) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
      </div>

      <div className="relative w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", boxShadow: "0 0 30px rgba(0,212,255,0.5)" }}>
            <Zap size={22} fill="#04080F" className="text-[#04080F]" />
          </div>
          <p className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
            Townshub <span style={{ color: "#00D4FF" }}>Faceless</span>
          </p>
          <p className="text-sm text-slate-500 mt-1">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg,rgba(22,32,53,0.95),rgba(15,24,41,1))",
            border: "1px solid rgba(0,212,255,0.15)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          }}>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl mb-5"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={14} style={{ color: "#F87171", flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "#F87171" }}>{error}</p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl mb-5"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <CheckCircle2 size={14} style={{ color: "#34D399", flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "#34D399" }}>Signing you in…</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#94A3B8", fontFamily: "var(--font-syne)" }}>
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="townshub"
                autoComplete="username"
                required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: "rgba(15,24,41,0.8)",
                  border: "1px solid rgba(0,212,255,0.15)",
                  color: "#E8F0FF",
                }}
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)"}
              />
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#94A3B8", fontFamily: "var(--font-syne)" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all"
                  style={{
                    background: "rgba(15,24,41,0.8)",
                    border: "1px solid rgba(0,212,255,0.15)",
                    color: "#E8F0FF",
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)"}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: "#475569" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "#94A3B8"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || success || !username || !password}
              className="w-full py-3 rounded-xl text-sm font-bold mt-2 transition-all flex items-center justify-center gap-2"
              style={{
                background: loading || success ? "rgba(0,212,255,0.4)" : "linear-gradient(135deg,#00D4FF,#0090cc)",
                color: "#04080F",
                fontFamily: "var(--font-syne)",
                boxShadow: "0 0 20px rgba(0,212,255,0.3)",
                opacity: (!username || !password) ? 0.5 : 1,
                cursor: (!username || !password) ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Signing in…
                </>
              ) : success ? "Redirecting…" : "Sign In"}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-600 mt-6">
          © 2026 Townshub. All rights reserved.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen" style={{ background: "#080D1A" }} />}>
      <LoginForm />
    </Suspense>
  );
}
