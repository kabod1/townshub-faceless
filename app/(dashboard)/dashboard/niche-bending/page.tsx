"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Zap, Wand2, TrendingUp, DollarSign, Users,
  AlertCircle, RefreshCw, Copy, Check, Lightbulb,
  Target, BarChart3, Sparkles,
} from "lucide-react";

interface BlendResult {
  blendedNicheName: string;
  tagline: string;
  opportunityScore: number;
  opportunity: string;
  marketSize: string;
  competitionLevel: string;
  avgRPM: string;
  contentIdeas: string[];
  whyItWorks: string;
  uniqueAngle: string;
  channelPersona: string;
  monetisationPaths: string[];
  topKeywords: string[];
  warnings: string | null;
  exampleTitles: string[];
}

const OPPORTUNITY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  Low:      { color: "#94a3b8", bg: "rgba(148,163,184,0.1)",  border: "rgba(148,163,184,0.2)" },
  Medium:   { color: "#facc15", bg: "rgba(250,204,21,0.1)",   border: "rgba(250,204,21,0.2)" },
  High:     { color: "#34d399", bg: "rgba(52,211,153,0.1)",   border: "rgba(52,211,153,0.2)" },
  Explosive:{ color: "#ff6b35", bg: "rgba(255,107,53,0.12)",  border: "rgba(255,107,53,0.25)" },
};

const COMP_COLORS: Record<string, { color: string }> = {
  Low:    { color: "#34d399" },
  Medium: { color: "#facc15" },
  High:   { color: "#f87171" },
};

const EXAMPLE_BLENDS = [
  { a: "Personal Finance", b: "Gaming" },
  { a: "True Crime", b: "History" },
  { a: "Fitness", b: "Minimalism" },
  { a: "Cooking", b: "Science" },
  { a: "Travel", b: "Budgeting" },
];

const S = {
  card: {
    borderRadius: 16, overflow: "hidden" as const,
    background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: 16,
  },
  input: {
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 13,
    outline: "none", transition: "border-color 0.15s",
  },
  label: {
    fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em",
    textTransform: "uppercase" as const, display: "block", marginBottom: 7,
  },
};

export default function NicheBendingPage() {
  const [niche1, setNiche1] = useState("");
  const [niche2, setNiche2] = useState("");
  const [audience, setAudience] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [result, setResult] = useState<BlendResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const STEPS = [
    "Analysing niche overlap…",
    "Mapping audience crossover…",
    "Identifying content gaps…",
    "Calculating market size…",
    "Generating opportunity report…",
  ];

  const handleBlend = async () => {
    if (!niche1.trim() || !niche2.trim()) return;
    setLoading(true); setError(null); setResult(null); setLoadingStep(0);
    const interval = setInterval(() => setLoadingStep(s => Math.min(s + 1, STEPS.length - 1)), 2200);
    try {
      const res = await fetch("/api/niche-bending", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche1: niche1.trim(), niche2: niche2.trim(), targetAudience: audience.trim() }),
      });
      clearInterval(interval);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(err.error || "Failed to analyse blend");
      }
      const json = await res.json();
      setResult(json.data);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  const opp = result ? (OPPORTUNITY_COLORS[result.opportunity] || OPPORTUNITY_COLORS.Medium) : null;
  const comp = result ? (COMP_COLORS[result.competitionLevel] || COMP_COLORS.Medium) : null;

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <style>{`@keyframes nb-spin { to { transform: rotate(360deg); } }`}</style>
      <Topbar title="Niche Bending" subtitle="Combine two niches to discover blue-ocean YouTube opportunities" />

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Intro */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, padding: "18px 22px",
          borderRadius: 14, marginBottom: 28,
          background: "linear-gradient(135deg, rgba(167,139,250,0.07), rgba(124,58,237,0.03))",
          border: "1px solid rgba(167,139,250,0.14)",
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <Zap size={20} color="#a78bfa" />
          </div>
          <div>
            <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: "0 0 2px" }}>Blend two niches. Find untapped opportunities.</p>
            <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Cross-niche channels often dominate because they face no direct competition. Enter two topics and discover the gap.</p>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "360px 1fr", gap: 24, alignItems: "flex-start" }}>

          {/* Input panel */}
          <div>
            <div style={S.card}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Wand2 size={14} color="#a78bfa" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Configure Blend</span>
                </div>
              </div>
              <div style={{ padding: "20px" }}>
                <div style={{ marginBottom: 14 }}>
                  <label style={S.label}>Niche 1 — Primary</label>
                  <input
                    value={niche1}
                    onChange={e => setNiche1(e.target.value)}
                    placeholder="e.g. Personal Finance"
                    style={S.input}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
                  />
                </div>

                {/* Plus connector */}
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                  <div style={{ width: 30, height: 30, borderRadius: "50%", background: "rgba(167,139,250,0.12)", border: "1px solid rgba(167,139,250,0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <span style={{ fontSize: 14, fontWeight: 800, color: "#a78bfa" }}>+</span>
                  </div>
                  <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.06)" }} />
                </div>

                <div style={{ marginBottom: 14 }}>
                  <label style={S.label}>Niche 2 — Secondary</label>
                  <input
                    value={niche2}
                    onChange={e => setNiche2(e.target.value)}
                    placeholder="e.g. Gaming"
                    style={S.input}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
                  />
                </div>

                <div style={{ marginBottom: 20 }}>
                  <label style={S.label}>Target Audience <span style={{ fontWeight: 400, color: "#64748b" }}>(optional)</span></label>
                  <input
                    value={audience}
                    onChange={e => setAudience(e.target.value)}
                    placeholder="e.g. 18–30 year old men"
                    style={S.input}
                    onFocus={e => e.currentTarget.style.borderColor = "rgba(167,139,250,0.4)"}
                    onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
                  />
                </div>

                <button
                  onClick={handleBlend}
                  disabled={loading || !niche1.trim() || !niche2.trim()}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px", borderRadius: 12, border: "none",
                    background: loading || !niche1.trim() || !niche2.trim()
                      ? "rgba(167,139,250,0.12)"
                      : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                    color: loading || !niche1.trim() || !niche2.trim() ? "#64748b" : "#fff",
                    fontSize: 13, fontWeight: 800,
                    cursor: loading || !niche1.trim() || !niche2.trim() ? "not-allowed" : "pointer",
                  }}
                >
                  {loading
                    ? <><div style={{ width: 14, height: 14, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "nb-spin 0.8s linear infinite" }} />{STEPS[loadingStep]}</>
                    : <><Sparkles size={15} />Analyse Blend</>
                  }
                </button>
              </div>
            </div>

            {/* Examples */}
            <div style={S.card}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#64748b" }}>Try these blends</span>
              </div>
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                {EXAMPLE_BLENDS.map(ex => (
                  <button
                    key={ex.a + ex.b}
                    onClick={() => { setNiche1(ex.a); setNiche2(ex.b); }}
                    style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "9px 12px",
                      borderRadius: 9, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                      cursor: "pointer", textAlign: "left",
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(167,139,250,0.06)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(167,139,250,0.2)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
                  >
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{ex.a}</span>
                    <span style={{ fontSize: 11, color: "#a78bfa", fontWeight: 700 }}>×</span>
                    <span style={{ fontSize: 12, color: "#94a3b8" }}>{ex.b}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results */}
          <div>
            {error && (
              <div style={{ display: "flex", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", marginBottom: 16 }}>
                <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <p style={{ fontSize: 13, fontWeight: 700, color: "#f87171", margin: "0 0 2px" }}>Analysis Failed</p>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{error}</p>
                </div>
              </div>
            )}

            {!result && !loading && !error && (
              <div style={{
                borderRadius: 16, border: "1px solid rgba(255,255,255,0.07)",
                background: "rgba(255,255,255,0.015)", padding: "80px 40px", textAlign: "center",
              }}>
                <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <Zap size={26} color="#a78bfa" />
                </div>
                <p style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>Enter two niches to begin</p>
                <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.6 }}>We&apos;ll analyse the crossover audience, competition gap, RPM potential, and give you 5 ready-to-shoot video ideas.</p>
              </div>
            )}

            {result && opp && comp && (
              <>
                {/* Header card */}
                <div style={{
                  borderRadius: 16, padding: "22px 24px", marginBottom: 16,
                  background: "linear-gradient(135deg, rgba(167,139,250,0.09), rgba(124,58,237,0.04))",
                  border: "1px solid rgba(167,139,250,0.18)",
                }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 12 }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.5px" }}>{result.blendedNicheName}</h2>
                      <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{result.tagline}</p>
                    </div>
                    <button
                      onClick={() => copyText(result.blendedNicheName + " — " + result.tagline, "header")}
                      style={{ padding: 6, borderRadius: 7, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", cursor: "pointer", display: "flex", flexShrink: 0 }}
                    >
                      {copied === "header" ? <Check size={13} color="#34d399" /> : <Copy size={13} />}
                    </button>
                  </div>

                  {/* Stat pills */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 12px", borderRadius: 99, background: opp.bg, border: `1px solid ${opp.border}` }}>
                      <TrendingUp size={11} color={opp.color} />
                      <span style={{ fontSize: 11, fontWeight: 800, color: opp.color }}>{result.opportunity} Opportunity</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)" }}>
                      <Users size={11} color={comp.color} />
                      <span style={{ fontSize: 11, fontWeight: 700, color: comp.color }}>{result.competitionLevel} Competition</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                      <DollarSign size={11} color="#34d399" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#34d399" }}>{result.avgRPM} RPM</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 5, padding: "5px 12px", borderRadius: 99, background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>
                      <BarChart3 size={11} color="#fb923c" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#fb923c" }}>{result.marketSize}</span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div style={{ marginTop: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Opportunity Score</span>
                      <span style={{ fontSize: 13, fontWeight: 900, color: opp.color }}>{result.opportunityScore}/100</span>
                    </div>
                    <div style={{ height: 6, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{
                        height: "100%", borderRadius: 99,
                        background: `linear-gradient(90deg, ${opp.color}66, ${opp.color})`,
                        width: `${result.opportunityScore}%`, transition: "width 1s ease",
                      }} />
                    </div>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {/* Why it works */}
                  <div style={{ ...S.card, marginBottom: 0 }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                      <Target size={13} color="#00D4FF" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>Why This Works</span>
                    </div>
                    <div style={{ padding: "14px 18px" }}>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 0 10px", lineHeight: 1.65 }}>{result.whyItWorks}</p>
                      <div style={{ padding: "10px 12px", borderRadius: 9, background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.1)" }}>
                        <p style={{ fontSize: 11, fontWeight: 700, color: "#00D4FF", margin: "0 0 3px" }}>Unique angle</p>
                        <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.55 }}>{result.uniqueAngle}</p>
                      </div>
                    </div>
                  </div>

                  {/* Channel persona */}
                  <div style={{ ...S.card, marginBottom: 0 }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                      <Users size={13} color="#a78bfa" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>Channel Persona</span>
                    </div>
                    <div style={{ padding: "14px 18px" }}>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.65 }}>{result.channelPersona}</p>
                    </div>
                  </div>
                </div>

                {/* Content ideas */}
                <div style={{ ...S.card, marginBottom: 14 }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <Lightbulb size={13} color="#facc15" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>5 Video Ideas</span>
                    </div>
                    <button
                      onClick={() => copyText(result.contentIdeas.join("\n"), "ideas")}
                      style={{ padding: "4px 10px", borderRadius: 7, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#64748b", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}
                    >
                      {copied === "ideas" ? <Check size={11} color="#34d399" /> : <Copy size={11} />}
                      {copied === "ideas" ? "Copied" : "Copy All"}
                    </button>
                  </div>
                  <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {result.contentIdeas.map((idea, i) => (
                      <div key={i} style={{ display: "flex", gap: 12, padding: "10px 14px", borderRadius: 9, background: "rgba(250,204,21,0.04)", border: "1px solid rgba(250,204,21,0.1)" }}>
                        <span style={{ fontSize: 10, fontWeight: 900, color: "#facc15", marginTop: 1, flexShrink: 0 }}>#{i + 1}</span>
                        <p style={{ fontSize: 12, color: "#e2e8f0", margin: 0, lineHeight: 1.5, flex: 1 }}>{idea}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Example titles */}
                <div style={{ ...S.card, marginBottom: 14 }}>
                  <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>Example Video Titles</span>
                  </div>
                  <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                    {result.exampleTitles?.map((title, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", borderRadius: 8, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <span style={{ fontSize: 10, color: "#475569", flexShrink: 0 }}>{i + 1}</span>
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, flex: 1 }}>&quot;{title}&quot;</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                  {/* Monetisation */}
                  <div style={{ ...S.card, marginBottom: 0 }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                      <DollarSign size={13} color="#34d399" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>Monetisation Paths</span>
                    </div>
                    <div style={{ padding: "12px 18px", display: "flex", flexDirection: "column", gap: 6 }}>
                      {result.monetisationPaths.map((path, i) => (
                        <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                          <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#34d399", marginTop: 5, flexShrink: 0 }} />
                          <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{path}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Keywords */}
                  <div style={{ ...S.card, marginBottom: 0 }}>
                    <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)", display: "flex", alignItems: "center", gap: 8 }}>
                      <BarChart3 size={13} color="#fb923c" />
                      <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>Top Keywords</span>
                    </div>
                    <div style={{ padding: "14px 18px", display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {result.topKeywords.map((kw, i) => (
                        <span key={i} style={{ padding: "4px 10px", borderRadius: 99, fontSize: 11, fontWeight: 600, color: "#fb923c", background: "rgba(251,146,60,0.08)", border: "1px solid rgba(251,146,60,0.2)" }}>{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Warnings */}
                {result.warnings && (
                  <div style={{ display: "flex", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(251,146,60,0.07)", border: "1px solid rgba(251,146,60,0.18)" }}>
                    <AlertCircle size={14} color="#fb923c" style={{ flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ fontSize: 12, fontWeight: 700, color: "#fb923c", margin: "0 0 2px" }}>Things to watch out for</p>
                      <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.55 }}>{result.warnings}</p>
                    </div>
                  </div>
                )}

                {/* Re-run */}
                <div style={{ marginTop: 18, display: "flex", justifyContent: "center" }}>
                  <button
                    onClick={handleBlend}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "9px 20px", borderRadius: 10, border: "1px solid rgba(167,139,250,0.2)", background: "rgba(167,139,250,0.06)", color: "#a78bfa", fontSize: 12, fontWeight: 700, cursor: "pointer" }}
                  >
                    <RefreshCw size={12} /> Re-analyse blend
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
