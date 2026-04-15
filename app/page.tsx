"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap, PenLine, Kanban, ImageIcon, Compass, Puzzle,
  ArrowRight, Star, Crown, TrendingUp, Play,
  Lightbulb, Sparkles, Users, Shield, Clock, Check,
  ChevronRight, BarChart3, FileText, Flame,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const TICKER_ITEMS = [
  "AI Script Writer", "Viral Ideas Engine", "Niche Finder",
  "Thumbnail Studio", "Production Board", "Chrome Extension",
  "Style Profiles", "Team Collaboration", "Channel Analytics",
  "AI Script Writer", "Viral Ideas Engine", "Niche Finder",
  "Thumbnail Studio", "Production Board", "Chrome Extension",
  "Style Profiles", "Team Collaboration", "Channel Analytics",
];

const FEATURES = [
  {
    icon: PenLine,
    title: "AI Script Writer",
    desc: "Research-backed scripts with retention-optimised hooks, body, and CTAs — in under 30 seconds.",
    tag: "Most Used",
  },
  {
    icon: Lightbulb,
    title: "Viral Video Ideas",
    desc: "AI ranks every idea by viral potential using real competitor data before you invest a single hour.",
  },
  {
    icon: ImageIcon,
    title: "Thumbnail Studio",
    desc: "Canva-style editor + Flux.1 AI generation. Style presets trained on your niche and competitors.",
  },
  {
    icon: Compass,
    title: "Niche Finder",
    desc: "Discover untapped niches with RPM data, competition scores, and 12-month growth trend analysis.",
  },
  {
    icon: Kanban,
    title: "Production Board",
    desc: "Kanban pipeline from idea to upload. Set deadlines, assign tasks, and ship every week.",
  },
  {
    icon: Puzzle,
    title: "Chrome Extension",
    desc: "Outlier scores, tags, and channel analytics overlaid directly on YouTube as you browse.",
  },
];

const STEPS = [
  {
    n: "01",
    title: "Set Up Your Style",
    desc: "Add competitor channels and we'll analyse their scripts to build your unique writing voice and DNA.",
  },
  {
    n: "02",
    title: "Generate & Refine",
    desc: "Write scripts in seconds. Design thumbnails. Use the niche finder to lock in the right audience.",
  },
  {
    n: "03",
    title: "Produce & Ship",
    desc: "Track every video on your board. Set deadlines, collaborate, and publish consistently every week.",
  },
];

const TESTIMONIALS = [
  {
    quote: "I went from 0 to 8,200 subscribers in 3 months. The script quality blows every other tool out of the water. I tried 3 competitors before switching.",
    name: "Alex M.",
    role: "Finance Niche · 8.2K subs",
    avatar: "A",
    result: "+8.2K in 90 days",
  },
  {
    quote: "The niche finder saved me months of research. Found a $12 RPM niche in under 10 minutes. My first Townshub script hit 40K views.",
    name: "Sarah K.",
    role: "Tech Explainer · 22K subs",
    avatar: "S",
    result: "40K views, 1st video",
  },
  {
    quote: "Production board changed everything for my team. We now ship 3 videos a week without chaos. Before Townshub we struggled to do even one.",
    name: "James T.",
    role: "Motivation Niche · 41K subs",
    avatar: "J",
    result: "3 videos/week",
  },
  {
    quote: "Cut my script writing time from 6 hours to under 1. It actually sounds like me. Best $30/month I spend on my channel by far.",
    name: "Maya R.",
    role: "Lifestyle · 18K subs",
    avatar: "M",
    result: "6h → under 1h",
  },
  {
    quote: "Was skeptical at first. Then my first script hit 120K views. Upgraded to Pro the same day. The ROI is genuinely insane.",
    name: "David L.",
    role: "History Niche · 55K subs",
    avatar: "D",
    result: "120K views, 1st script",
  },
  {
    quote: "Built by people who actually do faceless YouTube. Every single feature solves a real problem I had. Nothing bloated, nothing useless.",
    name: "Priya S.",
    role: "Self-Improvement · 33K subs",
    avatar: "P",
    result: "33K subs in 6 months",
  },
];

const PLANS = [
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    annual: "$7.19",
    icon: Zap,
    popular: false,
    elite: false,
    cta: "Start Free Trial",
    features: [
      "4 AI scripts per month",
      "120 AI thumbnail assets",
      "Chrome Extension",
      "Unlimited video ideas",
      "Production board",
      "1 channel profile",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    annual: "$21.59",
    icon: Star,
    popular: true,
    elite: false,
    cta: "Start Pro Trial",
    features: [
      "15 AI scripts per month",
      "300 AI thumbnail assets",
      "Everything in Starter",
      "Full niche database access",
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
    icon: Crown,
    popular: false,
    elite: true,
    cta: "Go Elite",
    features: [
      "30 AI scripts per month",
      "600 AI thumbnail assets",
      "Everything in Pro",
      "1-on-1 AI growth consulting",
      "Personal YouTube mentor",
      "Channel strategy & audits",
      "Priority 24/7 support",
    ],
  },
];

const STATS = [
  { value: "2,400+", label: "Active creators" },
  { value: "$2M+",   label: "Earned by our community" },
  { value: "4.9/5",  label: "Average rating" },
  { value: "30s",    label: "Average script time" },
];

/* ─── Page ───────────────────────────────────────────────────────────────── */

export default function Home() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)", color: "var(--text)" }}>

      {/* ── Promo bar ─────────────────────────────────────────────────────── */}
      <div className="text-center py-2.5 text-sm"
        style={{ background: "var(--surface-2)", borderBottom: "1px solid var(--border)" }}>
        <span style={{ color: "var(--muted)" }}>🎉 Save 39% with annual billing — </span>
        <a href="#pricing" className="font-semibold underline underline-offset-2"
          style={{ color: "var(--accent)" }}>
          See all plans →
        </a>
      </div>

      {/* ── Nav ───────────────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50"
        style={{ background: "rgba(12,18,32,0.92)", backdropFilter: "blur(16px)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">

          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--accent)" }}>
              <Zap size={15} fill="#050D1A" color="#050D1A" />
            </div>
            <span className="font-bold text-white" style={{ fontFamily: "var(--font-heading)", fontSize: "15px" }}>
              Townshub <span style={{ color: "var(--accent)" }}>Faceless</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {[["#features","Features"],["#how-it-works","How it works"],["#testimonials","Stories"],["#pricing","Pricing"]].map(([h,l]) => (
              <a key={h} href={h} className="text-sm transition-colors"
                style={{ color: "var(--muted)", fontFamily: "var(--font-heading)", fontWeight: 500 }}
                onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                {l}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm hidden sm:block transition-colors"
              style={{ color: "var(--muted)", fontFamily: "var(--font-heading)", fontWeight: 500 }}
              onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
              onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
              Log in
            </Link>
            <Link href="/login" className="btn-primary" style={{ padding: "9px 20px", fontSize: "13px" }}>
              Get started free <ChevronRight size={13} />
            </Link>
          </div>
        </div>
      </header>

      {/* ══════════════════════════════ HERO ═════════════════════════════════ */}
      <section className="pt-28 pb-20 px-6 text-center relative overflow-hidden">

        {/* Subtle top glow — one, centered, restrained */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.06) 0%, transparent 70%)" }} />

        <div className="relative max-w-4xl mx-auto">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-8"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--accent)", fontFamily: "var(--font-heading)", letterSpacing: "0.04em" }}>
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--accent)" }} />
            The #1 AI Studio for Faceless YouTube Creators
          </div>

          {/* Headline */}
          <h1 className="font-bold tracking-tight mb-6"
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "clamp(44px, 6.5vw, 80px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "#FFFFFF",
            }}>
            Build a faceless YouTube
            <br />
            <span style={{ color: "var(--accent)" }}>business with AI</span>
          </h1>

          {/* Subheading */}
          <p className="text-xl mb-10 mx-auto"
            style={{ color: "var(--muted)", maxWidth: "560px", lineHeight: 1.6, fontWeight: 400 }}>
            Stop spending 6 hours writing scripts. Townshub generates research-backed scripts,
            viral ideas, and professional thumbnails — in seconds.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-6">
            <Link href="/login" className="btn-primary">
              Start your free 7-day trial
              <ArrowRight size={16} />
            </Link>
            <button className="btn-ghost flex items-center gap-3">
              <span className="relative flex items-center justify-center w-8 h-8 rounded-full"
                style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                <span className="pulse-ring absolute w-8 h-8 rounded-full" style={{ border: "1px solid rgba(255,255,255,0.15)" }} />
                <Play size={11} fill="currentColor" className="ml-0.5" />
              </span>
              Watch 2-min demo
            </button>
          </div>

          {/* Trust */}
          <p className="text-sm mb-8" style={{ color: "var(--muted)" }}>
            No charge until day 8 · No credit card required · Cancel anytime
          </p>

          {/* Social proof row */}
          <div className="flex items-center justify-center gap-3">
            <div className="flex -space-x-2.5">
              {[
                ["A","#22D3EE","#0E7490"],
                ["S","#A78BFA","#6D28D9"],
                ["J","#34D399","#059669"],
                ["M","#FB923C","#C2410C"],
                ["D","#F472B6","#9D174D"],
              ].map(([l,a,b], i) => (
                <div key={i} className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold border-2"
                  style={{ background: `linear-gradient(135deg,${a},${b})`, borderColor: "var(--bg)", zIndex: 5 - i, fontFamily: "var(--font-heading)" }}>
                  {l}
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex gap-0.5 mb-0.5">
                {[...Array(5)].map((_,i) => <Star key={i} size={10} fill="#FACC15" color="#FACC15" />)}
              </div>
              <p className="text-xs" style={{ color: "var(--muted)" }}>Loved by 2,400+ creators</p>
            </div>
          </div>
        </div>

        {/* Dashboard screenshot */}
        <div className="relative max-w-5xl mx-auto mt-20 fade-up delay-3 op-0">
          {/* Glow under the screenshot */}
          <div className="absolute inset-x-20 bottom-0 h-20 pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(34,211,238,0.08), transparent)", filter: "blur(20px)" }} />

          <div className="rounded-2xl overflow-hidden relative"
            style={{ border: "1px solid var(--border)", background: "var(--surface)" }}>

            {/* Browser bar */}
            <div className="flex items-center gap-2 px-5 py-3.5"
              style={{ background: "#0A0F1E", borderBottom: "1px solid var(--border)" }}>
              <div className="flex gap-1.5">
                {["#EF4444","#EAB308","#22C55E"].map((c,i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ background: c, opacity: 0.7 }} />
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-10 py-1.5 rounded-md text-xs text-center"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid var(--border)", color: "var(--muted)" }}>
                  townshub.ai/dashboard
                </div>
              </div>
            </div>

            {/* App shell */}
            <div className="flex" style={{ minHeight: "420px" }}>

              {/* Sidebar */}
              <div className="hidden sm:block shrink-0 py-6 px-4" style={{ width: "200px", background: "#090E1C", borderRight: "1px solid var(--border-light)" }}>
                <div className="flex items-center gap-2 mb-6 pb-4" style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "var(--accent)" }}>
                    <Zap size={12} fill="#050D1A" color="#050D1A" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none" style={{ fontFamily: "var(--font-heading)" }}>Townshub</p>
                    <p className="text-[9px] font-semibold mt-0.5 tracking-widest uppercase" style={{ color: "var(--accent)" }}>Faceless</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {[
                    { name: "Dashboard",   active: true },
                    { name: "My Style",    active: false },
                    { name: "Video Ideas", active: false },
                    { name: "New Script",  active: false },
                    { name: "Thumbnails",  active: false },
                    { name: "Production",  active: false },
                    { name: "Analytics",   active: false },
                  ].map(item => (
                    <div key={item.name} className="px-3 py-2 rounded-lg text-xs font-medium"
                      style={item.active
                        ? { background: "rgba(34,211,238,0.1)", color: "var(--accent)", fontFamily: "var(--font-heading)" }
                        : { color: "#2D3D55", fontFamily: "var(--font-heading)" }}>
                      {item.name}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main content */}
              <div className="flex-1 p-7" style={{ background: "#0C1220" }}>
                <div className="flex items-start justify-between mb-7">
                  <div>
                    <h2 className="text-base font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>
                      Good morning, Creator 👋
                    </h2>
                    <p className="text-xs" style={{ color: "var(--muted)" }}>You have 4 scripts remaining this month</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1.5 rounded-lg text-xs font-semibold"
                      style={{ background: "rgba(34,211,238,0.1)", color: "var(--accent)", border: "1px solid rgba(34,211,238,0.2)", fontFamily: "var(--font-heading)" }}>
                      + New Script
                    </div>
                    <div className="w-8 h-8 rounded-full" style={{ background: "linear-gradient(135deg,#FB923C,#DC2626)" }} />
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                  {[
                    { label: "Scripts left",  value: "4",   color: "#22D3EE" },
                    { label: "Thumbnails",    value: "120",  color: "#FB923C" },
                    { label: "Video ideas",   value: "∞",    color: "#FACC15" },
                    { label: "Open tasks",    value: "7",    color: "#34D399" },
                  ].map(s => (
                    <div key={s.label} className="rounded-xl p-4"
                      style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
                      <p className="text-2xl font-bold mb-1" style={{ color: s.color, fontFamily: "var(--font-heading)" }}>{s.value}</p>
                      <p className="text-xs" style={{ color: "var(--muted)" }}>{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Recent scripts table */}
                <div className="rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)" }}>
                  <div className="flex items-center justify-between px-5 py-3.5"
                    style={{ background: "var(--surface)", borderBottom: "1px solid var(--border)" }}>
                    <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>Recent Scripts</p>
                    <span className="text-xs" style={{ color: "var(--accent)" }}>View all →</span>
                  </div>
                  <div style={{ background: "var(--surface)" }}>
                    {[
                      { title: "5 Finance Mistakes Nobody Tells You", niche: "Finance",  score: 96, status: "Published" },
                      { title: "The Passive Income Lie Exposed",       niche: "Finance",  score: 88, status: "In Review" },
                      { title: "How I'd Build $10K/Month From Zero",   niche: "Finance",  score: 91, status: "Draft" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center gap-4 px-5 py-3.5"
                        style={{ borderBottom: i < 2 ? "1px solid var(--border-light)" : "none" }}>
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background: "rgba(34,211,238,0.08)", border: "1px solid rgba(34,211,238,0.15)" }}>
                          <FileText size={13} style={{ color: "var(--accent)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium text-white truncate">{row.title}</p>
                          <p className="text-[10px] mt-0.5" style={{ color: "var(--muted)" }}>{row.niche}</p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs font-bold px-2 py-0.5 rounded-md"
                            style={{
                              background: row.score >= 90 ? "rgba(52,211,153,0.1)" : "rgba(250,204,21,0.1)",
                              color: row.score >= 90 ? "#34D399" : "#FACC15",
                              fontFamily: "var(--font-heading)",
                            }}>
                            {row.score}
                          </span>
                          <span className="text-[10px] px-2 py-0.5 rounded-md hidden md:block"
                            style={{
                              background: row.status === "Published" ? "rgba(52,211,153,0.08)" : "rgba(255,255,255,0.05)",
                              color: row.status === "Published" ? "#34D399" : "var(--muted)",
                              border: "1px solid " + (row.status === "Published" ? "rgba(52,211,153,0.15)" : "var(--border)"),
                            }}>
                            {row.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fade bottom */}
          <div className="absolute inset-x-0 bottom-0 h-24 pointer-events-none"
            style={{ background: "linear-gradient(to top, var(--bg), transparent)" }} />
        </div>
      </section>

      {/* ── Stats bar ─────────────────────────────────────────────────────── */}
      <section className="py-12 px-6" style={{ borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((s, i) => (
              <div key={s.label} className="relative">
                {i < STATS.length - 1 && (
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 h-8 w-px hidden md:block"
                    style={{ background: "var(--border)" }} />
                )}
                <p className="text-3xl font-bold text-white mb-1" style={{ fontFamily: "var(--font-heading)" }}>{s.value}</p>
                <p className="text-sm" style={{ color: "var(--muted)" }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Ticker ────────────────────────────────────────────────────────── */}
      <div className="overflow-hidden py-4" style={{ borderBottom: "1px solid var(--border-light)", background: "var(--surface)" }}>
        <div className="ticker flex gap-16 whitespace-nowrap" style={{ width: "max-content" }}>
          {TICKER_ITEMS.map((item, i) => (
            <span key={i} className="flex items-center gap-2.5 text-xs font-semibold tracking-widest uppercase"
              style={{ color: "#1E2D48", fontFamily: "var(--font-heading)" }}>
              <span className="w-1 h-1 rounded-full" style={{ background: "var(--accent)", opacity: 0.4 }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════ FEATURES ═══════════════════════════════ */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-2xl mb-16">
            <p className="section-label">Platform Features</p>
            <h2 className="font-bold tracking-tight mb-5"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, color: "#FFFFFF" }}>
              Every tool you need,
              <br />nothing you don't
            </h2>
            <p className="text-lg" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              From first idea to final upload — every step in your workflow powered by AI built
              specifically for faceless YouTube creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {FEATURES.map((f, i) => (
              <div key={f.title} className="card p-7 relative group">
                {f.tag && (
                  <span className="absolute top-5 right-5 text-[10px] font-bold px-2.5 py-1 rounded-full"
                    style={{ background: "var(--accent-dim)", color: "var(--accent)", fontFamily: "var(--font-heading)", letterSpacing: "0.05em" }}>
                    {f.tag}
                  </span>
                )}
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-105"
                  style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
                  <f.icon size={20} style={{ color: "var(--accent)" }} />
                </div>
                <h3 className="font-bold text-white mb-2.5" style={{ fontFamily: "var(--font-heading)", fontSize: "16px" }}>
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section id="how-it-works" className="py-28 px-6" style={{ background: "var(--surface)", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="section-label justify-center">The Process</p>
            <h2 className="font-bold tracking-tight mb-5"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, color: "#FFFFFF" }}>
              From idea to upload
              <br />in your first week
            </h2>
            <p className="text-lg mx-auto" style={{ color: "var(--muted)", maxWidth: "480px" }}>
              No experience required. Three steps and you're publishing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-10 left-[calc(33.3%+24px)] right-[calc(33.3%+24px)] h-px"
              style={{ background: "linear-gradient(90deg, var(--accent), rgba(34,211,238,0.2))" }} />

            {STEPS.map((step, i) => (
              <div key={step.n} className="relative">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 font-bold text-lg"
                  style={{
                    background: i === 0 ? "var(--accent)" : "var(--surface-2)",
                    color: i === 0 ? "#050D1A" : "var(--muted)",
                    fontFamily: "var(--font-heading)",
                    border: i !== 0 ? "1px solid var(--border)" : "none",
                  }}>
                  {step.n}
                </div>
                <h3 className="font-bold text-white mb-3" style={{ fontFamily: "var(--font-heading)", fontSize: "18px" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "var(--muted)" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ════════════════════════════ */}
      <section id="testimonials" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-16">
            <div>
              <p className="section-label">Creator Stories</p>
              <h2 className="font-bold tracking-tight"
                style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, color: "#FFFFFF" }}>
                Real creators.
                <br />Real results.
              </h2>
            </div>
            <p className="text-sm max-w-xs" style={{ color: "var(--muted)", lineHeight: 1.7 }}>
              From first script to 6-figure channels — here's what creators say after switching.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t, i) => (
              <div key={t.name} className="card p-7 flex flex-col justify-between">
                {/* Result badge */}
                <div className="mb-5">
                  <span className="inline-block text-xs font-semibold px-2.5 py-1 rounded-md mb-4"
                    style={{ background: "rgba(34,211,238,0.08)", color: "var(--accent)", border: "1px solid rgba(34,211,238,0.15)", fontFamily: "var(--font-heading)" }}>
                    {t.result}
                  </span>
                  <div className="flex gap-0.5 mb-4">
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} fill="#FACC15" color="#FACC15" />)}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "#CBD5E1" }}>
                    &ldquo;{t.quote}&rdquo;
                  </p>
                </div>
                {/* Author */}
                <div className="flex items-center gap-3 pt-5" style={{ borderTop: "1px solid var(--border-light)" }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: "var(--surface-2)", border: "1px solid var(--border)", fontFamily: "var(--font-heading)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-heading)" }}>{t.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--muted)" }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═════════════════════════════ PRICING ═══════════════════════════════ */}
      <section id="pricing" className="py-28 px-6"
        style={{ background: "var(--surface)", borderTop: "1px solid var(--border-light)", borderBottom: "1px solid var(--border-light)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="section-label justify-center">Pricing</p>
            <h2 className="font-bold tracking-tight mb-4"
              style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(32px,4vw,52px)", lineHeight: 1.1, color: "#FFFFFF" }}>
              Simple, transparent pricing
            </h2>
            <p className="mb-8" style={{ color: "var(--muted)" }}>
              7-day free trial on every plan. No charge until day 8.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl"
              style={{ background: "var(--bg)", border: "1px solid var(--border)" }}>
              {[["Monthly", false], ["Annual", true]].map(([label, val]) => (
                <button key={String(label)} onClick={() => setAnnual(val as boolean)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: annual === val ? "var(--surface-2)" : "transparent",
                    color: annual === val ? "var(--text)" : "var(--muted)",
                    fontFamily: "var(--font-heading)",
                    border: annual === val ? "1px solid var(--border)" : "1px solid transparent",
                  }}>
                  {String(label)}
                  {val && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{ background: "rgba(52,211,153,0.15)", color: "#34D399" }}>
                      −39%
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map(plan => (
              <div key={plan.id} className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background: plan.popular ? "var(--surface-2)" : "var(--bg)",
                  border: plan.popular ? "1px solid rgba(34,211,238,0.3)" : "1px solid var(--border)",
                }}>

                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-0.5"
                    style={{ background: "linear-gradient(90deg, transparent, var(--accent), transparent)" }} />
                )}

                <div className="p-8">
                  <div className="h-7 mb-6">
                    {plan.popular && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: "var(--accent-dim)", color: "var(--accent)", fontFamily: "var(--font-heading)" }}>
                        <Star size={10} fill="currentColor" /> Most Popular
                      </span>
                    )}
                    {plan.elite && (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full"
                        style={{ background: "rgba(250,204,21,0.1)", color: "#FACC15", fontFamily: "var(--font-heading)" }}>
                        <Crown size={10} fill="currentColor" /> Premium
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <plan.icon size={16} style={{ color: plan.elite ? "#FACC15" : "var(--accent)" }} />
                    <span className="font-bold text-white text-sm" style={{ fontFamily: "var(--font-heading)" }}>{plan.name}</span>
                  </div>

                  <div className="flex items-end gap-1.5 mb-6">
                    <span className="text-5xl font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                      {annual ? plan.annual : plan.price}
                    </span>
                    <span className="mb-2 text-sm" style={{ color: "var(--muted)" }}>/mo</span>
                  </div>

                  <Link href="/login"
                    className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all mb-7"
                    style={plan.popular
                      ? { background: "var(--accent)", color: "#050D1A", fontFamily: "var(--font-heading)" }
                      : { background: "transparent", color: "var(--text)", border: "1px solid var(--border)", fontFamily: "var(--font-heading)" }}>
                    {plan.cta}
                    <ArrowRight size={14} />
                  </Link>

                  <ul className="space-y-3.5">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-start gap-2.5">
                        <Check size={14} className="shrink-0 mt-0.5" style={{ color: "var(--accent)" }} />
                        <span className="text-sm leading-snug" style={{ color: "var(--muted)" }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Guarantees */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-8 text-sm"
            style={{ color: "var(--muted)" }}>
            {[
              [Shield, "7-day money back guarantee"],
              [Clock,  "Cancel anytime, no contracts"],
              [Users,  "Team collaboration on Pro & Elite"],
            ].map(([Icon, text]) => (
              <span key={String(text)} className="flex items-center gap-2">
                <Icon size={14} style={{ color: "var(--accent)" }} />
                {String(text)}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FINAL CTA ═══════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-8"
            style={{ background: "var(--accent)", boxShadow: "0 0 40px rgba(34,211,238,0.2)" }}>
            <TrendingUp size={24} color="#050D1A" />
          </div>
          <h2 className="font-bold tracking-tight mb-5"
            style={{ fontFamily: "var(--font-heading)", fontSize: "clamp(36px,5vw,64px)", lineHeight: 1.08, color: "#FFFFFF" }}>
            Your channel starts
            <br />right now
          </h2>
          <p className="text-lg mb-10 mx-auto" style={{ color: "var(--muted)", maxWidth: "480px", lineHeight: 1.7 }}>
            Join 2,400+ creators building real income on YouTube — without ever showing their face.
          </p>
          <Link href="/login" className="btn-primary text-base px-10 py-5">
            Start your free 7-day trial
            <ArrowRight size={18} />
          </Link>
          <p className="mt-5 text-sm" style={{ color: "#2D3D55" }}>
            No charge until day 8 · No credit card · Cancel anytime
          </p>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <footer className="px-6 py-14"
        style={{ borderTop: "1px solid var(--border-light)", background: "var(--surface)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--accent)" }}>
                  <Zap size={14} fill="#050D1A" color="#050D1A" />
                </div>
                <span className="font-bold text-white" style={{ fontFamily: "var(--font-heading)" }}>
                  Townshub <span style={{ color: "var(--accent)" }}>Faceless</span>
                </span>
              </div>
              <p className="text-sm leading-relaxed max-w-xs" style={{ color: "var(--muted)" }}>
                The complete AI studio for building a profitable faceless YouTube channel.
              </p>
            </div>
            {[
              { label: "Product",  links: ["Features","Pricing","How It Works","Chrome Extension"] },
              { label: "Company",  links: ["Privacy Policy","Terms of Service","Support","Contact"] },
            ].map(col => (
              <div key={col.label}>
                <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "var(--muted)", fontFamily: "var(--font-heading)" }}>
                  {col.label}
                </p>
                <ul className="space-y-2.5">
                  {col.links.map(l => (
                    <li key={l}>
                      <a href="#" className="text-sm transition-colors"
                        style={{ color: "var(--muted)" }}
                        onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                        onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
                        {l}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs"
            style={{ borderTop: "1px solid var(--border-light)", color: "var(--muted)" }}>
            <p>© 2026 Townshub. Not affiliated with YouTube or Google LLC.</p>
            <p>Built for faceless creators everywhere.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
