"use client";

import { useState } from "react";
import Link from "next/link";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  ScrollText, Search, PenLine, Eye, Copy, Trash2,
  Download, Clock, SortAsc, FileText,
  ChevronUp, CheckCircle2, X,
} from "lucide-react";

interface ScriptSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
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
  sections: ScriptSection[];
}

const statusColors: Record<string, "cyan" | "green" | "neutral"> = {
  draft: "neutral",
  final: "cyan",
  published: "green",
};

const statusCycle: Record<string, "draft" | "final" | "published"> = {
  draft: "final",
  final: "published",
  published: "draft",
};

export default function ScriptsPage() {
  const [scripts, setScripts, hydrated] = useLocalStorage<SavedScript[]>("th_scripts", []);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sortDesc, setSortDesc] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = scripts
    .filter((s) => {
      const matchSearch = !search ||
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.niche.toLowerCase().includes(search.toLowerCase());
      const matchFilter = filter === "all" || s.status === filter;
      return matchSearch && matchFilter;
    })
    .sort((a, b) => sortDesc
      ? parseInt(b.id) - parseInt(a.id)
      : parseInt(a.id) - parseInt(b.id)
    );

  const deleteScript = (id: string) => {
    setScripts((prev) => prev.filter((s) => s.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const cycleStatus = (id: string) => {
    setScripts((prev) =>
      prev.map((s) => s.id === id ? { ...s, status: statusCycle[s.status] } : s)
    );
  };

  const copyScript = (script: SavedScript) => {
    const text = script.sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    navigator.clipboard.writeText(text);
    setCopiedId(script.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const downloadScript = (script: SavedScript) => {
    const text = `# ${script.title}\n\n` +
      script.sections.map((s) => `## ${s.title}\n\n${s.content}`).join("\n\n---\n\n");
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${script.title.slice(0, 50).replace(/[^a-z0-9]/gi, "-")}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen">
      <Topbar title="My Scripts" action={{ label: "Write New Script" }} />

      <div className="p-6 max-w-6xl mx-auto space-y-6">

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Total Scripts", value: scripts.length, color: "text-cyan-400" },
            { label: "Published", value: scripts.filter(s => s.status === "published").length, color: "text-emerald-400" },
            { label: "In Draft", value: scripts.filter(s => s.status === "draft").length, color: "text-yellow-400" },
            { label: "Scripts Left", value: Math.max(0, 4 - scripts.length), color: "text-orange-400" },
          ].map((s) => (
            <div key={s.label} className="rounded-xl border border-white/6 bg-[#0F1829]/80 p-4">
              <p className={`text-2xl font-bold font-[family-name:var(--font-syne)] ${s.color}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filters + Search */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
          <Input
            placeholder="Search by title or niche..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            icon={<Search size={14} />}
            className="sm:w-72"
          />
          <div className="flex gap-2 flex-wrap">
            {["all", "draft", "final", "published"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all font-[family-name:var(--font-syne)] ${
                  filter === f
                    ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/25"
                    : "bg-white/3 text-slate-500 border border-white/8 hover:border-white/15"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
          <button
            onClick={() => setSortDesc(!sortDesc)}
            className="ml-auto flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-300 transition-colors"
          >
            <SortAsc size={13} className={sortDesc ? "" : "rotate-180"} />
            {sortDesc ? "Newest first" : "Oldest first"}
          </button>
        </div>

        {/* Scripts list or empty */}
        {!hydrated ? null : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-16 h-16 rounded-full bg-white/3 border border-white/8 flex items-center justify-center">
              <FileText size={28} className="text-slate-600" />
            </div>
            <div className="text-center">
              <p className="text-base font-bold text-slate-400 font-[family-name:var(--font-syne)]">
                {scripts.length > 0 && filter !== "all" ? "No scripts match this filter" : "No scripts yet"}
              </p>
              <p className="text-sm text-slate-600 mt-1">
                {scripts.length > 0 && filter !== "all"
                  ? "Try a different filter above"
                  : "Create your first AI-powered YouTube script."}
              </p>
            </div>
            {scripts.length === 0 && (
              <Link href="/dashboard/new-script">
                <Button icon={<PenLine size={14} />}>Write your first script</Button>
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((script) => {
              const isExpanded = expandedId === script.id;
              return (
                <Card key={script.id}>
                  {/* Header row */}
                  <CardBody className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 flex items-center justify-center shrink-0">
                      <ScrollText size={18} className="text-cyan-400" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-sm font-semibold text-white font-[family-name:var(--font-syne)] truncate">{script.title}</h3>
                        <button onClick={() => cycleStatus(script.id)} title="Click to change status">
                          <Badge variant={statusColors[script.status]} className="cursor-pointer hover:opacity-80 transition-opacity">
                            {script.status}
                          </Badge>
                        </button>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                        <span className="capitalize">{script.format || "script"}</span>
                        <span>·</span>
                        <span>{script.words.toLocaleString()} words</span>
                        <span>·</span>
                        <span>{script.duration} min</span>
                        <span>·</span>
                        <span className="flex items-center gap-1"><Clock size={10} />{script.createdAt}</span>
                        {script.sections?.length > 0 && (
                          <><span>·</span><span>{script.sections.length} sections</span></>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        title="Expand sections"
                        onClick={() => setExpandedId(isExpanded ? null : script.id)}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-cyan-400 transition-all"
                      >
                        {isExpanded ? <ChevronUp size={14} /> : <Eye size={14} />}
                      </button>
                      <button
                        title={copiedId === script.id ? "Copied!" : "Copy all"}
                        onClick={() => copyScript(script)}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all"
                      >
                        {copiedId === script.id ? <CheckCircle2 size={14} className="text-emerald-400" /> : <Copy size={14} />}
                      </button>
                      <button
                        title="Download .txt"
                        onClick={() => downloadScript(script)}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-slate-300 transition-all"
                      >
                        <Download size={14} />
                      </button>
                      <button
                        title="Delete"
                        onClick={() => deleteScript(script.id)}
                        className="p-2 rounded-lg hover:bg-white/5 text-slate-500 hover:text-red-400 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </CardBody>

                  {/* Expanded sections */}
                  {isExpanded && script.sections?.length > 0 && (
                    <div className="border-t border-white/5 px-5 pb-5 pt-4 space-y-3">
                      {script.sections.map((section, i) => (
                        <div key={section.id} className="rounded-lg bg-[#0A1020] border border-white/5 p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-5 h-5 rounded-full bg-cyan-500/15 flex items-center justify-center text-cyan-400 text-[10px] font-bold font-[family-name:var(--font-syne)]">
                              {i + 1}
                            </div>
                            <p className="text-xs font-bold text-slate-300 font-[family-name:var(--font-syne)]">{section.title}</p>
                            {section.wordCount > 0 && (
                              <span className="ml-auto text-[10px] text-slate-600">{section.wordCount}w</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 leading-relaxed whitespace-pre-wrap">{section.content}</p>
                        </div>
                      ))}
                      <button
                        onClick={() => setExpandedId(null)}
                        className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-400 transition-colors mt-1"
                      >
                        <X size={11} /> Collapse
                      </button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
