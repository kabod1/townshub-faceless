"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Zap, PenLine, Kanban, Image, Compass, Puzzle,
  CheckCircle2, ArrowRight, Star, Crown, TrendingUp,
  Play, Lightbulb, Sparkles, Users, Shield, Clock, ChevronRight,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const TICKER = [
  "AI Script Writer", "Viral Ideas Engine", "Thumbnail Studio",
  "Niche Finder", "Production Board", "Chrome Extension",
  "Channel Analytics", "Style Profiles", "Team Collaboration",
];

const features = [
  {
    id: "script",
    icon: PenLine,
    title: "AI Script Writer",
    desc: "Research-backed scripts section by section, with hooks optimised for retention and watch time.",
    accent: "#00D4FF",
    glow: "rgba(0,212,255,0.15)",
    border: "rgba(0,212,255,0.25)",
    tag: "Most Used",
    large: true,
    preview: [
      { label: "Hook", value: "Did you know 94% of people..." },
      { label: "Body", value: "Let me explain why this works..." },
      { label: "CTA", value: "Subscribe to never miss..." },
    ],
  },
  {
    id: "ideas",
    icon: Lightbulb,
    title: "Viral Video Ideas",
    desc: "AI ranks ideas by viral potential using competitor data.",
    accent: "#FACC15",
    glow: "rgba(250,204,21,0.12)",
    border: "rgba(250,204,21,0.2)",
    tag: null,
    large: false,
  },
  {
    id: "thumbnails",
    icon: Image,
    title: "Thumbnail Studio",
    desc: "Click-worthy thumbnails with AI image generation via Flux.1.",
    accent: "#EC4899",
    glow: "rgba(236,72,153,0.12)",
    border: "rgba(236,72,153,0.2)",
    tag: null,
    large: false,
  },
  {
    id: "niche",
    icon: Compass,
    title: "Niche Finder",
    desc: "Untapped niches with RPM data, competition scores, and trend analysis.",
    accent: "#34D399",
    glow: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.2)",
    tag: null,
    large: false,
  },
  {
    id: "board",
    icon: Kanban,
    title: "Production Board",
    desc: "Kanban pipeline from idea to upload. Assign, track, ship.",
    accent: "#A78BFA",
    glow: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.2)",
    tag: null,
    large: false,
  },
  {
    id: "ext",
    icon: Puzzle,
    title: "Chrome Extension",
    desc: "Outlier scores and analytics overlaid on YouTube as you browse.",
    accent: "#FB923C",
    glow: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.2)",
    tag: null,
    large: false,
  },
];

const stats = [
  { value: "10,000+", label: "Scripts Generated", color: "#00D4FF" },
  { value: "4.9★", label: "Average Rating", color: "#FACC15" },
  { value: "50+", label: "Supported Niches", color: "#A78BFA" },
  { value: "< 30s", label: "Script Generation", color: "#34D399" },
];

const testimonials = [
  {
    quote: "I went from 0 to 8,000 subscribers in 3 months. The script quality is insane — way better than anything I could write myself.",
    name: "Alex M.",
    role: "Finance Niche",
    sub: "8.2K subs",
    avatar: "A",
    color: "from-cyan-500 to-cyan-700",
  },
  {
    quote: "The niche finder alone saved me months of research. Found a low-competition niche with $12 RPM in 10 minutes.",
    name: "Sarah K.",
    role: "Tech Explainer",
    sub: "22K subs",
    avatar: "S",
    color: "from-violet-500 to-violet-700",
  },
  {
    quote: "Production board keeps my whole team aligned. We're shipping 3 videos a week now without the chaos.",
    name: "James T.",
    role: "Motivation Niche",
    sub: "41K subs",
    avatar: "J",
    color: "from-emerald-500 to-emerald-700",
  },
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    scripts: "4 scripts / month",
    popular: false,
    icon: Zap,
    accentColor: "#00D4FF",
    ctaClass: "border border-white/20 text-white hover:bg-white/8",
    features: ["4 full AI scripts", "120 AI thumbnail assets", "Chrome Extension", "Video Ideas AI", "Production board", "Style profiles"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    scripts: "15 scripts / month",
    popular: true,
    icon: Star,
    accentColor: "#00D4FF",
    ctaClass: "bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] font-bold",
    features: ["15 full AI scripts", "300 AI thumbnail assets", "Everything in Starter", "Niche Finder database", "Similar Channels finder", "Team collaboration", "Multiple channel profiles"],
  },
  {
    id: "elite",
    name: "Elite AI",
    price: "$99.99",
    scripts: "30 scripts / month",
    popular: false,
    icon: Crown,
    accentColor: "#FACC15",
    ctaClass: "bg-gradient-to-r from-yellow-400 to-orange-500 text-[#04080F] font-bold",
    features: ["30 full AI scripts", "600 AI thumbnail assets", "Everything in Pro", "AI consulting chat", "Personal YouTube mentor", "Strategy & growth advice", "Priority support"],
  },
];

/* ─── Ticker ─────────────────────────────────────────────────────────────── */
function Ticker() {
  return (
    <div className="relative overflow-hidden py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex gap-12 animate-ticker whitespace-nowrap" style={{ width: "max-content" }}>
        {[...TICKER, ...TICKER, ...TICKER].map((item, i) => (
          <span key={i} className="flex items-center gap-2.5 text-xs font-semibold tracking-wider uppercase"
            style={{ color: "#475569", fontFamily: "var(--font-syne)" }}>
            <span className="w-1 h-1 rounded-full bg-cyan-500/50" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Animated counter ───────────────────────────────────────────────────── */
function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  return (
    <div className="text-center group">
      <div className="text-4xl font-bold mb-1 transition-all duration-300 group-hover:scale-110"
        style={{ fontFamily: "var(--font-syne)", color }}>
        {value}
      </div>
      <div className="text-sm text-slate-500">{label}</div>
    </div>
  );
}

/* ─── Component ─────────────────────────────────────────────────────────── */
export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const rect = heroRef.current.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div className="min-h-screen bg-[#05080F] text-[#E8F0FF] overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-2xl"
        style={{ background: "rgba(5,8,15,0.8)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", boxShadow: "0 0 16px rgba(0,212,255,0.5)" }}>
              <Zap size={15} fill="#04080F" className="text-[#04080F]" />
            </div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
              Townshub <span style={{ color: "#00D4FF" }}>Faceless</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[["#features", "Features"], ["#how-it-works", "How it Works"], ["#pricing", "Pricing"]].map(([href, label]) => (
              <a key={href} href={href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>
                {label}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
              style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>
              Log In
            </Link>
            <Link href="/login"
              className="group flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm transition-all hover:shadow-[0_0_24px_rgba(0,212,255,0.4)]"
              style={{
                background: "linear-gradient(135deg,#00D4FF,#0090cc)",
                color: "#04080F",
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
              }}>
              Get Started
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center pt-20 pb-12 px-6 overflow-hidden">
        {/* Dynamic background */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Base gradient */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 60% at 50% -10%,rgba(0,212,255,0.08),transparent 70%)" }} />
          {/* Mouse-tracking glow */}
          <div className="absolute w-[600px] h-[600px] rounded-full pointer-events-none transition-all duration-700"
            style={{
              background: "radial-gradient(circle,rgba(0,212,255,0.06),transparent 70%)",
              left: `calc(${mousePos.x}% - 300px)`,
              top: `calc(${mousePos.y}% - 300px)`,
              filter: "blur(40px)",
            }} />
          {/* Accent glows */}
          <div className="absolute top-1/3 right-10 w-80 h-80 rounded-full opacity-15"
            style={{ background: "radial-gradient(circle,#A78BFA,transparent)", filter: "blur(80px)" }} />
          <div className="absolute bottom-1/4 left-10 w-64 h-64 rounded-full opacity-10"
            style={{ background: "radial-gradient(circle,#FB923C,transparent)", filter: "blur(60px)" }} />
          {/* Grid */}
          <div className="absolute inset-0 opacity-[0.025]"
            style={{ backgroundImage: "linear-gradient(rgba(0,212,255,1) 1px,transparent 1px),linear-gradient(90deg,rgba(0,212,255,1) 1px,transparent 1px)", backgroundSize: "60px 60px" }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left — Copy */}
            <div className="animate-fade-up">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)" }}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                </span>
                <Sparkles size={11} style={{ color: "#00D4FF" }} />
                <span className="text-xs font-bold tracking-widest uppercase"
                  style={{ fontFamily: "var(--font-syne)", color: "#00D4FF" }}>
                  AI YouTube Growth Studio
                </span>
              </div>

              {/* Headline */}
              <h1 className="text-5xl sm:text-6xl xl:text-7xl font-bold leading-[1.04] tracking-tight mb-6"
                style={{ fontFamily: "var(--font-syne)" }}>
                <span className="text-white">Build a</span>
                <br />
                <span style={{
                  background: "linear-gradient(100deg,#00D4FF 0%,#38BDF8 35%,#A78BFA 65%,#00D4FF 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  Faceless Empire
                </span>
                <br />
                <span className="text-white">on YouTube</span>
              </h1>

              <p className="text-lg text-slate-400 max-w-lg leading-relaxed mb-10">
                AI scripts. Viral ideas. Stunning thumbnails. Production pipeline.
                Every tool to build and scale a faceless channel — in one studio.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-start gap-4 mb-10">
                <Link href="/login"
                  className="group flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:shadow-[0_0_48px_rgba(0,212,255,0.5)]"
                  style={{
                    background: "linear-gradient(135deg,#00D4FF,#0090cc)",
                    color: "#04080F",
                    fontFamily: "var(--font-syne)",
                  }}>
                  Start Free — No Card Needed
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center border transition-all hover:scale-110 hover:border-white/30"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)" }}>
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </div>
                  <span className="text-sm" style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>Watch 2-min demo</span>
                </button>
              </div>

              {/* Trust */}
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500">
                {["No tech skills needed", "Works for any niche", "7-day free trial"].map((t) => (
                  <span key={t} className="flex items-center gap-2">
                    <CheckCircle2 size={13} style={{ color: "#34D399" }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Dashboard mockup */}
            <div className="relative hidden lg:block">
              {/* Floating stat pills */}
              <div className="absolute -top-4 -left-8 z-20 flex items-center gap-2 px-3.5 py-2.5 rounded-xl animate-float shadow-2xl"
                style={{ background: "rgba(10,16,32,0.9)", border: "1px solid rgba(0,212,255,0.3)", backdropFilter: "blur(16px)", animationDelay: "0s" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(0,212,255,0.15)" }}>
                  <PenLine size={14} style={{ color: "#00D4FF" }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Script Generated</p>
                  <p className="text-[10px] text-slate-400">Finance niche · 1,240 words</p>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-4 z-20 flex items-center gap-2 px-3.5 py-2.5 rounded-xl animate-float shadow-2xl"
                style={{ background: "rgba(10,16,32,0.9)", border: "1px solid rgba(52,211,153,0.3)", backdropFilter: "blur(16px)", animationDelay: "1.5s" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(52,211,153,0.15)" }}>
                  <TrendingUp size={14} style={{ color: "#34D399" }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Niche Found</p>
                  <p className="text-[10px] text-slate-400">$14 RPM · Low competition</p>
                </div>
              </div>

              <div className="absolute top-1/3 -right-6 z-20 flex items-center gap-2 px-3.5 py-2.5 rounded-xl animate-float shadow-2xl"
                style={{ background: "rgba(10,16,32,0.9)", border: "1px solid rgba(250,204,21,0.3)", backdropFilter: "blur(16px)", animationDelay: "0.8s" }}>
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "rgba(250,204,21,0.15)" }}>
                  <Lightbulb size={14} style={{ color: "#FACC15" }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>12 Ideas Ready</p>
                  <p className="text-[10px] text-slate-400">Ranked by viral score</p>
                </div>
              </div>

              {/* Main mockup */}
              <div className="rounded-2xl p-[1px] animate-border-glow"
                style={{ background: "linear-gradient(135deg,rgba(0,212,255,0.4),rgba(167,139,250,0.2),rgba(0,212,255,0.1))" }}>
                <div className="rounded-[15px] overflow-hidden" style={{ background: "#070C18" }}>
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3"
                    style={{ background: "#0A1020", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
                    <div className="flex gap-1.5">
                      {["rgba(239,68,68,0.7)", "rgba(234,179,8,0.7)", "rgba(34,197,94,0.7)"].map((c, i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="px-6 py-1 rounded text-[11px] text-slate-600 text-center"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                        townshub.ai/dashboard
                      </div>
                    </div>
                  </div>

                  {/* App UI */}
                  <div className="flex" style={{ minHeight: "360px" }}>
                    {/* Sidebar */}
                    <div className="shrink-0 py-5 px-2.5 space-y-1" style={{ width: "160px", background: "#080E1C", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2 px-2.5 pb-4 mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="w-6 h-6 rounded-md flex items-center justify-center"
                          style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)" }}>
                          <Zap size={11} fill="#04080F" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Townshub</p>
                          <p className="text-[8px] font-bold tracking-widest uppercase" style={{ color: "#00D4FF" }}>Faceless</p>
                        </div>
                      </div>
                      {[
                        { name: "Dashboard", active: true, color: "#00D4FF" },
                        { name: "My Style", active: false },
                        { name: "Video Ideas", active: false },
                        { name: "New Script", active: false },
                        { name: "Thumbnails", active: false },
                        { name: "Production", active: false },
                      ].map((item) => (
                        <div key={item.name} className="px-2.5 py-2 rounded-lg text-[11px] font-medium"
                          style={item.active
                            ? { background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)", fontFamily: "var(--font-syne)" }
                            : { color: "#334155", fontFamily: "var(--font-syne)" }}>
                          {item.name}
                        </div>
                      ))}
                    </div>

                    {/* Main content */}
                    <div className="flex-1 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Dashboard</p>
                        <div className="w-7 h-7 rounded-full" style={{ background: "linear-gradient(135deg,#FB923C,#ea580c)" }} />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2.5">
                        {[
                          { label: "Scripts", v: "4 left", color: "#00D4FF", bg: "rgba(0,212,255,0.08)", border: "rgba(0,212,255,0.15)" },
                          { label: "Thumbnails", v: "120", color: "#FB923C", bg: "rgba(251,146,60,0.08)", border: "rgba(251,146,60,0.15)" },
                          { label: "Video Ideas", v: "∞", color: "#FACC15", bg: "rgba(250,204,21,0.08)", border: "rgba(250,204,21,0.15)" },
                          { label: "Active Tasks", v: "5", color: "#34D399", bg: "rgba(52,211,153,0.08)", border: "rgba(52,211,153,0.15)" },
                        ].map((s) => (
                          <div key={s.label} className="rounded-xl p-3"
                            style={{ background: s.bg, border: `1px solid ${s.border}` }}>
                            <p className="text-lg font-bold" style={{ color: s.color, fontFamily: "var(--font-syne)" }}>{s.v}</p>
                            <p className="text-[9px] mt-0.5 text-slate-500">{s.label}</p>
                          </div>
                        ))}
                      </div>

                      {/* Recent */}
                      <div className="rounded-xl p-3.5 space-y-2.5"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest" style={{ fontFamily: "var(--font-syne)" }}>
                          Recent Scripts
                        </p>
                        {[
                          { title: "5 Finance Tips Nobody Tells You", score: "94", color: "#34D399" },
                          { title: "The Truth About Passive Income", score: "87", color: "#FACC15" },
                        ].map((item) => (
                          <div key={item.title} className="flex items-center justify-between">
                            <p className="text-[10px] text-slate-400 truncate flex-1 pr-2">{item.title}</p>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                              style={{ background: `${item.color}20`, color: item.color, fontFamily: "var(--font-syne)" }}>
                              {item.score}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 inset-x-0 h-24 pointer-events-none"
          style={{ background: "linear-gradient(to top,#05080F,transparent)" }} />
      </section>

      {/* ── Ticker ───────────────────────────────────────────────────────── */}
      <Ticker />

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl px-8 py-10 relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg,rgba(15,22,42,0.95),rgba(10,16,30,1))",
              border: "1px solid rgba(0,212,255,0.1)",
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 80% at 50% 50%,rgba(0,212,255,0.04),transparent)" }} />
            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-10">
              {stats.map((s, i) => (
                <div key={s.label} className="relative">
                  {i < stats.length - 1 && (
                    <div className="absolute right-0 top-1/4 h-1/2 w-px hidden md:block"
                      style={{ background: "rgba(255,255,255,0.06)" }} />
                  )}
                  <StatCard value={s.value} label={s.label} color={s.color} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features Bento ───────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#00D4FF" }}>
              Everything You Need
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-syne)" }}>
              Your complete YouTube
              <br />
              <span style={{
                background: "linear-gradient(90deg,#A78BFA,#00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                content studio
              </span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              From your first idea to the final upload — every step powered by AI.
            </p>
          </div>

          {/* Bento grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large card - AI Script Writer */}
            <div className="md:col-span-2 group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              style={{
                background: "linear-gradient(135deg,rgba(0,212,255,0.07),rgba(15,24,41,0.98))",
                border: "1px solid rgba(0,212,255,0.2)",
              }}>
              <div className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(0,212,255,0.08),transparent)", filter: "blur(30px)" }} />

              <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", color: "#00D4FF", fontFamily: "var(--font-syne)" }}>
                Most Used
              </div>

              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6 transition-transform duration-200 group-hover:scale-110"
                style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)" }}>
                <PenLine size={22} style={{ color: "#00D4FF" }} />
              </div>

              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>AI Script Writer</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-sm">
                Research-backed scripts section by section, with hooks optimised for retention and watch time.
              </p>

              {/* Script preview */}
              <div className="space-y-2.5">
                {[
                  { label: "Hook", value: "Did you know 94% of people never achieve..." },
                  { label: "Intro", value: "In today's video, I'll show you exactly how..." },
                  { label: "CTA", value: "Hit subscribe so you never miss a video..." },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                    style={{ background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <span className="text-[9px] font-bold uppercase tracking-widest shrink-0 w-8"
                      style={{ color: "#00D4FF", fontFamily: "var(--font-syne)" }}>{row.label}</span>
                    <span className="text-xs text-slate-400 truncate">{row.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Small — Viral Ideas */}
            <div className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
              style={{ background: "linear-gradient(135deg,rgba(250,204,21,0.07),rgba(15,24,41,0.98))", border: "1px solid rgba(250,204,21,0.2)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                style={{ background: "rgba(250,204,21,0.12)", border: "1px solid rgba(250,204,21,0.2)" }}>
                <Lightbulb size={20} style={{ color: "#FACC15" }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>Viral Video Ideas</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">AI ranks ideas by viral potential using competitor data.</p>
              <div className="space-y-2">
                {["95 · 5 Money Mistakes to Avoid", "87 · The Truth About Passive Income"].map((idea, i) => (
                  <div key={i} className="text-[11px] px-3 py-2 rounded-lg"
                    style={{ background: "rgba(250,204,21,0.06)", border: "1px solid rgba(250,204,21,0.12)", color: "#94A3B8" }}>
                    {idea}
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom row — 4 small cards */}
            {features.slice(2).map((f) => (
              <div key={f.id}
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg,${f.glow},rgba(15,24,41,0.98))`,
                  border: `1px solid ${f.border}`,
                }}>
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle,${f.glow},transparent)`, filter: "blur(20px)" }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: f.glow, border: `1px solid ${f.border}`, color: f.accent }}>
                  <f.icon size={20} />
                </div>
                <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%,rgba(167,139,250,0.04),transparent)" }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#FB923C" }}>
              How It Works
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-syne)" }}>
              From idea to upload in 3 steps
            </h2>
            <p className="text-lg text-slate-400">No experience needed. Start publishing your first week.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-14 left-[22%] right-[22%] h-px"
              style={{ background: "linear-gradient(90deg,rgba(0,212,255,0.4),rgba(167,139,250,0.4),rgba(52,211,153,0.4))" }} />

            {[
              {
                n: "01", title: "Set Up Your Style",
                desc: "Add competitor channels — we'll analyse their scripts to build your unique writing DNA.",
                bg: "linear-gradient(135deg,#00D4FF,#0090cc)",
                glow: "0 0 40px rgba(0,212,255,0.5), 0 0 80px rgba(0,212,255,0.15)",
                cardBg: "rgba(0,212,255,0.05)",
                cardBorder: "rgba(0,212,255,0.15)",
              },
              {
                n: "02", title: "Generate & Refine",
                desc: "Write scripts, design thumbnails, find the right niche for your audience.",
                bg: "linear-gradient(135deg,#A78BFA,#7C3AED)",
                glow: "0 0 40px rgba(167,139,250,0.5), 0 0 80px rgba(167,139,250,0.15)",
                cardBg: "rgba(167,139,250,0.05)",
                cardBorder: "rgba(167,139,250,0.15)",
              },
              {
                n: "03", title: "Produce & Ship",
                desc: "Track every video on your production board. Collaborate and publish consistently.",
                bg: "linear-gradient(135deg,#34D399,#059669)",
                glow: "0 0 40px rgba(52,211,153,0.5), 0 0 80px rgba(52,211,153,0.15)",
                cardBg: "rgba(52,211,153,0.05)",
                cardBorder: "rgba(52,211,153,0.15)",
              },
            ].map((step) => (
              <div key={step.n} className="relative rounded-2xl p-7 text-center"
                style={{ background: step.cardBg, border: `1px solid ${step.cardBorder}` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: step.bg, boxShadow: step.glow }}>
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{step.n}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "var(--font-syne)" }}>{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#34D399" }}>
              Creator Stories
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
              Real results from real creators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name} className="group relative rounded-2xl p-7 transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(160deg,rgba(18,26,46,0.95),rgba(10,16,30,0.98))",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl"
                  style={{ background: "linear-gradient(90deg,transparent,rgba(0,212,255,0.2),transparent)" }} />

                {/* Big quote mark */}
                <div className="text-6xl font-bold leading-none mb-4 select-none"
                  style={{ color: "rgba(0,212,255,0.15)", fontFamily: "Georgia, serif" }}>
                  &ldquo;
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} fill="#FACC15" style={{ color: "#FACC15" }} />
                  ))}
                </div>

                <p className="text-sm text-slate-300 leading-relaxed mb-6">{t.quote}</p>

                <div className="flex items-center gap-3 pt-4"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${t.color} shrink-0`}
                    style={{ fontFamily: "var(--font-syne)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne)" }}>{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role} · {t.sub}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ──────────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 50% 40% at 50% 50%,rgba(167,139,250,0.04),transparent)" }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#A78BFA" }}>
              Simple Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-syne)" }}>
              Pick your plan
            </h2>
            <p className="text-lg text-slate-400">7-day free trial on all plans. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div key={plan.id} className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(160deg,rgba(15,22,40,0.98),rgba(8,14,26,1))",
                  border: plan.popular
                    ? "1px solid rgba(0,212,255,0.4)"
                    : plan.id === "elite"
                    ? "1px solid rgba(250,204,21,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: plan.popular ? "0 0 60px rgba(0,212,255,0.07)" : "none",
                }}>
                {/* Top line */}
                <div className="absolute top-0 inset-x-0 h-0.5"
                  style={{
                    background: plan.popular
                      ? "linear-gradient(90deg,transparent,#00D4FF,transparent)"
                      : plan.id === "elite"
                      ? "linear-gradient(90deg,transparent,#FACC15,transparent)"
                      : "none",
                  }} />

                <div className="p-8">
                  {/* Badge */}
                  <div className="h-8 mb-5">
                    {plan.popular && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00D4FF", fontFamily: "var(--font-syne)" }}>
                        <Star size={10} fill="currentColor" /> Most Popular
                      </div>
                    )}
                    {plan.id === "elite" && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)", color: "#FACC15", fontFamily: "var(--font-syne)" }}>
                        <Crown size={10} fill="currentColor" /> Premium
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <plan.icon size={16} style={{ color: plan.accentColor }} />
                    <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{plan.name}</span>
                  </div>

                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-5xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{plan.price}</span>
                    <span className="text-slate-500 mb-2">/mo</span>
                  </div>
                  <p className="text-xs font-semibold mb-7" style={{ color: plan.accentColor, fontFamily: "var(--font-syne)" }}>
                    {plan.scripts}
                  </p>

                  <Link href="/login"
                    className={`w-full py-3.5 rounded-xl text-sm flex items-center justify-center gap-2 transition-all mb-7 ${plan.ctaClass}`}
                    style={{ fontFamily: "var(--font-syne)" }}>
                    {plan.id === "starter" ? "Get Started" : plan.id === "pro" ? "Start Pro Trial" : "Go Elite"}
                    <ArrowRight size={14} />
                  </Link>

                  <ul className="space-y-3.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: plan.accentColor }} />
                        <span className="text-xs text-slate-400 leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Shield size={14} style={{ color: "#34D399" }} /> 7-day money back guarantee</span>
            <span className="flex items-center gap-2"><Clock size={14} style={{ color: "#00D4FF" }} /> Cancel anytime</span>
            <span className="flex items-center gap-2"><Users size={14} style={{ color: "#A78BFA" }} /> Team collab on Pro+</span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-14 text-center"
            style={{ background: "linear-gradient(135deg,rgba(0,212,255,0.06) 0%,rgba(10,16,30,1) 40%,rgba(167,139,250,0.06) 100%)", border: "1px solid rgba(0,212,255,0.15)" }}>
            {/* Glows */}
            <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(0,212,255,0.12),transparent)", filter: "blur(60px)" }} />
            <div className="absolute -bottom-20 right-1/4 w-72 h-72 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle,rgba(167,139,250,0.1),transparent)", filter: "blur(60px)" }} />
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 50% at 50% 0%,rgba(0,212,255,0.07),transparent)" }} />

            <div className="relative">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", boxShadow: "0 0 50px rgba(0,212,255,0.5)" }}>
                <TrendingUp size={26} className="text-[#04080F]" />
              </div>

              <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-syne)" }}>
                Ready to build your
                <br />
                <span style={{
                  background: "linear-gradient(90deg,#00D4FF,#A78BFA)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}>
                  faceless channel?
                </span>
              </h2>
              <p className="text-lg text-slate-400 mb-10 max-w-md mx-auto leading-relaxed">
                Join thousands of creators using Townshub to grow without ever showing their face.
              </p>

              <Link href="/login"
                className="group inline-flex items-center gap-2 px-12 py-5 rounded-xl text-lg font-bold transition-all hover:shadow-[0_0_60px_rgba(0,212,255,0.5)]"
                style={{
                  background: "linear-gradient(135deg,#00D4FF,#0090cc)",
                  color: "#04080F",
                  fontFamily: "var(--font-syne)",
                }}>
                Start Free Today
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>

              <p className="text-xs text-slate-600 mt-5">
                7-day free trial · No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="px-6 py-12" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 mb-8">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", boxShadow: "0 0 12px rgba(0,212,255,0.4)" }}>
                <Zap size={14} fill="#04080F" />
              </div>
              <div>
                <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
                  Townshub <span style={{ color: "#00D4FF" }}>Faceless</span>
                </span>
                <p className="text-xs text-slate-600 mt-0.5">AI YouTube Growth Studio</p>
              </div>
            </div>
            <div className="flex gap-8 text-sm text-slate-500">
              {["Features", "Pricing", "Privacy", "Terms", "Support"].map((l) => (
                <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
              ))}
            </div>
          </div>
          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <p>© 2026 Townshub. All rights reserved.</p>
            <p>Built for faceless creators worldwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
