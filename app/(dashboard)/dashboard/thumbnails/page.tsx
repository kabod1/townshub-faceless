"use client";

import { useState, useCallback, useEffect } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Wand2, Download, Plus, Palette, Type, Layers,
  Sparkles, ZoomIn, RotateCcw, AlignLeft, AlignCenter,
  Bold, Italic, Trash2, ImageIcon,
} from "lucide-react";

const stylePresets = [
  { id: "bold",   label: "Bold & Dramatic",  bg: ["#7f1d1d", "#000000"],   accent: "#FF3333" },
  { id: "clean",  label: "Clean & Minimal",  bg: ["#475569", "#0f172a"],   accent: "#00D4FF" },
  { id: "neon",   label: "Neon Cyberpunk",   bg: ["#581c87", "#000000"],   accent: "#FF00FF" },
  { id: "gold",   label: "Premium Gold",     bg: ["#78350f", "#1c1917"],   accent: "#FFD700" },
  { id: "nature", label: "Natural Organic",  bg: ["#14532d", "#022c22"],   accent: "#4ADE80" },
  { id: "fire",   label: "Fire & Energy",    bg: ["#7c2d12", "#450a0a"],   accent: "#FF6B35" },
];

interface ThumbnailAsset {
  id: string; title: string; subtitle: string;
  style: string; accent: string; createdAt: string; dataUrl?: string;
}

export default function ThumbnailsPage() {
  const isPro = false; // TODO: wire to real plan
  const [activeTab, setActiveTab] = useState<"create" | "library">("create");
  const [titleText, setTitleText] = useState("Why 99% of YouTube Channels FAIL");
  const [subtitleText, setSubtitleText] = useState("(And How to Be the 1%)");
  const [selectedStyle, setSelectedStyle] = useState("bold");
  const [generating, setGenerating] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [generateError, setGenerateError] = useState<string | null>(null);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [accentColor, setAccentColor] = useState("");
  const [bgPrompt, setBgPrompt] = useState("");
  const [bgGenerating, setBgGenerating] = useState(false);
  const [bgError, setBgError] = useState<string | null>(null);
  const [bgImageUrl, setBgImageUrl] = useState<string | null>(null);
  const [textAlign, setTextAlign] = useState<"left" | "center">("center");
  const [isBold, setIsBold] = useState(true);
  const [isItalic, setIsItalic] = useState(false);
  const [zoom, setZoom] = useState(100);
  const [isMobile, setIsMobile] = useState(false);
  const [savedAssets, setSavedAssets] = useLocalStorage<ThumbnailAsset[]>("th_thumbnails", []);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const style = stylePresets.find(s => s.id === selectedStyle)!;
  const effectiveAccent = accentColor || style.accent;

  const renderToCanvas = useCallback((): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280; canvas.height = 720;
    const ctx = canvas.getContext("2d")!;
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, style.bg[0]); grad.addColorStop(1, style.bg[1]);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const radial = ctx.createRadialGradient(640, 0, 0, 640, 0, 500);
    radial.addColorStop(0, `${effectiveAccent}55`); radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let x = 0; x < canvas.width; x += 40) for (let y = 0; y < canvas.height; y += 40) {
      ctx.beginPath(); ctx.arc(x, y, 1.5, 0, Math.PI * 2); ctx.fill();
    }
    const titleSize = Math.min(96, Math.floor(1280 / (titleText.length * 0.55 + 4)));
    const fontStyle = isItalic ? "italic " : "";
    const fontWeight = isBold ? "bold" : "600";
    ctx.font = `${fontStyle}${fontWeight} ${titleSize}px Syne, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = textAlign === "left" ? "left" : "center";
    ctx.shadowColor = effectiveAccent; ctx.shadowBlur = 40;
    const xPos = textAlign === "left" ? 80 : 640;
    ctx.fillText(titleText || "Your Title Here", xPos, subtitleText ? 320 : 380);
    if (subtitleText) {
      ctx.shadowBlur = 0;
      const subSize = Math.round(titleSize * 0.55);
      ctx.font = `600 ${subSize}px Syne, sans-serif`; ctx.fillStyle = effectiveAccent;
      ctx.fillText(subtitleText, xPos, 320 + titleSize * 0.7 + 16);
    }
    return canvas.toDataURL("image/png");
  }, [style, effectiveAccent, textColor, titleText, subtitleText, textAlign, isBold, isItalic]);

  const handleGenerate = async () => {
    if (!titleText.trim()) return;
    setGenerating(true);
    setGenerateError(null);
    setGeneratedImageUrl(null);

    const styleNames: Record<string, string> = {
      bold: "bold dramatic cinematic", clean: "clean minimal modern",
      neon: "neon cyberpunk futuristic", gold: "premium luxury gold",
      nature: "natural organic lush", fire: "fire energy intense",
    };
    const prompt = encodeURIComponent(
      `YouTube thumbnail, ${styleNames[selectedStyle] || "dramatic"} style, ` +
      `large bold text "${titleText.slice(0, 60)}", ` +
      `${subtitleText ? `subtitle "${subtitleText.slice(0, 40)}", ` : ""}` +
      `accent color ${effectiveAccent}, professional, eye-catching, high contrast, ` +
      `studio quality, 4k, sharp focus`
    );
    const url = `https://image.pollinations.ai/prompt/${prompt}?width=1280&height=720&nologo=true&model=flux&seed=${Date.now()}`;

    try {
      // Pre-fetch to verify it loads before showing
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject(new Error("Image failed to load"));
        img.src = url;
      });
      setGeneratedImageUrl(url);
          } catch {
      setGenerateError("Generation failed. Check your connection and try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = async () => {
    const filename = `${(titleText || "thumbnail").slice(0, 40).replace(/[^a-z0-9]/gi, "-")}.png`;
    if (generatedImageUrl) {
      try {
        const res = await fetch(generatedImageUrl);
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url; a.download = filename; a.click();
        URL.revokeObjectURL(url);
        return;
      } catch { /* fall through to canvas */ }
    }
    const dataUrl = renderToCanvas();
    const a = document.createElement("a");
    a.href = dataUrl; a.download = filename; a.click();
  };

  const handleGenerateBg = async () => {
    if (!bgPrompt.trim()) return;
    setBgGenerating(true);
    setBgError(null);
    const url = `https://image.pollinations.ai/prompt/${encodeURIComponent(
      `${bgPrompt}, YouTube thumbnail background, cinematic, 4K, no text, wide angle, dramatic lighting, ultra detailed`
    )}?width=1280&height=720&nologo=true&model=flux&seed=${Date.now()}`;
    try {
      await new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = url;
      });
      setBgImageUrl(url);
      setGeneratedImageUrl(url);
          } catch {
      setBgError("Generation failed. Check connection and try again.");
    } finally {
      setBgGenerating(false);
    }
  };

  const handleSaveToLibrary = () => {
    const dataUrl = generatedImageUrl || renderToCanvas();
    setSavedAssets(prev => [{
      id: Date.now().toString(), title: titleText || "Untitled", subtitle: subtitleText,
      style: style.label, accent: effectiveAccent,
      createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      dataUrl,
    }, ...prev]);
    setActiveTab("library");
  };

  const S = {
    card: {
      borderRadius: 16, overflow: "hidden" as const,
      background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
      border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16,
    } as React.CSSProperties,
    cardHeader: { padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" } as React.CSSProperties,
    cardBody: { padding: "16px 18px" } as React.CSSProperties,
    input: {
      width: "100%", boxSizing: "border-box" as const,
      background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)",
      borderRadius: 10, padding: "9px 13px", color: "#e2e8f0", fontSize: 13, outline: "none",
    } as React.CSSProperties,
    label: { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: 6 } as React.CSSProperties,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Topbar title="Thumbnail Studio" subtitle="Create eye-catching YouTube thumbnails" />

      <div style={{ padding: isMobile ? "16px 14px" : "24px 28px", maxWidth: 1300, margin: "0 auto" }}>

        {/* Tabs */}
        <div style={{ display: "inline-flex", padding: 4, borderRadius: 12, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", marginBottom: 22 }}>
          {[
            { id: "create", label: "Create Thumbnail" },
            { id: "library", label: `My Assets (${savedAssets.length ?? 0})` },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as "create" | "library")} style={{
              padding: "8px 20px", borderRadius: 9, fontSize: 13, fontWeight: 600,
              cursor: "pointer", transition: "all 0.15s", border: "none",
              background: activeTab === tab.id ? "rgba(15,24,42,0.95)" : "transparent",
              color: activeTab === tab.id ? "#e2e8f0" : "#475569",
              outline: activeTab === tab.id ? "1px solid rgba(0,212,255,0.18)" : "none",
            }}>{tab.label}</button>
          ))}
        </div>

        {activeTab === "create" ? (
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 300px", gap: isMobile ? 14 : 20 }}>

            {/* Preview column */}
            <div>
              {/* Preview card */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Preview</span>
                    <div style={{ display: "flex", gap: 6 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(255,255,255,0.05)", color: "#64748b", border: "1px solid rgba(255,255,255,0.07)" }}>1280×720</span>
                      <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(0,212,255,0.08)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.18)" }}>16:9</span>
                    </div>
                  </div>
                </div>
                <div style={S.cardBody}>
                  {/* Thumbnail preview */}
                  <div style={{
                    position: "relative", width: "100%", aspectRatio: "16/9", borderRadius: 12, overflow: "hidden",
                    background: `linear-gradient(135deg, ${style.bg[0]}, ${style.bg[1]})`,
                    display: "flex", flexDirection: "column",
                    alignItems: textAlign === "left" ? "flex-start" : "center",
                    justifyContent: "center",
                    userSelect: "none",
                    transform: zoom !== 100 ? `scale(${zoom / 100})` : "none",
                    transformOrigin: "top left",
                    transition: "transform 0.2s",
                  }}>
                    {generatedImageUrl ? (
                      /* AI-generated image */
                      <img src={generatedImageUrl} alt="AI generated thumbnail" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : generating ? (
                      /* Loading state */
                      <>
                        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                        <div style={{ position: "relative", textAlign: "center" }}>
                          <div style={{ width: 36, height: 36, border: "3px solid rgba(0,212,255,0.2)", borderTopColor: "#00D4FF", borderRadius: "50%", animation: "spin 0.8s linear infinite", margin: "0 auto 12px" }} />
                          <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>Generating with AI…</p>
                          <p style={{ fontSize: 11, color: "#64748b", margin: "4px 0 0" }}>This may take 10–20 seconds</p>
                        </div>
                      </>
                    ) : (
                      /* CSS preview */
                      <>
                        <div style={{ position: "absolute", inset: 0, opacity: 0.08, backgroundImage: "linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)", backgroundSize: "40px 40px" }} />
                        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "75%", height: "50%", borderRadius: "50%", filter: "blur(40px)", background: effectiveAccent, opacity: 0.25 }} />
                        <div style={{ position: "relative", textAlign: textAlign, padding: "0 32px", width: "100%" }}>
                          <p style={{
                            fontWeight: isBold ? 800 : 400,
                            fontStyle: isItalic ? "italic" : "normal",
                            color: textColor, lineHeight: 1.2, margin: "0 0 8px",
                            fontSize: "clamp(14px, 3vw, 36px)",
                            textShadow: `0 0 40px ${effectiveAccent}`,
                          }}>
                            {titleText || "Your Title Here"}
                          </p>
                          {subtitleText && (
                            <p style={{ fontWeight: 600, color: effectiveAccent, fontSize: "clamp(10px, 1.8vw, 22px)", margin: 0, opacity: 0.85 }}>
                              {subtitleText}
                            </p>
                          )}
                        </div>
                        <div style={{ position: "absolute", bottom: 10, right: 10, display: "flex", alignItems: "center", gap: 5, padding: "3px 8px", borderRadius: 6, background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)" }}>
                          <ImageIcon size={10} color="#64748b" />
                          <span style={{ fontSize: 10, color: "#64748b" }}>Preview — click Generate for AI image</span>
                        </div>
                      </>
                    )}
                    {generateError && (
                      <div style={{ position: "absolute", bottom: 10, left: 10, right: 10, padding: "6px 10px", borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", textAlign: "center" }}>
                        <span style={{ fontSize: 11, color: "#f87171" }}>{generateError}</span>
                      </div>
                    )}
                  </div>

                  {/* Toolbar */}
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 14, flexWrap: "wrap", rowGap: 8 }}>
                    <div style={{ display: "flex", gap: 2, padding: 4, borderRadius: 9, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>
                      {([
                        { Icon: AlignLeft,   active: textAlign === "left",   action: () => setTextAlign("left") },
                        { Icon: AlignCenter, active: textAlign === "center", action: () => setTextAlign("center") },
                        { Icon: Bold,        active: isBold,                 action: () => setIsBold(b => !b) },
                        { Icon: Italic,      active: isItalic,               action: () => setIsItalic(it => !it) },
                      ] as const).map(({ Icon, active, action }, i) => (
                        <button key={i} onClick={action} style={{
                          padding: 6, borderRadius: 6, border: "none", cursor: "pointer", display: "flex",
                          background: active ? "rgba(0,212,255,0.15)" : "transparent",
                          color: active ? "#00D4FF" : "#94a3b8",
                        }}>
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>
                    <button onClick={() => setZoom(z => Math.min(z + 10, 150))} style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                      <ZoomIn size={12} /> {zoom}%
                    </button>
                    <button onClick={() => { setTitleText("Why 99% of YouTube Channels FAIL"); setSubtitleText("(And How to Be the 1%)"); setSelectedStyle("bold"); setAccentColor(""); setTextColor("#FFFFFF"); setTextAlign("center"); setIsBold(true); setIsItalic(false); setZoom(100); setGeneratedImageUrl(null); setGenerateError(null); }}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", color: "#94a3b8", fontSize: 12, cursor: "pointer" }}>
                      <RotateCcw size={12} /> Reset
                    </button>
                    <div style={{ marginLeft: isMobile ? 0 : "auto", display: "flex", gap: 8, width: isMobile ? "100%" : "auto" }}>
                      <button onClick={handleSaveToLibrary} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)", color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
                        Save to Library
                      </button>
                      <button onClick={handleExport} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 9, background: "linear-gradient(135deg, #00D4FF, #0080cc)", border: "none", color: "#04080F", fontSize: 12, fontWeight: 700, cursor: "pointer" }}>
                        <Download size={12} /> Export PNG
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* AI Background Generation */}
              <div style={S.card}>
                <div style={S.cardBody}>
                  <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(167,139,250,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <Sparkles size={16} color="#a78bfa" />
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0", margin: "0 0 2px" }}>AI Background Generation</p>
                      <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Describe a scene and we&apos;ll generate a stunning background with Flux.1</p>
                    </div>
                    {bgImageUrl && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, padding: "3px 8px", borderRadius: 99, background: "rgba(34,197,94,0.08)", border: "1px solid rgba(34,197,94,0.2)", flexShrink: 0 }}>
                        <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#22c55e" }} />
                        <span style={{ fontSize: 10, fontWeight: 800, color: "#22c55e" }}>Generated</span>
                      </div>
                    )}
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={bgPrompt}
                      onChange={e => setBgPrompt(e.target.value)}
                      onKeyDown={e => { if (e.key === "Enter") handleGenerateBg(); }}
                      placeholder="e.g. Dramatic mountain peak at golden hour, epic cinematic..."
                      style={{ flex: 1, background: "rgba(8,13,26,0.8)", border: "1px solid rgba(0,212,255,0.15)", borderRadius: 10, padding: "10px 14px", color: "#e2e8f0", fontSize: 13, outline: "none" }}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.15)"}
                    />
                    <button
                      onClick={handleGenerateBg}
                      disabled={bgGenerating || !bgPrompt.trim()}
                      style={{
                        display: "flex", alignItems: "center", gap: 6, padding: "10px 16px", borderRadius: 10,
                        border: "none", background: bgGenerating || !bgPrompt.trim() ? "rgba(167,139,250,0.15)" : "linear-gradient(135deg, #a78bfa, #7c3aed)",
                        color: bgGenerating || !bgPrompt.trim() ? "#64748b" : "#fff",
                        fontSize: 12, fontWeight: 700, cursor: bgGenerating || !bgPrompt.trim() ? "not-allowed" : "pointer",
                        flexShrink: 0, whiteSpace: "nowrap" as const,
                      }}
                    >
                      {bgGenerating
                        ? <><div style={{ width: 12, height: 12, border: "2px solid rgba(255,255,255,0.2)", borderTopColor: "#fff", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} /> Generating…</>
                        : <><Wand2 size={13} /> Generate</>
                      }
                    </button>
                  </div>
                  {bgError && (
                    <p style={{ fontSize: 11, color: "#f87171", margin: "8px 0 0" }}>{bgError}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Controls column */}
            <div>
              {/* Text */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Type size={13} color="#00D4FF" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Text</span>
                  </div>
                </div>
                <div style={S.cardBody}>
                  <div style={{ marginBottom: 12 }}>
                    <label style={S.label}>Main Title</label>
                    <input value={titleText} onChange={e => setTitleText(e.target.value)} placeholder="Enter your title..." style={S.input}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <label style={S.label}>Subtitle / Tagline</label>
                    <input value={subtitleText} onChange={e => setSubtitleText(e.target.value)} placeholder="Optional subtitle..." style={S.input}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
                  </div>
                  <div>
                    <label style={S.label}>Text Color</label>
                    <div style={{ display: "flex", gap: 8 }}>
                      {["#FFFFFF", "#00D4FF", "#FF6B35", "#FFD700", "#4ADE80"].map(color => (
                        <button key={color} onClick={() => setTextColor(color)} style={{
                          width: 26, height: 26, borderRadius: "50%", background: color, cursor: "pointer",
                          border: textColor === color ? "2px solid #fff" : "2px solid rgba(255,255,255,0.1)",
                        }} />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Style Presets */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Palette size={13} color="#00D4FF" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Style Presets</span>
                  </div>
                </div>
                <div style={S.cardBody}>
                  <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr 1fr" : "1fr 1fr", gap: 8 }}>
                    {stylePresets.map(preset => (
                      <button key={preset.id} onClick={() => setSelectedStyle(preset.id)} style={{
                        position: "relative", height: 48, borderRadius: 10, overflow: "hidden",
                        background: `linear-gradient(135deg, ${preset.bg[0]}, ${preset.bg[1]})`,
                        border: selectedStyle === preset.id ? "2px solid #00D4FF" : "1px solid rgba(255,255,255,0.1)",
                        cursor: "pointer",
                      }}>
                        <span style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "3px 6px", background: "rgba(0,0,0,0.45)", fontSize: 10, fontWeight: 600, color: "#fff", textAlign: "left", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{preset.label}</span>
                        {selectedStyle === preset.id && (
                          <div style={{ position: "absolute", top: 5, right: 5, width: 10, height: 10, borderRadius: "50%", background: "#00D4FF", boxShadow: "0 0 6px rgba(0,212,255,0.8)" }} />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Background */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Layers size={13} color="#00D4FF" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Accent Color</span>
                  </div>
                </div>
                <div style={S.cardBody}>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["#00D4FF", "#FF6B35", "#FF3333", "#FFD700", "#4ADE80", "#A855F7"].map(color => (
                      <button key={color} onClick={() => setAccentColor(color)} style={{
                        width: 28, height: 28, borderRadius: "50%", background: color, cursor: "pointer",
                        border: effectiveAccent === color ? "2px solid #fff" : "2px solid rgba(255,255,255,0.1)",
                        transition: "transform 0.1s",
                      }}
                        onMouseEnter={e => e.currentTarget.style.transform = "scale(1.15)"}
                        onMouseLeave={e => e.currentTarget.style.transform = "scale(1)"}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ position: "relative" }}>
                {isPro && !generating && (
                  <span style={{
                    position: "absolute", top: -8, right: 10, zIndex: 1,
                    fontSize: 9, fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase",
                    padding: "2px 7px", borderRadius: 99,
                    background: "linear-gradient(135deg, #facc15, #f59e0b)",
                    color: "#1a0a00", boxShadow: "0 2px 8px rgba(250,204,21,0.4)",
                  }}>Priority</span>
                )}
                <button
                  onClick={handleGenerate}
                  disabled={generating}
                  style={{
                    width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    padding: "13px", borderRadius: 12, border: "none",
                    background: "linear-gradient(135deg, #00D4FF, #0080cc)", color: "#04080F",
                    fontSize: 13, fontWeight: 800, cursor: generating ? "not-allowed" : "pointer",
                    opacity: generating ? 0.7 : 1,
                  }}
                >
                  <Wand2 size={15} />
                  {generating ? "Generating with AI…" : generatedImageUrl ? "Regenerate" : "Generate with AI"}
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Library tab */
          savedAssets.length === 0 ? (
            <div style={{ textAlign: "center", padding: "80px 20px" }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <ImageIcon size={28} color="#475569" />
              </div>
              <p style={{ fontSize: 15, fontWeight: 700, color: "#94a3b8", margin: "0 0 6px" }}>No thumbnails yet</p>
              <p style={{ fontSize: 13, color: "#64748b", margin: "0 0 22px" }}>Create your first eye-catching thumbnail with AI.</p>
              <button onClick={() => setActiveTab("create")} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 11, border: "none", background: "linear-gradient(135deg, #00D4FF, #0080cc)", color: "#04080F", fontSize: 13, fontWeight: 800, cursor: "pointer" }}>
                <Plus size={14} /> Create First Thumbnail
              </button>
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
              {savedAssets.map(asset => (
                <div key={asset.id} style={{
                  position: "relative", borderRadius: 14, overflow: "hidden",
                  border: "1px solid rgba(255,255,255,0.07)",
                  background: "linear-gradient(135deg, rgba(15,24,42,0.9), rgba(8,13,26,0.95))",
                }}>
                  {asset.dataUrl
                    ? <img src={asset.dataUrl} alt={asset.title} style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                    : <div style={{ aspectRatio: "16/9", background: "linear-gradient(135deg, #1e293b, #0f172a)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <ImageIcon size={20} color="#475569" />
                      </div>
                  }
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ fontSize: 11, fontWeight: 600, color: "#e2e8f0", margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{asset.title}</p>
                    <p style={{ fontSize: 10, color: "#64748b", margin: 0 }}>{asset.style} · {asset.createdAt}</p>
                  </div>
                  {/* Hover actions */}
                  <div style={{
                    position: "absolute", top: 0, left: 0, right: 0, aspectRatio: "16/9",
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                    background: "rgba(0,0,0,0.55)", opacity: 0, transition: "opacity 0.2s",
                  }}
                    onMouseEnter={e => (e.currentTarget as HTMLDivElement).style.opacity = "1"}
                    onMouseLeave={e => (e.currentTarget as HTMLDivElement).style.opacity = "0"}
                  >
                    <button onClick={() => { if (!asset.dataUrl) return; const a = document.createElement("a"); a.href = asset.dataUrl; a.download = `${asset.title.slice(0, 40).replace(/[^a-z0-9]/gi, "-")}.png`; a.click(); }}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "rgba(255,255,255,0.12)", border: "1px solid rgba(255,255,255,0.15)", color: "#e2e8f0", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      <Download size={11} /> Export
                    </button>
                    <button onClick={() => setSavedAssets(prev => prev.filter(a => a.id !== asset.id))}
                      style={{ display: "flex", alignItems: "center", gap: 5, padding: "6px 12px", borderRadius: 8, background: "rgba(239,68,68,0.15)", border: "1px solid rgba(239,68,68,0.25)", color: "#f87171", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      <Trash2 size={11} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
