"use client";

import React, { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Mic, Play, Pause, Download, Wand2, RefreshCw,
  AlertCircle, CheckCircle2, Volume2, Clock, Film,
  Image as ImageIcon, Loader2, Video, Share2,
} from "lucide-react";

const VOICES = [
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam",     gender: "Male",   style: "Narration",     desc: "Deep, authoritative" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel",   gender: "Female", style: "Narrative",     desc: "Calm, professional" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie",  gender: "Male",   style: "Conversational",desc: "Casual, engaging" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi",     gender: "Female", style: "Strong",        desc: "Confident, bold" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam",     gender: "Male",   style: "Articulate",    desc: "Clear, precise" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh",     gender: "Male",   style: "Deep",          desc: "Warm, baritone" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli",     gender: "Female", style: "Young",         desc: "Bright, expressive" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte",gender: "Female", style: "Warm",          desc: "Friendly, approachable" },
];

const CARD: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  padding: "20px 22px",
  marginBottom: 16,
};

const LABEL: React.CSSProperties = {
  fontSize: 11, fontWeight: 700, color: "#64748b",
  textTransform: "uppercase", letterSpacing: "0.08em",
  marginBottom: 8, display: "block",
};

const SLIDER: React.CSSProperties = { width: "100%", accentColor: "#00D4FF", cursor: "pointer" };

interface Section {
  text: string;
  wordCount: number;
  prompt: string;
  imageUrl: string | null;
  imageLoaded: boolean;
  imageError: boolean;
}

function splitSections(script: string): Section[] {
  const paragraphs = script.split(/\n{2,}/).map(p => p.trim()).filter(Boolean);

  let chunks: string[];
  if (paragraphs.length >= 2) {
    // Merge short paragraphs so each chunk is ~30–80 words
    chunks = [];
    let current = "";
    for (const para of paragraphs) {
      const combined = current ? current + " " + para : para;
      const wc = combined.split(/\s+/).length;
      if (wc > 80 && current) {
        chunks.push(current);
        current = para;
      } else {
        current = combined;
      }
    }
    if (current) chunks.push(current);
  } else {
    // Single block — split by sentence groups (~40 words each)
    const sentences = script.match(/[^.!?]+[.!?]+/g) || [script];
    chunks = [];
    let current = "";
    for (const s of sentences) {
      const combined = current ? current + " " + s.trim() : s.trim();
      if (combined.split(/\s+/).length > 40 && current) {
        chunks.push(current);
        current = s.trim();
      } else {
        current = combined;
      }
    }
    if (current) chunks.push(current);
  }

  // Cap at 8 sections
  if (chunks.length > 8) {
    const merged: string[] = [];
    const perGroup = Math.ceil(chunks.length / 8);
    for (let i = 0; i < chunks.length; i += perGroup) {
      merged.push(chunks.slice(i, i + perGroup).join(" "));
    }
    chunks = merged;
  }

  return chunks.map((text, i) => ({
    text,
    wordCount: text.split(/\s+/).length,
    prompt: buildImagePrompt(text, i),
    imageUrl: null,
    imageLoaded: false,
    imageError: false,
  }));
}

function buildImagePrompt(text: string, index: number): string {
  // Extract key nouns/concepts from first 60 chars
  const snippet = text.slice(0, 120).replace(/[^a-zA-Z0-9\s,]/g, "");
  const styles = [
    "cinematic dark dramatic lighting, 16:9, ultra detailed, photorealistic",
    "cinematic wide shot, moody atmosphere, high contrast, 16:9, photorealistic",
    "dramatic close-up, deep shadows, vivid colors, cinematic 16:9",
    "aerial epic view, cinematic grade, dark atmospheric, 16:9",
  ];
  const style = styles[index % styles.length];
  return `${snippet}, ${style}`;
}

function pollinationsUrl(prompt: string): string {
  return `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1280&height=720&nologo=true&model=flux&seed=${Math.floor(Math.random() * 99999)}`;
}

export default function VoiceoverPage() {
  const router = useRouter();
  const isPro = false; // TODO: wire to real plan
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState("pNInz6obpgDQGcFmaJgB");
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [speed, setSpeed] = useState(1.0);
  const [generating, setGenerating] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Video creation state
  const [sections, setSections] = useState<Section[]>([]);
  const [preparingImages, setPreparingImages] = useState(false);
  const [imagesReady, setImagesReady] = useState(false);
  const [renderingVideo, setRenderingVideo] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [videoError, setVideoError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
  const estimatedSeconds = Math.round((wordCount / 2.5) * (1 / speed));
  const estimatedDuration =
    estimatedSeconds >= 60
      ? `${Math.floor(estimatedSeconds / 60)}m ${estimatedSeconds % 60}s`
      : `${estimatedSeconds}s`;

  async function handleGenerate() {
    if (!text.trim()) return;
    setGenerating(true);
    setError(null);
    setAudioBase64(null);
    setIsPlaying(false);
    setSections([]);
    setImagesReady(false);
    setVideoUrl(null);
    setVideoError(null);
    if (audioRef.current) { audioRef.current.pause(); audioRef.current = null; }
    try {
      const res = await fetch("/api/generate-voiceover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text, voiceId, stability, similarityBoost, speed }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to generate voiceover.");
      } else {
        setAudioBase64(data.audioBase64 || null);
        if (!data.audioBase64) setError("No audio data returned. Check your n8n workflow.");
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setGenerating(false);
    }
  }

  function handleDownloadMp3() {
    if (!audioBase64) return;
    const bytes = atob(audioBase64);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    const blob = new Blob([arr], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `townshub-voiceover-${Date.now()}.mp3`; a.click();
    URL.revokeObjectURL(url);
  }

  function togglePlay() {
    if (!audioBase64) return;
    if (!audioRef.current) {
      const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;
    }
    if (isPlaying) { audioRef.current.pause(); setIsPlaying(false); }
    else { audioRef.current.play(); setIsPlaying(true); }
  }

  // ─── VIDEO: Step 1 — prepare sections + generate images ───────────────────
  const handlePrepareVideo = useCallback(async () => {
    if (!audioBase64 || !text.trim()) return;
    setPreparingImages(true);
    setImagesReady(false);
    setVideoUrl(null);
    setVideoError(null);

    const newSections = splitSections(text);
    setSections(newSections);

    // Generate images one by one (pollinations is free but throttled)
    const loaded = [...newSections];
    for (let i = 0; i < loaded.length; i++) {
      const url = pollinationsUrl(loaded[i].prompt);
      loaded[i] = { ...loaded[i], imageUrl: url };
      setSections([...loaded]);

      await new Promise<void>(resolve => {
        const img = new window.Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          loaded[i] = { ...loaded[i], imageLoaded: true };
          setSections([...loaded]);
          resolve();
        };
        img.onerror = () => {
          loaded[i] = { ...loaded[i], imageError: true };
          setSections([...loaded]);
          resolve();
        };
        img.src = url;
        // Timeout fallback
        setTimeout(resolve, 20000);
      });
    }

    setPreparingImages(false);
    setImagesReady(true);
  }, [audioBase64, text]);

  // ─── VIDEO: Step 2 — render video using Canvas + MediaRecorder ────────────
  const handleRenderVideo = useCallback(async () => {
    if (!audioBase64 || sections.length === 0) return;
    setRenderingVideo(true);
    setRenderProgress(0);
    setVideoUrl(null);
    setVideoError(null);

    try {
      // Set up canvas
      const canvas = document.createElement("canvas");
      canvas.width = 1280;
      canvas.height = 720;
      const ctx = canvas.getContext("2d")!;
      canvasRef.current = canvas;

      // Decode audio
      const audioBin = atob(audioBase64);
      const audioBytes = new Uint8Array(audioBin.length);
      for (let i = 0; i < audioBin.length; i++) audioBytes[i] = audioBin.charCodeAt(i);
      const audioBlob = new Blob([audioBytes], { type: "audio/mpeg" });
      const audioSrc = URL.createObjectURL(audioBlob);

      // Get audio duration
      const audioEl = new Audio(audioSrc);
      audioEl.crossOrigin = "anonymous";
      const duration = await new Promise<number>((res, rej) => {
        audioEl.onloadedmetadata = () => res(audioEl.duration);
        audioEl.onerror = () => rej(new Error("Failed to load audio"));
        audioEl.load();
      });

      // Pre-load images into HTMLImageElement
      const htmlImages = await Promise.all(
        sections.map(sec => new Promise<HTMLImageElement | null>(resolve => {
          if (!sec.imageUrl) { resolve(null); return; }
          const img = new window.Image();
          img.crossOrigin = "anonymous";
          img.onload = () => resolve(img);
          img.onerror = () => resolve(null);
          img.src = sec.imageUrl!;
          setTimeout(() => resolve(null), 15000);
        }))
      );

      // Calculate per-section timings
      const totalWords = sections.reduce((s, sec) => s + sec.wordCount, 0);
      const timings = sections.map(sec => ({
        duration: (sec.wordCount / totalWords) * duration,
      }));
      let cumulative = 0;
      const starts = timings.map(t => { const s = cumulative; cumulative += t.duration; return s; });

      // Set up MediaStream combining canvas + audio
      const audioCtx = new AudioContext();
      const source = audioCtx.createMediaElementSource(audioEl);
      const audioDest = audioCtx.createMediaStreamDestination();
      source.connect(audioDest);
      source.connect(audioCtx.destination);

      const canvasStream = canvas.captureStream(25);
      const combinedStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...audioDest.stream.getAudioTracks(),
      ]);

      const mimeType = MediaRecorder.isTypeSupported("video/mp4;codecs=h264,aac")
        ? "video/mp4;codecs=h264,aac"
        : MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : "video/webm";

      const recorder = new MediaRecorder(combinedStream, { mimeType, videoBitsPerSecond: 4_000_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      const renderDone = new Promise<string>(resolve => {
        recorder.onstop = () => {
          const finalBlob = new Blob(chunks, { type: mimeType.split(";")[0] });
          const url = URL.createObjectURL(finalBlob);
          resolve(url);
        };
      });

      recorder.start(200); // collect data every 200ms
      audioEl.play();

      // ── Animation loop ──
      const renderStart = performance.now();
      function drawFrame() {
        const elapsed = (performance.now() - renderStart) / 1000;
        setRenderProgress(Math.min(99, (elapsed / duration) * 100));

        // Find current section index
        let idx = 0;
        for (let i = starts.length - 1; i >= 0; i--) {
          if (elapsed >= starts[i]) { idx = i; break; }
        }

        const img = htmlImages[idx];
        if (img) {
          // Cover-fit image
          const scale = Math.max(1280 / img.naturalWidth, 720 / img.naturalHeight);
          const sw = img.naturalWidth * scale;
          const sh = img.naturalHeight * scale;
          ctx.drawImage(img, (1280 - sw) / 2, (720 - sh) / 2, sw, sh);
        } else {
          // Fallback: gradient background
          const grad = ctx.createLinearGradient(0, 0, 1280, 720);
          grad.addColorStop(0, "#0B1F4A");
          grad.addColorStop(1, "#080D1A");
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, 1280, 720);
        }

        // Subtle section label overlay (bottom left)
        const sec = sections[idx];
        if (sec) {
          ctx.fillStyle = "rgba(0,0,0,0.4)";
          ctx.fillRect(0, 640, 1280, 80);
          ctx.font = "bold 22px sans-serif";
          ctx.fillStyle = "rgba(255,255,255,0.85)";
          const label = sec.text.slice(0, 100) + (sec.text.length > 100 ? "…" : "");
          ctx.fillText(label, 32, 690);
        }

        if (elapsed < duration + 0.3) {
          requestAnimationFrame(drawFrame);
        } else {
          recorder.stop();
          audioEl.pause();
          setRenderProgress(100);
        }
      }

      requestAnimationFrame(drawFrame);

      const resultUrl = await renderDone;
      URL.revokeObjectURL(audioSrc);
      setVideoUrl(resultUrl);
    } catch (e: unknown) {
      setVideoError(e instanceof Error ? e.message : "Video rendering failed");
    } finally {
      setRenderingVideo(false);
    }
  }, [audioBase64, sections]);

  function handleDownloadVideo() {
    if (!videoUrl) return;
    const a = document.createElement("a");
    a.href = videoUrl;
    a.download = `townshub-video-${Date.now()}.webm`;
    a.click();
  }

  const loadedCount = sections.filter(s => s.imageLoaded || s.imageError).length;

  async function handlePublishToSocial() {
    if (!videoUrl) return;
    // If it's a blob URL we need to upload to Supabase first
    if (videoUrl.startsWith("blob:")) {
      try {
        const blobRes = await fetch(videoUrl);
        const blob = await blobRes.blob();
        const file = new File([blob], `video-${Date.now()}.webm`, { type: "video/webm" });
        const fd = new FormData();
        fd.append("video", file);
        const up = await fetch("/api/upload-video", { method: "POST", body: fd });
        const upData = await up.json();
        if (upData.url) {
          router.push(`/dashboard/publish?videoUrl=${encodeURIComponent(upData.url)}`);
          return;
        }
      } catch { /* fall through */ }
    }
    router.push(`/dashboard/publish?videoUrl=${encodeURIComponent(videoUrl)}`);
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
      `}</style>
      <Topbar title="AI Voiceover Studio" subtitle="Generate professional voiceovers and sync videos from your scripts" />

      <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* ── LEFT PANEL ── */}
        <div style={{ flex: 1, minWidth: 320 }}>

          {/* Script */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mic size={15} color="#00D4FF" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Script Text</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#00D4FF", background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)", borderRadius: 6, padding: "2px 10px" }}>
                  {wordCount} words
                </span>
                {wordCount > 0 && (
                  <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)", borderRadius: 6, padding: "2px 10px", display: "flex", alignItems: "center", gap: 4 }}>
                    <Clock size={10} />~{estimatedDuration}
                  </span>
                )}
              </div>
            </div>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Paste your script here…"
              style={{
                width: "100%", minHeight: 200, background: "rgba(0,0,0,0.3)",
                border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10,
                color: "#e2e8f0", fontSize: 14, lineHeight: 1.6,
                padding: "14px 16px", resize: "vertical", outline: "none",
                fontFamily: "inherit", boxSizing: "border-box",
              }}
            />
          </div>

          {/* Voice Selector */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Volume2 size={15} color="#00D4FF" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Choose Voice</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {VOICES.map(v => (
                <button key={v.id} onClick={() => setVoiceId(v.id)} style={{
                  background: voiceId === v.id ? "rgba(0,212,255,0.08)" : "rgba(0,0,0,0.2)",
                  border: voiceId === v.id ? "1px solid rgba(0,212,255,0.5)" : "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 10, padding: "12px 14px", cursor: "pointer", textAlign: "left", transition: "all 0.15s",
                }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: voiceId === v.id ? "#00D4FF" : "#e2e8f0" }}>{v.name}</span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "1px 7px",
                      background: v.gender === "Male" ? "rgba(59,130,246,0.15)" : "rgba(236,72,153,0.15)",
                      color: v.gender === "Male" ? "#60a5fa" : "#f472b6",
                      border: v.gender === "Male" ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(236,72,153,0.3)",
                    }}>{v.gender === "Male" ? "M" : "F"}</span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 2 }}>{v.style}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{v.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Settings */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <Volume2 size={15} color="#00D4FF" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Audio Settings</span>
            </div>
            {[
              { label: "Stability", value: stability, set: setStability, min: 0, max: 1, step: 0.05, fmt: (v: number) => v.toFixed(2), hint: "More stable = consistent tone. Lower = more expressive." },
              { label: "Clarity", value: similarityBoost, set: setSimilarityBoost, min: 0, max: 1, step: 0.05, fmt: (v: number) => v.toFixed(2), hint: "Higher = closer to original voice." },
              { label: "Speed", value: speed, set: setSpeed, min: 0.5, max: 2.0, step: 0.1, fmt: (v: number) => `${v.toFixed(1)}x`, hint: "1.0 is natural speed." },
            ].map(s => (
              <div key={s.label} style={{ marginBottom: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                  <label style={{ ...LABEL, marginBottom: 0 }}>{s.label}</label>
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#00D4FF" }}>{s.fmt(s.value)}</span>
                </div>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  onChange={e => s.set(Number(e.target.value))} style={SLIDER} />
                <p style={{ fontSize: 11, color: "#64748b", margin: "6px 0 0" }}>{s.hint}</p>
              </div>
            ))}
          </div>

          {/* ── VIDEO SECTIONS PREVIEW ── */}
          {sections.length > 0 && (
            <div style={CARD}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <Film size={15} color="#a855f7" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Video Sections</span>
                <span style={{ marginLeft: "auto", fontSize: 11, color: "#64748b" }}>
                  {loadedCount}/{sections.length} images ready
                </span>
              </div>
              {/* Progress bar */}
              {preparingImages && (
                <div style={{ marginBottom: 14 }}>
                  <div style={{ height: 4, borderRadius: 99, background: "rgba(168,85,247,0.1)", overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      background: "linear-gradient(90deg, #a855f7, #7c3aed)",
                      width: `${(loadedCount / sections.length) * 100}%`,
                      transition: "width 0.4s ease",
                    }} />
                  </div>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>
                    Generating AI images… {loadedCount} of {sections.length}
                  </p>
                </div>
              )}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {sections.map((sec, i) => (
                  <div key={i} style={{
                    display: "flex", gap: 12, alignItems: "center",
                    background: "rgba(0,0,0,0.25)", borderRadius: 10,
                    border: "1px solid rgba(255,255,255,0.05)", padding: "10px 12px",
                  }}>
                    {/* Thumbnail */}
                    <div style={{
                      width: 80, height: 45, borderRadius: 6, flexShrink: 0,
                      background: "rgba(168,85,247,0.08)",
                      border: "1px solid rgba(168,85,247,0.2)",
                      overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center",
                    }}>
                      {sec.imageLoaded && sec.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={sec.imageUrl} alt={`Section ${i + 1}`}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : sec.imageError ? (
                        <ImageIcon size={14} color="#64748b" />
                      ) : sec.imageUrl ? (
                        <div style={{ width: 16, height: 16, borderRadius: "50%", border: "2px solid rgba(168,85,247,0.3)", borderTopColor: "#a855f7", animation: "spin 0.8s linear infinite" }} />
                      ) : (
                        <ImageIcon size={14} color="#334155" />
                      )}
                    </div>
                    {/* Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 11, fontWeight: 700, color: "#a855f7", marginBottom: 2 }}>
                        Scene {i + 1} · {sec.wordCount} words
                      </div>
                      <div style={{ fontSize: 11, color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {sec.text.slice(0, 80)}{sec.text.length > 80 ? "…" : ""}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ width: 320, flexShrink: 0 }}>

          {/* Generate Button */}
          <div style={{ position: "relative", marginBottom: 16 }}>
            {isPro && !generating && (
              <span style={{
                position: "absolute", top: -8, right: 10, zIndex: 1,
                fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                padding: "2px 7px", borderRadius: 99,
                background: "linear-gradient(135deg, #facc15, #f59e0b)",
                color: "#1a0a00", boxShadow: "0 2px 8px rgba(250,204,21,0.4)",
              }}>Priority</span>
            )}
            <button onClick={handleGenerate} disabled={!text.trim() || generating} style={{
              width: "100%", padding: "14px 20px",
              background: (!text.trim() || generating) ? "rgba(0,212,255,0.15)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
              border: "none", borderRadius: 12, cursor: (!text.trim() || generating) ? "not-allowed" : "pointer",
              color: (!text.trim() || generating) ? "rgba(0,212,255,0.5)" : "#04080F",
              fontSize: 14, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: (!text.trim() || generating) ? "none" : "0 0 20px rgba(0,212,255,0.3)",
              transition: "all 0.2s",
            }}>
              <Wand2 size={16} />
              {generating ? "Generating…" : "Generate Voiceover"}
            </button>
          </div>

          {/* Spinner */}
          {generating && (
            <div style={{ ...CARD, textAlign: "center", padding: "28px 22px" }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", border: "3px solid rgba(0,212,255,0.15)", borderTopColor: "#00D4FF", animation: "spin 0.8s linear infinite", margin: "0 auto 16px" }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>Generating voiceover…</div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Usually 5–15 seconds</div>
            </div>
          )}

          {/* Audio Player */}
          {audioBase64 && !generating && (
            <div style={CARD}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <CheckCircle2 size={15} color="#22c55e" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Voiceover Ready</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <button onClick={togglePlay} style={{
                  width: 64, height: 64, borderRadius: "50%",
                  background: "linear-gradient(135deg, #00D4FF, #0080cc)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 0 24px rgba(0,212,255,0.35)", transition: "all 0.2s",
                }}>
                  {isPlaying ? <Pause size={24} color="#04080F" /> : <Play size={24} color="#04080F" />}
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                  <Clock size={12} /><span>~{estimatedDuration}</span>
                </div>
              </div>
              <button onClick={handleDownloadMp3} style={{
                width: "100%", padding: "10px 16px",
                background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)",
                borderRadius: 10, cursor: "pointer", color: "#00D4FF", fontSize: 13, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                marginBottom: 10, transition: "all 0.15s",
              }}>
                <Download size={14} />Download MP3
              </button>
              <button onClick={handleGenerate} style={{
                width: "100%", padding: "8px 16px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 10, cursor: "pointer", color: "#94a3b8", fontSize: 12, fontWeight: 600,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6, transition: "all 0.15s",
              }}>
                <RefreshCw size={12} />Regenerate
              </button>
            </div>
          )}

          {/* Error */}
          {error && !generating && (
            <div style={{ ...CARD, border: "1px solid rgba(239,68,68,0.3)", background: "rgba(239,68,68,0.06)" }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>Error</div>
                  <div style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.5 }}>{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* ── CREATE VIDEO CARD ── */}
          {audioBase64 && !generating && (
            <div style={{
              ...CARD,
              border: "1px solid rgba(168,85,247,0.2)",
              background: "linear-gradient(135deg, rgba(168,85,247,0.06), rgba(8,13,26,0.98))",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                <Film size={15} color="#a855f7" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Create Video</span>
                <span style={{
                  fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", color: "#a855f7",
                  background: "rgba(168,85,247,0.12)", border: "1px solid rgba(168,85,247,0.25)",
                  borderRadius: 4, padding: "1px 6px", marginLeft: 4,
                }}>NEW</span>
              </div>
              <p style={{ fontSize: 12, color: "#64748b", lineHeight: 1.5, marginBottom: 16 }}>
                Sync your voiceover with AI-generated images to produce a ready-to-upload video.
              </p>

              {/* Step 1 button */}
              {!imagesReady && (
                <button
                  onClick={handlePrepareVideo}
                  disabled={preparingImages}
                  style={{
                    width: "100%", padding: "11px 16px",
                    background: preparingImages ? "rgba(168,85,247,0.1)" : "linear-gradient(135deg, #a855f7, #7c3aed)",
                    border: preparingImages ? "1px solid rgba(168,85,247,0.2)" : "none",
                    borderRadius: 10, cursor: preparingImages ? "not-allowed" : "pointer",
                    color: preparingImages ? "rgba(168,85,247,0.5)" : "#fff",
                    fontSize: 13, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    transition: "all 0.2s",
                    boxShadow: preparingImages ? "none" : "0 0 16px rgba(168,85,247,0.3)",
                  }}
                >
                  {preparingImages ? (
                    <><Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />Generating images…</>
                  ) : (
                    <><ImageIcon size={14} />Generate Scene Images</>
                  )}
                </button>
              )}

              {/* Step 2 — render */}
              {imagesReady && !videoUrl && (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "8px 12px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8 }}>
                    <CheckCircle2 size={13} color="#22c55e" />
                    <span style={{ fontSize: 12, color: "#86efac" }}>{sections.length} scenes ready</span>
                  </div>
                  <button
                    onClick={handleRenderVideo}
                    disabled={renderingVideo}
                    style={{
                      width: "100%", padding: "11px 16px",
                      background: renderingVideo ? "rgba(168,85,247,0.1)" : "linear-gradient(135deg, #a855f7, #7c3aed)",
                      border: renderingVideo ? "1px solid rgba(168,85,247,0.2)" : "none",
                      borderRadius: 10, cursor: renderingVideo ? "not-allowed" : "pointer",
                      color: renderingVideo ? "rgba(168,85,247,0.5)" : "#fff",
                      fontSize: 13, fontWeight: 700,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      marginBottom: renderingVideo ? 12 : 0,
                      transition: "all 0.2s",
                      boxShadow: renderingVideo ? "none" : "0 0 16px rgba(168,85,247,0.3)",
                    }}
                  >
                    {renderingVideo ? (
                      <><Loader2 size={14} style={{ animation: "spin 0.8s linear infinite" }} />Rendering…</>
                    ) : (
                      <><Video size={14} />Render Video</>
                    )}
                  </button>

                  {/* Render progress */}
                  {renderingVideo && (
                    <div>
                      <div style={{ height: 4, borderRadius: 99, background: "rgba(168,85,247,0.1)", overflow: "hidden" }}>
                        <div style={{
                          height: "100%", borderRadius: 99,
                          background: "linear-gradient(90deg, #a855f7, #7c3aed)",
                          width: `${renderProgress}%`, transition: "width 0.3s ease",
                        }} />
                      </div>
                      <p style={{ fontSize: 11, color: "#64748b", marginTop: 6 }}>
                        {renderProgress < 100 ? `Rendering… ${Math.round(renderProgress)}%` : "Finalizing…"}
                      </p>
                      <p style={{ fontSize: 10, color: "#475569", marginTop: 4, lineHeight: 1.5 }}>
                        Keep this tab open. Audio is playing in real-time to record.
                      </p>
                    </div>
                  )}
                </>
              )}

              {/* Video ready */}
              {videoUrl && (
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 12, padding: "8px 12px", background: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)", borderRadius: 8 }}>
                    <CheckCircle2 size={13} color="#22c55e" />
                    <span style={{ fontSize: 12, color: "#86efac" }}>Video rendered!</span>
                  </div>
                  {/* Mini preview */}
                  <video src={videoUrl} controls style={{ width: "100%", borderRadius: 8, marginBottom: 10, background: "#000" }} />
                  <button onClick={handleDownloadVideo} style={{
                    width: "100%", padding: "10px 16px",
                    background: "linear-gradient(135deg, #a855f7, #7c3aed)",
                    border: "none", borderRadius: 10, cursor: "pointer",
                    color: "#fff", fontSize: 13, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginBottom: 8,
                    boxShadow: "0 0 16px rgba(168,85,247,0.3)",
                  }}>
                    <Download size={14} />Download Video
                  </button>
                  <button onClick={handlePublishToSocial} style={{
                    width: "100%", padding: "10px 16px",
                    background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.25)",
                    borderRadius: 10, cursor: "pointer",
                    color: "#00D4FF", fontSize: 13, fontWeight: 700,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginBottom: 8, transition: "all 0.15s",
                  }}>
                    <Share2 size={14} />Publish to Social
                  </button>
                  <button
                    onClick={() => { setVideoUrl(null); setImagesReady(false); setSections([]); }}
                    style={{
                      width: "100%", padding: "8px 16px",
                      background: "transparent", border: "1px solid rgba(255,255,255,0.08)",
                      borderRadius: 10, cursor: "pointer", color: "#94a3b8", fontSize: 12, fontWeight: 600,
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                    }}
                  >
                    <RefreshCw size={12} />Start Over
                  </button>
                </div>
              )}

              {/* Video error */}
              {videoError && (
                <div style={{ marginTop: 10, padding: "10px 12px", background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: 8 }}>
                  <div style={{ fontSize: 12, color: "#fca5a5" }}>{videoError}</div>
                </div>
              )}
            </div>
          )}

          {/* How it works */}
          <div style={CARD}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Mic size={14} color="#00D4FF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>How it works</span>
            </div>
            {[
              { n: 1, text: "Paste your script and choose a voice" },
              { n: 2, text: "Click Generate to create the voiceover MP3" },
              { n: 3, text: "Click Generate Scene Images to create visuals" },
              { n: 4, text: "Click Render Video to produce a synced MP4/WebM" },
            ].map(s => (
              <div key={s.n} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "#00D4FF",
                }}>{s.n}</div>
                <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, paddingTop: 2 }}>{s.text}</span>
              </div>
            ))}
          </div>

          <div style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 10, padding: "12px 16px" }}>
            <p style={{ fontSize: 11, color: "#fbbf24", margin: 0, lineHeight: 1.5 }}>
              Voiceover powered by ElevenLabs. Video images generated by Pollinations.ai (free). Rendering happens in your browser — keep the tab active.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
