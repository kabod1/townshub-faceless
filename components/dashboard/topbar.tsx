"use client";

import { Bell } from "lucide-react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href?: string; onClick?: () => void; icon?: React.ReactNode };
}

export function Topbar({ title, subtitle, action }: TopbarProps) {
  return (
    <header style={{
      height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "0 28px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      background: "rgba(7,12,24,0.9)",
      backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 20,
      flexShrink: 0,
    }}>
      <div>
        <h1 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{title}</h1>
        {subtitle && <p style={{ fontSize: 11, color: "#334155", margin: "2px 0 0" }}>{subtitle}</p>}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <button style={{
          position: "relative", width: 34, height: 34,
          display: "flex", alignItems: "center", justifyContent: "center",
          borderRadius: 9, border: "1px solid rgba(255,255,255,0.06)",
          background: "transparent", cursor: "pointer", color: "#475569",
          transition: "all 0.2s",
        }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.2)";
            (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)";
            (e.currentTarget as HTMLButtonElement).style.color = "#475569";
          }}
        >
          <Bell size={15} />
          <span style={{
            position: "absolute", top: 8, right: 8,
            width: 6, height: 6, borderRadius: "50%",
            background: "#f97316", border: "1px solid #070C18",
          }} />
        </button>

        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: "linear-gradient(135deg, #f97316, #dc2626)",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 13, fontWeight: 800, color: "#fff",
          boxShadow: "0 0 12px rgba(249,115,22,0.3)",
          cursor: "pointer",
        }}>T</div>

        {action && (
          <button
            onClick={action.onClick}
            style={{
              display: "flex", alignItems: "center", gap: 7,
              padding: "8px 16px", borderRadius: 9,
              background: "linear-gradient(135deg, #00D4FF, #0080cc)",
              border: "none", color: "#04080F", fontSize: 12,
              fontWeight: 700, cursor: "pointer",
              boxShadow: "0 0 16px rgba(0,212,255,0.25)",
              transition: "all 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 24px rgba(0,212,255,0.4)"}
            onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 0 16px rgba(0,212,255,0.25)"}
          >
            {action.icon}
            {action.label}
          </button>
        )}
      </div>
    </header>
  );
}
