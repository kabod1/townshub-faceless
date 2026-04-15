"use client";

import { useState } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Sparkles, Plus, Trash2, Globe, CheckCircle2,
  PenLine, Mic, BookOpen, TrendingUp, Lightbulb, AlertCircle, Play
} from "lucide-react";

const toneOptions = [
  { value: "educational", label: "Educational & Informative" },
  { value: "entertaining", label: "Entertaining & Casual" },
  { value: "motivational", label: "Motivational & Inspiring" },
  { value: "storytelling", label: "Storytelling & Narrative" },
  { value: "analytical", label: "Analytical & Data-Driven" },
  { value: "conversational", label: "Conversational & Friendly" },
];

const hookStyles = [
  { id: "question", label: "Open with a Question", icon: "?" },
  { id: "statistic", label: "Shocking Statistic", icon: "#" },
  { id: "story", label: "Personal Story", icon: "✦" },
  { id: "controversy", label: "Controversial Statement", icon: "!" },
  { id: "pattern", label: "Pattern Interrupt", icon: "↯" },
  { id: "promise", label: "Bold Promise", icon: "→" },
];

const contentPillars = [
  "How-to Tutorials", "List Videos", "Reviews & Comparisons", "Opinion Pieces",
  "Case Studies", "Reaction Videos", "Explainers", "Vlogs",
];

interface ChannelProfile {
  id: string;
  name: string;
  niche: string;
  handle: string;
  competitors: string[];
}

interface StyleSettings {
  tone: string;
  hooks: string[];
  pillars: string[];
  writingDNA: string;
}

const DEFAULT_STYLE: StyleSettings = {
  tone: "educational",
  hooks: ["question", "promise"],
  pillars: ["How-to Tutorials", "List Videos"],
  writingDNA: "",
};

export default function StylePage() {
  const [style, setStyle] = useLocalStorage<StyleSettings>("th_style", DEFAULT_STYLE);
  const [channels, setChannels] = useLocalStorage<ChannelProfile[]>("th_channels", []);
  const [saved, setSaved] = useState(false);
  const [showAddChannel, setShowAddChannel] = useState(false);
  const [newChannel, setNewChannel] = useState({ name: "", niche: "", handle: "", competitor: "" });

  const toggleHook = (id: string) =>
    setStyle((p) => ({
      ...p,
      hooks: p.hooks.includes(id) ? p.hooks.filter((h) => h !== id) : [...p.hooks, id],
    }));

  const togglePillar = (p: string) =>
    setStyle((prev) => ({
      ...prev,
      pillars: prev.pillars.includes(p) ? prev.pillars.filter((x) => x !== p) : [...prev.pillars, p],
    }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const addChannel = () => {
    if (!newChannel.name) return;
    setChannels((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        name: newChannel.name,
        niche: newChannel.niche,
        handle: newChannel.handle,
        competitors: newChannel.competitor ? [newChannel.competitor] : [],
      },
    ]);
    setNewChannel({ name: "", niche: "", handle: "", competitor: "" });
    setShowAddChannel(false);
  };

  const card: React.CSSProperties = {
    background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
    border: "1px solid rgba(255,255,255,0.07)",
    borderRadius: 16,
  };

  const sectionLabel: React.CSSProperties = {
    fontSize: 10, fontWeight: 700, letterSpacing: "0.14em",
    textTransform: "uppercase", color: "#94a3b8", marginBottom: 10,
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="My Style & Profiles" subtitle="Configure how the AI writes for your channels" />

      <div style={{ padding: "28px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Banner */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12, padding: "14px 18px",
          borderRadius: 12, background: "rgba(251,146,60,0.06)", border: "1px solid rgba(251,146,60,0.18)",
          marginBottom: 28,
        }}>
          <AlertCircle size={15} color="#fb923c" style={{ flexShrink: 0 }} />
          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, flex: 1 }}>
            Add competitor channels so Townshub can learn your writing style and generate better scripts &amp; SEO keywords.
          </p>
          <button
            onClick={() => setShowAddChannel(true)}
            style={{
              padding: "7px 16px", borderRadius: 8, border: "1px solid rgba(251,146,60,0.3)",
              background: "rgba(251,146,60,0.1)", color: "#fb923c", fontSize: 12,
              fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap",
            }}
          >
            Set Up My Style
          </button>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

          {/* ── Left: Style Config ─────────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Writing Style Card */}
            <div style={card}>
              {/* Header */}
              <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Sparkles size={16} color="#00D4FF" />
                </div>
                <div>
                  <p style={{ fontSize: 15, fontWeight: 800, color: "#e2e8f0", margin: 0 }}>My Style</p>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: "2px 0 0" }}>Customize how the AI writes for you across all channels</p>
                </div>
              </div>

              <div style={{ padding: "22px" }}>

                {/* Writing Tone */}
                <div style={{ marginBottom: 22 }}>
                  <p style={sectionLabel}>Writing Tone</p>
                  <select
                    value={style.tone}
                    onChange={(e) => setStyle((p) => ({ ...p, tone: e.target.value }))}
                    style={inputStyle}
                  >
                    {toneOptions.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>

                {/* Hook Styles */}
                <div style={{ marginBottom: 22 }}>
                  <p style={sectionLabel}>Hook Styles</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                    {hookStyles.map((h) => {
                      const active = style.hooks.includes(h.id);
                      return (
                        <button
                          key={h.id}
                          onClick={() => toggleHook(h.id)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8,
                            padding: "10px 12px", borderRadius: 10, cursor: "pointer",
                            border: active ? "1px solid rgba(0,212,255,0.35)" : "1px solid rgba(255,255,255,0.07)",
                            background: active ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.02)",
                            transition: "all 0.15s",
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 800, width: 18, textAlign: "center", color: active ? "#00D4FF" : "#475569" }}>{h.icon}</span>
                          <span style={{ fontSize: 12, color: active ? "#7dd3fc" : "#475569", lineHeight: 1.3, textAlign: "left" }}>{h.label}</span>
                          {active && <CheckCircle2 size={12} color="#00D4FF" style={{ marginLeft: "auto", flexShrink: 0 }} />}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Pillars */}
                <div style={{ marginBottom: 22 }}>
                  <p style={sectionLabel}>Content Pillars</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                    {contentPillars.map((p) => {
                      const active = style.pillars.includes(p);
                      return (
                        <button
                          key={p}
                          onClick={() => togglePillar(p)}
                          style={{
                            padding: "7px 14px", borderRadius: 99, cursor: "pointer",
                            fontSize: 12, fontWeight: 500,
                            border: active ? "1px solid rgba(0,212,255,0.3)" : "1px solid rgba(255,255,255,0.07)",
                            background: active ? "rgba(0,212,255,0.08)" : "rgba(255,255,255,0.02)",
                            color: active ? "#7dd3fc" : "#475569",
                            transition: "all 0.15s",
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Writing DNA */}
                <div style={{ marginBottom: 22 }}>
                  <p style={sectionLabel}>Writing DNA (Custom Instructions)</p>
                  <textarea
                    value={style.writingDNA}
                    onChange={(e) => setStyle((p) => ({ ...p, writingDNA: e.target.value }))}
                    rows={4}
                    placeholder="e.g. Always start with a counterintuitive insight. Use short punchy sentences. Avoid corporate jargon. Reference real examples whenever possible..."
                    style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                  />
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>These instructions are applied to every script you generate.</p>
                </div>

                <button
                  onClick={handleSave}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 8,
                    padding: "11px 22px", borderRadius: 10, border: "none",
                    background: saved ? "rgba(52,211,153,0.1)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
                    color: saved ? "#34d399" : "#04080F",
                    fontSize: 13, fontWeight: 700, cursor: "pointer",
                    outline: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
                    transition: "all 0.2s",
                  }}
                >
                  {saved ? <><CheckCircle2 size={14} /> Saved!</> : <><Sparkles size={14} /> Save Style Settings</>}
                </button>
              </div>
            </div>

            {/* Style Insights Card */}
            <div style={card}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "center", gap: 10 }}>
                <TrendingUp size={15} color="#00D4FF" />
                <p style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>Style Insights</p>
              </div>
              <div style={{ padding: "22px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                  {[
                    { icon: PenLine, label: "Avg. Script Length", value: "—", color: "#00D4FF" },
                    { icon: Mic, label: "Preferred Hook", value: "—", color: "#fb923c" },
                    { icon: BookOpen, label: "Top Pillar", value: "—", color: "#a78bfa" },
                  ].map((item) => (
                    <div key={item.label} style={{ textAlign: "center", padding: "16px 12px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <item.icon size={18} color={item.color} style={{ margin: "0 auto 10px", display: "block" }} />
                      <p style={{ fontSize: 18, fontWeight: 800, color: "#fff", margin: "0 0 4px" }}>{item.value}</p>
                      <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>{item.label}</p>
                    </div>
                  ))}
                </div>
                <p style={{ fontSize: 12, color: "#94a3b8", textAlign: "center", marginTop: 16 }}>Generate scripts to see your writing patterns.</p>
              </div>
            </div>
          </div>

          {/* ── Right: Channel Profiles ────────────────────────────────── */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0", margin: "0 0 2px" }}>Channel Profiles</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Switch between YouTube channels</p>
              </div>
              <button
                onClick={() => setShowAddChannel(true)}
                style={{
                  display: "flex", alignItems: "center", gap: 6,
                  padding: "7px 14px", borderRadius: 9,
                  border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)",
                  color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer",
                }}
              >
                <Plus size={13} /> Add
              </button>
            </div>

            {/* Add channel form */}
            {showAddChannel && (
              <div style={{ ...card, padding: "18px" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: "0 0 14px" }}>New Channel Profile</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {[
                    { label: "Channel Name", key: "name", placeholder: "e.g. Money Mindset" },
                    { label: "Niche", key: "niche", placeholder: "e.g. Personal Finance" },
                    { label: "YouTube Handle", key: "handle", placeholder: "@yourhandle" },
                    { label: "Competitor Channel URL", key: "competitor", placeholder: "youtube.com/@competitor" },
                  ].map(({ label, key, placeholder }) => (
                    <div key={key}>
                      <p style={{ fontSize: 11, color: "#94a3b8", marginBottom: 4 }}>{label}</p>
                      <input
                        value={newChannel[key as keyof typeof newChannel]}
                        onChange={(e) => setNewChannel({ ...newChannel, [key]: e.target.value })}
                        placeholder={placeholder}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                  <div style={{ display: "flex", gap: 8, paddingTop: 4 }}>
                    <button
                      onClick={addChannel}
                      style={{ flex: 1, padding: "9px", borderRadius: 9, border: "none", background: "linear-gradient(135deg, #00D4FF, #0080cc)", color: "#04080F", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setShowAddChannel(false)}
                      style={{ padding: "9px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#64748b", fontSize: 13, cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Empty state */}
            {channels.length === 0 && !showAddChannel && (
              <div style={{ ...card, padding: "40px 20px", textAlign: "center" }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Play size={20} color="#475569" />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", margin: "0 0 6px" }}>No channels yet</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: "0 0 16px", lineHeight: 1.5 }}>Add a channel profile to get personalized scripts.</p>
                <button
                  onClick={() => setShowAddChannel(true)}
                  style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.1)", background: "rgba(255,255,255,0.04)", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}
                >
                  <Plus size={13} /> Add Channel Profile
                </button>
              </div>
            )}

            {/* Channel list */}
            {channels.map((ch) => (
              <div key={ch.id} style={{ ...card, padding: "16px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 38, height: 38, borderRadius: "50%", background: "linear-gradient(135deg, #00D4FF, #0080cc)", display: "flex", alignItems: "center", justifyContent: "center", color: "#04080F", fontSize: 15, fontWeight: 800, flexShrink: 0 }}>
                    {ch.name.charAt(0).toUpperCase()}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: "0 0 2px" }}>{ch.name}</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{ch.niche}</p>
                    {ch.handle && <p style={{ fontSize: 11, color: "#00D4FF", margin: "2px 0 0" }}>{ch.handle}</p>}
                  </div>
                  <button
                    onClick={() => setChannels((p: ChannelProfile[]) => p.filter((c) => c.id !== ch.id))}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4 }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#f87171"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#475569"}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                {ch.competitors.length > 0 && (
                  <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                    <p style={{ fontSize: 10, color: "#64748b", marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.1em" }}>Competitors</p>
                    {ch.competitors.map((c, i) => (
                      <div key={i} style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Globe size={11} color="#475569" />
                        <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{c}</p>
                        <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 99, background: "rgba(52,211,153,0.1)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>Analyzed</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Tip card */}
            <div style={{ ...card, padding: "14px 16px" }}>
              <div style={{ display: "flex", gap: 10 }}>
                <Lightbulb size={14} color="#facc15" style={{ flexShrink: 0, marginTop: 2 }} />
                <p style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, margin: 0 }}>
                  Add 3+ competitor channels to enable <span style={{ color: "#00D4FF", fontWeight: 600 }}>Writing DNA</span> analysis — we&apos;ll reverse-engineer what makes their scripts work.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
