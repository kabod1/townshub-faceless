"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  LayoutDashboard, Sparkles, Lightbulb, PenLine, ScrollText,
  Kanban, Image, Compass, Users, CreditCard, Settings,
  LogOut, ChevronLeft, Mic, CalendarClock, Share2,
} from "lucide-react";

function THMark({ size = 32 }: { size?: number }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: Math.round(size * 0.28), flexShrink: 0,
      background: "#ffffff",
      display: "flex", alignItems: "center", justifyContent: "center",
      boxShadow: "0 2px 12px rgba(0,0,0,0.35)",
      overflow: "hidden",
    }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/logo.svg"
        alt="Townshub"
        width={size * 0.82}
        height={size * 0.82}
        style={{ display: "block" }}
      />
    </div>
  );
}
import { useState } from "react";

const nav = [
  {
    section: "WORKSPACE",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/style", label: "My Style", icon: Sparkles },
      { href: "/dashboard/ideas", label: "Video Ideas", icon: Lightbulb },
      { href: "/dashboard/new-script", label: "New Script", icon: PenLine },
      { href: "/dashboard/scripts", label: "My Scripts", icon: ScrollText },
    ],
  },
  {
    section: "PRODUCTION",
    items: [
      { href: "/dashboard/production", label: "Production Board", icon: Kanban },
      { href: "/dashboard/thumbnails", label: "Thumbnails", icon: Image },
      { href: "/dashboard/voiceover", label: "AI Voiceover", icon: Mic },
      { href: "/dashboard/scheduler", label: "YT Scheduler", icon: CalendarClock },
      { href: "/dashboard/publish", label: "Social Channels", icon: Share2 },
      { href: "/dashboard/niche-finder", label: "Niche Finder", icon: Compass },
    ],
  },
  {
    section: "ACCOUNT",
    items: [
      { href: "/dashboard/team", label: "Team", icon: Users },
      { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const w = collapsed ? 64 : 220;

  return (
    <aside style={{
      width: w, minWidth: w, height: "100vh",
      background: "#070C18",
      borderRight: "1px solid rgba(255,255,255,0.05)",
      display: "flex", flexDirection: "column",
      transition: "width 0.25s ease, min-width 0.25s ease",
      position: "relative", flexShrink: 0,
      overflow: "hidden",
    }}>

      {/* Logo */}
      <div style={{
        display: "flex", alignItems: "center",
        gap: collapsed ? 0 : 12,
        padding: collapsed ? "18px 0" : "18px 16px",
        justifyContent: collapsed ? "center" : "flex-start",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        <THMark size={32} />
        {!collapsed && (
          <div>
            <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: 0, lineHeight: 1, letterSpacing: "-0.3px" }}>Townshub</p>
            <p style={{ fontSize: 8, color: "#5B8DEF", fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", marginTop: 2 }}>VIDEO STUDIO</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: "auto", padding: "12px 8px" }}>
        {nav.map((section) => (
          <div key={section.section} style={{ marginBottom: 20 }}>
            {!collapsed && (
              <p style={{
                fontSize: 9, fontWeight: 800, color: "#2A3F5F",
                letterSpacing: "0.16em", textTransform: "uppercase",
                padding: "0 10px", marginBottom: 6, margin: "0 0 6px",
              }}>{section.section}</p>
            )}
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 2 }}>
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link href={href} title={collapsed ? label : undefined} style={{ textDecoration: "none" }}>
                      <div style={{
                        display: "flex", alignItems: "center",
                        gap: collapsed ? 0 : 9,
                        justifyContent: collapsed ? "center" : "flex-start",
                        padding: collapsed ? "9px 0" : "8px 10px",
                        borderRadius: 9,
                        background: active ? "rgba(0,212,255,0.1)" : "transparent",
                        border: active ? "1px solid rgba(0,212,255,0.16)" : "1px solid transparent",
                        color: active ? "#00D4FF" : "#475569",
                        transition: "all 0.15s",
                        cursor: "pointer",
                      }}
                        onMouseEnter={e => {
                          if (!active) {
                            (e.currentTarget as HTMLDivElement).style.background = "rgba(255,255,255,0.04)";
                            (e.currentTarget as HTMLDivElement).style.color = "#94a3b8";
                          }
                        }}
                        onMouseLeave={e => {
                          if (!active) {
                            (e.currentTarget as HTMLDivElement).style.background = "transparent";
                            (e.currentTarget as HTMLDivElement).style.color = "#475569";
                          }
                        }}
                      >
                        <Icon size={15} style={{ flexShrink: 0, color: "inherit" }} />
                        {!collapsed && (
                          <span style={{ fontSize: 13, fontWeight: active ? 600 : 400, color: "inherit", letterSpacing: "-0.1px" }}>
                            {label}
                          </span>
                        )}
                        {active && !collapsed && (
                          <div style={{ marginLeft: "auto", width: 5, height: 5, borderRadius: "50%", background: "#00D4FF", flexShrink: 0 }} />
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Plan badge */}
      {!collapsed && (
        <div style={{ padding: "0 10px 12px" }}>
          <div style={{
            borderRadius: 12, padding: "12px 14px",
            background: "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(0,212,255,0.03))",
            border: "1px solid rgba(0,212,255,0.12)",
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: "#00D4FF" }}>Starter Plan</span>
              <Link href="/dashboard/billing" style={{
                fontSize: 10, fontWeight: 700, color: "#fb923c", textDecoration: "none",
                padding: "2px 8px", borderRadius: 5,
                background: "rgba(251,146,60,0.1)", border: "1px solid rgba(251,146,60,0.2)",
              }}>Upgrade</Link>
            </div>
            <div style={{ width: "100%", height: 3, borderRadius: 99, background: "rgba(0,212,255,0.08)", overflow: "hidden" }}>
              <div style={{ width: "20%", height: "100%", background: "linear-gradient(90deg, #00D4FF, #0080cc)", borderRadius: 99 }} />
            </div>
            <p style={{ fontSize: 10, color: "#64748b", marginTop: 6 }}>4 of 5 scripts remaining</p>
          </div>
        </div>
      )}

      {/* Logout */}
      <div style={{ padding: "0 8px 12px", borderTop: "1px solid rgba(255,255,255,0.04)", paddingTop: 8 }}>
        <button
          onClick={async () => {
            const supabase = createClient();
            await supabase.auth.signOut();
            window.location.href = "/login";
          }}
          title={collapsed ? "Sign Out" : undefined}
          style={{
            display: "flex", alignItems: "center",
            gap: collapsed ? 0 : 9,
            justifyContent: collapsed ? "center" : "flex-start",
            width: "100%", padding: collapsed ? "9px 0" : "8px 10px",
            borderRadius: 9, border: "none",
            background: "transparent", color: "#475569",
            cursor: "pointer", transition: "all 0.15s",
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(239,68,68,0.07)";
            (e.currentTarget as HTMLButtonElement).style.color = "#f87171";
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "#475569";
          }}
        >
          <LogOut size={15} style={{ flexShrink: 0 }} />
          {!collapsed && <span style={{ fontSize: 13 }}>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          position: "absolute", right: -12, top: 72,
          width: 24, height: 24, borderRadius: "50%",
          background: "#0A1020", border: "1px solid rgba(0,212,255,0.2)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", zIndex: 10, transition: "border-color 0.2s",
        }}
        onMouseEnter={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.4)"}
        onMouseLeave={e => (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(0,212,255,0.2)"}
      >
        <ChevronLeft size={11} color="#475569" style={{ transform: collapsed ? "rotate(180deg)" : "none", transition: "transform 0.25s" }} />
      </button>
    </aside>
  );
}
