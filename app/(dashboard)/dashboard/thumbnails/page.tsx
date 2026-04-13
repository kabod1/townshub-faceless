"use client";

import { useState, useCallback } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input, Select } from "@/components/ui/input";
import {
  Image, Wand2, Download, Copy, Plus,
  Palette, Type, Layers, Sparkles, ZoomIn, RotateCcw,
  AlignLeft, AlignCenter, Bold, Italic, Lock, Trash2
} from "lucide-react";

const stylePresets = [
  { id: "bold", label: "Bold & Dramatic", bg: "from-red-900 to-black", accent: "#FF3333" },
  { id: "clean", label: "Clean & Minimal", bg: "from-slate-800 to-slate-900", accent: "#00D4FF" },
  { id: "neon", label: "Neon Cyberpunk", bg: "from-purple-900 to-black", accent: "#FF00FF" },
  { id: "gold", label: "Premium Gold", bg: "from-amber-900 to-stone-900", accent: "#FFD700" },
  { id: "nature", label: "Natural Organic", bg: "from-green-900 to-emerald-950", accent: "#4ADE80" },
  { id: "fire", label: "Fire & Energy", bg: "from-orange-900 to-red-950", accent: "#FF6B35" },
];

const bgStyles = [
  { value: "solid", label: "Solid Color" },
  { value: "gradient", label: "Gradient" },
  { value: "image", label: "AI Generated Image" },
  { value: "split", label: "Split Layout" },
];

// Maps Tailwind gradient class pairs to real CSS gradient strings for canvas
const GRADIENT_MAP: Record<string, [string, string]> = {
  "from-red-900 to-black":          ["#7f1d1d", "#000000"],
  "from-slate-800 to-slate-900":    ["#1e293b", "#0f172a"],
  "from-purple-900 to-black":       ["#581c87", "#000000"],
  "from-amber-900 to-stone-900":    ["#78350f", "#1c1917"],
  "from-green-900 to-emerald-950":  ["#14532d", "#022c22"],
  "from-orange-900 to-red-950":     ["#7c2d12", "#450a0a"],
};

interface ThumbnailAsset {
  id: string;
  title: string;
  subtitle: string;
  style: string;
  accent: string;
  createdAt: string;
  dataUrl?: string;
}

export default function ThumbnailsPage() {
  const [activeTab, setActiveTab] = useState<"create" | "library">("create");
  const [titleText, setTitleText] = useState("Why 99% of YouTube Channels FAIL");
  const [subtitleText, setSubtitleText] = useState("(And How to Be the 1%)");
  const [selectedStyle, setSelectedStyle] = useState("bold");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [bgStyle, setBgStyle] = useState("gradient");
  const [savedAssets, setSavedAssets] = useLocalStorage<ThumbnailAsset[]>("th_thumbnails", []);
  const [textColor, setTextColor] = useState("#FFFFFF");
  const [accentColor, setAccentColor] = useState("");

  const style = stylePresets.find(s => s.id === selectedStyle)!;
  const effectiveAccent = accentColor || style.accent;

  // Renders the thumbnail to a 1280×720 canvas and returns a data URL
  const renderToCanvas = useCallback((): string => {
    const canvas = document.createElement("canvas");
    canvas.width = 1280;
    canvas.height = 720;
    const ctx = canvas.getContext("2d")!;

    // Background gradient
    const [c1, c2] = GRADIENT_MAP[style.bg] ?? ["#111827", "#000000"];
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, c1);
    grad.addColorStop(1, c2);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Accent glow at top-centre
    const radial = ctx.createRadialGradient(640, 0, 0, 640, 0, 500);
    radial.addColorStop(0, `${effectiveAccent}55`);
    radial.addColorStop(1, "transparent");
    ctx.fillStyle = radial;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dot grid
    ctx.fillStyle = "rgba(255,255,255,0.04)";
    for (let x = 0; x < canvas.width; x += 40) {
      for (let y = 0; y < canvas.height; y += 40) {
        ctx.beginPath();
        ctx.arc(x, y, 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Title text
    const titleSize = Math.min(96, Math.floor(1280 / (titleText.length * 0.55 + 4)));
    ctx.font = `bold ${titleSize}px Syne, sans-serif`;
    ctx.fillStyle = textColor;
    ctx.textAlign = "center";
    ctx.shadowColor = effectiveAccent;
    ctx.shadowBlur = 40;
    ctx.fillText(titleText || "Your Title Here", 640, subtitleText ? 320 : 380);

    // Subtitle
    if (subtitleText) {
      ctx.shadowBlur = 0;
      const subSize = Math.round(titleSize * 0.55);
      ctx.font = `600 ${subSize}px Syne, sans-serif`;
      ctx.fillStyle = effectiveAccent;
      ctx.fillText(subtitleText, 640, 320 + titleSize * 0.7 + 16);
    }

    return canvas.toDataURL("image/png");
  }, [style, effectiveAccent, textColor, titleText, subtitleText]);

  const handleGenerate = async () => {
    setGenerating(true);
    await new Promise((r) => setTimeout(r, 800)); // brief "generating" UX
    setGenerating(false);
    setGenerated(true);
  };

  const handleExport = () => {
    const dataUrl = renderToCanvas();
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `${(titleText || "thumbnail").slice(0, 40).replace(/[^a-z0-9]/gi, "-")}.png`;
    a.click();
  };

  const handleSaveToLibrary = () => {
    const dataUrl = renderToCanvas();
    const asset: ThumbnailAsset = {
      id: Date.now().toString(),
      title: titleText || "Untitled",
      subtitle: subtitleText,
      style: style.label,
      accent: effectiveAccent,
      createdAt: new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
      dataUrl,
    };
    setSavedAssets((prev) => [asset, ...prev]);
    setActiveTab("library");
  };

  return (
    <div className="min-h-screen">
      <Topbar title="Thumbnail Studio" />

      <div className="p-6 max-w-7xl mx-auto">

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/3 border border-white/8 w-fit mb-6">
          {[
            { id: "create", label: "Create Thumbnail" },
            { id: "library", label: `My Assets (${savedAssets.length ?? 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as "create" | "library")}
              className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all font-[family-name:var(--font-syne)] ${
                activeTab === tab.id
                  ? "bg-[#162035] text-white border border-cyan-500/20 shadow-sm"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "create" ? (
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

            {/* Preview */}
            <div className="lg:col-span-3 space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Preview</h3>
                    <div className="flex gap-2">
                      <Badge variant="neutral">1280×720</Badge>
                      <Badge variant="cyan">16:9</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardBody>
                  {/* Thumbnail Preview Canvas */}
                  <div className={`relative w-full aspect-video rounded-xl overflow-hidden bg-gradient-to-br ${style.bg} flex flex-col items-center justify-center select-none`}>
                    {/* Grid overlay */}
                    <div className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
                        backgroundSize: "40px 40px"
                      }}
                    />
                    {/* Accent glow */}
                    <div
                      className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-1/2 rounded-full blur-3xl opacity-30"
                      style={{ background: style.accent }}
                    />
                    {/* Content */}
                    <div className="relative text-center px-8">
                      <p
                        className="font-bold font-[family-name:var(--font-syne)] text-white drop-shadow-lg leading-tight"
                        style={{ fontSize: "clamp(14px, 3vw, 32px)", textShadow: `0 0 40px ${style.accent}` }}
                      >
                        {titleText || "Your Title Here"}
                      </p>
                      {subtitleText && (
                        <p
                          className="mt-2 font-semibold font-[family-name:var(--font-syne)] opacity-80"
                          style={{ color: style.accent, fontSize: "clamp(10px, 1.8vw, 20px)" }}
                        >
                          {subtitleText}
                        </p>
                      )}
                    </div>
                    {/* Watermark */}
                    {!generated && (
                      <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-2 py-1 rounded bg-black/40 border border-white/10">
                        <Image size={10} className="text-slate-400" />
                        <span className="text-[10px] text-slate-400">Preview</span>
                      </div>
                    )}
                  </div>

                  {/* Toolbar */}
                  <div className="flex items-center gap-2 mt-4 flex-wrap">
                    <div className="flex gap-1 p-1 rounded-lg bg-white/3 border border-white/8">
                      {[AlignLeft, AlignCenter, Bold, Italic].map((Icon, i) => (
                        <button key={i} className="p-1.5 rounded text-slate-500 hover:text-slate-300 hover:bg-white/8 transition-all">
                          <Icon size={13} />
                        </button>
                      ))}
                    </div>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/3 border border-white/8 text-slate-500 hover:text-slate-300 text-xs transition-all">
                      <ZoomIn size={12} /> Zoom
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/3 border border-white/8 text-slate-500 hover:text-slate-300 text-xs transition-all">
                      <RotateCcw size={12} /> Reset
                    </button>
                    <div className="ml-auto flex gap-2">
                      <Button size="sm" variant="outline" icon={<Copy size={12} />} onClick={handleSaveToLibrary}>Save to Library</Button>
                      <Button size="sm" icon={<Download size={12} />} onClick={handleExport}>Export PNG</Button>
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* AI Generate */}
              <Card>
                <CardBody>
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                      <Sparkles size={16} className="text-violet-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">AI Background Generation</p>
                      <p className="text-xs text-slate-500 mt-0.5">Describe a scene and we&apos;ll generate a stunning background with Flux.1</p>
                    </div>
                    <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20 shrink-0">
                      <Lock size={10} className="text-yellow-400" />
                      <span className="text-[10px] font-bold text-yellow-400 font-[family-name:var(--font-syne)]">PRO</span>
                    </div>
                  </div>
                  <div className="mt-3 flex gap-2">
                    <input
                      placeholder="e.g. Dramatic mountain peak at golden hour, epic cinematic..."
                      className="flex-1 bg-[#0F1829]/80 border border-cyan-500/15 rounded-lg px-4 py-2.5 text-sm text-slate-200 placeholder-slate-600 focus:outline-none focus:border-cyan-500/40 transition-all opacity-50 cursor-not-allowed"
                      disabled
                    />
                    <Button size="md" variant="outline" disabled icon={<Wand2 size={14} />}>Generate</Button>
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Controls */}
            <div className="lg:col-span-2 space-y-4">

              {/* Text */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Type size={13} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Text</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Input
                    label="Main Title"
                    value={titleText}
                    onChange={(e) => setTitleText(e.target.value)}
                    placeholder="Enter your title..."
                  />
                  <Input
                    label="Subtitle / Tagline"
                    value={subtitleText}
                    onChange={(e) => setSubtitleText(e.target.value)}
                    placeholder="Optional subtitle..."
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500 font-[family-name:var(--font-syne)] font-semibold uppercase tracking-widest">Text Color</span>
                    <div className="flex gap-2 ml-auto">
                      {["#FFFFFF", "#00D4FF", "#FF6B35", "#FFD700", "#4ADE80"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setTextColor(color)}
                          className="w-6 h-6 rounded-full border-2 transition-all"
                          style={{ background: color, borderColor: textColor === color ? "white" : "rgba(255,255,255,0.1)" }}
                        />
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>

              {/* Style Presets */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Palette size={13} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Style Presets</h3>
                  </div>
                </CardHeader>
                <CardBody>
                  <div className="grid grid-cols-2 gap-2">
                    {stylePresets.map((preset) => (
                      <button
                        key={preset.id}
                        onClick={() => setSelectedStyle(preset.id)}
                        className={`relative h-12 rounded-lg bg-gradient-to-br ${preset.bg} overflow-hidden border transition-all ${
                          selectedStyle === preset.id ? "border-cyan-400" : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        <span className="absolute inset-x-0 bottom-0 px-2 py-1 text-[10px] font-semibold text-white font-[family-name:var(--font-syne)] bg-black/40 truncate">
                          {preset.label}
                        </span>
                        {selectedStyle === preset.id && (
                          <div className="absolute top-1.5 right-1.5 w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(0,212,255,0.8)]" />
                        )}
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>

              {/* Background */}
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Layers size={13} className="text-cyan-400" />
                    <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Background</h3>
                  </div>
                </CardHeader>
                <CardBody className="space-y-3">
                  <Select
                    label="Background Type"
                    value={bgStyle}
                    onChange={(e) => setBgStyle(e.target.value)}
                    options={bgStyles}
                  />
                  <div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2 font-[family-name:var(--font-syne)]">Accent Color</p>
                    <div className="flex gap-2">
                      {["#00D4FF", "#FF6B35", "#FF3333", "#FFD700", "#4ADE80", "#A855F7"].map((color) => (
                        <button
                          key={color}
                          onClick={() => setAccentColor(color)}
                          className="w-7 h-7 rounded-full border-2 transition-all hover:scale-110"
                          style={{ background: color, borderColor: effectiveAccent === color ? "white" : "rgba(255,255,255,0.1)" }}
                        />
                      ))}
                    </div>
                  </div>
                </CardBody>
              </Card>

              <Button
                size="lg"
                loading={generating}
                onClick={handleGenerate}
                icon={<Wand2 size={16} />}
                className="w-full justify-center"
              >
                {generating ? "Creating thumbnail..." : "Generate Thumbnail"}
              </Button>
            </div>
          </div>
        ) : (
          /* Library Tab */
          <div>
            {savedAssets.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <div className="w-16 h-16 rounded-full bg-white/3 border border-white/8 flex items-center justify-center">
                  <Image size={28} className="text-slate-600" />
                </div>
                <div className="text-center">
                  <p className="text-base font-bold text-slate-400 font-[family-name:var(--font-syne)]">No thumbnails yet</p>
                  <p className="text-sm text-slate-600 mt-1">Create your first eye-catching thumbnail with AI.</p>
                </div>
                <Button onClick={() => setActiveTab("create")} icon={<Plus size={14} />}>
                  Create First Thumbnail
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {savedAssets.map((asset) => (
                  <div key={asset.id} className="group relative rounded-xl border border-white/8 bg-[#162035]/80 overflow-hidden hover:border-cyan-500/25 hover:shadow-[0_0_20px_rgba(0,212,255,0.08)] transition-all">
                    {/* Thumbnail preview */}
                    {asset.dataUrl
                      ? <img src={asset.dataUrl} alt={asset.title} className="w-full aspect-video object-cover" />
                      : <div className="aspect-video bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                          <Image size={20} className="text-slate-600" />
                        </div>
                    }
                    {/* Hover actions overlay */}
                    <div className="absolute inset-x-0 top-0 aspect-video flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200 bg-black/55 backdrop-blur-[2px]">
                      <button
                        onClick={() => {
                          if (!asset.dataUrl) return;
                          const a = document.createElement("a");
                          a.href = asset.dataUrl;
                          a.download = `${asset.title.slice(0, 40).replace(/[^a-z0-9]/gi, "-")}.png`;
                          a.click();
                        }}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all backdrop-blur-sm"
                        style={{ background: "rgba(255,255,255,0.12)", color: "#E8F0FF", border: "1px solid rgba(255,255,255,0.15)" }}
                      >
                        <Download size={11} /> Export
                      </button>
                      <button
                        onClick={() => setSavedAssets((prev) => prev.filter((a) => a.id !== asset.id))}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                        style={{ background: "rgba(239,68,68,0.15)", color: "#F87171", border: "1px solid rgba(239,68,68,0.25)" }}
                      >
                        <Trash2 size={11} /> Delete
                      </button>
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-semibold text-white truncate font-[family-name:var(--font-syne)]">{asset.title}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">{asset.style} · {asset.createdAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
