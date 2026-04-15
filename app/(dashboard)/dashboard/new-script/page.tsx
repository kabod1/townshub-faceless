"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import {
  PenLine, Sparkles, Link2, FileText, Plus, Trash2,
  ChevronDown, ChevronUp, Copy, Download, CheckCircle2,
  Clock, Zap, BookOpen, AlertCircle,
} from "lucide-react";

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

  const addNote = (type: "url" | "text") => {
    if (!newNote.trim()) return;
    setResearchNotes(prev => [...prev, { id: Date.now().toString(), type, content: newNote.trim() }]);
    setNewNote("");
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
    return (
      <div style={{ minHeight: "100vh", background: "#080D1A" }}>
        <Topbar title="New Script" />
        <div style={{ padding: "28px 32px", maxWidth: 860, margin: "0 auto" }}>

          {/* Success banner */}
          <div style={{
            display: "flex", alignItems: "center", gap: 16, padding: "18px 22px",
            borderRadius: 14, marginBottom: 24,
            background: "linear-gradient(to right, rgba(52,211,153,0.07), transparent)",
            border: "1px solid rgba(52,211,153,0.18)",
          }}>
            <div style={{ width: 40, height: 40, borderRadius: 12, background: "rgba(52,211,153,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CheckCircle2 size={20} color="#34d399" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#34d399", margin: "0 0 2px" }}>Script Generated Successfully</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>~{scriptMeta.totalWords} words · {scriptMeta.estimatedMinutes} min · {sections.length} sections</p>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button onClick={copyAll} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                <Copy size={12} /> {copied ? "Copied!" : "Copy All"}
              </button>
              <button onClick={() => {
                const text = sections.map(s => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
                const blob = new Blob([text], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url; a.download = `${scriptMeta.title.slice(0, 50)}.txt`; a.click();
              }} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
                background: "linear-gradient(135deg, #00D4FF, #0080cc)", border: "none",
                color: "#04080F", fontSize: 12, fontWeight: 700, cursor: "pointer",
              }}>
                <Download size={12} /> Export
              </button>
            </div>
          </div>

          {/* Title + badges */}
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", lineHeight: 1.3 }}>{scriptMeta.title}</h2>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { label: formatOptions.find(f => f.value === format)?.label.split(" ")[0] || format, bg: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "rgba(0,212,255,0.2)" },
                { label: `${targetLength} min`, bg: "rgba(255,255,255,0.05)", color: "#64748b", border: "rgba(255,255,255,0.08)" },
                { label: `${scriptMeta.totalWords} words`, bg: "rgba(52,211,153,0.08)", color: "#34d399", border: "rgba(52,211,153,0.18)" },
              ].map(b => (
                <span key={b.label} style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: b.bg, color: b.color, border: `1px solid ${b.border}` }}>{b.label}</span>
              ))}
            </div>
          </div>

          {/* Sections */}
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
            {sections.map((section, i) => (
              <div key={section.id} style={{
                borderRadius: 14, overflow: "hidden",
                background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                border: section.expanded ? "1px solid rgba(0,212,255,0.15)" : "1px solid rgba(255,255,255,0.06)",
              }}>
                <div
                  style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", cursor: "pointer" }}
                  onClick={() => setSections(prev => prev.map(s => s.id === section.id ? { ...s, expanded: !s.expanded } : s))}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(0,212,255,0.12)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: "#00D4FF", flexShrink: 0 }}>{i + 1}</div>
                    <h3 style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>{section.title}</h3>
                    {section.wordCount > 0 && (
                      <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 7px", borderRadius: 99, background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{section.wordCount}w</span>
                    )}
                  </div>
                  {section.expanded ? <ChevronUp size={15} color="#475569" /> : <ChevronDown size={15} color="#475569" />}
                </div>
                {section.expanded && (
                  <div style={{ padding: "0 18px 16px" }}>
                    <div style={{ borderRadius: 10, background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.05)", padding: "14px 16px" }}>
                      <p style={{ fontSize: 13, color: "#94a3b8", lineHeight: 1.7, margin: 0, whiteSpace: "pre-wrap" }}>{section.content}</p>
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
            ))}
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              onClick={() => { setStep("setup"); setSections([]); setScriptMeta(null); setScriptSaved(false); }}
              style={{ padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#64748b", fontSize: 13, fontWeight: 600, cursor: "pointer" }}
            >
              ← Edit Inputs
            </button>
            <button
              onClick={saveScript}
              disabled={scriptSaved}
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 10, border: "none",
                background: scriptSaved ? "rgba(52,211,153,0.1)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
                color: scriptSaved ? "#34d399" : "#04080F", fontSize: 13, fontWeight: 700,
                cursor: scriptSaved ? "not-allowed" : "pointer",
                outline: scriptSaved ? "1px solid rgba(52,211,153,0.3)" : "none",
              }}
            >
              {scriptSaved ? <><CheckCircle2 size={14} /> Saved!</> : <><Zap size={14} /> Save to My Scripts</>}
            </button>
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

            {/* Research Notes */}
            <div style={S.card}>
              <div style={S.cardHeader}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <BookOpen size={14} color="#00D4FF" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Research Notes</span>
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.05)", color: "#64748b" }}>{researchNotes.length} items</span>
                </div>
                <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>Add URLs or paste notes for the AI to use.</p>
              </div>
              <div style={S.cardBody}>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <div style={{ position: "relative", flex: 1 }}>
                    <Link2 size={13} color="#475569" style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)" }} />
                    <input
                      value={newNote}
                      onChange={e => setNewNote(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && addNote("url")}
                      placeholder="Paste a URL or YouTube video link…"
                      style={{ ...S.input, paddingLeft: 34 }}
                    />
                  </div>
                  <button onClick={() => addNote("url")} style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10,
                    background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)",
                    color: "#00D4FF", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0,
                  }}>
                    <Plus size={12} /> Add
                  </button>
                </div>
                <button
                  onClick={() => {
                    const note = prompt("Paste your research notes:");
                    if (note) setResearchNotes(prev => [...prev, { id: Date.now().toString(), type: "text", content: note }]);
                  }}
                  style={{
                    display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
                    border: "1px solid rgba(255,255,255,0.08)", background: "transparent",
                    color: "#94a3b8", fontSize: 12, cursor: "pointer", marginBottom: researchNotes.length ? 12 : 0,
                  }}
                >
                  <FileText size={13} /> Add Text Notes
                </button>
                {researchNotes.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                    {researchNotes.map(note => (
                      <div key={note.id} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        {note.type === "url" ? <Link2 size={12} color="#00D4FF" style={{ flexShrink: 0 }} /> : <FileText size={12} color="#475569" style={{ flexShrink: 0 }} />}
                        <p style={{ fontSize: 12, color: "#64748b", flex: 1, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{note.content}</p>
                        <button onClick={() => setResearchNotes(prev => prev.filter(n => n.id !== note.id))} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 0 }}
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
              }}
            >
              <Sparkles size={16} />
              {generating ? STEPS[generatingStep] : "Generate Script with AI"}
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
