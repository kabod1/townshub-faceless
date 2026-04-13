import Link from "next/link";
import {
  Zap, PenLine, Kanban, Image, Compass, Puzzle,
  CheckCircle2, ArrowRight, Star, Crown, TrendingUp,
  Play, Lightbulb, Sparkles
} from "lucide-react";

const features = [
  {
    icon: PenLine,
    title: "AI Script Writer",
    desc: "Generate research-backed scripts section by section, with hooks optimized for retention and watch time.",
    color: "from-cyan-500/20 to-cyan-600/10 border-cyan-500/20",
    iconColor: "text-cyan-400",
    iconBg: "bg-cyan-500/15",
  },
  {
    icon: Kanban,
    title: "Production Board",
    desc: "Kanban-style workflow to manage every video from idea to upload. Assign tasks, set deadlines.",
    color: "from-violet-500/20 to-violet-600/10 border-violet-500/20",
    iconColor: "text-violet-400",
    iconBg: "bg-violet-500/15",
  },
  {
    icon: Image,
    title: "AI Thumbnail Studio",
    desc: "Design click-worthy thumbnails with AI image generation, text overlays, and style presets.",
    color: "from-pink-500/20 to-pink-600/10 border-pink-500/20",
    iconColor: "text-pink-400",
    iconBg: "bg-pink-500/15",
  },
  {
    icon: Puzzle,
    title: "Chrome Extension",
    desc: "Analyze any YouTube channel directly on YouTube. See outlier scores, video tags, and channel analytics.",
    color: "from-orange-500/20 to-orange-600/10 border-orange-500/20",
    iconColor: "text-orange-400",
    iconBg: "bg-orange-500/15",
  },
  {
    icon: Compass,
    title: "Niche Finder",
    desc: "Discover high-performing faceless channels across niches. Find untapped opportunities with our growing database.",
    color: "from-emerald-500/20 to-emerald-600/10 border-emerald-500/20",
    iconColor: "text-emerald-400",
    iconBg: "bg-emerald-500/15",
  },
  {
    icon: Lightbulb,
    title: "Video Ideas AI",
    desc: "AI-generated viral video concepts based on your niche and competitor analysis, ranked by viral potential.",
    color: "from-yellow-500/20 to-yellow-600/10 border-yellow-500/20",
    iconColor: "text-yellow-400",
    iconBg: "bg-yellow-500/15",
  },
];

const steps = [
  {
    number: "01",
    title: "Set Up Your Style",
    desc: "Add competitor channels and we&apos;ll analyze their scripts to build your unique writing DNA.",
    color: "bg-gradient-to-br from-cyan-500 to-cyan-700",
    glow: "shadow-[0_0_30px_rgba(0,212,255,0.4)]",
  },
  {
    number: "02",
    title: "Generate & Refine",
    desc: "Write scripts section by section with AI. Design thumbnails. Narrate with AI voices. All in one place.",
    color: "bg-gradient-to-br from-violet-500 to-violet-700",
    glow: "shadow-[0_0_30px_rgba(139,92,246,0.4)]",
  },
  {
    number: "03",
    title: "Produce & Ship",
    desc: "Track every video on your production board. Assign tasks, set deadlines, collaborate with your team.",
    color: "bg-gradient-to-br from-emerald-500 to-emerald-700",
    glow: "shadow-[0_0_30px_rgba(16,185,129,0.4)]",
  },
];

const plans = [
  {
    id: "starter",
    name: "Starter",
    price: "$9.99",
    scripts: "4 scripts/month",
    color: "border-white/10",
    cta: "Get Started",
    ctaStyle: "bg-white/8 border border-white/15 text-white hover:bg-white/12",
    popular: false,
    icon: Zap,
    iconColor: "text-cyan-400",
    features: [
      "4 full AI scripts",
      "120 AI thumbnail assets",
      "Chrome Extension",
      "Score review & analysis",
      "Style profiles",
      "Research import (URLs, PDFs)",
      "Production board",
    ],
  },
  {
    id: "pro",
    name: "Pro",
    price: "$29.99",
    scripts: "15 scripts/month",
    color: "border-cyan-400/40",
    cta: "Start Pro",
    ctaStyle: "bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] hover:shadow-[0_0_24px_rgba(0,212,255,0.4)]",
    popular: true,
    icon: Star,
    iconColor: "text-cyan-400",
    features: [
      "15 full AI scripts",
      "300 AI thumbnail assets",
      "Everything in Starter",
      "Niche Finder database",
      "Similar Channels finder",
      "Saved Channels",
      "Team collaboration",
      "Multiple channel profiles",
      "Priority generation",
    ],
  },
  {
    id: "elite",
    name: "Elite AI",
    price: "$99.99",
    scripts: "30 scripts/month",
    color: "border-yellow-500/30",
    cta: "Go Elite",
    ctaStyle: "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:shadow-[0_0_24px_rgba(255,193,7,0.4)]",
    popular: false,
    icon: Crown,
    iconColor: "text-yellow-400",
    features: [
      "30 full AI scripts",
      "600 AI thumbnail assets",
      "Everything in Pro",
      "AI consulting chat",
      "Personal YouTube mentor",
      "Strategy & growth advice",
      "Niche & trend analysis",
      "Priority support",
    ],
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#080D1A] text-[#E8F0FF] overflow-x-hidden">

      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b border-white/5 bg-[#080D1A]/80">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shadow-[0_0_16px_rgba(0,212,255,0.4)]">
              <Zap size={16} className="text-[#04080F]" fill="currentColor" />
            </div>
            <div>
              <span className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">Townshub</span>
              <span className="text-xs text-cyan-400 font-bold font-[family-name:var(--font-syne)] ml-1">Faceless</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Features", "How it Works", "Pricing"].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
                {item}
              </a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="text-sm text-slate-400 hover:text-white transition-colors font-medium">
              Log In
            </Link>
            <Link href="/dashboard"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] text-sm font-bold font-[family-name:var(--font-syne)] hover:shadow-[0_0_20px_rgba(0,212,255,0.35)] transition-all">
              Get Started Free
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(0,212,255,0.12),transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_40%_30%_at_80%_60%,rgba(255,107,53,0.06),transparent)]" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(rgba(0,212,255,0.04) 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-cyan-500/20 bg-cyan-500/8 text-cyan-400 text-xs font-bold font-[family-name:var(--font-syne)] tracking-widest uppercase mb-8">
            <Sparkles size={12} />
            AI-Powered YouTube Growth Studio
          </div>

          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white font-[family-name:var(--font-syne)] leading-[1.05] tracking-tight mb-6">
            Build a Faceless
            <br />
            <span className="bg-gradient-to-r from-cyan-400 via-cyan-300 to-cyan-500 bg-clip-text text-transparent">
              YouTube Empire
            </span>
            <br />
            Without Showing Up
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            AI scripts. Viral ideas. Stunning thumbnails. Production management.
            Everything you need to build and scale a faceless YouTube channel — in one studio.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link href="/dashboard"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] text-base font-bold font-[family-name:var(--font-syne)] hover:shadow-[0_0_32px_rgba(0,212,255,0.45)] transition-all flex items-center gap-2">
              Start Free — No Credit Card
              <ArrowRight size={16} />
            </Link>
            <button className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors text-sm font-medium">
              <div className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center bg-white/5 hover:bg-white/10 transition-all">
                <Play size={14} fill="currentColor" />
              </div>
              Watch Demo
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              No tech skills needed
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Works for any niche
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 size={14} className="text-emerald-400" />
              Cancel anytime
            </span>
          </div>
        </div>

        {/* Dashboard preview */}
        <div className="relative max-w-5xl mx-auto mt-20">
          <div className="absolute inset-0 bg-gradient-to-t from-[#080D1A] via-transparent to-transparent z-10 pointer-events-none" />
          <div className="rounded-2xl overflow-hidden" style={{border: "1px solid rgba(0,212,255,0.2)", boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 60px rgba(0,212,255,0.1)"}}>
            {/* Mock browser bar */}
            <div className="flex items-center gap-2 px-4 py-3" style={{background: "#0A1020", borderBottom: "1px solid rgba(255,255,255,0.08)"}}>
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full" style={{background: "rgba(239,68,68,0.7)"}} />
                <div className="w-3 h-3 rounded-full" style={{background: "rgba(234,179,8,0.7)"}} />
                <div className="w-3 h-3 rounded-full" style={{background: "rgba(34,197,94,0.7)"}} />
              </div>
              <div className="flex-1 flex justify-center">
                <div className="px-6 py-1 rounded-lg text-xs text-slate-500" style={{background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)"}}>
                  townshub.ai/dashboard
                </div>
              </div>
            </div>
            {/* Dashboard mock */}
            <div className="flex gap-0" style={{background: "#080D1A"}}>
              {/* Sidebar mock */}
              <div className="shrink-0 py-4 px-3 space-y-1" style={{width: "160px", background: "#0C1526", borderRight: "1px solid rgba(255,255,255,0.06)"}}>
                {[
                  { name: "Dashboard", active: true },
                  { name: "My Style", active: false },
                  { name: "Video Ideas", active: false },
                  { name: "New Script", active: false },
                  { name: "My Scripts", active: false },
                ].map((item) => (
                  <div key={item.name} className="px-3 py-2 rounded-lg text-xs font-medium" style={item.active ? {background: "rgba(0,212,255,0.12)", color: "#00D4FF", border: "1px solid rgba(0,212,255,0.2)"} : {color: "#475569"}}>
                    {item.name}
                  </div>
                ))}
              </div>
              {/* Content mock */}
              <div className="flex-1 p-5 space-y-4">
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { label: "Scripts Left", v: "4", color: "#00D4FF" },
                    { label: "Thumbnails", v: "120", color: "#FB923C" },
                    { label: "Ideas", v: "∞", color: "#FACC15" },
                    { label: "Tasks", v: "5", color: "#34D399" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-lg p-3" style={{background: "#0F1829", border: "1px solid rgba(255,255,255,0.08)"}}>
                      <p className="text-lg font-bold font-[family-name:var(--font-syne)]" style={{color: s.color}}>{s.v}</p>
                      <p className="text-[10px]" style={{color: "#475569"}}>{s.label}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { name: "Write Script", color: "rgba(0,212,255,0.15)" },
                    { name: "Video Ideas", color: "rgba(250,204,21,0.12)" },
                    { name: "Thumbnails", color: "rgba(251,146,60,0.12)" },
                  ].map((qa) => (
                    <div key={qa.name} className="rounded-lg p-3" style={{background: qa.color, border: "1px solid rgba(255,255,255,0.08)"}}>
                      <div className="w-6 h-6 rounded mb-2" style={{background: "rgba(255,255,255,0.1)"}} />
                      <p className="text-xs font-medium font-[family-name:var(--font-syne)]" style={{color: "#94A3B8"}}>{qa.name}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-lg p-3" style={{background: "rgba(255,107,53,0.08)", border: "1px solid rgba(255,107,53,0.2)"}}>
                  <p className="text-xs font-semibold font-[family-name:var(--font-syne)]" style={{color: "#FB923C"}}>Setup your channel profile to unlock AI features →</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(0,212,255,0.04),transparent)]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-cyan-400 tracking-[0.2em] uppercase font-[family-name:var(--font-syne)] mb-4">Platform Features</p>
            <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-syne)] mb-4">
              Everything you need to produce better videos
            </h2>
            <p className="text-lg text-slate-400 max-w-2xl mx-auto">
              From your first idea to the final upload — Townshub handles every step of the content creation process.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className={`rounded-2xl border bg-gradient-to-br ${f.color} p-6 hover:-translate-y-1 transition-all duration-300 group`}
              >
                <div className={`w-10 h-10 rounded-xl ${f.iconBg} flex items-center justify-center mb-4 ${f.iconColor}`}>
                  <f.icon size={20} />
                </div>
                <h3 className="text-base font-bold text-white font-[family-name:var(--font-syne)] mb-2 group-hover:text-cyan-300 transition-colors">
                  {f.title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-orange-400 tracking-[0.2em] uppercase font-[family-name:var(--font-syne)] mb-4">The Process</p>
            <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-syne)] mb-4">How it works</h2>
            <p className="text-lg text-slate-400">Three steps to your best video yet</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-1/6 right-1/6 h-px bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-emerald-500/20" />
            {steps.map((step, i) => (
              <div key={step.number} className="text-center relative">
                <div className={`w-16 h-16 rounded-2xl ${step.color} ${step.glow} flex items-center justify-center mx-auto mb-6`}>
                  <span className="text-2xl font-bold text-white font-[family-name:var(--font-syne)]">{String(i + 1).padStart(2, "0")}</span>
                </div>
                <h3 className="text-lg font-bold text-white font-[family-name:var(--font-syne)] mb-3">{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed" dangerouslySetInnerHTML={{ __html: step.desc }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_40%_at_50%_50%,rgba(255,107,53,0.04),transparent)]" />
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs font-bold text-orange-400 tracking-[0.2em] uppercase font-[family-name:var(--font-syne)] mb-4">Simple Pricing</p>
            <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-syne)] mb-4">Choose your plan</h2>
            <p className="text-lg text-slate-400">Try Townshub free for 7 days. Cancel anytime before your trial ends.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative rounded-2xl border bg-gradient-to-br from-[#162035]/90 to-[#0F1829]/95 overflow-hidden ${plan.color}`}
              >
                {plan.popular && (
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />
                )}
                {plan.id === "elite" && (
                  <div className="absolute top-0 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400 to-transparent" />
                )}
                <div className="p-7">
                  {plan.popular && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/25 text-cyan-400 text-xs font-bold font-[family-name:var(--font-syne)] mb-4">
                      <Star size={10} fill="currentColor" />
                      Most Popular
                    </div>
                  )}
                  {plan.id === "elite" && (
                    <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-500/15 border border-yellow-500/25 text-yellow-400 text-xs font-bold font-[family-name:var(--font-syne)] mb-4">
                      <Crown size={10} fill="currentColor" />
                      Premium
                    </div>
                  )}
                  {plan.id === "starter" && <div className="h-7 mb-4" />}

                  <div className="flex items-center gap-2 mb-2">
                    <plan.icon size={16} className={plan.iconColor} />
                    <p className="text-sm font-bold text-white font-[family-name:var(--font-syne)]">{plan.name}</p>
                  </div>
                  <div className="flex items-end gap-1 mb-1">
                    <span className="text-4xl font-bold text-white font-[family-name:var(--font-syne)]">{plan.price}</span>
                    <span className="text-slate-400 mb-1 text-sm">/mo</span>
                  </div>
                  <p className={`text-xs font-semibold font-[family-name:var(--font-syne)] mb-5 ${plan.iconColor}`}>
                    {plan.scripts}
                  </p>

                  <Link href="/dashboard"
                    className={`w-full py-3 rounded-xl text-sm font-bold font-[family-name:var(--font-syne)] flex items-center justify-center gap-2 transition-all ${plan.ctaStyle}`}>
                    {plan.cta}
                    <ArrowRight size={14} />
                  </Link>

                  <ul className="mt-6 space-y-2.5">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2">
                        <CheckCircle2 size={13} className="text-cyan-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-400 leading-tight">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-[#162035] to-[#0F1829] p-12 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(0,212,255,0.12),transparent)]" />
            <div className="relative">
              <TrendingUp size={40} className="text-cyan-400 mx-auto mb-6 opacity-80" />
              <h2 className="text-4xl font-bold text-white font-[family-name:var(--font-syne)] mb-4">
                Ready to build your faceless channel?
              </h2>
              <p className="text-lg text-slate-400 mb-8">
                Join thousands of creators using Townshub to generate scripts, thumbnails, and viral ideas on autopilot.
              </p>
              <Link href="/dashboard"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-600 text-[#04080F] text-base font-bold font-[family-name:var(--font-syne)] hover:shadow-[0_0_32px_rgba(0,212,255,0.45)] transition-all">
                Start Free Today
                <ArrowRight size={16} />
              </Link>
              <p className="text-xs text-slate-500 mt-4">7-day free trial · No credit card required</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center">
              <Zap size={12} className="text-[#04080F]" fill="currentColor" />
            </div>
            <span className="text-sm font-bold text-slate-400 font-[family-name:var(--font-syne)]">Townshub Faceless</span>
          </div>
          <p className="text-xs text-slate-600">© 2026 Townshub. All rights reserved.</p>
          <div className="flex gap-5 text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-300 transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
