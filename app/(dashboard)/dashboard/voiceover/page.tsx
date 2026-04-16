"use client";

import React, { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Mic,
  Play,
  Pause,
  Download,
  Wand2,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Volume2,
  Clock,
} from "lucide-react";

const VOICES = [
  { id: "pNInz6obpgDQGcFmaJgB", name: "Adam", gender: "Male", style: "Narration", desc: "Deep, authoritative" },
  { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel", gender: "Female", style: "Narrative", desc: "Calm, professional" },
  { id: "IKne3meq5aSn9XLyUdCD", name: "Charlie", gender: "Male", style: "Conversational", desc: "Casual, engaging" },
  { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi", gender: "Female", style: "Strong", desc: "Confident, bold" },
  { id: "TX3LPaxmHKxFdv7VOQHJ", name: "Liam", gender: "Male", style: "Articulate", desc: "Clear, precise" },
  { id: "TxGEqnHWrfWFTfGW9XjX", name: "Josh", gender: "Male", style: "Deep", desc: "Warm, baritone" },
  { id: "MF3mGyEYCl7XYWbV9V6O", name: "Elli", gender: "Female", style: "Young", desc: "Bright, expressive" },
  { id: "XB0fDUnXU5powFXDhCwa", name: "Charlotte", gender: "Female", style: "Warm", desc: "Friendly, approachable" },
];

const CARD_STYLE: React.CSSProperties = {
  background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: 14,
  padding: "20px 22px",
  marginBottom: 16,
};

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: "#64748b",
  textTransform: "uppercase",
  letterSpacing: "0.08em",
  marginBottom: 8,
  display: "block",
};

const SLIDER_STYLE: React.CSSProperties = {
  width: "100%",
  accentColor: "#00D4FF",
  cursor: "pointer",
};

export default function VoiceoverPage() {
  const [text, setText] = useState("");
  const [voiceId, setVoiceId] = useState("pNInz6obpgDQGcFmaJgB");
  const [stability, setStability] = useState(0.5);
  const [similarityBoost, setSimilarityBoost] = useState(0.75);
  const [speed, setSpeed] = useState(1.0);
  const [generating, setGenerating] = useState(false);
  const [audioBase64, setAudioBase64] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

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
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
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
        if (!data.audioBase64) {
          setError("No audio data returned. Check your n8n workflow.");
        }
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Network error");
    } finally {
      setGenerating(false);
    }
  }

  function handleDownload() {
    if (!audioBase64) return;
    const byteChars = atob(audioBase64);
    const byteNums = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) byteNums[i] = byteChars.charCodeAt(i);
    const byteArray = new Uint8Array(byteNums);
    const blob = new Blob([byteArray], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `townshub-voiceover-${Date.now()}.mp3`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function togglePlay() {
    if (!audioBase64) return;
    if (!audioRef.current) {
      const audio = new Audio(`data:audio/mpeg;base64,${audioBase64}`);
      audio.onended = () => setIsPlaying(false);
      audioRef.current = audio;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
  }

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A", color: "#e2e8f0", display: "flex", flexDirection: "column" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <Topbar
        title="AI Voiceover Studio"
        subtitle="Generate professional voiceovers from your scripts"
      />

      <div style={{ flex: 1, padding: "24px 28px", display: "flex", gap: 20, alignItems: "flex-start", flexWrap: "wrap" }}>

        {/* LEFT PANEL */}
        <div style={{ flex: 1, minWidth: 320 }}>

          {/* Script Text Card */}
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <Mic size={15} color="#00D4FF" />
                <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Script Text</span>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <span style={{
                  fontSize: 11, fontWeight: 600, color: "#00D4FF",
                  background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
                  borderRadius: 6, padding: "2px 10px",
                }}>
                  {wordCount} words
                </span>
                {wordCount > 0 && (
                  <span style={{
                    fontSize: 11, fontWeight: 600, color: "#94a3b8",
                    background: "rgba(148,163,184,0.08)", border: "1px solid rgba(148,163,184,0.15)",
                    borderRadius: 6, padding: "2px 10px",
                    display: "flex", alignItems: "center", gap: 4,
                  }}>
                    <Clock size={10} />
                    ~{estimatedDuration}
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

          {/* Voice Selector Card */}
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Volume2 size={15} color="#00D4FF" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Choose Voice</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {VOICES.map(voice => (
                <button
                  key={voice.id}
                  onClick={() => setVoiceId(voice.id)}
                  style={{
                    background: voiceId === voice.id
                      ? "rgba(0,212,255,0.08)"
                      : "rgba(0,0,0,0.2)",
                    border: voiceId === voice.id
                      ? "1px solid rgba(0,212,255,0.5)"
                      : "1px solid rgba(255,255,255,0.06)",
                    borderRadius: 10, padding: "12px 14px",
                    cursor: "pointer", textAlign: "left",
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: voiceId === voice.id ? "#00D4FF" : "#e2e8f0" }}>
                      {voice.name}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, borderRadius: 4, padding: "1px 7px",
                      background: voice.gender === "Male" ? "rgba(59,130,246,0.15)" : "rgba(236,72,153,0.15)",
                      color: voice.gender === "Male" ? "#60a5fa" : "#f472b6",
                      border: voice.gender === "Male" ? "1px solid rgba(59,130,246,0.3)" : "1px solid rgba(236,72,153,0.3)",
                    }}>
                      {voice.gender === "Male" ? "M" : "F"}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 2 }}>{voice.style}</div>
                  <div style={{ fontSize: 11, color: "#64748b" }}>{voice.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Audio Settings Card */}
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
              <Volume2 size={15} color="#00D4FF" />
              <span style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0" }}>Audio Settings</span>
            </div>

            {/* Stability */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>Stability</label>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#00D4FF" }}>{stability.toFixed(2)}</span>
              </div>
              <input type="range" min={0} max={1} step={0.05} value={stability}
                onChange={e => setStability(Number(e.target.value))} style={SLIDER_STYLE} />
              <p style={{ fontSize: 11, color: "#64748b", margin: "6px 0 0" }}>
                More stable = consistent tone. Lower = more expressive.
              </p>
            </div>

            {/* Clarity */}
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>Clarity</label>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#00D4FF" }}>{similarityBoost.toFixed(2)}</span>
              </div>
              <input type="range" min={0} max={1} step={0.05} value={similarityBoost}
                onChange={e => setSimilarityBoost(Number(e.target.value))} style={SLIDER_STYLE} />
              <p style={{ fontSize: 11, color: "#64748b", margin: "6px 0 0" }}>
                Higher = closer to original voice.
              </p>
            </div>

            {/* Speed */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                <label style={{ ...LABEL_STYLE, marginBottom: 0 }}>Speed</label>
                <span style={{ fontSize: 12, fontWeight: 700, color: "#00D4FF" }}>{speed.toFixed(1)}x</span>
              </div>
              <input type="range" min={0.5} max={2.0} step={0.1} value={speed}
                onChange={e => setSpeed(Number(e.target.value))} style={SLIDER_STYLE} />
              <p style={{ fontSize: 11, color: "#64748b", margin: "6px 0 0" }}>
                1.0 is natural speed.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ width: 320, flexShrink: 0 }}>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!text.trim() || generating}
            style={{
              width: "100%", padding: "14px 20px",
              background: (!text.trim() || generating)
                ? "rgba(0,212,255,0.15)"
                : "linear-gradient(135deg, #00D4FF, #0080cc)",
              border: "none", borderRadius: 12, cursor: (!text.trim() || generating) ? "not-allowed" : "pointer",
              color: (!text.trim() || generating) ? "rgba(0,212,255,0.5)" : "#04080F",
              fontSize: 14, fontWeight: 800,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              marginBottom: 16,
              boxShadow: (!text.trim() || generating) ? "none" : "0 0 20px rgba(0,212,255,0.3)",
              transition: "all 0.2s",
            }}
          >
            <Wand2 size={16} />
            {generating ? "Generating…" : "Generate Voiceover"}
          </button>

          {/* Generating Spinner */}
          {generating && (
            <div style={{ ...CARD_STYLE, textAlign: "center", padding: "28px 22px" }}>
              <div style={{
                width: 40, height: 40, borderRadius: "50%",
                border: "3px solid rgba(0,212,255,0.15)",
                borderTopColor: "#00D4FF",
                animation: "spin 0.8s linear infinite",
                margin: "0 auto 16px",
              }} />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#e2e8f0", marginBottom: 6 }}>
                Generating voiceover…
              </div>
              <div style={{ fontSize: 12, color: "#64748b" }}>Usually 5–15 seconds</div>
            </div>
          )}

          {/* Audio Player */}
          {audioBase64 && !generating && (
            <div style={{ ...CARD_STYLE }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <CheckCircle2 size={15} color="#22c55e" />
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Voiceover Ready</span>
              </div>

              {/* Play/Pause */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, marginBottom: 16 }}>
                <button
                  onClick={togglePlay}
                  style={{
                    width: 64, height: 64, borderRadius: "50%",
                    background: "linear-gradient(135deg, #00D4FF, #0080cc)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 0 24px rgba(0,212,255,0.35)",
                    transition: "all 0.2s",
                  }}
                >
                  {isPlaying ? <Pause size={24} color="#04080F" /> : <Play size={24} color="#04080F" />}
                </button>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                  <Clock size={12} />
                  <span>~{estimatedDuration}</span>
                </div>
              </div>

              {/* Download */}
              <button
                onClick={handleDownload}
                style={{
                  width: "100%", padding: "10px 16px",
                  background: "rgba(0,212,255,0.08)",
                  border: "1px solid rgba(0,212,255,0.25)",
                  borderRadius: 10, cursor: "pointer",
                  color: "#00D4FF", fontSize: 13, fontWeight: 700,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                  marginBottom: 10,
                  transition: "all 0.15s",
                }}
              >
                <Download size={14} />
                Download MP3
              </button>

              {/* Regenerate */}
              <button
                onClick={handleGenerate}
                style={{
                  width: "100%", padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.08)",
                  borderRadius: 10, cursor: "pointer",
                  color: "#94a3b8", fontSize: 12, fontWeight: 600,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                  transition: "all 0.15s",
                }}
              >
                <RefreshCw size={12} />
                Regenerate
              </button>
            </div>
          )}

          {/* Error */}
          {error && !generating && (
            <div style={{
              ...CARD_STYLE,
              border: "1px solid rgba(239,68,68,0.3)",
              background: "rgba(239,68,68,0.06)",
            }}>
              <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                <AlertCircle size={16} color="#ef4444" style={{ flexShrink: 0, marginTop: 1 }} />
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#ef4444", marginBottom: 4 }}>Error</div>
                  <div style={{ fontSize: 12, color: "#fca5a5", lineHeight: 1.5 }}>{error}</div>
                </div>
              </div>
            </div>
          )}

          {/* How it works */}
          <div style={CARD_STYLE}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <Mic size={14} color="#00D4FF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>How it works</span>
            </div>
            {[
              { n: 1, text: "Paste your script into the text area" },
              { n: 2, text: "Choose a voice & adjust settings" },
              { n: 3, text: "Click Generate, then download your MP3" },
            ].map(step => (
              <div key={step.n} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 12 }}>
                <div style={{
                  width: 22, height: 22, borderRadius: "50%", flexShrink: 0,
                  background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 11, fontWeight: 800, color: "#00D4FF",
                }}>{step.n}</div>
                <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5, paddingTop: 2 }}>{step.text}</span>
              </div>
            ))}
          </div>

          {/* Note */}
          <div style={{
            background: "rgba(245,158,11,0.06)",
            border: "1px solid rgba(245,158,11,0.2)",
            borderRadius: 10, padding: "12px 16px",
          }}>
            <p style={{ fontSize: 11, color: "#fbbf24", margin: 0, lineHeight: 1.5 }}>
              Powered by ElevenLabs. Requires API key in n8n credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
