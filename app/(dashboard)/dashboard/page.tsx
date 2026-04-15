"use client";

import Link from "next/link";
import {
  PenLine, Kanban, ScrollText, Image, Compass, Zap,
  ArrowRight, Star, Clock, CheckCircle2,
  Lightbulb, BarChart2, ChevronRight, Flame, Sparkles, TrendingUp
} from "lucide-react";

const stats = [
  { label: "Scripts Remaining", value: "4", trend: "+0 this week", icon: PenLine, glow: "rgba(0,212,255,0.25)", color: "#00D4FF", bg: "rgba(0,212,255,0.08)" },
  { label: "Video Ideas", value: "∞", trend: "AI-generated daily", icon: Lightbulb, glow: "rgba(250,204,21,0.25)", color: "#facc15", bg: "rgba(250,204,21,0.08)" },
  { label: "Active Tasks", value: "0", trend: "Production board", icon: Kanban, glow: "rgba(167,139,250,0.25)", color: "#a78bfa", bg: "rgba(167,139,250,0.08)" },
  { label: "Avg Outlier Score", value: "—", trend: "Connect a channel", icon: BarChart2, glow: "rgba(52,211,153,0.25)", color: "#34d399", bg: "rgba(52,211,153,0.08)" },
];

const tools = [
  { label: "Write Script", desc: "AI-powered, research-backed scripts", href: "/dashboard/new-script", icon: PenLine, color: "#00D4FF", glow: "rgba(0,212,255,0.15)" },
  { label: "Video Ideas", desc: "Viral concepts generated for your niche", href: "/dashboard/ideas", icon: Zap, color: "#facc15", glow: "rgba(250,204,21,0.15)" },
  { label: "Niche Finder", desc: "Discover high-performing niches", href: "/dashboard/niche-finder", icon: Compass, color: "#34d399", glow: "rgba(52,211,153,0.15)" },
  { label: "Production Board", desc: "Manage your full video pipeline", href: "/dashboard/production", icon: Kanban, color: "#a78bfa", glow: "rgba(167,139,250,0.15)" },
  { label: "My Scripts", desc: "View and manage saved scripts", href: "/dashboard/scripts", icon: ScrollText, color: "#fb923c", glow: "rgba(251,146,60,0.15)" },
  { label: "Thumbnails", desc: "Design with AI assistance", href: "/dashboard/thumbnails", icon: Image, color: "#f472b6", glow: "rgba(244,114,182,0.15)" },
];

const updates = [
  { title: "Thumbnail Studio V3", desc: "Flux.1 image generation + intuitive canvas editor.", time: "3w ago", icon: Sparkles, color: "#00D4FF" },
  { title: "Chrome Extension Live", desc: "Outlier scores & analytics directly on YouTube.", time: "3w ago", icon: Flame, color: "#34d399" },
  { title: "YouTube SEO Tool", desc: "Instant SEO scores, search volume & competition data.", time: "3w ago", icon: TrendingUp, color: "#a78bfa" },
];

const checklist = [
  { label: "Complete your style profile", href: "/dashboard/style" },
  { label: "Add a channel profile", href: "/dashboard/style" },
  { label: "Generate your first video idea", href: "/dashboard/ideas" },
  { label: "Write your first script", href: "/dashboard/new-script" },
];

export default function DashboardPage() {
  return (
    <div style={{ minHeight: "100vh", background: "#080D1A", color: "#E8F4FF" }}>

      {/* ── Header ── */}
      <div style={{
        padding: "28px 32px 0",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        paddingBottom: "20px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#34d399", display: "inline-block", boxShadow: "0 0 8px #34d399" }} />
            <span style={{ fontSize: 11, color: "#475569", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>Workspace</span>
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: "-0.3px", margin: 0 }}>
            Dashboard
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link href="/dashboard/ideas" style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 18px", borderRadius: 10,
            border: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(255,255,255,0.03)",
            color: "#94a3b8", fontSize: 13, fontWeight: 600, textDecoration: "none",
            transition: "all 0.2s",
          }}>
            <Zap size={14} color="#facc15" />
            Get Ideas
          </Link>
          <Link href="/dashboard/new-script" style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "9px 18px", borderRadius: 10,
            background: "linear-gradient(135deg, #00D4FF, #0080cc)",
            color: "#04080F", fontSize: 13, fontWeight: 700, textDecoration: "none",
            boxShadow: "0 0 20px rgba(0,212,255,0.3)",
          }}>
            <PenLine size={14} />
            Write Script
          </Link>
        </div>
      </div>

      <div style={{ padding: "28px 32px", maxWidth: 1280, margin: "0 auto" }}>

        {/* ── Setup banner ── */}
        <div style={{
          display: "flex", alignItems: "center", gap: 16,
          padding: "14px 20px", borderRadius: 14,
          background: "linear-gradient(135deg, rgba(251,146,60,0.08), rgba(251,146,60,0.04))",
          border: "1px solid rgba(251,146,60,0.18)",
          marginBottom: 28,
        }}>
          <div style={{ fontSize: 20 }}>🚀</div>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#fdba74", margin: 0 }}>Finish setting up your workspace</p>
            <p style={{ fontSize: 12, color: "#475569", margin: "2px 0 0" }}>Add competitor channels so Townshub can match your writing style.</p>
          </div>
          <Link href="/dashboard/style" style={{
            padding: "8px 16px", borderRadius: 8,
            background: "rgba(251,146,60,0.15)", border: "1px solid rgba(251,146,60,0.25)",
            color: "#fdba74", fontSize: 12, fontWeight: 700, textDecoration: "none",
            whiteSpace: "nowrap",
          }}>
            Set Up Style →
          </Link>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 }}>
          {stats.map((s) => (
            <div key={s.label} style={{
              padding: "20px", borderRadius: 16,
              background: "linear-gradient(135deg, rgba(20,30,50,0.9), rgba(10,16,32,0.95))",
              border: "1px solid rgba(255,255,255,0.06)",
              position: "relative", overflow: "hidden",
              transition: "border-color 0.2s, transform 0.2s",
            }}>
              <div style={{
                position: "absolute", top: -20, right: -20,
                width: 80, height: 80, borderRadius: "50%",
                background: s.glow, filter: "blur(24px)",
                pointerEvents: "none",
              }} />
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                <p style={{ fontSize: 11, color: "#475569", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", margin: 0 }}>{s.label}</p>
                <div style={{ width: 32, height: 32, borderRadius: 9, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <s.icon size={15} color={s.color} />
                </div>
              </div>
              <p style={{ fontSize: 32, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-1px" }}>{s.value}</p>
              <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>{s.trend}</p>
            </div>
          ))}
        </div>

        {/* ── Main Grid ── */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            {/* Tools grid */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>AI Tools</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {tools.map((t) => (
                  <Link key={t.label} href={t.href} style={{ textDecoration: "none" }}>
                    <div style={{
                      padding: "20px", borderRadius: 14,
                      background: "linear-gradient(135deg, rgba(20,30,50,0.95), rgba(10,16,32,0.98))",
                      border: "1px solid rgba(255,255,255,0.06)",
                      cursor: "pointer", transition: "all 0.2s",
                      position: "relative", overflow: "hidden",
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = t.color + "44";
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)";
                        (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                      }}
                    >
                      <div style={{
                        position: "absolute", bottom: -16, right: -16,
                        width: 60, height: 60, borderRadius: "50%",
                        background: t.glow, filter: "blur(20px)",
                        pointerEvents: "none",
                      }} />
                      <div style={{
                        width: 36, height: 36, borderRadius: 10,
                        background: t.glow, border: `1px solid ${t.color}30`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginBottom: 14,
                      }}>
                        <t.icon size={17} color={t.color} />
                      </div>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: "0 0 5px", letterSpacing: "-0.1px" }}>{t.label}</p>
                      <p style={{ fontSize: 11, color: "#334155", margin: 0, lineHeight: 1.45 }}>{t.desc}</p>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, marginTop: 14 }}>
                        <span style={{ fontSize: 11, color: t.color, fontWeight: 600 }}>Open</span>
                        <ChevronRight size={11} color={t.color} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Setup checklist */}
            <div style={{
              borderRadius: 16,
              background: "linear-gradient(135deg, rgba(20,30,50,0.95), rgba(10,16,32,0.98))",
              border: "1px solid rgba(255,255,255,0.06)",
              overflow: "hidden",
            }}>
              <div style={{ padding: "18px 22px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: "0 0 2px" }}>Getting Started</p>
                <p style={{ fontSize: 11, color: "#334155", margin: 0 }}>Complete these steps to unlock your full potential.</p>
              </div>
              <div style={{ padding: "8px 12px" }}>
                {checklist.map((item, i) => (
                  <Link key={i} href={item.href} style={{ textDecoration: "none" }}>
                    <div style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "12px 10px", borderRadius: 10,
                      transition: "background 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.03)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                    >
                      <div style={{
                        width: 20, height: 20, borderRadius: "50%",
                        border: "1.5px solid rgba(255,255,255,0.12)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        flexShrink: 0,
                      }} />
                      <span style={{ fontSize: 13, color: "#94a3b8", flex: 1 }}>{item.label}</span>
                      <ArrowRight size={13} color="#1e293b" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Upgrade card */}
            <div style={{
              borderRadius: 16, padding: "22px",
              background: "linear-gradient(135deg, rgba(250,204,21,0.07), rgba(251,146,60,0.05))",
              border: "1px solid rgba(250,204,21,0.15)",
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -30, right: -30,
                width: 100, height: 100, borderRadius: "50%",
                background: "rgba(250,204,21,0.12)", filter: "blur(30px)",
                pointerEvents: "none",
              }} />
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <Star size={15} color="#facc15" fill="#facc15" />
                <span style={{ fontSize: 13, fontWeight: 800, color: "#fde68a" }}>Unlock Pro</span>
              </div>
              <p style={{ fontSize: 12, color: "#475569", lineHeight: 1.5, marginBottom: 14 }}>
                15 scripts/month, Niche Finder database, Similar Channels, AI Thumbnail generation, and more.
              </p>
              <Link href="/dashboard/billing" style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "9px 18px", borderRadius: 9,
                background: "linear-gradient(135deg, #facc15, #f59e0b)",
                color: "#1a0a00", fontSize: 12, fontWeight: 800, textDecoration: "none",
                boxShadow: "0 0 20px rgba(250,204,21,0.25)",
              }}>
                Upgrade to Pro
                <ArrowRight size={12} />
              </Link>
            </div>

            {/* News & Updates */}
            <div>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#334155", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 14 }}>What's New</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {updates.map((u, i) => (
                  <div key={i} style={{
                    padding: "16px", borderRadius: 14,
                    background: "linear-gradient(135deg, rgba(20,30,50,0.95), rgba(10,16,32,0.98))",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                        background: u.color + "18", border: `1px solid ${u.color}28`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <u.icon size={13} color={u.color} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                          <p style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{u.title}</p>
                          <span style={{ fontSize: 10, color: "#1e293b", display: "flex", alignItems: "center", gap: 3, flexShrink: 0 }}>
                            <Clock size={9} />
                            {u.time}
                          </span>
                        </div>
                        <p style={{ fontSize: 11, color: "#334155", margin: 0, lineHeight: 1.45 }}>{u.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
