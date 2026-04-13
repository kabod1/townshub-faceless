import Link from "next/link";
import {
  Zap, PenLine, Kanban, Image, Compass, Puzzle,
  CheckCircle2, ArrowRight, Star, Crown, TrendingUp,
  Play, Lightbulb, Sparkles, Users, Shield, Clock,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────────── */

const features = [
  {
    icon: PenLine,
    title: "AI Script Writer",
    desc: "Research-backed scripts section by section, with hooks optimised for retention and watch time.",
    accent: "#00D4FF",
    glow: "rgba(0,212,255,0.15)",
    border: "rgba(0,212,255,0.2)",
    tag: "Most Used",
  },
  {
    icon: Lightbulb,
    title: "Viral Video Ideas",
    desc: "AI analyses your niche and competitor channels to generate ideas ranked by viral potential.",
    accent: "#FACC15",
    glow: "rgba(250,204,21,0.12)",
    border: "rgba(250,204,21,0.2)",
    tag: null,
  },
  {
    icon: Image,
    title: "Thumbnail Studio",
    desc: "Design click-worthy thumbnails with style presets and AI image generation powered by Flux.1.",
    accent: "#EC4899",
    glow: "rgba(236,72,153,0.12)",
    border: "rgba(236,72,153,0.2)",
    tag: null,
  },
  {
    icon: Compass,
    title: "Niche Finder",
    desc: "Discover untapped niches with RPM data, competition scores, and growth trend analysis.",
    accent: "#34D399",
    glow: "rgba(52,211,153,0.12)",
    border: "rgba(52,211,153,0.2)",
    tag: null,
  },
  {
    icon: Kanban,
    title: "Production Board",
    desc: "Kanban-style pipeline from idea to upload. Assign tasks, set due dates, track every video.",
    accent: "#A78BFA",
    glow: "rgba(167,139,250,0.12)",
    border: "rgba(167,139,250,0.2)",
    tag: null,
  },
  {
    icon: Puzzle,
    title: "Chrome Extension",
    desc: "Outlier scores, video tags, and channel analytics overlaid directly on YouTube as you browse.",
    accent: "#FB923C",
    glow: "rgba(251,146,60,0.12)",
    border: "rgba(251,146,60,0.2)",
    tag: null,
  },
];

const stats = [
  { value: "10,000+", label: "Scripts Generated" },
  { value: "4.9★", label: "Average Rating" },
  { value: "50+", label: "Supported Niches" },
  { value: "< 30s", label: "Script Generation" },
];

const testimonials = [
  {
    quote: "I went from 0 to 8,000 subscribers in 3 months. The script quality is insane — way better than anything I could write myself.",
    name: "Alex M.",
    role: "Finance Niche · 8.2K subs",
    avatar: "A",
    color: "from-cyan-500 to-cyan-700",
  },
  {
    quote: "The niche finder alone saved me months of research. Found a low-competition niche with $12 RPM in 10 minutes.",
    name: "Sarah K.",
    role: "Tech Explainer · 22K subs",
    avatar: "S",
    color: "from-violet-500 to-violet-700",
  },
  {
    quote: "Production board keeps my whole team aligned. We're shipping 3 videos a week now without the chaos.",
    name: "James T.",
    role: "Motivation Niche · 41K subs",
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
    ctaClass: "bg-white/8 border border-white/20 text-white hover:bg-white/14",
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
    ctaClass: "bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] font-bold hover:shadow-[0_0_28px_rgba(0,212,255,0.5)]",
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
    ctaClass: "bg-gradient-to-r from-yellow-400 to-orange-500 text-[#04080F] font-bold hover:shadow-[0_0_28px_rgba(250,204,21,0.4)]",
    features: ["30 full AI scripts", "600 AI thumbnail assets", "Everything in Pro", "AI consulting chat", "Personal YouTube mentor", "Strategy & growth advice", "Priority support"],
  },
];

/* ─── Component ─────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080D1A] text-[#E8F0FF] overflow-x-hidden">

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-white/6"
        style={{ background: "rgba(8,13,26,0.85)" }}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", boxShadow: "0 0 16px rgba(0,212,255,0.5)" }}>
              <Zap size={15} fill="#04080F" className="text-[#04080F]" />
            </div>
            <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
              Townshub <span style={{ color: "#00D4FF" }}>Faceless</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {[["#features", "Features"], ["#how-it-works", "How it Works"], ["#pricing", "Pricing"]].map(([href, label]) => (
              <a key={href} href={href}
                className="text-sm text-slate-400 hover:text-white transition-colors"
                style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>
                {label}
              </a>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/login"
              className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
              style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>
              Log In
            </Link>
            <Link href="/login"
              className="px-5 py-2.5 rounded-xl text-sm transition-all"
              style={{
                background: "linear-gradient(135deg,#00D4FF,#0090cc)",
                color: "#04080F",
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                boxShadow: "0 0 20px rgba(0,212,255,0.3)",
              }}>
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-28 px-6 text-center overflow-hidden">
        {/* Layered background glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] rounded-full opacity-20"
            style={{ background: "radial-gradient(ellipse,#00D4FF 0%,transparent 70%)", filter: "blur(80px)" }} />
          <div className="absolute top-40 left-1/4 w-[400px] h-[300px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse,#A78BFA 0%,transparent 70%)", filter: "blur(60px)" }} />
          <div className="absolute top-40 right-1/4 w-[400px] h-[300px] rounded-full opacity-10"
            style={{ background: "radial-gradient(ellipse,#FB923C 0%,transparent 70%)", filter: "blur(60px)" }} />
          {/* Dot grid */}
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "radial-gradient(rgba(0,212,255,1) 1px,transparent 1px)", backgroundSize: "28px 28px" }} />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Pill badge */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8 text-xs font-bold tracking-widest uppercase"
            style={{
              fontFamily: "var(--font-syne)",
              background: "rgba(0,212,255,0.08)",
              border: "1px solid rgba(0,212,255,0.25)",
              color: "#00D4FF",
            }}>
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            <Sparkles size={11} className="animate-glow-pulse" />
            AI-Powered YouTube Growth Studio
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-[72px] font-bold leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-syne)", color: "#FFFFFF" }}>
            Build a Faceless
            <br />
            <span className="animate-shimmer" style={{
              background: "linear-gradient(90deg,#00D4FF,#38BDF8,#A78BFA,#00D4FF)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              backgroundSize: "200% auto",
            }}>
              YouTube Empire
            </span>
            <br />
            Without Showing Up
          </h1>

          {/* Sub */}
          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            AI scripts. Viral ideas. Stunning thumbnails. Production management.
            Every tool you need to build and scale a faceless YouTube channel — in one studio.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Link href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base transition-all"
              style={{
                background: "linear-gradient(135deg,#00D4FF,#0090cc)",
                color: "#04080F",
                fontFamily: "var(--font-syne)",
                fontWeight: 700,
                boxShadow: "0 0 40px rgba(0,212,255,0.35), 0 4px 20px rgba(0,0,0,0.4)",
              }}>
              Start Free — No Credit Card
              <ArrowRight size={16} />
            </Link>
            <button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors text-sm"
              style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>
              <div className="w-11 h-11 rounded-full flex items-center justify-center transition-all hover:scale-105"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.15)" }}>
                <Play size={14} fill="currentColor" />
              </div>
              Watch 2-min Demo
            </button>
          </div>

          {/* Trust row */}
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-slate-500">
            {["No tech skills needed", "Works for any niche", "Cancel anytime", "7-day free trial"].map((t) => (
              <span key={t} className="flex items-center gap-2">
                <CheckCircle2 size={14} style={{ color: "#34D399" }} />
                {t}
              </span>
            ))}
          </div>
        </div>

        {/* Dashboard screenshot mockup */}
        <div className="relative max-w-5xl mx-auto mt-20">
          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-32 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to top,#080D1A,transparent)" }} />

          <div className="rounded-[17px] p-[1px] animate-border-glow"
            style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.5) 0%, rgba(167,139,250,0.25) 50%, rgba(0,212,255,0.15) 100%)",
            }}>
          <div className="rounded-2xl overflow-hidden"
            style={{
              boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
            }}>
            {/* Browser chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5"
              style={{ background: "#0A1020", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex gap-1.5">
                {["rgba(239,68,68,0.7)", "rgba(234,179,8,0.7)", "rgba(34,197,94,0.7)"].map((c, i) => (
                  <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-8 py-1.5 rounded-lg text-xs"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "#64748B" }}>
                  townshub.ai/dashboard
                </div>
              </div>
            </div>

            {/* Mock UI */}
            <div className="flex" style={{ background: "#080D1A", minHeight: "340px" }}>
              {/* Sidebar */}
              <div className="shrink-0 py-5 px-3 space-y-1" style={{ width: "180px", background: "#0A1020", borderRight: "1px solid rgba(255,255,255,0.05)" }}>
                {/* Logo */}
                <div className="flex items-center gap-2 px-3 pb-4 mb-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", boxShadow: "0 0 10px rgba(0,212,255,0.4)" }}>
                    <Zap size={13} fill="#04080F" className="text-[#04080F]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Townshub</p>
                    <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#00D4FF", fontFamily: "var(--font-syne)" }}>Faceless</p>
                  </div>
                </div>
                {[
                  { name: "Dashboard", active: true, color: "#00D4FF" },
                  { name: "My Style", active: false, color: null },
                  { name: "Video Ideas", active: false, color: null },
                  { name: "New Script", active: false, color: null },
                  { name: "Production", active: false, color: null },
                ].map((item) => (
                  <div key={item.name}
                    className="px-3 py-2 rounded-lg text-xs font-medium"
                    style={item.active
                      ? { background: "rgba(0,212,255,0.1)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)", fontFamily: "var(--font-syne)" }
                      : { color: "#475569", fontFamily: "var(--font-syne)" }}>
                    {item.name}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-6 space-y-5">
                {/* Topbar */}
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Dashboard</p>
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)" }} />
                    <div className="w-7 h-7 rounded-full" style={{ background: "linear-gradient(135deg,#FB923C,#ea580c)" }} />
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Scripts Left", v: "4", color: "#00D4FF" },
                    { label: "Thumbnails", v: "120", color: "#FB923C" },
                    { label: "Video Ideas", v: "∞", color: "#FACC15" },
                    { label: "Tasks", v: "5", color: "#34D399" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-xl p-3.5"
                      style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.07)" }}>
                      <p className="text-xl font-bold" style={{ color: s.color, fontFamily: "var(--font-syne)" }}>{s.v}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#475569" }}>{s.label}</p>
                    </div>
                  ))}
                </div>
                {/* Quick actions */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Write Script", color: "rgba(0,212,255,0.12)", border: "rgba(0,212,255,0.2)", Icon: PenLine, iconColor: "#00D4FF" },
                    { name: "Video Ideas", color: "rgba(250,204,21,0.1)", border: "rgba(250,204,21,0.2)", Icon: Lightbulb, iconColor: "#FACC15" },
                    { name: "Niche Finder", color: "rgba(52,211,153,0.1)", border: "rgba(52,211,153,0.2)", Icon: Compass, iconColor: "#34D399" },
                  ].map((qa) => (
                    <div key={qa.name} className="rounded-xl p-4"
                      style={{ background: qa.color, border: `1px solid ${qa.border}` }}>
                      <div className="w-6 h-6 rounded-md flex items-center justify-center mb-2" style={{ background: `${qa.iconColor}20` }}>
                        <qa.Icon size={13} style={{ color: qa.iconColor }} />
                      </div>
                      <p className="text-xs font-semibold" style={{ color: "#94A3B8", fontFamily: "var(--font-syne)" }}>{qa.name}</p>
                    </div>
                  ))}
                </div>
                {/* Alert */}
                <div className="rounded-xl p-3.5 flex items-center gap-2"
                  style={{ background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)" }}>
                  <div className="w-5 h-5 rounded-md flex items-center justify-center shrink-0"
                    style={{ background: "rgba(255,107,53,0.2)" }}>
                    <span style={{ fontSize: "10px" }}>⚡</span>
                  </div>
                  <p className="text-xs" style={{ color: "#FB923C", fontFamily: "var(--font-syne)", fontWeight: 600 }}>
                    Set up your channel profile to unlock AI features →
                  </p>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </section>

      {/* ── Stats bar ────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 relative">
        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl p-8"
            style={{
              background: "linear-gradient(135deg,rgba(22,32,53,0.9),rgba(15,24,41,0.95))",
              border: "1px solid rgba(0,212,255,0.12)",
            }}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={s.label} className="text-center relative">
                  {i < stats.length - 1 && (
                    <div className="absolute right-0 top-1/4 h-1/2 w-px hidden md:block"
                      style={{ background: "rgba(255,255,255,0.07)" }} />
                  )}
                  <p className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-syne)", color: "#00D4FF" }}>{s.value}</p>
                  <p className="text-sm text-slate-500">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#00D4FF" }}>
              Platform Features
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-syne)" }}>
              Everything you need to
              <br />
              <span style={{
                background: "linear-gradient(90deg,#A78BFA,#00D4FF)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>produce better videos</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From your first idea to the final upload — Townshub handles every step of the content creation process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div key={f.title}
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 cursor-pointer"
                style={{
                  background: `linear-gradient(135deg,${f.glow},rgba(15,24,41,0.95))`,
                  border: `1px solid ${f.border}`,
                }}>
                {/* Corner glow */}
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(circle,${f.glow},transparent)`, filter: "blur(20px)" }} />

                {f.tag && (
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full text-[10px] font-bold"
                    style={{ background: `${f.glow}`, border: `1px solid ${f.border}`, color: f.accent, fontFamily: "var(--font-syne)" }}>
                    {f.tag}
                  </div>
                )}

                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 transition-transform duration-200 group-hover:scale-110"
                  style={{ background: `${f.glow}`, border: `1px solid ${f.border}`, color: f.accent }}>
                  <f.icon size={20} />
                </div>

                <h3 className="text-base font-bold text-white mb-2 group-hover:transition-colors"
                  style={{ fontFamily: "var(--font-syne)" }}>
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 px-6 relative">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%,rgba(167,139,250,0.04),transparent)" }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#FB923C" }}>
              The Process
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-syne)" }}>
              From idea to upload in 3 steps
            </h2>
            <p className="text-lg text-slate-400">No experience required. Start publishing in your first week.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connector */}
            <div className="hidden md:block absolute top-12 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
              style={{ background: "linear-gradient(90deg,rgba(0,212,255,0.3),rgba(167,139,250,0.3),rgba(52,211,153,0.3))" }} />

            {[
              { n: "01", title: "Set Up Your Style", desc: "Add competitor channels and we'll analyse their scripts to build your unique writing DNA.", bg: "linear-gradient(135deg,#00D4FF,#0090cc)", glow: "0 0 30px rgba(0,212,255,0.5)" },
              { n: "02", title: "Generate & Refine", desc: "Write scripts with AI. Design thumbnails. Use the niche finder to target the right audience.", bg: "linear-gradient(135deg,#A78BFA,#7C3AED)", glow: "0 0 30px rgba(167,139,250,0.5)" },
              { n: "03", title: "Produce & Ship", desc: "Track every video on your production board. Set deadlines, collaborate, and publish consistently.", bg: "linear-gradient(135deg,#34D399,#059669)", glow: "0 0 30px rgba(52,211,153,0.5)" },
            ].map((step) => (
              <div key={step.n} className="text-center relative">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background: step.bg, boxShadow: step.glow }}>
                  <span className="text-2xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{step.n}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "var(--font-syne)" }}>{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#34D399" }}>
              Creator Stories
            </p>
            <h2 className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>
              Real results from real creators
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {testimonials.map((t) => (
              <div key={t.name}
                className="rounded-2xl p-6"
                style={{
                  background: "linear-gradient(135deg,rgba(22,32,53,0.9),rgba(15,24,41,0.95))",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}>
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#FACC15" style={{ color: "#FACC15" }} />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold bg-gradient-to-br ${t.color}`}
                    style={{ fontFamily: "var(--font-syne)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white" style={{ fontFamily: "var(--font-syne)" }}>{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
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
          style={{ background: "radial-gradient(ellipse 60% 40% at 50% 50%,rgba(251,146,60,0.04),transparent)" }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#FB923C" }}>
              Simple Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-syne)" }}>
              Choose your plan
            </h2>
            <p className="text-lg text-slate-400">7-day free trial on all plans. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {plans.map((plan) => (
              <div key={plan.id}
                className="relative rounded-2xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg,rgba(22,32,53,0.9),rgba(15,24,41,0.95))",
                  border: plan.popular ? "1px solid rgba(0,212,255,0.4)" : plan.id === "elite" ? "1px solid rgba(250,204,21,0.3)" : "1px solid rgba(255,255,255,0.08)",
                  boxShadow: plan.popular ? "0 0 40px rgba(0,212,255,0.08)" : "none",
                }}>
                {/* Top accent line */}
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-0.5"
                    style={{ background: "linear-gradient(90deg,transparent,#00D4FF,transparent)" }} />
                )}
                {plan.id === "elite" && (
                  <div className="absolute top-0 inset-x-0 h-0.5"
                    style={{ background: "linear-gradient(90deg,transparent,#FACC15,transparent)" }} />
                )}

                <div className="p-7">
                  {plan.popular && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5 text-xs font-bold"
                      style={{ background: "rgba(0,212,255,0.12)", border: "1px solid rgba(0,212,255,0.25)", color: "#00D4FF", fontFamily: "var(--font-syne)" }}>
                      <Star size={10} fill="currentColor" /> Most Popular
                    </div>
                  )}
                  {plan.id === "elite" && (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5 text-xs font-bold"
                      style={{ background: "rgba(250,204,21,0.12)", border: "1px solid rgba(250,204,21,0.25)", color: "#FACC15", fontFamily: "var(--font-syne)" }}>
                      <Crown size={10} fill="currentColor" /> Premium
                    </div>
                  )}
                  {plan.id === "starter" && <div className="h-7 mb-5" />}

                  <div className="flex items-center gap-2 mb-3">
                    <plan.icon size={16} style={{ color: plan.accentColor }} />
                    <span className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{plan.name}</span>
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>{plan.price}</span>
                    <span className="text-slate-500 mb-1 text-sm">/mo</span>
                  </div>
                  <p className="text-xs font-semibold mb-6" style={{ color: plan.accentColor, fontFamily: "var(--font-syne)" }}>
                    {plan.scripts}
                  </p>

                  <Link href="/login"
                    className={`w-full py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-all mb-6 ${plan.ctaClass}`}
                    style={{ fontFamily: "var(--font-syne)" }}>
                    {plan.id === "starter" ? "Get Started" : plan.id === "pro" ? "Start Pro" : "Go Elite"}
                    <ArrowRight size={14} />
                  </Link>

                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: "#00D4FF" }} />
                        <span className="text-xs text-slate-400 leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Money back */}
          <div className="mt-10 flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2"><Shield size={14} style={{ color: "#34D399" }} /> 7-day money back guarantee</span>
            <span className="flex items-center gap-2"><Clock size={14} style={{ color: "#00D4FF" }} /> Cancel anytime — no lock-in</span>
            <span className="flex items-center gap-2"><Users size={14} style={{ color: "#A78BFA" }} /> Team collaboration on Pro+</span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden p-14 text-center"
            style={{
              background: "linear-gradient(135deg,rgba(22,32,53,0.95),rgba(15,24,41,1))",
              border: "1px solid rgba(0,212,255,0.15)",
            }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(0,212,255,0.1),transparent)" }} />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)", boxShadow: "0 0 40px rgba(0,212,255,0.4)" }}>
                <TrendingUp size={24} className="text-[#04080F]" />
              </div>
              <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "var(--font-syne)" }}>
                Ready to build your<br />faceless channel?
              </h2>
              <p className="text-lg text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Join thousands of creators using Townshub to generate scripts, thumbnails, and viral ideas on autopilot.
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base transition-all"
                style={{
                  background: "linear-gradient(135deg,#00D4FF,#0090cc)",
                  color: "#04080F",
                  fontFamily: "var(--font-syne)",
                  fontWeight: 700,
                  boxShadow: "0 0 40px rgba(0,212,255,0.35)",
                }}>
                Start Free Today
                <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-slate-600 mt-4">7-day free trial · No credit card required · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="border-t px-6 py-10" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#00D4FF,#0090cc)" }}>
              <Zap size={12} fill="#04080F" className="text-[#04080F]" />
            </div>
            <span className="text-sm font-bold text-slate-400" style={{ fontFamily: "var(--font-syne)" }}>
              Townshub Faceless
            </span>
          </div>
          <p className="text-xs text-slate-600">© 2026 Townshub. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            {["Privacy", "Terms", "Support"].map((l) => (
              <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
