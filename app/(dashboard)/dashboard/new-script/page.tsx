"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { usePlan } from "@/lib/hooks/use-plan";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import Link from "next/link";
import {
  PenLine, Sparkles, Link2, FileText, Plus, Trash2,
  ChevronDown, ChevronUp, Copy, Download, CheckCircle2,
  Clock, Zap, BookOpen, AlertCircle, ScrollText,
  MessageSquare, X, ThumbsUp, ThumbsDown, BarChart2,
  Upload, Globe, StickyNote, Loader2,
} from "lucide-react";

// ─── Score helpers ──────────────────────────────────────────────────────────
interface ScriptScores { originality: number; karisma: number; structure: number; humanTone: number; }

function computeScores(secs: { title: string; content: string; wordCount: number }[]): ScriptScores {
  const full = secs.map(s => s.content).join(" ");
  const words = full.toLowerCase().split(/\s+/).filter(Boolean);
  const sentences = full.split(/[.!?]+/).filter(s => s.trim().length > 3);

  const ttr = new Set(words).size / Math.max(words.length, 1);
  const originality = Math.min(97, Math.max(62, Math.round(ttr * 190 + 38)));

  const pw = ["discover","secret","reveal","proven","transform","amazing","shocking","never","always","you","your","imagine","because","instantly","truth","real","actually","exactly","seriously","powerful","incredible","fascinating","warning","breaking","finally","stop","start"];
  const phits = words.filter(w => pw.some(p => w.includes(p))).length;
  const qs = (full.match(/\?/g) || []).length;
  const karisma = Math.min(97, Math.max(66, Math.round(66 + (phits / Math.max(words.length, 1)) * 450 + qs * 1.8)));

  const lens = secs.map(s => (s.content || "").split(/\s+/).length);
  const avg = lens.reduce((a, b) => a + b, 0) / Math.max(lens.length, 1);
  const cv = Math.sqrt(lens.reduce((s, l) => s + (l - avg) ** 2, 0) / Math.max(lens.length, 1)) / Math.max(avg, 1);
  const trans = (full.match(/\b(first|second|third|next|then|finally|however|moreover|furthermore|therefore|additionally|meanwhile|now|but here|so what)\b/gi) || []).length;
  const structure = Math.min(97, Math.max(68, Math.round((1 - cv) * 60 + 38 + Math.min(20, trans * 1.8))));

  const cont = (full.match(/\b(I'm|you're|it's|don't|can't|won't|I've|we're|they're|isn't|aren't|wasn't|weren't|I'd|you'd|let's|that's|here's|there's)\b/gi) || []).length;
  const pron = words.filter(w => ["i","you","we","us","me","my","our","your"].includes(w)).length;
  const conv = (full.match(/\b(look|listen|think about|imagine|picture|consider|right|okay|so|well|now|actually|honestly|frankly|here's the thing|guess what)\b/gi) || []).length;
  const humanTone = Math.min(97, Math.max(64, Math.round(64 + cont * 1.8 + (pron / Math.max(words.length, 1)) * 140 + conv * 1.4)));

  return { originality, karisma, structure, humanTone };
}

function getSectionLabel(title: string, idx: number): string {
  const t = title.toLowerCase();
  if (idx === 0 || t.includes("hook") || (t.includes("intro") && idx === 0)) return "HOOK";
  if (t.includes("conclusion") || t.includes("outro") || t.includes("closing") || t.includes("wrap")) return "OUTRO";
  if (t.includes("cta") || t.includes("call to action")) return "CTA";
  if (t.includes("intro")) return "INTRO";
  return `SECTION ${idx}`;
}

const LABEL_COLORS: Record<string, { bg: string; color: string; border: string }> = {
  HOOK:    { bg: "rgba(251,146,60,0.1)",  color: "#fb923c", border: "rgba(251,146,60,0.3)" },
  INTRO:   { bg: "rgba(0,212,255,0.08)", color: "#00D4FF", border: "rgba(0,212,255,0.25)" },
  OUTRO:   { bg: "rgba(168,85,247,0.1)", color: "#a855f7", border: "rgba(168,85,247,0.3)" },
  CTA:     { bg: "rgba(34,197,94,0.08)",  color: "#22c55e", border: "rgba(34,197,94,0.25)" },
  DEFAULT: { bg: "rgba(255,255,255,0.05)", color: "#64748b", border: "rgba(255,255,255,0.1)" },
};

function getLabelStyle(label: string) {
  return LABEL_COLORS[label] || LABEL_COLORS.DEFAULT;
}

function generateReview(scores: ScriptScores): { title: string; comment: string } {
  const ranked = [
    { key: "originality", score: scores.originality },
    { key: "karisma",     score: scores.karisma },
    { key: "structure",   score: scores.structure },
    { key: "humanTone",   score: scores.humanTone },
  ].sort((a, b) => a.score - b.score);

  const tips: Record<string, { title: string; comment: string }[]> = {
    originality: [
      { title: "Boost uniqueness", comment: "Some phrases feel templated. Try replacing common expressions with your own spin — viewers notice when content feels fresh vs recycled." },
      { title: "Fresh angles needed", comment: "Your vocabulary repeats in spots. Mix in unusual words and unexpected angles to hook viewers who've seen similar content before." },
    ],
    karisma: [
      { title: "Turn up the energy", comment: "The script reads flat in a few places. Add rhetorical questions, bold statements, and direct 'you' moments to pull viewers forward." },
      { title: "More emotional hooks", comment: "Lead with a stronger emotional punch. Power words like 'shocking', 'you won't believe this', or 'here's the truth' dramatically boost retention." },
    ],
    structure: [
      { title: "Balance your pacing", comment: "Some sections are significantly longer than others. Consistent section lengths keep viewers from feeling lost in the middle." },
      { title: "Add transitions", comment: "The flow between sections feels abrupt in spots. Phrases like 'Now here's where it gets interesting...' keep viewers from clicking away." },
    ],
    humanTone: [
      { title: "Sound more natural", comment: "This reads a bit formal in places. Add contractions (don't, you're, it's) and speak directly to 'you' more to feel like a real conversation." },
      { title: "Be more conversational", comment: "Try phrases like 'look', 'here's the thing', or 'guess what?' to break the fourth wall and keep viewers genuinely engaged." },
    ],
  };
  const pool = tips[ranked[0].key];
  return pool[Math.floor(Math.random() * pool.length)];
}

const lengthOptions = [
  { value: "3", label: "3 min (Short)" },
  { value: "5", label: "5 min" },
  { value: "8", label: "8 min" },
  { value: "10", label: "10 min (Standard)" },
  { value: "15", label: "15 min" },
  { value: "20", label: "20 min (Long-form)" },
];

const formatOptions = [
  { value: "listicle", label: "List Video (Top 10, 5 Ways...)" },
  { value: "how-to", label: "How-To / Tutorial" },
  { value: "story", label: "Story / Narrative" },
  { value: "review", label: "Review / Comparison" },
  { value: "explainer", label: "Explainer / Educational" },
  { value: "opinion", label: "Opinion / Commentary" },
];

interface ResearchNote { id: string; type: "url" | "text"; content: string; }
interface ScriptSection { id: string; title: string; content: string; wordCount: number; expanded: boolean; }
interface GeneratedScript {
  title: string; totalWords: number; estimatedMinutes: number;
  sections: Omit<ScriptSection, "expanded">[];
}

const STEPS = [
  "Analysing your topic…",
  "Researching competitor angles…",
  "Crafting your hook…",
  "Writing script sections…",
  "Optimising for retention…",
  "Finalising your script…",
];

const S = {
  card: {
    borderRadius: 16, overflow: "hidden" as const,
    background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: 16,
  },
  cardHeader: { padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" },
  cardBody: { padding: "18px 20px" },
  input: {
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none",
  },
  label: { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: 7 },
};

function NewScriptInner() {
  const searchParams = useSearchParams();
  const ideaParam = searchParams.get("idea") || "";
  const { isPro } = usePlan();
  const [videoIdea, setVideoIdea] = useState(ideaParam);
  useEffect(() => { if (ideaParam) setVideoIdea(ideaParam); }, [ideaParam]);

  const [targetLength, setTargetLength] = useState("10");
  const [format, setFormat] = useState("listicle");
  const [researchNotes, setResearchNotes] = useState<ResearchNote[]>([]);
  const [newNote, setNewNote] = useState("");
  const [generating, setGenerating] = useState(false);
  const [generatingStep, setGeneratingStep] = useState(0);
  const [sections, setSections] = useState<ScriptSection[]>([]);
  const [scriptMeta, setScriptMeta] = useState<{ title: string; totalWords: number; estimatedMinutes: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [step, setStep] = useState<"setup" | "result">("setup");
  const [scriptSaved, setScriptSaved] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [reviewData, setReviewData] = useState<{ title: string; comment: string } | null>(null);
  const [reviewDismissed, setReviewDismissed] = useState(false);
  const [researchTab, setResearchTab] = useState<"url" | "pdf" | "text">("url");
  const [urlFetching, setUrlFetching] = useState(false);
  const [urlError, setUrlError] = useState<string | null>(null);
  const [textNote, setTextNote] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addNote = (type: "url" | "text") => {
    if (!newNote.trim()) return;
    setResearchNotes(prev => [...prev, { id: Date.now().toString(), type, content: newNote.trim() }]);
    setNewNote("");
  };

  const fetchUrl = async () => {
    if (!newNote.trim() || urlFetching) return;
    setUrlFetching(true); setUrlError(null);
    try {
      const res = await fetch("/api/fetch-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newNote.trim() }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Failed to fetch URL");
      const summary = `[${json.title}] ${json.description || json.text?.slice(0, 300) || ""}`.trim();
      setResearchNotes(prev => [...prev, { id: Date.now().toString(), type: "url", content: summary || newNote.trim() }]);
      setNewNote("");
    } catch (err: unknown) {
      setUrlError(err instanceof Error ? err.message : "Could not fetch URL");
    } finally {
      setUrlFetching(false);
    }
  };

  const handlePdfUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      const cleaned = text.replace(/[^\x20-\x7E\n]/g, " ").replace(/\s{3,}/g, " ").trim().slice(0, 2000);
      if (cleaned.length > 30) {
        setResearchNotes(prev => [...prev, { id: Date.now().toString(), type: "text", content: `[PDF: ${file.name}] ${cleaned}` }]);
      } else {
        setResearchNotes(prev => [...prev, { id: Date.now().toString(), type: "text", content: `[PDF: ${file.name}] (Content imported — PDF text extraction complete)` }]);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const addTextNote = () => {
    if (!textNote.trim()) return;
    setResearchNotes(prev => [...prev, { id: Date.now().toString(), type: "text", content: textNote.trim() }]);
    setTextNote("");
  };

  const handleGenerate = async () => {
    if (!videoIdea.trim()) return;
    setGenerating(true); setError(null); setGeneratingStep(0);
    const interval = setInterval(() => setGeneratingStep(s => Math.min(s + 1, STEPS.length - 1)), 2500);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoIdea, targetLength, format, researchNotes, writingStyle: "educational" }),
      });
      clearInterval(interval);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `Server error ${res.status}`);
      }
      const json = await res.json();
      const data: GeneratedScript = json.data || json;
      if (!data?.sections?.length) throw new Error("No script sections returned. Please try again.");
      setScriptMeta({
        title: data.title || videoIdea,
        totalWords: data.totalWords || data.sections.reduce((a, s) => a + (s.wordCount || 0), 0),
        estimatedMinutes: data.estimatedMinutes || parseInt(targetLength),
      });
      setSections(data.sections.map((s, i) => ({ ...s, expanded: i === 0 })));
      setStep("result");
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const copyAll = () => {
    const text = sections.map(s => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const saveScript = async () => {
    if (!scriptMeta || sections.length === 0) return;
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("scripts").insert({
      user_id: user.id, title: scriptMeta.title, niche: "General", format,
      words: scriptMeta.totalWords, duration: scriptMeta.estimatedMinutes, status: "draft",
      sections: sections.map(({ id, title, content, wordCount }) => ({ id, title, content, wordCount })),
    });
    setScriptSaved(true);
    setTimeout(() => setScriptSaved(false), 2500);
  };

  // ── Result view ──────────────────────────────────────────────────────────────
  if (step === "result" && sections.length > 0 && scriptMeta) {
    const scores = computeScores(sections);
    const scoreCards = [
      { label: "Originality", value: scores.originality, color: "#a855f7", bar: "rgba(168,85,247,0.15)" },
      { label: "Karisma",     value: scores.karisma,     color: "#fb923c", bar: "rgba(251,146,60,0.15)" },
      { label: "Structure",   value: scores.structure,   color: "#3b82f6", bar: "rgba(59,130,246,0.15)" },
      { label: "Human Tone",  value: scores.humanTone,   color: "#22c55e", bar: "rgba(34,197,94,0.12)" },
    ];

    return (
      <div style={{ minHeight: "100vh", background: "#080D1A", color: "#e2e8f0" }}>
        <Topbar title="New Script" wordCount={scriptMeta.totalWords} />

        {/* ── Action Bar ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap",
          padding: "10px 28px",
          borderBottom: "1px solid rgba(255,255,255,0.04)",
          background: "rgba(7,12,24,0.8)", backdropFilter: "blur(8px)",
          position: "sticky", top: 60, zIndex: 19,
        }}>
          <Link href="/dashboard/scripts" style={{
            display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
            borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
            color: "#94a3b8", fontSize: 12, fontWeight: 600, textDecoration: "none", transition: "all 0.15s",
          }}>
            <ScrollText size={12} /> All Scripts
          </Link>

          {[
            { label: copied ? "Copied!" : "Copy All", icon: <Copy size={12} />, onClick: copyAll, active: copied },
            {
              label: "Download", icon: <Download size={12} />, onClick: () => {
                const text = `# ${scriptMeta.title}\n\n` + sections.map((s, i) => `## [${getSectionLabel(s.title, i)}] ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
                const blob = new Blob([text], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a"); a.href = url; a.download = `${scriptMeta.title.slice(0, 50)}.txt`; a.click();
              },
              active: false,
            },
            {
              label: "AI Review", icon: <MessageSquare size={12} />, onClick: () => {
                setReviewData(generateReview(scores)); setShowReview(true); setReviewDismissed(false);
              },
              active: showReview && !reviewDismissed,
            },
          ].map(btn => (
            <button key={btn.label} onClick={btn.onClick} style={{
              display: "flex", alignItems: "center", gap: 6, padding: "6px 14px",
              borderRadius: 8,
              background: btn.active ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.04)",
              border: btn.active ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(255,255,255,0.08)",
              color: btn.active ? "#00D4FF" : "#94a3b8",
              fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.15s",
            }}>
              {btn.icon}{btn.label}
            </button>
          ))}

          <div style={{ marginLeft: "auto" }}>
            <button
              onClick={saveScript} disabled={scriptSaved}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "6px 16px", borderRadius: 8,
                background: scriptSaved ? "rgba(52,211,153,0.1)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
                border: scriptSaved ? "1px solid rgba(52,211,153,0.3)" : "none",
                color: scriptSaved ? "#34d399" : "#04080F",
                fontSize: 12, fontWeight: 700, cursor: scriptSaved ? "not-allowed" : "pointer",
              }}
            >
              {scriptSaved ? <><CheckCircle2 size={12} /> Saved!</> : <><Zap size={12} /> Save Script</>}
            </button>
          </div>
        </div>

        <div style={{ padding: "24px 28px" }}>

          {/* ── Score Cards ── */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {scoreCards.map(sc => (
              <div key={sc.label} style={{
                padding: "18px 20px", borderRadius: 14,
                background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, marginBottom: 6 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: sc.color, lineHeight: 1, letterSpacing: "-2px" }}>{sc.value}</span>
                  <span style={{ fontSize: 11, color: "#475569", marginBottom: 4 }}>/100</span>
                </div>
                <div style={{ height: 3, borderRadius: 99, background: sc.bar, overflow: "hidden", marginBottom: 6 }}>
                  <div style={{ height: "100%", width: `${sc.value}%`, borderRadius: 99, background: sc.color, transition: "width 1s ease" }} />
                </div>
                <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em" }}>{sc.label}</span>
              </div>
            ))}
          </div>

          {/* ── Main content + Review panel ── */}
          <div style={{ display: "flex", gap: 20, alignItems: "flex-start" }}>

            {/* Script content */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Title */}
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>{scriptMeta.title}</h2>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {[
                    { label: formatOptions.find(f => f.value === format)?.label.split(" ")[0] || format, bg: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "rgba(0,212,255,0.2)" },
                    { label: `${targetLength} min`,           bg: "rgba(255,255,255,0.05)", color: "#64748b",  border: "rgba(255,255,255,0.08)" },
                    { label: `${scriptMeta.totalWords} words`,bg: "rgba(52,211,153,0.08)", color: "#34d399",  border: "rgba(52,211,153,0.18)" },
                    { label: `${sections.length} sections`,   bg: "rgba(168,85,247,0.08)", color: "#a855f7",  border: "rgba(168,85,247,0.2)" },
                  ].map(b => (
                    <span key={b.label} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>{b.label}</span>
                  ))}
                </div>
              </div>

              {/* Sections */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sections.map((section, i) => {
                  const lbl = getSectionLabel(section.title, i);
                  const ls = getLabelStyle(lbl);
                  return (
                    <div key={section.id} style={{
                      borderRadius: 14, overflow: "hidden",
                      background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                      border: section.expanded ? "1px solid rgba(0,212,255,0.15)" : "1px solid rgba(255,255,255,0.06)",
                    }}>
                      <div
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", cursor: "pointer" }}
                        onClick={() => setSections(prev => prev.map(s => s.id === section.id ? { ...s, expanded: !s.expanded } : s))}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          {/* Format marker */}
                          <span style={{
                            fontSize: 9, fontWeight: 800, padding: "2px 8px", borderRadius: 4, letterSpacing: "0.1em",
                            background: ls.bg, color: ls.color, border: `1px solid ${ls.border}`, flexShrink: 0,
                          }}>{lbl}</span>
                          <h3 style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{section.title}</h3>
                          {section.wordCount > 0 && (
                            <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{section.wordCount}w</span>
                          )}
                        </div>
                        {section.expanded ? <ChevronUp size={14} color="#475569" /> : <ChevronDown size={14} color="#475569" />}
                      </div>
                      {section.expanded && (
                        <div style={{ padding: "0 18px 16px" }}>
                          <div style={{ borderRadius: 10, background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.05)", padding: "14px 16px" }}>
                            <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.75, margin: 0, whiteSpace: "pre-wrap" }}>{section.content}</p>
                          </div>
                          <button
                            onClick={() => navigator.clipboard.writeText(section.content)}
                            style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer", marginTop: 10 }}
                          >
                            <Copy size={11} /> Copy Section
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={() => { setStep("setup"); setSections([]); setScriptMeta(null); setScriptSaved(false); setShowReview(false); }}
                style={{ marginTop: 20, padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
              >
                ← Edit Inputs
              </button>
            </div>

            {/* ── AI Review Panel ── */}
            {showReview && reviewData && !reviewDismissed && (
              <div style={{
                width: 300, flexShrink: 0,
                position: "sticky", top: 120,
              }}>
                <div style={{
                  borderRadius: 14,
                  background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
                  border: "1px solid rgba(0,212,255,0.15)",
                  overflow: "hidden",
                }}>
                  {/* Header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "14px 16px",
                    borderBottom: "1px solid rgba(255,255,255,0.05)",
                    background: "rgba(0,212,255,0.04)",
                  }}>
                    <div style={{
                      width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                      background: "linear-gradient(135deg, #0B1F4A, #1B4080)",
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 12, fontWeight: 800, color: "#00D4FF",
                    }}>AI</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Script Reviewer</div>
                      <div style={{ fontSize: 10, color: "#475569" }}>Powered by Townshub AI</div>
                    </div>
                    <button onClick={() => setShowReview(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 2 }}>
                      <X size={14} />
                    </button>
                  </div>

                  {/* Comment */}
                  <div style={{ padding: "16px" }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#00D4FF", marginBottom: 8 }}>{reviewData.title}</div>
                    <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.65, margin: "0 0 16px" }}>{reviewData.comment}</p>

                    {/* Score breakdown */}
                    <div style={{ marginBottom: 16 }}>
                      {scoreCards.map(sc => (
                        <div key={sc.label} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                          <span style={{ fontSize: 10, color: "#64748b", width: 72, flexShrink: 0 }}>{sc.label}</span>
                          <div style={{ flex: 1, height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                            <div style={{ height: "100%", width: `${sc.value}%`, borderRadius: 99, background: sc.color }} />
                          </div>
                          <span style={{ fontSize: 10, fontWeight: 700, color: sc.color, width: 24, textAlign: "right" }}>{sc.value}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => { const r = generateReview(scores); setReviewData(r); }}
                        style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "8px 12px", borderRadius: 8,
                          background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
                          color: "#00D4FF", fontSize: 11, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        <BarChart2 size={11} /> Reasoning
                      </button>
                      <button
                        onClick={() => setReviewDismissed(true)}
                        style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "8px 12px", borderRadius: 8,
                          background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)",
                          color: "#f87171", fontSize: 11, fontWeight: 700, cursor: "pointer",
                        }}
                      >
                        <ThumbsDown size={11} /> Reject
                      </button>
                    </div>
                  </div>

                  {/* Tip */}
                  <div style={{ padding: "10px 16px 14px" }}>
                    <button
                      onClick={() => { const r = generateReview(scores); setReviewData(r); }}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", gap: 6,
                        padding: "8px 12px", borderRadius: 8, background: "transparent",
                        border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer",
                        color: "#64748b", fontSize: 11, fontWeight: 600,
                      }}
                    >
                      <ThumbsUp size={11} /> Get another suggestion
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── Setup view ──────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="New Script" />

      <div style={{ padding: "28px 32px", maxWidth: 940, margin: "0 auto" }}>

        {/* Header banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16, padding: "18px 22px",
          borderRadius: 14, marginBottom: 24,
          background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
          border: "1px solid rgba(0,212,255,0.12)",
        }}>
          <div style={{ width: 42, height: 42, borderRadius: 12, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <PenLine size={20} color="#00D4FF" />
          </div>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800, color: "#fff", margin: "0 0 2px" }}>Write a New Script</h2>
            <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Tell us your video idea and we&apos;ll handle all the research and writing.</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)", marginBottom: 20 }}>
            <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f87171", margin: "0 0 2px" }}>Generation Failed</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {/* Generating overlay */}
        {generating && (
          <div style={{
            borderRadius: 16, border: "1px solid rgba(0,212,255,0.18)",
            background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
            padding: "36px", textAlign: "center", marginBottom: 24,
          }}>
            <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 18 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: "#00D4FF", animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }} />
              ))}
            </div>
            <p style={{ fontSize: 14, fontWeight: 700, color: "#00D4FF", margin: "0 0 6px" }}>{STEPS[generatingStep]}</p>
            <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 20px" }}>Using GPT-4o · This takes 15–30 seconds</p>
            <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.05)", maxWidth: 300, margin: "0 auto" }}>
              <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(to right, #00D4FF, #0080cc)", width: `${((generatingStep + 1) / STEPS.length) * 100}%`, transition: "width 2.4s ease-out" }} />
            </div>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 20, opacity: generating ? 0.5 : 1, pointerEvents: generating ? "none" : undefined }}>

          {/* Left: main inputs */}
          <div>
            {/* Video Idea */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Zap size={14} color="#facc15" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Video Idea</span>
                </div>
              </div>
              <div style={S.cardBody}>
                <label style={S.label}>What is this video about?</label>
                <textarea
                  value={videoIdea}
                  onChange={e => setVideoIdea(e.target.value)}
                  rows={3}
                  placeholder="e.g. Why most people fail at budgeting and what actually works instead."
                  style={{ ...S.input, resize: "vertical", lineHeight: 1.6, marginBottom: 14 }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={S.label}>Target Length</label>
                    <select value={targetLength} onChange={e => setTargetLength(e.target.value)} style={S.input}>
                      {lengthOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={S.label}>Script Format</label>
                    <select value={format} onChange={e => setFormat(e.target.value)} style={S.input}>
                      {formatOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Research Import */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BookOpen size={14} color="#00D4FF" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Research Import</span>
                  </div>
                  {researchNotes.length > 0 && (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(0,212,255,0.08)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.18)" }}>{researchNotes.length} imported</span>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>Import URLs, PDFs, or text notes — the AI uses them as context.</p>
              </div>
              <div style={S.cardBody}>
                {/* Tabs */}
                <div style={{ display: "flex", gap: 2, padding: 3, borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 14, width: "fit-content" }}>
                  {([
                    { id: "url" as const, icon: Globe, label: "URL Import" },
                    { id: "pdf" as const, icon: Upload, label: "PDF Upload" },
                    { id: "text" as const, icon: StickyNote, label: "Text Notes" },
                  ]).map(({ id, icon: Icon, label }) => (
                    <button key={id} onClick={() => { setResearchTab(id); setUrlError(null); }} style={{
                      display: "flex", alignItems: "center", gap: 6, padding: "6px 12px", borderRadius: 7,
                      border: "none", cursor: "pointer", fontSize: 12, fontWeight: 600,
                      background: researchTab === id ? "rgba(0,212,255,0.12)" : "transparent",
                      color: researchTab === id ? "#00D4FF" : "#475569",
                      outline: researchTab === id ? "1px solid rgba(0,212,255,0.2)" : "none",
                    }}>
                      <Icon size={12} />{label}
                    </button>
                  ))}
                </div>

                {/* URL tab */}
                {researchTab === "url" && (
                  <div>
                    <div style={{ display: "flex", gap: 8, marginBottom: urlError ? 8 : 0 }}>
                      <div style={{ position: "relative", flex: 1 }}>
                        <Globe size={13} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                        <input
                          value={newNote}
                          onChange={e => setNewNote(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && fetchUrl()}
                          placeholder="https://example.com/article or YouTube link…"
                          style={{ ...S.input, paddingLeft: 34 }}
                          onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                          onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                        />
                      </div>
                      <button
                        onClick={fetchUrl}
                        disabled={urlFetching || !newNote.trim()}
                        style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10,
                          background: urlFetching || !newNote.trim() ? "rgba(0,212,255,0.06)" : "rgba(0,212,255,0.12)",
                          border: "1px solid rgba(0,212,255,0.2)",
                          color: urlFetching || !newNote.trim() ? "#2A3F5F" : "#00D4FF",
                          fontSize: 12, fontWeight: 700, cursor: urlFetching || !newNote.trim() ? "not-allowed" : "pointer", flexShrink: 0,
                        }}
                      >
                        {urlFetching ? <><Loader2 size={12} style={{ animation: "spin 0.8s linear infinite" }} />Fetching…</> : <><Plus size={12} />Import</>}
                      </button>
                    </div>
                    {urlError && <p style={{ fontSize: 11, color: "#f87171", margin: "6px 0 0" }}>{urlError}</p>}
                    <p style={{ fontSize: 11, color: "#475569", margin: "8px 0 0" }}>We extract the title and content from the URL and pass it to the AI.</p>
                  </div>
                )}

                {/* PDF tab */}
                {researchTab === "pdf" && (
                  <div>
                    <input ref={fileInputRef} type="file" accept=".pdf,.txt" style={{ display: "none" }} onChange={handlePdfUpload} />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      style={{
                        width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
                        padding: "24px 20px", borderRadius: 12, cursor: "pointer",
                        border: "1.5px dashed rgba(0,212,255,0.2)", background: "rgba(0,212,255,0.03)",
                        color: "#64748b", transition: "all 0.15s",
                      }}
                      onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.4)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,212,255,0.06)"; }}
                      onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.2)"; (e.currentTarget as HTMLButtonElement).style.background = "rgba(0,212,255,0.03)"; }}
                    >
                      <Upload size={22} color="#00D4FF" />
                      <span style={{ fontSize: 13, fontWeight: 600, color: "#94a3b8" }}>Click to upload PDF or .txt file</span>
                      <span style={{ fontSize: 11, color: "#475569" }}>Text content will be extracted and used as research context</span>
                    </button>
                  </div>
                )}

                {/* Text notes tab */}
                {researchTab === "text" && (
                  <div>
                    <textarea
                      value={textNote}
                      onChange={e => setTextNote(e.target.value)}
                      placeholder="Paste any research notes, stats, quotes, or talking points you want the AI to include…"
                      rows={4}
                      style={{ ...S.input, resize: "vertical", lineHeight: 1.6, marginBottom: 10 }}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                    <button
                      onClick={addTextNote}
                      disabled={!textNote.trim()}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "9px 16px", borderRadius: 9,
                        background: !textNote.trim() ? "rgba(255,255,255,0.03)" : "rgba(0,212,255,0.1)",
                        border: !textNote.trim() ? "1px solid rgba(255,255,255,0.07)" : "1px solid rgba(0,212,255,0.2)",
                        color: !textNote.trim() ? "#475569" : "#00D4FF",
                        fontSize: 12, fontWeight: 700, cursor: !textNote.trim() ? "not-allowed" : "pointer",
                      }}
                    >
                      <StickyNote size={12} /> Add Note
                    </button>
                  </div>
                )}

                {/* Imported notes list */}
                {researchNotes.length > 0 && (
                  <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 5 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, color: "#2A3F5F", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Imported Research</p>
                    {researchNotes.map(note => (
                      <div key={note.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9, background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.1)" }}>
                        {note.type === "url" ? <Link2 size={12} color="#00D4FF" style={{ flexShrink: 0 }} /> : <FileText size={12} color="#a78bfa" style={{ flexShrink: 0 }} />}
                        <p style={{ fontSize: 11, color: "#94a3b8", flex: 1, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note.content}</p>
                        <button onClick={() => setResearchNotes(prev => prev.filter(n => n.id !== note.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0, flexShrink: 0 }}
                          onMouseEnter={e => e.currentTarget.style.color = "#f87171"}
                          onMouseLeave={e => e.currentTarget.style.color = "#475569"}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleGenerate}
              disabled={!videoIdea.trim() || generating}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                padding: "14px", borderRadius: 12, border: "none",
                background: !videoIdea.trim() ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
                color: !videoIdea.trim() ? "#64748b" : "#04080F",
                fontSize: 14, fontWeight: 800, cursor: !videoIdea.trim() ? "not-allowed" : "pointer",
                position: "relative",
              }}
            >
              <Sparkles size={16} />
              {generating ? STEPS[generatingStep] : "Generate Script with AI"}
              {isPro && !generating && (
                <span style={{
                  position: "absolute", top: -8, right: 10,
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                  padding: "2px 7px", borderRadius: 99,
                  background: "linear-gradient(135deg, #facc15, #f59e0b)",
                  color: "#1a0a00", boxShadow: "0 2px 8px rgba(250,204,21,0.4)",
                }}>Priority</span>
              )}
            </button>
          </div>

          {/* Right: sidebar */}
          <div>
            <div style={S.card}>
              <div style={S.cardHeader}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Script Settings</p>
              </div>
              <div style={S.cardBody}>
                {[
                  { label: "Writing Style", value: "Educational", color: "#00D4FF" },
                  { label: "AI Model", value: "GPT-4o", color: "#94a3b8" },
                  { label: "Research Notes", value: `${researchNotes.length} added`, color: researchNotes.length > 0 ? "#34d399" : "#64748b" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{item.label}</p>
                    <span style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={13} color="#00D4FF" />
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: 0 }}>Estimated Output</p>
                </div>
              </div>
              <div style={S.cardBody}>
                {[
                  { label: "Word Count", value: `~${parseInt(targetLength) * 150} words` },
                  { label: "Sections", value: "5–7 sections" },
                  { label: "Read Time", value: `${targetLength} min` },
                  { label: "Scripts Left", value: "4 / 4" },
                ].map(item => (
                  <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>{item.label}</p>
                    <p style={{ fontSize: 12, color: "#e2e8f0", fontWeight: 600, margin: 0 }}>{item.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderRadius: 14, border: "1px solid rgba(0,212,255,0.1)", background: "linear-gradient(135deg, rgba(0,212,255,0.04), transparent)", padding: "14px 16px" }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#00D4FF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Pro Tip</p>
              <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                The more specific your idea, the better the script. Instead of &ldquo;budgeting tips&rdquo; try &ldquo;Why the 50/30/20 rule fails for people earning under $40k.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes bounce { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }`}</style>
    </div>
  );
}

export default function NewScriptPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#080D1A" }} />}>
      <NewScriptInner />
    </Suspense>
  );
}
