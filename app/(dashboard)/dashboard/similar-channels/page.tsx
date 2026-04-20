"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Users, Search, TrendingUp, TrendingDown, Minus,
  DollarSign, Eye, Clock, AlertCircle, BookmarkPlus,
  Zap, Copy, Check, RefreshCw, ExternalLink,
} from "lucide-react";
import { useLocalStorage } from "@/lib/use-local-storage";

interface Channel {
  name: string;
  handle: string;
  niche: string;
  subscribers: string;
  avgViews: string;
  uploadFreq: string;
  contentStyle: string;
  whyRelevant: string;
  monetisationHints: string;
  growthTrend: "up" | "stable" | "down";
  rpmEst: string;
  strengths: string[];
  gapOpportunity: string;
  collab: string;
}

interface SavedChannel {
  name: string;
  handle: string;
  niche: string;
  savedAt: string;
}

const TREND_CONFIG = {
  up:     { icon: TrendingUp,   color: "#34d399", label: "Growing" },
  stable: { icon: Minus,        color: "#facc15", label: "Stable" },
  down:   { icon: TrendingDown, color: "#f87171", label: "Declining" },
};

const S = {
  card: {
    borderRadius: 16, overflow: "hidden" as const,
    background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: 14,
  },
  input: {
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 13,
    outline: "none",
  },
  label: {
    fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em",
    textTransform: "uppercase" as const, display: "block", marginBottom: 7,
  },
};

export default function SimilarChannelsPage() {
  const [channelName, setChannelName] = useState("");
  const [niche, setNiche] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(0);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const [savedChannels, setSavedChannels] = useLocalStorage<SavedChannel[]>("th_saved_channels", []);

  const STEPS = [
    "Scanning YouTube database…",
    "Identifying similar channels…",
    "Analysing growth patterns…",
    "Calculating competition gaps…",
    "Building your report…",
  ];

  const handleSearch = async () => {
    if (!channelName.trim()) return;
    setLoading(true); setError(null); setChannels([]); setStep(0); setExpanded(null);
    const interval = setInterval(() => setStep(s => Math.min(s + 1, STEPS.length - 1)), 2000);
    try {
      const res = await fetch("/api/similar-channels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ channelName: channelName.trim(), niche: niche.trim(), description: description.trim() }),
      });
      clearInterval(interval);
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(err.error || "Search failed");
      }
      const json = await res.json();
      const found: Channel[] = json.data?.channels || [];
      if (!found.length) throw new Error("No results returned. Try a more specific channel name.");
      setChannels(found);
    } catch (err: unknown) {
      clearInterval(interval);
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const saveChannel = (ch: Channel) => {
    const already = savedChannels.some(s => s.handle === ch.handle);
    if (already) return;
    setSavedChannels(prev => [{
      name: ch.name, handle: ch.handle, niche: ch.niche,
      savedAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    }, ...prev]);
  };

  const copyGap = (gap: string, id: string) => {
    navigator.clipboard.writeText(gap);
    setCopied(id);
    setTimeout(() => setCopied(null), 1800);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <style>{`@keyframes sc-spin { to { transform: rotate(360deg); } }`}</style>
      <Topbar title="Similar Channels" subtitle="Find and analyse YouTube channels in your niche" />

      <div style={{ padding: "24px 32px", maxWidth: 1100, margin: "0 auto" }}>

        {/* Search card */}
        <div style={{
          borderRadius: 16, padding: "22px 24px", marginBottom: 24,
          background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.99))",
          border: "1px solid rgba(0,212,255,0.1)",
        }}>
          <div className="sc-search-form" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 14, alignItems: "flex-end" }}>
            <div>
              <label style={S.label}>Channel name or topic</label>
              <input
                value={channelName}
                onChange={e => setChannelName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleSearch()}
                placeholder="e.g. Graham Stephan or 'finance'"
                style={S.input}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
              />
            </div>
            <div>
              <label style={S.label}>Niche <span style={{ fontWeight: 400, color: "#64748b" }}>(optional)</span></label>
              <input
                value={niche}
                onChange={e => setNiche(e.target.value)}
                placeholder="e.g. Personal Finance"
                style={S.input}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
              />
            </div>
            <div>
              <label style={S.label}>Extra context <span style={{ fontWeight: 400, color: "#64748b" }}>(optional)</span></label>
              <input
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="e.g. investing for beginners"
                style={S.input}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.35)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
              />
            </div>
            <button
              onClick={handleSearch}
              disabled={loading || !channelName.trim()}
              style={{
                display: "flex", alignItems: "center", gap: 7, padding: "11px 20px",
                borderRadius: 11, border: "none", whiteSpace: "nowrap" as const,
                background: loading || !channelName.trim()
                  ? "rgba(0,212,255,0.08)"
                  : "linear-gradient(135deg, #00D4FF, #0080cc)",
                color: loading || !channelName.trim() ? "#2A3F5F" : "#04080F",
                fontSize: 13, fontWeight: 800,
                cursor: loading || !channelName.trim() ? "not-allowed" : "pointer",
                height: 44,
              }}
            >
              {loading
                ? <><div style={{ width: 13, height: 13, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#04080F", borderRadius: "50%", animation: "sc-spin 0.8s linear infinite" }} />Searching</>
                : <><Search size={14} /> Find Similar</>
              }
            </button>
          </div>

          {loading && (
            <div style={{ marginTop: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{ fontSize: 12, color: "#00D4FF", fontWeight: 600 }}>{STEPS[step]}</span>
              </div>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(0,212,255,0.08)", overflow: "hidden" }}>
                <div style={{ height: "100%", borderRadius: 99, background: "linear-gradient(90deg, #00D4FF, #0080cc)", width: `${((step + 1) / STEPS.length) * 100}%`, transition: "width 1.8s ease-out" }} />
              </div>
            </div>
          )}
        </div>

        {error && (
          <div style={{ display: "flex", gap: 12, padding: "14px 18px", borderRadius: 12, background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.18)", marginBottom: 20 }}>
            <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#f87171", margin: "0 0 2px" }}>Search Failed</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{error}</p>
            </div>
          </div>
        )}

        {channels.length > 0 && (
          <>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
                Found <strong style={{ color: "#e2e8f0" }}>{channels.length} similar channels</strong> to &quot;{channelName}&quot;
              </p>
              <button
                onClick={handleSearch}
                style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "transparent", color: "#64748b", fontSize: 12, cursor: "pointer" }}
              >
                <RefreshCw size={12} /> Refresh
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {channels.map((ch, i) => {
                const tc = TREND_CONFIG[ch.growthTrend] || TREND_CONFIG.stable;
                const TIcon = tc.icon;
                const isSaved = savedChannels.some(s => s.handle === ch.handle);
                const isOpen = expanded === ch.handle;

                return (
                  <div key={ch.handle} style={S.card}>
                    {/* Main row */}
                    <div
                      className="sc-card-row" style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 20px", cursor: "pointer" }}
                      onClick={() => setExpanded(isOpen ? null : ch.handle)}
                    >
                      {/* Rank */}
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ fontSize: 11, fontWeight: 800, color: "#475569" }}>{i + 1}</span>
                      </div>

                      {/* Avatar */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 12, flexShrink: 0,
                        background: `hsl(${(i * 67) % 360}, 55%, 28%)`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 16, fontWeight: 800, color: "#fff",
                      }}>
                        {ch.name.charAt(0).toUpperCase()}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#fff", margin: 0 }}>{ch.name}</p>
                          <span style={{ fontSize: 11, color: "#475569" }}>{ch.handle}</span>
                          <span style={{ fontSize: 10, fontWeight: 600, padding: "2px 8px", borderRadius: 99, background: "rgba(0,212,255,0.08)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.18)" }}>{ch.niche}</span>
                        </div>
                        <p style={{ fontSize: 12, color: "#64748b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ch.whyRelevant}</p>
                      </div>

                      {/* Stats */}
                      <div className="sc-stats" style={{ display: "flex", gap: 20, flexShrink: 0, alignItems: "center" }}>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: 0 }}>{ch.subscribers}</p>
                          <p style={{ fontSize: 10, color: "#475569", margin: 0 }}>Subscribers</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", margin: 0 }}>{ch.avgViews}</p>
                          <p style={{ fontSize: 10, color: "#475569", margin: 0 }}>Avg Views</p>
                        </div>
                        <div style={{ textAlign: "center" }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#34d399", margin: 0 }}>{ch.rpmEst}</p>
                          <p style={{ fontSize: 10, color: "#475569", margin: 0 }}>Est. RPM</p>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 10px", borderRadius: 99, background: `${tc.color}14`, border: `1px solid ${tc.color}30` }}>
                          <TIcon size={11} color={tc.color} />
                          <span style={{ fontSize: 10, fontWeight: 700, color: tc.color }}>{tc.label}</span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="sc-actions" style={{ display: "flex", gap: 6, flexShrink: 0 }} onClick={e => e.stopPropagation()}>
                        <button
                          onClick={() => saveChannel(ch)}
                          style={{
                            display: "flex", alignItems: "center", gap: 5, padding: "6px 12px",
                            borderRadius: 8, fontSize: 11, fontWeight: 600,
                            background: isSaved ? "rgba(52,211,153,0.1)" : "rgba(255,255,255,0.03)",
                            border: isSaved ? "1px solid rgba(52,211,153,0.25)" : "1px solid rgba(255,255,255,0.08)",
                            color: isSaved ? "#34d399" : "#64748b", cursor: isSaved ? "default" : "pointer",
                          }}
                        >
                          <BookmarkPlus size={11} />
                          {isSaved ? "Saved" : "Save"}
                        </button>
                      </div>
                    </div>

                    {/* Expanded detail */}
                    {isOpen && (
                      <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", padding: "18px 20px" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 14, marginBottom: 16 }}>
                          {/* Stats */}
                          <div style={{ borderRadius: 12, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Channel Stats</p>
                            {[
                              { icon: Users, color: "#94a3b8", label: "Subscribers", value: ch.subscribers },
                              { icon: Eye, color: "#94a3b8", label: "Avg Views", value: ch.avgViews },
                              { icon: Clock, color: "#94a3b8", label: "Upload Freq", value: ch.uploadFreq },
                              { icon: DollarSign, color: "#34d399", label: "Est. RPM", value: ch.rpmEst },
                            ].map(({ icon: Icon, color, label, value }) => (
                              <div key={label} style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                  <Icon size={11} color={color} />
                                  <span style={{ fontSize: 11, color: "#64748b" }}>{label}</span>
                                </div>
                                <span style={{ fontSize: 11, fontWeight: 700, color: "#e2e8f0" }}>{value}</span>
                              </div>
                            ))}
                          </div>

                          {/* Strengths */}
                          <div style={{ borderRadius: 12, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Strengths</p>
                            {ch.strengths?.map((s, si) => (
                              <div key={si} style={{ display: "flex", gap: 7, marginBottom: 7 }}>
                                <Zap size={10} color="#00D4FF" style={{ flexShrink: 0, marginTop: 2 }} />
                                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{s}</p>
                              </div>
                            ))}
                            <div style={{ marginTop: 10, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                              <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Content Style</p>
                              <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{ch.contentStyle}</p>
                            </div>
                          </div>

                          {/* Monetisation + Collab */}
                          <div style={{ borderRadius: 12, padding: "14px 16px", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}>
                            <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Monetisation</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: "0 0 14px", lineHeight: 1.5 }}>{ch.monetisationHints}</p>
                            <p style={{ fontSize: 10, fontWeight: 700, color: "#475569", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Collab Angle</p>
                            <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{ch.collab}</p>
                          </div>
                        </div>

                        {/* Gap opportunity */}
                        <div style={{ padding: "14px 18px", borderRadius: 12, background: "rgba(0,212,255,0.05)", border: "1px solid rgba(0,212,255,0.14)" }}>
                          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                              <p style={{ fontSize: 11, fontWeight: 800, color: "#00D4FF", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 6px" }}>Gap Opportunity — what they&apos;re missing</p>
                              <p style={{ fontSize: 12, color: "#e2e8f0", margin: 0, lineHeight: 1.6 }}>{ch.gapOpportunity}</p>
                            </div>
                            <button
                              onClick={() => copyGap(ch.gapOpportunity, ch.handle)}
                              style={{ padding: "6px 10px", borderRadius: 8, background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", color: "#00D4FF", fontSize: 11, cursor: "pointer", display: "flex", alignItems: "center", gap: 5, flexShrink: 0 }}
                            >
                              {copied === ch.handle ? <Check size={11} /> : <Copy size={11} />}
                              {copied === ch.handle ? "Copied" : "Copy"}
                            </button>
                          </div>
                        </div>

                        <div style={{ marginTop: 12, display: "flex", justifyContent: "flex-end" }}>
                          <a
                            href={`https://youtube.com/${ch.handle}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#475569", textDecoration: "none" }}
                          >
                            <ExternalLink size={11} /> View on YouTube
                          </a>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </>
        )}

        {!loading && channels.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "80px 20px" }}>
            <div style={{ width: 60, height: 60, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
              <Users size={26} color="#475569" />
            </div>
            <p style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>Find channels similar to yours</p>
            <p style={{ fontSize: 13, color: "#475569", margin: 0, lineHeight: 1.6 }}>Enter any channel name or topic above. We&apos;ll find 6 similar channels with detailed gap analysis so you know exactly where to compete.</p>
          </div>
        )}
      </div>
    </div>
  );
}
