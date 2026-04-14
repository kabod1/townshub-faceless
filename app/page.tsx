"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Zap, PenLine, Kanban, Image as ImageIcon, Compass, Puzzle,
  CheckCircle2, ArrowRight, Star, Crown, TrendingUp, Play,
  Lightbulb, Sparkles, Users, Shield, Clock, ChevronRight,
  BarChart3, X, Check, PlayCircle,
} from "lucide-react";

/* ─── Static data ────────────────────────────────────────────────────────── */

const TICKER_1 = [
  "AI Script Writer", "Viral Ideas Engine", "Niche Finder",
  "Thumbnail Studio", "Production Board", "Chrome Extension",
  "Style Profiles", "Team Collaboration", "Channel Analytics",
];

const RESULTS = [
  { value: "2,400+", label: "Active Creators", color: "#00D4FF" },
  { value: "$2M+",   label: "Earned by Our Community", color: "#34D399" },
  { value: "4.9★",   label: "Average Rating", color: "#FACC15" },
  { value: "< 30s",  label: "Script Generation", color: "#A78BFA" },
];

const BEFORE_AFTER = [
  { before: "6+ hours writing scripts manually",       after: "Full script in under 30 seconds" },
  { before: "Guessing what topics will go viral",       after: "AI-ranked ideas with viral scores" },
  { before: "Generic Canva thumbnails",                 after: "Click-worthy AI thumbnails in minutes" },
  { before: "Scattered spreadsheets and notes",         after: "One production board for everything" },
  { before: "Months of niche research",                 after: "Niche database with RPM & competition data" },
];

const features = [
  {
    id: "script",
    icon: PenLine,
    title: "AI Script Writer",
    desc: "Research-backed scripts section by section. Hooks, body, and CTAs optimised for retention.",
    accent: "#00D4FF",
    glow: "rgba(0,212,255,0.12)",
    border: "rgba(0,212,255,0.2)",
    tag: "Most Used",
    preview: [
      { label: "Hook",  text: "Did you know 94% of people never achieve financial freedom?" },
      { label: "Intro", text: "In today's video, I'll reveal the 3 strategies that changed everything..." },
      { label: "CTA",   text: "Hit subscribe so you never miss a video like this..." },
    ],
    wide: true,
  },
  {
    id: "ideas",
    icon: Lightbulb,
    title: "Viral Video Ideas",
    desc: "AI analyses competitors and ranks every idea by viral potential before you spend a second on it.",
    accent: "#FACC15",
    glow: "rgba(250,204,21,0.1)",
    border: "rgba(250,204,21,0.2)",
    ideaList: [
      { score: 96, title: "5 Money Mistakes Destroying Your Future" },
      { score: 91, title: "The Passive Income Lie Nobody Talks About" },
      { score: 88, title: "How I'd Build $10K/Month From Scratch" },
    ],
    wide: false,
  },
  {
    id: "thumbnails",
    icon: ImageIcon,
    title: "Thumbnail Studio",
    desc: "Canva-style editor + Flux.1 AI image generation. Style presets trained on your niche.",
    accent: "#EC4899",
    glow: "rgba(236,72,153,0.1)",
    border: "rgba(236,72,153,0.2)",
    wide: false,
  },
  {
    id: "niche",
    icon: Compass,
    title: "Niche Finder",
    desc: "Discover untapped niches with RPM data, competition scores, and 12-month growth trends.",
    accent: "#34D399",
    glow: "rgba(52,211,153,0.1)",
    border: "rgba(52,211,153,0.2)",
    wide: false,
  },
  {
    id: "board",
    icon: Kanban,
    title: "Production Board",
    desc: "Kanban pipeline from idea to upload. Set deadlines, assign tasks, track every video.",
    accent: "#A78BFA",
    glow: "rgba(167,139,250,0.1)",
    border: "rgba(167,139,250,0.2)",
    wide: false,
  },
  {
    id: "ext",
    icon: Puzzle,
    title: "Chrome Extension",
    desc: "Outlier scores, tags, and channel analytics overlaid directly on YouTube as you browse.",
    accent: "#FB923C",
    glow: "rgba(251,146,60,0.1)",
    border: "rgba(251,146,60,0.2)",
    wide: false,
  },
];

const testimonials = [
  {
    quote: "I went from 0 to 8,200 subscribers in 3 months using Townshub. The script quality blows everything else out of the water. I tried 3 other tools before this one.",
    name: "Alex M.",
    handle: "@AlexFinance",
    role: "Finance Niche",
    subs: "8.2K subs",
    metric: "+8.2K in 90 days",
    avatar: "A",
    color: "from-cyan-500 to-blue-600",
    accentColor: "#00D4FF",
  },
  {
    quote: "The niche finder saved me months. I found a $12 RPM, low-competition niche in under 10 minutes. Then the script writer got my first video to 40K views.",
    name: "Sarah K.",
    handle: "@SarahTech",
    role: "Tech Explainer",
    subs: "22K subs",
    metric: "40K views first video",
    avatar: "S",
    color: "from-violet-500 to-purple-700",
    accentColor: "#A78BFA",
  },
  {
    quote: "Production board changed everything for my team. We ship 3 videos a week like clockwork. Before Townshub we couldn't even do 1 without chaos.",
    name: "James T.",
    handle: "@JamesMotivates",
    role: "Motivation Niche",
    subs: "41K subs",
    metric: "3 videos/week shipped",
    avatar: "J",
    color: "from-emerald-500 to-green-700",
    accentColor: "#34D399",
  },
  {
    quote: "Cut my script writing time from 6 hours to under 1. The AI actually understands my channel's voice. It's like having a full creative team for $30/month.",
    name: "Maya R.",
    handle: "@MayaCreates",
    role: "Lifestyle Niche",
    subs: "18K subs",
    metric: "6 hrs → under 1 hr",
    avatar: "M",
    color: "from-pink-500 to-rose-700",
    accentColor: "#EC4899",
  },
  {
    quote: "I was skeptical at first. But after my first Townshub script hit 120K views, I upgraded to Pro the same day. The ROI is insane.",
    name: "David L.",
    handle: "@DavidExplains",
    role: "History Niche",
    subs: "55K subs",
    metric: "120K views first script",
    avatar: "D",
    color: "from-orange-500 to-amber-600",
    accentColor: "#FB923C",
  },
  {
    quote: "Finally a tool built by people who actually do faceless YouTube. Every feature solves a real problem I had. Nothing feels bloated or unnecessary.",
    name: "Priya S.",
    handle: "@PriyaTalks",
    role: "Self-Improvement",
    subs: "33K subs",
    metric: "33K subs in 6 months",
    avatar: "P",
    color: "from-teal-500 to-cyan-700",
    accentColor: "#2DD4BF",
  },
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    annual: "$7.19",
    desc: "Everything you need to start",
    icon: Zap,
    accentColor: "#00D4FF",
    popular: false,
    elite: false,
    cta: "Start Free Trial",
    ctaStyle: { border: "1px solid rgba(0,212,255,0.3)", color: "#00D4FF" },
    features: [
      "4 full AI scripts / month",
      "120 AI thumbnail assets",
      "Chrome Extension access",
      "Unlimited video ideas",
      "Production board",
      "1 style profile",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    annual: "$21.59",
    desc: "For serious channel growth",
    icon: Star,
    accentColor: "#00D4FF",
    popular: true,
    elite: false,
    cta: "Start Pro Trial",
    ctaStyle: { background: "linear-gradient(135deg,#00D4FF,#0284C7)", color: "#020818" },
    features: [
      "15 full AI scripts / month",
      "300 AI thumbnail assets",
      "Everything in Starter",
      "Full niche database",
      "Similar Channels finder",
      "Team collaboration (5 seats)",
      "Multiple channel profiles",
    ],
  },
  {
    id: "elite",
    name: "Elite AI",
    price: "$99.99",
    annual: "$71.99",
    desc: "Done-with-you coaching included",
    icon: Crown,
    accentColor: "#FACC15",
    popular: false,
    elite: true,
    cta: "Go Elite",
    ctaStyle: { background: "linear-gradient(135deg,#FACC15,#F97316)", color: "#0A0A00" },
    features: [
      "30 full AI scripts / month",
      "600 AI thumbnail assets",
      "Everything in Pro",
      "1-on-1 AI growth consulting",
      "Personal YouTube mentor",
      "Channel strategy & audits",
      "Priority 24/7 support",
    ],
  },
];

/* ─── Small reusable components ──────────────────────────────────────────── */

function SectionLabel({ color, children }: { color: string; children: React.ReactNode }) {
  return (
    <div className="inline-flex items-center gap-2 mb-5">
      <span className="w-4 h-px" style={{ background: color }} />
      <span className="text-xs font-bold tracking-[0.2em] uppercase"
        style={{ color, fontFamily: "var(--font-syne)" }}>
        {children}
      </span>
      <span className="w-4 h-px" style={{ background: color }} />
    </div>
  );
}

function AvatarRow() {
  const avatars = [
    { initial: "A", from: "#00D4FF", to: "#0284C7" },
    { initial: "S", from: "#A78BFA", to: "#7C3AED" },
    { initial: "J", from: "#34D399", to: "#059669" },
    { initial: "M", from: "#FB923C", to: "#EA580C" },
    { initial: "D", from: "#EC4899", to: "#BE185D" },
  ];
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-2.5">
        {avatars.map((a, i) => (
          <div key={i}
            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2"
            style={{ background: `linear-gradient(135deg,${a.from},${a.to})`, borderColor: "#030509", zIndex: avatars.length - i }}>
            {a.initial}
          </div>
        ))}
      </div>
      <div>
        <div className="flex gap-0.5 mb-0.5">
          {[...Array(5)].map((_, i) => <Star key={i} size={9} fill="#FACC15" style={{ color: "#FACC15" }} />)}
        </div>
        <p className="text-xs text-slate-400">2,400+ creators</p>
      </div>
    </div>
  );
}

function Ticker({ items, reverse = false }: { items: string[]; reverse?: boolean }) {
  const cls = reverse ? "animate-ticker-rev" : "animate-ticker";
  return (
    <div className="overflow-hidden">
      <div className={`flex gap-10 whitespace-nowrap ${cls}`} style={{ width: "max-content" }}>
        {[...items, ...items, ...items].map((item, i) => (
          <span key={i} className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-widest"
            style={{ color: "#1E293B", fontFamily: "var(--font-syne)" }}>
            <span className="w-1 h-1 rounded-full" style={{ background: "#00D4FF", opacity: 0.5 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const [mousePos, setMousePos] = useState({ x: 50, y: 30 });
  const [billingAnnual, setBillingAnnual] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      const el = heroRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - r.left) / r.width) * 100,
        y: ((e.clientY - r.top) / r.height) * 100,
      });
    };
    window.addEventListener("mousemove", handle);
    return () => window.removeEventListener("mousemove", handle);
  }, []);

  return (
    <div className="min-h-screen bg-[#030509] text-[#E2EAFF] overflow-x-hidden">

      {/* ── Announcement bar ──────────────────────────────────────────────── */}
      <div className="relative z-50 py-2.5 text-center text-xs font-semibold overflow-hidden"
        style={{ background: "linear-gradient(90deg,#030509,rgba(0,212,255,0.08),#030509)", borderBottom: "1px solid rgba(0,212,255,0.12)" }}>
        <span className="text-slate-400">🎉 </span>
        <span style={{ color: "#00D4FF" }}>Limited offer:</span>
        <span className="text-slate-300"> Save 39% on any annual plan — </span>
        <a href="#pricing" className="underline underline-offset-2" style={{ color: "#00D4FF" }}>See pricing →</a>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 backdrop-blur-2xl"
        style={{ background: "rgba(3,5,9,0.85)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00D4FF,#0284C7)", boxShadow: "0 0 18px rgba(0,212,255,0.45)" }}>
              <Zap size={15} fill="#020818" className="text-[#020818]" />
            </div>
            <span className="font-bold text-white" style={{ fontFamily: "var(--font-syne)", fontSize: "15px", letterSpacing: "-0.01em" }}>
              Townshub <span style={{ color: "#00D4FF" }}>Faceless</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-7">
            {[["#features","Features"],["#results","Results"],["#how","How It Works"],["#pricing","Pricing"]].map(([h, l]) => (
              <a key={h} href={h}
                className="text-sm text-slate-400 hover:text-white transition-colors duration-150"
                style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>{l}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
              style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>Log in</Link>
            <Link href="/login"
              className="group flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:shadow-[0_0_28px_rgba(0,212,255,0.45)]"
              style={{ background: "linear-gradient(135deg,#00D4FF,#0284C7)", color: "#020818", fontFamily: "var(--font-syne)" }}>
              Start Free Trial
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HERO                                                                */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section ref={heroRef} className="relative min-h-[92vh] flex items-center justify-center pt-10 pb-0 px-6 overflow-hidden">

        {/* Background layers */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Deep space base */}
          <div className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 120% 80% at 50% -20%, rgba(0,212,255,0.05) 0%, transparent 60%)" }} />
          {/* Mouse glow */}
          <div className="absolute w-[700px] h-[700px] rounded-full transition-all duration-1000 ease-out"
            style={{
              background: "radial-gradient(circle, rgba(0,212,255,0.05) 0%, transparent 70%)",
              left: `calc(${mousePos.x}% - 350px)`,
              top: `calc(${mousePos.y}% - 350px)`,
              filter: "blur(30px)",
            }} />
          {/* Static accent blobs */}
          <div className="absolute top-20 right-0 w-[500px] h-[500px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(139,92,246,0.06), transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(251,146,60,0.05), transparent 70%)", filter: "blur(80px)" }} />
          {/* Fine grid */}
          <div className="absolute inset-0"
            style={{
              backgroundImage: "linear-gradient(rgba(0,212,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,212,255,0.04) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black, transparent)",
            }} />
        </div>

        <div className="relative max-w-7xl mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.05fr] gap-10 xl:gap-20 items-center">

            {/* ── Left col ─────────────────────────────────────────── */}
            <div className="animate-fade-up">

              {/* Social proof badge */}
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full mb-8"
                style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}>
                <AvatarRow />
              </div>

              {/* Headline */}
              <h1 className="text-[52px] sm:text-[64px] xl:text-[76px] font-bold leading-[1.02] tracking-tight mb-7"
                style={{ fontFamily: "var(--font-syne)" }}>
                <span className="text-white">The #1 Studio</span>
                <br />
                <span className="text-white">for Faceless</span>
                <br />
                <span className="text-gradient-cyan">YouTube Creators</span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-400 max-w-lg leading-relaxed mb-10"
                style={{ fontFamily: "var(--font-dm-sans)" }}>
                Stop spending 6 hours writing scripts. Townshub generates research-backed scripts, viral ideas, and professional thumbnails — in seconds.
              </p>

              {/* CTA group */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
                <Link href="/login"
                  className="group flex items-center gap-2 px-9 py-4 rounded-xl text-base font-bold transition-all duration-200 hover:shadow-[0_0_56px_rgba(0,212,255,0.5)] whitespace-nowrap"
                  style={{ background: "linear-gradient(135deg,#00D4FF,#0284C7)", color: "#020818", fontFamily: "var(--font-syne)" }}>
                  Start Your Free 7-Day Trial
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center border border-white/10 bg-white/4 group-hover:border-white/20 transition-all">
                    <div className="absolute w-12 h-12 rounded-full border border-white/10 animate-pulse-ring" />
                    <Play size={14} fill="currentColor" className="ml-0.5" />
                  </div>
                  <span className="text-sm" style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>See it in action</span>
                </button>
              </div>

              {/* Trust row */}
              <p className="text-xs text-slate-600 mb-1" style={{ fontFamily: "var(--font-syne)" }}>
                No charge until day 8. Cancel anytime.
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500">
                {["No credit card required", "Works for any niche", "Set up in 5 minutes"].map((t) => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} style={{ color: "#34D399" }} />
                    {t}
                  </span>
                ))}
              </div>
            </div>

            {/* ── Right col — product mockup ────────────────────── */}
            <div className="hidden lg:block relative">

              {/* Floating notification cards */}
              <div className="absolute -top-6 -left-10 z-20 animate-float glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl"
                style={{ border: "1px solid rgba(0,212,255,0.2)", animationDelay: "0s", minWidth: "230px" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(0,212,255,0.15)" }}>
                  <PenLine size={16} style={{ color: "#00D4FF" }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Script Generated ✓</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Finance · 1,380 words · 28s</p>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 z-20 animate-float glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl"
                style={{ border: "1px solid rgba(52,211,153,0.2)", animationDelay: "1.2s", minWidth: "210px" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(52,211,153,0.15)" }}>
                  <TrendingUp size={16} style={{ color: "#34D399" }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Niche Found ✓</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">$14 RPM · Low competition</p>
                </div>
              </div>

              <div className="absolute -bottom-4 left-4 z-20 animate-float glass rounded-2xl px-4 py-3 flex items-center gap-3 shadow-2xl"
                style={{ border: "1px solid rgba(250,204,21,0.2)", animationDelay: "0.7s", minWidth: "200px" }}>
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "rgba(250,204,21,0.15)" }}>
                  <BarChart3 size={16} style={{ color: "#FACC15" }} />
                </div>
                <div>
                  <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>12 Ideas Ranked</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">By viral score · Ready now</p>
                </div>
              </div>

              {/* Browser mockup */}
              <div className="rounded-2xl p-[1px] animate-border-glow"
                style={{ background: "linear-gradient(135deg, rgba(0,212,255,0.5), rgba(139,92,246,0.3), rgba(0,212,255,0.1))" }}>
                <div className="rounded-[15px] overflow-hidden" style={{ background: "#07091A" }}>
                  {/* Chrome bar */}
                  <div className="flex items-center gap-2 px-4 py-3"
                    style={{ background: "#0A0E22", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                    <div className="flex gap-1.5">
                      {["rgba(239,68,68,.7)","rgba(234,179,8,.7)","rgba(34,197,94,.7)"].map((c,i) => (
                        <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
                      ))}
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="px-4 py-1 rounded-md text-[11px] text-center text-slate-600"
                        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                        townshub.ai/dashboard
                      </div>
                    </div>
                  </div>

                  {/* App shell */}
                  <div className="flex" style={{ minHeight: "380px" }}>
                    {/* Sidebar */}
                    <div className="shrink-0 py-5 px-3 space-y-0.5" style={{ width: "170px", background: "#08091E", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                      <div className="flex items-center gap-2 px-3 pb-4 mb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                        <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "linear-gradient(135deg,#00D4FF,#0284C7)" }}>
                          <Zap size={12} fill="#020818" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white leading-none" style={{ fontFamily: "var(--font-syne)" }}>Townshub</p>
                          <p className="text-[8px] font-bold tracking-widest uppercase mt-0.5" style={{ color: "#00D4FF" }}>Faceless</p>
                        </div>
                      </div>
                      {[
                        { name: "Dashboard", active: true },
                        { name: "My Style",   active: false },
                        { name: "Video Ideas",active: false },
                        { name: "New Script", active: false },
                        { name: "Thumbnails", active: false },
                        { name: "Production", active: false },
                        { name: "Analytics",  active: false },
                      ].map((item) => (
                        <div key={item.name} className="px-3 py-2 rounded-lg text-[11px] font-medium"
                          style={item.active
                            ? { background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.18)", fontFamily: "var(--font-syne)" }
                            : { color: "#2E3A55", fontFamily: "var(--font-syne)" }}>
                          {item.name}
                        </div>
                      ))}
                    </div>

                    {/* Main */}
                    <div className="flex-1 p-5 space-y-4" style={{ background: "#07091A" }}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Good morning, Creator 👋</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">4 scripts remaining this month</p>
                        </div>
                        <div className="w-7 h-7 rounded-full" style={{ background: "linear-gradient(135deg,#FB923C,#EA580C)" }} />
                      </div>

                      {/* Stat row */}
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { l: "Scripts Left", v: "4", c: "#00D4FF", bg: "rgba(0,212,255,0.07)" },
                          { l: "Thumbnails",   v: "120", c: "#FB923C", bg: "rgba(251,146,60,0.07)" },
                          { l: "Video Ideas",  v: "∞",   c: "#FACC15", bg: "rgba(250,204,21,0.07)" },
                          { l: "Active Tasks", v: "7",   c: "#34D399", bg: "rgba(52,211,153,0.07)" },
                        ].map((s) => (
                          <div key={s.l} className="rounded-xl p-3"
                            style={{ background: s.bg, border: `1px solid ${s.c}22` }}>
                            <p className="text-xl font-bold" style={{ color: s.c, fontFamily: "var(--font-syne)" }}>{s.v}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5">{s.l}</p>
                          </div>
                        ))}
                      </div>

                      {/* Recent scripts */}
                      <div className="rounded-xl p-3.5"
                        style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-[0.15em] mb-2.5" style={{ fontFamily: "var(--font-syne)" }}>Latest Scripts</p>
                        <div className="space-y-2">
                          {[
                            { title: "5 Finance Mistakes Nobody Tells You", score: 96, c: "#34D399" },
                            { title: "The Passive Income Lie", score: 88, c: "#FACC15" },
                          ].map((s) => (
                            <div key={s.title} className="flex items-center justify-between">
                              <p className="text-[10px] text-slate-400 truncate flex-1 pr-2">{s.title}</p>
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded"
                                style={{ background: `${s.c}18`, color: s.c, fontFamily: "var(--font-syne)" }}>
                                {s.score}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Quick action */}
                      <div className="flex items-center gap-2 p-3 rounded-xl cursor-pointer hover:opacity-80 transition-opacity"
                        style={{ background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.18)" }}>
                        <Sparkles size={13} style={{ color: "#00D4FF" }} />
                        <span className="text-[11px] font-semibold" style={{ color: "#00D4FF", fontFamily: "var(--font-syne)" }}>
                          Generate new script →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom gradient fade into ticker */}
          <div className="absolute bottom-0 inset-x-0 h-20 pointer-events-none"
            style={{ background: "linear-gradient(to top, #030509, transparent)" }} />
        </div>
      </section>

      {/* ── Ticker ────────────────────────────────────────────────────────── */}
      <div className="py-5 space-y-3 overflow-hidden"
        style={{ borderTop: "1px solid rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
        <Ticker items={TICKER_1} />
      </div>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* RESULTS                                                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="results" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel color="#34D399">Proven Results</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
              Built by creators.
              <br />
              <span className="text-gradient-cyan">Proven by numbers.</span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {RESULTS.map((r) => (
              <div key={r.label} className="relative rounded-2xl p-7 text-center group transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(10,14,28,0.8)", border: `1px solid ${r.color}22` }}>
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `radial-gradient(circle at 50% 80%, ${r.color}08, transparent)` }} />
                <p className="text-4xl font-bold mb-2 relative"
                  style={{ fontFamily: "var(--font-syne)", color: r.color }}>{r.value}</p>
                <p className="text-sm text-slate-500 relative">{r.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* BEFORE / AFTER                                                      */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(139,92,246,0.04), transparent)" }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel color="#A78BFA">The Difference</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-syne)" }}>
              The old way vs{" "}
              <span className="text-gradient-cyan">the Townshub way</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              Everything VidEdge does — and then some.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Before */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.12)" }}>
              <div className="flex items-center gap-2.5 px-6 py-4"
                style={{ borderBottom: "1px solid rgba(239,68,68,0.1)", background: "rgba(239,68,68,0.05)" }}>
                <X size={14} style={{ color: "#F87171" }} />
                <span className="text-sm font-bold text-red-400" style={{ fontFamily: "var(--font-syne)" }}>The Old Way</span>
              </div>
              <ul className="p-6 space-y-4">
                {BEFORE_AFTER.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(239,68,68,0.15)" }}>
                      <X size={10} style={{ color: "#F87171" }} />
                    </div>
                    <span className="text-sm text-slate-400">{item.before}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* After */}
            <div className="rounded-2xl overflow-hidden"
              style={{ background: "rgba(0,212,255,0.03)", border: "1px solid rgba(0,212,255,0.15)" }}>
              <div className="flex items-center gap-2.5 px-6 py-4"
                style={{ borderBottom: "1px solid rgba(0,212,255,0.1)", background: "rgba(0,212,255,0.06)" }}>
                <Sparkles size={14} style={{ color: "#00D4FF" }} />
                <span className="text-sm font-bold" style={{ color: "#00D4FF", fontFamily: "var(--font-syne)" }}>The Townshub Way</span>
              </div>
              <ul className="p-6 space-y-4">
                {BEFORE_AFTER.map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background: "rgba(0,212,255,0.15)" }}>
                      <Check size={10} style={{ color: "#00D4FF" }} />
                    </div>
                    <span className="text-sm text-slate-300 font-medium">{item.after}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA under comparison */}
          <div className="text-center mt-10">
            <Link href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_40px_rgba(0,212,255,0.4)]"
              style={{ background: "linear-gradient(135deg,#00D4FF,#0284C7)", color: "#020818", fontFamily: "var(--font-syne)" }}>
              Switch to the better way
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* FEATURES                                                            */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel color="#00D4FF">Platform Features</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5" style={{ fontFamily: "var(--font-syne)" }}>
              Every tool you need.
              <br />
              <span className="text-gradient-cyan">Nothing you don&apos;t.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              From first idea to final upload — every step powered by AI, designed specifically for faceless creators.
            </p>
          </div>

          {/* Bento */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

            {/* ── Wide: AI Script Writer ── */}
            <div className="md:col-span-2 group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-default"
              style={{ background: "rgba(0,212,255,0.04)", border: "1px solid rgba(0,212,255,0.18)" }}>
              <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "radial-gradient(circle,rgba(0,212,255,0.08),transparent)", filter: "blur(30px)" }} />
              <div className="absolute top-4 right-5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00D4FF", fontFamily: "var(--font-syne)" }}>
                Most Used
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)" }}>
                <PenLine size={22} style={{ color: "#00D4FF" }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>AI Script Writer</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6 max-w-md">
                Research-backed scripts section by section. Hooks, body, CTAs — all optimised for maximum retention and watch time.
              </p>
              <div className="space-y-2.5">
                {[
                  { label: "Hook",  text: "Did you know 94% of people never achieve financial freedom?" },
                  { label: "Intro", text: "In today's video, I'll reveal the exact 3 strategies..." },
                  { label: "CTA",   text: "Hit subscribe so you never miss a video like this." },
                ].map((row) => (
                  <div key={row.label} className="flex items-center gap-3 px-4 py-3 rounded-xl"
                    style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-[8px] font-bold uppercase tracking-[0.15em] w-7 shrink-0"
                      style={{ color: "#00D4FF", fontFamily: "var(--font-syne)" }}>{row.label}</span>
                    <span className="text-xs text-slate-400 truncate">{row.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Viral Ideas ── */}
            <div className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-default"
              style={{ background: "rgba(250,204,21,0.04)", border: "1px solid rgba(250,204,21,0.18)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.2)" }}>
                <Lightbulb size={20} style={{ color: "#FACC15" }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>Viral Video Ideas</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-5">
                AI ranks every idea by viral potential using competitor analysis.
              </p>
              <div className="space-y-2">
                {[
                  { score: 96, title: "5 Money Mistakes to Avoid", c: "#34D399" },
                  { score: 91, title: "Passive Income Lie Nobody Tells", c: "#FACC15" },
                  { score: 87, title: "How I'd Start From Scratch", c: "#FB923C" },
                ].map((idea) => (
                  <div key={idea.title} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{ background: "rgba(250,204,21,0.05)", border: "1px solid rgba(250,204,21,0.1)" }}>
                    <span className="text-[10px] font-bold w-6 shrink-0" style={{ color: idea.c, fontFamily: "var(--font-syne)" }}>
                      {idea.score}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate">{idea.title}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Bottom 4 ── */}
            {features.slice(2).map((f) => (
              <div key={f.id}
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                style={{ background: `${f.glow}`, border: `1px solid ${f.border}` }}>
                <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle,${f.glow},transparent)`, filter: "blur(20px)" }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background: f.glow, border: `1px solid ${f.border}` }}>
                  <f.icon size={20} style={{ color: f.accent }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2 relative" style={{ fontFamily: "var(--font-syne)" }}>{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed relative">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS                                                        */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="how" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 70% 50% at 50% 50%, rgba(0,212,255,0.03), transparent)" }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel color="#FB923C">The Process</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-syne)" }}>
              Start publishing in your first week
            </h2>
            <p className="text-lg text-slate-400">Three steps. Zero experience needed.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-[52px] left-[calc(16.67%+48px)] right-[calc(16.67%+48px)] h-px"
              style={{ background: "linear-gradient(90deg, rgba(0,212,255,0.4), rgba(139,92,246,0.4), rgba(52,211,153,0.4))" }} />

            {[
              {
                n: "01", title: "Set Up Your Style",
                desc: "Drop in competitor channels. We analyse their scripts to build your unique writing DNA and voice.",
                bg: "linear-gradient(135deg,#00D4FF,#0284C7)",
                shadow: "0 0 40px rgba(0,212,255,0.45), 0 0 80px rgba(0,212,255,0.12)",
                border: "rgba(0,212,255,0.15)",
              },
              {
                n: "02", title: "Generate & Refine",
                desc: "Write scripts in seconds. Design thumbnails. Use the niche finder to lock in your target audience.",
                bg: "linear-gradient(135deg,#8B5CF6,#6D28D9)",
                shadow: "0 0 40px rgba(139,92,246,0.45), 0 0 80px rgba(139,92,246,0.12)",
                border: "rgba(139,92,246,0.15)",
              },
              {
                n: "03", title: "Produce & Ship",
                desc: "Track every video on your board. Set deadlines, collaborate with your team, and publish consistently.",
                bg: "linear-gradient(135deg,#34D399,#059669)",
                shadow: "0 0 40px rgba(52,211,153,0.45), 0 0 80px rgba(52,211,153,0.12)",
                border: "rgba(52,211,153,0.15)",
              },
            ].map((step) => (
              <div key={step.n} className="relative rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(10,14,28,0.8)", border: `1px solid ${step.border}` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: step.bg, boxShadow: step.shadow }}>
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{step.n}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "var(--font-syne)" }}>{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TESTIMONIALS                                                        */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <SectionLabel color="#34D399">Creator Stories</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
              Real creators. Real results.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <div key={t.name}
                className="group relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(160deg, rgba(12,18,36,0.95), rgba(7,9,26,1))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  animationDelay: `${i * 0.1}s`,
                }}>
                {/* Top accent */}
                <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl"
                  style={{ background: `linear-gradient(90deg, transparent, ${t.accentColor}40, transparent)` }} />

                {/* Metric badge */}
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{ background: `${t.accentColor}15`, border: `1px solid ${t.accentColor}30`, color: t.accentColor, fontFamily: "var(--font-syne)" }}>
                  {t.metric}
                </div>

                <div>
                  {/* Stars */}
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_, i) => <Star key={i} size={12} fill="#FACC15" style={{ color: "#FACC15" }} />)}
                  </div>

                  {/* Quote */}
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 pt-5"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${t.color} shrink-0`}
                    style={{ fontFamily: "var(--font-syne)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none" style={{ fontFamily: "var(--font-syne)" }}>{t.name}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{t.handle} · {t.role} · {t.subs}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* YouTube credibility bar */}
          <div className="mt-12 flex items-center justify-center gap-3 text-sm text-slate-500">
            <PlayCircle size={16} style={{ color: "#FF0000" }} />
            <span>Trusted by creators across Finance, Tech, Motivation, Lifestyle, History and 40+ more niches</span>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* PRICING                                                             */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%, rgba(139,92,246,0.04), transparent)" }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel color="#A78BFA">Simple Pricing</SectionLabel>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-syne)" }}>
              Pick your plan
            </h2>
            <p className="text-slate-400 mb-8">7-day free trial on all plans. No charge until day 8. Cancel anytime.</p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-xl"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => setBillingAnnual(false)}
                className="px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: !billingAnnual ? "rgba(0,212,255,0.15)" : "transparent",
                  color: !billingAnnual ? "#00D4FF" : "#64748B",
                  border: !billingAnnual ? "1px solid rgba(0,212,255,0.25)" : "1px solid transparent",
                  fontFamily: "var(--font-syne)",
                }}>
                Monthly
              </button>
              <button
                onClick={() => setBillingAnnual(true)}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: billingAnnual ? "rgba(0,212,255,0.15)" : "transparent",
                  color: billingAnnual ? "#00D4FF" : "#64748B",
                  border: billingAnnual ? "1px solid rgba(0,212,255,0.25)" : "1px solid transparent",
                  fontFamily: "var(--font-syne)",
                }}>
                Annual
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "rgba(52,211,153,0.15)", color: "#34D399" }}>
                  Save 39%
                </span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div key={plan.id}
                className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: "linear-gradient(160deg, rgba(12,18,36,0.98), rgba(6,8,20,1))",
                  border: plan.popular
                    ? "1px solid rgba(0,212,255,0.4)"
                    : plan.elite
                    ? "1px solid rgba(250,204,21,0.3)"
                    : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: plan.popular ? "0 0 70px rgba(0,212,255,0.07)" : "none",
                }}>
                {/* Top line */}
                {(plan.popular || plan.elite) && (
                  <div className="absolute top-0 inset-x-0 h-0.5"
                    style={{ background: plan.popular
                      ? "linear-gradient(90deg,transparent,#00D4FF,transparent)"
                      : "linear-gradient(90deg,transparent,#FACC15,transparent)" }} />
                )}

                <div className="p-8">
                  {/* Badge row */}
                  <div className="h-7 mb-6">
                    {plan.popular && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.25)", color: "#00D4FF", fontFamily: "var(--font-syne)" }}>
                        <Star size={10} fill="currentColor" /> Most Popular
                      </div>
                    )}
                    {plan.elite && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background: "rgba(250,204,21,0.1)", border: "1px solid rgba(250,204,21,0.25)", color: "#FACC15", fontFamily: "var(--font-syne)" }}>
                        <Crown size={10} fill="currentColor" /> Premium
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-2">
                    <plan.icon size={16} style={{ color: plan.accentColor }} />
                    <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{plan.name}</span>
                  </div>

                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="text-5xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
                      {billingAnnual ? plan.annual : plan.price}
                    </span>
                    <span className="text-slate-500 mb-2 text-sm">/mo</span>
                  </div>
                  {billingAnnual && (
                    <p className="text-xs text-slate-500 mb-1">Billed annually</p>
                  )}
                  <p className="text-xs text-slate-500 mb-7">{plan.desc}</p>

                  <Link href="/login"
                    className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all mb-7 hover:opacity-90"
                    style={{ ...plan.ctaStyle, fontFamily: "var(--font-syne)" }}>
                    {plan.cta}
                    <ArrowRight size={14} />
                  </Link>

                  <ul className="space-y-3.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: plan.accentColor }} />
                        <span className="text-[13px] text-slate-400 leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantees */}
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: Shield, text: "7-day money back guarantee", color: "#34D399" },
              { icon: Clock,  text: "Cancel anytime — no lock-in contracts", color: "#00D4FF" },
              { icon: Users,  text: "Team collaboration on Pro & Elite", color: "#A78BFA" },
            ].map(({ icon: Icon, text, color }) => (
              <div key={text} className="flex items-center gap-3 px-5 py-4 rounded-xl"
                style={{ background: `${color}08`, border: `1px solid ${color}18` }}>
                <Icon size={16} style={{ color }} />
                <span className="text-sm text-slate-400">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* FINAL CTA                                                           */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden text-center px-8 py-20"
            style={{ background: "linear-gradient(160deg, rgba(10,16,32,0.98), rgba(5,8,18,1))", border: "1px solid rgba(0,212,255,0.12)" }}>

            {/* Background glows */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(0,212,255,0.1), transparent 70%)", filter: "blur(60px)" }} />
            <div className="absolute -bottom-24 left-1/4 w-80 h-80 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.08), transparent 70%)", filter: "blur(60px)" }} />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ background: "rgba(0,212,255,0.07)", border: "1px solid rgba(0,212,255,0.2)" }}>
                <Sparkles size={12} style={{ color: "#00D4FF" }} />
                <span className="text-xs font-bold tracking-widest uppercase"
                  style={{ color: "#00D4FF", fontFamily: "var(--font-syne)" }}>
                  Join 2,400+ Creators
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl xl:text-6xl font-bold mb-6" style={{ fontFamily: "var(--font-syne)" }}>
                <span className="text-white">Your faceless channel</span>
                <br />
                <span className="text-gradient-cyan">starts right now</span>
              </h2>

              <p className="text-lg text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
                Join thousands of creators building real income on YouTube — without ever showing their face.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
                <Link href="/login"
                  className="group flex items-center gap-2 px-12 py-5 rounded-xl text-lg font-bold transition-all hover:shadow-[0_0_60px_rgba(0,212,255,0.5)]"
                  style={{ background: "linear-gradient(135deg,#00D4FF,#0284C7)", color: "#020818", fontFamily: "var(--font-syne)" }}>
                  Start Free 7-Day Trial
                  <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
                </Link>
              </div>

              <p className="text-xs text-slate-600">
                No charge until day 8 · No credit card required · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-14" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg,#00D4FF,#0284C7)", boxShadow: "0 0 14px rgba(0,212,255,0.4)" }}>
                  <Zap size={16} fill="#020818" />
                </div>
                <div>
                  <p className="font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
                    Townshub <span style={{ color: "#00D4FF" }}>Faceless</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">AI YouTube Growth Studio</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                The complete toolkit for building a profitable faceless YouTube channel with AI.
              </p>
            </div>

            {/* Product */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 mb-4" style={{ fontFamily: "var(--font-syne)" }}>
                Product
              </p>
              <ul className="space-y-2.5">
                {["Features", "Pricing", "How It Works", "Chrome Extension"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal */}
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 mb-4" style={{ fontFamily: "var(--font-syne)" }}>
                Company
              </p>
              <ul className="space-y-2.5">
                {["Privacy Policy", "Terms of Service", "Support", "Contact"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600"
            style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <p>© 2026 Townshub. Not affiliated with YouTube or Google LLC.</p>
            <p>Built for faceless creators everywhere.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
