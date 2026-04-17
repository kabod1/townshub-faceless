"use client";

import { useState } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Headphones, Send, CheckCircle2, ChevronDown, ChevronUp,
  Crown, Zap, MessageSquare, Clock, AlertCircle,
  FileText, Bug, Lightbulb, Star, ExternalLink,
} from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
  { value: "billing",   label: "Billing & Plans",      icon: Star,          color: "#facc15" },
  { value: "bug",       label: "Bug Report",            icon: Bug,           color: "#f87171" },
  { value: "feature",   label: "Feature Request",       icon: Lightbulb,     color: "#a78bfa" },
  { value: "ai",        label: "AI Generation Issue",   icon: Zap,           color: "#00D4FF" },
  { value: "account",   label: "Account & Settings",    icon: FileText,      color: "#fb923c" },
  { value: "other",     label: "Other",                 icon: MessageSquare, color: "#64748b" },
];

const FAQS = [
  {
    q: "Why is my AI script generation failing?",
    a: "Check that your n8n webhook is active and the workflow is enabled. The most common cause is the workflow being in 'inactive' state. Go to your n8n dashboard, find the script generation workflow, and toggle it to active. If the issue persists, check the webhook URL in your Vercel/environment variables.",
  },
  {
    q: "How do I upgrade or downgrade my plan?",
    a: "Go to Settings → Billing or visit the Billing page from the sidebar. You can upgrade, downgrade, or cancel at any time. Changes take effect at the next billing cycle. For immediate downgrades or refund requests, contact support directly.",
  },
  {
    q: "Can I use the AI voiceover on any script?",
    a: "Yes — once a script is generated and saved, you can navigate to AI Voiceover and paste or import the script. The voiceover tool works with any text input and supports multiple voice styles. ElevenLabs integration gives premium voices if you have the Elite plan.",
  },
  {
    q: "How many thumbnails can I generate per month?",
    a: "Starter plan: 120 assets. Pro: 300 assets. Elite: 600 assets. Thumbnail generation via Flux.1 uses your monthly allocation. AI Background Generation (the Flux model) counts towards this limit. Local CSS previews do not count.",
  },
  {
    q: "My niche finder is showing an empty response — what do I do?",
    a: "The Niche Finder calls your n8n webhook. Common fixes: (1) ensure the workflow is active in n8n, (2) check the N8N_NICHE_WEBHOOK_URL in your environment variables, (3) test the webhook directly using a tool like Postman. If you see 'n8n returned empty response', the workflow is reached but not returning data.",
  },
  {
    q: "Can I invite team members on the Starter plan?",
    a: "Team collaboration is a Pro and Elite feature. On Starter, you have a single-user workspace. Upgrade to Pro to invite up to 5 team members with custom roles (Admin, Editor, Viewer).",
  },
  {
    q: "How does the Production Board sync with my scripts?",
    a: "When you save a script, it appears in your Scripts library. From there, you can add it to the Production Board as a card. The board is a Kanban view of your content pipeline — Idea, Scripted, Recording, Editing, Scheduled, Published.",
  },
  {
    q: "Is my data stored securely?",
    a: "All data is stored in Supabase with row-level security. Authentication uses Supabase Auth with secure session tokens. Scripts, thumbnails, and settings are tied to your user account and never shared. We do not sell your data.",
  },
];

const RESPONSE_TIMES = [
  { plan: "Starter", time: "3–5 business days", color: "#64748b" },
  { plan: "Pro",     time: "24–48 hours",        color: "#00D4FF" },
  { plan: "Elite",   time: "Under 4 hours",      color: "#facc15" },
];

const S = {
  card: {
    borderRadius: 16, overflow: "hidden" as const,
    background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
    border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16,
  },
  input: {
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 13,
    outline: "none",
  },
  label: {
    fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em",
    textTransform: "uppercase" as const, display: "block", marginBottom: 7,
  },
};

export default function SupportPage() {
  const isPriority = false; // Elite only
  const [category, setCategory] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleSubmit = async () => {
    if (!category || !subject.trim() || !message.trim()) {
      setSubmitError("Please fill in all fields before submitting.");
      return;
    }
    setSubmitError(null);

    // In a real implementation this would POST to a support API or email service
    // For now, we simulate success
    await new Promise(r => setTimeout(r, 800));
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false); setCategory(""); setSubject(""); setMessage("");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Support" subtitle="Get help from the Townshub team" />

      <div style={{ padding: "24px 32px", maxWidth: 960, margin: "0 auto" }}>

        {/* Priority support banner (Elite) */}
        {isPriority ? (
          <div style={{
            display: "flex", alignItems: "center", gap: 16, padding: "16px 22px",
            borderRadius: 14, marginBottom: 24,
            background: "linear-gradient(135deg, rgba(250,204,21,0.08), rgba(251,146,60,0.04))",
            border: "1px solid rgba(250,204,21,0.2)",
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Crown size={17} color="#facc15" fill="#facc15" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#fde68a", margin: "0 0 2px" }}>Elite Priority Support — Response within 4 hours</p>
              <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>Your ticket goes to the front of the queue. Thank you for being an Elite member.</p>
            </div>
          </div>
        ) : (
          <div style={{
            display: "flex", alignItems: "center", gap: 16, padding: "16px 22px",
            borderRadius: 14, marginBottom: 24,
            background: "linear-gradient(135deg, rgba(0,212,255,0.06), rgba(0,128,204,0.03))",
            border: "1px solid rgba(0,212,255,0.12)",
          }}>
            <div style={{ width: 38, height: 38, borderRadius: 11, background: "rgba(0,212,255,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <Headphones size={17} color="#00D4FF" />
            </div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: "0 0 2px" }}>Standard support — 3–5 business day response</p>
              <p style={{ fontSize: 12, color: "#64748b", margin: 0 }}>Upgrade to Elite for 4-hour priority support.</p>
            </div>
            <Link href="/dashboard/billing" style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", borderRadius: 9, background: "linear-gradient(135deg, #facc15, #f59e0b)", color: "#1a0a00", fontSize: 12, fontWeight: 800, textDecoration: "none", flexShrink: 0 }}>
              <Crown size={12} /> Upgrade
            </Link>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24, alignItems: "flex-start" }}>

          {/* Ticket form */}
          <div>
            {!submitted ? (
              <div style={S.card}>
                <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <MessageSquare size={14} color="#00D4FF" />
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Submit a Support Ticket</span>
                  </div>
                </div>
                <div style={{ padding: "22px 24px" }}>
                  {submitError && (
                    <div style={{ display: "flex", gap: 10, padding: "12px 16px", borderRadius: 10, background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", marginBottom: 18 }}>
                      <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                      <p style={{ fontSize: 12, color: "#f87171", margin: 0 }}>{submitError}</p>
                    </div>
                  )}

                  {/* Category */}
                  <div style={{ marginBottom: 18 }}>
                    <label style={S.label}>Category</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                      {CATEGORIES.map(({ value, label, icon: Icon, color }) => (
                        <button
                          key={value}
                          onClick={() => setCategory(value)}
                          style={{
                            display: "flex", alignItems: "center", gap: 8, padding: "10px 12px",
                            borderRadius: 10, textAlign: "left", cursor: "pointer",
                            background: category === value ? `${color}14` : "rgba(255,255,255,0.02)",
                            border: `1px solid ${category === value ? color + "40" : "rgba(255,255,255,0.07)"}`,
                            transition: "all 0.15s",
                          }}
                        >
                          <Icon size={13} color={category === value ? color : "#475569"} />
                          <span style={{ fontSize: 11, fontWeight: 600, color: category === value ? "#e2e8f0" : "#64748b" }}>{label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Subject */}
                  <div style={{ marginBottom: 16 }}>
                    <label style={S.label}>Subject</label>
                    <input
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="Brief description of the issue"
                      style={S.input}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
                    />
                  </div>

                  {/* Message */}
                  <div style={{ marginBottom: 22 }}>
                    <label style={S.label}>Describe the issue</label>
                    <textarea
                      value={message}
                      onChange={e => setMessage(e.target.value)}
                      placeholder="Include as much detail as possible: what you expected, what happened, any error messages, and steps to reproduce."
                      rows={6}
                      style={{ ...S.input, resize: "vertical", lineHeight: 1.65 }}
                      onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                      onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.09)"}
                    />
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={!category || !subject.trim() || !message.trim()}
                    style={{
                      display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                      width: "100%", padding: "13px", borderRadius: 12, border: "none",
                      background: !category || !subject.trim() || !message.trim()
                        ? "rgba(255,255,255,0.04)"
                        : isPriority
                          ? "linear-gradient(135deg, #facc15, #f59e0b)"
                          : "linear-gradient(135deg, #00D4FF, #0080cc)",
                      color: !category || !subject.trim() || !message.trim()
                        ? "#64748b"
                        : isPriority ? "#1a0a00" : "#04080F",
                      fontSize: 13, fontWeight: 800,
                      cursor: !category || !subject.trim() || !message.trim() ? "not-allowed" : "pointer",
                    }}
                  >
                    <Send size={14} /> Submit Ticket
                    {isPriority && <span style={{ fontSize: 11, fontWeight: 600, opacity: 0.75 }}>(Priority)</span>}
                  </button>
                </div>
              </div>
            ) : (
              <div style={{
                borderRadius: 16, padding: "48px 32px", textAlign: "center",
                background: "linear-gradient(135deg, rgba(52,211,153,0.07), rgba(34,197,94,0.03))",
                border: "1px solid rgba(52,211,153,0.18)",
                marginBottom: 16,
              }}>
                <div style={{ width: 56, height: 56, borderRadius: "50%", background: "rgba(52,211,153,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px" }}>
                  <CheckCircle2 size={26} color="#34d399" />
                </div>
                <p style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: "0 0 8px" }}>Ticket submitted</p>
                <p style={{ fontSize: 13, color: "#94a3b8", margin: "0 auto 24px", maxWidth: 360, lineHeight: 1.6 }}>
                  We&apos;ve received your message and will respond to <strong style={{ color: "#e2e8f0" }}>childrenfromlight@gmail.com</strong> within {isPriority ? "4 hours" : "3–5 business days"}.
                </p>
                <button
                  onClick={reset}
                  style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 11, border: "1px solid rgba(255,255,255,0.1)", background: "transparent", color: "#94a3b8", fontSize: 13, cursor: "pointer" }}
                >
                  Submit another ticket
                </button>
              </div>
            )}

            {/* FAQ */}
            <div style={S.card}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Frequently Asked Questions</span>
              </div>
              <div>
                {FAQS.map((faq, i) => (
                  <div key={i} style={{ borderTop: i > 0 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{
                        width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
                        gap: 12, padding: "16px 20px", background: "none", border: "none",
                        cursor: "pointer", textAlign: "left",
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 600, color: openFaq === i ? "#fff" : "#e2e8f0", flex: 1 }}>{faq.q}</span>
                      {openFaq === i ? <ChevronUp size={14} color="#475569" /> : <ChevronDown size={14} color="#475569" />}
                    </button>
                    {openFaq === i && (
                      <div style={{ padding: "0 20px 18px" }}>
                        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0, lineHeight: 1.7 }}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div>
            {/* Response times */}
            <div style={S.card}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Clock size={13} color="#00D4FF" />
                  <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Response Times</span>
                </div>
              </div>
              <div style={{ padding: "14px 18px" }}>
                {RESPONSE_TIMES.map(rt => (
                  <div key={rt.plan} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{ width: 7, height: 7, borderRadius: "50%", background: rt.color, boxShadow: `0 0 5px ${rt.color}` }} />
                      <span style={{ fontSize: 12, fontWeight: 600, color: rt.color }}>{rt.plan}</span>
                    </div>
                    <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 500 }}>{rt.time}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick links */}
            <div style={S.card}>
              <div style={{ padding: "14px 18px", borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Quick Links</span>
              </div>
              <div style={{ padding: "12px 16px", display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { label: "Billing & Plans",   href: "/dashboard/billing" },
                  { label: "Account Settings",  href: "/dashboard/settings" },
                  { label: "Chrome Extension",  href: "/dashboard/extension" },
                  { label: "AI Consulting (Caleb)", href: "/dashboard/consulting" },
                ].map(({ label, href }) => (
                  <Link key={href} href={href} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px", borderRadius: 9,
                    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                    color: "#94a3b8", fontSize: 12, textDecoration: "none",
                  }}>
                    {label}
                    <ExternalLink size={11} color="#475569" />
                  </Link>
                ))}
              </div>
            </div>

            {/* Status */}
            <div style={{ ...S.card, marginBottom: 0 }}>
              <div style={{ padding: "14px 18px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 9, height: 9, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 8px #22c55e" }} />
                  <span style={{ fontSize: 12, fontWeight: 700, color: "#e2e8f0" }}>All systems operational</span>
                </div>
                <p style={{ fontSize: 11, color: "#475569", margin: "6px 0 0" }}>Script generation, Thumbnail AI, Voiceover, and all APIs are running normally.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
