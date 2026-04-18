"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Search, RefreshCw, Zap, AlertCircle, TrendingUp,
  Users, DollarSign, Eye, BookmarkPlus, BookmarkCheck,
  X, ChevronUp, ChevronDown, Minus,
} from "lucide-react";

interface Niche {
  id: string; name: string; category: string;
  competition: "Low" | "Medium" | "High"; potential: number;
  avgViews: string; avgSubs: string; rpm: string; topChannels: number;
  trend: "up" | "stable" | "down"; tags: string[];
  whyNow?: string; contentIdeas?: string[]; saved: boolean;
  // derived numeric fields for filtering
  subsNum?: number; viewsNum?: number; earningsNum?: number;
}

const CATEGORIES = [
  "All Categories", "Technology", "Finance", "Lifestyle",
  "Education", "Entertainment", "Health & Fitness", "Gaming",
  "Food & Cooking", "Travel", "Beauty", "Business",
];

const MONETIZATION = ["All", "Monetized", "Not Monetized", "High RPM"];

const STEPS = [
  "Scanning YouTube trends…", "Analysing 12,000+ channels…",
  "Calculating RPM data…", "Scoring competition gaps…", "Finalising opportunities…",
];

const compColor: Record<string, string> = { Low: "#34d399", Medium: "#facc15", High: "#f87171" };
const compBg: Record<string, string> = { Low: "rgba(52,211,153,0.12)", Medium: "rgba(250,204,21,0.12)", High: "rgba(248,113,113,0.12)" };

function parseNum(val: string): number {
  if (!val) return 0;
  const v = val.replace(/[^0-9.KMB]/gi, "");
  const n = parseFloat(v);
  if (/B/i.test(val)) return n * 1_000_000_000;
  if (/M/i.test(val)) return n * 1_000_000;
  if (/K/i.test(val)) return n * 1_000;
  return n;
}

export default function NicheFinderPage() {
  const [niches, setNiches] = useState<Niche[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Filters
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [monetization, setMonetization] = useState("All");
  const [minSubs, setMinSubs] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [minViews, setMinViews] = useState("");
  const [maxViews, setMaxViews] = useState("");
  const [minEarnings, setMinEarnings] = useState("");
  const [maxEarnings, setMaxEarnings] = useState("");

  // Sort
  const [sortCol, setSortCol] = useState<string>("potential");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

  // Saved
  const toggleSave = (id: string) => setNiches(prev => prev.map(n => n.id === id ? { ...n, saved: !n.saved } : n));

  const handleGenerate = async () => {
    setGenerating(true); setError(null); setGeneratingStep(0);
    const interval = setInterval(() => setGeneratingStep(s => Math.min(s + 1, STEPS.length - 1)), 2000);
    try {
      const res = await fetch("/api/niche-finder", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: category === "All Categories" ? "all" : category, competition: "all", search, count: 12 }),
      });
      clearInterval(interval);
      if (!res.ok) { const e = await res.json().catch(() => ({ error: `HTTP ${res.status}` })); throw new Error(e.error || `Server error`); }
      const json = await res.json();
      const data = json.data || json;
      const raw: Niche[] = (data.niches || []).map((n: Niche, i: number) => ({
        ...n, id: n.id || String(i + 1), saved: false,
        subsNum: parseNum(n.avgSubs),
        viewsNum: parseNum(n.avgViews),
        earningsNum: parseNum(n.rpm) * 10,
      }));
      if (!raw.length) throw new Error("No niches returned. Please try again.");
      setNiches(raw); setHasGenerated(true);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setGenerating(false); }
  };

  const clearFilters = () => {
    setSearch(""); setCategory("All Categories"); setMonetization("All");
    setMinSubs(""); setMaxSubs(""); setMinViews(""); setMaxViews("");
    setMinEarnings(""); setMaxEarnings("");
  };

  const hasFilters = search || category !== "All Categories" || monetization !== "All" ||
    minSubs || maxSubs || minViews || maxViews || minEarnings || maxEarnings;

  const filtered = niches.filter(n => {
    if (search && !n.name.toLowerCase().includes(search.toLowerCase()) && !n.category?.toLowerCase().includes(search.toLowerCase())) return false;
    if (category !== "All Categories" && !n.category?.toLowerCase().includes(category.toLowerCase())) return false;
    if (minSubs && (n.subsNum || 0) < parseNum(minSubs)) return false;
    if (maxSubs && (n.subsNum || 0) > parseNum(maxSubs)) return false;
    if (minViews && (n.viewsNum || 0) < parseNum(minViews)) return false;
    if (maxViews && (n.viewsNum || 0) > parseNum(maxViews)) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    let va: number | string = 0, vb: number | string = 0;
    if (sortCol === "potential") { va = a.potential; vb = b.potential; }
    else if (sortCol === "subs") { va = a.subsNum || 0; vb = b.subsNum || 0; }
    else if (sortCol === "views") { va = a.viewsNum || 0; vb = b.viewsNum || 0; }
    else if (sortCol === "rpm") { va = parseNum(a.rpm); vb = parseNum(b.rpm); }
    else if (sortCol === "name") { va = a.name; vb = b.name; }
    if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb as string) : (vb as string).localeCompare(va);
    return sortDir === "asc" ? va - (vb as number) : (vb as number) - va;
  });

  function SortIcon({ col }: { col: string }) {
    if (sortCol !== col) return <ChevronUp size={11} color="#2A3F5F" />;
    return sortDir === "asc" ? <ChevronUp size={11} color="#00D4FF" /> : <ChevronDown size={11} color="#00D4FF" />;
  }

  function toggleSort(col: string) {
    if (sortCol === col) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortCol(col); setSortDir("desc"); }
  }

  const inputStyle: React.CSSProperties = {
    background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 8, padding: "8px 12px", color: "#fff", fontSize: 12,
    outline: "none", width: "100%", boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle, cursor: "pointer",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Niche Finder" subtitle="Discover high-performing niches for faceless channels" />

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Purple search card */}
        <div style={{
          borderRadius: 18, padding: "24px 28px", marginBottom: 24,
          background: "linear-gradient(135deg, #3b1fa3 0%, #4c1d95 40%, #5b21b6 100%)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: -40, left: "30%", width: 160, height: 160, borderRadius: "50%", background: "rgba(255,255,255,0.03)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 18 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(255,255,255,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Search size={18} color="#fff" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>Niche Finder</p>
              <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: 0 }}>
                Filter across {niches.length > 0 ? niches.length : "1,200+"} channels in 30 categories — updated daily with AI analysis
              </p>
            </div>
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                marginLeft: "auto", display: "flex", alignItems: "center", gap: 7,
                padding: "10px 20px", borderRadius: 10, border: "none",
                background: generating ? "rgba(255,255,255,0.15)" : "rgba(255,255,255,0.2)",
                color: "#fff", fontSize: 13, fontWeight: 700, cursor: generating ? "not-allowed" : "pointer",
                backdropFilter: "blur(8px)",
              }}
            >
              {generating
                ? <><RefreshCw size={13} style={{ animation: "spin 0.7s linear infinite" }} /> {STEPS[generatingStep]}</>
                : <><Zap size={13} fill="#fff" /> {hasGenerated ? "Refresh" : "Find Niches"}</>}
            </button>
          </div>

          {/* Search bar */}
          <div style={{ position: "relative", marginBottom: 14 }}>
            <Search size={14} color="rgba(255,255,255,0.4)" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search channel name or niche…"
              style={{ ...inputStyle, paddingLeft: 36, fontSize: 13 }}
            />
          </div>

          {/* Row 1: Category + Monetization */}
          <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1 }}>
              <select value={category} onChange={e => setCategory(e.target.value)} style={selectStyle}>
                {CATEGORIES.map(c => <option key={c} value={c} style={{ background: "#1e1b4b" }}>{c}</option>)}
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <select value={monetization} onChange={e => setMonetization(e.target.value)} style={selectStyle}>
                {MONETIZATION.map(m => <option key={m} value={m} style={{ background: "#1e1b4b" }}>{m}</option>)}
              </select>
            </div>
          </div>

          {/* Row 2: Range filters */}
          <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
            {[
              { label: "Min Subs", val: minSubs, set: setMinSubs, ph: "e.g. 1000" },
              { label: "Max Subs", val: maxSubs, set: setMaxSubs, ph: "e.g. 1M" },
              { label: "Min Views/mo", val: minViews, set: setMinViews, ph: "e.g. 10000" },
              { label: "Max Views/mo", val: maxViews, set: setMaxViews, ph: "e.g. 10M" },
              { label: "Min Earnings/mo", val: minEarnings, set: setMinEarnings, ph: "e.g. 500" },
              { label: "Max Earnings/mo", val: maxEarnings, set: setMaxEarnings, ph: "e.g. 50000" },
            ].map(({ label, val, set, ph }) => (
              <div key={label} style={{ flex: "1 1 120px", minWidth: 100 }}>
                <input value={val} onChange={e => set(e.target.value)} placeholder={ph}
                  style={{ ...inputStyle, fontSize: 11 }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.15)"}
                />
              </div>
            ))}
            {hasFilters && (
              <button onClick={clearFilters} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                borderRadius: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.2)",
                color: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
              }}>
                <X size={12} /> Clear All
              </button>
            )}
          </div>

          {generating && (
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.15)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: "rgba(255,255,255,0.7)", transition: "width 2000ms ease-out", width: `${((generatingStep + 1) / STEPS.length) * 100}%` }} />
              </div>
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 20 }}>
            <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5", margin: 0 }}>Failed to load niches</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasGenerated && !generating && (
          <div style={{
            textAlign: "center", padding: "80px 20px",
            borderRadius: 16, background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(139,92,246,0.1)", border: "1px solid rgba(139,92,246,0.2)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Search size={24} color="#a78bfa" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>No niches loaded yet</p>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 24px", maxWidth: 400, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              Click <strong style={{ color: "#a78bfa" }}>Find Niches</strong> above to load AI-analysed channels and niches from our database.
            </p>
          </div>
        )}

        {/* Results table */}
        {hasGenerated && (
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))" }}>
            {/* Table header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 20px", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>
                {sorted.length} niche{sorted.length !== 1 ? "s" : ""}
                {hasFilters && <span style={{ fontSize: 11, color: "#64748b", marginLeft: 8 }}>filtered</span>}
              </span>
              <div style={{ display: "flex", gap: 12, fontSize: 11, color: "#64748b" }}>
                {[
                  { label: "Low Competition", count: niches.filter(n => n.competition === "Low").length, color: "#34d399" },
                  { label: "Trending Up", count: niches.filter(n => n.trend === "up").length, color: "#a78bfa" },
                  { label: "Saved", count: niches.filter(n => n.saved).length, color: "#00D4FF" },
                ].map(({ label, count, color }) => (
                  <span key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                    <span style={{ width: 6, height: 6, borderRadius: "50%", background: color, display: "inline-block" }} />
                    {count} {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Column headers */}
            <div style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 100px 100px 80px 80px 44px",
              padding: "10px 20px",
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              background: "rgba(255,255,255,0.02)",
            }}>
              {[
                { key: "name", label: "Channel / Niche" },
                { key: "category", label: "Category" },
                { key: "subs", label: "Avg Subs", icon: <Users size={10} /> },
                { key: "views", label: "Views/mo", icon: <Eye size={10} /> },
                { key: "rpm", label: "RPM", icon: <DollarSign size={10} /> },
                { key: "potential", label: "Score", icon: <TrendingUp size={10} /> },
                { key: "save", label: "" },
              ].map(({ key, label, icon }) => (
                <button key={key} onClick={() => key !== "save" && key !== "category" && toggleSort(key)} style={{
                  display: "flex", alignItems: "center", gap: 4, background: "none", border: "none",
                  cursor: key !== "save" && key !== "category" ? "pointer" : "default",
                  fontSize: 10, fontWeight: 700, color: "#475569",
                  textTransform: "uppercase", letterSpacing: "0.08em", padding: 0, textAlign: "left",
                }}>
                  {icon}{label}
                  {key !== "save" && key !== "category" && <SortIcon col={key} />}
                </button>
              ))}
            </div>

            {/* Rows */}
            {sorted.length === 0 ? (
              <div style={{ padding: "40px 20px", textAlign: "center", color: "#475569", fontSize: 13 }}>
                No niches match your filters. <button onClick={clearFilters} style={{ color: "#a78bfa", background: "none", border: "none", cursor: "pointer", fontSize: 13 }}>Clear filters</button>
              </div>
            ) : sorted.map((n, idx) => {
              const cc = compColor[n.competition] || "#94a3b8";
              const TrendIcon = n.trend === "up" ? ChevronUp : n.trend === "down" ? ChevronDown : Minus;
              const trendColor = n.trend === "up" ? "#34d399" : n.trend === "down" ? "#f87171" : "#64748b";
              return (
                <div key={n.id} style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 1fr 100px 100px 80px 80px 44px",
                  padding: "14px 20px", alignItems: "center",
                  borderTop: idx > 0 ? "1px solid rgba(255,255,255,0.04)" : "none",
                  transition: "background 0.1s",
                }}
                  onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"}
                  onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                >
                  {/* Name */}
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <TrendIcon size={12} color={trendColor} />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0" }}>{n.name}</span>
                      <span style={{ fontSize: 9, fontWeight: 700, padding: "1px 7px", borderRadius: 99, background: compBg[n.competition], color: cc }}>{n.competition}</span>
                    </div>
                    <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
                      {(n.tags || []).slice(0, 3).map(tag => (
                        <span key={tag} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 99, background: "rgba(255,255,255,0.04)", color: "#64748b" }}>{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Category */}
                  <span style={{ fontSize: 11, color: "#94a3b8" }}>{n.category}</span>

                  {/* Subs */}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{n.avgSubs}</span>

                  {/* Views */}
                  <span style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0" }}>{n.avgViews}</span>

                  {/* RPM */}
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#34d399" }}>{n.rpm}</span>

                  {/* Score */}
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1, height: 4, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                      <div style={{ height: "100%", borderRadius: 99, width: `${n.potential}%`, background: n.potential >= 85 ? "linear-gradient(90deg,#34d399,#10b981)" : n.potential >= 70 ? "linear-gradient(90deg,#00D4FF,#0080cc)" : "linear-gradient(90deg,#facc15,#f59e0b)" }} />
                    </div>
                    <span style={{ fontSize: 11, fontWeight: 800, color: n.potential >= 85 ? "#34d399" : n.potential >= 70 ? "#00D4FF" : "#facc15", minWidth: 22, textAlign: "right" }}>{n.potential}</span>
                  </div>

                  {/* Save */}
                  <button onClick={() => toggleSave(n.id)} title={n.saved ? "Unsave" : "Save niche"} style={{
                    padding: 6, borderRadius: 7, background: n.saved ? "rgba(0,212,255,0.1)" : "transparent",
                    border: n.saved ? "1px solid rgba(0,212,255,0.2)" : "1px solid transparent",
                    color: n.saved ? "#00D4FF" : "#475569", cursor: "pointer", display: "flex",
                  }}>
                    {n.saved ? <BookmarkCheck size={14} /> : <BookmarkPlus size={14} />}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
