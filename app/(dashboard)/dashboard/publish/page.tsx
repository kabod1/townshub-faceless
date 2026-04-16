"use client";

import React, { useState, useRef, useCallback, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Upload, Share2, CheckCircle2, AlertCircle, Loader2,
  X, Plus, Video, Clock, Globe, Lock, Eye,
} from "lucide-react";

// ─── Platform definitions ──────────────────────────────────────────────────
const PLATFORMS = [
  {
    id: "youtube",
    name: "YouTube",
    color: "#FF0000",
    bg: "rgba(255,0,0,0.08)",
    border: "rgba(255,0,0,0.25)",
    envKey: "youtube",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#FF0000">
        <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8z"/>
        <polygon fill="white" points="9.6,15.6 9.6,8.4 15.8,12"/>
      </svg>
    ),
  },
  {
    id: "tiktok",
    name: "TikTok",
    color: "#69C9D0",
    bg: "rgba(105,201,208,0.08)",
    border: "rgba(105,201,208,0.25)",
    envKey: "tiktok",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20}>
        <path fill="#EE1D52" d="M19.6 3h-3.1v11.9a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.1a6 6 0 1 0 5 5.9V8.4a7.8 7.8 0 0 0 4.5 1.4V6.6A4.8 4.8 0 0 1 19.6 3z"/>
        <path fill="#69C9D0" d="M18.6 3h-3.1v11.9a2.7 2.7 0 1 1-2.7-2.7c.3 0 .5 0 .8.1V9.1a6 6 0 1 0 5 5.9V8.4a7.8 7.8 0 0 0 4.5 1.4V6.6A4.8 4.8 0 0 1 18.6 3z"/>
      </svg>
    ),
  },
  {
    id: "instagram",
    name: "Instagram",
    color: "#E1306C",
    bg: "rgba(225,48,108,0.08)",
    border: "rgba(225,48,108,0.25)",
    envKey: "instagram",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20}>
        <defs>
          <linearGradient id="igGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f09433"/>
            <stop offset="25%" stopColor="#e6683c"/>
            <stop offset="50%" stopColor="#dc2743"/>
            <stop offset="75%" stopColor="#cc2366"/>
            <stop offset="100%" stopColor="#bc1888"/>
          </linearGradient>
        </defs>
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="url(#igGrad)"/>
        <circle cx="12" cy="12" r="4.5" fill="none" stroke="white" strokeWidth="1.8"/>
        <circle cx="17.5" cy="6.5" r="1" fill="white"/>
      </svg>
    ),
  },
  {
    id: "facebook",
    name: "Facebook",
    color: "#1877F2",
    bg: "rgba(24,119,242,0.08)",
    border: "rgba(24,119,242,0.25)",
    envKey: "facebook",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#1877F2">
        <path d="M24 12.07C24 5.4 18.6 0 12 0S0 5.4 0 12.07C0 18.1 4.4 23.1 10.1 24v-8.4H7.1v-3.5h3V9.4c0-3 1.8-4.7 4.5-4.7 1.3 0 2.7.2 2.7.2v3h-1.5c-1.5 0-2 .9-2 1.9v2.3h3.4l-.5 3.5H14V24C19.6 23.1 24 18.1 24 12.07z"/>
      </svg>
    ),
  },
  {
    id: "twitter",
    name: "X (Twitter)",
    color: "#e2e8f0",
    bg: "rgba(255,255,255,0.05)",
    border: "rgba(255,255,255,0.15)",
    envKey: "twitter",
    icon: (
      <svg viewBox="0 0 24 24" width={20} height={20} fill="#e2e8f0">
        <path d="M18.2 2h3.4l-7.4 8.5L23 22h-6.8l-5.4-7-6.1 7H1.3l7.9-9L1 2h7l4.8 6.4L18.2 2zm-1.2 18h1.9L7 4H5L17 20z"/>
      </svg>
    ),
  },
];

const PRIVACY_OPTIONS = [
  { value: "public",   label: "Public",   icon: Globe },
  { value: "unlisted", label: "Unlisted", icon: Eye },
  { value: "private",  label: "Private",  icon: Lock },
];

const CARD: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  padding: "20px 22px",
  marginBottom: 16,
};

type PublishStatus = "idle" | "uploading" | "publishing" | "done" | "error";
type PlatformResult = { status: "pending" | "publishing" | "done" | "error"; message?: string };

function PublishPageInner() {
  const searchParams = useSearchParams();

  // Video source
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoBlobUrl, setVideoBlobUrl] = useState<string | null>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Metadata
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [privacy, setPrivacy] = useState("public");

  // Platform selection
  const [selected, setSelected] = useState<Record<string, boolean>>({
    youtube: true, tiktok: false, instagram: false, facebook: false, twitter: false,
  });

  // Publishing state
  const [status, setStatus] = useState<PublishStatus>("idle");
  const [platformResults, setPlatformResults] = useState<Record<string, PlatformResult>>({});
  const [globalError, setGlobalError] = useState<string | null>(null);

  // Platform connectivity (based on env — we check via a ping endpoint stub)
  const [connected] = useState<Record<string, boolean>>({
    youtube: !!process.env.NEXT_PUBLIC_YT_CONNECTED,
    tiktok: false, instagram: false, facebook: false, twitter: false,
  });

  // Check for videoUrl passed from voiceover page
  useEffect(() => {
    const param = searchParams.get("videoUrl");
    if (param) {
      setUploadedUrl(param);
      setVideoUrl(param);
    }
  }, [searchParams]);

  // File selection
  function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (!f) return;
    setVideoFile(f);
    const burl = URL.createObjectURL(f);
    setVideoBlobUrl(burl);
    setUploadedUrl(null);
  }

  // Drag-and-drop
  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files?.[0];
    if (!f || !f.type.startsWith("video/")) return;
    setVideoFile(f);
    const burl = URL.createObjectURL(f);
    setVideoBlobUrl(burl);
    setUploadedUrl(null);
  }

  function addTag(raw: string) {
    const tag = raw.trim().replace(/^#/, "");
    if (tag && !tags.includes(tag) && tags.length < 20) {
      setTags([...tags, tag]);
    }
    setTagInput("");
  }

  function removeTag(t: string) { setTags(tags.filter(x => x !== t)); }

  const hasVideo = !!videoFile || !!uploadedUrl;
  const selectedPlatforms = PLATFORMS.filter(p => selected[p.id]);
  const canPublish = hasVideo && title.trim() && selectedPlatforms.length > 0;

  // ─── Upload then publish ──────────────────────────────────────────────────
  const handlePublish = useCallback(async () => {
    if (!canPublish) return;
    setGlobalError(null);
    setStatus("uploading");

    const initialResults: Record<string, PlatformResult> = {};
    selectedPlatforms.forEach(p => { initialResults[p.id] = { status: "pending" }; });
    setPlatformResults(initialResults);

    let finalVideoUrl = uploadedUrl;

    // Upload file to Supabase Storage if we have a local file
    if (videoFile && !uploadedUrl) {
      try {
        const formData = new FormData();
        formData.append("video", videoFile);
        const uploadRes = await fetch("/api/upload-video", { method: "POST", body: formData });
        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) {
          setGlobalError(uploadData.error || "Failed to upload video to storage.");
          setStatus("error");
          return;
        }
        finalVideoUrl = uploadData.url;
        setUploadedUrl(finalVideoUrl!);
      } catch (e: unknown) {
        setGlobalError(e instanceof Error ? e.message : "Upload failed");
        setStatus("error");
        return;
      }
    }

    if (!finalVideoUrl) {
      setGlobalError("No video URL available.");
      setStatus("error");
      return;
    }

    // Publish to each platform
    setStatus("publishing");
    for (const platform of selectedPlatforms) {
      setPlatformResults(prev => ({ ...prev, [platform.id]: { status: "publishing" } }));
      try {
        const res = await fetch("/api/publish-social", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            platform: platform.id,
            videoUrl: finalVideoUrl,
            title,
            description,
            tags,
            privacy,
          }),
        });
        const data = await res.json();
        if (!res.ok || data.error) {
          setPlatformResults(prev => ({ ...prev, [platform.id]: { status: "error", message: data.error || "Upload failed" } }));
        } else {
          setPlatformResults(prev => ({ ...prev, [platform.id]: { status: "done" } }));
        }
      } catch (e: unknown) {
        setPlatformResults(prev => ({
          ...prev,
          [platform.id]: { status: "error", message: e instanceof Error ? e.message : "Network error" },
        }));
      }
    }
    setStatus("done");
  }, [canPublish, videoFile, uploadedUrl, selectedPlatforms, title, description, tags, privacy]);

  function resetAll() {
    setVideoFile(null);
    setVideoBlobUrl(null);
    setUploadedUrl(null);
    setVideoUrl("");
    setTitle(""); setDescription(""); setTags([]); setTagInput("");
    setPrivacy("public");
    setSelected({ youtube: true, tiktok: false, instagram: false, facebook: false, twitter: false });
    setStatus("idle");
    setPlatformResults({});
    setGlobalError(null);
  }

  const previewSrc = videoBlobUrl || uploadedUrl || (videoUrl.startsWith("http") ? videoUrl : null);

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Topbar
        title="Social Publish"
        subtitle="Upload your video to YouTube, TikTok, Instagram, Facebook and X"
      />

      <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── LEFT: Video + Metadata ── */}
        <div style={{ flex: 1, minWidth: 320 }}>

          {/* Video source */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Video size={15} color="#00D4FF" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Video Source</span>
            </div>

            {/* Drop zone */}
            {!previewSrc ? (
              <div
                ref={dropRef}
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={onDrop}
                style={{
                  border: `2px dashed ${isDragging ? "rgba(0,212,255,0.5)" : "rgba(255,255,255,0.1)"}`,
                  borderRadius: 12, padding: "40px 24px", textAlign: "center", cursor: "pointer",
                  background: isDragging ? "rgba(0,212,255,0.04)" : "rgba(0,0,0,0.2)",
                  transition: "all 0.2s",
                }}
              >
                <Upload size={32} color="#334155" style={{ marginBottom: 12 }} />
                <div style={{ fontSize: 14, fontWeight: 700, color: "#64748b", marginBottom: 6 }}>
                  Drop a video file here
                </div>
                <div style={{ fontSize: 12, color: "#334155", marginBottom: 14 }}>
                  or click to browse — MP4, WebM, MOV supported
                </div>
                <div style={{
                  display: "inline-block", padding: "8px 20px",
                  background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: 8, fontSize: 12, fontWeight: 700, color: "#00D4FF",
                }}>Browse Files</div>
                <input ref={fileInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={onFileChange} />
              </div>
            ) : (
              <div>
                <video src={previewSrc} controls style={{ width: "100%", borderRadius: 10, background: "#000", marginBottom: 12, maxHeight: 280 }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    onClick={() => { setVideoFile(null); setVideoBlobUrl(null); setUploadedUrl(null); setVideoUrl(""); }}
                    style={{
                      flex: 1, padding: "8px 14px", background: "rgba(239,68,68,0.07)",
                      border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8, cursor: "pointer",
                      color: "#f87171", fontSize: 12, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <X size={12} />Remove
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      flex: 1, padding: "8px 14px", background: "rgba(0,212,255,0.06)",
                      border: "1px solid rgba(0,212,255,0.15)", borderRadius: 8, cursor: "pointer",
                      color: "#00D4FF", fontSize: 12, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <Upload size={12} />Change
                  </button>
                </div>
                <input ref={fileInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={onFileChange} />
              </div>
            )}

            {/* Or paste URL */}
            {!previewSrc && (
              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 11, color: "#475569", textAlign: "center", marginBottom: 10 }}>— or paste a video URL —</div>
                <input
                  type="url"
                  value={videoUrl}
                  onChange={e => setVideoUrl(e.target.value)}
                  onBlur={() => { if (videoUrl.startsWith("http")) setUploadedUrl(videoUrl); }}
                  placeholder="https://…"
                  style={{
                    width: "100%", padding: "10px 14px",
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, color: "#e2e8f0", fontSize: 13, outline: "none",
                    fontFamily: "inherit", boxSizing: "border-box",
                  }}
                />
              </div>
            )}
          </div>

          {/* Metadata */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Share2 size={15} color="#00D4FF" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Video Details</span>
            </div>

            {/* Title */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                Title *
              </label>
              <input
                value={title}
                onChange={e => setTitle(e.target.value.slice(0, 100))}
                placeholder="Enter video title…"
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e2e8f0", fontSize: 13, outline: "none",
                  fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
              <div style={{ fontSize: 10, color: "#475569", textAlign: "right", marginTop: 4 }}>{title.length}/100</div>
            </div>

            {/* Description */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                Description
              </label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value.slice(0, 5000))}
                placeholder="Add a description…"
                rows={4}
                style={{
                  width: "100%", padding: "10px 14px",
                  background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 8, color: "#e2e8f0", fontSize: 13, resize: "vertical",
                  outline: "none", fontFamily: "inherit", lineHeight: 1.6, boxSizing: "border-box",
                }}
              />
              <div style={{ fontSize: 10, color: "#475569", textAlign: "right", marginTop: 4 }}>{description.length}/5000</div>
            </div>

            {/* Tags */}
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 6 }}>
                Tags
              </label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 8 }}>
                {tags.map(t => (
                  <span key={t} style={{
                    display: "flex", alignItems: "center", gap: 4,
                    padding: "3px 10px", background: "rgba(0,212,255,0.08)",
                    border: "1px solid rgba(0,212,255,0.2)", borderRadius: 99,
                    fontSize: 12, color: "#00D4FF",
                  }}>
                    #{t}
                    <button onClick={() => removeTag(t)} style={{ background: "none", border: "none", cursor: "pointer", color: "#00D4FF", padding: 0, lineHeight: 1, marginTop: 1 }}>
                      <X size={10} />
                    </button>
                  </span>
                ))}
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <input
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addTag(tagInput); } }}
                  placeholder="Add tag and press Enter"
                  style={{
                    flex: 1, padding: "8px 12px",
                    background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
                    borderRadius: 8, color: "#e2e8f0", fontSize: 12, outline: "none", fontFamily: "inherit",
                  }}
                />
                <button onClick={() => addTag(tagInput)} style={{
                  padding: "8px 12px", background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, cursor: "pointer", color: "#00D4FF",
                }}>
                  <Plus size={14} />
                </button>
              </div>
              <div style={{ fontSize: 10, color: "#475569", marginTop: 4 }}>{tags.length}/20 tags</div>
            </div>

            {/* Privacy */}
            <div>
              <label style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", display: "block", marginBottom: 8 }}>
                Privacy
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {PRIVACY_OPTIONS.map(o => {
                  const Icon = o.icon;
                  const active = privacy === o.value;
                  return (
                    <button key={o.value} onClick={() => setPrivacy(o.value)} style={{
                      flex: 1, padding: "8px 10px",
                      background: active ? "rgba(0,212,255,0.1)" : "rgba(0,0,0,0.2)",
                      border: active ? "1px solid rgba(0,212,255,0.4)" : "1px solid rgba(255,255,255,0.06)",
                      borderRadius: 8, cursor: "pointer", transition: "all 0.15s",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                      color: active ? "#00D4FF" : "#64748b", fontSize: 12, fontWeight: active ? 700 : 500,
                    }}>
                      <Icon size={12} />{o.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── RIGHT: Platforms + Publish ── */}
        <div style={{ width: 320, flexShrink: 0 }}>

          {/* Platform cards */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
              <Share2 size={15} color="#00D4FF" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Publish To</span>
              <span style={{ marginLeft: "auto", fontSize: 11, color: "#64748b" }}>
                {selectedPlatforms.length} selected
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {PLATFORMS.map(p => {
                const isSelected = selected[p.id];
                const result = platformResults[p.id];
                const isConnected = connected[p.id];

                return (
                  <div key={p.id} style={{
                    display: "flex", alignItems: "center", gap: 12,
                    padding: "12px 14px", borderRadius: 10,
                    background: isSelected ? p.bg : "rgba(0,0,0,0.2)",
                    border: `1px solid ${isSelected ? p.border : "rgba(255,255,255,0.05)"}`,
                    cursor: "pointer", transition: "all 0.15s",
                    opacity: status === "publishing" || status === "done" ? 0.9 : 1,
                  }} onClick={() => {
                    if (status === "idle" || status === "error") {
                      setSelected(prev => ({ ...prev, [p.id]: !prev[p.id] }));
                    }
                  }}>
                    {/* Platform icon */}
                    <div style={{ flexShrink: 0 }}>{p.icon}</div>

                    {/* Name + connection */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? "#e2e8f0" : "#64748b" }}>
                        {p.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#475569", marginTop: 1 }}>
                        {isConnected ? "Connected" : "Needs n8n setup"}
                      </div>
                    </div>

                    {/* Status / toggle */}
                    <div style={{ flexShrink: 0 }}>
                      {result?.status === "publishing" && (
                        <Loader2 size={16} color={p.color} style={{ animation: "spin 0.8s linear infinite" }} />
                      )}
                      {result?.status === "done" && <CheckCircle2 size={16} color="#22c55e" />}
                      {result?.status === "error" && <AlertCircle size={16} color="#ef4444" />}
                      {!result && (
                        <div style={{
                          width: 20, height: 20, borderRadius: 99,
                          background: isSelected ? p.color : "rgba(255,255,255,0.06)",
                          border: isSelected ? `2px solid ${p.color}` : "2px solid rgba(255,255,255,0.1)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          transition: "all 0.15s",
                        }}>
                          {isSelected && <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff" }} />}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Platform errors */}
          {Object.entries(platformResults).some(([, r]) => r.status === "error") && (
            <div style={{ ...CARD, border: "1px solid rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.04)", marginBottom: 16 }}>
              {Object.entries(platformResults).filter(([, r]) => r.status === "error").map(([id, r]) => {
                const platform = PLATFORMS.find(p => p.id === id);
                return (
                  <div key={id} style={{ marginBottom: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#f87171" }}>{platform?.name}</div>
                    <div style={{ fontSize: 11, color: "#fca5a5", lineHeight: 1.4 }}>{r.message}</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Global error */}
          {globalError && (
            <div style={{ ...CARD, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)", marginBottom: 16 }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                <div style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.5 }}>{globalError}</div>
              </div>
            </div>
          )}

          {/* Publish button */}
          {status !== "done" ? (
            <button
              onClick={handlePublish}
              disabled={!canPublish || status === "uploading" || status === "publishing"}
              style={{
                width: "100%", padding: "14px 20px",
                background: canPublish && status === "idle"
                  ? "linear-gradient(135deg, #00D4FF, #0080cc)"
                  : "rgba(0,212,255,0.1)",
                border: "none", borderRadius: 12,
                cursor: canPublish && status === "idle" ? "pointer" : "not-allowed",
                color: canPublish && status === "idle" ? "#04080F" : "rgba(0,212,255,0.4)",
                fontSize: 14, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginBottom: 12,
                boxShadow: canPublish && status === "idle" ? "0 0 20px rgba(0,212,255,0.3)" : "none",
                transition: "all 0.2s",
              }}
            >
              {status === "uploading" ? (
                <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />Uploading…</>
              ) : status === "publishing" ? (
                <><Loader2 size={16} style={{ animation: "spin 0.8s linear infinite" }} />Publishing…</>
              ) : (
                <><Share2 size={16} />Publish Now</>
              )}
            </button>
          ) : (
            <div>
              <div style={{
                padding: "14px 18px", borderRadius: 12, marginBottom: 12,
                background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)",
                display: "flex", alignItems: "center", gap: 10,
              }}>
                <CheckCircle2 size={18} color="#22c55e" />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#86efac" }}>Published!</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>
                    {Object.values(platformResults).filter(r => r.status === "done").length} of {selectedPlatforms.length} platforms succeeded
                  </div>
                </div>
              </div>
              <button onClick={resetAll} style={{
                width: "100%", padding: "10px 16px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, cursor: "pointer", color: "#94a3b8", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}>
                Publish Another Video
              </button>
            </div>
          )}

          {/* Checklist */}
          {!canPublish && status === "idle" && (
            <div style={{ ...CARD, background: "rgba(0,0,0,0.2)" }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>
                Before publishing
              </div>
              {[
                { done: hasVideo, label: "Select a video" },
                { done: title.trim().length > 0, label: "Add a title" },
                { done: selectedPlatforms.length > 0, label: "Choose at least one platform" },
              ].map((item, i) => (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{
                    width: 16, height: 16, borderRadius: "50%", flexShrink: 0,
                    background: item.done ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.04)",
                    border: `1px solid ${item.done ? "rgba(34,197,94,0.4)" : "rgba(255,255,255,0.08)"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                  }}>
                    {item.done && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />}
                  </div>
                  <span style={{ fontSize: 12, color: item.done ? "#86efac" : "#64748b" }}>{item.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Setup guide */}
          <div style={CARD}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", marginBottom: 12 }}>
              Platform Setup
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {PLATFORMS.map(p => (
                <div key={p.id} style={{ fontSize: 11, color: "#64748b", lineHeight: 1.5 }}>
                  <span style={{ color: "#94a3b8", fontWeight: 700 }}>{p.name}</span> — In n8n, create a workflow with a Webhook trigger and a{" "}
                  <span style={{ color: "#94a3b8" }}>{p.name} upload node</span>. Set the webhook URL as{" "}
                  <code style={{ fontSize: 10, background: "rgba(0,212,255,0.06)", padding: "1px 5px", borderRadius: 4, color: "#00D4FF" }}>
                    N8N_{p.id.toUpperCase()}_UPLOAD_WEBHOOK_URL
                  </code>{" "}
                  in your .env.local.
                </div>
              ))}
            </div>

            <div style={{ marginTop: 14, padding: "10px 12px", background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.15)", borderRadius: 8 }}>
              <div style={{ fontSize: 11, color: "#fbbf24", lineHeight: 1.5 }}>
                <strong>Credentials needed:</strong> Each platform requires an OAuth app in their developer portal. Set up credentials once in n8n and all future uploads are automatic.
              </div>
            </div>
          </div>

          {/* Timing info */}
          <div style={{ padding: "12px 16px", background: "rgba(0,0,0,0.2)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 6 }}>
              <Clock size={12} color="#64748b" />
              <span style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Upload times</span>
            </div>
            <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.6 }}>
              YouTube: 1–5 min · TikTok: 30–90s<br />
              Instagram: 1–3 min · Facebook: 1–4 min<br />
              X: 30–60s (15 min video limit)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PublishPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: "100vh", background: "#080D1A" }} />}>
      <PublishPageInner />
    </Suspense>
  );
}
