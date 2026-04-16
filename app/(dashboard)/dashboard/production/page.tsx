"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Plus, Calendar, Trash2, Check, X, PenLine, ExternalLink,
  Lightbulb, FileText, Mic, Film, Clock, CheckCircle2, Zap,
  Image, Link2, MessageSquare, Upload,
} from "lucide-react";

type TaskStatus = "ideas" | "scripting" | "production" | "editing" | "scheduled" | "published";

interface CheckItem { done: boolean; label: string; }
interface TaskLink { label: string; url: string; }
interface TaskComment { author: string; text: string; date: string; }
interface Task {
  id: string; title: string; stage: TaskStatus;
  priority: "high" | "medium" | "low"; dueDate?: string;
  tags: string[]; checklist: CheckItem[];
  assignedMembers: string[];
  thumbnailUrl: string;
  thumbnailPasteUrl: string;
  narrationUrl: string;
  finalVideoUrl: string;
  links: TaskLink[];
  comments: TaskComment[];
}

const COLUMNS: { id: TaskStatus; label: string; dot: string; headerBg: string; headerBorder: string }[] = [
  { id: "ideas",      label: "Ideas",      dot: "#facc15", headerBg: "rgba(250,204,21,0.06)",  headerBorder: "rgba(250,204,21,0.18)" },
  { id: "scripting",  label: "Scripting",  dot: "#00D4FF", headerBg: "rgba(0,212,255,0.06)",   headerBorder: "rgba(0,212,255,0.18)"  },
  { id: "production", label: "Production", dot: "#a78bfa", headerBg: "rgba(167,139,250,0.06)", headerBorder: "rgba(167,139,250,0.18)" },
  { id: "editing",    label: "Editing",    dot: "#fb923c", headerBg: "rgba(251,146,60,0.06)",  headerBorder: "rgba(251,146,60,0.18)" },
  { id: "scheduled",  label: "Scheduled",  dot: "#60a5fa", headerBg: "rgba(96,165,250,0.06)",  headerBorder: "rgba(96,165,250,0.18)" },
  { id: "published",  label: "Published",  dot: "#34d399", headerBg: "rgba(52,211,153,0.06)",  headerBorder: "rgba(52,211,153,0.18)" },
];

const PRIORITY: Record<string, { bg: string; color: string; border: string }> = {
  high:   { bg: "rgba(239,68,68,0.1)",   color: "#f87171", border: "rgba(239,68,68,0.25)"   },
  medium: { bg: "rgba(250,204,21,0.1)",  color: "#facc15", border: "rgba(250,204,21,0.25)"  },
  low:    { bg: "rgba(100,116,139,0.1)", color: "#64748b", border: "rgba(100,116,139,0.2)"  },
};

const STAGE_ACTIONS: Record<TaskStatus, { icon: React.ReactNode; label: string; sub: string; href?: string; external?: boolean }[]> = {
  ideas: [
    { icon: <Lightbulb size={13} color="#facc15" />, label: "Generate Video Ideas", sub: "Use AI to brainstorm ideas for this niche", href: "/dashboard/ideas" },
    { icon: <Zap size={13} color="#34d399" />, label: "Find a Niche", sub: "Discover profitable niches with low competition", href: "/dashboard/niche-finder" },
  ],
  scripting: [
    { icon: <PenLine size={13} color="#00D4FF" />, label: "Write Script with AI", sub: "Generate a full script for this video", href: "/dashboard/new-script" },
    { icon: <FileText size={13} color="#94a3b8" />, label: "My Scripts", sub: "View and manage all your saved scripts", href: "/dashboard/scripts" },
  ],
  production: [
    { icon: <Mic size={13} color="#a78bfa" />, label: "AI Voiceover Studio", sub: "Generate voiceover from your script with ElevenLabs", href: "/dashboard/voiceover" },
    { icon: <Film size={13} color="#a78bfa" />, label: "Pexels B-Roll", sub: "Free stock footage for your video", href: "https://www.pexels.com/videos/", external: true },
  ],
  editing: [
    { icon: <Film size={13} color="#fb923c" />, label: "CapCut (free editor)", sub: "Edit your video with auto-captions", href: "https://www.capcut.com", external: true },
    { icon: <Film size={13} color="#fb923c" />, label: "DaVinci Resolve", sub: "Professional free video editor", href: "https://www.blackmagicdesign.com/products/davinciresolve", external: true },
  ],
  scheduled: [
    { icon: <Clock size={13} color="#60a5fa" />, label: "YouTube Scheduler", sub: "Schedule your video publish time", href: "/dashboard/scheduler" },
    { icon: <Clock size={13} color="#60a5fa" />, label: "YouTube Studio", sub: "Upload your video file to YouTube", href: "https://studio.youtube.com", external: true },
  ],
  published: [
    { icon: <CheckCircle2 size={13} color="#34d399" />, label: "YouTube Analytics", sub: "Track your video performance", href: "https://studio.youtube.com/channel/analytics", external: true },
  ],
};

const TASK_DEFAULTS = { assignedMembers: [], thumbnailUrl: "", thumbnailPasteUrl: "", narrationUrl: "", finalVideoUrl: "", links: [], comments: [] };

const INITIAL_TASKS: Task[] = [
  { id: "1", title: "Why 99% of Faceless Channels Fail", stage: "scripting", priority: "high", dueDate: "2026-04-18", tags: ["YouTube Growth", "10 min"], checklist: [{ done: true, label: "Research competitors" }, { done: true, label: "Outline script" }, { done: false, label: "Write full script" }, { done: false, label: "Review & edit" }], ...TASK_DEFAULTS },
  { id: "2", title: "5 AI Tools That Actually Make Money", stage: "ideas", priority: "medium", tags: ["AI Tools", "8 min"], checklist: [{ done: false, label: "Validate idea" }, { done: false, label: "Keyword research" }], ...TASK_DEFAULTS },
  { id: "3", title: "Faceless Channel Niche Blueprint 2025", stage: "production", priority: "high", dueDate: "2026-04-22", tags: ["Niche Research", "15 min"], checklist: [{ done: true, label: "Script complete" }, { done: true, label: "Thumbnail designed" }, { done: false, label: "AI voiceover" }, { done: false, label: "B-roll footage" }], ...TASK_DEFAULTS },
  { id: "4", title: "How I Made $0 My First 90 Days", stage: "editing", priority: "low", dueDate: "2026-04-25", tags: ["Story", "12 min"], checklist: [{ done: true, label: "Script & VO done" }, { done: false, label: "Edit video" }, { done: false, label: "Add captions" }], ...TASK_DEFAULTS },
  { id: "5", title: "Top 10 Faceless Niches That Print Money", stage: "scheduled", priority: "medium", dueDate: "2026-04-28", tags: ["List Video", "10 min"], checklist: [{ done: true, label: "All production done" }, { done: false, label: "Schedule on YouTube" }], ...TASK_DEFAULTS },
];

const inputStyle: React.CSSProperties = { width: "100%", boxSizing: "border-box", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "9px 12px", color: "#e2e8f0", fontSize: 13, outline: "none" };
const labelStyle: React.CSSProperties = { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 };

function TaskCard({ task, onClick, onMove }: { task: Task; onClick: () => void; onMove: (id: string, stage: TaskStatus) => void }) {
  const done = task.checklist.filter(c => c.done).length;
  const total = task.checklist.length;
  const progress = total > 0 ? (done / total) * 100 : 0;
  const p = PRIORITY[task.priority];
  const colIdx = COLUMNS.findIndex(c => c.id === task.stage);
  const nextStage = COLUMNS[colIdx + 1];

  return (
    <div onClick={onClick} style={{
      borderRadius: 12, padding: "14px", cursor: "pointer",
      background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
      border: "1px solid rgba(255,255,255,0.06)",
      transition: "border-color 0.15s",
    }}
      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)"}
      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"}
    >
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {task.tags.map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}>{tag}</span>
          ))}
        </div>
        <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: p.bg, color: p.color, border: `1px solid ${p.border}`, textTransform: "capitalize", flexShrink: 0 }}>{task.priority}</span>
      </div>

      <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.4, margin: "0 0 10px" }}>{task.title}</p>

      {total > 0 && (
        <div style={{ marginBottom: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
            <span style={{ fontSize: 10, color: "#64748b" }}>{done}/{total} tasks</span>
            <span style={{ fontSize: 10, color: "#64748b" }}>{Math.round(progress)}%</span>
          </div>
          <div style={{ height: 4, borderRadius: 99, background: "rgba(255,255,255,0.05)" }}>
            <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(to right, #00D4FF, #0080cc)", width: `${progress}%`, transition: "width 0.5s ease" }} />
          </div>
        </div>
      )}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {task.dueDate ? (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#94a3b8" }}>
            <Calendar size={9} /> {new Date(task.dueDate + "T00:00:00").toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
          </span>
        ) : <span />}
        <div style={{ display: "flex", gap: 4 }} onClick={e => e.stopPropagation()}>
          {nextStage && (
            <button onClick={() => onMove(task.id, nextStage.id)} style={{ fontSize: 10, padding: "2px 8px", borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "none", color: "#64748b", cursor: "pointer" }}>
              → {nextStage.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function TaskDetailModal({ task, onClose, onUpdate, onDelete, onMove, onToggleCheck, onAddCheck, onDeleteCheck }:
  { task: Task; onClose: () => void; onUpdate: (id: string, fields: Partial<Task>) => void; onDelete: (id: string) => void; onMove: (id: string, stage: TaskStatus) => void; onToggleCheck: (id: string, idx: number) => void; onAddCheck: (id: string, label: string) => void; onDeleteCheck: (id: string, idx: number) => void; }
) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleVal, setTitleVal] = useState(task.title);
  const [newCheckItem, setNewCheckItem] = useState("");
  const done = task.checklist.filter(c => c.done).length;
  const total = task.checklist.length;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;
  const actions = STAGE_ACTIONS[task.stage] || [];

  // Media & Files local state
  const [thumbPasteUrl, setThumbPasteUrl] = useState(task.thumbnailPasteUrl || "");
  const [narrationUrl, setNarrationUrl] = useState(task.narrationUrl || "");
  const [finalVideoUrl, setFinalVideoUrl] = useState(task.finalVideoUrl || "");

  // Links local state
  const [links, setLinks] = useState<{ label: string; url: string }[]>(task.links || []);
  const [showAddLink, setShowAddLink] = useState(false);
  const [newLinkLabel, setNewLinkLabel] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");

  const addLink = () => {
    if (!newLinkUrl.trim()) return;
    const updated = [...links, { label: newLinkLabel.trim() || newLinkUrl.trim(), url: newLinkUrl.trim() }];
    setLinks(updated);
    onUpdate(task.id, { links: updated });
    setNewLinkLabel(""); setNewLinkUrl(""); setShowAddLink(false);
  };
  const removeLink = (idx: number) => {
    const updated = links.filter((_, i) => i !== idx);
    setLinks(updated);
    onUpdate(task.id, { links: updated });
  };

  // Comments local state
  const [comments, setComments] = useState<{ author: string; text: string; date: string }[]>(task.comments || []);
  const [newComment, setNewComment] = useState("");
  const [editingCommentIdx, setEditingCommentIdx] = useState<number | null>(null);
  const [editingCommentText, setEditingCommentText] = useState("");

  const postComment = () => {
    if (!newComment.trim()) return;
    const updated = [...comments, { author: "You", text: newComment.trim(), date: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) }];
    setComments(updated);
    onUpdate(task.id, { comments: updated });
    setNewComment("");
  };
  const deleteComment = (idx: number) => {
    const updated = comments.filter((_, i) => i !== idx);
    setComments(updated);
    onUpdate(task.id, { comments: updated });
  };
  const saveEditComment = (idx: number) => {
    if (!editingCommentText.trim()) return;
    const updated = comments.map((c, i) => i === idx ? { ...c, text: editingCommentText.trim() } : c);
    setComments(updated);
    onUpdate(task.id, { comments: updated });
    setEditingCommentIdx(null);
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }} onClick={onClose}>
      <div style={{
        width: 560, maxHeight: "90vh", display: "flex", flexDirection: "column",
        borderRadius: 20, background: "linear-gradient(135deg, #0D1626, #080D1A)",
        border: "1px solid rgba(255,255,255,0.08)", boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
        overflow: "hidden",
      }} onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div style={{ padding: "20px 22px 16px", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
          {/* Stage pills */}
          <div style={{ display: "flex", gap: 4, marginBottom: 14, flexWrap: "wrap" }}>
            {COLUMNS.map(c => (
              <button key={c.id} onClick={() => onMove(task.id, c.id)} style={{
                fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, cursor: "pointer",
                border: c.id === task.stage ? `1px solid ${c.dot}` : "1px solid rgba(255,255,255,0.06)",
                background: c.id === task.stage ? `${c.dot}18` : "rgba(255,255,255,0.02)",
                color: c.id === task.stage ? c.dot : "#475569",
                transition: "all 0.15s",
              }}>{c.label}</button>
            ))}
          </div>

          {/* Title */}
          {editingTitle ? (
            <input autoFocus value={titleVal}
              onChange={e => setTitleVal(e.target.value)}
              onBlur={() => { onUpdate(task.id, { title: titleVal }); setEditingTitle(false); }}
              onKeyDown={e => { if (e.key === "Enter") { onUpdate(task.id, { title: titleVal }); setEditingTitle(false); } if (e.key === "Escape") { setTitleVal(task.title); setEditingTitle(false); } }}
              style={{ ...inputStyle, fontSize: 16, fontWeight: 800, padding: "6px 10px", width: "100%", boxSizing: "border-box" }}
            />
          ) : (
            <h2 onClick={() => setEditingTitle(true)} style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: 0, cursor: "text", lineHeight: 1.3 }} title="Click to edit">
              {task.title}
              <PenLine size={11} color="#475569" style={{ marginLeft: 8, verticalAlign: "middle" }} />
            </h2>
          )}
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "18px 22px", display: "flex", flexDirection: "column", gap: 20, scrollbarWidth: "thin", scrollbarColor: "rgba(255,255,255,0.08) transparent" }}>

          {/* Meta row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div>
              <label style={labelStyle}>Priority</label>
              <div style={{ display: "flex", gap: 6 }}>
                {(["high", "medium", "low"] as const).map(pr => {
                  const pp = PRIORITY[pr];
                  return (
                    <button key={pr} onClick={() => onUpdate(task.id, { priority: pr })} style={{
                      flex: 1, padding: "7px 4px", borderRadius: 8, fontSize: 11, fontWeight: 700, cursor: "pointer",
                      textTransform: "capitalize", border: task.priority === pr ? `1px solid ${pp.border}` : "1px solid rgba(255,255,255,0.06)",
                      background: task.priority === pr ? pp.bg : "rgba(255,255,255,0.02)",
                      color: task.priority === pr ? pp.color : "#475569",
                    }}>{pr}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input type="date" value={task.dueDate || ""} onChange={e => onUpdate(task.id, { dueDate: e.target.value })}
                style={{ ...inputStyle, colorScheme: "dark" }} />
            </div>
          </div>

          {/* Stage-specific actions */}
          {actions.length > 0 && (
            <div>
              <label style={labelStyle}>
                {task.stage === "ideas" ? "Generate Content" : task.stage === "scripting" ? "Write Script" : task.stage === "production" ? "Production Tools" : task.stage === "editing" ? "Editing Tools" : task.stage === "scheduled" ? "Schedule" : "Analytics"}
              </label>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {actions.map((action, i) => {
                  const el = (
                    <div style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 14px", borderRadius: 11, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer", transition: "border-color 0.15s" }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.12)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"}
                    >
                      <div style={{ width: 34, height: 34, borderRadius: 9, background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{action.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{action.label}</p>
                        <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>{action.sub}</p>
                      </div>
                      <ExternalLink size={12} color="#475569" />
                    </div>
                  );
                  return action.external
                    ? <a key={i} href={action.href} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>{el}</a>
                    : <Link key={i} href={action.href!} style={{ textDecoration: "none" }}>{el}</Link>;
                })}
              </div>
            </div>
          )}

          {/* Checklist */}
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <label style={{ ...labelStyle, marginBottom: 0 }}>Checklist {total > 0 && <span style={{ color: "#475569", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>({done}/{total} · {progress}%)</span>}</label>
            </div>

            {total > 0 && (
              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.05)", marginBottom: 12, overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(to right, #00D4FF, #0080cc)", width: `${progress}%`, transition: "width 0.4s ease" }} />
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {task.checklist.map((item, idx) => (
                <div key={idx} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 9, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.04)" }}>
                  <button onClick={() => onToggleCheck(task.id, idx)} style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0, cursor: "pointer",
                    border: item.done ? "none" : "1px solid rgba(255,255,255,0.15)",
                    background: item.done ? "#00D4FF" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {item.done && <Check size={11} color="#04080F" strokeWidth={3} />}
                  </button>
                  <span style={{ flex: 1, fontSize: 12, color: item.done ? "#475569" : "#94a3b8", textDecoration: item.done ? "line-through" : "none" }}>{item.label}</span>
                  <button onClick={() => onDeleteCheck(task.id, idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", display: "flex", padding: 2 }}>
                    <X size={11} />
                  </button>
                </div>
              ))}

              {/* Add checklist item */}
              <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
                <input value={newCheckItem} onChange={e => setNewCheckItem(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && newCheckItem.trim()) { onAddCheck(task.id, newCheckItem.trim()); setNewCheckItem(""); } }}
                  placeholder="Add a task… (press Enter)"
                  style={{ ...inputStyle, flex: 1, fontSize: 12, padding: "7px 11px" }} />
                <button onClick={() => { if (newCheckItem.trim()) { onAddCheck(task.id, newCheckItem.trim()); setNewCheckItem(""); } }}
                  style={{ padding: "7px 12px", borderRadius: 9, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF", cursor: "pointer", fontSize: 12 }}>
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* ── A. Media & Files ── */}
          <div>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Image size={12} /> Media &amp; Files
            </label>

            {/* Thumbnail */}
            <div style={{ marginBottom: 14 }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 8px" }}>Thumbnail / Cover Image</p>
              <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                <label style={{
                  display: "flex", alignItems: "center", gap: 6, padding: "7px 13px", borderRadius: 9,
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#94a3b8", fontSize: 12, cursor: "pointer",
                }}>
                  <Upload size={12} /> Upload Image
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={e => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const url = URL.createObjectURL(file);
                      setThumbPasteUrl(url);
                      onUpdate(task.id, { thumbnailUrl: url, thumbnailPasteUrl: url });
                    }
                  }} />
                </label>
                <input value={thumbPasteUrl} onChange={e => { setThumbPasteUrl(e.target.value); onUpdate(task.id, { thumbnailPasteUrl: e.target.value }); }}
                  placeholder="or paste URL…"
                  style={{ ...inputStyle, flex: 1, minWidth: 140, fontSize: 12, padding: "7px 11px" }} />
              </div>
              {thumbPasteUrl && (
                <div style={{ marginTop: 10, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(255,255,255,0.08)", maxWidth: 200 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumbPasteUrl} alt="Thumbnail preview" style={{ width: "100%", display: "block" }} onError={e => (e.currentTarget.style.display = "none")} />
                </div>
              )}
            </div>

            {/* Narration */}
            <div style={{ marginBottom: 12 }}>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 8px" }}>Narration (Google Drive)</p>
              <div style={{ position: "relative" }}>
                <Link2 size={12} color="#475569" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={narrationUrl} onChange={e => { setNarrationUrl(e.target.value); onUpdate(task.id, { narrationUrl: e.target.value }); }}
                  placeholder="Paste Google Drive link…"
                  style={{ ...inputStyle, width: "100%", paddingLeft: 32, fontSize: 12, padding: "7px 11px 7px 32px" }} />
              </div>
            </div>

            {/* Final Video */}
            <div>
              <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 8px" }}>Final Video (Google Drive)</p>
              <div style={{ position: "relative" }}>
                <Link2 size={12} color="#475569" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input value={finalVideoUrl} onChange={e => { setFinalVideoUrl(e.target.value); onUpdate(task.id, { finalVideoUrl: e.target.value }); }}
                  placeholder="Paste Google Drive link…"
                  style={{ ...inputStyle, width: "100%", paddingLeft: 32, fontSize: 12, padding: "7px 11px 7px 32px" }} />
              </div>
            </div>
          </div>

          {/* ── B. Links ── */}
          <div>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <Link2 size={12} /> Links
            </label>

            {links.length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginBottom: 10 }}>
                {links.map((link, idx) => (
                  <div key={idx} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 10px", borderRadius: 8, background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)" }}>
                    <a href={link.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#00D4FF", textDecoration: "none", display: "flex", alignItems: "center", gap: 5 }}>
                      <ExternalLink size={10} /> {link.label}
                    </a>
                    <button onClick={() => removeLink(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0, display: "flex" }}>
                      <X size={10} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {showAddLink ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <input value={newLinkLabel} onChange={e => setNewLinkLabel(e.target.value)} placeholder="Label (optional)"
                  style={{ ...inputStyle, fontSize: 12, padding: "7px 11px" }} />
                <input value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} placeholder="https://…"
                  onKeyDown={e => e.key === "Enter" && addLink()}
                  style={{ ...inputStyle, fontSize: 12, padding: "7px 11px" }} />
                <div style={{ display: "flex", gap: 7 }}>
                  <button onClick={() => { setShowAddLink(false); setNewLinkLabel(""); setNewLinkUrl(""); }} style={{ flex: 1, padding: "6px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)", color: "#64748b", fontSize: 12, cursor: "pointer" }}>Cancel</button>
                  <button onClick={addLink} style={{ flex: 1, padding: "6px", borderRadius: 8, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>Save</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setShowAddLink(true)} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#00D4FF", background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 8, padding: "6px 12px", cursor: "pointer" }}>
                <Plus size={12} /> Add Link
              </button>
            )}
          </div>

          {/* ── C. Discussion ── */}
          <div>
            <label style={{ ...labelStyle, display: "flex", alignItems: "center", gap: 6, marginBottom: 12 }}>
              <MessageSquare size={12} /> Discussion {comments.length > 0 && `(${comments.length})`}
            </label>

            {comments.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 14 }}>
                {comments.map((c, idx) => (
                  <div key={idx} style={{ display: "flex", gap: 10, padding: "10px 12px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                    onMouseEnter={e => {
                      const btns = e.currentTarget.querySelectorAll<HTMLButtonElement>(".comment-action");
                      btns.forEach(b => b.style.opacity = "1");
                    }}
                    onMouseLeave={e => {
                      const btns = e.currentTarget.querySelectorAll<HTMLButtonElement>(".comment-action");
                      btns.forEach(b => b.style.opacity = "0");
                    }}
                  >
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 800, color: "#00D4FF", flexShrink: 0 }}>
                      {c.author[0].toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{c.author}</span>
                        <span style={{ fontSize: 10, color: "#64748b" }}>{c.date}</span>
                        <button className="comment-action" onClick={() => { setEditingCommentIdx(idx); setEditingCommentText(c.text); }} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#475569", fontSize: 11, opacity: 0, transition: "opacity 0.15s" }}>Edit</button>
                        <button className="comment-action" onClick={() => deleteComment(idx)} style={{ background: "none", border: "none", cursor: "pointer", color: "#f87171", fontSize: 11, opacity: 0, transition: "opacity 0.15s" }}>Delete</button>
                      </div>
                      {editingCommentIdx === idx ? (
                        <div style={{ display: "flex", gap: 6 }}>
                          <input value={editingCommentText} onChange={e => setEditingCommentText(e.target.value)}
                            onKeyDown={e => { if (e.key === "Enter") saveEditComment(idx); if (e.key === "Escape") setEditingCommentIdx(null); }}
                            style={{ ...inputStyle, flex: 1, fontSize: 12, padding: "5px 9px" }} autoFocus />
                          <button onClick={() => saveEditComment(idx)} style={{ padding: "5px 10px", borderRadius: 7, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF", fontSize: 11, cursor: "pointer" }}>Save</button>
                        </div>
                      ) : (
                        <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{c.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: "flex", gap: 8, alignItems: "flex-end" }}>
              <textarea value={newComment} onChange={e => setNewComment(e.target.value)} rows={2}
                placeholder="Add a comment…"
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); postComment(); } }}
                style={{ ...inputStyle, flex: 1, resize: "none", fontFamily: "inherit", fontSize: 12, padding: "8px 11px", lineHeight: 1.5 }} />
              <button onClick={postComment} disabled={!newComment.trim()} style={{
                padding: "8px 14px", borderRadius: 9, fontSize: 12, fontWeight: 700,
                background: newComment.trim() ? "rgba(0,212,255,0.1)" : "rgba(255,255,255,0.02)",
                border: newComment.trim() ? "1px solid rgba(0,212,255,0.2)" : "1px solid rgba(255,255,255,0.06)",
                color: newComment.trim() ? "#00D4FF" : "#475569",
                cursor: newComment.trim() ? "pointer" : "not-allowed", flexShrink: 0,
              }}>Post</button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{ padding: "14px 22px", borderTop: "1px solid rgba(255,255,255,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center", flexShrink: 0 }}>
          <button onClick={() => { onDelete(task.id); onClose(); }} style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.18)", color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            <Trash2 size={12} /> Delete Card
          </button>
          <button onClick={onClose} style={{ padding: "8px 20px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProductionPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [addingTask, setAddingTask] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newStage, setNewStage] = useState<TaskStatus>("ideas");
  const [newPriority, setNewPriority] = useState<"high" | "medium" | "low">("medium");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase.from("production_tasks").select("*").order("position", { ascending: true });
      if (data && data.length > 0) {
        setTasks(data.map(t => ({
          id: t.id, title: t.title, stage: t.stage as TaskStatus,
          priority: t.priority as "high" | "medium" | "low",
          dueDate: t.due_date, tags: t.tags || [], checklist: t.checklist || [],
          ...TASK_DEFAULTS,
        })));
      }
    };
    load();
  }, []);

  // Keep detail modal in sync with task list changes
  useEffect(() => {
    if (selectedTask) {
      const updated = tasks.find(t => t.id === selectedTask.id);
      if (updated) setSelectedTask(updated);
    }
  }, [tasks]); // eslint-disable-line react-hooks/exhaustive-deps

  const persist = async (id: string, fields: Record<string, unknown>) => {
    const supabase = createClient();
    await supabase.from("production_tasks").update(fields).eq("id", id);
  };

  const moveTask = async (id: string, stage: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, stage } : t));
    await persist(id, { stage });
  };

  const updateTask = async (id: string, fields: Partial<Task>) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...fields } : t));
    const dbFields: Record<string, unknown> = {};
    if (fields.title !== undefined) dbFields.title = fields.title;
    if (fields.priority !== undefined) dbFields.priority = fields.priority;
    if (fields.dueDate !== undefined) dbFields.due_date = fields.dueDate;
    if (Object.keys(dbFields).length) await persist(id, dbFields);
  };

  const deleteTask = async (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    const supabase = createClient();
    await supabase.from("production_tasks").delete().eq("id", id);
  };

  const toggleCheck = async (id: string, idx: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      const checklist = t.checklist.map((c, i) => i === idx ? { ...c, done: !c.done } : c);
      return { ...t, checklist };
    }));
    const task = tasks.find(t => t.id === id)!;
    const checklist = task.checklist.map((c, i) => i === idx ? { ...c, done: !c.done } : c);
    await persist(id, { checklist });
  };

  const addCheckItem = async (id: string, label: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, checklist: [...t.checklist, { done: false, label }] };
    }));
    const task = tasks.find(t => t.id === id)!;
    await persist(id, { checklist: [...task.checklist, { done: false, label }] });
  };

  const deleteCheckItem = async (id: string, idx: number) => {
    setTasks(prev => prev.map(t => {
      if (t.id !== id) return t;
      return { ...t, checklist: t.checklist.filter((_, i) => i !== idx) };
    }));
    const task = tasks.find(t => t.id === id)!;
    await persist(id, { checklist: task.checklist.filter((_, i) => i !== idx) });
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;
    const task: Task = { id: Date.now().toString(), title: newTitle.trim(), stage: newStage, priority: newPriority, tags: [], checklist: [], ...TASK_DEFAULTS };
    setTasks(prev => [task, ...prev]);
    const supabase = createClient();
    await supabase.from("production_tasks").insert({ id: task.id, title: task.title, stage: task.stage, priority: task.priority, tags: [], checklist: [], position: 0 });
    setNewTitle(""); setNewStage("ideas"); setNewPriority("medium");
    setAddingTask(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A", display: "flex", flexDirection: "column" }}>
      <Topbar
        title="Production Board"
        subtitle="Track your videos from idea to publish"
        action={{ label: "Add Video", icon: <Plus size={13} />, onClick: () => setAddingTask(true) }}
      />

      <div style={{ padding: "24px 28px", flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Stats */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          {[
            { label: "Total Videos", value: tasks.length, color: "#00D4FF" },
            { label: "In Progress", value: tasks.filter(t => t.stage === "production" || t.stage === "scripting").length, color: "#a78bfa" },
            { label: "Editing", value: tasks.filter(t => t.stage === "editing").length, color: "#fb923c" },
            { label: "Published", value: tasks.filter(t => t.stage === "published").length, color: "#34d399" },
          ].map(s => (
            <div key={s.label} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 18px", borderRadius: 12, background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))", border: "1px solid rgba(255,255,255,0.06)" }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: s.color, letterSpacing: "-1px" }}>{s.value}</span>
              <span style={{ fontSize: 12, color: "#64748b" }}>{s.label}</span>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div style={{ display: "flex", gap: 14, overflowX: "auto", flex: 1, paddingBottom: 16 }}>
          {COLUMNS.map(col => {
            const colTasks = tasks.filter(t => t.stage === col.id);
            return (
              <div key={col.id} style={{ flexShrink: 0, width: 256, display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", borderRadius: 12, marginBottom: 12, background: col.headerBg, border: `1px solid ${col.headerBorder}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{col.label}</span>
                    <div style={{ fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: "50%", background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8" }}>{colTasks.length}</div>
                  </div>
                  <button onClick={() => { setNewStage(col.id); setAddingTask(true); }} style={{ width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.05)", border: "none", display: "flex", alignItems: "center", justifyContent: "center", color: "#94a3b8", cursor: "pointer" }}>
                    <Plus size={11} />
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, overflowY: "auto" }}>
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => setSelectedTask(task)} onMove={moveTask} />
                  ))}
                  {colTasks.length === 0 && (
                    <div style={{ border: "1px dashed rgba(255,255,255,0.07)", borderRadius: 12, padding: "24px", textAlign: "center" }}>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>No videos here yet</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Card Detail Modal */}
      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onUpdate={updateTask}
          onDelete={deleteTask}
          onMove={moveTask}
          onToggleCheck={toggleCheck}
          onAddCheck={addCheckItem}
          onDeleteCheck={deleteCheckItem}
        />
      )}

      {/* Add Video Modal */}
      {addingTask && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }} onClick={() => setAddingTask(false)}>
          <div style={{ width: 420, borderRadius: 18, background: "linear-gradient(135deg, #0F1829, #08111F)", border: "1px solid rgba(0,212,255,0.2)", boxShadow: "0 32px 80px rgba(0,0,0,0.8)", padding: "24px" }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", letterSpacing: "-0.3px" }}>Add New Video</h2>

            <div style={{ marginBottom: 14 }}>
              <label style={labelStyle}>Video Title</label>
              <input autoFocus value={newTitle} onChange={e => setNewTitle(e.target.value)} onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="e.g. 5 AI Tools That Actually Make Money"
                style={inputStyle}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
              <div>
                <label style={labelStyle}>Stage</label>
                <select value={newStage} onChange={e => setNewStage(e.target.value as TaskStatus)} style={{ ...inputStyle, cursor: "pointer" }}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Priority</label>
                <select value={newPriority} onChange={e => setNewPriority(e.target.value as "high" | "medium" | "low")} style={{ ...inputStyle, cursor: "pointer" }}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setAddingTask(false)} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={addTask} disabled={!newTitle.trim()} style={{ flex: 1, padding: "11px", borderRadius: 11, background: newTitle.trim() ? "linear-gradient(135deg, #00D4FF, #0080cc)" : "rgba(0,212,255,0.2)", border: "none", color: newTitle.trim() ? "#04080F" : "#475569", fontSize: 13, fontWeight: 800, cursor: newTitle.trim() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>Add Video</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
