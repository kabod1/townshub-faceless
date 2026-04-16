"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import {
  ScrollText, Search, PenLine, Eye, Copy, Trash2,
  Download, Clock, SortAsc, FileText, ChevronUp, CheckCircle2, X,
} from "lucide-react";

// ─── Score helpers (mirrored from new-script page) ──────────────────────────
function computeScores(secs: { title: string; content: string; wordCount: number }[]) {
  const full = secs.map(s => s.content).join(" ");
  const words = full.toLowerCase().split(/\s+/).filter(Boolean);
  const ttr = new Set(words).size / Math.max(words.length, 1);
  const originality = Math.min(97, Math.max(62, Math.round(ttr * 190 + 38)));
  const pw = ["discover","secret","reveal","proven","transform","amazing","shocking","never","always","you","your","imagine","because","instantly","truth","real","actually","exactly","seriously","powerful","incredible","fascinating"];
  const phits = words.filter(w => pw.some(p => w.includes(p))).length;
  const qs = (full.match(/\?/g) || []).length;
  const karisma = Math.min(97, Math.max(66, Math.round(66 + (phits / Math.max(words.length, 1)) * 450 + qs * 1.8)));
  const lens = secs.map(s => (s.content || "").split(/\s+/).length);
  const avg = lens.reduce((a, b) => a + b, 0) / Math.max(lens.length, 1);
  const cv = Math.sqrt(lens.reduce((s, l) => s + (l - avg) ** 2, 0) / Math.max(lens.length, 1)) / Math.max(avg, 1);
  const trans = (full.match(/\b(first|second|third|next|then|finally|however|moreover|furthermore|therefore|additionally|meanwhile)\b/gi) || []).length;
  const structure = Math.min(97, Math.max(68, Math.round((1 - cv) * 60 + 38 + Math.min(20, trans * 1.8))));
  const cont = (full.match(/\b(I'm|you're|it's|don't|can't|won't|I've|we're|they're|isn't|aren't|wasn't|weren't|I'd|you'd|let's|that's|here's|there's)\b/gi) || []).length;
  const pron = words.filter(w => ["i","you","we","us","me","my","our","your"].includes(w)).length;
  const conv = (full.match(/\b(look|listen|think about|imagine|picture|consider|right|okay|so|well|now|actually|honestly|frankly)\b/gi) || []).length;
  const humanTone = Math.min(97, Math.max(64, Math.round(64 + cont * 1.8 + (pron / Math.max(words.length, 1)) * 140 + conv * 1.4)));
  return { originality, karisma, structure, humanTone };
}

function getSectionLabel(title: string, idx: number): string {
  const t = title.toLowerCase();
  if (idx === 0 || t.includes("hook") || (t.includes("intro") && idx === 0)) return "HOOK";
  if (t.includes("conclusion") || t.includes("outro") || t.includes("closing") || t.includes("wrap")) return "OUTRO";
  if (t.includes("cta") || t.includes("call to action")) return "CTA";
  return `SECTION ${idx}`;
}

const LABEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  HOOK:    { bg: "rgba(251,146,60,0.1)",   color: "#fb923c", border: "rgba(251,146,60,0.3)" },
  INTRO:   { bg: "rgba(0,212,255,0.08)",   color: "#00D4FF", border: "rgba(0,212,255,0.25)" },
  OUTRO:   { bg: "rgba(168,85,247,0.1)",   color: "#a855f7", border: "rgba(168,85,247,0.3)" },
  CTA:     { bg: "rgba(34,197,94,0.08)",   color: "#22c55e", border: "rgba(34,197,94,0.25)" },
  DEFAULT: { bg: "rgba(255,255,255,0.05)", color: "#64748b", border: "rgba(255,255,255,0.1)" },
};
function getLabelStyle(label: string) { return LABEL_COLORS[label] || LABEL_COLORS.DEFAULT; }

interface ScriptSection { id: string; title: string; content: string; wordCount: number; }
interface SavedScript {
  id: string; title: string; niche: string; format: string;
  words: number; duration: number; createdAt: string;
  status: "draft" | "final" | "published"; sections: ScriptSection[];
}

const statusCycle: Record<string, "draft" | "final" | "published"> = { draft: "final", final: "published", published: "draft" };
const statusStyle: Record<string, { bg: string; color: string; border: string }> = {
  draft: { bg: "rgba(255,255,255,0.05)", color: "#64748b", border: "rgba(255,255,255,0.08)" },
  final: { bg: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "rgba(0,212,255,0.2)" },
  published: { bg: "rgba(52,211,153,0.1)", color: "#34d399", border: "rgba(52,211,153,0.2)" },
};

export default function ScriptsPage() {
  const [scripts, setScripts] = useState<SavedScript[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("scripts").select("*").order("created_at", { ascending: false });
      if (data) {
        setScripts(data.map((s) => ({
          id: s.id, title: s.title, niche: s.niche || "General", format: s.format || "listicle",
          words: s.words || 0, duration: s.duration || 10,
          createdAt: new Date(s.created_at).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
          status: s.status as "draft" | "final" | "published", sections: s.sections || [],
        })));
      }
      setHydrated(true);
    };
    load();
  }, []);

  const filtered = scripts.filter((s) => {
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.niche.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || s.status === filter;
    return matchSearch && matchFilter;
  }).sort(() => sortDesc ? 1 : -1);

  const deleteScript = async (id: string) => {
    const supabase = createClient();
    await supabase.from("scripts").delete().eq("id", id);
    setScripts((prev) => prev.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const cycleStatus = async (id: string) => {
    const script = scripts.find((s) => s.id === id);
    if (!script) return;
    const newStatus = statusCycle[script.status];
    const supabase = createClient();
    await supabase.from("scripts").update({ status: newStatus }).eq("id", id);
    setScripts((prev) => prev.map((s) => s.id === id ? { ...s, status: newStatus } : s));
  };

  const copyScript = (script: SavedScript) => {
    const text = script.sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadScript = (script: SavedScript) => {
    const text = `# ${script.title}\n\n` + script.sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${script.title.slice(0, 50).replace(/[^a-z0-9]/gi, "-")}.txt`; a.click();
    URL.revokeObjectURL(url);
  };

  const statCards = [
    { label: "Total Scripts", value: scripts.length, color: "#00D4FF" },
    { label: "Published", value: scripts.filter(s => s.status === "published").length, color: "#34d399" },
    { label: "In Draft", value: scripts.filter(s => s.status === "draft").length, color: "#facc15" },
    { label: "Scripts Left", value: Math.max(0, 4 - scripts.length), color: "#fb923c" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="My Scripts" subtitle={`${scripts.length} scripts saved`}
        action={{ label: "New Script", href: "/dashboard/new-script", icon: <PenLine size={13} /> }} />

      <div style={{ padding: "28px 32px", maxWidth: 1000, margin: "0 auto" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 24 }}>
          {statCards.map((s) => (
            <div key={s.label} style={{
              padding: "18px 20px", borderRadius: 14,
              background: "linear-gradient(135deg, rgba(15,24,42,0.9), rgba(8,13,26,0.95))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
              <p style={{ fontSize: 28, fontWeight: 800, color: s.color, margin: "0 0 4px", letterSpacing: "-1px" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          <div style={{ position: "relative", flex: "0 0 260px" }}>
            <Search size={13} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or niche…"
              style={{ width: "100%", boxSizing: "border-box", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10, padding: "10px 14px 10px 34px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
              onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
              onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["all", "draft", "final", "published"].map((f) => (
              <button key={f} onClick={() => setFilter(f)} style={{
                padding: "8px 14px", borderRadius: 9, fontSize: 12, fontWeight: 600,
                cursor: "pointer", border: "none", transition: "all 0.15s", textTransform: "capitalize",
                background: filter === f ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.03)",
                color: filter === f ? "#00D4FF" : "#475569",
                outline: filter === f ? "1px solid rgba(0,212,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
              }}>{f}</button>
            ))}
          </div>
          <button onClick={() => setSortDesc(!sortDesc)} style={{
            marginLeft: "auto", display: "flex", alignItems: "center", gap: 6,
            fontSize: 12, color: "#94a3b8", background: "none", border: "none", cursor: "pointer",
          }}>
            <SortAsc size={13} style={{ transform: sortDesc ? "none" : "rotate(180deg)" }} />
            {sortDesc ? "Newest first" : "Oldest first"}
          </button>
        </div>

        {/* Content */}
        {!hydrated ? null : filtered.length === 0 ? (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <FileText size={26} color="#475569" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", margin: "0 0 6px" }}>
              {scripts.length > 0 && filter !== "all" ? "No scripts match this filter" : "No scripts yet"}
            </p>
            <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 20px" }}>
              {scripts.length > 0 ? "Try a different filter" : "Create your first AI-powered YouTube script."}
            </p>
            {scripts.length === 0 && (
              <Link href="/dashboard/new-script" style={{
                display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 20px", borderRadius: 10,
                background: "linear-gradient(135deg, #00D4FF, #0080cc)", color: "#04080F",
                fontSize: 13, fontWeight: 700, textDecoration: "none",
              }}>
                <PenLine size={14} /> Write your first script
              </Link>
            )}
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {filtered.map((script) => {
              const isExpanded = expandedId === script.id;
              const ss = statusStyle[script.status];
              return (
                <div key={script.id} style={{
                  borderRadius: 14, overflow: "hidden",
                  background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, padding: "16px 18px" }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: "rgba(0,212,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <ScrollText size={17} color="#00D4FF" />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{script.title}</p>
                        <button onClick={() => cycleStatus(script.id)} style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, cursor: "pointer",
                          background: ss.bg, color: ss.color, border: `1px solid ${ss.border}`,
                          textTransform: "capitalize",
                        }}>{script.status}</button>
                      </div>
                      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                        {[script.format, `${script.words.toLocaleString()} words`, `${script.duration} min`].map((item, i) => (
                          <span key={i} style={{ fontSize: 11, color: "#64748b", textTransform: "capitalize" }}>{item}{i < 2 ? " ·" : ""}</span>
                        ))}
                        <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#64748b" }}>
                          <Clock size={9} /> {script.createdAt}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 4, flexShrink: 0 }}>
                      {[
                        { icon: isExpanded ? ChevronUp : Eye, title: "Toggle", onClick: () => setExpandedId(isExpanded ? null : script.id), hoverColor: "#00D4FF" },
                        { icon: copiedId === script.id ? CheckCircle2 : Copy, title: "Copy", onClick: () => copyScript(script), hoverColor: "#94a3b8" },
                        { icon: Download, title: "Download", onClick: () => downloadScript(script), hoverColor: "#94a3b8" },
                        { icon: Trash2, title: "Delete", onClick: () => deleteScript(script.id), hoverColor: "#f87171" },
                      ].map((btn, i) => (
                        <button key={i} title={btn.title} onClick={btn.onClick} style={{
                          width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
                          borderRadius: 8, border: "none", background: "transparent", cursor: "pointer", color: "#64748b",
                          transition: "all 0.15s",
                        }}
                          onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)"; (e.currentTarget as HTMLButtonElement).style.color = btn.hoverColor; }}
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#64748b"; }}
                        >
                          <btn.icon size={14} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {isExpanded && script.sections?.length > 0 && (() => {
                    const scores = computeScores(script.sections);
                    const scoreCards = [
                      { label: "Originality", value: scores.originality, color: "#a855f7" },
                      { label: "Karisma",     value: scores.karisma,     color: "#fb923c" },
                      { label: "Structure",   value: scores.structure,   color: "#3b82f6" },
                      { label: "Human Tone",  value: scores.humanTone,   color: "#22c55e" },
                    ];
                    return (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 18px" }}>
                        {/* Score cards */}
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                          {scoreCards.map(sc => (
                            <div key={sc.label} style={{
                              padding: "12px 14px", borderRadius: 10,
                              background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.05)",
                            }}>
                              <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                                <span style={{ fontSize: 22, fontWeight: 900, color: sc.color, lineHeight: 1, letterSpacing: "-1px" }}>{sc.value}</span>
                                <span style={{ fontSize: 9, color: "#475569", marginBottom: 2 }}>/100</span>
                              </div>
                              <div style={{ height: 2, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden", marginBottom: 4 }}>
                                <div style={{ height: "100%", width: `${sc.value}%`, background: sc.color, borderRadius: 99 }} />
                              </div>
                              <span style={{ fontSize: 9, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.08em" }}>{sc.label}</span>
                            </div>
                          ))}
                        </div>

                        {/* Sections with format markers */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                          {script.sections.map((section, i) => {
                            const lbl = getSectionLabel(section.title, i);
                            const ls = getLabelStyle(lbl);
                            return (
                              <div key={section.id} style={{ borderRadius: 10, background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.05)", padding: "14px 16px" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                  <span style={{
                                    fontSize: 8, fontWeight: 800, padding: "2px 7px", borderRadius: 4, letterSpacing: "0.1em", flexShrink: 0,
                                    background: ls.bg, color: ls.color, border: `1px solid ${ls.border}`,
                                  }}>{lbl}</span>
                                  <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", margin: 0 }}>{section.title}</p>
                                  {section.wordCount > 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: "#475569" }}>{section.wordCount}w</span>}
                                </div>
                                <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.65, margin: 0, whiteSpace: "pre-wrap" }}>{section.content}</p>
                              </div>
                            );
                          })}
                        </div>
                        <button onClick={() => setExpandedId(null)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer", marginTop: 12 }}>
                          <X size={11} /> Collapse
                        </button>
                      </div>
                    );
                  })()}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
