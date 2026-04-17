"use client";

import { useState, useRef, useEffect } from "react";
import { Topbar } from "@/components/dashboard/topbar";
import {
  Send, Sparkles, Crown, RotateCcw, Copy, Check,
  TrendingUp, Target, DollarSign, Lightbulb, BarChart2,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
}

const QUICK_STARTS = [
  { icon: TrendingUp,  color: "#00D4FF", label: "Channel Growth",    prompt: "My faceless channel has been stuck at 2K subscribers for 3 months. What are the top 3 things I should change right now?" },
  { icon: Target,      color: "#fb923c", label: "Niche Strategy",    prompt: "I want to start a new faceless channel in 2026. What niches have the best combination of low competition, high RPM, and evergreen content?" },
  { icon: DollarSign,  color: "#34d399", label: "Monetisation",      prompt: "My channel just hit 1,000 subscribers and 4,000 watch hours. Beyond AdSense, what monetisation streams should I set up first?" },
  { icon: BarChart2,   color: "#a855f7", label: "Analytics Audit",   prompt: "My average view duration is only 35%. What does that tell you and what should I do to fix my retention?" },
  { icon: Lightbulb,   color: "#facc15", label: "Content System",    prompt: "I want to batch-produce 8 faceless videos per month as a solo creator using AI. Give me a lean production workflow." },
];

function TypingDots() {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center", padding: "4px 0" }}>
      {[0, 1, 2].map(i => (
        <div
          key={i}
          style={{
            width: 7, height: 7, borderRadius: "50%", background: "#00D4FF",
            animation: "calebBounce 1.2s ease-in-out infinite",
            animationDelay: `${i * 0.18}s`,
          }}
        />
      ))}
    </div>
  );
}

function MessageBubble({ msg, onCopy }: { msg: Message; onCopy: (text: string) => void }) {
  const isUser = msg.role === "user";
  return (
    <div style={{
      display: "flex", gap: 12, alignItems: "flex-start",
      flexDirection: isUser ? "row-reverse" : "row",
      marginBottom: 20,
    }}>
      {/* Avatar */}
      <div style={{
        width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
        background: isUser
          ? "linear-gradient(135deg, #1B4080, #0B1F4A)"
          : "linear-gradient(135deg, #00D4FF22, #0080cc22)",
        border: isUser ? "1px solid rgba(27,64,128,0.4)" : "1px solid rgba(0,212,255,0.3)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 12, fontWeight: 800,
        color: isUser ? "#7eb3ff" : "#00D4FF",
        flexDirection: "column",
      }}>
        {isUser ? "You" : (
          <span style={{ fontSize: 10, fontWeight: 900, letterSpacing: "-0.5px" }}>AI</span>
        )}
      </div>

      {/* Bubble */}
      <div style={{ maxWidth: "72%", minWidth: 60 }}>
        <div style={{
          padding: "13px 16px",
          borderRadius: isUser ? "14px 4px 14px 14px" : "4px 14px 14px 14px",
          background: isUser
            ? "linear-gradient(135deg, rgba(0,212,255,0.12), rgba(0,128,204,0.08))"
            : "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.98))",
          border: isUser
            ? "1px solid rgba(0,212,255,0.2)"
            : "1px solid rgba(255,255,255,0.07)",
        }}>
          <p style={{
            fontSize: 13, color: "#e2e8f0", lineHeight: 1.75, margin: 0,
            whiteSpace: "pre-wrap",
          }}>{msg.content}</p>
        </div>
        {/* Timestamp + copy */}
        <div style={{
          display: "flex", alignItems: "center", gap: 8, marginTop: 5,
          justifyContent: isUser ? "flex-end" : "flex-start",
        }}>
          <span style={{ fontSize: 10, color: "#475569" }}>
            {new Date(msg.ts).toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })}
          </span>
          {!isUser && (
            <button
              onClick={() => onCopy(msg.content)}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#475569", padding: 0, display: "flex" }}
            >
              <Copy size={11} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ConsultingPage() {
  const isElite = false; // TODO: replace with real plan check
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Hey — I'm Townshub AI, your AI YouTube growth consultant.\n\nI specialise in faceless channels: niche strategy, scripting, thumbnails, monetisation, and everything in between. Think of me as your on-demand growth team.\n\nWhat do you want to work on today?`,
      ts: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [msgCount, setMsgCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const FREE_LIMIT = 5;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sendMessage = async (text?: string) => {
    const content = (text || input).trim();
    if (!content || loading) return;
    if (!isElite && msgCount >= FREE_LIMIT) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content, ts: Date.now() };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    setError(null);
    setMsgCount(c => c + 1);

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch("/api/consulting", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages
            .filter(m => m.id !== "welcome")
            .map(m => ({ role: m.role, content: m.content })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: "Server error" }));
        throw new Error(err.error || "Request failed");
      }

      const data = await res.json();
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.content || "I couldn't generate a response. Please try again.",
        ts: Date.now(),
      }]);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{
      id: "welcome-" + Date.now(),
      role: "assistant",
      content: "Hey — ready when you are. What do you want to work on?",
      ts: Date.now(),
    }]);
    setMsgCount(0);
    setError(null);
  };

  const atLimit = !isElite && msgCount >= FREE_LIMIT;

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <style>{`
        @keyframes calebBounce {
          0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
          30% { transform: translateY(-5px); opacity: 1; }
        }
      `}</style>
      <Topbar title="AI Consulting" subtitle="Townshub AI — your personal YouTube growth mentor" />

      <div style={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>

        {/* Sidebar */}
        <div style={{
          width: 260, flexShrink: 0, borderRight: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(7,12,24,0.8)", display: "flex", flexDirection: "column",
          padding: "20px 14px",
          overflowY: "auto",
        }}>
          {/* Townshub AI card */}
          <div style={{
            borderRadius: 14, padding: "18px 16px", marginBottom: 20,
            background: "linear-gradient(135deg, rgba(0,212,255,0.07), rgba(0,128,204,0.04))",
            border: "1px solid rgba(0,212,255,0.14)",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <div style={{
                width: 42, height: 42, borderRadius: "50%",
                background: "linear-gradient(135deg, #0B1F4A, #1B4080)",
                border: "2px solid rgba(0,212,255,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 12, fontWeight: 900, color: "#00D4FF",
              }}>AI</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 800, color: "#fff", margin: 0 }}>Townshub AI</p>
                <p style={{ fontSize: 10, color: "#00D4FF", margin: 0, fontWeight: 600 }}>YouTube Growth AI</p>
              </div>
              <div style={{ marginLeft: "auto", width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 6px #22c55e" }} />
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: 0, lineHeight: 1.55 }}>
              Specialised in faceless channels, niche strategy, monetisation, and growth systems.
            </p>
          </div>

          {/* Usage */}
          {!isElite && (
            <div style={{
              borderRadius: 12, padding: "14px", marginBottom: 20,
              background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8" }}>Messages used</span>
                <span style={{ fontSize: 11, fontWeight: 700, color: msgCount >= FREE_LIMIT ? "#f87171" : "#00D4FF" }}>
                  {msgCount}/{FREE_LIMIT}
                </span>
              </div>
              <div style={{ height: 3, borderRadius: 99, background: "rgba(255,255,255,0.06)", overflow: "hidden" }}>
                <div style={{
                  height: "100%", borderRadius: 99,
                  background: msgCount >= FREE_LIMIT ? "#f87171" : "linear-gradient(90deg, #00D4FF, #0080cc)",
                  width: `${Math.min((msgCount / FREE_LIMIT) * 100, 100)}%`,
                  transition: "width 0.3s ease",
                }} />
              </div>
              <p style={{ fontSize: 10, color: "#475569", margin: "6px 0 0" }}>Upgrade to Elite for unlimited access</p>
            </div>
          )}

          {/* Quick starts */}
          <p style={{ fontSize: 10, fontWeight: 800, color: "#2A3F5F", letterSpacing: "0.14em", textTransform: "uppercase", marginBottom: 10 }}>Quick Starts</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {QUICK_STARTS.map(({ icon: Icon, color, label, prompt }) => (
              <button
                key={label}
                onClick={() => sendMessage(prompt)}
                disabled={loading || atLimit}
                style={{
                  display: "flex", alignItems: "center", gap: 10,
                  padding: "10px 12px", borderRadius: 10, textAlign: "left",
                  background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
                  cursor: loading || atLimit ? "not-allowed" : "pointer",
                  opacity: atLimit ? 0.4 : 1,
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!atLimit) { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; } }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.02)"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.06)"; }}
              >
                <div style={{ width: 28, height: 28, borderRadius: 8, background: `${color}14`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon size={13} color={color} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 500, color: "#94a3b8" }}>{label}</span>
              </button>
            ))}
          </div>

          <div style={{ marginTop: "auto", paddingTop: 16 }}>
            <button
              onClick={clearChat}
              style={{
                width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 7,
                padding: "9px 14px", borderRadius: 10, fontSize: 12, fontWeight: 600,
                background: "transparent", border: "1px solid rgba(255,255,255,0.07)",
                color: "#475569", cursor: "pointer",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = "#475569"; (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.07)"; }}
            >
              <RotateCcw size={12} /> New Conversation
            </button>
          </div>
        </div>

        {/* Chat area */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 32px" }}>
            {messages.map(msg => (
              <MessageBubble key={msg.id} msg={msg} onCopy={handleCopy} />
            ))}

            {loading && (
              <div style={{ display: "flex", gap: 12, alignItems: "flex-start", marginBottom: 20 }}>
                <div style={{
                  width: 34, height: 34, borderRadius: "50%", flexShrink: 0,
                  background: "linear-gradient(135deg, #00D4FF22, #0080cc22)",
                  border: "1px solid rgba(0,212,255,0.3)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 10, fontWeight: 900, color: "#00D4FF",
                }}>AI</div>
                <div style={{
                  padding: "13px 16px", borderRadius: "4px 14px 14px 14px",
                  background: "linear-gradient(135deg, rgba(15,24,42,0.97), rgba(8,13,26,0.98))",
                  border: "1px solid rgba(255,255,255,0.07)",
                }}>
                  <TypingDots />
                </div>
              </div>
            )}

            {error && (
              <div style={{
                padding: "12px 16px", borderRadius: 12, marginBottom: 16,
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontSize: 12,
              }}>
                {error}
              </div>
            )}

            {/* Elite gate */}
            {atLimit && (
              <div style={{
                borderRadius: 16, border: "1px solid rgba(250,204,21,0.2)",
                background: "linear-gradient(135deg, rgba(250,204,21,0.06), rgba(251,146,60,0.03))",
                padding: "28px 24px", textAlign: "center", marginTop: 8,
              }}>
                <div style={{ width: 46, height: 46, borderRadius: 14, background: "rgba(250,204,21,0.15)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 14px" }}>
                  <Crown size={20} color="#facc15" fill="#facc15" />
                </div>
                <p style={{ fontSize: 14, fontWeight: 800, color: "#fde68a", margin: "0 0 6px" }}>Upgrade to Elite AI for unlimited consulting</p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: "0 auto 18px", maxWidth: 380, lineHeight: 1.6 }}>
                  You&apos;ve used your {FREE_LIMIT} free messages. Elite gives you unlimited Townshub AI sessions, priority responses, and advanced growth strategy tools.
                </p>
                <Link href="/dashboard/billing" style={{
                  display: "inline-flex", alignItems: "center", gap: 7, padding: "10px 22px", borderRadius: 11,
                  background: "linear-gradient(135deg, #facc15, #f59e0b)", color: "#1a0a00",
                  fontSize: 13, fontWeight: 800, textDecoration: "none",
                }}>
                  <Crown size={14} /> Upgrade to Elite <ArrowRight size={13} />
                </Link>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div style={{
            padding: "16px 24px 20px",
            borderTop: "1px solid rgba(255,255,255,0.06)",
            background: "rgba(7,12,24,0.95)",
          }}>
            {copied && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, fontSize: 11, color: "#34d399" }}>
                <Check size={11} /> Copied to clipboard
              </div>
            )}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-end" }}>
              <textarea
                ref={textareaRef}
                value={input}
                onChange={e => {
                  setInput(e.target.value);
                  e.currentTarget.style.height = "auto";
                  e.currentTarget.style.height = Math.min(e.currentTarget.scrollHeight, 140) + "px";
                }}
                onKeyDown={e => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={loading || atLimit}
                placeholder={atLimit ? "Upgrade to Elite to continue…" : "Ask Townshub AI anything about your channel…"}
                rows={1}
                style={{
                  flex: 1, resize: "none", overflow: "hidden",
                  background: "rgba(15,24,42,0.9)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 12, padding: "12px 16px",
                  color: "#e2e8f0", fontSize: 13, outline: "none", lineHeight: 1.6,
                  minHeight: 46, maxHeight: 140,
                  fontFamily: "inherit",
                  transition: "border-color 0.15s",
                  opacity: atLimit ? 0.4 : 1,
                }}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)"}
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading || atLimit}
                style={{
                  width: 46, height: 46, borderRadius: 12, flexShrink: 0,
                  background: !input.trim() || loading || atLimit
                    ? "rgba(255,255,255,0.04)"
                    : "linear-gradient(135deg, #00D4FF, #0080cc)",
                  border: "none", cursor: !input.trim() || loading || atLimit ? "not-allowed" : "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  transition: "all 0.15s",
                }}
              >
                <Send size={17} color={!input.trim() || loading || atLimit ? "#2A3F5F" : "#04080F"} />
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
              <Sparkles size={10} color="#475569" />
              <span style={{ fontSize: 10, color: "#475569" }}>Townshub AI is powered by Claude · Enter to send, Shift+Enter for new line</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
