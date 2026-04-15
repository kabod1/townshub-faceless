"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import {
  ScrollText, Search, PenLine, Eye, Copy, Trash2,
  Download, Clock, SortAsc, FileText, ChevronUp, CheckCircle2, X,
} from "lucide-react";

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
  }).sort((a, b) => sortDesc ? 1 : -1);

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
        action={{ label: "New Script", icon: <PenLine size={13} /> }} />

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
                          onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.color = "#334155"; }}
                        >
                          <btn.icon size={14} />
                        </button>
                      ))}
                    </div>
                  </div>

                  {isExpanded && script.sections?.length > 0 && (
                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)", padding: "16px 18px" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                        {script.sections.map((section, i) => (
                          <div key={section.id} style={{ borderRadius: 10, background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.05)", padding: "14px 16px" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                              <div style={{ width: 20, height: 20, borderRadius: "50%", background: "rgba(0,212,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#00D4FF", flexShrink: 0 }}>{i + 1}</div>
                              <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", margin: 0 }}>{section.title}</p>
                              {section.wordCount > 0 && <span style={{ marginLeft: "auto", fontSize: 10, color: "#94a3b8" }}>{section.wordCount}w</span>}
                            </div>
                            <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.6, margin: 0, whiteSpace: "pre-wrap" }}>{section.content}</p>
                          </div>
                        ))}
                      </div>
                      <button onClick={() => setExpandedId(null)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer", marginTop: 12 }}>
                        <X size={11} /> Collapse
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
