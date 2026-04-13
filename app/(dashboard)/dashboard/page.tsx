"use client";

import Link from "next/link";
import { Topbar } from "@/components/dashboard/topbar";
import { Card, CardBody } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  PenLine, Kanban, ScrollText, Image, Compass, Zap,
  TrendingUp, PlayCircle, ArrowRight, Star, Clock, CheckCircle2, AlertCircle
} from "lucide-react";

const stats = [
  { label: "Scripts Left", value: "4", sub: "0 written · resets monthly", icon: PenLine, color: "cyan" },
  { label: "Thumbnail Assets", value: "120", sub: "0 / 120 used", icon: Image, color: "coral" },
  { label: "Video Ideas", value: "∞", sub: "AI generated daily", icon: Zap, color: "gold" },
  { label: "Production Tasks", value: "0", sub: "Active workflows", icon: Kanban, color: "green" },
];

const quickActions = [
  { label: "Write Script", desc: "Generate research-backed scripts", href: "/dashboard/new-script", icon: PenLine, color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/20", iconColor: "text-cyan-400" },
  { label: "Production Board", desc: "Manage your video pipeline", href: "/dashboard/production", icon: Kanban, color: "from-violet-500/20 to-violet-600/10 border-violet-500/20", iconColor: "text-violet-400" },
  { label: "My Scripts", desc: "View and manage saved scripts", href: "/dashboard/scripts", icon: ScrollText, color: "from-orange-500/20 to-orange-600/10 border-orange-500/20", iconColor: "text-orange-400" },
  { label: "Thumbnails", desc: "Design with AI assistance", href: "/dashboard/thumbnails", icon: Image, color: "from-pink-500/20 to-pink-600/10 border-pink-500/20", iconColor: "text-pink-400" },
  { label: "Niche Finder", desc: "Discover high-performing niches", href: "/dashboard/niche-finder", icon: Compass, color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20", iconColor: "text-emerald-400" },
  { label: "Video Ideas", desc: "AI-generated viral concepts", href: "/dashboard/ideas", icon: Zap, color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/20", iconColor: "text-yellow-400" },
];

const updates = [
  {
    id: 1,
    title: "Thumbnail Studio V3 Released",
    desc: "Introducing the all-new Thumbnail Studio with Flux.1 image generation, Analyze, Intuitive, and more.",
    time: "3w ago",
    tag: "New Feature",
    tagColor: "cyan" as const,
  },
  {
    id: 2,
    title: "Chrome Extension Now Live",
    desc: "Analyze any channel while you browse. Get outlier scores, channel analytics, video tags directly on YouTube.",
    time: "3w ago",
    tag: "Extension",
    tagColor: "green" as const,
  },
  {
    id: 3,
    title: "YouTube SEO Keyword Tool",
    desc: "Search anything on YouTube and instantly see SEO scores, search volume, competition, and related keyword opportunities.",
    time: "3w ago",
    tag: "Tool",
    tagColor: "coral" as const,
  },
];

const setupChecklist = [
  { label: "Complete your style profile", done: false, href: "/dashboard/style" },
  { label: "Add a channel profile", done: false, href: "/dashboard/style" },
  { label: "Generate your first video idea", done: false, href: "/dashboard/ideas" },
  { label: "Write your first script", done: false, href: "/dashboard/new-script" },
];

export default function DashboardPage() {
  return (
    <div className="min-h-screen">
      <Topbar title="Dashboard" action={{ label: "Add Channel" }} />

      <div className="p-6 max-w-7xl mx-auto space-y-8">

        {/* Setup Banner */}
        <div className="rounded-xl border border-orange-500/20 bg-gradient-to-r from-orange-500/8 to-orange-600/4 p-4 flex items-center gap-4">
          <div className="w-9 h-9 rounded-lg bg-orange-500/15 flex items-center justify-center shrink-0">
            <AlertCircle size={18} className="text-orange-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-orange-300 font-[family-name:var(--font-syne)]">Complete your profile to unlock all features</p>
            <p className="text-xs text-slate-500 mt-0.5">Add competitor channels in My Style so Townshub can learn your writing style.</p>
          </div>
          <Link href="/dashboard/style" className="shrink-0 px-4 py-2 rounded-lg bg-orange-500/20 border border-orange-500/30 text-orange-300 text-xs font-bold font-[family-name:var(--font-syne)] hover:bg-orange-500/30 transition-all">
            Set Up My Style
          </Link>
        </div>

        {/* Welcome Banner */}
        <div className="rounded-2xl overflow-hidden relative border border-cyan-500/12"
          style={{ background: "linear-gradient(135deg,rgba(22,32,53,0.98) 0%,rgba(10,16,32,1) 60%,rgba(0,20,40,1) 100%)" }}>
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-600/18 via-violet-600/10 to-transparent" />
          <div className="absolute top-0 right-0 w-72 h-full opacity-25 pointer-events-none"
            style={{ background: "radial-gradient(ellipse at 100% 50%,#00D4FF,transparent)" }} />
          <div className="absolute inset-0 opacity-[0.025] pointer-events-none"
            style={{ backgroundImage: "linear-gradient(rgba(0,212,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,1) 1px,transparent 1px)", backgroundSize: "40px 40px" }} />
          <div className="relative p-6 flex items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <p className="text-xs font-bold text-slate-400 tracking-[0.15em] uppercase font-[family-name:var(--font-syne)]">Welcome back</p>
              </div>
              <h2 className="text-2xl font-bold text-white font-[family-name:var(--font-syne)] mb-1">
                Towns <span style={{ color: "#00D4FF" }}>Hub</span>
              </h2>
              <p className="text-sm text-slate-400">Ready to create something great today?</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 shrink-0">
              <Link href="/dashboard/new-script"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all font-[family-name:var(--font-syne)]"
                style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", color: "#04080F", boxShadow: "0 0 20px rgba(0,212,255,0.25)" }}>
                <PenLine size={14} />
                Write Script
              </Link>
              <Link href="/dashboard/ideas"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold border border-white/10 text-slate-300 hover:border-cyan-500/30 hover:text-white transition-all font-[family-name:var(--font-syne)]"
                style={{ background: "rgba(255,255,255,0.03)" }}>
                <Zap size={14} className="text-yellow-400" />
                Get Ideas
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-xl border border-cyan-500/10 bg-gradient-to-br from-[#162035]/90 to-[#0F1829]/95 p-4 hover:border-cyan-500/20 transition-all">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest font-[family-name:var(--font-syne)]">{s.label}</p>
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                  s.color === "cyan" ? "bg-cyan-500/15 text-cyan-400" :
                  s.color === "coral" ? "bg-orange-500/15 text-orange-400" :
                  s.color === "gold" ? "bg-yellow-500/15 text-yellow-400" :
                  "bg-emerald-500/15 text-emerald-400"
                }`}>
                  <s.icon size={14} />
                </div>
              </div>
              <p className="text-3xl font-bold text-white font-[family-name:var(--font-syne)]">{s.value}</p>
              <p className="text-xs text-slate-500 mt-1">{s.sub}</p>
            </div>
          ))}
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Getting Started + Quick Actions */}
          <div className="lg:col-span-2 space-y-6">

            {/* Getting Started */}
            <Card>
              <div className="p-5 border-b border-cyan-500/10">
                <div className="flex items-center gap-2 mb-1">
                  <PlayCircle size={16} className="text-cyan-400" />
                  <h3 className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Getting Started</h3>
                </div>
                <p className="text-xs text-slate-500">Complete these steps to get the most out of your workspace.</p>
              </div>
              <CardBody className="space-y-2">
                {setupChecklist.map((item) => (
                  <Link key={item.label} href={item.href}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/3 transition-all group">
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 transition-all ${
                      item.done ? "border-emerald-500 bg-emerald-500/20" : "border-slate-600 group-hover:border-cyan-500/50"
                    }`}>
                      {item.done && <CheckCircle2 size={12} className="text-emerald-400" />}
                    </div>
                    <span className={`text-sm transition-colors ${item.done ? "line-through text-slate-600" : "text-slate-300 group-hover:text-white"}`}>
                      {item.label}
                    </span>
                    <ArrowRight size={12} className="text-slate-600 ml-auto group-hover:text-cyan-400 transition-colors" />
                  </Link>
                ))}
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <div>
              <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-3 font-[family-name:var(--font-syne)]">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {quickActions.map((qa) => (
                  <Link
                    key={qa.label}
                    href={qa.href}
                    className={`rounded-xl border bg-gradient-to-br ${qa.color} p-4 hover:-translate-y-0.5 transition-all group`}
                  >
                    <div className={`w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center mb-3 ${qa.iconColor}`}>
                      <qa.icon size={16} />
                    </div>
                    <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)] group-hover:text-cyan-300 transition-colors leading-tight">{qa.label}</p>
                    <p className="text-[11px] text-slate-500 mt-1 leading-tight">{qa.desc}</p>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* News & Updates */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest font-[family-name:var(--font-syne)]">News & Updates</h3>
            <div className="space-y-3">
              {updates.map((u) => (
                <Card key={u.id} hover>
                  <CardBody className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant={u.tagColor}>{u.tag}</Badge>
                      <span className="text-[11px] text-slate-600 flex items-center gap-1 shrink-0">
                        <Clock size={10} />
                        {u.time}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-white font-[family-name:var(--font-syne)] leading-snug">{u.title}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{u.desc}</p>
                  </CardBody>
                </Card>
              ))}
            </div>

            {/* Upgrade card */}
            <div className="rounded-xl border border-yellow-500/15 bg-gradient-to-br from-yellow-500/8 to-orange-500/5 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Star size={14} className="text-yellow-400" fill="currentColor" />
                <p className="text-sm font-bold text-yellow-300 font-[family-name:var(--font-syne)]">Unlock Pro Features</p>
              </div>
              <p className="text-xs text-slate-400 mb-3">Get 15 scripts/month, Niche Finder database, Similar Channels, and more.</p>
              <Link href="/dashboard/billing" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs font-bold font-[family-name:var(--font-syne)] hover:shadow-[0_0_16px_rgba(255,193,7,0.35)] transition-all">
                Upgrade to Pro
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
