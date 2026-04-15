"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Lightbulb, Zap, Eye, BookmarkPlus,
  ArrowRight, RefreshCw, Search, AlertCircle, PenLine,
} from "lucide-react";
import Link from "next/link";

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

const DIFF_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  Easy:   { bg: "rgba(52,211,153,0.1)",  color: "#34d399", border: "rgba(52,211,153,0.2)"  },
  Medium: { bg: "rgba(250,204,21,0.1)",  color: "#facc15", border: "rgba(250,204,21,0.2)"  },
  Hard:   { bg: "rgba(239,68,68,0.1)",   color: "#f87171", border: "rgba(239,68,68,0.2)"   },
};

function ViralityBar({ score }: { score: number }) {
  const color = score >= 90 ? "#34d399" : score >= 80 ? "#00D4FF" : "#facc15";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <div style={{ flex: 1, height: 6, borderRadius: 99, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
        <div style={{ height: "100%", background: color, width: `${score}%` }} />
      </div>
      <span style={{ fontSize: 12, fontWeight: 800, color, minWidth: 24 }}>{score}</span>
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
    const interval = setInterval(() => setGeneratingStep(s => Math.min(s + 1, GENERATE_STEPS.length - 1)), 2000);
    try {
      const res = await fetch("/api/generate-ideas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      setIdeas(rawIdeas);
      setHasGenerated(true);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  const toggleSave = async (id: string) => {
    const idea = ideas.find(i => i.id === id);
    if (!idea) return;
    const saving = !idea.saved;
    setIdeas(prev => prev.map(i => i.id === id ? { ...i, saved: saving } : i));
    if (saving) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("video_ideas").insert({
          user_id: user.id, title: idea.title, hook: idea.hook,
          virality: idea.virality, estimated_views: idea.estimatedViews,
          niche: idea.niche, format: idea.format,
          difficulty: idea.difficulty, why_it_works: idea.whyItWorks,
        });
      }
    }
  };

  const filtered = ideas.filter(idea => {
    const matchSearch = !search || idea.title.toLowerCase().includes(search.toLowerCase()) || idea.niche?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "saved" && idea.saved) || (filter === "easy" && idea.difficulty === "Easy");
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Video Ideas" subtitle="AI-powered viral idea generator" />

      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Hero Generator */}
        <div style={{
          position: "relative", overflow: "hidden", borderRadius: 18,
          background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
          border: "1px solid rgba(0,212,255,0.12)", padding: "28px", marginBottom: 28,
        }}>
          <div style={{ position: "absolute", top: 0, right: 0, width: 320, height: 320, background: "radial-gradient(circle, rgba(0,212,255,0.04), transparent 70%)", pointerEvents: "none" }} />

          <div style={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 18, marginBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(250,204,21,0.12)", border: "1px solid rgba(250,204,21,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Lightbulb size={22} color="#facc15" />
            </div>
            <div>
              <h2 style={{ fontSize: 17, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>AI Video Ideas</h2>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Enter your niche — our AI analyses competitors and trending content to surface ideas ranked by viral potential.</p>
            </div>
          </div>

          <div style={{ position: "relative", display: "flex", gap: 10 }}>
            <input
              value={niche}
              onChange={e => setNiche(e.target.value)}
              onKeyDown={e => e.key === "Enter" && !generating && handleGenerate()}
              placeholder="e.g. personal finance, AI tools, stoicism, faceless YouTube…"
              style={{ flex: 1, background: "rgba(8,13,26,0.8)", border: "1px solid rgba(0,212,255,0.12)", borderRadius: 12, padding: "12px 16px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.12)"}
            />
            <button
              onClick={handleGenerate}
              disabled={generating}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "12px 22px", borderRadius: 12, border: "none",
                background: "linear-gradient(135deg, #00D4FF, #0080cc)", color: "#04080F",
                fontSize: 13, fontWeight: 800, cursor: generating ? "not-allowed" : "pointer",
                flexShrink: 0, opacity: generating ? 0.7 : 1,
              }}
            >
              <Zap size={15} fill="#04080F" />
              {generating ? GENERATE_STEPS[generatingStep] : "Generate Video Ideas"}
            </button>
          </div>

          {generating && (
            <div style={{ position: "relative", marginTop: 14 }}>
              <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.05)" }}>
                <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(to right, #00D4FF, #0080cc)", width: `${((generatingStep + 1) / GENERATE_STEPS.length) * 100}%`, transition: "width 2s ease-out" }} />
              </div>
              <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>Using GPT-4o · Usually 10–20 seconds</p>
            </div>
          )}

          {hasGenerated && ideas.length > 0 && (
            <div style={{ position: "relative", display: "flex", gap: 28, marginTop: 20, paddingTop: 16, borderTop: "1px solid rgba(255,255,255,0.05)", flexWrap: "wrap" }}>
              {[
                { label: "Ideas Generated", value: ideas.length, color: "#facc15" },
                { label: "Avg. Virality", value: `${Math.round(ideas.reduce((a, i) => a + i.virality, 0) / ideas.length * 10) / 10}`, color: "#fb923c" },
                { label: "Saved", value: ideas.filter(i => i.saved).length, color: "#00D4FF" },
                { label: "High Potential (90+)", value: ideas.filter(i => i.virality >= 90).length, color: "#34d399" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <p style={{ fontSize: 18, fontWeight: 800, color: s.color, margin: 0, letterSpacing: "-0.5px" }}>{s.value}</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{s.label}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", marginBottom: 24 }}>
            <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f87171", margin: "0 0 2px" }}>Generation Failed</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasGenerated && !generating && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(250,204,21,0.08)", border: "1px solid rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Lightbulb size={24} color="#facc15" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>Generate Viral Video Ideas</p>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 auto 24px", lineHeight: 1.6, maxWidth: 380 }}>
              The AI will analyse your niche, competitors, and top-performing videos to generate ideas ranked by viral potential.
            </p>
            <button
              onClick={handleGenerate}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 22px", borderRadius: 11, border: "none", background: "linear-gradient(135deg, #00D4FF, #0080cc)", color: "#04080F", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
            >
              <Zap size={14} fill="#04080F" /> Generate Video Ideas
            </button>
          </div>
        )}

        {/* Results */}
        {hasGenerated && ideas.length > 0 && (
          <>
            {/* Filters */}
            <div style={{ display: "flex", gap: 10, marginBottom: 20, flexWrap: "wrap", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <Search size={13} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search ideas…"
                  style={{ background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "9px 14px 9px 34px", color: "#e2e8f0", fontSize: 13, outline: "none", width: 220 }}
                />
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                {[{ id: "all", label: "All Ideas" }, { id: "saved", label: "Saved" }, { id: "easy", label: "Easy Wins" }].map(f => (
                  <button key={f.id} onClick={() => setFilter(f.id)} style={{
                    padding: "8px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600, cursor: "pointer",
                    border: "none", transition: "all 0.15s",
                    background: filter === f.id ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                    color: filter === f.id ? "#00D4FF" : "#475569",
                    outline: filter === f.id ? "1px solid rgba(0,212,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                  }}>{f.label}</button>
                ))}
              </div>
            </div>

            {/* Ideas Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 14, marginBottom: 28 }}>
              {filtered.map(idea => {
                const diff = DIFF_STYLE[idea.difficulty] || DIFF_STYLE.Medium;
                return (
                  <div key={idea.id} style={{
                    borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                    border: "1px solid rgba(0,212,255,0.08)", padding: "20px",
                  }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
                      {idea.format && (
                        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)" }}>{idea.format}</span>
                      )}
                      {idea.niche && (
                        <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}>{idea.niche}</span>
                      )}
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: diff.bg, color: diff.color, border: `1px solid ${diff.border}` }}>{idea.difficulty}</span>
                    </div>

                    <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.4, margin: "0 0 8px" }}>{idea.title}</h3>

                    {idea.hook && (
                      <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, margin: "0 0 6px" }}>
                        <span style={{ color: "#00D4FF", fontWeight: 600 }}>Hook: </span>{idea.hook}
                      </p>
                    )}
                    {idea.whyItWorks && (
                      <p style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5, margin: "0 0 14px", fontStyle: "italic" }}>{idea.whyItWorks}</p>
                    )}

                    <div style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.12em" }}>Viral Potential</span>
                        <span style={{ fontSize: 11, color: "#64748b", display: "flex", alignItems: "center", gap: 4 }}>
                          <Eye size={10} /> {idea.estimatedViews} views
                        </span>
                      </div>
                      <ViralityBar score={idea.virality} />
                    </div>

                    <div style={{ display: "flex", gap: 8 }}>
                      <button onClick={() => toggleSave(idea.id)} style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
                        fontSize: 12, fontWeight: 600, cursor: "pointer",
                        background: idea.saved ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.04)",
                        border: idea.saved ? "1px solid rgba(0,212,255,0.25)" : "1px solid rgba(255,255,255,0.08)",
                        color: idea.saved ? "#00D4FF" : "#475569",
                      }}>
                        <BookmarkPlus size={12} /> {idea.saved ? "Saved" : "Save"}
                      </button>
                      <Link href={`/dashboard/new-script?idea=${encodeURIComponent(idea.title)}`} style={{
                        flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                        padding: "8px 14px", borderRadius: 9, textDecoration: "none",
                        background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
                        color: "#00D4FF", fontSize: 12, fontWeight: 700,
                      }}>
                        <PenLine size={12} /> Write Script <ArrowRight size={11} style={{ marginLeft: "auto" }} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            <div style={{ textAlign: "center" }}>
              <button onClick={handleGenerate} disabled={generating} style={{
                display: "inline-flex", alignItems: "center", gap: 8, fontSize: 13, color: "#64748b",
                background: "none", border: "none", cursor: generating ? "not-allowed" : "pointer",
                opacity: generating ? 0.5 : 1,
              }}>
                <RefreshCw size={14} />
                {generating ? "Generating…" : "Generate a new batch of ideas"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
