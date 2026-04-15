import Link from "next/link";
import {
  Zap, PenLine, Kanban, Image as ImageIcon, Compass,
  CheckCircle2, ArrowRight, Star, Play,
  Lightbulb, Sparkles, Users, Shield, Clock,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────── */

const features = [
  {
    icon: PenLine,
    title: "AI Script Writer",
    desc: "Research-backed scripts built section by section, with hooks optimised for retention and watch time.",
    accent: "#06B6D4",
  },
  {
    icon: Lightbulb,
    title: "Viral Video Ideas",
    desc: "AI analyses your niche and competitors to surface ideas ranked by viral potential.",
    accent: "#FACC15",
  },
  {
    icon: ImageIcon,
    title: "Thumbnail Studio",
    desc: "Design click-worthy thumbnails with style presets and AI image generation powered by Flux.1.",
    accent: "#EC4899",
  },
  {
    icon: Compass,
    title: "Niche Finder",
    desc: "Discover untapped niches with RPM data, competition scores, and growth trend analysis.",
    accent: "#34D399",
  },
  {
    icon: Kanban,
    title: "Production Board",
    desc: "Kanban-style pipeline from idea to upload. Assign tasks, set due dates, track every video.",
    accent: "#A78BFA",
  },
  {
    icon: Sparkles,
    title: "Chrome Extension",
    desc: "Outlier scores, video tags, and channel analytics overlaid directly on YouTube as you browse.",
    accent: "#FB923C",
  },
];

const steps = [
  {
    n: "01",
    title: "Set Up Your Style",
    desc: "Add competitor channels and we'll analyse their scripts to build your unique writing DNA.",
    grad: "linear-gradient(135deg,#06B6D4,#0891B2)",
    glow: "rgba(6,182,212,0.4)",
  },
  {
    n: "02",
    title: "Generate & Refine",
    desc: "Write scripts with AI. Design thumbnails. Use the niche finder to target the right audience.",
    grad: "linear-gradient(135deg,#A78BFA,#7C3AED)",
    glow: "rgba(167,139,250,0.4)",
  },
  {
    n: "03",
    title: "Produce & Ship",
    desc: "Track every video on your production board. Set deadlines, collaborate, and publish consistently.",
    grad: "linear-gradient(135deg,#34D399,#059669)",
    glow: "rgba(52,211,153,0.4)",
  },
];

const testimonials = [
  {
    quote: "I went from 0 to 8,000 subscribers in 3 months. The script quality is insane — way better than anything I could write myself.",
    name: "Alex M.",
    role: "Finance Niche · 8.2K subs",
    avatar: "A",
  },
  {
    quote: "The niche finder alone saved me months of research. Found a low-competition niche with $12 RPM in under 10 minutes.",
    name: "Sarah K.",
    role: "Tech Explainer · 22K subs",
    avatar: "S",
  },
  {
    quote: "Production board keeps my whole team aligned. We're shipping 3 videos a week now without the chaos.",
    name: "James T.",
    role: "Motivation Niche · 41K subs",
    avatar: "J",
  },
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    desc: "4 scripts / month",
    popular: false,
    cta: "Get Started",
    features: [
      "4 full AI scripts",
      "120 AI thumbnail assets",
      "Chrome Extension",
      "Video Ideas AI",
      "Production board",
      "Style profiles",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    desc: "15 scripts / month",
    popular: true,
    cta: "Start Pro Trial",
    features: [
      "15 full AI scripts",
      "300 AI thumbnail assets",
      "Everything in Starter",
      "Niche Finder database",
      "Similar Channels finder",
      "Team collaboration",
      "Multiple channel profiles",
    ],
  },
  {
    id: "elite",
    name: "Elite AI",
    price: "$99.99",
    desc: "30 scripts / month",
    popular: false,
    cta: "Go Elite",
    features: [
      "30 full AI scripts",
      "600 AI thumbnail assets",
      "Everything in Pro",
      "AI consulting chat",
      "Personal YouTube mentor",
      "Strategy & growth advice",
      "Priority support",
    ],
  },
];

const mockSidebarItems = [
  { name: "Dashboard", active: true },
  { name: "My Style", active: false },
  { name: "Video Ideas", active: false },
  { name: "New Script", active: false },
  { name: "Production", active: false },
  { name: "Thumbnails", active: false },
];

const mockStats = [
  { l: "Scripts Left", v: "4",   c: "#06B6D4" },
  { l: "Thumbnails",  v: "120", c: "#FB923C" },
  { l: "Video Ideas", v: "∞",   c: "#FACC15" },
  { l: "Tasks",       v: "5",   c: "#34D399" },
];

const mockActions = [
  { name: "Write Script", Icon: PenLine,   color: "#06B6D4" },
  { name: "Video Ideas",  Icon: Lightbulb, color: "#FACC15" },
  { name: "Niche Finder", Icon: Compass,   color: "#34D399" },
];

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#070B14" }}>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 inset-x-0 z-50 border-b"
        style={{
          background: "rgba(7,11,20,0.85)",
          borderColor: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(20px)",
        }}
      >
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: "linear-gradient(135deg,#06B6D4,#0891B2)", boxShadow: "0 0 16px rgba(6,182,212,0.35)" }}
            >
              <Zap size={16} fill="#fff" className="text-white" />
            </div>
            <span className="font-bold" style={{ fontFamily: "var(--font-syne)", fontSize: "15px", letterSpacing: "-0.3px" }}>
              Townshub <span style={{ color: "#06B6D4" }}>Faceless</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8">
            {[["#features","Features"],["#how-it-works","How it Works"],["#pricing","Pricing"]].map(([href,label]) => (
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
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: "#06B6D4", color: "#fff", fontFamily: "var(--font-syne)", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="relative pt-40 pb-24 px-6 text-center overflow-hidden">
        {/* Background glow + grid */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(6,182,212,0.18), transparent)" }}
          />
          <div
            className="absolute inset-0 opacity-[0.025]"
            style={{
              backgroundImage: "linear-gradient(rgba(255,255,255,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.5) 1px,transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8"
            style={{
              background: "rgba(6,182,212,0.08)",
              border: "1px solid rgba(6,182,212,0.2)",
              color: "#06B6D4",
              fontFamily: "var(--font-syne)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.1em",
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            AI-POWERED YOUTUBE GROWTH STUDIO
          </div>

          {/* Headline */}
          <h1
            className="font-bold leading-[1.05] tracking-tight mb-6"
            style={{ fontFamily: "var(--font-syne)", fontSize: "clamp(42px,7vw,76px)", letterSpacing: "-2px" }}
          >
            Build a Faceless<br />
            <span style={{ color: "#06B6D4" }}>YouTube Empire</span><br />
            Without Showing Up
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-slate-400 max-w-xl mx-auto leading-relaxed mb-10">
            AI scripts, viral ideas, stunning thumbnails, and production management —
            every tool to build and scale a faceless YouTube channel in one place.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6">
            <Link href="/login"
              className="flex items-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all"
              style={{
                background: "#06B6D4",
                color: "#fff",
                fontFamily: "var(--font-syne)",
                letterSpacing: "-0.2px",
                boxShadow: "0 0 40px rgba(6,182,212,0.4), 0 4px 20px rgba(0,0,0,0.4)",
              }}>
              Start Free — No Credit Card
              <ArrowRight size={16} />
            </Link>
            <button
              className="flex items-center gap-2.5 text-slate-400 hover:text-white transition-colors text-sm"
              style={{ fontFamily: "var(--font-syne)", fontWeight: 500 }}>
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Play size={13} fill="currentColor" />
              </div>
              Watch Demo
            </button>
          </div>

          <p className="text-xs text-slate-600" style={{ fontFamily: "var(--font-syne)" }}>
            7-day free trial · No credit card required · Cancel anytime
          </p>
        </div>

        {/* Dashboard mockup */}
        <div className="relative max-w-5xl mx-auto mt-20">
          <div className="absolute bottom-0 inset-x-0 h-40 z-10 pointer-events-none"
            style={{ background: "linear-gradient(to top,#070B14,transparent)" }} />
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              border: "1px solid rgba(255,255,255,0.07)",
              boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(6,182,212,0.08), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            {/* Browser bar */}
            <div className="flex items-center gap-2 px-5 py-3"
              style={{ background: "#0D1526", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="flex gap-1.5">
                {["#FF5F57","#FFBD2E","#28C840"].map((c) => (
                  <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />
                ))}
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-6 py-1 rounded text-xs"
                  style={{ background: "rgba(255,255,255,0.03)", color: "#475569", border: "1px solid rgba(255,255,255,0.06)" }}>
                  app.townshub.ai/dashboard
                </div>
              </div>
            </div>

            {/* Mock UI */}
            <div className="flex" style={{ background: "#080D1A", minHeight: "360px" }}>
              {/* Sidebar */}
              <div className="shrink-0 py-5 px-3 space-y-0.5"
                style={{ width: "190px", background: "#0A1020", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                <div className="flex items-center gap-2 px-3 pb-4 mb-3"
                  style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ background: "linear-gradient(135deg,#06B6D4,#0891B2)" }}>
                    <Zap size={13} fill="#fff" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Townshub</p>
                    <p className="text-[9px] font-bold tracking-widest uppercase" style={{ color: "#06B6D4" }}>Faceless</p>
                  </div>
                </div>
                {mockSidebarItems.map((item) => (
                  <div key={item.name} className="px-3 py-2 rounded-lg text-xs"
                    style={item.active
                      ? { background: "rgba(6,182,212,0.1)", color: "#06B6D4", border: "1px solid rgba(6,182,212,0.18)", fontFamily: "var(--font-syne)", fontWeight: 600 }
                      : { color: "#334155", fontFamily: "var(--font-syne)" }}>
                    {item.name}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div className="flex-1 p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-bold text-white" style={{ fontFamily: "var(--font-syne)" }}>Dashboard</p>
                  <div className="flex gap-2">
                    <div className="w-7 h-7 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
                    <div className="w-7 h-7 rounded-full" style={{ background: "linear-gradient(135deg,#FB923C,#ea580c)" }} />
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {mockStats.map((s) => (
                    <div key={s.l} className="rounded-xl p-3"
                      style={{ background: "#0F1829", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p className="text-lg font-bold" style={{ color: s.c, fontFamily: "var(--font-syne)" }}>{s.v}</p>
                      <p className="text-[10px] mt-0.5" style={{ color: "#334155" }}>{s.l}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {mockActions.map((qa) => (
                    <div key={qa.name} className="rounded-xl p-4"
                      style={{ background: `${qa.color}0D`, border: `1px solid ${qa.color}25` }}>
                      <div className="w-6 h-6 rounded mb-2 flex items-center justify-center"
                        style={{ background: `${qa.color}20` }}>
                        <qa.Icon size={13} style={{ color: qa.color }} />
                      </div>
                      <p className="text-xs font-semibold" style={{ color: "#64748B", fontFamily: "var(--font-syne)" }}>{qa.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <section className="py-16 px-6" style={{ borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "10,000+", label: "Scripts Generated" },
            { value: "4.9★",   label: "Average Rating" },
            { value: "50+",    label: "Supported Niches" },
            { value: "< 30s",  label: "Script Generation" },
          ].map((s, i) => (
            <div key={s.label} className="relative">
              {i < 3 && (
                <div className="absolute right-0 top-1/4 h-1/2 w-px hidden md:block"
                  style={{ background: "rgba(255,255,255,0.06)" }} />
              )}
              <p className="text-3xl font-bold mb-1" style={{ fontFamily: "var(--font-syne)", color: "#06B6D4" }}>{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#06B6D4" }}>
              Platform Features
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4"
              style={{ fontFamily: "var(--font-syne)", letterSpacing: "-1px" }}>
              Everything to produce<br />
              <span style={{ color: "#06B6D4" }}>better videos, faster</span>
            </h2>
            <p className="text-slate-400 max-w-xl mx-auto leading-relaxed">
              From your first idea to the final upload — Townshub handles every step of the content creation process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="group relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: `radial-gradient(circle at top left,${f.accent}12,transparent 60%)` }} />
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5"
                  style={{ background: `${f.accent}15`, border: `1px solid ${f.accent}25`, color: f.accent }}>
                  <f.icon size={18} />
                </div>
                <h3 className="text-base font-bold text-white mb-2"
                  style={{ fontFamily: "var(--font-syne)" }}>{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-28 px-6" style={{ background: "rgba(255,255,255,0.012)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#FB923C" }}>
              The Process
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold"
              style={{ fontFamily: "var(--font-syne)", letterSpacing: "-1px" }}>
              From idea to upload<br />in 3 steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px"
              style={{ background: "linear-gradient(90deg,#06B6D4,#A78BFA,#34D399)" }} />
            {steps.map((step) => (
              <div key={step.n} className="text-center">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-white"
                  style={{ background: step.grad, fontFamily: "var(--font-syne)", boxShadow: `0 0 30px ${step.glow}` }}>
                  {step.n}
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily: "var(--font-syne)" }}>{step.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#34D399" }}>
              Creator Stories
            </p>
            <h2 className="text-4xl font-bold"
              style={{ fontFamily: "var(--font-syne)", letterSpacing: "-1px" }}>
              Real results from real creators
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {testimonials.map((t) => (
              <div key={t.name} className="rounded-2xl p-6"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={13} fill="#FACC15" style={{ color: "#FACC15" }} />
                  ))}
                </div>
                <p className="text-sm text-slate-300 leading-relaxed mb-5">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white"
                    style={{ background: "linear-gradient(135deg,#06B6D4,#0891B2)", fontFamily: "var(--font-syne)" }}>
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

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section id="pricing" className="py-28 px-6" style={{ background: "rgba(255,255,255,0.012)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-4"
              style={{ fontFamily: "var(--font-syne)", color: "#FB923C" }}>
              Simple Pricing
            </p>
            <h2 className="text-4xl sm:text-5xl font-bold mb-3"
              style={{ fontFamily: "var(--font-syne)", letterSpacing: "-1px" }}>
              Choose your plan
            </h2>
            <p className="text-slate-400">7-day free trial on all plans. Cancel anytime.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map((plan) => (
              <div key={plan.id} className="relative rounded-2xl overflow-hidden"
                style={{
                  background: plan.popular ? "rgba(6,182,212,0.05)" : "rgba(255,255,255,0.02)",
                  border: plan.popular ? "1px solid rgba(6,182,212,0.35)" : "1px solid rgba(255,255,255,0.06)",
                  boxShadow: plan.popular ? "0 0 50px rgba(6,182,212,0.08)" : "none",
                }}>
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-px"
                    style={{ background: "linear-gradient(90deg,transparent,#06B6D4,transparent)" }} />
                )}
                <div className="p-7">
                  {plan.popular
                    ? <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5 text-xs font-bold"
                        style={{ background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", color: "#06B6D4", fontFamily: "var(--font-syne)" }}>
                        <Star size={10} fill="currentColor" /> Most Popular
                      </div>
                    : <div className="h-7 mb-5" />
                  }
                  <p className="text-sm font-bold text-white mb-2" style={{ fontFamily: "var(--font-syne)" }}>{plan.name}</p>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold text-white" style={{ fontFamily: "var(--font-syne)", letterSpacing: "-1.5px" }}>{plan.price}</span>
                    <span className="text-slate-500 mb-1 text-sm">/mo</span>
                  </div>
                  <p className="text-xs font-semibold mb-6" style={{ color: "#06B6D4", fontFamily: "var(--font-syne)" }}>{plan.desc}</p>
                  <Link href="/login"
                    className="w-full py-3 rounded-xl text-sm font-bold flex items-center justify-center gap-2 mb-6 transition-all"
                    style={plan.popular
                      ? { background: "#06B6D4", color: "#fff", fontFamily: "var(--font-syne)", boxShadow: "0 0 24px rgba(6,182,212,0.3)" }
                      : { background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)", fontFamily: "var(--font-syne)" }}>
                    {plan.cta} <ArrowRight size={14} />
                  </Link>
                  <ul className="space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color: "#06B6D4" }} />
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
            <span className="flex items-center gap-2"><Clock size={14} style={{ color: "#06B6D4" }} /> Cancel anytime — no lock-in</span>
            <span className="flex items-center gap-2"><Users size={14} style={{ color: "#A78BFA" }} /> Team collaboration on Pro+</span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="relative rounded-3xl p-16 overflow-hidden"
            style={{ background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.15)" }}>
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(6,182,212,0.12),transparent)" }} />
            <div className="relative">
              <h2 className="text-4xl sm:text-5xl font-bold mb-4"
                style={{ fontFamily: "var(--font-syne)", letterSpacing: "-1px" }}>
                Ready to build your<br />faceless channel?
              </h2>
              <p className="text-slate-400 mb-8 max-w-md mx-auto leading-relaxed">
                Join thousands of creators using Townshub to generate scripts, thumbnails, and viral ideas on autopilot.
              </p>
              <Link href="/login"
                className="inline-flex items-center gap-2 px-10 py-4 rounded-xl text-base font-bold transition-all"
                style={{ background: "#06B6D4", color: "#fff", fontFamily: "var(--font-syne)", boxShadow: "0 0 40px rgba(6,182,212,0.35)", letterSpacing: "-0.2px" }}>
                Start Free Today <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-slate-600 mt-4">7-day free trial · No credit card required · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="px-6 py-10" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#06B6D4,#0891B2)" }}>
              <Zap size={12} fill="#fff" />
            </div>
            <span className="text-sm font-bold text-slate-400" style={{ fontFamily: "var(--font-syne)" }}>
              Townshub Faceless
            </span>
          </div>
          <p className="text-xs text-slate-600">© 2026 Townshub. All rights reserved.</p>
          <div className="flex gap-6 text-xs text-slate-500">
            {["Privacy","Terms","Support"].map((l) => (
              <a key={l} href="#" className="hover:text-slate-300 transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
