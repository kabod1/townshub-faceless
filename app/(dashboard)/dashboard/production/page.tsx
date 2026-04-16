"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import { Plus, Calendar } from "lucide-react";

type TaskStatus = "ideas" | "scripting" | "production" | "editing" | "scheduled" | "published";

interface Task {
  id: string;
  title: string;
  stage: TaskStatus;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  tags: string[];
  checklist: { done: boolean; label: string }[];
}

const COLUMNS: { id: TaskStatus; label: string; dot: string; headerBg: string; headerBorder: string }[] = [
  { id: "ideas",      label: "Ideas",      dot: "#facc15", headerBg: "rgba(250,204,21,0.06)",  headerBorder: "rgba(250,204,21,0.18)" },
  { id: "scripting",  label: "Scripting",  dot: "#00D4FF", headerBg: "rgba(0,212,255,0.06)",   headerBorder: "rgba(0,212,255,0.18)"  },
  { id: "production", label: "Production", dot: "#a78bfa", headerBg: "rgba(167,139,250,0.06)", headerBorder: "rgba(167,139,250,0.18)"},
  { id: "editing",    label: "Editing",    dot: "#fb923c", headerBg: "rgba(251,146,60,0.06)",  headerBorder: "rgba(251,146,60,0.18)" },
  { id: "scheduled",  label: "Scheduled",  dot: "#60a5fa", headerBg: "rgba(96,165,250,0.06)",  headerBorder: "rgba(96,165,250,0.18)" },
  { id: "published",  label: "Published",  dot: "#34d399", headerBg: "rgba(52,211,153,0.06)",  headerBorder: "rgba(52,211,153,0.18)" },
];

const PRIORITY: Record<string, { bg: string; color: string; border: string }> = {
  high:   { bg: "rgba(239,68,68,0.1)",   color: "#f87171", border: "rgba(239,68,68,0.25)"   },
  medium: { bg: "rgba(250,204,21,0.1)",  color: "#facc15", border: "rgba(250,204,21,0.25)"  },
  low:    { bg: "rgba(100,116,139,0.1)", color: "#64748b", border: "rgba(100,116,139,0.2)"  },
};

const INITIAL_TASKS: Task[] = [
  {
    id: "1", title: "Why 99% of Faceless Channels Fail", stage: "scripting", priority: "high", dueDate: "Apr 18",
    tags: ["YouTube Growth", "10 min"],
    checklist: [{ done: true, label: "Research competitors" }, { done: true, label: "Outline script" }, { done: false, label: "Write full script" }, { done: false, label: "Review & edit" }],
  },
  {
    id: "2", title: "5 AI Tools That Actually Make Money", stage: "ideas", priority: "medium",
    tags: ["AI Tools", "8 min"],
    checklist: [{ done: false, label: "Validate idea" }, { done: false, label: "Keyword research" }],
  },
  {
    id: "3", title: "Faceless Channel Niche Blueprint 2025", stage: "production", priority: "high", dueDate: "Apr 22",
    tags: ["Niche Research", "15 min"],
    checklist: [{ done: true, label: "Script complete" }, { done: true, label: "Thumbnail designed" }, { done: false, label: "AI voiceover" }, { done: false, label: "B-roll footage" }],
  },
  {
    id: "4", title: "How I Made $0 My First 90 Days", stage: "editing", priority: "low", dueDate: "Apr 25",
    tags: ["Story", "12 min"],
    checklist: [{ done: true, label: "Script & VO done" }, { done: false, label: "Edit video" }, { done: false, label: "Add captions" }],
  },
  {
    id: "5", title: "Top 10 Faceless Niches That Print Money", stage: "scheduled", priority: "medium", dueDate: "Apr 28",
    tags: ["List Video", "10 min"],
    checklist: [{ done: true, label: "All production done" }, { done: false, label: "Schedule on YouTube" }],
  },
];

function TaskCard({ task, onMove }: { task: Task; onMove: (id: string, stage: TaskStatus) => void }) {
  const done = task.checklist.filter(c => c.done).length;
  const total = task.checklist.length;
  const progress = total > 0 ? (done / total) * 100 : 0;
  const p = PRIORITY[task.priority];
  const moveCols = COLUMNS.filter(c => c.id !== task.stage).slice(0, 2);

  return (
    <div style={{
      borderRadius: 12, padding: "14px 14px",
      background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
      border: "1px solid rgba(255,255,255,0.06)", cursor: "grab",
    }}>
      {/* Tags + priority */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {task.tags.map(tag => (
            <span key={tag} style={{ fontSize: 10, padding: "2px 7px", borderRadius: 99, background: "rgba(255,255,255,0.04)", color: "#94a3b8" }}>{tag}</span>
          ))}
        </div>
        <span style={{
          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99,
          background: p.bg, color: p.color, border: `1px solid ${p.border}`,
          textTransform: "capitalize", flexShrink: 0,
        }}>{task.priority}</span>
      </div>

      {/* Title */}
      <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", lineHeight: 1.4, margin: "0 0 10px" }}>{task.title}</p>

      {/* Progress */}
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

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {task.dueDate ? (
          <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#94a3b8" }}>
            <Calendar size={9} /> {task.dueDate}
          </span>
        ) : <span />}
        <div style={{ display: "flex", gap: 4 }}>
          {moveCols.map(col => (
            <button key={col.id} onClick={() => onMove(task.id, col.id)} style={{
              fontSize: 10, padding: "2px 8px", borderRadius: 6,
              background: "rgba(255,255,255,0.04)", border: "none",
              color: "#64748b", cursor: "pointer",
            }}>→ {col.label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductionPage() {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
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
        })));
      }
    };
    load();
  }, []);

  const moveTask = async (id: string, stage: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, stage } : t));
    const supabase = createClient();
    await supabase.from("production_tasks").update({ stage }).eq("id", id);
  };

  const addTask = async () => {
    if (!newTitle.trim()) return;
    const task: Task = {
      id: Date.now().toString(), title: newTitle.trim(),
      stage: newStage, priority: newPriority, tags: [], checklist: [],
    };
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
            <div key={s.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 18px", borderRadius: 12,
              background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
              border: "1px solid rgba(255,255,255,0.06)",
            }}>
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
                {/* Header */}
                <div style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  padding: "10px 14px", borderRadius: 12, marginBottom: 12,
                  background: col.headerBg, border: `1px solid ${col.headerBorder}`,
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 7, height: 7, borderRadius: "50%", background: col.dot, flexShrink: 0 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{col.label}</span>
                    <div style={{
                      fontSize: 10, fontWeight: 700, minWidth: 18, height: 18, borderRadius: "50%",
                      background: "rgba(255,255,255,0.07)", display: "flex", alignItems: "center",
                      justifyContent: "center", color: "#94a3b8",
                    }}>{colTasks.length}</div>
                  </div>
                  <button style={{
                    width: 22, height: 22, borderRadius: 6, background: "rgba(255,255,255,0.05)",
                    border: "none", display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#94a3b8", cursor: "pointer",
                  }}>
                    <Plus size={11} />
                  </button>
                </div>

                {/* Task list */}
                <div style={{ display: "flex", flexDirection: "column", gap: 10, flex: 1, overflowY: "auto" }}>
                  {colTasks.map(task => (
                    <TaskCard key={task.id} task={task} onMove={moveTask} />
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

      {/* Add Video Modal */}
      {addingTask && (
        <div style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100,
        }} onClick={() => setAddingTask(false)}>
          <div style={{
            width: 420, borderRadius: 18,
            background: "linear-gradient(135deg, #0F1829, #08111F)",
            border: "1px solid rgba(0,212,255,0.2)",
            boxShadow: "0 32px 80px rgba(0,0,0,0.8)",
            padding: "24px",
          }} onClick={e => e.stopPropagation()}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: "0 0 20px", letterSpacing: "-0.3px" }}>Add New Video</h2>

            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Video Title</label>
              <input
                autoFocus
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && addTask()}
                placeholder="e.g. 5 AI Tools That Actually Make Money"
                style={{ width: "100%", boxSizing: "border-box", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 22 }}>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Stage</label>
                <select value={newStage} onChange={e => setNewStage(e.target.value as TaskStatus)} style={{ width: "100%", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", cursor: "pointer" }}>
                  {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Priority</label>
                <select value={newPriority} onChange={e => setNewPriority(e.target.value as "high" | "medium" | "low")} style={{ width: "100%", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, padding: "10px 13px", color: "#e2e8f0", fontSize: 13, outline: "none", cursor: "pointer" }}>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setAddingTask(false)} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                Cancel
              </button>
              <button onClick={addTask} disabled={!newTitle.trim()} style={{ flex: 1, padding: "11px", borderRadius: 11, background: newTitle.trim() ? "linear-gradient(135deg, #00D4FF, #0080cc)" : "rgba(0,212,255,0.2)", border: "none", color: newTitle.trim() ? "#04080F" : "#475569", fontSize: 13, fontWeight: 800, cursor: newTitle.trim() ? "pointer" : "not-allowed", transition: "all 0.15s" }}>
                Add Video
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
