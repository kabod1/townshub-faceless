"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Textarea, Select } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  PenLine, Sparkles, Link2, FileText, Plus,
  Trash2, ChevronDown, ChevronUp, Copy, Download,
  CheckCircle2, Clock, Zap, BookOpen, AlertCircle,
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

interface ResearchNote {
  id: string;
  type: "url" | "text";
  content: string;
}

interface ScriptSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  expanded: boolean;
}

interface GeneratedScript {
  title: string;
  totalWords: number;
  estimatedMinutes: number;
  sections: Omit<ScriptSection, "expanded">[];
}

interface SavedScript {
  id: string;
  title: string;
  niche: string;
  format: string;
  words: number;
  duration: number;
  createdAt: string;
  status: "draft" | "final" | "published";
  sections: Omit<ScriptSection, "expanded">[];
}

// Generating steps shown while waiting
const STEPS = [
  "Analysing your topic…",
  "Researching competitor angles…",
  "Crafting your hook…",
  "Writing script sections…",
  "Optimising for retention…",
  "Finalising your script…",
];

function NewScriptInner() {
  const searchParams = useSearchParams();
  const ideaParam = searchParams.get("idea") || "";
  const [videoIdea, setVideoIdea] = useState(ideaParam);

  useEffect(() => {
    if (ideaParam) setVideoIdea(ideaParam);
  }, [ideaParam]);
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
  const [savedScripts, setSavedScripts] = useLocalStorage<SavedScript[]>("th_scripts", []);
  const [scriptSaved, setScriptSaved] = useState(false);

  const addNote = (type: "url" | "text") => {
    if (!newNote.trim()) return;
    setResearchNotes((prev) => [...prev, { id: Date.now().toString(), type, content: newNote.trim() }]);
    setNewNote("");
  };

  const removeNote = (id: string) => setResearchNotes((prev) => prev.filter((n) => n.id !== id));

  const handleGenerate = async () => {
    if (!videoIdea.trim()) return;
    setGenerating(true);
    setError(null);
    setGeneratingStep(0);

    // Animate through steps while waiting
    const interval = setInterval(() => {
      setGeneratingStep((s) => Math.min(s + 1, STEPS.length - 1));
    }, 2500);

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          videoIdea,
          targetLength,
          format,
          researchNotes,
          writingStyle: "educational",
        }),
      });

      clearInterval(interval);

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
        throw new Error(err.error || `Server error ${res.status}`);
      }

      const json = await res.json();
      const data: GeneratedScript = json.data || json;

      if (!data?.sections?.length) {
        throw new Error("No script sections returned. Please try again.");
      }

      setScriptMeta({
        title: data.title || videoIdea,
        totalWords: data.totalWords || data.sections.reduce((a, s) => a + (s.wordCount || 0), 0),
        estimatedMinutes: data.estimatedMinutes || parseInt(targetLength),
      });

      setSections(
        data.sections.map((s, i) => ({
          ...s,
          expanded: i === 0,
        }))
      );

      setStep("result");
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const toggleSection = (id: string) => {
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, expanded: !s.expanded } : s)));
  };

  const copyAll = () => {
    const text = sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const copySection = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const saveScript = () => {
    if (!scriptMeta || sections.length === 0) return;
    const newScript: SavedScript = {
      id: Date.now().toString(),
      title: scriptMeta.title,
      niche: "General",
      format,
      words: scriptMeta.totalWords,
      duration: scriptMeta.estimatedMinutes,
      createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      status: "draft",
      sections: sections.map(({ id, title, content, wordCount }) => ({ id, title, content, wordCount })),
    };
    setSavedScripts((prev) => [newScript, ...prev]);
    setScriptSaved(true);
    setTimeout(() => setScriptSaved(false), 2500);
  };

  // ── Result view ────────────────────────────────────────────────────────────
  if (step === "result" && sections.length > 0 && scriptMeta) {
    return (
      <div className="min-h-screen">
        <Topbar title="New Script" />
        <div className="p-6 max-w-4xl mx-auto space-y-6">

          {/* Success banner */}
          <div className="rounded-xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/8 to-transparent p-5 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
              <CheckCircle2 size={20} className="text-emerald-400" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-300 font-[family-name:var(--font-syne)]">
                Script Generated Successfully
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                ~{scriptMeta.totalWords} words · {scriptMeta.estimatedMinutes} min · {sections.length} sections
              </p>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" icon={<Copy size={12} />} onClick={copyAll}>
                {copied ? "Copied!" : "Copy All"}
              </Button>
              <Button size="sm" icon={<Download size={12} />} onClick={() => {
                const text = sections.map(s => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
                const blob = new Blob([text], { type: "text/plain" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${scriptMeta.title.slice(0, 50)}.txt`;
                a.click();
              }}>
                Export
              </Button>
            </div>
          </div>

          {/* Title */}
          <div>
            <h2 className="text-xl font-bold text-white font-[family-name:var(--font-syne)] leading-snug">
              {scriptMeta.title}
            </h2>
            <div className="flex gap-2 mt-2">
              <Badge variant="cyan">{formatOptions.find((f) => f.value === format)?.label.split(" ")[0]}</Badge>
              <Badge variant="neutral">{targetLength} min</Badge>
              <Badge variant="green">{scriptMeta.totalWords} words</Badge>
            </div>
          </div>

          {/* Script Sections */}
          <div className="space-y-3">
            {sections.map((section, i) => (
              <Card key={section.id} glow={section.expanded}>
                <div
                  className="flex items-center justify-between p-4 cursor-pointer select-none"
                  onClick={() => toggleSection(section.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-400 text-xs font-bold font-[family-name:var(--font-syne)]">
                      {i + 1}
                    </div>
                    <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-syne)]">
                      {section.title}
                    </h3>
                    {section.wordCount > 0 && <Badge variant="neutral">{section.wordCount}w</Badge>}
                  </div>
                  {section.expanded
                    ? <ChevronUp size={16} className="text-slate-500" />
                    : <ChevronDown size={16} className="text-slate-500" />}
                </div>
                {section.expanded && (
                  <div className="px-4 pb-4">
                    <div className="bg-[#0A1020] rounded-lg p-4 border border-white/5">
                      <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {section.content}
                      </p>
                    </div>
                    <div className="flex gap-4 mt-3">
                      <button
                        onClick={() => copySection(section.content)}
                        className="text-xs text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1"
                      >
                        <Copy size={11} /> Copy Section
                      </button>
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={() => { setStep("setup"); setSections([]); setScriptMeta(null); setScriptSaved(false); }}>
              ← Edit Inputs
            </Button>
            <Button
              icon={scriptSaved ? <CheckCircle2 size={14} /> : <Zap size={14} />}
              variant={scriptSaved ? "outline" : "primary"}
              onClick={saveScript}
              disabled={scriptSaved}
            >
              {scriptSaved ? "Saved to My Scripts!" : "Save to My Scripts"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Setup view ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen">
      <Topbar title="New Script" />

      <div className="p-6 max-w-4xl mx-auto space-y-6">

        {/* Header */}
        <div className="rounded-xl border border-cyan-500/15 bg-gradient-to-br from-[#162035] to-[#0F1829] p-5 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
            <PenLine size={20} className="text-cyan-400" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white font-[family-name:var(--font-syne)]">Write a New Script</h2>
            <p className="text-sm text-slate-400">Tell us your video idea and we&apos;ll handle all the research.</p>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/8 p-4 flex items-start gap-3">
            <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-red-300 font-[family-name:var(--font-syne)]">Generation Failed</p>
              <p className="text-xs text-slate-400 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Generating progress overlay */}
        {generating && (
          <div className="rounded-xl border border-cyan-500/20 bg-gradient-to-br from-[#162035] to-[#0F1829] p-6 text-center space-y-4">
            <div className="flex justify-center gap-1">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 rounded-full bg-cyan-400"
                  style={{ animation: `bounce 1.2s ease-in-out ${i * 0.2}s infinite` }}
                />
              ))}
            </div>
            <p className="text-sm font-semibold text-cyan-300 font-[family-name:var(--font-syne)]">
              {STEPS[generatingStep]}
            </p>
            <p className="text-xs text-slate-500">Using GPT-4o · This takes 15–30 seconds</p>
            <div className="w-full bg-white/5 rounded-full h-1.5 mx-auto max-w-xs">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-[2400ms] ease-out"
                style={{ width: `${((generatingStep + 1) / STEPS.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6 ${generating ? "opacity-50 pointer-events-none" : ""}`}>
          <div className="lg:col-span-2 space-y-5">

            {/* Video Idea */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-yellow-400" />
                  <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Video Idea</h3>
                </div>
              </CardHeader>
              <CardBody className="space-y-4">
                <Textarea
                  label="What is this video about?"
                  value={videoIdea}
                  onChange={(e) => setVideoIdea(e.target.value)}
                  rows={3}
                  placeholder="e.g. Why most people fail at budgeting and what actually works instead."
                />
                <div className="grid grid-cols-2 gap-4">
                  <Select
                    label="Target Length"
                    value={targetLength}
                    onChange={(e) => setTargetLength(e.target.value)}
                    options={lengthOptions}
                  />
                  <Select
                    label="Script Format"
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    options={formatOptions}
                  />
                </div>
              </CardBody>
            </Card>

            {/* Research Notes */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen size={14} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Research Notes</h3>
                  </div>
                  <Badge variant="neutral">{researchNotes.length} items</Badge>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Add URLs, documents, or paste notes for the AI to use.
                </p>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Paste a URL, article, or YouTube video link…"
                    onKeyDown={(e) => e.key === "Enter" && addNote("url")}
                    className="flex-1"
                    icon={<Link2 size={13} />}
                  />
                  <Button size="sm" onClick={() => addNote("url")} icon={<Plus size={12} />}>Add</Button>
                </div>
                <button
                  onClick={() => {
                    const note = prompt("Paste your research notes:");
                    if (note) setResearchNotes(prev => [...prev, { id: Date.now().toString(), type: "text", content: note }]);
                  }}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-white/8 text-slate-500 text-xs hover:border-white/15 hover:text-slate-400 transition-all"
                >
                  <FileText size={13} />
                  Add Text Notes
                </button>
                {researchNotes.length > 0 && (
                  <div className="space-y-2 mt-1">
                    {researchNotes.map((note) => (
                      <div key={note.id} className="flex items-center gap-2 p-2.5 rounded-lg bg-white/3 border border-white/6">
                        {note.type === "url"
                          ? <Link2 size={12} className="text-cyan-500 shrink-0" />
                          : <FileText size={12} className="text-slate-500 shrink-0" />}
                        <p className="text-xs text-slate-400 flex-1 truncate">{note.content}</p>
                        <button onClick={() => removeNote(note.id)} className="text-slate-600 hover:text-red-400 transition-colors">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            <Button
              size="lg"
              onClick={handleGenerate}
              loading={generating}
              disabled={!videoIdea.trim()}
              icon={generating ? undefined : <Sparkles size={16} />}
              className="w-full justify-center"
            >
              {generating ? STEPS[generatingStep] : "Generate Script with AI"}
            </Button>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-[family-name:var(--font-syne)]">
                  Script Settings
                </p>
              </CardHeader>
              <CardBody className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">Writing Style</p>
                  <Badge variant="cyan">Educational</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">AI Model</p>
                  <Badge variant="neutral">GPT-4o</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-slate-400">Research Notes</p>
                  <Badge variant={researchNotes.length > 0 ? "green" : "neutral"}>
                    {researchNotes.length} added
                  </Badge>
                </div>
              </CardBody>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Clock size={13} className="text-cyan-400" />
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest font-[family-name:var(--font-syne)]">
                    Estimated Output
                  </p>
                </div>
              </CardHeader>
              <CardBody className="space-y-2">
                {[
                  { label: "Word Count", value: `~${parseInt(targetLength) * 150} words` },
                  { label: "Sections", value: "5–7 sections" },
                  { label: "Read Time", value: `${targetLength} min` },
                  { label: "Scripts Left", value: "4 / 4" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <p className="text-xs text-slate-500">{item.label}</p>
                    <p className="text-xs text-white font-medium font-[family-name:var(--font-syne)]">{item.value}</p>
                  </div>
                ))}
              </CardBody>
            </Card>

            <div className="rounded-xl border border-cyan-500/10 bg-gradient-to-br from-cyan-500/5 to-transparent p-4">
              <p className="text-xs font-bold text-cyan-400 font-[family-name:var(--font-syne)] mb-2">Pro Tip</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                The more specific your idea, the better the script. Instead of &ldquo;budgeting tips&rdquo; try
                &ldquo;Why the 50/30/20 rule fails for people earning under $40k.&rdquo;
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}

export default function NewScriptPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#080D1A]" />}>
      <NewScriptInner />
    </Suspense>
  );
}
