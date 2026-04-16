"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  Video,
  Calendar,
  Clock,
  Tag,
  Eye,
  Upload,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Plus,
  X,
  Save,
} from "lucide-react";

interface Plan {
  id: string;
  createdAt: string;
  videoId: string;
  title: string;
  description: string;
  tags: string[];
  categoryId: string;
  scheduledDate: string;
  scheduledTime: string;
  visibility: "public" | "private" | "unlisted";
}

const CATEGORIES = [
  { id: "22", label: "People & Blogs" },
  { id: "28", label: "Science & Technology" },
  { id: "26", label: "Howto & Style" },
  { id: "27", label: "Education" },
  { id: "24", label: "Entertainment" },
  { id: "25", label: "News & Politics" },
  { id: "17", label: "Sports" },
  { id: "19", label: "Travel & Events" },
];

const CHECKLIST_ITEMS = [
  "Script written",
  "Voiceover recorded",
  "Video edited",
  "Thumbnail created",
  "Description written",
  "Tags added",
];

const CARD_STYLE: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  padding: "20px 22px",
  marginBottom: 16,
};

const INPUT_STYLE: React.CSSProperties = {
  width: "100%",
  background: "rgba(0,0,0,0.3)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 10,
  color: "#e2e8f0",
  fontSize: 14,
  padding: "10px 14px",
  outline: "none",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  display: "block",
  marginBottom: 8,
};

function parseVideoId(value: string): string {
  try {
    const url = new URL(value);
    return url.searchParams.get("v") || url.pathname.split("/").pop() || value;
  } catch {
    return value;
  }
}

function offsetDate(days: number): { date: string; time: string } {
  const d = new Date();
  d.setDate(d.getDate() + days);
  const date = d.toISOString().split("T")[0];
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return { date, time: `${hours}:${minutes}` };
}

export default function SchedulerPage() {
  const [videoId, setVideoId] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [categoryId, setCategoryId] = useState("22");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [visibility, setVisibility] = useState<"public" | "private" | "unlisted">("private");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const apiConnected = false;

  const [checklist, setChecklist] = useState<boolean[]>(CHECKLIST_ITEMS.map(() => false));
  const [savedPlans, setSavedPlans] = useLocalStorage<Plan[]>("th_yt_plans", []);

  function addTag() {
    const trimmed = tagInput.trim();
    if (!trimmed || tags.length >= 15 || tags.includes(trimmed)) return;
    setTags(prev => [...prev, trimmed]);
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(prev => prev.filter(t => t !== tag));
  }

  function savePlan() {
    const plan: Plan = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      videoId, title, description, tags, categoryId, scheduledDate, scheduledTime, visibility,
    };
    setSavedPlans(prev => [plan, ...prev]);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  async function handleSchedule() {
    if (!apiConnected) return;
    setSaving(true);
    setError(null);
    try {
      const scheduledAt = scheduledDate && scheduledTime
        ? new Date(`${scheduledDate}T${scheduledTime}`).toISOString()
        : null;
      const res = await fetch("/api/schedule-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId, title, description, tags, categoryId, scheduledAt, privacyStatus: visibility }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to schedule video.");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setSaving(false);
    }
  }

  function toggleChecklist(i: number) {
    setChecklist(prev => prev.map((v, idx) => idx === i ? !v : v));
  }

  const visibilityOptions: Array<{ key: "public" | "private" | "unlisted"; label: string }> = [
    { key: "public", label: "Public" },
    { key: "unlisted", label: "Unlisted" },
    { key: "private", label: "Private" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      <Topbar
        title="YouTube Scheduler"
        subtitle="Plan, schedule, and publish your videos to YouTube"
      />

      <div style={{ flex: 1, padding: "20px 28px" }}>

        {/* API Warning Banner */}
        {!apiConnected && (
          <div style={{
            background: "rgba(245,158,11,0.08)",
            border: "1px solid rgba(245,158,11,0.3)",
            borderRadius: 12, padding: "12px 18px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
            marginBottom: 20, gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <AlertCircle size={16} color="#f59e0b" style={{ flexShrink: 0 }} />
              <span style={{ fontSize: 13, color: "#fbbf24" }}>
                YouTube API not connected. Fill in your plan and save it — scheduling will go live once you connect.
              </span>
            </div>
            <a
              href="#setup"
              style={{
                fontSize: 12, fontWeight: 700, color: "#f59e0b",
                background: "rgba(245,158,11,0.12)",
                border: "1px solid rgba(245,158,11,0.3)",
                borderRadius: 8, padding: "5px 14px",
                textDecoration: "none", whiteSpace: "nowrap",
                display: "flex", alignItems: "center", gap: 6,
              }}
            >
              <ExternalLink size={11} />
              Setup Guide
            </a>
          </div>
        )}

        <div style={{ display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

          {/* LEFT PANEL */}
          <div style={{ flex: 1, minWidth: 320 }}>

            {/* Video Details Card */}
            <div style={CARD_STYLE}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <Video size={15} color="#ff0000" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Video Details</span>
              </div>

              {/* Video ID */}
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL_STYLE}>YouTube Video ID or URL</label>
                <input
                  type="text"
                  placeholder="dQw4w9WgXcQ or youtube.com/watch?v=..."
                  value={videoId}
                  onChange={e => setVideoId(parseVideoId(e.target.value))}
                  style={INPUT_STYLE}
                />
              </div>

              {/* Title */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>Title</label>
                  <span style={{ fontSize: 11, color: title.length > 90 ? "#ef4444" : "#64748b" }}>
                    {title.length}/100
                  </span>
                </div>
                <input
                  type="text"
                  placeholder="Your video title…"
                  maxLength={100}
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  style={INPUT_STYLE}
                />
              </div>

              {/* Description */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>Description</label>
                  <span style={{ fontSize: 11, color: description.length > 4800 ? "#ef4444" : "#64748b" }}>
                    {description.length}/5000
                  </span>
                </div>
                <textarea
                  placeholder="Your video description…"
                  maxLength={5000}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  style={{ ...INPUT_STYLE, minHeight: 120, resize: "vertical", lineHeight: 1.6 }}
                />
              </div>

              {/* Tags */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
                  <label style={{ ...LABEL_STYLE, marginBottom: 0, display: "flex", alignItems: "center", gap: 5 }}>
                    <Tag size={11} /> Tags
                  </label>
                  <span style={{ fontSize: 11, color: tags.length >= 15 ? "#ef4444" : "#64748b" }}>
                    {tags.length}/15 tags
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
                  <input
                    type="text"
                    placeholder="Add a tag…"
                    value={tagInput}
                    onChange={e => setTagInput(e.target.value)}
                    onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                    style={{ ...INPUT_STYLE, flex: 1 }}
                  />
                  <button
                    onClick={addTag}
                    disabled={tags.length >= 15}
                    style={{
                      padding: "10px 14px", borderRadius: 10, border: "1px solid rgba(0,212,255,0.3)",
                      background: "rgba(0,212,255,0.08)", color: "#00D4FF",
                      cursor: tags.length >= 15 ? "not-allowed" : "pointer",
                      fontSize: 12, fontWeight: 700,
                      display: "flex", alignItems: "center", gap: 4,
                      flexShrink: 0,
                    }}
                  >
                    <Plus size={13} /> Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {tags.map(tag => (
                      <span key={tag} style={{
                        display: "inline-flex", alignItems: "center", gap: 6,
                        background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
                        borderRadius: 6, padding: "3px 10px", fontSize: 12, color: "#00D4FF",
                      }}>
                        {tag}
                        <button
                          onClick={() => removeTag(tag)}
                          style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 0, display: "flex" }}
                        >
                          <X size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Category */}
              <div style={{ marginBottom: 16 }}>
                <label style={LABEL_STYLE}>Category</label>
                <select
                  value={categoryId}
                  onChange={e => setCategoryId(e.target.value)}
                  style={{ ...INPUT_STYLE, cursor: "pointer" }}
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat.id} value={cat.id} style={{ background: "#0F182A" }}>{cat.label}</option>
                  ))}
                </select>
              </div>

              {/* Visibility */}
              <div>
                <label style={LABEL_STYLE}>
                  <Eye size={11} style={{ display: "inline", marginRight: 5 }} />
                  Visibility
                </label>
                <div style={{ display: "flex", gap: 8 }}>
                  {visibilityOptions.map(opt => (
                    <button
                      key={opt.key}
                      onClick={() => setVisibility(opt.key)}
                      style={{
                        flex: 1, padding: "8px 12px", borderRadius: 9,
                        border: visibility === opt.key ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(255,255,255,0.08)",
                        background: visibility === opt.key ? "rgba(0,212,255,0.1)" : "rgba(0,0,0,0.2)",
                        color: visibility === opt.key ? "#00D4FF" : "#64748b",
                        fontSize: 12, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                      }}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Schedule Time Card */}
            <div style={CARD_STYLE}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                <Calendar size={15} color="#00D4FF" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Schedule Time</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 14 }}>
                <div>
                  <label style={LABEL_STYLE}>Date</label>
                  <input type="date" value={scheduledDate} onChange={e => setScheduledDate(e.target.value)} style={INPUT_STYLE} />
                </div>
                <div>
                  <label style={LABEL_STYLE}>Time</label>
                  <input type="time" value={scheduledTime} onChange={e => setScheduledTime(e.target.value)} style={INPUT_STYLE} />
                </div>
              </div>

              <p style={{ fontSize: 11, color: "#64748b", marginBottom: 14 }}>
                <Clock size={10} style={{ display: "inline", marginRight: 4 }} />
                Scheduled videos publish automatically at the set time (YouTube timezone).
              </p>

              <div style={{ display: "flex", gap: 8 }}>
                {[
                  { label: "+1 day", days: 1 },
                  { label: "+3 days", days: 3 },
                  { label: "+1 week", days: 7 },
                ].map(opt => (
                  <button
                    key={opt.label}
                    onClick={() => {
                      const { date, time } = offsetDate(opt.days);
                      setScheduledDate(date);
                      setScheduledTime(time);
                    }}
                    style={{
                      flex: 1, padding: "7px 10px", borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(0,0,0,0.2)", color: "#94a3b8",
                      fontSize: 12, fontWeight: 600, cursor: "pointer",
                      transition: "all 0.15s",
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT PANEL */}
          <div style={{ width: 300, flexShrink: 0 }}>

            {/* Publish Checklist */}
            <div style={CARD_STYLE}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <CheckCircle2 size={15} color="#00D4FF" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Publish Checklist</span>
              </div>
              {CHECKLIST_ITEMS.map((item, i) => (
                <button
                  key={item}
                  onClick={() => toggleChecklist(i)}
                  style={{
                    display: "flex", alignItems: "center", gap: 10,
                    width: "100%", background: "none", border: "none",
                    cursor: "pointer", padding: "7px 0", textAlign: "left",
                  }}
                >
                  <div style={{
                    width: 18, height: 18, borderRadius: 5, flexShrink: 0,
                    border: checklist[i] ? "none" : "2px solid rgba(255,255,255,0.15)",
                    background: checklist[i] ? "linear-gradient(135deg, #00D4FF, #0080cc)" : "transparent",
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {checklist[i] && <CheckCircle2 size={12} color="#04080F" />}
                  </div>
                  <span style={{
                    fontSize: 13,
                    color: checklist[i] ? "#64748b" : "#94a3b8",
                    textDecoration: checklist[i] ? "line-through" : "none",
                  }}>
                    {item}
                  </span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 16 }}>
              {/* Save Plan */}
              <button
                onClick={savePlan}
                style={{
                  width: "100%", padding: "11px 16px", borderRadius: 11,
                  border: "1px solid rgba(0,212,255,0.3)",
                  background: saved ? "rgba(34,197,94,0.1)" : "rgba(0,212,255,0.06)",
                  color: saved ? "#22c55e" : "#00D4FF",
                  fontSize: 13, fontWeight: 700, cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  transition: "all 0.2s",
                }}
              >
                {saved ? <CheckCircle2 size={14} /> : <Save size={14} />}
                {saved ? "Plan Saved!" : "Save Plan"}
              </button>

              {/* Schedule on YouTube */}
              <button
                onClick={handleSchedule}
                disabled={!apiConnected || saving}
                title={!apiConnected ? "Connect YouTube API first (see Setup Guide below)" : undefined}
                style={{
                  width: "100%", padding: "11px 16px", borderRadius: 11,
                  border: "none",
                  background: apiConnected
                    ? "linear-gradient(135deg, #00D4FF, #0080cc)"
                    : "rgba(0,212,255,0.12)",
                  color: apiConnected ? "#04080F" : "rgba(0,212,255,0.4)",
                  fontSize: 13, fontWeight: 800, cursor: apiConnected ? "pointer" : "not-allowed",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  boxShadow: apiConnected ? "0 0 18px rgba(0,212,255,0.25)" : "none",
                  transition: "all 0.2s",
                }}
              >
                <Upload size={14} />
                {saving ? "Scheduling…" : "Schedule on YouTube"}
              </button>

              {/* YouTube Studio */}
              <a
                href="https://studio.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  width: "100%", padding: "10px 16px", borderRadius: 11,
                  border: "1px solid rgba(255,0,0,0.2)",
                  background: "rgba(255,0,0,0.06)",
                  color: "#f87171", fontSize: 13, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                  textDecoration: "none", boxSizing: "border-box",
                  transition: "all 0.15s",
                }}
              >
                <Video size={14} />
                Open YouTube Studio
                <ExternalLink size={11} />
              </a>
            </div>

            {/* Error */}
            {error && (
              <div style={{
                background: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.3)",
                borderRadius: 10, padding: "12px 16px", marginBottom: 16,
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                  <AlertCircle size={14} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                  <span style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.5 }}>{error}</span>
                </div>
              </div>
            )}

            {/* Setup Guide */}
            <div id="setup" style={CARD_STYLE}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Video size={15} color="#ff0000" />
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Connect YouTube API</h3>
              </div>
              {[
                "Go to Google Cloud Console",
                "Create project → Enable YouTube Data API v3",
                "Create OAuth 2.0 credentials",
                "Add YOUTUBE_CLIENT_ID and YOUTUBE_CLIENT_SECRET to Vercel env vars",
                "Add N8N_YOUTUBE_WEBHOOK_URL to Vercel env vars",
                "Authorize once in n8n → refresh token saved",
              ].map((step, i) => (
                <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                  <div style={{
                    width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                    background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 10, fontWeight: 800, color: "#00D4FF",
                  }}>
                    {i + 1}
                  </div>
                  <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, paddingTop: 3 }}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Saved Plans */}
        {savedPlans.length > 0 && (
          <div style={{ marginTop: 32 }}>
            <h2 style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", marginBottom: 16 }}>
              Saved Plans
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 14 }}>
              {savedPlans.map(plan => (
                <div key={plan.id} style={{
                  background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 12, padding: "16px 18px",
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>
                    {plan.title || "(No title)"}
                  </div>
                  <div style={{ fontSize: 11, color: "#64748b", marginBottom: 8 }}>
                    ID: {plan.videoId || "—"}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 11, color: "#94a3b8" }}>
                      {plan.scheduledDate ? `${plan.scheduledDate} ${plan.scheduledTime}` : "No date set"}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, borderRadius: 5, padding: "2px 8px",
                      background: plan.visibility === "public"
                        ? "rgba(34,197,94,0.12)"
                        : plan.visibility === "unlisted"
                        ? "rgba(245,158,11,0.12)"
                        : "rgba(148,163,184,0.12)",
                      color: plan.visibility === "public"
                        ? "#22c55e"
                        : plan.visibility === "unlisted"
                        ? "#f59e0b"
                        : "#94a3b8",
                      border: plan.visibility === "public"
                        ? "1px solid rgba(34,197,94,0.25)"
                        : plan.visibility === "unlisted"
                        ? "1px solid rgba(245,158,11,0.25)"
                        : "1px solid rgba(148,163,184,0.2)",
                    }}>
                      {plan.visibility}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
