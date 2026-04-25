"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Upload, Video, Trash2, Mic, Play, Pause, Download,
  AlertCircle, CheckCircle, Loader2, ChevronLeft, Type,
  AlignCenter, AlignLeft, AlignRight, Palette,
} from "lucide-react";

interface Caption { start: number; end: number; text: string; }
interface CaptionStyle {
  fontSize: number; color: string; bgColor: string;
  position: "top" | "center" | "bottom"; bold: boolean; animation: "none" | "fade" | "slide";
}
interface UserVideo {
  id: string; title: string; video_url: string; filename: string;
  duration: number; file_size: number; status: string;
  captions: Caption[] | null; caption_style: CaptionStyle | null; created_at: string;
}

const DEFAULT_STYLE: CaptionStyle = {
  fontSize: 28, color: "#FFFFFF", bgColor: "rgba(0,0,0,0.6)",
  position: "bottom", bold: true, animation: "fade",
};

function fmtDuration(s: number) {
  const m = Math.floor(s / 60); const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, "0")}`;
}
function fmtSize(b: number) {
  if (b > 1024 * 1024) return `${(b / 1024 / 1024).toFixed(1)} MB`;
  return `${(b / 1024).toFixed(0)} KB`;
}

export default function MyVideosPage() {
  const [videos, setVideos] = useState<UserVideo[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selected, setSelected] = useState<UserVideo | null>(null);
  const [transcribing, setTranscribing] = useState(false);
  const [transcribeError, setTranscribeError] = useState<string | null>(null);
  const [captions, setCaptions] = useState<Caption[]>([]);
  const [style, setStyle] = useState<CaptionStyle>(DEFAULT_STYLE);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number>(0);

  useEffect(() => { loadVideos(); }, []);

  async function loadVideos() {
    setLoading(true);
    const res = await fetch("/api/my-videos");
    if (res.ok) { const d = await res.json(); setVideos(d.videos || []); }
    setLoading(false);
  }

  function openVideo(v: UserVideo) {
    setSelected(v);
    setCaptions(v.captions || []);
    setStyle(v.caption_style || DEFAULT_STYLE);
    setCurrentTime(0);
    setPlaying(false);
    setTranscribeError(null);
  }

  async function handleUpload(file: File) {
    if (!file.type.startsWith("video/")) { alert("Please upload a video file."); return; }
    if (file.size > 500 * 1024 * 1024) { alert("Max file size is 500MB."); return; }
    setUploading(true); setUploadProgress(10);

    const formData = new FormData();
    formData.append("video", file);
    setUploadProgress(30);

    const uploadRes = await fetch("/api/upload-video", { method: "POST", body: formData });
    setUploadProgress(70);
    if (!uploadRes.ok) { setUploading(false); alert("Upload failed."); return; }
    const { url, filename } = await uploadRes.json();

    const title = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
    const saveRes = await fetch("/api/my-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, video_url: url, filename, file_size: file.size }),
    });
    setUploadProgress(100);
    if (saveRes.ok) {
      const { video } = await saveRes.json();
      setVideos(prev => [video, ...prev]);
      openVideo(video);
    }
    setUploading(false);
  }

  async function handleTranscribe() {
    if (!selected) return;
    setTranscribing(true); setTranscribeError(null);
    const res = await fetch("/api/transcribe-video", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoUrl: selected.video_url, videoId: selected.id }),
    });
    const data = await res.json();
    if (!res.ok) { setTranscribeError(data.error || "Transcription failed"); setTranscribing(false); return; }
    const updated: UserVideo = { ...selected, captions: data.captions, status: "ready" };
    setSelected(updated);
    setCaptions(data.captions);
    setVideos(prev => prev.map(v => v.id === selected.id ? updated : v));
    setTranscribing(false);
  }

  async function saveStyle(newStyle: CaptionStyle) {
    setStyle(newStyle);
    if (!selected) return;
    await fetch("/api/my-videos", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: selected.id, caption_style: newStyle }),
    });
  }

  async function deleteVideo(id: string) {
    if (!confirm("Delete this video?")) return;
    await fetch(`/api/my-videos?id=${id}`, { method: "DELETE" });
    setVideos(prev => prev.filter(v => v.id !== id));
    if (selected?.id === id) setSelected(null);
  }

  // Draw captions onto canvas overlay during export
  const drawCaption = useCallback((ctx: CanvasRenderingContext2D, text: string, w: number, h: number, s: CaptionStyle) => {
    const fs = s.fontSize * (w / 640);
    ctx.font = `${s.bold ? "bold" : "normal"} ${fs}px Inter, sans-serif`;
    ctx.textAlign = "center";
    const lines = wrapText(ctx, text, w * 0.85);
    const lineH = fs * 1.4;
    const totalH = lines.length * lineH + 16;
    const y = s.position === "top" ? fs + 24 : s.position === "center" ? h / 2 - totalH / 2 : h - totalH - 24;
    if (s.bgColor !== "transparent") {
      ctx.fillStyle = s.bgColor;
      ctx.beginPath();
      ctx.roundRect(w / 2 - w * 0.44, y - 8, w * 0.88, totalH, 8);
      ctx.fill();
    }
    ctx.fillStyle = s.color;
    lines.forEach((line, i) => ctx.fillText(line, w / 2, y + i * lineH + fs));
  }, []);

  function wrapText(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
    const words = text.split(" "); const lines: string[] = []; let cur = "";
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (ctx.measureText(test).width > maxW && cur) { lines.push(cur); cur = w; }
      else cur = test;
    }
    if (cur) lines.push(cur);
    return lines;
  }

  function activeCaption(t: number): Caption | null {
    return captions.find(c => t >= c.start && t <= c.end) || null;
  }

  // Live preview overlay via canvas
  useEffect(() => {
    const video = videoRef.current; const canvas = canvasRef.current;
    if (!video || !canvas || !selected) return;
    const ctx = canvas.getContext("2d"); if (!ctx) return;

    function draw() {
      if (!video || !canvas || !ctx) return;
      canvas.width = video.videoWidth || 640; canvas.height = video.videoHeight || 360;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cap = activeCaption(video.currentTime);
      if (cap) drawCaption(ctx, cap.text, canvas.width, canvas.height, style);
      animFrameRef.current = requestAnimationFrame(draw);
    }
    animFrameRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animFrameRef.current);
  }, [selected, captions, style, drawCaption]);

  async function handleExport(format: "16:9" | "9:16" | "1:1") {
    const video = videoRef.current; if (!video || !selected) return;
    setExporting(true); setExportProgress(0);

    const dims: Record<string, [number, number]> = {
      "16:9": [1280, 720], "9:16": [720, 1280], "1:1": [720, 720],
    };
    const [W, H] = dims[format];
    const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
    const ctx = canvas.getContext("2d")!;
    const chunks: Blob[] = [];
    const stream = canvas.captureStream(30);

    let audioStream: MediaStream | null = null;
    try {
      // @ts-expect-error - captureStream on HTMLVideoElement
      audioStream = video.captureStream();
      const audioTrack = audioStream.getAudioTracks()[0];
      if (audioTrack) stream.addTrack(audioTrack);
    } catch { /* no audio */ }

    const recorder = new MediaRecorder(stream, { mimeType: "video/webm;codecs=vp9,opus" });
    recorder.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };

    await new Promise<void>(resolve => {
      recorder.onstop = () => resolve();
      recorder.start(100);
      video.currentTime = 0;
      video.play();

      const draw = () => {
        if (!video.paused && !video.ended) {
          ctx.fillStyle = "#000"; ctx.fillRect(0, 0, W, H);
          const vw = video.videoWidth || W; const vh = video.videoHeight || H;
          const scale = Math.min(W / vw, H / vh);
          const dx = (W - vw * scale) / 2; const dy = (H - vh * scale) / 2;
          ctx.drawImage(video, dx, dy, vw * scale, vh * scale);
          const cap = activeCaption(video.currentTime);
          if (cap) drawCaption(ctx, cap.text, W, H, style);
          setExportProgress(Math.round((video.currentTime / (video.duration || 1)) * 100));
          requestAnimationFrame(draw);
        }
      };
      video.onended = () => { recorder.stop(); video.onended = null; };
      requestAnimationFrame(draw);
    });

    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${selected.title}-captioned-${format.replace(":", "x")}.webm`;
    a.click(); URL.revokeObjectURL(url);
    setExporting(false); setExportProgress(0);
  }

  // ─── UI ─────────────────────────────────────────────────────────────────────

  if (selected) {
    return (
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#070C18" }}>
        <Topbar title={selected.title} subtitle="My Videos · Caption Editor" />
        <div style={{ flex: 1, overflowY: "auto", padding: "16px 20px", display: "flex", flexDirection: "column", gap: 16 }}>

          {/* Back */}
          <button onClick={() => setSelected(null)} style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: "none", border: "none", color: "#64748b", cursor: "pointer", fontSize: 12, padding: 0,
          }}>
            <ChevronLeft size={14} /> Back to My Videos
          </button>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>

            {/* Left: video preview */}
            <div style={{ flex: "1 1 400px", minWidth: 0 }}>
              <div style={{ position: "relative", background: "#000", borderRadius: 12, overflow: "hidden", aspectRatio: "16/9" }}>
                <video
                  ref={videoRef}
                  src={selected.video_url}
                  style={{ width: "100%", height: "100%", objectFit: "contain", display: "block" }}
                  onTimeUpdate={e => setCurrentTime((e.target as HTMLVideoElement).currentTime)}
                  onPlay={() => setPlaying(true)}
                  onPause={() => setPlaying(false)}
                />
                <canvas ref={canvasRef} style={{
                  position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none",
                }} />
              </div>

              {/* Player controls */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 10 }}>
                <button onClick={() => playing ? videoRef.current?.pause() : videoRef.current?.play()}
                  style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 8, padding: "6px 14px", color: "#00D4FF", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                  {playing ? <Pause size={13} /> : <Play size={13} />}
                  {playing ? "Pause" : "Play"}
                </button>
                <span style={{ fontSize: 11, color: "#64748b" }}>{fmtDuration(currentTime)}</span>
                {activeCaption(currentTime) && (
                  <span style={{ fontSize: 11, color: "#a78bfa", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    "{activeCaption(currentTime)?.text}"
                  </span>
                )}
              </div>

              {/* Transcribe button */}
              {!captions.length && (
                <div style={{ marginTop: 14, padding: "14px 16px", borderRadius: 12, background: "rgba(167,139,250,0.07)", border: "1px solid rgba(167,139,250,0.15)" }}>
                  <p style={{ fontSize: 13, color: "#c4b5fd", fontWeight: 600, margin: "0 0 6px" }}>No captions yet</p>
                  <p style={{ fontSize: 11, color: "#64748b", margin: "0 0 12px" }}>
                    AI will transcribe your video and generate synced captions automatically. Requires OpenAI credits.
                  </p>
                  {transcribeError && <p style={{ fontSize: 11, color: "#f87171", marginBottom: 8 }}>✗ {transcribeError}</p>}
                  <button onClick={handleTranscribe} disabled={transcribing} style={{
                    display: "flex", alignItems: "center", gap: 7, padding: "9px 16px", borderRadius: 8, border: "none",
                    background: transcribing ? "rgba(167,139,250,0.15)" : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                    color: transcribing ? "#64748b" : "#fff", fontSize: 13, fontWeight: 700, cursor: transcribing ? "not-allowed" : "pointer",
                  }}>
                    {transcribing ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <Mic size={14} />}
                    {transcribing ? "Transcribing… (this may take a minute)" : "Auto-Generate Captions"}
                  </button>
                </div>
              )}

              {/* Caption list */}
              {captions.length > 0 && (
                <div style={{ marginTop: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#4A6080", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 8 }}>
                    {captions.length} Caption Segments
                  </p>
                  <div style={{ maxHeight: 220, overflowY: "auto", display: "flex", flexDirection: "column", gap: 4 }}>
                    {captions.map((c, i) => (
                      <div key={i} onClick={() => { if (videoRef.current) videoRef.current.currentTime = c.start; }}
                        style={{
                          padding: "7px 10px", borderRadius: 8, cursor: "pointer",
                          background: currentTime >= c.start && currentTime <= c.end ? "rgba(167,139,250,0.12)" : "rgba(255,255,255,0.03)",
                          border: currentTime >= c.start && currentTime <= c.end ? "1px solid rgba(167,139,250,0.25)" : "1px solid transparent",
                          display: "flex", gap: 10, alignItems: "flex-start",
                        }}>
                        <span style={{ fontSize: 10, color: "#4A6080", flexShrink: 0, paddingTop: 1 }}>{fmtDuration(c.start)}</span>
                        <span style={{ fontSize: 12, color: "#C8D6F0", flex: 1 }}>{c.text}</span>
                      </div>
                    ))}
                  </div>
                  <button onClick={handleTranscribe} disabled={transcribing} style={{
                    marginTop: 8, fontSize: 11, color: "#64748b", background: "none", border: "none", cursor: "pointer", padding: 0,
                  }}>↻ Re-generate captions</button>
                </div>
              )}
            </div>

            {/* Right: style + export */}
            <div style={{ flex: "0 0 260px", display: "flex", flexDirection: "column", gap: 12 }}>

              {/* Caption style */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Caption Style</p>

                {/* Font size */}
                <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 4 }}>Font Size: {style.fontSize}px</label>
                <input type="range" min={16} max={56} value={style.fontSize}
                  onChange={e => saveStyle({ ...style, fontSize: Number(e.target.value) })}
                  style={{ width: "100%", marginBottom: 12 }} />

                {/* Text color */}
                <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>Text Colour</label>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {["#FFFFFF", "#FFFF00", "#00D4FF", "#FF6B6B", "#4ADE80"].map(c => (
                    <button key={c} onClick={() => saveStyle({ ...style, color: c })} style={{
                      width: 24, height: 24, borderRadius: "50%", background: c, border: style.color === c ? "2px solid #fff" : "2px solid transparent", cursor: "pointer",
                    }} />
                  ))}
                  <label style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(255,255,255,0.1)", border: "1px dashed #334155", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Palette size={10} color="#64748b" />
                    <input type="color" value={style.color} onChange={e => saveStyle({ ...style, color: e.target.value })} style={{ opacity: 0, width: 0, height: 0, position: "absolute" }} />
                  </label>
                </div>

                {/* Position */}
                <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>Position</label>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {(["top", "center", "bottom"] as const).map(p => (
                    <button key={p} onClick={() => saveStyle({ ...style, position: p })} style={{
                      flex: 1, padding: "5px 0", borderRadius: 6, fontSize: 11, border: "none",
                      background: style.position === p ? "rgba(0,212,255,0.15)" : "rgba(255,255,255,0.05)",
                      color: style.position === p ? "#00D4FF" : "#64748b", cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                    }}>
                      {p === "top" ? <AlignLeft size={10} /> : p === "center" ? <AlignCenter size={10} /> : <AlignRight size={10} />}
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Animation */}
                <label style={{ fontSize: 11, color: "#64748b", display: "block", marginBottom: 6 }}>Animation</label>
                <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
                  {(["none", "fade", "slide"] as const).map(a => (
                    <button key={a} onClick={() => saveStyle({ ...style, animation: a })} style={{
                      flex: 1, padding: "5px 0", borderRadius: 6, fontSize: 11, border: "none",
                      background: style.animation === a ? "rgba(167,139,250,0.15)" : "rgba(255,255,255,0.05)",
                      color: style.animation === a ? "#a78bfa" : "#64748b", cursor: "pointer",
                    }}>{a.charAt(0).toUpperCase() + a.slice(1)}</button>
                  ))}
                </div>

                {/* Bold */}
                <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }}>
                  <input type="checkbox" checked={style.bold} onChange={e => saveStyle({ ...style, bold: e.target.checked })} />
                  <span style={{ fontSize: 12, color: "#C8D6F0" }}>Bold text</span>
                </label>
              </div>

              {/* Export */}
              <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 12, padding: "14px 16px" }}>
                <p style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>Export with Captions</p>
                {exporting ? (
                  <div>
                    <div style={{ width: "100%", height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, overflow: "hidden", marginBottom: 8 }}>
                      <div style={{ height: "100%", width: `${exportProgress}%`, background: "linear-gradient(90deg, #a78bfa, #7c3aed)", borderRadius: 99, transition: "width 0.3s" }} />
                    </div>
                    <p style={{ fontSize: 11, color: "#64748b" }}>Rendering… {exportProgress}%</p>
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {(["16:9", "9:16", "1:1"] as const).map(fmt => (
                      <button key={fmt} onClick={() => handleExport(fmt)} disabled={!captions.length} style={{
                        display: "flex", alignItems: "center", justifyContent: "space-between",
                        padding: "9px 12px", borderRadius: 8, border: "1px solid rgba(255,255,255,0.07)",
                        background: captions.length ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.02)",
                        color: captions.length ? "#C8D6F0" : "#334155", cursor: captions.length ? "pointer" : "not-allowed", fontSize: 12,
                      }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <Download size={12} />
                          {fmt === "16:9" ? "YouTube / Landscape" : fmt === "9:16" ? "TikTok / Portrait" : "Instagram Square"}
                        </span>
                        <span style={{ fontSize: 10, color: "#4A6080" }}>{fmt}</span>
                      </button>
                    ))}
                    {!captions.length && <p style={{ fontSize: 10, color: "#4A6080" }}>Generate captions first to enable export</p>}
                  </div>
                )}
              </div>

              {/* Delete */}
              <button onClick={() => deleteVideo(selected.id)} style={{
                display: "flex", alignItems: "center", gap: 6, justifyContent: "center",
                padding: "8px", borderRadius: 8, background: "rgba(239,68,68,0.07)",
                border: "1px solid rgba(239,68,68,0.15)", color: "#f87171", cursor: "pointer", fontSize: 12,
              }}>
                <Trash2 size={12} /> Delete Video
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── Library view ────────────────────────────────────────────────────────────
  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#070C18" }}>
      <Topbar title="My Videos" subtitle="Upload your recordings and add AI captions" />
      <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

        {/* Upload zone */}
        <div
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleUpload(f); }}
          onClick={() => fileRef.current?.click()}
          style={{
            border: `2px dashed ${dragOver ? "#a78bfa" : "rgba(255,255,255,0.08)"}`,
            borderRadius: 16, padding: "32px 24px", textAlign: "center", cursor: "pointer",
            background: dragOver ? "rgba(167,139,250,0.05)" : "rgba(255,255,255,0.02)",
            transition: "all 0.2s", marginBottom: 24,
          }}>
          <input ref={fileRef} type="file" accept="video/*" style={{ display: "none" }}
            onChange={e => { const f = e.target.files?.[0]; if (f) handleUpload(f); }} />
          {uploading ? (
            <div>
              <Loader2 size={32} color="#a78bfa" style={{ animation: "spin 1s linear infinite", marginBottom: 12 }} />
              <div style={{ width: 200, height: 4, background: "rgba(255,255,255,0.05)", borderRadius: 99, margin: "0 auto 8px" }}>
                <div style={{ height: "100%", width: `${uploadProgress}%`, background: "linear-gradient(90deg, #a78bfa, #7c3aed)", borderRadius: 99, transition: "width 0.3s" }} />
              </div>
              <p style={{ color: "#a78bfa", fontSize: 13, margin: 0 }}>Uploading…</p>
            </div>
          ) : (
            <>
              <Upload size={32} color="#334155" style={{ marginBottom: 12 }} />
              <p style={{ color: "#C8D6F0", fontSize: 14, fontWeight: 600, margin: "0 0 4px" }}>Drop your video here or click to upload</p>
              <p style={{ color: "#4A6080", fontSize: 12, margin: 0 }}>MP4, MOV, WebM · up to 500MB</p>
            </>
          )}
        </div>

        {/* Video library */}
        {loading ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Loader2 size={28} color="#334155" style={{ animation: "spin 1s linear infinite" }} />
          </div>
        ) : videos.length === 0 ? (
          <div style={{ textAlign: "center", padding: 40 }}>
            <Video size={40} color="#1e3050" style={{ marginBottom: 12 }} />
            <p style={{ color: "#334155", fontSize: 14 }}>No videos yet — upload your first recording above</p>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 16 }}>
            {videos.map(v => (
              <div key={v.id} onClick={() => openVideo(v)} style={{
                borderRadius: 12, overflow: "hidden", cursor: "pointer",
                background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
                transition: "border-color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(167,139,250,0.3)"}
                onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(255,255,255,0.07)"}
              >
                {/* Thumbnail */}
                <div style={{ aspectRatio: "16/9", background: "#0A1020", display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  <video src={v.video_url} style={{ width: "100%", height: "100%", objectFit: "cover" }} preload="metadata" />
                  <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(0,0,0,0.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Play size={16} color="#fff" />
                    </div>
                  </div>
                  {/* Status badge */}
                  <div style={{
                    position: "absolute", top: 8, right: 8,
                    padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 700,
                    background: v.status === "ready" ? "rgba(52,211,153,0.15)" : "rgba(167,139,250,0.15)",
                    color: v.status === "ready" ? "#34d399" : "#a78bfa",
                    border: `1px solid ${v.status === "ready" ? "rgba(52,211,153,0.25)" : "rgba(167,139,250,0.25)"}`,
                  }}>
                    {v.status === "ready" ? <CheckCircle size={8} style={{ display: "inline", marginRight: 3 }} /> : <AlertCircle size={8} style={{ display: "inline", marginRight: 3 }} />}
                    {v.status === "ready" ? "Captioned" : "No captions"}
                  </div>
                </div>
                {/* Info */}
                <div style={{ padding: "10px 12px" }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: "#C8D6F0", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{v.title}</p>
                  <p style={{ fontSize: 11, color: "#4A6080", margin: 0 }}>
                    {fmtSize(v.file_size)} · {new Date(v.created_at).toLocaleDateString()}
                    {v.captions ? ` · ${v.captions.length} captions` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
