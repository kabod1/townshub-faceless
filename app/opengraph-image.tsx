import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Townshub — Faceless Video Studio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 1200,
          height: 630,
          background: "#060B16",
          display: "flex",
          flexDirection: "column",
          padding: "60px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background glow blobs */}
        <div style={{
          position: "absolute", top: -120, left: -80,
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,100,180,0.18) 0%, transparent 70%)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", bottom: -100, right: 100,
          width: 400, height: 400, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(0,212,255,0.10) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Top row: Logo + Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: 22, marginBottom: 52 }}>
          {/* TH Mark */}
          <div style={{
            width: 72, height: 72,
            background: "linear-gradient(145deg, #0B1F4A 0%, #1B4080 60%, #1E5299 100%)",
            borderRadius: 18,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 32px rgba(27,64,128,0.7), inset 0 1px 0 rgba(255,255,255,0.1)",
          }}>
            <div style={{
              display: "flex",
              fontSize: 26,
              fontWeight: 900,
              color: "white",
              letterSpacing: "-1px",
            }}>TH</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <div style={{
              fontSize: 38,
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "-1px",
              display: "flex",
            }}>
              Townshub
            </div>
            <div style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#00D4FF",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              display: "flex",
            }}>
              Faceless Video Studio
            </div>
          </div>

          {/* Right badge */}
          <div style={{
            marginLeft: "auto",
            padding: "8px 20px",
            background: "rgba(0,212,255,0.08)",
            border: "1px solid rgba(0,212,255,0.25)",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 700,
            color: "#00D4FF",
            display: "flex",
          }}>
            Powered by AI
          </div>
        </div>

        {/* Main headline */}
        <div style={{
          fontSize: 68,
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.05,
          letterSpacing: "-2.5px",
          marginBottom: 20,
          display: "flex",
          flexDirection: "column",
        }}>
          <span style={{ display: "flex" }}>Script. Record. Publish.</span>
          <span style={{ color: "#00D4FF", display: "flex" }}>All in one studio.</span>
        </div>

        {/* Subtitle */}
        <div style={{
          fontSize: 22,
          color: "#64748b",
          marginBottom: 44,
          display: "flex",
        }}>
          AI scripts · ElevenLabs voiceover · Video rendering · Social publishing
        </div>

        {/* Feature pills row */}
        <div style={{ display: "flex", gap: 10, flexWrap: "nowrap" }}>
          {[
            { label: "AI Scripts",     color: "#00D4FF", bg: "rgba(0,212,255,0.08)",  border: "rgba(0,212,255,0.25)" },
            { label: "AI Voiceover",   color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.3)" },
            { label: "Video Maker",    color: "#a855f7", bg: "rgba(168,85,247,0.08)", border: "rgba(168,85,247,0.3)" },
            { label: "Thumbnails",     color: "#fb923c", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.3)" },
            { label: "YT Scheduler",   color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.25)" },
            { label: "Social Publish", color: "#3b82f6", bg: "rgba(59,130,246,0.08)", border: "rgba(59,130,246,0.3)" },
            { label: "Script Scores",  color: "#00D4FF", bg: "rgba(0,212,255,0.06)",  border: "rgba(0,212,255,0.18)" },
          ].map(f => (
            <div
              key={f.label}
              style={{
                padding: "10px 18px",
                background: f.bg,
                border: `1px solid ${f.border}`,
                borderRadius: 10,
                fontSize: 15,
                fontWeight: 700,
                color: f.color,
                display: "flex",
                whiteSpace: "nowrap",
              }}
            >
              {f.label}
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div style={{
          marginTop: "auto",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}>
          <div style={{ fontSize: 15, color: "#334155", display: "flex" }}>
            townshub.com
          </div>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 14, color: "#1e3a5f",
          }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#00D4FF", display: "flex" }} />
            Build your faceless empire today
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
