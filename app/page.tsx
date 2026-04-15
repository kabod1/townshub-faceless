"use client";

import Link from "next/link";
import { useState } from "react";
import {
  Zap, PenLine, Kanban, Image as Img, Compass, Puzzle,
  CheckCircle2, ArrowRight, Star, Crown, TrendingUp, Play,
  Lightbulb, Sparkles, Users, Shield, Clock, ChevronRight,
  BarChart3, X, Check, Flame,
} from "lucide-react";

/* ─── Data ───────────────────────────────────────────────────────────────── */

const TICKER = [
  "AI Script Writer","Viral Ideas Engine","Niche Finder","Thumbnail Studio",
  "Production Board","Chrome Extension","Style Profiles","Team Collaboration","Channel Analytics",
];

const STATS = [
  { value: "2,400+", label: "Active Creators",           color: "#00D4FF" },
  { value: "$2M+",   label: "Earned by Our Community",   color: "#34D399" },
  { value: "4.9★",   label: "Average Rating",             color: "#FACC15" },
  { value: "< 30s",  label: "Script Generation",          color: "#A78BFA" },
];

const COMPARISON = [
  { before: "6+ hours writing scripts manually",           after: "Full script ready in under 30 seconds" },
  { before: "Guessing what topics will actually go viral", after: "AI-ranked ideas sorted by viral score" },
  { before: "Generic thumbnails that get ignored",         after: "AI-generated thumbnails with Flux.1" },
  { before: "Chaos — spreadsheets, notes, no system",     after: "One production board for every video" },
  { before: "Months researching niches with no data",      after: "Niche database: RPM + competition scores" },
];

const FEATURES = [
  {
    id:"script", icon: PenLine, title:"AI Script Writer",
    desc:"Research-backed scripts section by section. Hooks, body, CTAs — optimised for maximum watch time.",
    accent:"#00D4FF", glow:"rgba(0,212,255,0.1)", border:"rgba(0,212,255,0.2)", tag:"Most Used",
  },
  {
    id:"ideas", icon: Lightbulb, title:"Viral Video Ideas",
    desc:"AI analyses your niche and competitors to rank every idea by viral potential before you start.",
    accent:"#FACC15", glow:"rgba(250,204,21,0.08)", border:"rgba(250,204,21,0.18)", tag:null,
  },
  {
    id:"thumbs", icon: Img, title:"Thumbnail Studio",
    desc:"Canva-style editor with Flux.1 AI generation. Style presets trained on your niche.",
    accent:"#EC4899", glow:"rgba(236,72,153,0.08)", border:"rgba(236,72,153,0.18)", tag:null,
  },
  {
    id:"niche", icon: Compass, title:"Niche Finder",
    desc:"Discover untapped niches with RPM data, competition scores, and 12-month growth trends.",
    accent:"#34D399", glow:"rgba(52,211,153,0.08)", border:"rgba(52,211,153,0.18)", tag:null,
  },
  {
    id:"board", icon: Kanban, title:"Production Board",
    desc:"Kanban pipeline from idea to upload. Deadlines, tasks, team — every video tracked.",
    accent:"#A78BFA", glow:"rgba(167,139,250,0.08)", border:"rgba(167,139,250,0.18)", tag:null,
  },
  {
    id:"ext", icon: Puzzle, title:"Chrome Extension",
    desc:"Outlier scores, tags, and analytics overlaid on YouTube as you browse — no tab switching.",
    accent:"#FB923C", glow:"rgba(251,146,60,0.08)", border:"rgba(251,146,60,0.18)", tag:null,
  },
];

const TESTIMONIALS = [
  {
    quote:"I went from 0 to 8,200 subs in 3 months. The script quality blows every other tool out of the water.",
    name:"Alex M.", handle:"@AlexFinance", role:"Finance · 8.2K subs",
    metric:"+8.2K in 90 days", avatar:"A", from:"#00D4FF", to:"#0284C7", accent:"#00D4FF",
  },
  {
    quote:"Niche finder saved me months. Found a $12 RPM niche in 10 minutes. First video hit 40K views.",
    name:"Sarah K.", handle:"@SarahTech", role:"Tech · 22K subs",
    metric:"40K views, 1st video", avatar:"S", from:"#8B5CF6", to:"#6D28D9", accent:"#A78BFA",
  },
  {
    quote:"Production board changed everything. We ship 3 videos a week now. Before: couldn't even do 1.",
    name:"James T.", handle:"@JamesMotivates", role:"Motivation · 41K subs",
    metric:"3 videos/week shipped", avatar:"J", from:"#34D399", to:"#059669", accent:"#34D399",
  },
  {
    quote:"Cut script writing from 6 hours to under 1. It literally sounds like me. Game-changer.",
    name:"Maya R.", handle:"@MayaCreates", role:"Lifestyle · 18K subs",
    metric:"6h → under 1h", avatar:"M", from:"#EC4899", to:"#BE185D", accent:"#EC4899",
  },
  {
    quote:"Skeptical at first. Then my first Townshub script hit 120K views. Upgraded to Pro same day.",
    name:"David L.", handle:"@DavidExplains", role:"History · 55K subs",
    metric:"120K views, 1st script", avatar:"D", from:"#FB923C", to:"#EA580C", accent:"#FB923C",
  },
  {
    quote:"Built by people who actually DO faceless YouTube. Every feature solves a real problem I had.",
    name:"Priya S.", handle:"@PriyaTalks", role:"Self-Improvement · 33K subs",
    metric:"33K subs in 6 months", avatar:"P", from:"#2DD4BF", to:"#0891B2", accent:"#2DD4BF",
  },
];

const PLANS = [
  {
    id:"starter", name:"Starter", price:"$9.99", annual:"$7.19",
    desc:"Start your channel today", icon: Zap, accent:"#00D4FF", popular:false, elite:false,
    cta:"Start Free Trial",
    features:["4 full AI scripts/month","120 AI thumbnail assets","Chrome Extension","Unlimited video ideas","Production board","1 style profile"],
  },
  {
    id:"pro", name:"Pro", price:"$29.99", annual:"$21.59",
    desc:"For serious channel growth", icon: Star, accent:"#00D4FF", popular:true, elite:false,
    cta:"Start Pro Trial",
    features:["15 full AI scripts/month","300 AI thumbnail assets","Everything in Starter","Full niche database","Similar Channels finder","Team collab (5 seats)","Multiple channel profiles"],
  },
  {
    id:"elite", name:"Elite AI", price:"$99.99", annual:"$71.99",
    desc:"1-on-1 mentorship included", icon: Crown, accent:"#FACC15", popular:false, elite:true,
    cta:"Go Elite",
    features:["30 full AI scripts/month","600 AI thumbnail assets","Everything in Pro","AI growth consulting","Personal YouTube mentor","Channel strategy & audits","Priority 24/7 support"],
  },
];

/* ─── Component ──────────────────────────────────────────────────────────── */

export default function Home() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen text-[#E2EAFF] overflow-x-hidden"
      style={{ background: "linear-gradient(180deg, #080F1E 0%, #060C18 100%)" }}>

      {/* ── Promo bar ────────────────────────────────────────────────────── */}
      <div className="relative z-50 text-center py-2.5 text-xs font-semibold"
        style={{ background: "linear-gradient(90deg,rgba(0,212,255,0.05),rgba(0,212,255,0.12),rgba(0,212,255,0.05))", borderBottom:"1px solid rgba(0,212,255,0.15)" }}>
        <span style={{ color:"#00D4FF" }}>🎉 Limited offer:</span>
        <span className="text-slate-300"> Save 39% on any annual plan — </span>
        <a href="#pricing" className="underline underline-offset-2 font-bold" style={{ color:"#00D4FF" }}>See pricing →</a>
      </div>

      {/* ── Nav ──────────────────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-40 backdrop-blur-2xl"
        style={{ background:"rgba(8,15,30,0.9)", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background:"linear-gradient(135deg,#00D4FF,#0284C7)", boxShadow:"0 0 18px rgba(0,212,255,0.5)" }}>
              <Zap size={14} fill="#020818" />
            </div>
            <span className="font-bold text-white tracking-tight"
              style={{ fontFamily:"var(--font-syne)", fontSize:"15px" }}>
              Townshub <span style={{ color:"#00D4FF" }}>Faceless</span>
            </span>
          </div>
          {/* Links */}
          <div className="hidden md:flex items-center gap-7">
            {[["#features","Features"],["#comparison","Results"],["#how","Process"],["#pricing","Pricing"]].map(([h,l])=>(
              <a key={h} href={h} className="text-sm text-slate-400 hover:text-white transition-colors"
                style={{ fontFamily:"var(--font-syne)", fontWeight:500 }}>{l}</a>
            ))}
          </div>
          {/* CTAs */}
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-slate-400 hover:text-white transition-colors hidden sm:block"
              style={{ fontFamily:"var(--font-syne)", fontWeight:500 }}>Log in</Link>
            <Link href="/login"
              className="group flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_28px_rgba(0,212,255,0.5)]"
              style={{ background:"linear-gradient(135deg,#00D4FF,#0284C7)", color:"#020818", fontFamily:"var(--font-syne)" }}>
              Get Started Free
              <ChevronRight size={14} className="transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </nav>

      {/* ════════════════════════════════ HERO ═══════════════════════════════ */}
      <section className="relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,#0A1428 0%,#080F1E 100%)", paddingTop:"96px", paddingBottom:"0" }}>

        {/* BG texture */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {/* Radial glow top-center */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px]"
            style={{ background:"radial-gradient(ellipse,rgba(0,212,255,0.08) 0%,transparent 65%)", filter:"blur(1px)" }} />
          {/* Purple right */}
          <div className="absolute top-20 right-0 w-[600px] h-[600px]"
            style={{ background:"radial-gradient(circle,rgba(139,92,246,0.07),transparent 70%)", filter:"blur(40px)" }} />
          {/* Orange left */}
          <div className="absolute bottom-0 left-0 w-[500px] h-[400px]"
            style={{ background:"radial-gradient(circle,rgba(251,146,60,0.05),transparent 70%)", filter:"blur(40px)" }} />
          {/* Fine dot grid */}
          <div className="absolute inset-0"
            style={{
              backgroundImage:"radial-gradient(rgba(0,212,255,0.15) 1px,transparent 1px)",
              backgroundSize:"32px 32px",
              opacity:0.25,
            }} />
          {/* Vignette */}
          <div className="absolute inset-0"
            style={{ background:"radial-gradient(ellipse 90% 90% at 50% 40%,transparent 50%,rgba(8,15,30,0.8))" }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-5">
          {/* ── TOP: copy + mockup ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center pb-16">

            {/* Left */}
            <div className="animate-fade-up text-center lg:text-left">

              {/* Social proof pill */}
              <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-full mb-8"
                style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)" }}>
                <div className="flex -space-x-2">
                  {[["#00D4FF","#0284C7"],["#8B5CF6","#6D28D9"],["#34D399","#059669"],["#FB923C","#EA580C"],["#EC4899","#BE185D"]].map(([a,b],i)=>(
                    <div key={i} className="w-7 h-7 rounded-full border-2 flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ background:`linear-gradient(135deg,${a},${b})`, borderColor:"#0A1428", zIndex:5-i }}>
                      {["A","S","J","M","D"][i]}
                    </div>
                  ))}
                </div>
                <div className="flex flex-col">
                  <div className="flex gap-0.5">{[...Array(5)].map((_,i)=><Star key={i} size={9} fill="#FACC15" style={{color:"#FACC15"}}/>)}</div>
                  <span className="text-[11px] text-slate-400">Loved by 2,400+ creators</span>
                </div>
              </div>

              {/* Headline */}
              <h1 className="font-bold tracking-tight mb-6 leading-[1.04]"
                style={{ fontFamily:"var(--font-syne)", fontSize:"clamp(40px,6vw,76px)" }}>
                <span className="text-white">The #1 Studio for</span>
                <br />
                <span className="gradient-text-cyan">Faceless YouTube</span>
                <br />
                <span className="text-white">Creators</span>
              </h1>

              <p className="text-lg text-slate-400 leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0">
                Stop spending 6 hours on scripts. Generate research-backed scripts, viral ideas, and
                professional thumbnails — in seconds.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-7">
                <Link href="/login"
                  className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-base font-bold transition-all hover:shadow-[0_0_50px_rgba(0,212,255,0.5)]"
                  style={{ background:"linear-gradient(135deg,#00D4FF,#0284C7)", color:"#020818", fontFamily:"var(--font-syne)" }}>
                  Start Your Free 7-Day Trial
                  <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
                </Link>
                <button className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors group">
                  <div className="relative w-12 h-12 rounded-full flex items-center justify-center shrink-0"
                    style={{ background:"rgba(255,255,255,0.05)", border:"1px solid rgba(255,255,255,0.12)" }}>
                    <div className="absolute w-12 h-12 rounded-full border border-white/15 animate-pulse-ring" />
                    <Play size={13} fill="currentColor" className="ml-0.5" />
                  </div>
                  <span className="text-sm" style={{ fontFamily:"var(--font-syne)", fontWeight:500 }}>Watch 2-min demo</span>
                </button>
              </div>

              {/* Trust line */}
              <p className="text-xs text-slate-600 mb-2" style={{ fontFamily:"var(--font-syne)" }}>
                No charge until day 8 · No credit card required
              </p>
              <div className="flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-slate-500 justify-center lg:justify-start">
                {["No tech skills needed","Works for any niche","Cancel anytime"].map(t=>(
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 size={12} style={{ color:"#34D399" }} />{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Right — Dashboard mockup */}
            <div className="relative animate-fade-up delay-2 opacity-0-init">

              {/* Floating cards */}
              <div className="absolute -top-5 -left-4 md:-left-10 z-20 glass rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xl animate-float"
                style={{ border:"1px solid rgba(0,212,255,0.25)", animationDelay:"0s" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:"rgba(0,212,255,0.18)" }}>
                  <PenLine size={14} style={{ color:"#00D4FF" }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white leading-none" style={{ fontFamily:"var(--font-syne)" }}>Script Generated ✓</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">Finance · 1,380 words · 28s</p>
                </div>
              </div>

              <div className="absolute bottom-8 -left-4 md:-left-8 z-20 glass rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xl animate-float"
                style={{ border:"1px solid rgba(52,211,153,0.25)", animationDelay:"1.4s" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:"rgba(52,211,153,0.18)" }}>
                  <TrendingUp size={14} style={{ color:"#34D399" }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white leading-none" style={{ fontFamily:"var(--font-syne)" }}>Niche Found ✓</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">$14 RPM · Low competition</p>
                </div>
              </div>

              <div className="absolute top-1/3 -right-4 md:-right-8 z-20 glass rounded-2xl px-3.5 py-2.5 flex items-center gap-2.5 shadow-2xl animate-float"
                style={{ border:"1px solid rgba(250,204,21,0.25)", animationDelay:"0.7s" }}>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background:"rgba(250,204,21,0.18)" }}>
                  <BarChart3 size={14} style={{ color:"#FACC15" }} />
                </div>
                <div>
                  <p className="text-[11px] font-bold text-white leading-none" style={{ fontFamily:"var(--font-syne)" }}>12 Ideas Ranked</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">By viral score · Ready</p>
                </div>
              </div>

              {/* Main mockup */}
              <div className="rounded-2xl p-[1px] animate-glow-border"
                style={{ background:"linear-gradient(135deg,rgba(0,212,255,0.45),rgba(139,92,246,0.25),rgba(0,212,255,0.1))" }}>
                <div className="rounded-[15px] overflow-hidden" style={{ background:"#07091C" }}>
                  {/* Browser bar */}
                  <div className="flex items-center gap-2 px-4 py-3"
                    style={{ background:"#090C20", borderBottom:"1px solid rgba(255,255,255,0.06)" }}>
                    <div className="flex gap-1.5">
                      {["rgba(239,68,68,.7)","rgba(234,179,8,.7)","rgba(34,197,94,.7)"].map((c,i)=>(
                        <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background:c }} />
                      ))}
                    </div>
                    <div className="flex-1 mx-3">
                      <div className="px-4 py-1 rounded text-[11px] text-center text-slate-600"
                        style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.07)" }}>
                        townshub.ai/dashboard
                      </div>
                    </div>
                  </div>
                  {/* App UI */}
                  <div className="flex" style={{ minHeight:"360px" }}>
                    {/* Sidebar */}
                    <div className="shrink-0 py-5 px-2.5 space-y-0.5" style={{ width:"160px", background:"#07091A", borderRight:"1px solid rgba(255,255,255,0.05)" }}>
                      <div className="flex items-center gap-2 px-2.5 pb-4 mb-2.5" style={{ borderBottom:"1px solid rgba(255,255,255,0.05)" }}>
                        <div className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
                          style={{ background:"linear-gradient(135deg,#00D4FF,#0284C7)" }}>
                          <Zap size={11} fill="#020818" />
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-white leading-none" style={{ fontFamily:"var(--font-syne)" }}>Townshub</p>
                          <p className="text-[8px] font-bold tracking-widest uppercase mt-0.5" style={{ color:"#00D4FF" }}>Faceless</p>
                        </div>
                      </div>
                      {["Dashboard","My Style","Video Ideas","New Script","Thumbnails","Production","Analytics"].map((name,i)=>(
                        <div key={name} className="px-2.5 py-2 rounded-lg text-[11px] font-medium"
                          style={i===0
                            ? { background:"rgba(0,212,255,0.1)", color:"#00D4FF", border:"1px solid rgba(0,212,255,0.2)", fontFamily:"var(--font-syne)" }
                            : { color:"#2E3A55", fontFamily:"var(--font-syne)" }}>
                          {name}
                        </div>
                      ))}
                    </div>
                    {/* Content */}
                    <div className="flex-1 p-5 space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-bold text-white" style={{ fontFamily:"var(--font-syne)" }}>Good morning 👋</p>
                          <p className="text-[10px] text-slate-500 mt-0.5">4 scripts remaining this month</p>
                        </div>
                        <div className="w-7 h-7 rounded-full" style={{ background:"linear-gradient(135deg,#FB923C,#EA580C)" }} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          {l:"Scripts",v:"4",c:"#00D4FF"},
                          {l:"Thumbnails",v:"120",c:"#FB923C"},
                          {l:"Video Ideas",v:"∞",c:"#FACC15"},
                          {l:"Tasks",v:"7",c:"#34D399"},
                        ].map(s=>(
                          <div key={s.l} className="rounded-xl p-3"
                            style={{ background:`${s.c}12`, border:`1px solid ${s.c}22` }}>
                            <p className="text-xl font-bold" style={{ color:s.c, fontFamily:"var(--font-syne)" }}>{s.v}</p>
                            <p className="text-[9px] text-slate-500 mt-0.5">{s.l}</p>
                          </div>
                        ))}
                      </div>
                      <div className="rounded-xl p-3.5" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)" }}>
                        <p className="text-[9px] font-bold text-slate-600 uppercase tracking-widest mb-2.5" style={{ fontFamily:"var(--font-syne)" }}>Latest Scripts</p>
                        {[
                          {t:"5 Finance Mistakes Nobody Tells You",s:96,c:"#34D399"},
                          {t:"The Passive Income Lie",s:88,c:"#FACC15"},
                        ].map(s=>(
                          <div key={s.t} className="flex items-center justify-between mb-1.5 last:mb-0">
                            <p className="text-[10px] text-slate-400 truncate flex-1 pr-2">{s.t}</p>
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0"
                              style={{ background:`${s.c}18`, color:s.c, fontFamily:"var(--font-syne)" }}>{s.s}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-xl cursor-pointer"
                        style={{ background:"rgba(0,212,255,0.08)", border:"1px solid rgba(0,212,255,0.2)" }}>
                        <Sparkles size={12} style={{ color:"#00D4FF" }} />
                        <span className="text-[11px] font-semibold" style={{ color:"#00D4FF", fontFamily:"var(--font-syne)" }}>
                          Generate new script →
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Stats strip (above fold, no scroll needed) ── */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-16 animate-fade-up delay-3 opacity-0-init">
            {STATS.map(s=>(
              <div key={s.label} className="rounded-2xl p-5 text-center"
                style={{ background:`${s.color}08`, border:`1px solid ${s.color}20` }}>
                <p className="text-3xl font-bold mb-1" style={{ fontFamily:"var(--font-syne)", color:s.color }}>{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* fade into next section */}
        <div className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
          style={{ background:"linear-gradient(to top,#080F1E,transparent)" }} />
      </section>

      {/* ── Feature ticker ───────────────────────────────────────────────── */}
      <div className="overflow-hidden py-4"
        style={{ background:"rgba(0,0,0,0.3)", borderTop:"1px solid rgba(255,255,255,0.04)", borderBottom:"1px solid rgba(255,255,255,0.04)" }}>
        <div className="animate-ticker flex gap-12 whitespace-nowrap" style={{ width:"max-content" }}>
          {[...TICKER,...TICKER,...TICKER].map((item,i)=>(
            <span key={i} className="flex items-center gap-2.5 text-[11px] font-semibold uppercase tracking-widest"
              style={{ color:"#1E2D48", fontFamily:"var(--font-syne)" }}>
              <span className="w-1 h-1 rounded-full" style={{ background:"#00D4FF", opacity:.5 }} />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════ COMPARISON ═════════════════════════════ */}
      <section id="comparison" className="py-24 px-5 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,#080F1E,#0A1428,#080F1E)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"radial-gradient(ellipse 60% 50% at 50% 50%,rgba(139,92,246,0.05),transparent)" }} />

        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-5 h-px" style={{ background:"#A78BFA" }} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color:"#A78BFA", fontFamily:"var(--font-syne)" }}>The Difference</span>
              <span className="w-5 h-px" style={{ background:"#A78BFA" }} />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily:"var(--font-syne)" }}>
              The old way vs<br />
              <span className="gradient-text-cyan">the Townshub way</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-lg mx-auto">
              Every painful step of manual content creation — eliminated.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-2xl overflow-hidden"
              style={{ background:"rgba(239,68,68,0.03)", border:"1px solid rgba(239,68,68,0.12)" }}>
              <div className="flex items-center gap-2.5 px-6 py-4"
                style={{ background:"rgba(239,68,68,0.06)", borderBottom:"1px solid rgba(239,68,68,0.1)" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:"rgba(239,68,68,0.15)" }}>
                  <X size={13} style={{ color:"#F87171" }} />
                </div>
                <span className="font-bold text-red-400 text-sm" style={{ fontFamily:"var(--font-syne)" }}>Without Townshub</span>
              </div>
              <ul className="p-6 space-y-4">
                {COMPARISON.map((c,i)=>(
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background:"rgba(239,68,68,0.12)" }}>
                      <X size={9} style={{ color:"#F87171" }} />
                    </div>
                    <span className="text-sm text-slate-400">{c.before}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl overflow-hidden"
              style={{ background:"rgba(0,212,255,0.03)", border:"1px solid rgba(0,212,255,0.18)" }}>
              <div className="flex items-center gap-2.5 px-6 py-4"
                style={{ background:"rgba(0,212,255,0.07)", borderBottom:"1px solid rgba(0,212,255,0.1)" }}>
                <div className="w-6 h-6 rounded-lg flex items-center justify-center" style={{ background:"rgba(0,212,255,0.18)" }}>
                  <Sparkles size={12} style={{ color:"#00D4FF" }} />
                </div>
                <span className="font-bold text-sm" style={{ color:"#00D4FF", fontFamily:"var(--font-syne)" }}>With Townshub Faceless</span>
              </div>
              <ul className="p-6 space-y-4">
                {COMPARISON.map((c,i)=>(
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                      style={{ background:"rgba(0,212,255,0.15)" }}>
                      <Check size={9} style={{ color:"#00D4FF" }} />
                    </div>
                    <span className="text-sm text-slate-200 font-medium">{c.after}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="text-center mt-10">
            <Link href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl text-sm font-bold transition-all hover:shadow-[0_0_40px_rgba(0,212,255,0.4)]"
              style={{ background:"linear-gradient(135deg,#00D4FF,#0284C7)", color:"#020818", fontFamily:"var(--font-syne)" }}>
              Switch to the Townshub way
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════ FEATURES ═══════════════════════════════ */}
      <section id="features" className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-5 h-px" style={{ background:"#00D4FF" }} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color:"#00D4FF", fontFamily:"var(--font-syne)" }}>Everything You Need</span>
              <span className="w-5 h-px" style={{ background:"#00D4FF" }} />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-5" style={{ fontFamily:"var(--font-syne)" }}>
              Every tool. One studio.
              <br /><span className="gradient-text-cyan">Zero wasted time.</span>
            </h2>
            <p className="text-lg text-slate-400 max-w-xl mx-auto">
              From your first niche idea to the finished video — every step powered by AI built for faceless creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Large: Script Writer */}
            <div className="md:col-span-2 group relative rounded-2xl p-7 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-default"
              style={{ background:"rgba(0,212,255,0.04)", border:"1px solid rgba(0,212,255,0.2)" }}>
              <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background:"radial-gradient(circle,rgba(0,212,255,0.1),transparent)", filter:"blur(30px)" }} />
              <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background:"rgba(0,212,255,0.12)", border:"1px solid rgba(0,212,255,0.25)", color:"#00D4FF", fontFamily:"var(--font-syne)" }}>
                Most Used
              </div>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                style={{ background:"rgba(0,212,255,0.12)", border:"1px solid rgba(0,212,255,0.22)" }}>
                <PenLine size={22} style={{ color:"#00D4FF" }} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2" style={{ fontFamily:"var(--font-syne)" }}>AI Script Writer</h3>
              <p className="text-sm text-slate-400 mb-6 leading-relaxed max-w-md">Research-backed scripts with retention-optimised hooks, body, and CTAs. Your voice, your niche, 30 seconds.</p>
              <div className="space-y-2">
                {[
                  {l:"Hook",t:"Did you know 94% of people never achieve financial freedom?"},
                  {l:"Intro",t:"In today's video, I'll reveal the exact 3 strategies..."},
                  {l:"CTA",t:"Hit subscribe so you never miss a video like this."},
                ].map(r=>(
                  <div key={r.l} className="flex items-center gap-3 px-4 py-2.5 rounded-xl"
                    style={{ background:"rgba(0,0,0,0.4)", border:"1px solid rgba(255,255,255,0.04)" }}>
                    <span className="text-[8px] font-bold uppercase tracking-[0.15em] w-7 shrink-0"
                      style={{ color:"#00D4FF", fontFamily:"var(--font-syne)" }}>{r.l}</span>
                    <span className="text-xs text-slate-400 truncate">{r.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Viral Ideas */}
            <div className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-default"
              style={{ background:"rgba(250,204,21,0.04)", border:"1px solid rgba(250,204,21,0.18)" }}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                style={{ background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.2)" }}>
                <Lightbulb size={20} style={{ color:"#FACC15" }} />
              </div>
              <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily:"var(--font-syne)" }}>Viral Video Ideas</h3>
              <p className="text-sm text-slate-400 mb-5">AI ranks every idea by viral potential before you waste a single hour.</p>
              <div className="space-y-2">
                {[
                  {s:96,t:"5 Money Mistakes Nobody Tells You",c:"#34D399"},
                  {s:91,t:"The Passive Income Lie",c:"#FACC15"},
                  {s:87,t:"How I'd Build $10K/Month From Scratch",c:"#FB923C"},
                ].map(idea=>(
                  <div key={idea.t} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl"
                    style={{ background:"rgba(250,204,21,0.05)", border:"1px solid rgba(250,204,21,0.1)" }}>
                    <span className="text-[10px] font-bold w-6 shrink-0" style={{ color:idea.c, fontFamily:"var(--font-syne)" }}>{idea.s}</span>
                    <span className="text-[11px] text-slate-400 truncate">{idea.t}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Remaining 4 */}
            {FEATURES.slice(2).map(f=>(
              <div key={f.id}
                className="group relative rounded-2xl p-6 overflow-hidden transition-all duration-300 hover:-translate-y-0.5 cursor-default"
                style={{ background:f.glow, border:`1px solid ${f.border}` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform"
                  style={{ background:f.glow, border:`1px solid ${f.border}` }}>
                  <f.icon size={20} style={{ color:f.accent }} />
                </div>
                <h3 className="text-base font-bold text-white mb-2" style={{ fontFamily:"var(--font-syne)" }}>{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════ HOW IT WORKS ═══════════════════════════ */}
      <section id="how" className="py-24 px-5"
        style={{ background:"linear-gradient(180deg,#080F1E,#0A1428,#080F1E)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-5 h-px" style={{ background:"#FB923C" }} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color:"#FB923C", fontFamily:"var(--font-syne)" }}>The Process</span>
              <span className="w-5 h-px" style={{ background:"#FB923C" }} />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily:"var(--font-syne)" }}>
              From zero to published
              <br />in your first week
            </h2>
            <p className="text-lg text-slate-400">No experience required. Just follow 3 steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 relative">
            <div className="hidden md:block absolute top-14 left-[22%] right-[22%] h-px"
              style={{ background:"linear-gradient(90deg,rgba(0,212,255,0.4),rgba(139,92,246,0.4),rgba(52,211,153,0.4))" }} />
            {[
              {n:"01",title:"Set Up Your Style",desc:"Drop in competitor channels. We analyse their scripts to build your unique writing voice and style DNA.",bg:"linear-gradient(135deg,#00D4FF,#0284C7)",shadow:"0 0 40px rgba(0,212,255,0.4)",border:"rgba(0,212,255,0.15)"},
              {n:"02",title:"Generate & Refine",desc:"Write scripts in seconds, design thumbnails, and use the niche finder to lock in your exact audience.",bg:"linear-gradient(135deg,#8B5CF6,#6D28D9)",shadow:"0 0 40px rgba(139,92,246,0.4)",border:"rgba(139,92,246,0.15)"},
              {n:"03",title:"Produce & Ship",desc:"Track every video on your board. Set deadlines, collaborate with your team, and publish consistently.",bg:"linear-gradient(135deg,#34D399,#059669)",shadow:"0 0 40px rgba(52,211,153,0.4)",border:"rgba(52,211,153,0.15)"},
            ].map(step=>(
              <div key={step.n} className="relative rounded-2xl p-7 text-center transition-all duration-300 hover:-translate-y-1"
                style={{ background:"rgba(10,16,30,0.8)", border:`1px solid ${step.border}` }}>
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
                  style={{ background:step.bg, boxShadow:step.shadow }}>
                  <span className="text-2xl font-bold text-white" style={{ fontFamily:"var(--font-syne)" }}>{step.n}</span>
                </div>
                <h3 className="text-lg font-bold text-white mb-3" style={{ fontFamily:"var(--font-syne)" }}>{step.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ TESTIMONIALS ════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-5 h-px" style={{ background:"#34D399" }} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color:"#34D399", fontFamily:"var(--font-syne)" }}>Creator Stories</span>
              <span className="w-5 h-px" style={{ background:"#34D399" }} />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white" style={{ fontFamily:"var(--font-syne)" }}>
              Real creators.<br /><span className="gradient-text-cyan">Real results.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {TESTIMONIALS.map((t,i)=>(
              <div key={t.name}
                className="relative rounded-2xl p-7 flex flex-col justify-between transition-all duration-300 hover:-translate-y-0.5"
                style={{ background:"linear-gradient(160deg,rgba(11,17,34,0.95),rgba(7,10,20,1))", border:"1px solid rgba(255,255,255,0.06)" }}>
                <div className="absolute top-0 inset-x-0 h-px rounded-t-2xl"
                  style={{ background:`linear-gradient(90deg,transparent,${t.accent}45,transparent)` }} />
                <div className="absolute top-5 right-5 px-2.5 py-1 rounded-full text-[10px] font-bold"
                  style={{ background:`${t.accent}15`, border:`1px solid ${t.accent}30`, color:t.accent, fontFamily:"var(--font-syne)" }}>
                  {t.metric}
                </div>
                <div>
                  <div className="flex gap-0.5 mb-5">
                    {[...Array(5)].map((_,i)=><Star key={i} size={12} fill="#FACC15" style={{color:"#FACC15"}}/>)}
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed mb-6">&ldquo;{t.quote}&rdquo;</p>
                </div>
                <div className="flex items-center gap-3 pt-5" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
                  <div className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                    style={{ background:`linear-gradient(135deg,${t.from},${t.to})`, fontFamily:"var(--font-syne)" }}>
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white leading-none" style={{ fontFamily:"var(--font-syne)" }}>{t.name}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{t.handle} · {t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="text-center mt-10 text-sm text-slate-500 flex items-center justify-center gap-2">
            <Flame size={14} style={{ color:"#FB923C" }} />
            Trusted by creators in Finance, Tech, Motivation, Lifestyle, History and 40+ more niches
          </p>
        </div>
      </section>

      {/* ═════════════════════════════ PRICING ═══════════════════════════════ */}
      <section id="pricing" className="py-24 px-5 relative overflow-hidden"
        style={{ background:"linear-gradient(180deg,#080F1E,#0A1428,#080F1E)" }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background:"radial-gradient(ellipse 60% 40% at 50% 50%,rgba(139,92,246,0.05),transparent)" }} />
        <div className="relative max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 mb-5">
              <span className="w-5 h-px" style={{ background:"#A78BFA" }} />
              <span className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color:"#A78BFA", fontFamily:"var(--font-syne)" }}>Simple Pricing</span>
              <span className="w-5 h-px" style={{ background:"#A78BFA" }} />
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4" style={{ fontFamily:"var(--font-syne)" }}>Pick your plan</h2>
            <p className="text-slate-400 mb-8">7-day free trial on every plan. No charge until day 8. Cancel anytime.</p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-1 p-1 rounded-xl"
              style={{ background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)" }}>
              {["Monthly","Annual"].map((label,i)=>(
                <button key={label}
                  onClick={()=>setAnnual(i===1)}
                  className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={{
                    background: (annual ? i===1 : i===0) ? "rgba(0,212,255,0.15)" : "transparent",
                    color:      (annual ? i===1 : i===0) ? "#00D4FF" : "#64748B",
                    border:     (annual ? i===1 : i===0) ? "1px solid rgba(0,212,255,0.25)" : "1px solid transparent",
                    fontFamily: "var(--font-syne)",
                  }}>
                  {label}
                  {i===1 && <span className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                    style={{ background:"rgba(52,211,153,0.15)", color:"#34D399" }}>−39%</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {PLANS.map(plan=>(
              <div key={plan.id}
                className="relative rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1"
                style={{
                  background:"linear-gradient(160deg,rgba(11,17,34,0.98),rgba(6,9,18,1))",
                  border: plan.popular ? "1px solid rgba(0,212,255,0.4)" : plan.elite ? "1px solid rgba(250,204,21,0.3)" : "1px solid rgba(255,255,255,0.07)",
                  boxShadow: plan.popular ? "0 0 60px rgba(0,212,255,0.06)" : "none",
                }}>
                {(plan.popular||plan.elite) && (
                  <div className="absolute top-0 inset-x-0 h-0.5"
                    style={{ background: plan.popular
                      ? "linear-gradient(90deg,transparent,#00D4FF,transparent)"
                      : "linear-gradient(90deg,transparent,#FACC15,transparent)" }} />
                )}
                <div className="p-8">
                  <div className="h-7 mb-6">
                    {plan.popular && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background:"rgba(0,212,255,0.1)", border:"1px solid rgba(0,212,255,0.25)", color:"#00D4FF", fontFamily:"var(--font-syne)" }}>
                        <Star size={10} fill="currentColor" /> Most Popular
                      </div>
                    )}
                    {plan.elite && (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                        style={{ background:"rgba(250,204,21,0.1)", border:"1px solid rgba(250,204,21,0.25)", color:"#FACC15", fontFamily:"var(--font-syne)" }}>
                        <Crown size={10} fill="currentColor" /> Premium
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <plan.icon size={16} style={{ color:plan.accent }} />
                    <span className="text-sm font-bold text-white" style={{ fontFamily:"var(--font-syne)" }}>{plan.name}</span>
                  </div>
                  <div className="flex items-end gap-1.5 mb-1">
                    <span className="text-5xl font-bold text-white" style={{ fontFamily:"var(--font-syne)" }}>
                      {annual ? plan.annual : plan.price}
                    </span>
                    <span className="text-slate-500 mb-2">/mo</span>
                  </div>
                  {annual && <p className="text-xs text-slate-500 mb-0.5">Billed annually</p>}
                  <p className="text-xs text-slate-500 mb-7">{plan.desc}</p>
                  <Link href="/login"
                    className="w-full py-3.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all mb-7 hover:opacity-90"
                    style={plan.popular
                      ? { background:"linear-gradient(135deg,#00D4FF,#0284C7)", color:"#020818", fontFamily:"var(--font-syne)" }
                      : plan.elite
                      ? { background:"linear-gradient(135deg,#FACC15,#F97316)", color:"#0A0500", fontFamily:"var(--font-syne)" }
                      : { border:"1px solid rgba(0,212,255,0.3)", color:"#00D4FF", fontFamily:"var(--font-syne)" }}>
                    {plan.cta}
                    <ArrowRight size={14} />
                  </Link>
                  <ul className="space-y-3.5">
                    {plan.features.map(f=>(
                      <li key={f} className="flex items-start gap-2.5">
                        <CheckCircle2 size={13} className="shrink-0 mt-0.5" style={{ color:plan.accent }} />
                        <span className="text-[13px] text-slate-400 leading-snug">{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {icon:Shield,text:"7-day money back guarantee",color:"#34D399"},
              {icon:Clock, text:"Cancel anytime — no contracts",color:"#00D4FF"},
              {icon:Users, text:"Team collaboration on Pro & Elite",color:"#A78BFA"},
            ].map(({icon:Icon,text,color})=>(
              <div key={text} className="flex items-center gap-3 px-5 py-4 rounded-xl"
                style={{ background:`${color}07`, border:`1px solid ${color}18` }}>
                <Icon size={15} style={{ color }} />
                <span className="text-sm text-slate-400">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════ FINAL CTA ═══════════════════════════════ */}
      <section className="py-24 px-5">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl overflow-hidden text-center px-8 py-20"
            style={{ background:"linear-gradient(160deg,rgba(10,17,32,0.98),rgba(5,8,16,1))", border:"1px solid rgba(0,212,255,0.14)" }}>
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[400px] pointer-events-none"
              style={{ background:"radial-gradient(ellipse,rgba(0,212,255,0.1),transparent 65%)", filter:"blur(40px)" }} />
            <div className="absolute -bottom-20 left-1/3 w-80 h-80 pointer-events-none"
              style={{ background:"radial-gradient(circle,rgba(139,92,246,0.08),transparent)", filter:"blur(50px)" }} />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
                style={{ background:"rgba(0,212,255,0.07)", border:"1px solid rgba(0,212,255,0.2)" }}>
                <Sparkles size={12} style={{ color:"#00D4FF" }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color:"#00D4FF", fontFamily:"var(--font-syne)" }}>
                  Join 2,400+ Creators
                </span>
              </div>
              <h2 className="text-4xl sm:text-5xl xl:text-6xl font-bold mb-6" style={{ fontFamily:"var(--font-syne)" }}>
                <span className="text-white">Your faceless channel</span>
                <br /><span className="gradient-text-cyan">starts right now</span>
              </h2>
              <p className="text-lg text-slate-400 max-w-lg mx-auto mb-10 leading-relaxed">
                Join thousands of creators building real income on YouTube — without ever showing their face.
              </p>
              <Link href="/login"
                className="group inline-flex items-center gap-2 px-12 py-5 rounded-xl text-lg font-bold transition-all hover:shadow-[0_0_60px_rgba(0,212,255,0.5)]"
                style={{ background:"linear-gradient(135deg,#00D4FF,#0284C7)", color:"#020818", fontFamily:"var(--font-syne)" }}>
                Start Free 7-Day Trial
                <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="text-xs text-slate-600 mt-5">No charge until day 8 · No credit card · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="px-5 py-14" style={{ borderTop:"1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background:"linear-gradient(135deg,#00D4FF,#0284C7)", boxShadow:"0 0 14px rgba(0,212,255,0.4)" }}>
                  <Zap size={16} fill="#020818" />
                </div>
                <div>
                  <p className="font-bold text-white" style={{ fontFamily:"var(--font-syne)" }}>
                    Townshub <span style={{ color:"#00D4FF" }}>Faceless</span>
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">AI YouTube Growth Studio</p>
                </div>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed max-w-xs">
                The complete toolkit for building a profitable faceless YouTube channel — powered by AI, designed by creators.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 mb-4" style={{ fontFamily:"var(--font-syne)" }}>Product</p>
              <ul className="space-y-2.5">
                {["Features","Pricing","How It Works","Chrome Extension"].map(l=>(
                  <li key={l}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-slate-600 mb-4" style={{ fontFamily:"var(--font-syne)" }}>Company</p>
              <ul className="space-y-2.5">
                {["Privacy Policy","Terms of Service","Support","Contact"].map(l=>(
                  <li key={l}><a href="#" className="text-sm text-slate-500 hover:text-slate-300 transition-colors">{l}</a></li>
                ))}
              </ul>
            </div>
          </div>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-600"
            style={{ borderTop:"1px solid rgba(255,255,255,0.04)" }}>
            <p>© 2026 Townshub. Not affiliated with YouTube or Google LLC.</p>
            <p>Built for faceless creators everywhere.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
