import Link from "next/link";
import {
  PenLine, Kanban, Image as ImageIcon, Compass,
  CheckCircle2, ArrowRight, Star, Play,
  Lightbulb, Sparkles, Users, Shield, Clock,
} from "lucide-react";

/* ─── Data ─────────────────────────────────────────────────────────── */

const features = [
  { icon: PenLine,   title: "AI Script Writer",   desc: "Research-backed scripts built section by section, with hooks optimised for retention and watch time.", accent: "#06B6D4" },
  { icon: Lightbulb, title: "Viral Video Ideas",  desc: "AI analyses your niche and competitors to surface ideas ranked by viral potential.", accent: "#FACC15" },
  { icon: ImageIcon, title: "Thumbnail Studio",   desc: "Design click-worthy thumbnails with style presets and AI image generation powered by Flux.1.", accent: "#EC4899" },
  { icon: Compass,   title: "Niche Finder",       desc: "Discover untapped niches with RPM data, competition scores, and growth trend analysis.", accent: "#34D399" },
  { icon: Kanban,    title: "Production Board",   desc: "Kanban-style pipeline from idea to upload. Assign tasks, set due dates, track every video.", accent: "#A78BFA" },
  { icon: Sparkles,  title: "Chrome Extension",   desc: "Outlier scores, video tags, and channel analytics overlaid directly on YouTube as you browse.", accent: "#FB923C" },
];

const steps = [
  { n: "01", title: "Set Up Your Style",    desc: "Add competitor channels and we'll analyse their scripts to build your unique writing DNA.", grad: "linear-gradient(135deg,#06B6D4,#0891B2)", glow: "rgba(6,182,212,0.4)" },
  { n: "02", title: "Generate & Refine",    desc: "Write scripts with AI. Design thumbnails. Use the niche finder to target the right audience.", grad: "linear-gradient(135deg,#A78BFA,#7C3AED)", glow: "rgba(167,139,250,0.4)" },
  { n: "03", title: "Produce & Ship",       desc: "Track every video on your production board. Set deadlines, collaborate, and publish consistently.", grad: "linear-gradient(135deg,#34D399,#059669)", glow: "rgba(52,211,153,0.4)" },
];

const testimonials = [
  { quote: "I went from 0 to 8,000 subscribers in 3 months. The script quality is insane — way better than anything I could write myself.", name: "Alex M.",  role: "Finance Niche · 8.2K subs",    avatar: "A" },
  { quote: "The niche finder alone saved me months of research. Found a low-competition niche with €12 RPM in under 10 minutes.",            name: "Sarah K.", role: "Tech Explainer · 22K subs",   avatar: "S" },
  { quote: "Production board keeps my whole team aligned. We're shipping 3 videos a week now without the chaos.",                            name: "James T.", role: "Motivation Niche · 41K subs", avatar: "J" },
];

const plans = [
  {
    id: "starter", name: "Starter", price: "€9.99",  desc: "4 scripts / month",  popular: false, cta: "Get Started",
    features: ["4 full AI scripts","120 AI thumbnail assets","Chrome Extension","Video Ideas AI","Production board","Style profiles"],
  },
  {
    id: "pro",     name: "Pro",     price: "€29.99", desc: "15 scripts / month", popular: true,  cta: "Start Pro Trial",
    features: ["15 full AI scripts","300 AI thumbnail assets","Everything in Starter","Niche Finder database","Similar Channels finder","Team collaboration","Multiple channel profiles"],
  },
  {
    id: "elite",   name: "Elite AI",price: "€99.99", desc: "30 scripts / month", popular: false, cta: "Go Elite",
    features: ["30 full AI scripts","600 AI thumbnail assets","Everything in Pro","AI consulting chat","Personal YouTube mentor","Strategy & growth advice","Priority support"],
  },
];

const mockSidebarItems = [
  { name: "Dashboard", active: true },
  { name: "My Style",  active: false },
  { name: "Video Ideas", active: false },
  { name: "New Script", active: false },
  { name: "Production", active: false },
  { name: "Thumbnails", active: false },
];

const mockStats = [
  { l: "Scripts Left", v: "4",   c: "#06B6D4" },
  { l: "Thumbnails",   v: "120", c: "#FB923C" },
  { l: "Video Ideas",  v: "∞",   c: "#FACC15" },
  { l: "Tasks",        v: "5",   c: "#34D399" },
];

const mockActions = [
  { name: "Write Script", Icon: PenLine,   color: "#06B6D4" },
  { name: "Video Ideas",  Icon: Lightbulb, color: "#FACC15" },
  { name: "Niche Finder", Icon: Compass,   color: "#34D399" },
];

function THMark({ size = 18 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" width={size} height={size}>
      <rect x="3"  y="3"  width="34" height="11" fill="white"/>
      <rect x="33" y="3"  width="5"  height="11" fill="white"/>
      <rect x="3"  y="14" width="12" height="47" fill="white"/>
      <rect x="33" y="18" width="9"  height="43" fill="white"/>
      <rect x="33" y="30" width="28" height="10" fill="white"/>
      <rect x="52" y="3"  width="9"  height="58" fill="white"/>
    </svg>
  );
}

/* ─── Page ──────────────────────────────────────────────────────────── */

export default function LandingPage() {
  const ff = "var(--font-syne)";

  return (
    <div style={{ minHeight: "100vh", color: "white", overflowX: "hidden", background: "#070B14" }}>

      {/* ── Nav ─────────────────────────────────────────────────────── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        background: "rgba(7,11,20,0.9)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", padding: "0 24px", height: 64, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "linear-gradient(145deg, #0B1F4A, #1B4080)", boxShadow: "0 2px 12px rgba(27,64,128,0.5)" }}>
              <THMark size={18} />
            </div>
            <span style={{ fontFamily: ff, fontSize: 15, fontWeight: 700, letterSpacing: "-0.3px" }}>
              Townshub <span style={{ color: "#5B8DEF" }}>Faceless</span>
            </span>
          </div>

          {/* Links */}
          <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
            {[["#features","Features"],["#how-it-works","How it Works"],["#pricing","Pricing"]].map(([href,label]) => (
              <a key={href} href={href} style={{ fontFamily: ff, fontWeight: 500, fontSize: 14, color: "#94a3b8", textDecoration: "none" }}>{label}</a>
            ))}
          </div>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Link href="/login" style={{ fontFamily: ff, fontWeight: 500, fontSize: 14, color: "#94a3b8", textDecoration: "none" }}>Log In</Link>
            <Link href="/login" style={{ padding: "10px 20px", borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: ff, background: "#06B6D4", color: "#fff", textDecoration: "none", boxShadow: "0 0 20px rgba(6,182,212,0.3)" }}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section style={{ position: "relative", paddingTop: 160, paddingBottom: 96, paddingLeft: 24, paddingRight: 24, textAlign: "center", overflow: "hidden" }}>
        {/* Glow */}
        <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 50% at 50% -5%, rgba(6,182,212,0.18), transparent)" }} />

        <div style={{ position: "relative", maxWidth: 896, margin: "0 auto" }}>
          {/* Badge */}
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "6px 16px", borderRadius: 99, marginBottom: 32, background: "rgba(6,182,212,0.08)", border: "1px solid rgba(6,182,212,0.2)", color: "#06B6D4", fontFamily: ff, fontSize: 11, fontWeight: 700, letterSpacing: "0.1em" }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#22D3EE", flexShrink: 0, display: "inline-block" }} />
            AI-POWERED YOUTUBE GROWTH STUDIO
          </div>

          {/* Headline */}
          <h1 style={{ fontFamily: ff, fontSize: "clamp(42px,7vw,76px)", fontWeight: 700, lineHeight: 1.05, letterSpacing: "-2px", marginBottom: 24 }}>
            Build a Faceless<br />
            <span style={{ color: "#06B6D4" }}>YouTube Empire</span><br />
            Without Showing Up
          </h1>

          {/* Subtitle */}
          <p style={{ fontSize: 18, color: "#94a3b8", maxWidth: 480, margin: "0 auto 40px", lineHeight: 1.7 }}>
            AI scripts, viral ideas, stunning thumbnails, and production management — every tool to build and scale a faceless YouTube channel in one place.
          </p>

          {/* CTAs */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginBottom: 24, flexWrap: "wrap" }}>
            <Link href="/login" style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 32px", borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: ff, letterSpacing: "-0.2px", background: "#06B6D4", color: "#fff", textDecoration: "none", boxShadow: "0 0 40px rgba(6,182,212,0.4), 0 4px 20px rgba(0,0,0,0.4)" }}>
              Start Free — No Credit Card <ArrowRight size={16} />
            </Link>
            <button style={{ display: "flex", alignItems: "center", gap: 10, color: "#94a3b8", background: "none", border: "none", cursor: "pointer", fontFamily: ff, fontWeight: 500, fontSize: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <Play size={13} fill="currentColor" />
              </div>
              Watch Demo
            </button>
          </div>

          <p style={{ fontSize: 12, color: "#475569", fontFamily: ff }}>7-day free trial · No credit card required · Cancel anytime</p>
        </div>

        {/* Dashboard mockup */}
        <div style={{ position: "relative", maxWidth: 1024, margin: "80px auto 0" }}>
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: 160, zIndex: 1, pointerEvents: "none", background: "linear-gradient(to top, #070B14, transparent)" }} />
          <div style={{ borderRadius: 16, overflow: "hidden", border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 40px 100px rgba(0,0,0,0.7), 0 0 0 1px rgba(6,182,212,0.08), inset 0 1px 0 rgba(255,255,255,0.04)" }}>
            {/* Browser bar */}
            <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "12px 20px", background: "#0D1526", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <div style={{ display: "flex", gap: 6 }}>
                {["#FF5F57","#FFBD2E","#28C840"].map((c) => (
                  <div key={c} style={{ width: 12, height: 12, borderRadius: "50%", background: c }} />
                ))}
              </div>
              <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
                <div style={{ padding: "4px 24px", borderRadius: 6, fontSize: 12, background: "rgba(255,255,255,0.03)", color: "#475569", border: "1px solid rgba(255,255,255,0.06)" }}>
                  faceless.townshub.com/dashboard
                </div>
              </div>
            </div>

            {/* Mock UI */}
            <div style={{ display: "flex", background: "#080D1A", minHeight: 360 }}>
              {/* Sidebar */}
              <div style={{ width: 190, flexShrink: 0, padding: "20px 12px", background: "#0A1020", borderRight: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "0 12px 16px", marginBottom: 12, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, background: "linear-gradient(145deg, #0B1F4A, #1B4080)" }}>
                    <THMark size={14} />
                  </div>
                  <div>
                    <p style={{ fontFamily: ff, fontSize: 12, fontWeight: 700, color: "#fff", margin: 0 }}>Townshub</p>
                    <p style={{ fontFamily: ff, fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#5B8DEF", margin: 0 }}>Video Studio</p>
                  </div>
                </div>
                {mockSidebarItems.map((item) => (
                  <div key={item.name} style={{ padding: "8px 12px", borderRadius: 8, marginBottom: 2, fontSize: 12, fontFamily: ff, ...(item.active ? { background: "rgba(6,182,212,0.1)", color: "#06B6D4", border: "1px solid rgba(6,182,212,0.18)", fontWeight: 600 } : { color: "#64748b", border: "1px solid transparent" }) }}>
                    {item.name}
                  </div>
                ))}
              </div>

              {/* Content */}
              <div style={{ flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: ff, margin: 0 }}>Dashboard</p>
                  <div style={{ display: "flex", gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }} />
                    <div style={{ width: 28, height: 28, borderRadius: "50%", background: "linear-gradient(135deg,#FB923C,#ea580c)" }} />
                  </div>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>
                  {mockStats.map((s) => (
                    <div key={s.l} style={{ borderRadius: 12, padding: 12, background: "#0F1829", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <p style={{ fontSize: 18, fontWeight: 700, color: s.c, fontFamily: ff, margin: 0 }}>{s.v}</p>
                      <p style={{ fontSize: 10, color: "#64748b", marginTop: 2, margin: 0 }}>{s.l}</p>
                    </div>
                  ))}
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                  {mockActions.map((qa) => (
                    <div key={qa.name} style={{ borderRadius: 12, padding: 16, background: `${qa.color}0D`, border: `1px solid ${qa.color}25` }}>
                      <div style={{ width: 24, height: 24, borderRadius: 6, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", background: `${qa.color}20` }}>
                        <qa.Icon size={13} style={{ color: qa.color }} />
                      </div>
                      <p style={{ fontSize: 12, fontWeight: 600, color: "#64748b", fontFamily: ff, margin: 0 }}>{qa.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats strip ─────────────────────────────────────────────── */}
      <section style={{ padding: "64px 24px", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 896, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 32, textAlign: "center" }}>
          {[
            { value: "10,000+", label: "Scripts Generated" },
            { value: "4.9★",   label: "Average Rating" },
            { value: "50+",    label: "Supported Niches" },
            { value: "< 30s",  label: "Script Generation" },
          ].map((s) => (
            <div key={s.label}>
              <p style={{ fontFamily: ff, fontSize: 30, fontWeight: 700, color: "#06B6D4", marginBottom: 4 }}>{s.value}</p>
              <p style={{ fontSize: 14, color: "#64748b" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ────────────────────────────────────────────────── */}
      <section id="features" style={{ padding: "112px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#06B6D4", marginBottom: 16 }}>Platform Features</p>
            <h2 style={{ fontFamily: ff, fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: 16 }}>
              Everything to produce<br /><span style={{ color: "#06B6D4" }}>better videos, faster</span>
            </h2>
            <p style={{ color: "#94a3b8", maxWidth: 480, margin: "0 auto", lineHeight: 1.7 }}>
              From your first idea to the final upload — Townshub handles every step of the content creation process.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {features.map((f) => (
              <div key={f.title} style={{ position: "relative", borderRadius: 16, padding: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", cursor: "pointer" }}>
                <div style={{ width: 40, height: 40, borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 20, background: `${f.accent}15`, border: `1px solid ${f.accent}25`, color: f.accent }}>
                  <f.icon size={18} />
                </div>
                <h3 style={{ fontFamily: ff, fontSize: 15, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: "112px 24px", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#FB923C", marginBottom: 16 }}>The Process</p>
            <h2 style={{ fontFamily: ff, fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, letterSpacing: "-1px" }}>
              From idea to upload<br />in 3 steps
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 32 }}>
            {steps.map((step) => (
              <div key={step.n} style={{ textAlign: "center" }}>
                <div style={{ width: 64, height: 64, borderRadius: 16, display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px", fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: ff, background: step.grad, boxShadow: `0 0 30px ${step.glow}` }}>
                  {step.n}
                </div>
                <h3 style={{ fontFamily: ff, fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 12 }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: "#64748b", lineHeight: 1.6, maxWidth: 240, margin: "0 auto" }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ────────────────────────────────────────────── */}
      <section style={{ padding: "112px 24px" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#34D399", marginBottom: 16 }}>Creator Stories</p>
            <h2 style={{ fontFamily: ff, fontSize: "clamp(32px,5vw,40px)", fontWeight: 700, letterSpacing: "-1px" }}>Real results from real creators</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ borderRadius: 16, padding: 24, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <div style={{ display: "flex", gap: 2, marginBottom: 16 }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={13} fill="#FACC15" style={{ color: "#FACC15" }} />)}
                </div>
                <p style={{ fontSize: 14, color: "#cbd5e1", lineHeight: 1.7, marginBottom: 20 }}>&ldquo;{t.quote}&rdquo;</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", fontFamily: ff, background: "linear-gradient(135deg,#06B6D4,#0891B2)", flexShrink: 0 }}>{t.avatar}</div>
                  <div>
                    <p style={{ fontFamily: ff, fontSize: 14, fontWeight: 600, color: "#fff", margin: 0 }}>{t.name}</p>
                    <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────────────── */}
      <section id="pricing" style={{ padding: "112px 24px", background: "rgba(255,255,255,0.012)" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 64 }}>
            <p style={{ fontFamily: ff, fontSize: 11, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase", color: "#FB923C", marginBottom: 16 }}>Simple Pricing</p>
            <h2 style={{ fontFamily: ff, fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: 12 }}>Choose your plan</h2>
            <p style={{ color: "#94a3b8" }}>7-day free trial on all plans. Cancel anytime.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 16 }}>
            {plans.map((plan) => (
              <div key={plan.id} style={{ position: "relative", borderRadius: 16, overflow: "hidden", background: plan.popular ? "rgba(6,182,212,0.05)" : "rgba(255,255,255,0.02)", border: plan.popular ? "1px solid rgba(6,182,212,0.35)" : "1px solid rgba(255,255,255,0.06)", boxShadow: plan.popular ? "0 0 50px rgba(6,182,212,0.08)" : "none" }}>
                {plan.popular && (
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 1, background: "linear-gradient(90deg,transparent,#06B6D4,transparent)" }} />
                )}
                <div style={{ padding: 28 }}>
                  {plan.popular
                    ? <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "4px 12px", borderRadius: 99, marginBottom: 20, fontSize: 11, fontWeight: 700, fontFamily: ff, background: "rgba(6,182,212,0.12)", border: "1px solid rgba(6,182,212,0.25)", color: "#06B6D4" }}>
                        <Star size={10} fill="currentColor" /> Most Popular
                      </div>
                    : <div style={{ height: 28, marginBottom: 20 }} />
                  }
                  <p style={{ fontFamily: ff, fontSize: 14, fontWeight: 700, color: "#fff", marginBottom: 8 }}>{plan.name}</p>
                  <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginBottom: 4 }}>
                    <span style={{ fontFamily: ff, fontSize: 40, fontWeight: 700, color: "#fff", letterSpacing: "-1.5px" }}>{plan.price}</span>
                    <span style={{ color: "#64748b", marginBottom: 4, fontSize: 14 }}>/mo</span>
                  </div>
                  <p style={{ fontSize: 12, fontWeight: 700, fontFamily: ff, color: "#06B6D4", marginBottom: 24 }}>{plan.desc}</p>
                  <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px", borderRadius: 12, fontSize: 14, fontWeight: 700, fontFamily: ff, textDecoration: "none", marginBottom: 24, ...(plan.popular ? { background: "#06B6D4", color: "#fff", boxShadow: "0 0 24px rgba(6,182,212,0.3)" } : { background: "rgba(255,255,255,0.05)", color: "#fff", border: "1px solid rgba(255,255,255,0.1)" }) }}>
                    {plan.cta} <ArrowRight size={14} />
                  </Link>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
                    {plan.features.map((f) => (
                      <li key={f} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                        <CheckCircle2 size={13} style={{ color: "#06B6D4", flexShrink: 0, marginTop: 2 }} />
                        <span style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.5 }}>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 40, display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center", gap: 24, fontSize: 14, color: "#64748b" }}>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Shield size={14} style={{ color: "#34D399" }} /> 7-day money back guarantee</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Clock size={14} style={{ color: "#06B6D4" }} /> Cancel anytime — no lock-in</span>
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}><Users size={14} style={{ color: "#A78BFA" }} /> Team collaboration on Pro+</span>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────────────── */}
      <section style={{ padding: "112px 24px" }}>
        <div style={{ maxWidth: 768, margin: "0 auto", textAlign: "center" }}>
          <div style={{ position: "relative", borderRadius: 24, padding: "80px 48px", overflow: "hidden", background: "rgba(6,182,212,0.04)", border: "1px solid rgba(6,182,212,0.15)" }}>
            <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "radial-gradient(ellipse 80% 60% at 50% 0%,rgba(6,182,212,0.12),transparent)" }} />
            <div style={{ position: "relative" }}>
              <h2 style={{ fontFamily: ff, fontSize: "clamp(32px,5vw,48px)", fontWeight: 700, letterSpacing: "-1px", marginBottom: 16 }}>
                Ready to build your<br />faceless channel?
              </h2>
              <p style={{ color: "#94a3b8", marginBottom: 32, maxWidth: 400, margin: "0 auto 32px", lineHeight: 1.7 }}>
                Join thousands of creators using Townshub to generate scripts, thumbnails, and viral ideas on autopilot.
              </p>
              <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "16px 40px", borderRadius: 12, fontSize: 16, fontWeight: 700, fontFamily: ff, letterSpacing: "-0.2px", background: "#06B6D4", color: "#fff", textDecoration: "none", boxShadow: "0 0 40px rgba(6,182,212,0.35)" }}>
                Start Free Today <ArrowRight size={16} />
              </Link>
              <p style={{ fontSize: 12, color: "#475569", marginTop: 16 }}>7-day free trial · No credit card required · Cancel anytime</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer style={{ padding: "40px 24px", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 1152, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(145deg, #0B1F4A, #1B4080)" }}>
              <THMark size={12} />
            </div>
            <span style={{ fontFamily: ff, fontSize: 14, fontWeight: 700, color: "#94a3b8" }}>Townshub Video Studio</span>
          </div>
          <p style={{ fontSize: 12, color: "#475569" }}>© 2026 Townshub. All rights reserved.</p>
          <div style={{ display: "flex", gap: 24 }}>
            {["Privacy","Terms","Support"].map((l) => (
              <a key={l} href="#" style={{ fontSize: 12, color: "#64748b", textDecoration: "none" }}>{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
