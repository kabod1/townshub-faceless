"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Zap, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name },
      },
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    // Auto sign in after signup
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
    if (!signInError) {
      router.push("/dashboard");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#080D1A" }}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[250px] rounded-full opacity-8"
          style={{ background: "radial-gradient(ellipse,#00D4FF,transparent)", filter: "blur(100px)" }} />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", boxShadow: "0 0 30px rgba(0,212,255,0.5)" }}>
            <Zap size={22} fill="#04080F" className="text-[#04080F]" />
          </div>
          <p className="text-xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
            Join <span style={{ color: "#00D4FF" }}>Townshub</span>
          </p>
          <p className="text-sm text-slate-500 mt-1">Start your faceless YouTube journey</p>
        </div>

        <div className="rounded-2xl p-8"
          style={{
            background: "linear-gradient(135deg,rgba(22,32,53,0.95),rgba(15,24,41,1))",
            border: "1px solid rgba(0,212,255,0.15)",
            boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
          }}>

          {error && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl mb-5"
              style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={14} style={{ color: "#F87171", flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "#F87171" }}>{error}</p>
            </div>
          )}

          {success && (
            <div className="flex items-center gap-2.5 p-3 rounded-xl mb-5"
              style={{ background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
              <CheckCircle2 size={14} style={{ color: "#34D399", flexShrink: 0 }} />
              <p className="text-sm" style={{ color: "#34D399" }}>Account created! Taking you in…</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#94A3B8", fontFamily: "var(--font-syne)" }}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                placeholder="Your name" autoComplete="name" required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "rgba(15,24,41,0.8)", border: "1px solid rgba(0,212,255,0.15)", color: "#E8F0FF" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)"} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#94A3B8", fontFamily: "var(--font-syne)" }}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com" autoComplete="email" required
                className="w-full rounded-xl px-4 py-3 text-sm outline-none transition-all"
                style={{ background: "rgba(15,24,41,0.8)", border: "1px solid rgba(0,212,255,0.15)", color: "#E8F0FF" }}
                onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"}
                onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)"} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-widest"
                style={{ color: "#94A3B8", fontFamily: "var(--font-syne)" }}>Password</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min. 8 characters" autoComplete="new-password" required minLength={8}
                  className="w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none transition-all"
                  style={{ background: "rgba(15,24,41,0.8)", border: "1px solid rgba(0,212,255,0.15)", color: "#E8F0FF" }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.5)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)"} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#475569" }}>
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading || success || !email || !password || !name}
              className="w-full py-3 rounded-xl text-sm font-bold mt-2 transition-all flex items-center justify-center gap-2"
              style={{
                background: loading || success ? "rgba(0,212,255,0.4)" : "linear-gradient(135deg,#00D4FF,#0090cc)",
                color: "#04080F",
                fontFamily: "var(--font-syne)",
                boxShadow: "0 0 20px rgba(0,212,255,0.3)",
              }}>
              {loading ? (
                <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>Creating account…</>
              ) : success ? "Setting up…" : "Create Free Account"}
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-cyan-400 hover:text-cyan-300 transition-colors font-semibold">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-700 mt-6">© 2026 Townshub. All rights reserved.</p>
      </div>
    </div>
  );
}
