"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Lightbulb, Zap, TrendingUp, Eye, BookmarkPlus,
  ArrowRight, RefreshCw, Search, Flame, Star, AlertCircle, PenLine,
} from "lucide-react";

interface VideoIdea {
  id: string;
  title: string;
  hook: string;
  virality: number;
  estimatedViews: string;
  niche: string;
  format: string;
  difficulty: "Easy" | "Medium" | "Hard";
  whyItWorks?: string;
  saved: boolean;
}

const GENERATE_STEPS = [
  "Analysing your niche…",
  "Studying competitor channels…",
  "Identifying viral patterns…",
  "Scoring viral potential…",
  "Finalising ideas…",
];

const diffColor: Record<string, string> = {
  Easy: "#34d399", Medium: "#facc15", Hard: "#f87171",
};
const diffBg: Record<string, string> = {
  Easy: "rgba(52,211,153,0.1)", Medium: "rgba(250,204,21,0.1)", Hard: "rgba(248,113,113,0.1)",
};
const diffBorder: Record<string, string> = {
  Easy: "rgba(52,211,153,0.2)", Medium: "rgba(250,204,21,0.2)", Hard: "rgba(248,113,113,0.2)",
};

function ViralityBar({ score }: { score: number }) {
  const color =
    score >= 90 ? "linear-gradient(90deg, #34d399, #10b981)"
    : score >= 80 ? "linear-gradient(90deg, #00D4FF, #0080cc)"
    : "linear-gradient(90deg, #facc15, #f59e0b)";
  const textColor =
    score >= 90 ? "#34d399" : score >= 80 ? "#00D4FF" : "#facc15";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, height: 5, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{ height: "100%", borderRadius: 99, width: `${score}%`, background: color }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color: textColor, minWidth: 24, textAlign: "right" }}>{score}</span>
    </div>
  );
}

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<VideoIdea[]>([]);
  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [niche, setNiche] = useState("");
  const [hasGenerated, setHasGenerated] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true); setError(null); setGeneratingStep(0);
    const interval = setInterval(() => setGeneratingStep((s) => Math.min(s + 1, GENERATE_STEPS.length - 1)), 2000);
    try {
      const res = await fetch("/api/generate-ideas", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ niche: niche || "faceless YouTube content creation", count: 6 }),
      });
      clearInterval(interval);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `Server error ${res.status}`);
      }
      const json = await res.json();
      const data = json.data || json;
      const rawIdeas: VideoIdea[] = (data.ideas || []).map((idea: VideoIdea, i: number) => ({
        ...idea, id: idea.id || String(i + 1), saved: false,
      }));
      if (!rawIdeas.length) throw new Error("No ideas returned. Please try again.");
      setIdeas(rawIdeas); setHasGenerated(true);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally { setGenerating(false); }
  };

  const toggleSave = async (id: string) => {
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    const saving = !idea.saved;
    setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, saved: saving } : i));
    if (saving) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("video_ideas").insert({
          user_id: user.id, title: idea.title, hook: idea.hook,
          virality: idea.virality, estimated_views: idea.estimatedViews,
          niche: idea.niche, format: idea.format, difficulty: idea.difficulty,
          why_it_works: idea.whyItWorks,
        });
      }
    }
  };

  const filtered = ideas.filter((idea) => {
    const matchSearch = !search || idea.title.toLowerCase().includes(search.toLowerCase()) || idea.niche?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "saved" && idea.saved) || (filter === "easy" && idea.difficulty === "Easy");
    return matchSearch && matchFilter;
  });

  const avgVirality = ideas.length
    ? Math.round(ideas.reduce((a, i) => a + i.virality, 0) / ideas.length * 10) / 10
    : null;

  const card: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Video Ideas" subtitle="AI-ranked ideas based on your niche and competitor channels" />

      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Generator card */}
        <div style={{
          ...card, padding: "24px 28px", marginBottom: 24,
          border: "1px solid rgba(250,204,21,0.12)", position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -40, right: -40, width: 180, height: 180, borderRadius: "50%", background: "rgba(250,204,21,0.05)", filter: "blur(50px)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <div style={{ width: 46, height: 46, borderRadius: 13, background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Lightbulb size={22} color="#facc15" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: 0 }}>AI Video Ideas</p>
              <p style={{ fontSize: 12, color: "#475569", margin: "3px 0 0" }}>
                Enter your niche and our AI analyses competitor channels and trending content to generate ideas ranked by viral potential.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !generating && handleGenerate()}
              placeholder="e.g. personal finance, AI tools, stoicism, faceless YouTube…"
              style={{
                flex: 1, background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, padding: "11px 16px", color: "#e2e8f0", fontSize: 13, outline: "none",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = "rgba(250,204,21,0.35)"}
              onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "11px 22px",
                borderRadius: 10, border: "none", cursor: generating ? "not-allowed" : "pointer",
                background: generating ? "rgba(0,212,255,0.3)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
                color: "#04080F", fontSize: 13, fontWeight: 700, whiteSpace: "nowrap",
                boxShadow: generating ? "none" : "0 0 20px rgba(0,212,255,0.25)",
              }}
            >
              {generating
                ? <><RefreshCw size={13} style={{ animation: "spin 0.7s linear infinite" }} /> {GENERATE_STEPS[generatingStep]}</>
                : <><Zap size={13} fill="#04080F" /> Generate Video Ideas</>
              }
            </button>
          </div>

          {generating && (
            <div style={{ marginTop: 14 }}>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #facc15, #00D4FF)", transition: "width 2000ms ease-out", width: `${((generatingStep + 1) / GENERATE_STEPS.length) * 100}%` }} />
              </div>
              <p style={{ fontSize: 11, color: "#334155", marginTop: 6 }}>Using GPT-4o · Usually 10–20 seconds</p>
            </div>
          )}

          {hasGenerated && ideas.length > 0 && (
            <div style={{ display: "flex", gap: 28, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.04)" }}>
              {[
                { label: "Ideas Generated", value: String(ideas.length), icon: Lightbulb, color: "#facc15" },
                { label: "Avg. Virality Score", value: String(avgVirality ?? "—"), icon: Flame, color: "#fb923c" },
                { label: "Saved Ideas", value: String(ideas.filter((i) => i.saved).length), icon: Star, color: "#00D4FF" },
                { label: "High Potential (90+)", value: String(ideas.filter((i) => i.virality >= 90).length), icon: TrendingUp, color: "#34d399" },
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
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5", margin: 0 }}>Generation Failed</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasGenerated && !generating && (
          <div style={{ ...card, padding: "80px 20px", textAlign: "center" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Lightbulb size={24} color="#facc15" />
            </div>
            <p style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>Generate Viral Video Ideas</p>
            <p style={{ fontSize: 13, color: "#334155", margin: "0 0 24px", maxWidth: 420, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
              The AI will analyse your niche, competitor channels, and their top-performing videos to generate ideas ranked by viral potential.
            </p>
            <button
              onClick={handleGenerate}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #00D4FF, #0080cc)", color: "#04080F", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
            >
              <Zap size={14} fill="#04080F" /> Generate Video Ideas
            </button>
          </div>
        )}

        {/* Results */}
        {hasGenerated && ideas.length > 0 && (
          <>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center", flexWrap: "wrap" }}>
              <div style={{ position: "relative" }}>
                <Search size={13} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ideas…"
                  style={{
                    background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 10, padding: "9px 14px 9px 34px", color: "#e2e8f0", fontSize: 13,
                    outline: "none", width: 240,
                  }}
                  onFocus={(e) => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                  onBlur={(e) => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[
                  { id: "all", label: "All Ideas" },
                  { id: "saved", label: "Saved" },
                  { id: "easy", label: "Easy Wins" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    style={{
                      padding: "8px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                      cursor: "pointer", border: "none", transition: "all 0.15s",
                      background: filter === f.id ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                      color: filter === f.id ? "#00D4FF" : "#475569",
                      outline: filter === f.id ? "1px solid rgba(0,212,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                    }}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ideas grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16, marginBottom: 24 }}>
              {filtered.map((idea) => (
                <div key={idea.id} style={{ ...card, overflow: "hidden" }}>
                  <div style={{ padding: "20px" }}>

                    {/* Badges row */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, background: "rgba(0,212,255,0.1)", color: "#7dd3fc", border: "1px solid rgba(0,212,255,0.2)" }}>
                        {idea.format || "Video"}
                      </span>
                      {idea.niche && (
                        <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, background: "rgba(255,255,255,0.04)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }}>
                          {idea.niche}
                        </span>
                      )}
                      <span style={{ fontSize: 10, padding: "3px 10px", borderRadius: 99, background: diffBg[idea.difficulty], color: diffColor[idea.difficulty], border: `1px solid ${diffBorder[idea.difficulty]}` }}>
                        {idea.difficulty}
                      </span>
                    </div>

                    {/* Title */}
                    <p style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", margin: "0 0 10px", lineHeight: 1.4 }}>{idea.title}</p>

                    {/* Hook */}
                    {idea.hook && (
                      <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, margin: "0 0 10px" }}>
                        <span style={{ color: "#00D4FF", fontWeight: 600 }}>Hook: </span>{idea.hook}
                      </p>
                    )}

                    {/* Why it works */}
                    {idea.whyItWorks && (
                      <p style={{ fontSize: 11, color: "#475569", fontStyle: "italic", lineHeight: 1.5, margin: "0 0 12px" }}>{idea.whyItWorks}</p>
                    )}

                    {/* Virality */}
                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#334155", letterSpacing: "0.12em", textTransform: "uppercase" }}>Viral Potential</span>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <Eye size={11} color="#334155" />
                          <span style={{ fontSize: 11, color: "#475569" }}>{idea.estimatedViews} views</span>
                        </div>
                      </div>
                      <ViralityBar score={idea.virality} />
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => toggleSave(idea.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px",
                          borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer", border: "none",
                          background: idea.saved ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.04)",
                          color: idea.saved ? "#00D4FF" : "#475569",
                          outline: idea.saved ? "1px solid rgba(0,212,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                          transition: "all 0.15s",
                        }}
                      >
                        <BookmarkPlus size={12} /> {idea.saved ? "Saved" : "Save"}
                      </button>
                      <Link
                        href={`/dashboard/new-script?idea=${encodeURIComponent(idea.title)}`}
                        style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
                          gap: 6, padding: "8px 14px", borderRadius: 9, textDecoration: "none",
                          background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.18)",
                          color: "#7dd3fc", fontSize: 12, fontWeight: 700,
                        }}
                      >
                        <PenLine size={12} /> Write Script <ArrowRight size={11} style={{ marginLeft: "auto" }} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Regenerate */}
            <div style={{ textAlign: "center" }}>
              <button
                onClick={handleGenerate}
                disabled={generating}
                style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#334155", background: "none", border: "none", cursor: generating ? "not-allowed" : "pointer", opacity: generating ? 0.5 : 1 }}
              >
                <RefreshCw size={14} style={generating ? { animation: "spin 0.7s linear infinite" } : {}} />
                {generating ? "Generating…" : "Generate a new batch of ideas"}
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
