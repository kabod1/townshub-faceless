"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import {
  Compass, Search, TrendingUp, Users, DollarSign,
  Play, Flame, Star, BookmarkPlus, ArrowRight,
  BarChart3, Eye, RefreshCw, Zap, AlertCircle, Lightbulb
} from "lucide-react";

interface Niche {
  id: string;
  name: string;
  category: string;
  competition: "Low" | "Medium" | "High";
  potential: number;
  avgViews: string;
  avgSubs: string;
  rpm: string;
  topChannels: number;
  trend: "up" | "stable" | "down";
  tags: string[];
  whyNow?: string;
  contentIdeas?: string[];
  saved: boolean;
}

const categories = [
  { value: "all", label: "All Categories" },
  { value: "technology", label: "Technology" },
  { value: "finance", label: "Finance" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "health", label: "Health & Fitness" },
];

const competitionColors: Record<string, "green" | "gold" | "coral"> = {
  Low: "green",
  Medium: "gold",
  High: "coral",
};

const STEPS = [
  "Scanning YouTube trends…",
  "Analysing 12,000+ channels…",
  "Calculating RPM data…",
  "Scoring competition gaps…",
  "Finalising opportunities…",
];

function PotentialMeter({ score }: { score: number }) {
  const color = score >= 90 ? "from-emerald-400 to-emerald-500" : score >= 80 ? "from-cyan-400 to-cyan-500" : "from-yellow-400 to-yellow-500";
  const textColor = score >= 90 ? "text-emerald-400" : score >= 80 ? "text-cyan-400" : "text-yellow-400";
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-bold font-[family-name:var(--font-syne)] ${textColor}`}>{score}</span>
    </div>
  );
}

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
    setGenerating(true);
    setError(null);
    setGeneratingStep(0);

    const interval = setInterval(() => {
      setGeneratingStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 2000);

    try {
      const res = await fetch("/api/niche-finder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, competition, search, count: 8 }),
      });

      clearInterval(interval);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const json = await res.json();
      const data = json.data || json;
      const rawNiches: Niche[] = (data.niches || []).map((n: Niche, i: number) => ({
        ...n,
        id: n.id || String(i + 1),
        saved: false,
      }));

      if (!rawNiches.length) throw new Error("No niches returned. Please try again.");
      setNiches(rawNiches);
      setHasGenerated(true);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setGenerating(false);
    }
  };

  const toggleSave = (id: string) =>
    setNiches((prev) => prev.map((n) => (n.id === id ? { ...n, saved: !n.saved } : n)));

  const filtered = niches.filter((n) => {
    const matchSearch = !search || n.name.toLowerCase().includes(search.toLowerCase()) || n.category?.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "all" || n.category?.toLowerCase().includes(category.toLowerCase());
    const matchComp = competition === "all" || n.competition?.toLowerCase() === competition;
    return matchSearch && matchCat && matchComp;
  });

  return (
    <div className="min-h-screen">
      <Topbar title="Niche Finder" />

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Hero */}
        <div className="rounded-xl border border-cyan-500/15 bg-gradient-to-br from-[#162035] to-[#0F1829] p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
              <Compass size={22} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-white font-[family-name:var(--font-syne)]">Niche Finder Database</h2>
              <p className="text-sm text-slate-400 mt-0.5">
                AI-powered niche analysis — competition gaps, RPM data, growth trends, and viral potential for faceless channels.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 mt-5">
            <Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              options={categories}
              className="sm:w-48"
            />
            <div className="flex gap-2">
              {["all", "low", "medium", "high"].map((c) => (
                <button
                  key={c}
                  onClick={() => setCompetition(c)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold capitalize transition-all font-[family-name:var(--font-syne)] ${
                    competition === c
                      ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                      : "bg-white/3 text-slate-500 border border-white/8 hover:border-white/15"
                  }`}
                >
                  {c === "all" ? "All Competition" : c}
                </button>
              ))}
            </div>
            <Button
              loading={generating}
              onClick={handleSearch}
              icon={generating ? undefined : <Zap size={14} fill="currentColor" />}
              className="sm:ml-auto"
            >
              {generating ? STEPS[generatingStep] : hasGenerated ? "Refresh Niches" : "Find Niches"}
            </Button>
          </div>

          {generating && (
            <div className="mt-3">
              <div className="w-full bg-white/5 rounded-full h-1">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400 transition-all duration-[2000ms] ease-out"
                  style={{ width: `${((generatingStep + 1) / STEPS.length) * 100}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 mt-1.5">Using GPT-4o · Usually 10–20 seconds</p>
            </div>
          )}

          {/* Stats row */}
          {hasGenerated && niches.length > 0 && (
            <div className="flex gap-6 mt-5 pt-4 border-t border-white/5">
              {[
                { label: "Niches Found", value: niches.length.toString(), icon: BarChart3 },
                { label: "Low Competition", value: niches.filter(n => n.competition === "Low").length.toString(), icon: Flame },
                { label: "High RPM", value: niches.filter(n => n.rpm?.includes("$1") || n.rpm?.includes("$2")).length.toString(), icon: DollarSign },
                { label: "Trending Up", value: niches.filter(n => n.trend === "up").length.toString(), icon: TrendingUp },
              ].map((s) => (
                <div key={s.label} className="flex items-center gap-2">
                  <s.icon size={13} className="text-cyan-400" />
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
              <p className="text-sm font-semibold text-red-300 font-[family-name:var(--font-syne)]">Search Failed</p>
              <p className="text-xs text-slate-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!hasGenerated && !generating && (
          <Card>
            <CardBody className="py-16 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto">
                <Compass size={24} className="text-emerald-400" />
              </div>
              <div>
                <p className="text-base font-bold text-slate-300 font-[family-name:var(--font-syne)]">Discover High-Performing Niches</p>
                <p className="text-sm text-slate-500 mt-1.5 max-w-sm mx-auto leading-relaxed">
                  Our AI analyses thousands of channels to surface untapped niches with strong RPM, low competition, and high faceless-channel suitability.
                </p>
              </div>
              <Button onClick={handleSearch} icon={<Zap size={14} fill="currentColor" />}>
                Find Niches Now
              </Button>
            </CardBody>
          </Card>
        )}

        {/* Results with search filter */}
        {hasGenerated && niches.length > 0 && (
          <>
            <div className="flex gap-3">
              <Input
                placeholder="Search niches…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                icon={<Search size={14} />}
                className="sm:w-64"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {filtered.map((niche) => {
                const isExpanded = expandedNiche === niche.id;
                return (
                  <div
                    key={niche.id}
                    className="rounded-xl border border-cyan-500/10 bg-gradient-to-br from-[#162035]/90 to-[#0F1829]/95 overflow-hidden transition-all duration-300 hover:border-cyan-500/25"
                  >
                    <div className="p-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            {niche.trend === "up" && <TrendingUp size={13} className="text-emerald-400" />}
                            {niche.trend === "stable" && <BarChart3 size={13} className="text-cyan-400" />}
                            <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">{niche.name}</h3>
                          </div>
                          <Badge variant="neutral">{niche.category}</Badge>
                        </div>
                        <Badge variant={competitionColors[niche.competition] || "neutral"}>
                          {niche.competition} Competition
                        </Badge>
                      </div>

                      {/* Tags */}
                      {niche.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {niche.tags.map((tag) => (
                            <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-white/5 text-slate-500 border border-white/8">{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Potential */}
                      <div className="mb-4">
                        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest font-[family-name:var(--font-syne)] block mb-1.5">
                          Niche Potential
                        </span>
                        <PotentialMeter score={niche.potential} />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-4 gap-3 mb-4">
                        {[
                          { label: "Avg Views", value: niche.avgViews, icon: Eye },
                          { label: "Avg Subs", value: niche.avgSubs, icon: Users },
                          { label: "RPM", value: niche.rpm, icon: DollarSign },
                          { label: "Top Channels", value: String(niche.topChannels), icon: Play },
                        ].map((s) => (
                          <div key={s.label} className="text-center">
                            <s.icon size={12} className="text-slate-500 mx-auto mb-1" />
                            <p className="text-xs font-bold text-white font-[family-name:var(--font-syne)] leading-tight">{s.value}</p>
                            <p className="text-[9px] text-slate-600">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Why Now */}
                      {niche.whyNow && (
                        <div className="flex gap-2 mb-4 p-2.5 rounded-lg bg-white/3 border border-white/5">
                          <Lightbulb size={12} className="text-yellow-400 shrink-0 mt-0.5" />
                          <p className="text-[11px] text-slate-400 leading-relaxed">{niche.whyNow}</p>
                        </div>
                      )}

                      {/* Content Ideas expandable */}
                      {niche.contentIdeas?.length ? (
                        <div className="mb-4">
                          <button
                            onClick={() => setExpandedNiche(isExpanded ? null : niche.id)}
                            className="text-xs text-cyan-500 hover:text-cyan-300 transition-colors font-medium"
                          >
                            {isExpanded ? "▲ Hide content ideas" : `▼ Show ${niche.contentIdeas.length} content ideas`}
                          </button>
                          {isExpanded && (
                            <ul className="mt-2 space-y-1">
                              {niche.contentIdeas.map((idea, i) => (
                                <li key={i} className="text-xs text-slate-400 flex gap-2">
                                  <span className="text-cyan-500 font-bold">{i + 1}.</span> {idea}
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ) : null}

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => toggleSave(niche.id)}
                          className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all border ${
                            niche.saved
                              ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                              : "border-white/8 text-slate-500 hover:border-white/15 hover:text-slate-300"
                          }`}
                        >
                          <BookmarkPlus size={12} />
                          {niche.saved ? "Saved" : "Save"}
                        </button>
                        <button className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-cyan-500/15 to-cyan-600/10 border border-cyan-500/25 text-cyan-300 text-xs font-bold font-[family-name:var(--font-syne)] hover:from-cyan-500/20 transition-all">
                          <Zap size={12} />
                          Explore Niche
                          <ArrowRight size={11} className="ml-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <button
                onClick={handleSearch}
                disabled={generating}
                className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-400 transition-colors disabled:opacity-50"
              >
                <RefreshCw size={14} className={generating ? "animate-spin" : ""} />
                {generating ? "Refreshing…" : "Refresh niche analysis"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
