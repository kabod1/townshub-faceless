"use client";

import { Bell, Search, Plus } from "lucide-react";

interface TopbarProps {
  title: string;
  action?: { label: string; href?: string; onClick?: () => void };
}

export function Topbar({ title, action }: TopbarProps) {
  return (
    <header className="h-14 flex items-center justify-between px-6 border-b border-cyan-500/10 bg-[#080D1A]/80 backdrop-blur-sm sticky top-0 z-20">
      <h1 className="text-lg font-bold text-white font-[family-name:var(--font-syne)]">{title}</h1>

      <div className="flex items-center gap-3">
        {/* Search */}
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-slate-500 text-xs hover:border-cyan-500/20 hover:text-slate-400 transition-all">
          <Search size={13} />
          <span className="hidden sm:inline">Search...</span>
          <kbd className="hidden sm:inline text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10">⌘K</kbd>
        </button>

        {/* Notifications */}
        <button className="relative w-8 h-8 flex items-center justify-center rounded-lg border border-white/8 text-slate-500 hover:border-cyan-500/20 hover:text-slate-400 transition-all">
          <Bell size={15} />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full" />
        </button>

        {/* Avatar */}
        <button className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xs font-bold font-[family-name:var(--font-syne)] shadow-[0_0_12px_rgba(255,107,53,0.3)]">
          T
        </button>

        {/* Action */}
        {action && (
          <button
            onClick={action.onClick}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] text-xs font-bold font-[family-name:var(--font-syne)] hover:shadow-[0_0_16px_rgba(0,212,255,0.35)] transition-all"
          >
            <Plus size={13} />
            {action.label}
          </button>
        )}
      </div>
    </header>
  );
}
