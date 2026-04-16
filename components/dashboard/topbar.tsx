"use client";

import Link from "next/link";
import { Bell, Menu } from "lucide-react";
import { useEffect, useState } from "react";

interface TopbarProps {
  title: string;
  subtitle?: string;
  action?: { label: string; href?: string; onClick?: () => void; icon?: React.ReactNode };
  channelName?: string;
  wordCount?: number;
}

export function Topbar({ title, subtitle, action, channelName, wordCount }: TopbarProps) {
  const [activeChannel, setActiveChannel] = useState<string | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (channelName) { setActiveChannel(channelName); return; }
    const saved = localStorage.getItem("townshub_channel_name");
    if (saved) setActiveChannel(saved);
  }, [channelName]);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <header style={{
      height: 60, display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: isMobile ? "0 16px" : "0 28px",
      borderBottom: "1px solid rgba(255,255,255,0.04)",
      background: "rgba(7,12,24,0.9)",
      backdropFilter: "blur(12px)",
      position: "sticky", top: 0, zIndex: 20,
      flexShrink: 0,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        {isMobile && (
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("toggle-sidebar"))}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8", display: "flex", alignItems: "center", padding: 4, flexShrink: 0 }}
          >
            <Menu size={20} />
          </button>
        )}
        <div>
          <h1 style={{ fontSize: isMobile ? 14 : 16, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: "-0.3px" }}>{title}</h1>
          {subtitle && <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>{subtitle}</p>}
        </div>
        {wordCount !== undefined && wordCount > 0 && (
          <span style={{
            fontSize: 11, fontWeight: 700, color: "#00D4FF",
            background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.15)",
            borderRadius: 6, padding: "3px 10px",
          }}>
            {wordCount.toLocaleString()} words
          </span>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        {activeChannel && !isMobile && (
          <div style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "5px 12px 5px 6px",
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
            borderRadius: 20, cursor: "pointer",
          }}>
            <div style={{
              width: 22, height: 22, borderRadius: "50%",
              background: "linear-gradient(135deg, #f97316, #dc2626)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 10, fontWeight: 800, color: "#fff", flexShrink: 0,
            }}>
              {activeChannel[0].toUpperCase()}
            </div>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#94a3b8", maxWidth: 140, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              {activeChannel}
            </span>
          </div>
        )}
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

        {action && (action.href ? (
          <Link href={action.href} style={{
            display: "flex", alignItems: "center", gap: 7,
            padding: "8px 16px", borderRadius: 9,
            background: "linear-gradient(135deg, #00D4FF, #0080cc)",
            color: "#04080F", fontSize: 12,
            fontWeight: 700, textDecoration: "none",
            boxShadow: "0 0 16px rgba(0,212,255,0.25)",
          }}>
            {action.icon}
            {action.label}
          </Link>
        ) : (
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
        ))}
      </div>
    </header>
  );
}
