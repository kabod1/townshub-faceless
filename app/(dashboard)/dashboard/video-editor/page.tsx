"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Plus, ChevronUp, ChevronDown, Sparkles,
  Search, Film, Mic, Download, Wand2, X, Check,
  Sliders, Type, Image as ImageIcon, Layers,
  Play, Pause, Code2,
} from "lucide-react";
import { buildHyperFramesComposition } from "@/lib/hyperframes/composition-builder";

type Transition = "fade" | "cut" | "slide" | "zoom";
type RightTab = "properties" | "overlay" | "audio";
type AiTab = "generate" | "stock";

interface TextOverlay { text: string; position: "top" | "center" | "bottom"; color: string; }
interface StockVideo { id: number; url: string; thumb: string; duration: number; author: string; }
interface Scene {
  id: string;
  title: string;
  imageUrl: string;
  videoUrl: string;
  videoThumb: string;
  prompt: string;
  script: string;
  duration: number;
  transition: Transition;
  audioUrl: string;
  textOverlay: TextOverlay;
}

let _counter = 1;
function mkId() { return `s${_counter++}_${Math.random().toString(36).slice(2, 6)}`; }

function blankScene(index: number): Scene {
  return {
    id: mkId(),
    title: `Scene ${index}`,
    imageUrl: "", videoUrl: "", videoThumb: "",
    prompt: "", script: "",
    duration: 5,
    transition: "fade",
    audioUrl: "",
    textOverlay: { text: "", position: "bottom", color: "#ffffff" },
  };
}

export default function VideoEditorPage() {
  const router = useRouter();
  const [scenes, setScenes] = useState<Scene[]>([blankScene(1)]);
  const [activeId, setActiveId] = useState<string>(scenes[0].id);
  const [projectName, setProjectName] = useState("Untitled Video");
  const [aiTab, setAiTab] = useState<AiTab>("generate");
  const [rightTab, setRightTab] = useState<RightTab>("properties");
  const [stockResults, setStockResults] = useState<StockVideo[]>([]);
  const [stockQuery, setStockQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [generatingPrompt, setGeneratingPrompt] = useState(false);
  const [planning, setPlanning] = useState(false);
  const [planTopic, setPlanTopic] = useState("");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const [showPreview, setShowPreview]       = useState(false);
  const [previewTime, setPreviewTime]       = useState(0);
  const [previewPlaying, setPreviewPlaying] = useState(false);
  const previewTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Render states
  const [showRender, setShowRender]         = useState(false);
  const [rendering, setRendering]           = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);
  const [renderDone, setRenderDone]         = useState(false);
  const [renderedBlob, setRenderedBlob]     = useState<Blob | null>(null);
  const [renderExt, setRenderExt]           = useState("webm");
  const [renderError, setRenderError]       = useState("");
  const [uploadingToCloud, setUploadingToCloud] = useState(false);
  const [uploadPlatform, setUploadPlatform]     = useState("");
  // "landscape" = 1280×720 (YouTube/Facebook/X)
  // "portrait"  = 720×1280 (TikTok/Instagram Reels)
  // "square"    = 720×720  (Instagram Feed)
  const [renderFormat, setRenderFormat] = useState<"landscape"|"portrait"|"square">("landscape");

  const active = scenes.find(s => s.id === activeId) ?? null;
  const totalSec = scenes.reduce((a, s) => a + s.duration, 0);
  const totalTime = `${Math.floor(totalSec / 60)}:${String(totalSec % 60).padStart(2, "0")}`;

  function upd(id: string, patch: Partial<Scene>) {
    setScenes(p => p.map(s => s.id === id ? { ...s, ...patch } : s));
  }

  function addScene() {
    const s = blankScene(scenes.length + 1);
    setScenes(p => [...p, s]);
    setActiveId(s.id);
  }

  function deleteScene(id: string) {
    const next = scenes.filter(s => s.id !== id);
    if (next.length === 0) {
      const s = blankScene(1);
      setScenes([s]);
      setActiveId(s.id);
    } else {
      setScenes(next);
      if (activeId === id) setActiveId(next[0].id);
    }
  }

  function move(id: string, dir: -1 | 1) {
    setScenes(p => {
      const i = p.findIndex(s => s.id === id);
      const j = i + dir;
      if (j < 0 || j >= p.length) return p;
      const n = [...p];
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
  }

  async function generateImage() {
    if (!active?.prompt.trim()) return;
    setGenerating(true);
    setGenerateError(null);
    try {
      const res = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: active.prompt, width: 1280, height: 720 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Image generation failed");
      if (!data.url) throw new Error("No image returned");

      // Wait for image to fully load (Pollinations generates on-demand — URL exists before image is ready)
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        const timer = setTimeout(() => reject(new Error("Image timed out — try again")), 60000);
        img.onload = () => { clearTimeout(timer); resolve(); };
        img.onerror = () => { clearTimeout(timer); reject(new Error("Image failed to load")); };
        img.src = data.url;
      });

      upd(active.id, { imageUrl: data.url, videoUrl: "", videoThumb: "" });
    } catch (err: unknown) {
      setGenerateError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }

  async function generatePromptFromScript() {
    if (!active?.script.trim()) return;
    setGeneratingPrompt(true);
    try {
      const res = await fetch("/api/video-editor/generate-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ script: active.script }),
      });
      const data = await res.json();
      if (data.prompt) upd(active.id, { prompt: data.prompt });
    } finally {
      setGeneratingPrompt(false);
    }
  }

  async function searchFootage() {
    if (!stockQuery.trim()) return;
    setSearching(true);
    try {
      const res = await fetch("/api/video-editor/search-footage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: stockQuery }),
      });
      const data = await res.json();
      setStockResults(data.videos ?? []);
    } finally {
      setSearching(false);
    }
  }

  async function planScenes() {
    if (!planTopic.trim()) return;
    setPlanning(true);
    try {
      const res = await fetch("/api/video-editor/plan-scenes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: planTopic }),
      });
      const data = await res.json();
      if (Array.isArray(data.scenes) && data.scenes.length > 0) {
        const built: Scene[] = data.scenes.map((s: { title?: string; script?: string; prompt?: string }, i: number) => ({
          ...blankScene(i + 1),
          title: s.title ?? `Scene ${i + 1}`,
          script: s.script ?? "",
          prompt: s.prompt ?? "",
        }));
        setScenes(built);
        setActiveId(built[0].id);
        setProjectName(planTopic);
        setShowPlanModal(false);
        setPlanTopic("");
      }
    } finally {
      setPlanning(false);
    }
  }

  function exportProject() {
    const blob = new Blob([JSON.stringify({ projectName, scenes }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.townshub.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function exportHyperFrames() {
    const html = buildHyperFramesComposition(scenes, projectName);
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.hyperframes.html`;
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handlePublishTo(platformId?: string) {
    if (!renderedBlob) return;
    setUploadingToCloud(true);
    setUploadPlatform(platformId ?? "");
    try {
      const form = new FormData();
      const ext = renderExt;
      form.append("video", new File([renderedBlob], `${projectName}.${ext}`, { type: renderedBlob.type }));
      const res = await fetch("/api/upload-video", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Upload failed");
      const params = new URLSearchParams({ videoUrl: data.url, title: projectName, format: renderFormat });
      if (platformId) params.set("platform", platformId);
      router.push(`/dashboard/publish?${params.toString()}`);
    } catch (err) {
      setRenderError(err instanceof Error ? err.message : "Upload to cloud failed");
    } finally {
      setUploadingToCloud(false);
      setUploadPlatform("");
    }
  }

  function openRenderModal() {
    setShowRender(true);
    setRendering(false);
    setRenderDone(false);
    setRenderedBlob(null);
    setRenderError("");
    setRenderProgress(0);
  }

  async function renderVideo() {
    setRendering(true);
    setRenderProgress(0);
    setRenderDone(false);
    setRenderedBlob(null);
    setRenderError("");

    try {
      const W = renderFormat === "landscape" ? 1280 : 720;
      const H = renderFormat === "landscape" ? 720 : renderFormat === "portrait" ? 1280 : 720;
      const FPS = 30;
      const FADE_F = Math.round(FPS * 0.5);

      const canvas = document.createElement("canvas");
      canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d")!;

      // Pick best supported format
      const mime =
        MediaRecorder.isTypeSupported("video/mp4")          ? "video/mp4" :
        MediaRecorder.isTypeSupported("video/webm;codecs=vp9") ? "video/webm;codecs=vp9" :
        "video/webm";
      const ext = mime.startsWith("video/mp4") ? "mp4" : "webm";
      setRenderExt(ext);

      const stream = canvas.captureStream(FPS);
      const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: 8_000_000 });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };
      recorder.start(100);

      // Pre-load images
      const loadImg = (url: string): Promise<HTMLImageElement | null> => {
        if (!url) return Promise.resolve(null);
        return new Promise(res => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => res(img);
          img.onerror = () => res(null);
          img.src = url;
        });
      };
      const imgs = await Promise.all(scenes.map(sc => loadImg(sc.imageUrl || sc.videoThumb)));

      // Cover-fit draw helper
      const drawImg = (img: HTMLImageElement, alpha: number, offsetX = 0) => {
        ctx.globalAlpha = alpha;
        const scale = Math.max(W / img.width, H / img.height);
        const sw = img.width * scale, sh = img.height * scale;
        ctx.drawImage(img, (W - sw) / 2 + offsetX, (H - sh) / 2, sw, sh);
      };

      const COLORS = ["#0f172a","#1e1b4b","#172554","#14532d","#1c1917"];
      const drawPlaceholder = (idx: number, alpha: number, offsetX = 0) => {
        ctx.globalAlpha = alpha;
        ctx.fillStyle = COLORS[idx % COLORS.length];
        ctx.fillRect(offsetX, 0, W, H);
      };

      const drawMedia = (scIdx: number, alpha: number, offsetX = 0) => {
        const img = imgs[scIdx];
        if (img) drawImg(img, alpha, offsetX);
        else drawPlaceholder(scIdx, alpha, offsetX);
      };

      const drawTextOverlay = (sc: Scene, alpha: number) => {
        if (!sc.textOverlay?.text) return;
        ctx.globalAlpha = alpha;
        ctx.font = "bold 52px Inter, Arial, sans-serif";
        ctx.textAlign = "center";
        ctx.shadowColor = "rgba(0,0,0,0.9)";
        ctx.shadowBlur = 18;
        ctx.fillStyle = sc.textOverlay.color;
        const y = sc.textOverlay.position === "top" ? H * 0.12
          : sc.textOverlay.position === "center" ? H * 0.5
          : H * 0.88;
        ctx.fillText(sc.textOverlay.text, W / 2, y, W - 120);
        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1;
      };

      const totalFrames = scenes.reduce((a, s) => a + Math.round(s.duration * FPS), 0);
      let done = 0;

      for (let i = 0; i < scenes.length; i++) {
        const sc = scenes[i];
        const scFrames = Math.round(sc.duration * FPS);
        const tr = sc.transition;
        const hasNext = i < scenes.length - 1;

        for (let f = 0; f < scFrames; f++) {
          ctx.clearRect(0, 0, W, H);
          const inFade  = i === 0 && f < FADE_F;
          const outFade = hasNext && f >= scFrames - FADE_F;

          if (inFade) {
            const a = f / FADE_F;
            drawMedia(i, a);
            drawTextOverlay(sc, a);
          } else if (outFade) {
            const p = (scFrames - f) / FADE_F; // 1→0
            if (tr === "cut") {
              // Hard cut at the exact boundary frame
              if (f === scFrames - 1) { drawMedia(i + 1, 1); }
              else { drawMedia(i, 1); drawTextOverlay(sc, 1); }
            } else if (tr === "fade") {
              drawMedia(i + 1, 1 - p);
              drawMedia(i,     p);
              drawTextOverlay(sc, p);
            } else if (tr === "slide") {
              const off = Math.round((1 - p) * W);
              drawMedia(i,     1, -off);
              drawMedia(i + 1, 1,  W - off);
            } else if (tr === "zoom") {
              drawMedia(i + 1, 1 - p);
              ctx.save();
              ctx.translate(W / 2, H / 2);
              ctx.scale(1 + (1 - p) * 0.08, 1 + (1 - p) * 0.08);
              ctx.translate(-W / 2, -H / 2);
              drawMedia(i, p);
              ctx.restore();
              drawTextOverlay(sc, p);
            }
          } else {
            drawMedia(i, 1);
            drawTextOverlay(sc, 1);
          }

          ctx.globalAlpha = 1;
          done++;
          if (done % 10 === 0) setRenderProgress(Math.round((done / totalFrames) * 100));
          await new Promise(r => setTimeout(r, 1000 / FPS));
        }
      }

      recorder.stop();
      await new Promise<void>(r => { recorder.onstop = () => r(); });
      const blob = new Blob(chunks, { type: mime });
      setRenderedBlob(blob);
      setRenderDone(true);
    } catch (err) {
      console.error("Render error:", err);
      setRenderError("Render failed. Please try again in Chrome or Edge.");
    } finally {
      setRendering(false);
      setRenderProgress(100);
    }
  }

  function downloadRender() {
    if (!renderedBlob) return;
    const url = URL.createObjectURL(renderedBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${projectName.replace(/\s+/g, "-").toLowerCase()}.${renderExt}`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function openPreview() {
    setPreviewTime(0);
    setPreviewPlaying(true);
    setShowPreview(true);
  }

  useEffect(() => {
    if (!showPreview) {
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
      setPreviewPlaying(false);
      return;
    }
    if (previewPlaying) {
      previewTimerRef.current = setInterval(() => {
        setPreviewTime(t => {
          if (t >= totalSec) { setPreviewPlaying(false); return totalSec; }
          return t + 0.1;
        });
      }, 100);
    } else {
      if (previewTimerRef.current) clearInterval(previewTimerRef.current);
    }
    return () => { if (previewTimerRef.current) clearInterval(previewTimerRef.current); };
  }, [previewPlaying, showPreview, totalSec]);

  const sceneReadiness = active ? [
    { label: "Visual",   ok: !!(active.imageUrl || active.videoUrl) },
    { label: "Script",   ok: active.script.trim().length > 0 },
    { label: "Audio",    ok: active.audioUrl.trim().length > 0 },
    { label: "Overlay",  ok: active.textOverlay.text.trim().length > 0 },
  ] : [];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh", background: "#070C18", color: "#e2e8f0", overflow: "hidden" }}>

      {/* ── Topbar ─────────────────────────────────────────── */}
      <div style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "0 20px", height: 56, flexShrink: 0,
        background: "#060B17", borderBottom: "1px solid rgba(255,255,255,0.05)",
      }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <input
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
            style={{
              background: "transparent", border: "none", outline: "none",
              color: "#fff", fontSize: 15, fontWeight: 800, letterSpacing: "-0.3px",
              width: "100%", maxWidth: 340,
            }}
          />
          <p style={{ fontSize: 10, color: "#334155", margin: 0 }}>AI Video Editor · {scenes.length} scenes · {totalTime}</p>
        </div>
        <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
          <button
            onClick={() => setShowPlanModal(true)}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 9, border: "none",
              background: "linear-gradient(135deg, #a78bfa, #7c3aed)",
              color: "#fff", fontSize: 12, fontWeight: 800, cursor: "pointer",
            }}
          >
            <Sparkles size={13} /> AI Scene Planner
          </button>
          <button
            onClick={openPreview}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 9, border: "none",
              background: "linear-gradient(135deg, #00D4FF, #0080cc)",
              color: "#04080F", fontSize: 12, fontWeight: 800, cursor: "pointer",
            }}
          >
            <Play size={12} /> Preview
          </button>
          <button
            onClick={openRenderModal}
            disabled={rendering}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 9, border: "none",
              background: rendering
                ? "rgba(255,255,255,0.06)"
                : "linear-gradient(135deg, #f97316, #dc2626)",
              color: rendering ? "#475569" : "#fff",
              fontSize: 12, fontWeight: 800, cursor: rendering ? "default" : "pointer",
              opacity: rendering ? 0.7 : 1,
            }}
          >
            <Film size={12} /> {rendering ? `Rendering ${renderProgress}%` : "Render Video"}
          </button>
          <button
            onClick={exportHyperFrames}
            title="Download as HyperFrames HTML — render to MP4 with: npx hyperframes render"
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 9,
              border: "1px solid rgba(34,211,153,0.25)",
              background: "rgba(34,211,153,0.06)", color: "#34d399",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            <Code2 size={13} /> HyperFrames
          </button>
          <button
            onClick={exportProject}
            style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "7px 14px", borderRadius: 9,
              border: "1px solid rgba(255,255,255,0.1)",
              background: "rgba(255,255,255,0.04)", color: "#94a3b8",
              fontSize: 12, fontWeight: 700, cursor: "pointer",
            }}
          >
            <Download size={13} /> JSON
          </button>
        </div>
      </div>

      {/* ── Main 3-column area ──────────────────────────────── */}
      <div style={{ flex: 1, display: "flex", overflow: "hidden", minHeight: 0 }}>

        {/* LEFT: Scene list */}
        <div style={{
          width: 216, flexShrink: 0,
          background: "#060B17", borderRight: "1px solid rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{
            padding: "10px 10px 8px",
            borderBottom: "1px solid rgba(255,255,255,0.05)",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <span style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", letterSpacing: "0.14em", textTransform: "uppercase" }}>
              Scenes ({scenes.length})
            </span>
            <button
              onClick={addScene}
              style={{
                display: "flex", alignItems: "center", gap: 4,
                padding: "4px 9px", borderRadius: 6, border: "none",
                background: "rgba(0,212,255,0.1)", color: "#00D4FF",
                fontSize: 11, fontWeight: 800, cursor: "pointer",
              }}
            >
              <Plus size={11} /> Add
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "8px" }}>
            {scenes.map((sc, idx) => {
              const isActive = sc.id === activeId;
              const hasVisual = !!(sc.imageUrl || sc.videoThumb);
              return (
                <div
                  key={sc.id}
                  onClick={() => setActiveId(sc.id)}
                  style={{
                    marginBottom: 6, borderRadius: 10, overflow: "hidden",
                    border: isActive ? "1.5px solid rgba(0,212,255,0.45)" : "1px solid rgba(255,255,255,0.06)",
                    cursor: "pointer",
                    background: isActive ? "rgba(0,212,255,0.05)" : "#0A1020",
                    transition: "all 0.12s",
                  }}
                >
                  {/* Thumbnail strip */}
                  <div style={{
                    width: "100%", aspectRatio: "16/9",
                    background: hasVisual ? "transparent" : "#0E1828",
                    backgroundImage: hasVisual ? `url(${sc.imageUrl || sc.videoThumb})` : "none",
                    backgroundSize: "cover", backgroundPosition: "center",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    position: "relative",
                  }}>
                    {!hasVisual && <ImageIcon size={18} color="#1e3050" />}
                    <div style={{
                      position: "absolute", top: 4, left: 4,
                      background: isActive ? "#00D4FF" : "rgba(0,0,0,0.55)",
                      color: isActive ? "#04080F" : "#94a3b8",
                      borderRadius: 5, padding: "1px 7px", fontSize: 10, fontWeight: 800,
                    }}>{idx + 1}</div>
                    {sc.videoUrl && (
                      <div style={{
                        position: "absolute", bottom: 3, right: 4,
                        background: "rgba(0,0,0,0.65)", borderRadius: 3,
                        padding: "1px 5px", fontSize: 9, color: "#00D4FF", fontWeight: 700,
                      }}>VIDEO</div>
                    )}
                  </div>
                  <div style={{ padding: "5px 8px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 4 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600,
                      color: isActive ? "#e2e8f0" : "#64748b",
                      whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                      flex: 1, minWidth: 0,
                    }}>{sc.title}</span>
                    <div style={{ display: "flex", alignItems: "center", gap: 1, flexShrink: 0 }}>
                      <span style={{ fontSize: 9, color: "#334155", marginRight: 3 }}>{sc.duration}s</span>
                      <button onClick={e => { e.stopPropagation(); move(sc.id, -1); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#475569", lineHeight: 1 }}>
                        <ChevronUp size={10} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); move(sc.id, 1); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#475569", lineHeight: 1 }}>
                        <ChevronDown size={10} />
                      </button>
                      <button onClick={e => { e.stopPropagation(); deleteScene(sc.id); }}
                        style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "#475569", lineHeight: 1 }}>
                        <X size={10} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div style={{
            padding: "8px 12px", borderTop: "1px solid rgba(255,255,255,0.04)",
            display: "flex", justifyContent: "space-between", fontSize: 10,
          }}>
            <span style={{ color: "#334155" }}>Total duration</span>
            <span style={{ color: "#64748b", fontWeight: 700 }}>{totalSec}s / {totalTime}</span>
          </div>
        </div>

        {/* CENTER: Canvas */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>
          {active ? (
            <>
              {/* Scene title bar */}
              <div style={{
                padding: "8px 16px", flexShrink: 0,
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                display: "flex", alignItems: "center", gap: 10,
                background: "#060B17",
              }}>
                <input
                  value={active.title}
                  onChange={e => upd(active.id, { title: e.target.value })}
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    color: "#e2e8f0", fontSize: 14, fontWeight: 700, flex: 1,
                  }}
                  placeholder="Scene title…"
                />
                <span style={{ fontSize: 11, color: "#334155", flexShrink: 0 }}>
                  {scenes.findIndex(s => s.id === active.id) + 1} / {scenes.length}
                </span>
              </div>

              <div style={{ flex: 1, overflowY: "auto", padding: "14px 16px" }}>

                {/* 16:9 Canvas preview */}
                <div style={{
                  width: "100%", aspectRatio: "16/9", maxHeight: 280,
                  background: "#0A1020",
                  border: "1px solid rgba(255,255,255,0.07)",
                  borderRadius: 14, overflow: "hidden",
                  position: "relative", marginBottom: 14,
                  backgroundImage: active.imageUrl ? `url(${active.imageUrl})` : "none",
                  backgroundSize: "cover", backgroundPosition: "center",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  flexShrink: 0,
                }}>
                  {!active.imageUrl && !active.videoUrl && (
                    <div style={{ textAlign: "center" }}>
                      <ImageIcon size={36} color="#1e3050" style={{ marginBottom: 8 }} />
                      <p style={{ color: "#1e3050", fontSize: 11, margin: 0 }}>Generate AI image or add stock footage below</p>
                    </div>
                  )}
                  {active.videoUrl && (
                    <video
                      src={active.videoUrl}
                      style={{ width: "100%", height: "100%", objectFit: "cover", position: "absolute", inset: 0 }}
                      muted loop autoPlay playsInline
                    />
                  )}
                  {active.textOverlay.text && (
                    <div style={{
                      position: "absolute",
                      ...(active.textOverlay.position === "top"    ? { top: "8%" }    : {}),
                      ...(active.textOverlay.position === "center" ? { top: "50%", transform: "translateY(-50%)" } : {}),
                      ...(active.textOverlay.position === "bottom" ? { bottom: "8%" } : {}),
                      left: "5%", right: "5%", textAlign: "center",
                      fontSize: 22, fontWeight: 900, color: active.textOverlay.color,
                      textShadow: "0 2px 12px rgba(0,0,0,0.9)",
                      letterSpacing: "-0.3px",
                      zIndex: 2,
                    }}>{active.textOverlay.text}</div>
                  )}
                  {generating && (
                    <div style={{
                      position: "absolute", inset: 0,
                      background: "rgba(7,12,24,0.85)",
                      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10,
                      zIndex: 5,
                    }}>
                      <div style={{
                        width: 32, height: 32,
                        border: "3px solid rgba(167,139,250,0.25)",
                        borderTopColor: "#a78bfa", borderRadius: "50%",
                        animation: "spin 0.7s linear infinite",
                      }} />
                      <p style={{ color: "#a78bfa", fontSize: 12, fontWeight: 600, margin: 0 }}>Generating image…</p>
                    </div>
                  )}
                </div>

                {/* AI / Stock tabs */}
                <div style={{
                  background: "#0A1020", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.07)", overflow: "hidden", marginBottom: 12,
                }}>
                  <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                    {([
                      { id: "generate" as AiTab, label: "AI Image Generator", icon: <Sparkles size={11} /> },
                      { id: "stock"    as AiTab, label: "Stock Footage",       icon: <Film size={11} /> },
                    ] as const).map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setAiTab(tab.id)}
                        style={{
                          flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                          padding: "10px 8px", border: "none", cursor: "pointer",
                          background: aiTab === tab.id ? "rgba(0,212,255,0.07)" : "transparent",
                          color: aiTab === tab.id ? "#00D4FF" : "#475569",
                          fontSize: 12, fontWeight: 700,
                          borderBottom: aiTab === tab.id ? "2px solid #00D4FF" : "2px solid transparent",
                          transition: "all 0.12s",
                        }}
                      >{tab.icon}{tab.label}</button>
                    ))}
                  </div>

                  {/* AI Image Generator panel */}
                  {aiTab === "generate" && (
                    <div style={{ padding: "14px" }}>
                      <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                        Visual Prompt
                      </label>
                      <textarea
                        value={active.prompt}
                        onChange={e => upd(active.id, { prompt: e.target.value })}
                        placeholder='Describe the scene visually… e.g. "Cinematic aerial city skyline at golden hour, 8K photorealistic"'
                        rows={3}
                        style={{
                          width: "100%", background: "rgba(255,255,255,0.03)",
                          border: "1px solid rgba(255,255,255,0.08)", borderRadius: 9,
                          color: "#e2e8f0", fontSize: 12, padding: "10px 12px",
                          resize: "vertical", outline: "none", fontFamily: "inherit",
                          marginBottom: 10, boxSizing: "border-box",
                        }}
                      />
                      <div style={{ display: "flex", gap: 8 }}>
                        <button
                          onClick={generatePromptFromScript}
                          disabled={generatingPrompt || !active.script.trim()}
                          title={!active.script.trim() ? "Write a scene script first" : "Generate prompt from script"}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "8px 12px", borderRadius: 8,
                            background: "rgba(167,139,250,0.1)", border: "1px solid rgba(167,139,250,0.25)",
                            color: "#a78bfa", fontSize: 11, fontWeight: 700, cursor: "pointer",
                            opacity: generatingPrompt || !active.script.trim() ? 0.45 : 1,
                            flexShrink: 0,
                          }}
                        >
                          <Wand2 size={12} /> {generatingPrompt ? "Writing…" : "From Script"}
                        </button>
                        <button
                          onClick={generateImage}
                          disabled={generating || !active.prompt.trim()}
                          style={{
                            flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                            padding: "8px 14px", borderRadius: 8, border: "none",
                            background: active.prompt.trim() ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "rgba(255,255,255,0.05)",
                            color: active.prompt.trim() ? "#fff" : "#475569",
                            fontSize: 12, fontWeight: 800, cursor: "pointer",
                            opacity: generating ? 0.65 : 1, transition: "opacity 0.15s",
                          }}
                        >
                          <Sparkles size={13} /> {generating ? "Generating…" : "Generate AI Image"}
                        </button>
                      </div>
                      {active.imageUrl && !generateError && (
                        <p style={{ marginTop: 9, fontSize: 10, color: "#22c55e" }}>✓ Image generated — visible in preview above</p>
                      )}
                      {generateError && (
                        <p style={{ marginTop: 9, fontSize: 10, color: "#f87171" }}>✗ {generateError}</p>
                      )}
                      <p style={{ marginTop: 6, fontSize: 10, color: "#1e3050" }}>
                        Powered by FLUX.1 via fal.ai
                      </p>
                    </div>
                  )}

                  {/* Stock Footage panel */}
                  {aiTab === "stock" && (
                    <div style={{ padding: "14px" }}>
                      <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                        <input
                          value={stockQuery}
                          onChange={e => setStockQuery(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && searchFootage()}
                          placeholder="Search Pexels… e.g. 'city skyline' or 'technology'"
                          style={{
                            flex: 1, background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                            color: "#e2e8f0", fontSize: 12, padding: "8px 12px",
                            outline: "none", fontFamily: "inherit",
                          }}
                        />
                        <button
                          onClick={searchFootage}
                          disabled={searching || !stockQuery.trim()}
                          style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "8px 14px", borderRadius: 8, border: "none",
                            background: "linear-gradient(135deg, #00D4FF, #0080cc)",
                            color: "#04080F", fontSize: 12, fontWeight: 800, cursor: "pointer",
                            opacity: searching ? 0.65 : 1,
                          }}
                        >
                          <Search size={13} /> {searching ? "…" : "Search"}
                        </button>
                      </div>
                      {stockResults.length > 0 ? (
                        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 6 }}>
                          {stockResults.map(v => (
                            <div
                              key={v.id}
                              onClick={() => upd(active.id, { videoUrl: v.url, videoThumb: v.thumb, imageUrl: "" })}
                              style={{
                                aspectRatio: "16/9", borderRadius: 8, overflow: "hidden",
                                cursor: "pointer", position: "relative",
                                backgroundColor: "#0A1020",
                                border: active.videoUrl === v.url ? "2px solid #00D4FF" : "2px solid transparent",
                              }}
                            >
                              {v.thumb && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={v.thumb}
                                  alt=""
                                  style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", position: "absolute", inset: 0 }}
                                />
                              )}
                              <div style={{
                                position: "absolute", bottom: 2, right: 4,
                                fontSize: 8, fontWeight: 700, color: "#fff",
                                textShadow: "0 1px 4px rgba(0,0,0,0.9)",
                              }}>{v.duration}s</div>
                              {active.videoUrl === v.url && (
                                <div style={{
                                  position: "absolute", top: 4, right: 4,
                                  background: "#00D4FF", borderRadius: "50%",
                                  width: 16, height: 16,
                                  display: "flex", alignItems: "center", justifyContent: "center",
                                }}>
                                  <Check size={9} color="#04080F" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p style={{ fontSize: 11, color: "#334155", textAlign: "center", padding: "16px 0", margin: 0 }}>
                          {searching ? "Searching…" : "Search Pexels for free stock videos (requires PEXELS_API_KEY)"}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Script / Narration */}
                <div style={{
                  background: "#0A1020", borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.07)", padding: "14px", marginBottom: 12,
                }}>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Scene Script / Narration
                  </label>
                  <textarea
                    value={active.script}
                    onChange={e => upd(active.id, { script: e.target.value })}
                    placeholder="Write the narration for this scene… (used to auto-generate image prompts)"
                    rows={4}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.03)",
                      border: "1px solid rgba(255,255,255,0.07)", borderRadius: 9,
                      color: "#e2e8f0", fontSize: 12, padding: "10px 12px",
                      resize: "vertical", outline: "none", fontFamily: "inherit",
                      boxSizing: "border-box", lineHeight: 1.6,
                    }}
                  />
                </div>

                {/* Quick tools row */}
                <div style={{ display: "flex", gap: 8 }}>
                  <Link
                    href="/dashboard/voiceover"
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "9px", borderRadius: 9,
                      background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)",
                      color: "#a78bfa", fontSize: 11, fontWeight: 700, textDecoration: "none",
                    }}
                  >
                    <Mic size={13} /> Voiceover Studio
                  </Link>
                  <Link
                    href="/dashboard/new-script"
                    style={{
                      flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                      padding: "9px", borderRadius: 9,
                      background: "rgba(0,212,255,0.06)", border: "1px solid rgba(0,212,255,0.15)",
                      color: "#00D4FF", fontSize: 11, fontWeight: 700, textDecoration: "none",
                    }}
                  >
                    <Layers size={13} /> Script Generator
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 12 }}>
              <ImageIcon size={44} color="#1e3050" />
              <p style={{ color: "#334155", fontSize: 13, margin: 0 }}>Select a scene to start editing</p>
            </div>
          )}
        </div>

        {/* RIGHT: Properties */}
        <div style={{
          width: 256, flexShrink: 0,
          background: "#060B17", borderLeft: "1px solid rgba(255,255,255,0.05)",
          display: "flex", flexDirection: "column",
        }}>
          {/* Right tab bar */}
          <div style={{ display: "flex", borderBottom: "1px solid rgba(255,255,255,0.05)", flexShrink: 0 }}>
            {([
              { id: "properties" as RightTab, icon: <Sliders size={11} />, label: "Props" },
              { id: "overlay"    as RightTab, icon: <Type size={11} />,    label: "Text" },
              { id: "audio"      as RightTab, icon: <Mic size={11} />,     label: "Audio" },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setRightTab(t.id)}
                style={{
                  flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
                  padding: "9px 4px", border: "none", cursor: "pointer",
                  background: rightTab === t.id ? "rgba(0,212,255,0.05)" : "transparent",
                  color: rightTab === t.id ? "#00D4FF" : "#475569",
                  fontSize: 9, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.08em",
                  borderBottom: rightTab === t.id ? "2px solid #00D4FF" : "2px solid transparent",
                  transition: "all 0.12s",
                }}
              >{t.icon}{t.label}</button>
            ))}
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: "14px 12px" }}>
            {!active && (
              <p style={{ color: "#334155", fontSize: 11, textAlign: "center", marginTop: 24 }}>No scene selected</p>
            )}

            {/* Properties tab */}
            {active && rightTab === "properties" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                    <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", textTransform: "uppercase", letterSpacing: "0.12em" }}>
                      Duration
                    </label>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#00D4FF" }}>{active.duration}s</span>
                  </div>
                  <input
                    type="range" min={1} max={60}
                    value={active.duration}
                    onChange={e => upd(active.id, { duration: Number(e.target.value) })}
                    style={{ width: "100%", accentColor: "#00D4FF" }}
                  />
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 9, color: "#334155", marginTop: 2 }}>
                    <span>1s</span><span>60s</span>
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Transition
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                    {(["fade", "cut", "slide", "zoom"] as Transition[]).map(t => (
                      <button
                        key={t}
                        onClick={() => upd(active.id, { transition: t })}
                        style={{
                          padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
                          background: active.transition === t ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.04)",
                          color: active.transition === t ? "#00D4FF" : "#475569",
                          fontSize: 11, fontWeight: 700, textTransform: "capitalize",
                          outline: active.transition === t ? "1px solid rgba(0,212,255,0.3)" : "none",
                          transition: "all 0.1s",
                        }}
                      >{t}</button>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: "rgba(255,255,255,0.02)", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.05)", padding: "12px",
                }}>
                  <p style={{ fontSize: 9, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 10, margin: "0 0 10px" }}>
                    Scene Status
                  </p>
                  {sceneReadiness.map(item => (
                    <div key={item.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 11, color: "#64748b" }}>{item.label}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: item.ok ? "#34d399" : "#334155" }}>
                        {item.ok ? "✓ Ready" : "○ Empty"}
                      </span>
                    </div>
                  ))}
                </div>

                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Clear Visuals
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {active.imageUrl && (
                      <button
                        onClick={() => upd(active.id, { imageUrl: "" })}
                        style={{
                          flex: 1, padding: "7px", borderRadius: 7, border: "1px solid rgba(248,113,113,0.2)",
                          background: "rgba(248,113,113,0.08)", color: "#f87171",
                          fontSize: 10, fontWeight: 700, cursor: "pointer",
                        }}
                      >✕ Image</button>
                    )}
                    {active.videoUrl && (
                      <button
                        onClick={() => upd(active.id, { videoUrl: "", videoThumb: "" })}
                        style={{
                          flex: 1, padding: "7px", borderRadius: 7, border: "1px solid rgba(248,113,113,0.2)",
                          background: "rgba(248,113,113,0.08)", color: "#f87171",
                          fontSize: 10, fontWeight: 700, cursor: "pointer",
                        }}
                      >✕ Video</button>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Text Overlay tab */}
            {active && rightTab === "overlay" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Caption / Title Text
                  </label>
                  <textarea
                    value={active.textOverlay.text}
                    onChange={e => upd(active.id, { textOverlay: { ...active.textOverlay, text: e.target.value } })}
                    placeholder="Text that appears on screen…"
                    rows={3}
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                      color: "#e2e8f0", fontSize: 12, padding: "8px 10px",
                      resize: "none", outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Position
                  </label>
                  <div style={{ display: "flex", gap: 6 }}>
                    {(["top", "center", "bottom"] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => upd(active.id, { textOverlay: { ...active.textOverlay, position: p } })}
                        style={{
                          flex: 1, padding: "7px", borderRadius: 7, border: "none", cursor: "pointer",
                          background: active.textOverlay.position === p ? "rgba(0,212,255,0.12)" : "rgba(255,255,255,0.04)",
                          color: active.textOverlay.position === p ? "#00D4FF" : "#475569",
                          fontSize: 11, fontWeight: 700, textTransform: "capitalize", transition: "all 0.1s",
                        }}
                      >{p}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Text Color
                  </label>
                  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="color"
                      value={active.textOverlay.color}
                      onChange={e => upd(active.id, { textOverlay: { ...active.textOverlay, color: e.target.value } })}
                      style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid rgba(255,255,255,0.1)", cursor: "pointer", background: "none", padding: 2 }}
                    />
                    <input
                      value={active.textOverlay.color}
                      onChange={e => upd(active.id, { textOverlay: { ...active.textOverlay, color: e.target.value } })}
                      style={{
                        flex: 1, background: "rgba(255,255,255,0.04)",
                        border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                        color: "#e2e8f0", fontSize: 12, padding: "8px 10px", outline: "none", fontFamily: "inherit",
                      }}
                    />
                  </div>
                </div>
                <div style={{
                  background: "rgba(255,255,255,0.02)", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.05)", padding: "12px",
                }}>
                  <p style={{ fontSize: 10, color: "#334155", margin: 0, lineHeight: 1.5 }}>
                    Preview in the canvas above. Text renders over your image or video.
                  </p>
                </div>
              </div>
            )}

            {/* Audio tab */}
            {active && rightTab === "audio" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                    Voiceover URL
                  </label>
                  <input
                    value={active.audioUrl}
                    onChange={e => upd(active.id, { audioUrl: e.target.value })}
                    placeholder="ElevenLabs / Google Drive audio URL…"
                    style={{
                      width: "100%", background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)", borderRadius: 8,
                      color: "#e2e8f0", fontSize: 12, padding: "8px 10px",
                      outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                    }}
                  />
                  {active.audioUrl && (
                    <audio
                      controls
                      src={active.audioUrl}
                      style={{ width: "100%", marginTop: 10, borderRadius: 8, height: 36 }}
                    />
                  )}
                </div>
                <Link
                  href="/dashboard/voiceover"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "10px", borderRadius: 9,
                    background: "rgba(167,139,250,0.08)", border: "1px solid rgba(167,139,250,0.2)",
                    color: "#a78bfa", fontSize: 12, fontWeight: 700, textDecoration: "none",
                  }}
                >
                  <Mic size={13} /> Open Voiceover Studio
                </Link>
                <div style={{
                  background: "rgba(255,255,255,0.02)", borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.05)", padding: "12px",
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: "#334155", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Workflow</p>
                  <ol style={{ fontSize: 10, color: "#475569", margin: 0, padding: "0 0 0 14px", lineHeight: 1.8 }}>
                    <li>Write scene script in the Script panel</li>
                    <li>Generate voiceover in ElevenLabs or Voiceover Studio</li>
                    <li>Paste the audio URL above</li>
                  </ol>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Timeline ────────────────────────────────────────── */}
      <div style={{
        height: 84, background: "#050A14",
        borderTop: "1px solid rgba(255,255,255,0.05)",
        display: "flex", alignItems: "center",
        padding: "0 16px", gap: 6, overflowX: "auto", flexShrink: 0,
      }}>
        <span style={{ fontSize: 9, fontWeight: 800, color: "#334155", textTransform: "uppercase", letterSpacing: "0.12em", flexShrink: 0, marginRight: 6 }}>
          Timeline
        </span>
        {scenes.map((sc, idx) => {
          const pct = totalSec > 0 ? (sc.duration / totalSec) * 100 : 100 / scenes.length;
          const w = Math.max(56, pct * 5.5);
          const isAct = sc.id === activeId;
          return (
            <div
              key={sc.id}
              onClick={() => setActiveId(sc.id)}
              style={{
                width: w, height: 60, borderRadius: 8, cursor: "pointer",
                border: isAct ? "2px solid #00D4FF" : "1px solid rgba(255,255,255,0.08)",
                background: (sc.imageUrl || sc.videoThumb)
                  ? `linear-gradient(rgba(7,12,24,0.45),rgba(7,12,24,0.45)) center/cover, url(${sc.imageUrl || sc.videoThumb}) center/cover`
                  : "#0A1020",
                display: "flex", flexDirection: "column", justifyContent: "space-between",
                padding: "5px 7px", flexShrink: 0, overflow: "hidden",
                transition: "border 0.12s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 9, fontWeight: 800, color: isAct ? "#00D4FF" : "#475569" }}>{idx + 1}</span>
                <span style={{ fontSize: 8, color: "#334155" }}>{sc.duration}s</span>
              </div>
              <span style={{
                fontSize: 8, color: isAct ? "#e2e8f0" : "#475569", fontWeight: 600,
                whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
              }}>{sc.title}</span>
            </div>
          );
        })}
        <button
          onClick={addScene}
          style={{
            width: 56, height: 60, borderRadius: 8, flexShrink: 0,
            border: "1px dashed rgba(255,255,255,0.08)",
            background: "transparent", cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "#334155",
          }}
        >
          <Plus size={16} />
        </button>
        <div style={{ marginLeft: "auto", flexShrink: 0, paddingLeft: 12, textAlign: "right" }}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#475569", margin: 0 }}>{totalSec}s total</p>
          <p style={{ fontSize: 9, color: "#334155", margin: 0 }}>{scenes.length} scenes · {totalTime}</p>
        </div>
      </div>

      {/* ── Video Preview Modal ─────────────────────────────── */}
      {showPreview && (() => {
        // Compute which scene is active at previewTime
        let elapsed = 0;
        let previewSceneIdx = 0;
        for (let i = 0; i < scenes.length; i++) {
          if (previewTime < elapsed + scenes[i].duration) { previewSceneIdx = i; break; }
          elapsed += scenes[i].duration;
          if (i === scenes.length - 1) previewSceneIdx = i;
        }
        const pScene = scenes[previewSceneIdx];
        const progressPct = totalSec > 0 ? (previewTime / totalSec) * 100 : 0;
        const fmt = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, "0")}`;

        return (
          <div style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.92)", backdropFilter: "blur(12px)",
            display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          }}>
            {/* Header */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16, width: "min(90vw, 900px)" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#fff", margin: 0 }}>{projectName}</p>
                <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>
                  Scene {previewSceneIdx + 1} of {scenes.length} · {fmt(previewTime)} / {fmt(totalSec)}
                </p>
              </div>
              <button
                onClick={() => setShowPreview(false)}
                style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", borderRadius: 8, padding: "6px 12px", cursor: "pointer", fontSize: 12 }}
              >✕ Close</button>
            </div>

            {/* Canvas */}
            <div style={{
              width: "min(90vw, 900px)", aspectRatio: "16/9",
              background: "#000", borderRadius: 12, overflow: "hidden",
              position: "relative", border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
            }}>
              {/* Media */}
              {pScene.videoUrl ? (
                <video
                  key={pScene.id}
                  src={pScene.videoUrl}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                  autoPlay muted loop playsInline
                />
              ) : pScene.imageUrl ? (
                <img
                  key={pScene.id}
                  src={pScene.imageUrl}
                  alt={pScene.title}
                  style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", animation: "previewFadeIn 0.4s ease" }}
                />
              ) : (
                <div
                  key={pScene.id}
                  style={{
                    position: "absolute", inset: 0,
                    background: ["#0f172a","#1e1b4b","#172554","#14532d","#1c1917"][previewSceneIdx % 5],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    animation: "previewFadeIn 0.4s ease",
                  }}
                >
                  <span style={{ fontSize: 80, fontWeight: 900, color: "rgba(255,255,255,0.06)" }}>
                    {previewSceneIdx + 1}
                  </span>
                </div>
              )}

              {/* Text overlay */}
              {pScene.textOverlay?.text && (
                <div style={{
                  position: "absolute",
                  ...(pScene.textOverlay.position === "top"    ? { top: "8%" }    : {}),
                  ...(pScene.textOverlay.position === "center" ? { top: "50%", transform: "translateY(-50%)" } : {}),
                  ...(pScene.textOverlay.position === "bottom" ? { bottom: "8%" } : {}),
                  left: "5%", right: "5%", textAlign: "center", zIndex: 3,
                  animation: "previewFadeIn 0.5s ease 0.2s both",
                }}>
                  <p style={{ fontSize: "clamp(16px,2.8vw,32px)", fontWeight: 900, color: pScene.textOverlay.color, textShadow: "0 3px 14px rgba(0,0,0,0.9)", margin: 0 }}>
                    {pScene.textOverlay.text}
                  </p>
                </div>
              )}

              {/* Scene title lower-third */}
              <div style={{ position: "absolute", bottom: 14, left: 16, zIndex: 3, animation: "previewFadeIn 0.3s ease" }}>
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.4)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", margin: 0 }}>{pScene.title}</p>
              </div>

              {/* Progress bar on canvas */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 3, background: "rgba(255,255,255,0.1)", zIndex: 4 }}>
                <div style={{ height: "100%", width: `${progressPct}%`, background: "#00D4FF", transition: "width 0.1s linear" }} />
              </div>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, width: "min(90vw, 900px)" }}>
              <button
                onClick={() => setPreviewPlaying(p => !p)}
                style={{
                  width: 40, height: 40, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #00D4FF, #0080cc)",
                  border: "none", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}
              >
                {previewPlaying
                  ? <Pause size={16} color="#04080F" fill="#04080F" />
                  : <Play  size={16} color="#04080F" fill="#04080F" />}
              </button>

              {/* Seekbar */}
              <div style={{ flex: 1, position: "relative", height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 99, cursor: "pointer" }}
                onClick={e => {
                  const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
                  setPreviewTime(((e.clientX - rect.left) / rect.width) * totalSec);
                }}
              >
                <div style={{ height: "100%", width: `${progressPct}%`, background: "#00D4FF", borderRadius: 99, pointerEvents: "none" }} />
                {/* Scene markers */}
                {(() => { let mt = 0; return scenes.slice(0, -1).map((s, i) => { mt += s.duration; return (
                  <div key={i} style={{ position: "absolute", top: -3, left: `${(mt / totalSec) * 100}%`, width: 2, height: 10, background: "rgba(255,255,255,0.25)", borderRadius: 1, transform: "translateX(-1px)", pointerEvents: "none" }} />
                ); }); })()}
              </div>

              <span style={{ fontSize: 11, color: "#475569", whiteSpace: "nowrap" }}>{fmt(previewTime)} / {fmt(totalSec)}</span>
            </div>

            {/* Scene strip */}
            <div style={{ display: "flex", gap: 6, marginTop: 12, overflowX: "auto", maxWidth: "min(90vw, 900px)", width: "100%", paddingBottom: 4 }}>
              {scenes.map((sc, idx) => {
                const scStart = scenes.slice(0, idx).reduce((a, s) => a + s.duration, 0);
                const isActive = idx === previewSceneIdx;
                return (
                  <div
                    key={sc.id}
                    onClick={() => { setPreviewTime(scStart); setPreviewPlaying(false); }}
                    style={{
                      flexShrink: 0, width: 80, borderRadius: 7, overflow: "hidden",
                      border: isActive ? "1.5px solid #00D4FF" : "1px solid rgba(255,255,255,0.08)",
                      cursor: "pointer", background: "#0A1020", opacity: isActive ? 1 : 0.6,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{
                      width: "100%", aspectRatio: "16/9",
                      backgroundImage: sc.imageUrl || sc.videoThumb ? `url(${sc.imageUrl || sc.videoThumb})` : "none",
                      backgroundSize: "cover", backgroundPosition: "center",
                      background: (!sc.imageUrl && !sc.videoThumb) ? "#0E1828" : undefined,
                    }} />
                    <div style={{ padding: "3px 5px" }}>
                      <p style={{ fontSize: 8, color: isActive ? "#00D4FF" : "#475569", margin: 0, fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {idx + 1}. {sc.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* HyperFrames render hint */}
            <div style={{
              marginTop: 16, padding: "10px 16px", borderRadius: 10,
              background: "rgba(34,211,153,0.05)", border: "1px solid rgba(34,211,153,0.15)",
              display: "flex", alignItems: "center", gap: 10, width: "min(90vw, 900px)",
            }}>
              <Code2 size={14} color="#34d399" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 11, color: "#64748b", margin: 0 }}>
                Export as HyperFrames HTML, then render to MP4 with:{" "}
                <code style={{ color: "#34d399", background: "rgba(34,211,153,0.1)", padding: "1px 6px", borderRadius: 4 }}>
                  npx hyperframes render --input composition.html --output video.mp4
                </code>
              </p>
              <button onClick={exportHyperFrames} style={{ flexShrink: 0, padding: "5px 12px", borderRadius: 7, border: "1px solid rgba(34,211,153,0.3)", background: "rgba(34,211,153,0.08)", color: "#34d399", fontSize: 11, fontWeight: 700, cursor: "pointer" }}>
                Download HTML
              </button>
            </div>
          </div>
        );
      })()}

      {/* ── AI Scene Planner Modal ──────────────────────────── */}
      {showPlanModal && (
        <div style={{
          position: "fixed", inset: 0,
          background: "rgba(0,0,0,0.72)", backdropFilter: "blur(8px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000,
        }}>
          <div style={{
            background: "#0A1020", borderRadius: 20,
            border: "1px solid rgba(167,139,250,0.25)",
            padding: "28px", width: 460, maxWidth: "90vw",
            boxShadow: "0 32px 100px rgba(0,0,0,0.7)",
          }}>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.4px" }}>
                  ✨ AI Scene Planner
                </h2>
                <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                  Enter your video topic — AI generates a full scene-by-scene plan with scripts & image prompts
                </p>
              </div>
              <button onClick={() => setShowPlanModal(false)} style={{ background: "none", border: "none", color: "#475569", cursor: "pointer", flexShrink: 0 }}>
                <X size={18} />
              </button>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.12em" }}>
                Video Topic
              </label>
              <input
                value={planTopic}
                onChange={e => setPlanTopic(e.target.value)}
                onKeyDown={e => e.key === "Enter" && !planning && planScenes()}
                placeholder='e.g. "5 AI tools replacing jobs by 2025"'
                autoFocus
                style={{
                  width: "100%", background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(167,139,250,0.25)", borderRadius: 10,
                  color: "#e2e8f0", fontSize: 14, padding: "12px 14px",
                  outline: "none", fontFamily: "inherit", boxSizing: "border-box",
                }}
              />
            </div>

            <div style={{
              background: "rgba(167,139,250,0.06)", borderRadius: 10,
              border: "1px solid rgba(167,139,250,0.12)", padding: "12px 14px", marginBottom: 22,
            }}>
              <p style={{ fontSize: 11, color: "#a78bfa", margin: 0, lineHeight: 1.7 }}>
                <strong style={{ color: "#c4b5fd" }}>What AI generates:</strong><br />
                Scene titles · Narration scripts · Image prompts for each scene · Scene durations
              </p>
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={() => setShowPlanModal(false)}
                style={{
                  flex: 1, padding: "12px", borderRadius: 10,
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer",
                }}
              >Cancel</button>
              <button
                onClick={planScenes}
                disabled={planning || !planTopic.trim()}
                style={{
                  flex: 2, padding: "12px", borderRadius: 10, border: "none",
                  background: planTopic.trim() ? "linear-gradient(135deg, #a78bfa, #7c3aed)" : "rgba(255,255,255,0.05)",
                  color: planTopic.trim() ? "#fff" : "#334155",
                  fontSize: 13, fontWeight: 800, cursor: planTopic.trim() ? "pointer" : "default",
                  opacity: planning ? 0.65 : 1, transition: "opacity 0.15s",
                }}
              >
                {planning ? "Planning scenes…" : "✨ Generate Scene Plan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Render Modal ────────────────────────────────────── */}
      {showRender && (
        <div style={{
          position: "fixed", inset: 0, zIndex: 3000,
          background: "rgba(0,0,0,0.92)", backdropFilter: "blur(16px)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <div style={{
            background: "#0A1020", borderRadius: 24,
            border: "1px solid rgba(255,255,255,0.09)",
            padding: "32px", width: 520, maxWidth: "90vw",
            boxShadow: "0 40px 120px rgba(0,0,0,0.8)",
          }}>

            {/* ── Format picker (before render starts) ── */}
            {!rendering && !renderDone && !renderError && (
              <>
                <div style={{ marginBottom: 24 }}>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#fff", margin: "0 0 4px" }}>Render Settings</h2>
                  <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>Choose the format for your target platform</p>
                </div>

                <div style={{ marginBottom: 20 }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px" }}>
                    Video Format
                  </p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {([
                      {
                        id: "landscape" as const,
                        label: "Landscape  16:9",
                        dims: "1280 × 720",
                        platforms: "YouTube · Facebook · X/Twitter",
                        color: "#FF0000",
                      },
                      {
                        id: "portrait" as const,
                        label: "Portrait  9:16",
                        dims: "720 × 1280",
                        platforms: "TikTok · Instagram Reels",
                        color: "#E1306C",
                      },
                      {
                        id: "square" as const,
                        label: "Square  1:1",
                        dims: "720 × 720",
                        platforms: "Instagram Feed",
                        color: "#1877F2",
                      },
                    ] as const).map(f => (
                      <div
                        key={f.id}
                        onClick={() => setRenderFormat(f.id)}
                        style={{
                          display: "flex", alignItems: "center", gap: 14,
                          padding: "14px 16px", borderRadius: 12, cursor: "pointer",
                          border: renderFormat === f.id
                            ? `1.5px solid ${f.color}60`
                            : "1px solid rgba(255,255,255,0.07)",
                          background: renderFormat === f.id
                            ? `${f.color}0D`
                            : "rgba(255,255,255,0.02)",
                          transition: "all 0.15s",
                        }}
                      >
                        {/* Aspect ratio preview box */}
                        <div style={{
                          flexShrink: 0,
                          width: f.id === "portrait" ? 22 : f.id === "square" ? 28 : 44,
                          height: f.id === "portrait" ? 38 : f.id === "square" ? 28 : 28,
                          borderRadius: 4,
                          background: renderFormat === f.id ? `${f.color}30` : "rgba(255,255,255,0.08)",
                          border: `1.5px solid ${renderFormat === f.id ? f.color : "rgba(255,255,255,0.15)"}`,
                        }} />
                        <div style={{ flex: 1 }}>
                          <p style={{ fontSize: 13, fontWeight: 700, color: renderFormat === f.id ? "#fff" : "#94a3b8", margin: 0 }}>
                            {f.label}
                          </p>
                          <p style={{ fontSize: 10, color: "#475569", margin: "2px 0 0", fontFamily: "monospace" }}>{f.dims}</p>
                          <p style={{ fontSize: 10, color: "#334155", margin: "2px 0 0" }}>{f.platforms}</p>
                        </div>
                        <div style={{
                          width: 18, height: 18, borderRadius: "50%", flexShrink: 0,
                          border: `2px solid ${renderFormat === f.id ? f.color : "rgba(255,255,255,0.12)"}`,
                          background: renderFormat === f.id ? f.color : "transparent",
                          display: "flex", alignItems: "center", justifyContent: "center",
                        }}>
                          {renderFormat === f.id && <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fff" }} />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{
                  background: "rgba(249,115,22,0.05)", borderRadius: 10,
                  border: "1px solid rgba(249,115,22,0.12)", padding: "10px 14px", marginBottom: 20,
                }}>
                  <p style={{ fontSize: 10, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                    <strong style={{ color: "#fb923c" }}>Tip:</strong> If publishing to multiple platforms, render each format separately.
                    The canvas re-renders at the correct dimensions — portrait content will be letterboxed from your 16:9 scenes.
                  </p>
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => setShowRender(false)}
                    style={{
                      flex: 1, padding: "12px", borderRadius: 10,
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                      color: "#64748b", fontSize: 13, fontWeight: 700, cursor: "pointer",
                    }}
                  >Cancel</button>
                  <button
                    onClick={renderVideo}
                    style={{
                      flex: 2, padding: "12px", borderRadius: 10, border: "none",
                      background: "linear-gradient(135deg, #f97316, #dc2626)",
                      color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer",
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    }}
                  >
                    <Film size={15} />
                    Start Render · {renderFormat === "landscape" ? "1280×720" : renderFormat === "portrait" ? "720×1280" : "720×720"}
                  </button>
                </div>
              </>
            )}

            {/* ── Rendering in progress ── */}
            {rendering && (
              <>
                <div style={{ textAlign: "center", marginBottom: 28 }}>
                  <div style={{
                    width: 56, height: 56, margin: "0 auto 16px",
                    border: "4px solid rgba(249,115,22,0.2)",
                    borderTopColor: "#f97316", borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>Rendering Video</h2>
                  <p style={{ fontSize: 12, color: "#475569", margin: 0 }}>
                    Processing {scenes.length} scenes · frame by frame in your browser
                  </p>
                </div>

                {/* Progress bar */}
                <div style={{ marginBottom: 24 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                    <span style={{ fontSize: 11, color: "#64748b" }}>Progress</span>
                    <span style={{ fontSize: 13, fontWeight: 800, color: "#f97316" }}>{renderProgress}%</span>
                  </div>
                  <div style={{ height: 8, background: "rgba(255,255,255,0.06)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{
                      height: "100%", borderRadius: 99,
                      background: "linear-gradient(90deg, #f97316, #dc2626)",
                      width: `${renderProgress}%`,
                      transition: "width 0.3s ease",
                    }} />
                  </div>
                </div>

                <div style={{
                  background: "rgba(249,115,22,0.06)", borderRadius: 12,
                  border: "1px solid rgba(249,115,22,0.15)", padding: "12px 16px",
                }}>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, lineHeight: 1.6 }}>
                    Rendering runs in your browser using the MediaRecorder API.
                    Keep this tab active for best results. For high-quality MP4 output, use the HyperFrames export instead.
                  </p>
                </div>
              </>
            )}

            {/* ── Error state ── */}
            {!rendering && renderError && (
              <>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <p style={{ fontSize: 40, margin: "0 0 12px" }}>⚠️</p>
                  <h2 style={{ fontSize: 18, fontWeight: 900, color: "#f87171", margin: "0 0 8px" }}>Render Failed</h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{renderError}</p>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={() => { setShowRender(false); setRenderError(""); }}
                    style={{ flex: 1, padding: "12px", borderRadius: 10, background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 13, fontWeight: 700, cursor: "pointer" }}
                  >Close</button>
                  <button
                    onClick={renderVideo}
                    style={{ flex: 2, padding: "12px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #f97316, #dc2626)", color: "#fff", fontSize: 13, fontWeight: 800, cursor: "pointer" }}
                  >Retry Render</button>
                </div>
              </>
            )}

            {/* ── Render done ── */}
            {!rendering && renderDone && renderedBlob && (
              <>
                <div style={{ textAlign: "center", marginBottom: 24 }}>
                  <p style={{ fontSize: 44, margin: "0 0 12px" }}>🎬</p>
                  <h2 style={{ fontSize: 20, fontWeight: 900, color: "#fff", margin: "0 0 6px" }}>Video Ready!</h2>
                  <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>
                    {projectName} · {renderExt.toUpperCase()} · {Math.round(renderedBlob.size / 1024 / 1024 * 10) / 10} MB
                  </p>
                </div>

                {/* Download button */}
                <button
                  onClick={downloadRender}
                  style={{
                    width: "100%", padding: "14px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg, #f97316, #dc2626)",
                    color: "#fff", fontSize: 14, fontWeight: 800, cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginBottom: 20,
                  }}
                >
                  <Download size={16} /> Download {renderExt.toUpperCase()}
                </button>

                {/* Open in Publisher — uploads blob then navigates */}
                <button
                  onClick={() => handlePublishTo()}
                  disabled={uploadingToCloud}
                  style={{
                    width: "100%", padding: "13px", borderRadius: 12, border: "none",
                    background: uploadingToCloud
                      ? "rgba(255,255,255,0.06)"
                      : "linear-gradient(135deg, #7c3aed, #a78bfa)",
                    color: uploadingToCloud ? "#475569" : "#fff",
                    fontSize: 13, fontWeight: 800, cursor: uploadingToCloud ? "default" : "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    marginBottom: 12,
                  }}
                >
                  {uploadingToCloud && !uploadPlatform ? (
                    <>
                      <div style={{ width: 14, height: 14, borderRadius: "50%", border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", animation: "spin 0.7s linear infinite" }} />
                      Uploading to cloud…
                    </>
                  ) : (
                    <><Download size={15} /> Open in Publisher</>
                  )}
                </button>

                {/* Per-platform quick-publish */}
                <div style={{
                  background: "rgba(255,255,255,0.02)", borderRadius: 14,
                  border: "1px solid rgba(255,255,255,0.07)", padding: "16px", marginBottom: 16,
                }}>
                  <p style={{ fontSize: 10, fontWeight: 800, color: "#4A6080", letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 14px" }}>
                    Quick-publish to a platform
                  </p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    {[
                      { id: "youtube",   name: "YouTube",   color: "#FF0000", bg: "rgba(255,0,0,0.08)",     border: "rgba(255,0,0,0.2)",     emoji: "▶" },
                      { id: "tiktok",    name: "TikTok",    color: "#69C9D0", bg: "rgba(105,201,208,0.08)", border: "rgba(105,201,208,0.2)", emoji: "♪" },
                      { id: "instagram", name: "Instagram", color: "#E1306C", bg: "rgba(225,48,108,0.08)",  border: "rgba(225,48,108,0.2)",  emoji: "◎" },
                      { id: "twitter",   name: "X / Twitter", color: "#e2e8f0", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.12)", emoji: "𝕏" },
                      { id: "facebook",  name: "Facebook",  color: "#1877F2", bg: "rgba(24,119,242,0.08)",  border: "rgba(24,119,242,0.2)",  emoji: "f" },
                    ].map(p => {
                      const isUploading = uploadingToCloud && uploadPlatform === p.id;
                      return (
                        <button
                          key={p.id}
                          onClick={() => handlePublishTo(p.id)}
                          disabled={uploadingToCloud}
                          style={{
                            padding: "10px 12px", borderRadius: 10,
                            background: p.bg, border: `1px solid ${p.border}`,
                            color: p.color, fontSize: 11, fontWeight: 700,
                            cursor: uploadingToCloud ? "default" : "pointer",
                            display: "flex", alignItems: "center", gap: 7,
                            opacity: uploadingToCloud && !isUploading ? 0.4 : 1,
                            transition: "opacity 0.15s",
                          }}
                        >
                          {isUploading
                            ? <div style={{ width: 12, height: 12, borderRadius: "50%", border: `2px solid ${p.color}40`, borderTopColor: p.color, animation: "spin 0.7s linear infinite" }} />
                            : <span style={{ fontSize: 13 }}>{p.emoji}</span>
                          }
                          {p.name}
                          {!isUploading && <span style={{ marginLeft: "auto", fontSize: 8, opacity: 0.5, fontWeight: 600 }}>PUBLISH</span>}
                        </button>
                      );
                    })}
                    <button
                      onClick={exportHyperFrames}
                      style={{
                        padding: "10px 12px", borderRadius: 10,
                        background: "rgba(34,211,153,0.06)", border: "1px solid rgba(34,211,153,0.2)",
                        color: "#34d399", fontSize: 11, fontWeight: 700, cursor: "pointer",
                        display: "flex", alignItems: "center", gap: 7,
                      }}
                    >
                      <Code2 size={13} /> HyperFrames HTML
                    </button>
                  </div>
                  <p style={{ fontSize: 10, color: "#475569", margin: "12px 0 0", lineHeight: 1.5 }}>
                    Clicking a platform uploads your video to cloud storage, then opens the Publisher with that platform pre-selected.
                    Configure n8n upload webhooks in Settings to activate each platform.
                  </p>
                </div>

                <button
                  onClick={() => { setShowRender(false); setRenderDone(false); setRenderedBlob(null); }}
                  style={{
                    width: "100%", padding: "11px", borderRadius: 10,
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.09)",
                    color: "#64748b", fontSize: 12, fontWeight: 700, cursor: "pointer",
                  }}
                >Close</button>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes previewFadeIn { from { opacity: 0; } to { opacity: 1; } }
        * { scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.07) transparent; }
        *::-webkit-scrollbar { width: 4px; height: 4px; }
        *::-webkit-scrollbar-track { background: transparent; }
        *::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.09); border-radius: 2px; }
      `}</style>
    </div>
  );
}
