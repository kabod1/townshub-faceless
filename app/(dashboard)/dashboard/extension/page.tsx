"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Monitor, BarChart3, Tag, TrendingUp, Eye, Zap, Download,
  Star, CheckCircle2, Shield, Clock, Bell,
} from "lucide-react";

const FEATURES = [
  {
    icon: BarChart3, color: "#00D4FF",
    title: "Outlier Score™",
    desc: "See a performance score on every YouTube video comparing it to the channel average. Instantly spot which videos are outliers — viral content worth studying.",
    plan: "starter",
  },
  {
    icon: Tag, color: "#fb923c",
    title: "Tag Extraction",
    desc: "View the hidden tags and keywords any video is optimised for. Copy competitor tags directly into your niche research workflow in one click.",
    plan: "starter",
  },
  {
    icon: Eye, color: "#a78bfa",
    title: "Thumbnail Inspector",
    desc: "Hover any thumbnail to see full-size preview, contrast score, and text readability rating. Understand what makes high-CTR thumbnails at a glance.",
    plan: "starter",
  },
  {
    icon: TrendingUp, color: "#34d399",
    title: "Analytics Overlay",
    desc: "See estimated views-per-hour, engagement rates, and upload velocity overlaid directly on YouTube search results and channel pages.",
    plan: "pro",
  },
  {
    icon: Shield, color: "#f87171",
    title: "Competition Guard",
    desc: "Get a real-time competition assessment when browsing any search results page. Know before you script whether the space is too crowded.",
    plan: "pro",
  },
  {
    icon: Zap, color: "#facc15",
    title: "One-Click Import",
    desc: "Found a video worth studying? Click the Townshub button to import its title, tags, and description straight into your Research Notes in New Script.",
    plan: "elite",
  },
];

const DEFAULT_VIDEOS = [
  { title: "How I Saved $50K on a $45K Salary (Full System)", channel: "Finance Unlocked", views: "892K views", score: 94, color: "#34d399", vph: "4.2k/hr" },
  { title: "5 Money Habits That Changed My Life", channel: "Wealth Daily", views: "234K views", score: 61, color: "#facc15", vph: "1.1k/hr" },
  { title: "The Truth About Index Funds Nobody Tells You", channel: "InvestSmart", views: "1.4M views", score: 88, color: "#34d399", vph: "6.8k/hr" },
];

function generateMockVideos(query: string) {
  const q = query.trim() || "personal finance";
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  const scores = [91, 57, 83, 74, 95, 62];
  const vphs = ["3.1k/hr", "890/hr", "5.4k/hr"];
  const views = ["1.2M views", "187K views", "654K views"];
  const channels = ["TopChannel", "GrowthStudio", "TrendMakers"];
  return [
    { title: `Why ${cap(q)} Is Changing Everything in 2026`, channel: channels[0], views: views[0], score: scores[0], color: "#34d399", vph: vphs[0] },
    { title: `The Beginner's Guide to ${cap(q)} (Step by Step)`, channel: channels[1], views: views[1], score: scores[1], color: "#facc15", vph: vphs[1] },
    { title: `${cap(q)}: What Nobody Tells You`, channel: channels[2], views: views[2], score: scores[2], color: "#34d399", vph: vphs[2] },
  ];
}


const REVIEWS = [
  { name: "Jamie O.", stars: 5, text: "The outlier score alone is worth it. I can now see in 2 seconds which videos I should study vs ignore." },
  { name: "Priya M.", stars: 5, text: "Tag extraction is insane. I spent hours doing this manually before." },
  { name: "Carl T.", stars: 4, text: "Clean overlay, doesn't slow down YouTube at all. The import to research notes is brilliant." },
];


export default function ExtensionPage() {
  const [notified, setNotified] = useState(false);
  const [importedIdx, setImportedIdx] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("personal+finance");
  const [searchInput, setSearchInput] = useState("personal+finance");
  const [videos, setVideos] = useState(DEFAULT_VIDEOS);

  function doSearch(raw: string) {
    const q = raw.trim();
    if (!q) return;
    setSearchQuery(q);
    setVideos(generateMockVideos(q.replace(/\+/g, " ")));
    setImportedIdx(null);
  }

  function handleSearch(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") doSearch(searchInput);
  }

  function handleNotify() {
    setNotified(true);
  }

  function handleImport(idx: number) {
    const video = videos[idx];
    setImportedIdx(idx);
    setTimeout(() => {
      setImportedIdx(null);
      window.location.href = `/dashboard/new-script?idea=${encodeURIComponent(video.title)}`;
    }, 600);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Monitor Extension" subtitle="Supercharge YouTube with analytics and competitor intelligence" />

      <div style={{ padding: "24px 32px", maxWidth: 1000, margin: "0 auto" }}>

        {/* Hero */}
        <div style={{
          borderRadius: 20, padding: "36px 40px", marginBottom: 28,
          background: "linear-gradient(135deg, rgba(0,212,255,0.08), rgba(0,128,204,0.04), rgba(8,13,26,0.95))",
          border: "1px solid rgba(0,212,255,0.15)",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", top: -80, right: -80, width: 280, height: 280, borderRadius: "50%", background: "radial-gradient(circle, rgba(0,212,255,0.08), transparent)", pointerEvents: "none" }} />

          <div style={{ display: "flex", alignItems: "center", gap: 20, marginBottom: 22 }}>
            <div style={{
              width: 64, height: 64, borderRadius: 18, flexShrink: 0,
              background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,128,204,0.1))",
              border: "1px solid rgba(0,212,255,0.25)",
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              <Monitor size={32} color="#00D4FF" />
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 900, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.5px" }}>Townshub Monitor Extension</h1>
              <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>YouTube intelligence layer — analytics, tags, outlier scores, and one-click import</p>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, background: "rgba(251,146,60,0.12)", border: "1px solid rgba(251,146,60,0.25)" }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: "#fb923c" }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#fb923c" }}>Coming Soon</span>
            </div>
          </div>

          <div style={{ display: "flex", gap: 12, marginBottom: 28 }}>
            {[
              { icon: Star, val: "4.9/5", sub: "Rating" },
              { icon: Download, val: "2,400+", sub: "Installs" },
              { icon: Monitor, val: "Chrome", sub: "Supported" },
              { icon: Clock, val: "Free", sub: "For Starter" },
            ].map(({ icon: Icon, val, sub }) => (
              <div key={sub} style={{ padding: "12px 16px", borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", textAlign: "center", flex: 1 }}>
                <Icon size={14} color="#475569" style={{ marginBottom: 5 }} />
                <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: "0 0 2px" }}>{val}</p>
                <p style={{ fontSize: 10, color: "#475569", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>{sub}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {/* Download button */}
            <a
              href="/townshub-extension.zip"
              download="townshub-extension.zip"
              style={{
                display: "flex", alignItems: "center", gap: 8, padding: "13px 26px",
                borderRadius: 12, textDecoration: "none",
                background: "linear-gradient(135deg, #00D4FF, #0080cc)",
                color: "#04080F", fontSize: 13, fontWeight: 800,
              }}
            >
              <Download size={15} /> Download Extension
            </a>

            {notified ? (
              <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "13px 26px",
                borderRadius: 12, background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.25)",
                color: "#34d399", fontSize: 13, fontWeight: 800,
              }}>
                <CheckCircle2 size={15} /> You&apos;re on the list — we&apos;ll notify you on launch
              </div>
            ) : (
              <button
                onClick={handleNotify}
                style={{
                  display: "flex", alignItems: "center", gap: 8, padding: "13px 26px",
                  borderRadius: 12, border: "1px solid rgba(0,212,255,0.3)",
                  background: "linear-gradient(135deg, rgba(0,212,255,0.15), rgba(0,128,204,0.08))",
                  color: "#7dd3fc", fontSize: 13, fontWeight: 800, cursor: "pointer",
                }}
              >
                <Bell size={15} /> Notify Me at Launch
              </button>
            )}
          </div>

          {/* Install instructions */}
          <div style={{
            marginTop: 18, padding: "14px 18px", borderRadius: 12,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.1em" }}>How to install</p>
            {[
              "Click Download Extension above to get the ZIP file",
              'Right-click the ZIP → "Extract All" (Windows) or double-click (Mac) — you\'ll get a townshub-extension folder',
              'Open Chrome and go to chrome://extensions — toggle on "Developer mode" (top right)',
              'Click "Load unpacked" → select the townshub-extension folder you just extracted',
              "Go to YouTube — you'll see Outlier Score, VPH, and tag badges on every video thumbnail",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 7 }}>
                <span style={{ width: 18, height: 18, borderRadius: "50%", background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#00D4FF", flexShrink: 0 }}>{i + 1}</span>
                <span style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Feature grid */}
        <div style={{ marginBottom: 28 }}>
          <p style={{ fontSize: 11, fontWeight: 800, color: "#2A3F5F", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 16 }}>What you get</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 14 }}>
            {FEATURES.map(({ icon: Icon, color, title, desc }) => (
              <div key={title} style={{
                padding: "20px 20px", borderRadius: 14,
                background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                border: "1px solid rgba(255,255,255,0.06)",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = `${color}30`}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.06)"}
              >
                <div style={{ width: 38, height: 38, borderRadius: 10, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 13 }}>
                  <Icon size={16} color={color} />
                </div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: "0 0 7px" }}>{title}</p>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Browser mockup */}
        <div style={{
          borderRadius: 16, overflow: "hidden", marginBottom: 28,
          border: "1px solid rgba(255,255,255,0.08)",
          background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
        }}>
          <div style={{ padding: "12px 16px", borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(255,255,255,0.02)", display: "flex", alignItems: "center", gap: 8 }}>
            {["#f87171", "#facc15", "#34d399"].map(c => <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />)}
            <div style={{ flex: 1, height: 30, borderRadius: 6, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", paddingLeft: 10, gap: 4 }}>
              <span style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap" }}>youtube.com/results?search_query=</span>
              <input
                value={searchInput}
                onChange={e => setSearchInput(e.target.value)}
                onKeyDown={handleSearch}
                style={{ fontSize: 11, color: "#e2e8f0", background: "transparent", border: "none", outline: "none", flex: 1, minWidth: 60 }}
                placeholder="personal+finance"
              />
              <button
                onClick={() => doSearch(searchInput)}
                style={{ padding: "3px 10px", borderRadius: 5, background: "rgba(0,212,255,0.15)", border: "1px solid rgba(0,212,255,0.3)", color: "#00D4FF", fontSize: 10, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap", marginRight: 4 }}
              >
                Search
              </button>
            </div>
            <Monitor size={16} color="#00D4FF" />
          </div>

          <div style={{ padding: "20px 24px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", margin: "0 0 14px", textTransform: "uppercase", letterSpacing: "0.1em" }}>YouTube search results + Townshub overlay</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {videos.map((v, idx) => (
                <div key={v.title} style={{ display: "flex", gap: 12, padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ width: 120, height: 68, borderRadius: 7, background: "rgba(255,255,255,0.06)", flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 600, color: "#e2e8f0", margin: "0 0 3px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 7px" }}>{v.channel} · {v.views}</p>
                    <div style={{ display: "flex", gap: 7, alignItems: "center" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5, background: `${v.color}18`, border: `1px solid ${v.color}35` }}>
                        <Zap size={9} color={v.color} />
                        <span style={{ fontSize: 10, fontWeight: 800, color: v.color }}>Score {v.score}</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5, background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)" }}>
                        <Tag size={9} color="#fb923c" />
                        <span style={{ fontSize: 10, fontWeight: 700, color: "#fb923c" }}>14 tags</span>
                      </div>
                      {(
                        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5, background: "rgba(52,211,153,0.08)", border: "1px solid rgba(52,211,153,0.2)" }}>
                          <TrendingUp size={9} color="#34d399" />
                          <span style={{ fontSize: 10, fontWeight: 700, color: "#34d399" }}>{v.vph}</span>
                        </div>
                      )}
                      <button
                        onClick={() => handleImport(idx)}
                        title="Import to New Script"
                        style={{
                          display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 5,
                          background: importedIdx === idx ? "rgba(52,211,153,0.15)" : "rgba(0,212,255,0.08)",
                          border: importedIdx === idx ? "1px solid rgba(52,211,153,0.3)" : "1px solid rgba(0,212,255,0.18)",
                          cursor: "pointer",
                          opacity: 1,
                        }}
                      >
                        {importedIdx === idx
                          ? <><CheckCircle2 size={9} color="#34d399" /><span style={{ fontSize: 10, fontWeight: 700, color: "#34d399" }}>Imported</span></>
                          : <><Download size={9} color="#00D4FF" /><span style={{ fontSize: 10, fontWeight: 700, color: "#00D4FF" }}>Import</span></>
                        }
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
          {/* Plan comparison */}
          <div style={{
            borderRadius: 14, overflow: "hidden",
            background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Plan Access</span>
            </div>
            <div style={{ padding: "14px 18px" }}>
              {[
                { label: "Starter", features: ["Outlier scores", "Tag extraction", "Thumbnail inspector"], color: "#00D4FF" },
                { label: "Pro",     features: ["Everything in Starter", "Analytics overlay", "Competition guard"], color: "#00D4FF" },
                { label: "Elite AI", features: ["Everything in Pro", "One-click research import", "Priority data refresh"], color: "#facc15" },
              ].map(({ label, features, color }) => (
                <div key={label} style={{ marginBottom: 16, paddingBottom: 16, borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color, display: "block", marginBottom: 8 }}>{label}</span>
                  {features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 8, marginBottom: 5 }}>
                      <CheckCircle2 size={12} color="#34d399" style={{ flexShrink: 0, marginTop: 1 }} />
                      <span style={{ fontSize: 12, color: "#94a3b8" }}>{f}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div style={{
            borderRadius: 14, overflow: "hidden",
            background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Early User Reviews</span>
            </div>
            <div style={{ padding: "14px 18px", display: "flex", flexDirection: "column", gap: 14 }}>
              {REVIEWS.map(r => (
                <div key={r.name} style={{ padding: "12px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                    <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>{r.name}</span>
                    <div style={{ display: "flex", gap: 2 }}>
                      {Array.from({ length: r.stars }).map((_, i) => <Star key={i} size={11} color="#facc15" fill="#facc15" />)}
                    </div>
                  </div>
                  <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.55 }}>&quot;{r.text}&quot;</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
