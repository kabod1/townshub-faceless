"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { Topbar } from "@/components/dashboard/topbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardBody } from "@/components/ui/card";
import {
  Plus, GripVertical, Clock, User, Calendar,
  MoreHorizontal, CheckCircle2, Circle, AlertCircle,
  Kanban, Video, Image, Mic2, Upload, Eye
} from "lucide-react";

type TaskStatus = "ideas" | "scripting" | "production" | "editing" | "scheduled" | "published";

interface Task {
  id: string;
  title: string;
  stage: TaskStatus;
  priority: "high" | "medium" | "low";
  dueDate?: string;
  assignee?: string;
  thumbnail?: string;
  tags: string[];
  checklist: { done: boolean; label: string }[];
}

const columns: { id: TaskStatus; label: string; color: string; icon: React.ReactNode }[] = [
  { id: "ideas", label: "Ideas", color: "border-yellow-500/20 bg-yellow-500/4", icon: <AlertCircle size={14} className="text-yellow-400" /> },
  { id: "scripting", label: "Scripting", color: "border-cyan-500/20 bg-cyan-500/4", icon: <Circle size={14} className="text-cyan-400" /> },
  { id: "production", label: "Production", color: "border-violet-500/20 bg-violet-500/4", icon: <Video size={14} className="text-violet-400" /> },
  { id: "editing", label: "Editing", color: "border-orange-500/20 bg-orange-500/4", icon: <Image size={14} className="text-orange-400" /> },
  { id: "scheduled", label: "Scheduled", color: "border-blue-500/20 bg-blue-500/4", icon: <Calendar size={14} className="text-blue-400" /> },
  { id: "published", label: "Published", color: "border-emerald-500/20 bg-emerald-500/4", icon: <CheckCircle2 size={14} className="text-emerald-400" /> },
];

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Why 99% of Faceless Channels Fail",
    stage: "scripting",
    priority: "high",
    dueDate: "Apr 18",
    tags: ["YouTube Growth", "10 min"],
    checklist: [
      { done: true, label: "Research competitors" },
      { done: true, label: "Outline script" },
      { done: false, label: "Write full script" },
      { done: false, label: "Review & edit" },
    ],
  },
  {
    id: "2",
    title: "5 AI Tools That Actually Make Money",
    stage: "ideas",
    priority: "medium",
    tags: ["AI Tools", "8 min"],
    checklist: [
      { done: false, label: "Validate idea" },
      { done: false, label: "Keyword research" },
    ],
  },
  {
    id: "3",
    title: "Faceless Channel Niche Blueprint 2025",
    stage: "production",
    priority: "high",
    dueDate: "Apr 22",
    tags: ["Niche Research", "15 min"],
    checklist: [
      { done: true, label: "Script complete" },
      { done: true, label: "Thumbnail designed" },
      { done: false, label: "AI voiceover" },
      { done: false, label: "B-roll footage" },
    ],
  },
  {
    id: "4",
    title: "How I Made $0 My First 90 Days",
    stage: "editing",
    priority: "low",
    dueDate: "Apr 25",
    tags: ["Story", "12 min"],
    checklist: [
      { done: true, label: "Script & VO done" },
      { done: false, label: "Edit video" },
      { done: false, label: "Add captions" },
    ],
  },
  {
    id: "5",
    title: "Top 10 Faceless Niches That Print Money",
    stage: "scheduled",
    priority: "medium",
    dueDate: "Apr 28",
    tags: ["List Video", "10 min"],
    checklist: [
      { done: true, label: "All production done" },
      { done: false, label: "Schedule on YouTube" },
    ],
  },
];

const priorityColors = {
  high: "coral" as const,
  medium: "gold" as const,
  low: "neutral" as const,
};

function TaskCard({ task, onMove }: { task: Task; onMove: (id: string, stage: TaskStatus) => void }) {
  const done = task.checklist.filter(c => c.done).length;
  const total = task.checklist.length;
  const progress = total > 0 ? (done / total) * 100 : 0;

  return (
    <div className="group rounded-xl border border-white/8 bg-gradient-to-br from-[#162035]/90 to-[#0F1829]/95 p-3.5 cursor-grab active:cursor-grabbing hover:border-cyan-500/20 transition-all shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className="text-[10px] px-1.5 py-0.5 rounded bg-white/5 text-slate-500 font-medium">{tag}</span>
          ))}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <Badge variant={priorityColors[task.priority]}>{task.priority}</Badge>
          <button className="opacity-0 group-hover:opacity-100 text-slate-600 hover:text-slate-400 transition-all">
            <MoreHorizontal size={14} />
          </button>
        </div>
      </div>

      <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)] leading-snug mb-3">{task.title}</p>

      {total > 0 && (
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] text-slate-600">{done}/{total} tasks</span>
            <span className="text-[10px] text-slate-600">{Math.round(progress)}%</span>
          </div>
          <div className="h-1 rounded-full bg-white/5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-cyan-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {task.dueDate && (
            <span className="flex items-center gap-1 text-[10px] text-slate-500">
              <Calendar size={10} />
              {task.dueDate}
            </span>
          )}
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {columns
            .filter(c => c.id !== task.stage)
            .slice(0, 2)
            .map(col => (
              <button
                key={col.id}
                onClick={() => onMove(task.id, col.id)}
                className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-slate-500 hover:text-slate-300 hover:bg-white/10 transition-all"
              >
                → {col.label}
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

export default function ProductionPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [activeStage, setActiveStage] = useState<TaskStatus | "all">("all");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from("production_tasks")
        .select("*")
        .order("position", { ascending: true });
      if (data && data.length > 0) {
        setTasks(data.map((t) => ({
          id: t.id,
          title: t.title,
          stage: t.stage as TaskStatus,
          priority: t.priority as "high" | "medium" | "low",
          dueDate: t.due_date,
          assignee: t.assignee,
          tags: t.tags || [],
          checklist: t.checklist || [],
        })));
      }
    };
    load();
  }, []);

  const moveTask = async (id: string, newStage: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, stage: newStage } : t));
    const supabase = createClient();
    await supabase.from("production_tasks").update({ stage: newStage }).eq("id", id);
  };

  const getColumnTasks = (stage: TaskStatus) => tasks.filter(t => t.stage === stage);

  return (
    <div className="min-h-screen flex flex-col">
      <Topbar title="Production Board" action={{ label: "Add Video" }} />

      <div className="p-6 flex-1 flex flex-col">

        {/* Stats */}
        <div className="flex gap-4 mb-6 flex-wrap">
          {[
            { label: "Total Videos", value: tasks.length, icon: Video },
            { label: "In Production", value: tasks.filter(t => t.stage === "production" || t.stage === "scripting").length, icon: Mic2 },
            { label: "Editing", value: tasks.filter(t => t.stage === "editing").length, icon: Eye },
            { label: "Published", value: tasks.filter(t => t.stage === "published").length, icon: Upload },
          ].map((s) => (
            <div key={s.label} className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/8 bg-white/2">
              <s.icon size={14} className="text-cyan-400" />
              <span className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">{s.value}</span>
              <span className="text-xs text-slate-500">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 overflow-x-auto pb-4 flex-1 min-h-0">
          {columns.map((col) => {
            const colTasks = getColumnTasks(col.id);
            return (
              <div key={col.id} className="shrink-0 w-[260px] flex flex-col">
                {/* Column header */}
                <div className={`flex items-center justify-between p-3 rounded-xl border mb-3 ${col.color}`}>
                  <div className="flex items-center gap-2">
                    {col.icon}
                    <span className="text-xs font-bold font-[family-name:var(--font-syne)] text-white">{col.label}</span>
                    <span className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center text-[10px] font-bold text-slate-300">
                      {colTasks.length}
                    </span>
                  </div>
                  <button className="w-6 h-6 rounded-md bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-500 hover:text-slate-300 transition-all">
                    <Plus size={12} />
                  </button>
                </div>

                {/* Tasks */}
                <div className="flex-1 space-y-2.5 overflow-y-auto">
                  {colTasks.map((task) => (
                    <TaskCard key={task.id} task={task} onMove={moveTask} />
                  ))}
                  {colTasks.length === 0 && (
                    <div className="border border-dashed border-white/8 rounded-xl p-4 text-center">
                      <p className="text-xs text-slate-600">Drop here</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
