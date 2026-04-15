"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Lightbulb, Zap, TrendingUp, Eye, BookmarkPlus,
  ArrowRight, RefreshCw, Search, Flame, Clock, Star, AlertCircle
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

function ViralityBar({ score }: { score: number }) {
  const color =
    score >= 90 ? "from-emerald-400 to-emerald-500"
    : score >= 80 ? "from-cyan-400 to-cyan-500"
    : "from-yellow-400 to-yellow-500";
  const textColor =
    score >= 90 ? "text-emerald-400"
    : score >= 80 ? "text-cyan-400"
    : "text-yellow-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold font-[family-name:var(--font-syne)] ${textColor}`}>{score}</span>
    </div>
  );
}

function PenLine({ size, className }: { size: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M12 20h9" /><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
    </svg>
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
    setGenerating(true);
    setError(null);
    setGeneratingStep(0);

    const interval = setInterval(() => {
      setGeneratingStep((s) => Math.min(s + 1, GENERATE_STEPS.length - 1));
    }, 2000);

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
        ...idea,
        id: idea.id || String(i + 1),
        saved: false,
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
    const idea = ideas.find((i) => i.id === id);
    if (!idea) return;
    const saving = !idea.saved;
    setIdeas((prev) => prev.map((i) => i.id === id ? { ...i, saved: saving } : i));
    if (saving) {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("video_ideas").insert({
          user_id: user.id,
          title: idea.title,
          hook: idea.hook,
          virality: idea.virality,
          estimated_views: idea.estimatedViews,
          niche: idea.niche,
          format: idea.format,
          difficulty: idea.difficulty,
          why_it_works: idea.whyItWorks,
        });
      }
    }
  };

  const filtered = ideas.filter((idea) => {
    const matchSearch = !search || idea.title.toLowerCase().includes(search.toLowerCase()) || idea.niche?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "saved" && idea.saved) ||
      (filter === "easy" && idea.difficulty === "Easy");
    return matchSearch && matchFilter;
  });

  const avgVirality = ideas.length
    ? Math.round(ideas.reduce((a, i) => a + i.virality, 0) / ideas.length * 10) / 10
    : null;

  return (
    <div className="min-h-screen">
      <Topbar title="Video Ideas" />

      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Hero / Generator card */}
        <div className="rounded-xl relative overflow-hidden border border-cyan-500/15 bg-gradient-to-br from-[#162035] to-[#0F1829] p-6">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />
          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 border border-yellow-500/20 flex items-center justify-center shrink-0">
              <Lightbulb size={22} className="text-yellow-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white font-[family-name:var(--font-syne)]">AI Video Ideas</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                Enter your niche and our AI analyses competitor channels and trending content to generate ideas ranked by viral potential.
              </p>
            </div>
          </div>

          <div className="relative flex flex-col sm:flex-row gap-3 mt-5">
            <input
              value={niche}
              onChange={(e) => setNiche(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !generating && handleGenerate()}
              placeholder="e.g. personal finance, AI tools, stoicism, faceless YouTube…"
              className="flex-1 bg-[#0A1020]/80 border border-cyan-500/15 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/45 transition-all"
            />
            <Button
              size="lg"
              loading={generating}
              onClick={handleGenerate}
              icon={generating ? undefined : <Zap size={16} fill="currentColor" />}
              className="shrink-0"
            >
              {generating ? GENERATE_STEPS[generatingStep] : "Generate Video Ideas"}
            </Button>
          </div>

          {/* Progress bar when generating */}
          {generating && (
            <div className="relative mt-3">
              <div className="w-full bg-white/5 rounded-full h-1">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-[2000ms] ease-out"
                  style={{ width: `${((generatingStep + 1) / GENERATE_STEPS.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Using GPT-4o · Usually 10–20 seconds</p>
            </div>
          )}

          {/* Stats row — shown after generation */}
          {hasGenerated && ideas.length > 0 && (
            <div className="relative flex gap-6 mt-5 pt-4 border-t border-white/5">
              {[
                { label: "Ideas Generated", value: ideas.length.toString(), icon: Lightbulb, color: "text-yellow-400" },
                { label: "Avg. Virality Score", value: avgVirality?.toString() ?? "—", icon: Flame, color: "text-orange-400" },
                { label: "Saved Ideas", value: ideas.filter((i) => i.saved).length.toString(), icon: Star, color: "text-cyan-400" },
                { label: "High Potential (90+)", value: ideas.filter((i) => i.virality >= 90).length.toString(), icon: TrendingUp, color: "text-emerald-400" },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.icon size={13} className={s.color} />
                  <div>
                    <p className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">{s.value}</p>
                    <p className="text-[10px] text-slate-500">{s.label}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4 flex items-start gap-3">
            <AlertCircle size={15} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300 font-[family-name:var(--font-syne)]">Generation Failed</p>
              <p className="text-xs text-slate-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state before first generation */}
        {!hasGenerated && !generating && (
          <Card>
            <CardBody className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center mx-auto">
                <Lightbulb size={24} className="text-yellow-400" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-300 font-[family-name:var(--font-syne)]">Generate Viral Video Ideas</p>
                <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  The AI will analyse your niche, competitor channels, and their top-performing videos to generate ideas ranked by viral potential.
                </p>
              </div>
              <Button onClick={handleGenerate} icon={<Zap size={14} fill="currentColor" />}>
                Generate Video Ideas
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Results */}
        {hasGenerated && ideas.length > 0 && (
          <>
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                placeholder="Search ideas…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={14} />}
                className="sm:w-64"
              />
              <div className="flex gap-2">
                {[
                  { id: "all", label: "All Ideas" },
                  { id: "saved", label: "Saved" },
                  { id: "easy", label: "Easy Wins" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setFilter(f.id)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all font-[family-name:var(--font-syne)] ${
                      filter === f.id
                        ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                        : "bg-white/3 text-slate-500 border border-white/8 hover:border-white/15"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Ideas Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((idea) => (
                <div
                  key={idea.id}
                  className="rounded-xl border border-cyan-500/10 bg-gradient-to-br from-[#162035]/90 to-[#0F1829]/95 overflow-hidden transition-all duration-300 hover:border-cyan-500/25 hover:-translate-y-0.5"
                >
                  <div className="p-5">
                    <div className="flex items-start gap-2 mb-3">
                      <div className="flex-1 flex flex-wrap gap-1.5">
                        <Badge variant={idea.virality >= 90 ? "green" : "cyan"}>{idea.format || "Video"}</Badge>
                        {idea.niche && <Badge variant="neutral">{idea.niche}</Badge>}
                        <Badge variant={idea.difficulty === "Easy" ? "green" : idea.difficulty === "Medium" ? "coral" : "purple"}>
                          {idea.difficulty}
                        </Badge>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-white leading-snug mb-2 font-[family-name:var(--font-syne)]">
                      {idea.title}
                    </h3>

                    {idea.hook && (
                      <p className="text-xs text-slate-400 leading-relaxed mb-3">
                        <span className="text-cyan-500 font-medium">Hook: </span>{idea.hook}
                      </p>
                    )}

                    {idea.whyItWorks && (
                      <p className="text-xs text-slate-500 italic leading-relaxed mb-3">
                        {idea.whyItWorks}
                      </p>
                    )}

                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] text-slate-500 font-[family-name:var(--font-syne)] font-semibold uppercase tracking-widest">
                          Viral Potential
                        </span>
                        <div className="flex items-center gap-1">
                          <Eye size={11} className="text-slate-600" />
                          <span className="text-xs text-slate-400">{idea.estimatedViews} views</span>
                        </div>
                      </div>
                      <ViralityBar score={idea.virality} />
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => toggleSave(idea.id)}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                          idea.saved
                            ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                            : "border-white/8 text-slate-500 hover:border-white/15 hover:text-slate-300"
                        }`}
                      >
                        <BookmarkPlus size={12} />
                        {idea.saved ? "Saved" : "Save"}
                      </button>
                      <Link
                        href={`/dashboard/new-script?idea=${encodeURIComponent(idea.title)}`}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/15 to-cyan-600/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold font-[family-name:var(--font-syne)] hover:from-cyan-500/20 transition-all"
                      >
                        <PenLine size={12} />
                        Write Script
                        <ArrowRight size={11} className="ml-auto" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Regenerate */}
            <div className="text-center">
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
                {generating ? "Generating…" : "Generate a new batch of ideas"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
