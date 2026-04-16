"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import { useLocalStorage } from "@/lib/use-local-storage";
import {
  Bookmark, Search, TrendingUp, X, Eye, BookmarkPlus,
  Lightbulb, ChevronRight, Star, FlaskConical,
} from "lucide-react";

interface SavedChannel {
  id: string;
  name: string;
  handle: string;
  subscribers: string;
  monthlyViews: string;
  estEarnings: string;
  status: "Unknown" | "Monetized" | "Not Monetized";
  savedAt: string;
}

interface NicheBend {
  id: string;
  name: string;
  description: string;
  tags: string[];
  thumbnailStyle: string;
  videoIdeas: string[];
  savedAt: string;
}

const inputStyle: React.CSSProperties = {
  background: "rgba(8,13,26,0.8)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 10,
  padding: "9px 12px",
  color: "#e2e8f0",
  fontSize: 13,
  outline: "none",
  boxSizing: "border-box",
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#94a3b8",
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  display: "block",
  marginBottom: 6,
};

const statusColors: Record<string, { bg: string; color: string; border: string }> = {
  Monetized:     { bg: "rgba(52,211,153,0.1)",  color: "#34d399", border: "rgba(52,211,153,0.2)"  },
  "Not Monetized": { bg: "rgba(248,113,113,0.1)", color: "#f87171", border: "rgba(248,113,113,0.2)" },
  Unknown:       { bg: "rgba(100,116,139,0.1)", color: "#94a3b8", border: "rgba(100,116,139,0.2)" },
};

function parseSubs(s: string): number {
  if (!s) return 0;
  const n = parseFloat(s.replace(/[^0-9.]/g, ""));
  if (s.includes("M")) return n * 1_000_000;
  if (s.includes("K")) return n * 1_000;
  return n;
}

export default function SavedChannelsPage() {
  const [channels, setChannels] = useLocalStorage<SavedChannel[]>("th_saved_channels", []);
  const [nicheBends, setNicheBends] = useLocalStorage<NicheBend[]>("th_niche_bends", []);
  const [tab, setTab] = useState<"channels" | "niches">("channels");

  // Filter state
  const [search, setSearch] = useState("");
  const [minSubs, setMinSubs] = useState("");
  const [maxSubs, setMaxSubs] = useState("");
  const [minViewers, setMinViewers] = useState("");
  const [monetized, setMonetized] = useState("All");
  const [sortBy, setSortBy] = useState("Recent");

  // Niche Bend add modal state
  const [showNicheModal, setShowNicheModal] = useState(false);
  const [nicheName, setNicheName] = useState("");
  const [nicheDesc, setNicheDesc] = useState("");
  const [nicheTags, setNicheTags] = useState("");
  const [nicheThumbnail, setNicheThumbnail] = useState("");
  const [nicheIdeas, setNicheIdeas] = useState("");

  const addNicheBend = () => {
    if (!nicheName.trim()) return;
    const bend: NicheBend = {
      id: Date.now().toString(),
      name: nicheName.trim(),
      description: nicheDesc.trim(),
      tags: nicheTags.split(",").map(t => t.trim()).filter(Boolean),
      thumbnailStyle: nicheThumbnail.trim(),
      videoIdeas: nicheIdeas.split("\n").map(t => t.trim()).filter(Boolean),
      savedAt: new Date().toISOString(),
    };
    setNicheBends(prev => [bend, ...prev]);
    setShowNicheModal(false);
    setNicheName(""); setNicheDesc(""); setNicheTags(""); setNicheThumbnail(""); setNicheIdeas("");
    setTab("niches");
  };

  const removeChannel = (id: string) => setChannels(prev => prev.filter(c => c.id !== id));
  const removeNiche = (id: string) => setNicheBends(prev => prev.filter(n => n.id !== id));

  // Filter + sort channels
  const filteredChannels = channels
    .filter(c => {
      if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !c.handle.toLowerCase().includes(search.toLowerCase())) return false;
      if (minSubs && parseSubs(c.subscribers) < parseSubs(minSubs)) return false;
      if (maxSubs && parseSubs(c.subscribers) > parseSubs(maxSubs)) return false;
      if (minViewers && parseSubs(c.monthlyViews) < parseSubs(minViewers)) return false;
      if (monetized !== "All" && c.status !== monetized) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "Subscribers") return parseSubs(b.subscribers) - parseSubs(a.subscribers);
      if (sortBy === "Views") return parseSubs(b.monthlyViews) - parseSubs(a.monthlyViews);
      if (sortBy === "Earnings") return parseSubs(b.estEarnings) - parseSubs(a.estEarnings);
      return new Date(b.savedAt).getTime() - new Date(a.savedAt).getTime();
    });

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Saved Channels" subtitle="Track and manage your research" />

      <div style={{ padding: "28px 32px", maxWidth: 1200, margin: "0 auto" }}>

        {/* Header Card */}
        <div style={{
          padding: "22px 26px",
          borderRadius: 18,
          marginBottom: 26,
          background: "linear-gradient(135deg, rgba(88,28,135,0.15), rgba(59,7,100,0.1))",
          border: "1px solid rgba(168,85,247,0.15)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 13, background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.22)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Bookmark size={20} color="#a855f7" />
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: 0 }}>Saved Channels</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: "3px 0 0" }}>Your research library for channels and niche bends</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
              {channels.length} Channels
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, padding: "4px 12px", borderRadius: 99, background: "rgba(168,85,247,0.1)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.2)" }}>
              {nicheBends.length} Niche Bends
            </span>
            <button onClick={() => setShowNicheModal(true)} style={{
              display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 10,
              background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.3)",
              color: "#a855f7", fontSize: 13, fontWeight: 700, cursor: "pointer",
            }}>
              <FlaskConical size={14} /> Niche Bend
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 6, marginBottom: 22 }}>
          {[
            { id: "channels" as const, label: `★ Channels (${channels.length})` },
            { id: "niches" as const, label: `🔬 Niche Bends (${nicheBends.length})` },
          ].map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "9px 18px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: tab === t.id ? "1px solid rgba(168,85,247,0.35)" : "1px solid rgba(255,255,255,0.08)",
              background: tab === t.id ? "rgba(168,85,247,0.1)" : "rgba(255,255,255,0.02)",
              color: tab === t.id ? "#a855f7" : "#64748b",
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>

        {/* ── CHANNELS TAB ── */}
        {tab === "channels" && (
          <>
            {/* Filter Bar */}
            <div style={{
              padding: "16px 20px", borderRadius: 14, marginBottom: 18,
              background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
              border: "1px solid rgba(255,255,255,0.06)",
              display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap",
            }}>
              <div style={{ position: "relative", flex: "1 1 180px", minWidth: 140 }}>
                <Search size={13} color="#475569" style={{ position: "absolute", left: 11, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                <input
                  value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search channels…"
                  style={{ ...inputStyle, width: "100%", paddingLeft: 32 }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
                />
              </div>
              <input value={minSubs} onChange={e => setMinSubs(e.target.value)} placeholder="Min Subs"
                style={{ ...inputStyle, width: 100 }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
              <input value={maxSubs} onChange={e => setMaxSubs(e.target.value)} placeholder="Max Subs"
                style={{ ...inputStyle, width: 100 }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
              <input value={minViewers} onChange={e => setMinViewers(e.target.value)} placeholder="Min Views"
                style={{ ...inputStyle, width: 100 }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
              <select value={monetized} onChange={e => setMonetized(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer", width: 160 }}>
                <option>All</option>
                <option>Monetized</option>
                <option>Not Monetized</option>
                <option>Unknown</option>
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)}
                style={{ ...inputStyle, cursor: "pointer", width: 140 }}>
                <option>Recent</option>
                <option>Subscribers</option>
                <option>Views</option>
                <option>Earnings</option>
              </select>
            </div>

            {/* Table */}
            {filteredChannels.length > 0 ? (
              <div style={{
                borderRadius: 16, overflow: "hidden",
                background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                border: "1px solid rgba(255,255,255,0.06)",
              }}>
                {/* Table header */}
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "2fr 130px 130px 140px 140px 120px",
                  padding: "12px 20px",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  background: "rgba(255,255,255,0.02)",
                }}>
                  {["CHANNEL", "STATUS", "SUBSCRIBERS", "MONTHLY VIEWS", "EST. EARNINGS", "ACTIONS"].map(col => (
                    <span key={col} style={{ fontSize: 10, fontWeight: 700, color: "#475569", letterSpacing: "0.12em", textTransform: "uppercase" }}>{col}</span>
                  ))}
                </div>

                {/* Rows */}
                {filteredChannels.map(ch => {
                  const sc = statusColors[ch.status] || statusColors.Unknown;
                  const initials = ch.name.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase();
                  return (
                    <div key={ch.id} style={{
                      display: "grid",
                      gridTemplateColumns: "2fr 130px 130px 140px 140px 120px",
                      padding: "14px 20px",
                      borderBottom: "1px solid rgba(255,255,255,0.04)",
                      alignItems: "center",
                      transition: "background 0.12s",
                    }}
                      onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.02)"}
                      onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.background = "transparent"}
                    >
                      {/* Channel */}
                      <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(168,85,247,0.15)", border: "1px solid rgba(168,85,247,0.25)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: "#a855f7", flexShrink: 0 }}>
                          {initials}
                        </div>
                        <div>
                          <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: 0 }}>{ch.name}</p>
                          <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>{ch.handle}</p>
                        </div>
                      </div>

                      {/* Status */}
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, display: "inline-block" }}>{ch.status}</span>

                      {/* Subscribers */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <TrendingUp size={12} color="#a855f7" />
                        <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>{ch.subscribers}</span>
                      </div>

                      {/* Monthly Views */}
                      <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <Eye size={12} color="#00D4FF" />
                        <span style={{ fontSize: 13, color: "#94a3b8" }}>{ch.monthlyViews}</span>
                      </div>

                      {/* Est. Earnings */}
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#34d399" }}>{ch.estEarnings}</span>

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 6 }}>
                        <a href={`https://youtube.com/${ch.handle}`} target="_blank" rel="noopener noreferrer" style={{
                          display: "flex", alignItems: "center", gap: 5, padding: "5px 11px", borderRadius: 7,
                          background: "transparent", border: "1px solid rgba(0,212,255,0.25)",
                          color: "#00D4FF", fontSize: 11, fontWeight: 600, textDecoration: "none", cursor: "pointer",
                        }}>
                          <Eye size={10} /> View
                        </a>
                        <button onClick={() => removeChannel(ch.id)} style={{
                          width: 28, height: 28, borderRadius: 7, border: "none",
                          background: "rgba(239,68,68,0.08)", color: "#f87171",
                          display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                          flexShrink: 0,
                        }}>
                          <X size={12} />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              /* Empty state */
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <Bookmark size={24} color="#a855f7" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>No saved channels yet</p>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, maxWidth: 360, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                  Channels you save from the Niche Finder will appear here for easy reference and comparison.
                </p>
              </div>
            )}
          </>
        )}

        {/* ── NICHE BENDS TAB ── */}
        {tab === "niches" && (
          <>
            {nicheBends.length > 0 ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 18 }}>
                {nicheBends.map(bend => (
                  <div key={bend.id} style={{
                    borderRadius: 16,
                    background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
                    border: "1px solid rgba(255,255,255,0.06)",
                    overflow: "hidden",
                    display: "flex",
                  }}>
                    {/* Purple left accent */}
                    <div style={{ width: 4, background: "linear-gradient(180deg, #a855f7, #7c3aed)", flexShrink: 0 }} />
                    <div style={{ flex: 1, padding: "18px 20px" }}>
                      {/* Name + desc */}
                      <div style={{ marginBottom: 12 }}>
                        <p style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0", margin: "0 0 4px" }}>{bend.name}</p>
                        {bend.description && <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.5 }}>{bend.description}</p>}
                      </div>

                      {/* Tags */}
                      {bend.tags.length > 0 && (
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 14 }}>
                          {bend.tags.map(tag => (
                            <span key={tag} style={{ fontSize: 10, fontWeight: 700, padding: "2px 9px", borderRadius: 99, background: "rgba(168,85,247,0.08)", color: "#a855f7", border: "1px solid rgba(168,85,247,0.18)" }}>{tag}</span>
                          ))}
                        </div>
                      )}

                      {/* Thumbnail style */}
                      {bend.thumbnailStyle && (
                        <div style={{ marginBottom: 14 }}>
                          <p style={{ ...labelStyle, marginBottom: 6 }}>Thumbnail Style</p>
                          <div style={{ padding: "10px 12px", borderRadius: 9, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                            <p style={{ fontSize: 12, color: "#64748b", margin: 0, lineHeight: 1.5 }}>{bend.thumbnailStyle}</p>
                          </div>
                        </div>
                      )}

                      {/* Video ideas */}
                      {bend.videoIdeas.length > 0 && (
                        <div style={{ marginBottom: 16 }}>
                          <p style={{ ...labelStyle, marginBottom: 8 }}>Video Ideas</p>
                          <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                            {bend.videoIdeas.slice(0, 3).map((idea, i) => (
                              <div key={i} style={{ display: "flex", gap: 8, alignItems: "flex-start" }}>
                                <span style={{ fontSize: 11, fontWeight: 800, color: "#a855f7", flexShrink: 0, marginTop: 1 }}>{i + 1}.</span>
                                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0, lineHeight: 1.4 }}>{idea}</p>
                              </div>
                            ))}
                            {bend.videoIdeas.length > 3 && (
                              <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>+{bend.videoIdeas.length - 3} more ideas</p>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      <div style={{ display: "flex", gap: 8 }}>
                        <button style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "8px 14px", borderRadius: 9, background: "rgba(168,85,247,0.08)",
                          border: "1px solid rgba(168,85,247,0.2)", color: "#a855f7",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                        }}>
                          <Lightbulb size={12} /> View Full Details <ChevronRight size={11} style={{ marginLeft: "auto" }} />
                        </button>
                        <button onClick={() => removeNiche(bend.id)} style={{
                          display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9,
                          background: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.15)",
                          color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer",
                        }}>
                          <X size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "80px 20px" }}>
                <div style={{ width: 56, height: 56, borderRadius: 16, background: "rgba(168,85,247,0.08)", border: "1px solid rgba(168,85,247,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <FlaskConical size={24} color="#a855f7" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 700, color: "#94a3b8", margin: "0 0 8px" }}>No niche bends saved yet</p>
                <p style={{ fontSize: 13, color: "#64748b", margin: 0, maxWidth: 360, marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>
                  Save niche research bends to capture angles, thumbnail styles, and video ideas in one place.
                </p>
                <button onClick={() => setShowNicheModal(true)} style={{
                  marginTop: 20, display: "inline-flex", alignItems: "center", gap: 8,
                  padding: "10px 20px", borderRadius: 10, border: "1px solid rgba(168,85,247,0.3)",
                  background: "rgba(168,85,247,0.1)", color: "#a855f7", fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}>
                  <BookmarkPlus size={14} /> Add Niche Bend
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add Niche Bend Modal */}
      {showNicheModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200 }}
          onClick={() => setShowNicheModal(false)}>
          <div style={{
            width: 520, maxHeight: "90vh", overflowY: "auto",
            borderRadius: 20, background: "linear-gradient(135deg, #0D1626, #080D1A)",
            border: "1px solid rgba(168,85,247,0.2)", boxShadow: "0 40px 100px rgba(0,0,0,0.9)",
            padding: "26px",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 22 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FlaskConical size={18} color="#a855f7" />
                <h2 style={{ fontSize: 16, fontWeight: 800, color: "#e2e8f0", margin: 0 }}>New Niche Bend</h2>
              </div>
              <button onClick={() => setShowNicheModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 4 }}>
                <X size={16} />
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              <div>
                <label style={labelStyle}>Niche Name *</label>
                <input value={nicheName} onChange={e => setNicheName(e.target.value)} placeholder="e.g. Dark History Explained"
                  style={{ ...inputStyle, width: "100%" }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={labelStyle}>Description</label>
                <textarea value={nicheDesc} onChange={e => setNicheDesc(e.target.value)} rows={2} placeholder="Brief description of this niche angle…"
                  style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "inherit" }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={labelStyle}>Tags (comma-separated)</label>
                <input value={nicheTags} onChange={e => setNicheTags(e.target.value)} placeholder="NBA, Sports, Drama, Faceless"
                  style={{ ...inputStyle, width: "100%" }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={labelStyle}>Thumbnail Style</label>
                <input value={nicheThumbnail} onChange={e => setNicheThumbnail(e.target.value)} placeholder="e.g. Bold red text on black, dramatic face zoom…"
                  style={{ ...inputStyle, width: "100%" }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
              <div>
                <label style={labelStyle}>Video Ideas (one per line)</label>
                <textarea value={nicheIdeas} onChange={e => setNicheIdeas(e.target.value)} rows={4} placeholder={"The Untold Story of...\nHow They Hid the Truth About...\n5 Dark Secrets..."}
                  style={{ ...inputStyle, width: "100%", resize: "vertical", fontFamily: "inherit" }}
                  onFocus={e => e.currentTarget.style.borderColor = "rgba(168,85,247,0.4)"}
                  onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"} />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button onClick={() => setShowNicheModal(false)} style={{ flex: 1, padding: "11px", borderRadius: 11, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Cancel</button>
              <button onClick={addNicheBend} disabled={!nicheName.trim()} style={{
                flex: 2, padding: "11px", borderRadius: 11, fontSize: 13, fontWeight: 800, cursor: nicheName.trim() ? "pointer" : "not-allowed",
                background: nicheName.trim() ? "linear-gradient(135deg, #a855f7, #7c3aed)" : "rgba(168,85,247,0.2)",
                border: "none", color: nicheName.trim() ? "#fff" : "#64748b", transition: "all 0.15s",
              }}>Save Niche Bend</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
