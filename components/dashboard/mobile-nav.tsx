"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutDashboard, ScrollText, PenLine, Kanban, X,
  Lightbulb, Image, Mic, CalendarClock, Share2,
  Compass, Bookmark, Sparkles, Settings, GitMerge,
  Bot, Monitor, Headphones, Users, CreditCard,
} from "lucide-react";

const MORE_LINKS = [
  { href: "/dashboard/ideas",            label: "Video Ideas",       icon: Lightbulb,     color: "#facc15" },
  { href: "/dashboard/style",            label: "My Style",          icon: Sparkles,      color: "#a78bfa" },
  { href: "/dashboard/thumbnails",       label: "Thumbnails",        icon: Image,         color: "#fb923c" },
  { href: "/dashboard/voiceover",        label: "AI Voiceover",      icon: Mic,           color: "#a78bfa" },
  { href: "/dashboard/scheduler",        label: "YT Scheduler",      icon: CalendarClock, color: "#60a5fa" },
  { href: "/dashboard/publish",          label: "Social Channels",   icon: Share2,        color: "#34d399" },
  { href: "/dashboard/niche-finder",     label: "Niche Finder",      icon: Compass,       color: "#34d399" },
  { href: "/dashboard/niche-bending",    label: "Niche Bending",     icon: GitMerge,      color: "#a78bfa" },
  { href: "/dashboard/similar-channels", label: "Similar Channels",  icon: Users,         color: "#00D4FF" },
  { href: "/dashboard/saved-channels",   label: "Saved Channels",    icon: Bookmark,      color: "#a855f7" },
  { href: "/dashboard/consulting",       label: "AI Consulting",     icon: Bot,           color: "#00D4FF" },
  { href: "/dashboard/extension",        label: "Chrome Extension",  icon: Monitor,       color: "#fb923c" },
  { href: "/dashboard/team",             label: "Team",              icon: Users,         color: "#64748b" },
  { href: "/dashboard/billing",          label: "Billing",           icon: CreditCard,    color: "#facc15" },
  { href: "/dashboard/support",          label: "Support",           icon: Headphones,    color: "#34d399" },
  { href: "/dashboard/settings",         label: "Settings",          icon: Settings,      color: "#94a3b8" },
];

// Grid icon for "More" button
function GridIcon({ active }: { active: boolean }) {
  const c = active ? "#00D4FF" : "#475569";
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
      {[0,1,2,3].map(i => <div key={i} style={{ width: 5, height: 5, borderRadius: 1.5, background: c }} />)}
    </div>
  );
}

export function MobileNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  if (!visible) return null;

  const navLinks: { href: string; label: string; icon: React.ElementType }[] = [
    { href: "/dashboard",            label: "Home",    icon: LayoutDashboard },
    { href: "/dashboard/scripts",    label: "Scripts", icon: ScrollText },
    { href: "/dashboard/production", label: "Board",   icon: Kanban },
  ];

  return (
    <>
      {/* More sheet backdrop */}
      {moreOpen && (
        <div onClick={() => setMoreOpen(false)} style={{
          position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
          backdropFilter: "blur(4px)", zIndex: 490,
        }} />
      )}

      {/* More sheet */}
      {moreOpen && (
        <div style={{
          position: "fixed", bottom: 66, left: 0, right: 0, zIndex: 495,
          background: "linear-gradient(180deg, #0D1626, #080D1A)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "20px 20px 0 0",
          padding: "16px 16px 8px",
          maxHeight: "65vh", overflowY: "auto",
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: "#e2e8f0" }}>All Pages</span>
            <button onClick={() => setMoreOpen(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748b", padding: 4 }}>
              <X size={16} />
            </button>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {MORE_LINKS.map(({ href, label, icon: Icon, color }) => {
              const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
              return (
                <Link key={href} href={href} onClick={() => setMoreOpen(false)} style={{ textDecoration: "none" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "13px 14px", borderRadius: 12,
                    background: active ? `${color}14` : "rgba(255,255,255,0.03)",
                    border: `1px solid ${active ? color + "40" : "rgba(255,255,255,0.07)"}`,
                  }}>
                    <Icon size={17} color={active ? color : "#94a3b8"} />
                    <span style={{ fontSize: 13, fontWeight: active ? 700 : 500, color: active ? "#ffffff" : "#C8D6F0" }}>
                      {label}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div style={{ height: 8 }} />
        </div>
      )}

      {/* Bottom nav bar */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 500,
        height: 66,
        background: "rgba(7,12,24,0.97)",
        backdropFilter: "blur(20px)",
        borderTop: "1px solid rgba(255,255,255,0.08)",
        display: "flex", alignItems: "stretch",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}>
        {/* Regular links */}
        {navLinks.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} style={{ textDecoration: "none", flex: 1 }}>
              <div style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                justifyContent: "center", gap: 5, height: "100%",
              }}>
                <div style={{ position: "relative" }}>
                  <Icon size={21} color={active ? "#00D4FF" : "#C8D6F0"} strokeWidth={active ? 2.5 : 2} />
                  {active && (
                    <div style={{
                      position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%)",
                      width: 4, height: 4, borderRadius: "50%", background: "#00D4FF",
                    }} />
                  )}
                </div>
                <span style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? "#00D4FF" : "#C8D6F0", letterSpacing: "0.01em" }}>
                  {label}
                </span>
              </div>
            </Link>
          );
        })}

        {/* Centre: New Script button */}
        <div style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Link href="/dashboard/new-script" style={{ textDecoration: "none" }}>
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              background: "linear-gradient(135deg, #00D4FF, #0080cc)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 0 22px rgba(0,212,255,0.45)",
            }}>
              <PenLine size={21} color="#04080F" strokeWidth={2.5} />
            </div>
          </Link>
        </div>

        {/* More button */}
        <button onClick={() => setMoreOpen(o => !o)} style={{
          flex: 1, display: "flex", flexDirection: "column", alignItems: "center",
          justifyContent: "center", gap: 5, height: "100%",
          background: "none", border: "none", cursor: "pointer",
        }}>
          <GridIcon active={moreOpen} />
          <span style={{ fontSize: 10, fontWeight: moreOpen ? 700 : 500, color: moreOpen ? "#00D4FF" : "#C8D6F0" }}>More</span>
        </button>
      </nav>
    </>
  );
}
