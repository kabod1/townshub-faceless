"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Sparkles,
  Lightbulb,
  PenLine,
  ScrollText,
  Kanban,
  Image,
  Compass,
  Users,
  CreditCard,
  HelpCircle,
  Settings,
  ChevronLeft,
  Plus,
  Zap,
  LogOut,
} from "lucide-react";
import { useState } from "react";

const navItems = [
  {
    section: "WORKSPACE",
    items: [
      { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
      { href: "/dashboard/style", label: "My Style & Profiles", icon: Sparkles },
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
      { href: "/dashboard/niche-finder", label: "Niche Finder", icon: Compass },
    ],
  },
  {
    section: "ACCOUNT",
    items: [
      { href: "/dashboard/team", label: "Team", icon: Users },
      { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
      { href: "/dashboard/support", label: "Support", icon: HelpCircle },
      { href: "/dashboard/settings", label: "Settings", icon: Settings },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "relative flex flex-col h-screen bg-[#0A1020] border-r border-cyan-500/10 transition-all duration-300 shrink-0",
        collapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className={cn("flex items-center gap-3 px-4 py-5 border-b border-cyan-500/10", collapsed && "justify-center px-0")}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shrink-0 shadow-[0_0_16px_rgba(0,212,255,0.4)]">
          <Zap size={16} className="text-[#04080F]" fill="currentColor" />
        </div>
        {!collapsed && (
          <div>
            <p className="text-sm font-bold text-white font-[family-name:var(--font-syne)] leading-none">Townshub</p>
            <p className="text-[10px] text-cyan-400 font-semibold tracking-widest uppercase mt-0.5">Faceless</p>
          </div>
        )}
      </div>

      {/* Add Channel */}
      {!collapsed && (
        <div className="px-3 pt-4">
          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-cyan-500/20 text-cyan-500/60 hover:border-cyan-500/40 hover:text-cyan-400 text-xs font-medium transition-all">
            <Plus size={14} />
            Add Channel
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        {navItems.map((section) => (
          <div key={section.section} className="mb-5">
            {!collapsed && (
              <p className="text-[10px] font-bold text-slate-600 tracking-[0.12em] px-3 mb-1.5 font-[family-name:var(--font-syne)]">
                {section.section}
              </p>
            )}
            <ul className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => {
                const active = pathname === href || (href !== "/dashboard" && pathname.startsWith(href));
                return (
                  <li key={href}>
                    <Link
                      href={href}
                      title={collapsed ? label : undefined}
                      className={cn(
                        "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-150",
                        collapsed ? "justify-center" : "",
                        active
                          ? "bg-cyan-500/12 text-cyan-400 border border-cyan-500/18 font-medium"
                          : "text-slate-500 hover:bg-white/4 hover:text-slate-300"
                      )}
                    >
                      <Icon size={16} className="shrink-0" />
                      {!collapsed && <span>{label}</span>}
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
        <div className="px-3 pb-4">
          <div className="rounded-lg bg-gradient-to-br from-cyan-500/10 to-cyan-500/5 border border-cyan-500/15 p-3">
            <p className="text-xs font-bold text-cyan-400 font-[family-name:var(--font-syne)] mb-1">Starter Plan</p>
            <div className="w-full bg-cyan-500/10 rounded-full h-1.5 mb-1.5">
              <div className="h-full bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-full" style={{ width: "20%" }} />
            </div>
            <p className="text-[10px] text-slate-500">4 scripts remaining</p>
            <button className="mt-2 text-[11px] font-semibold text-orange-400 hover:text-orange-300 transition-colors font-[family-name:var(--font-syne)]">
              Upgrade →
            </button>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className={cn("px-2 pb-3 border-t border-white/5 pt-2", collapsed && "flex justify-center")}>
        <button
          onClick={async () => {
            await fetch("/api/auth/logout", { method: "POST" });
            window.location.href = "/login";
          }}
          title={collapsed ? "Sign Out" : undefined}
          className={cn(
            "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm w-full transition-all duration-150 text-slate-500 hover:bg-red-500/8 hover:text-red-400",
            collapsed && "justify-center w-auto"
          )}
        >
          <LogOut size={15} className="shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#0A1020] border border-cyan-500/20 flex items-center justify-center hover:border-cyan-500/40 transition-all"
      >
        <ChevronLeft
          size={12}
          className={cn("text-slate-500 transition-transform duration-300", collapsed && "rotate-180")}
        />
      </button>
    </aside>
  );
}
