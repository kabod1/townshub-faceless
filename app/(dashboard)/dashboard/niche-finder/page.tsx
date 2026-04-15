"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Compass, Search, TrendingUp, Users, DollarSign, Play,
  BookmarkPlus, ArrowRight, BarChart3, Eye, Flame,
  RefreshCw, Zap, AlertCircle, Lightbulb
} from "lucide-react";

interface Niche {
  id: string; name: string; category: string;
  competition: "Low" | "Medium" | "High"; potential: number;
  avgViews: string; avgSubs: string; rpm: string; topChannels: number;
  trend: "up" | "stable" | "down"; tags: string[];
  whyNow?: string; contentIdeas?: string[]; saved: boolean;
}

const categories = [
  { value: "all", label: "All Categories" }, { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" }, { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" }, { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health & Fitness" },
];

const STEPS = ["Scanning YouTube trends…","Analysing 12,000+ channels…","Calculating RPM data…","Scoring competition gaps…","Finalising opportunities…"];

const compColor: Record<string, string> = { Low: "#34d399", Medium: "#facc15", High: "#f87171" };
const compBg: Record<string, string> = { Low: "rgba(52,211,153,0.1)", Medium: "rgba(250,204,21,0.1)", High: "rgba(248,113,113,0.1)" };
const compBorder: Record<string, string> = { Low: "rgba(52,211,153,0.2)", Medium: "rgba(250,204,21,0.2)", High: "rgba(248,113,113,0.2)" };

export default function NicheFinderPage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [competition, setCompetition] = useState("all");
  const [expandedNiche, setExpandedNiche] = useState<string | null>(null);

  const handleSearch = async () => {
    setGenerating(true); setError(null); setGeneratingStep(0);
    const interval = setInterval(() => setGeneratingStep((s) => Math.min(s + 1, STEPS.length - 1)), 2000);
    try {
      const res = await fetch("/api/niche-finder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, competition, search, count: 8 }),
      });
      clearInterval(interval);
      if (!res.ok) { const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` })); throw new Error(err.error || `Server error ${res.status}`); }
      const json = await res.json();
      const data = json.data || json;
      const rawNiches: Niche[] = (data.niches || []).map((n: Niche, i: number) => ({ ...n, id: n.id || String(i + 1), saved: false }));
      if (!rawNiches.length) throw new Error("No niches returned. Please try again.");
      setNiches(rawNiches); setHasGenerated(true);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setGenerating(false); }
  };

  const toggleSave = (id: string) => setNiches((prev) => prev.map((n) => (n.id === id ? { ...n, saved: !n.saved } : n)));

  const filtered = niches.filter((n) => {
    const matchSearch = !search || n.name.toLowerCase().includes(search.toLowerCase()) || n.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || n.category?.toLowerCase().includes(category.toLowerCase());
    const matchComp = competition === "all" || n.competition?.toLowerCase() === competition;
    return matchSearch && matchCat && matchComp;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Niche Finder" subtitle="Discover high-performing niches for faceless channels" />

      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Hero search card */}
        <div style={{
          padding: "24px 28px", borderRadius: 18, marginBottom: 28,
          background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
          border: "1px solid rgba(52,211,153,0.12)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(52,211,153,0.06)", filter: "blur(40px)", pointerEvents: "none" }} />
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 22 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(52,211,153,0.1)", border: "1px solid rgba(52,211,153,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Compass size={22} color="#34d399" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: 0 }}>Niche Finder Database</p>
              <p style={{ fontSize: 12, color: "#475569", margin: "3px 0 0" }}>AI-powered analysis — competition gaps, RPM data, growth trends, and viral potential.</p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            <select value={category} onChange={(e) => setCategory(e.target.value)} style={{
              background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
              padding: "10px 14px", color: "#94a3b8", fontSize: 13, outline: "none", cursor: "pointer",
            }}>
              {categories.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
            {["all", "low", "medium", "high"].map((c) => (
              <button key={c} onClick={() => setCompetition(c)} style={{
                padding: "9px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
                border: "none", textTransform: "capitalize", transition: "all 0.15s",
                background: competition === c ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                color: competition === c ? "#00D4FF" : "#475569",
                outline: competition === c ? "1px solid rgba(0,212,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
              }}>{c === "all" ? "All Competition" : c}</button>
            ))}
            <button onClick={handleSearch} disabled={generating} style={{
              marginLeft: "auto", display: "flex", alignItems: "center", gap: 8,
              padding: "10px 22px", borderRadius: 10, border: "none",
              background: generating ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
              color: "#04080F", fontSize: 13, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer",
              boxShadow: "0 0 20px rgba(0,212,255,0.25)",
            }}>
              {generating ? <><RefreshCw size={13} style={{ animation: "spin 0.7s linear infinite" }} /> {STEPS[generatingStep]}</> : <><Zap size={13} fill="#04080F" /> {hasGenerated ? "Refresh Niches" : "Find Niches"}</>}
            </button>
          </div>

          {generating && (
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #34d399, #00D4FF)", transition: "width 2000ms ease-out", width: `${((generatingStep + 1) / STEPS.length) * 100}%` }} />
              </div>
              <p style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>Using GPT-4o · Usually 10–20 seconds</p>
            </div>
          )}

          {hasGenerated && niches.length > 0 && (
            <div style={{ display: "flex", gap: 24, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {[
                { label: "Niches Found", value: niches.length, icon: BarChart3, color: "#00D4FF" },
                { label: "Low Competition", value: niches.filter(n => n.competition === "Low").length, icon: Flame, color: "#34d399" },
                { label: "Trending Up", value: niches.filter(n => n.trend === "up").length, icon: TrendingUp, color: "#a78bfa" },
              ].map((s) => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <s.icon size={13} color={s.color} />
                  <div>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>{s.value}</p>
                    <p style={{ fontSize: 10, color: "#334155", margin: 0 }}>{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 20 }}>
            <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5", margin: 0 }}>Search Failed</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasGenerated && !generating && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Compass size={24} color="#34d399" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>Discover High-Performing Niches</p>
            <p style={{ fontSize: 13, color: "#334155", margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Our AI analyses thousands of channels to surface untapped niches with strong RPM and low competition.
            </p>
            <button onClick={handleSearch} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #00D4FF, #0080cc)", color: "#04080F", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
              <Zap size={14} fill="#04080F" /> Find Niches Now
            </button>
          </div>
        )}

        {/* Results */}
        {hasGenerated && niches.length > 0 && (
          <>
            <div style={{ position: "relative", marginBottom: 20 }}>
              <Search size={13} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search niches…"
                style={{ width: "100%", maxWidth: 280, boxSizing: "border-box", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px 10px 34px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
              {filtered.map((niche) => {
                const isExpanded = expandedNiche === niche.id;
                const cc = compColor[niche.competition] || "#94a3b8";
                return (
                  <div key={niche.id} style={{ borderRadius: 16, background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))", border: "1px solid rgba(255,255,255,0.06)", overflow: "hidden" }}>
                    <div style={{ padding: "20px" }}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, marginBottom: 14 }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                            {niche.trend === "up" && <TrendingUp size={13} color="#34d399" />}
                            <p style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{niche.name}</p>
                          </div>
                          <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }}>{niche.category}</span>
                        </div>
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: compBg[niche.competition], color: cc, border: `1px solid ${compBorder[niche.competition]}`, flexShrink: 0 }}>
                          {niche.competition} Competition
                        </span>
                      </div>

                      {niche.tags?.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 14 }}>
                          {niche.tags.map((tag) => (
                            <span key={tag} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.04)", color: "#475569", border: "1px solid rgba(255,255,255,0.06)" }}>{tag}</span>
                          ))}
                        </div>
                      )}

                      <div style={{ marginBottom: 14 }}>
                        <p style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 8px" }}>Niche Potential</p>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                            <div style={{ height: "100%", borderRadius: 99, width: `${niche.potential}%`, background: niche.potential >= 90 ? "linear-gradient(90deg, #34d399, #10b981)" : niche.potential >= 80 ? "linear-gradient(90deg, #00D4FF, #0080cc)" : "linear-gradient(90deg, #facc15, #f59e0b)" }} />
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 800, color: niche.potential >= 90 ? "#34d399" : niche.potential >= 80 ? "#00D4FF" : "#facc15" }}>{niche.potential}</span>
                        </div>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 14 }}>
                        {[
                          { label: "Avg Views", value: niche.avgViews, icon: Eye },
                          { label: "Avg Subs", value: niche.avgSubs, icon: Users },
                          { label: "RPM", value: niche.rpm, icon: DollarSign },
                          { label: "Channels", value: String(niche.topChannels), icon: Play },
                        ].map((s) => (
                          <div key={s.label} style={{ textAlign: "center", padding: "8px 4px", borderRadius: 8, background: "rgba(255,255,255,0.02)" }}>
                            <s.icon size={11} color="#334155" style={{ margin: "0 auto 4px", display: "block" }} />
                            <p style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{s.value}</p>
                            <p style={{ fontSize: 9, color: "#1e293b", margin: 0 }}>{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {niche.whyNow && (
                        <div style={{ display: "flex", gap: 8, padding: "10px 12px", borderRadius: 9, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)", marginBottom: 14 }}>
                          <Lightbulb size={12} color="#facc15" style={{ flexShrink: 0, marginTop: 2 }} />
                          <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, margin: 0 }}>{niche.whyNow}</p>
                        </div>
                      )}

                      {niche.contentIdeas?.length ? (
                        <div style={{ marginBottom: 14 }}>
                          <button onClick={() => setExpandedNiche(isExpanded ? null : niche.id)} style={{ fontSize: 12, color: "#00D4FF", background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                            {isExpanded ? "▲ Hide content ideas" : `▼ Show ${niche.contentIdeas.length} content ideas`}
                          </button>
                          {isExpanded && (
                            <ul style={{ marginTop: 10, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: 6 }}>
                              {niche.contentIdeas.map((idea, i) => (
                                <li key={i} style={{ fontSize: 12, color: "#64748b", display: "flex", gap: 8 }}>
                                  <span style={{ color: "#00D4FF", fontWeight: 700 }}>{i + 1}.</span> {idea}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : null}

                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => toggleSave(niche.id)} style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
                          fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.15s",
                          background: niche.saved ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.04)",
                          color: niche.saved ? "#00D4FF" : "#475569",
                          outline: niche.saved ? "1px solid rgba(0,212,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                        }}>
                          <BookmarkPlus size={12} /> {niche.saved ? "Saved" : "Save"}
                        </button>
                        <button style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, padding: "8px 14px", borderRadius: 9, background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.18)", color: "#00D4FF", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                          <Zap size={12} /> Explore Niche <ArrowRight size={11} style={{ marginLeft: "auto" }} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={handleSearch} disabled={generating} style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", background: "none", border: "none", cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.5 : 1 }}>
                <RefreshCw size={14} style={generating ? { animation: "spin 0.7s linear infinite" } : {}} />
                {generating ? "Refreshing…" : "Refresh niche analysis"}
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
