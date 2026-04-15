"use client";

import { useState } from "react";
import { useLocalStorage } from "@/lib/use-local-storage";
import { Topbar } from "@/components/dashboard/topbar";
import { createClient } from "@/lib/supabase/client";
import {
  User, Mail, Puzzle, CheckCircle2, AlertCircle, Shield,
  Bell, Globe, Trash2, ExternalLink, Zap, Key, LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const NOTIFICATION_DEFAULTS = {
  "Script generation complete": true,
  "New video ideas available": true,
  "Production board reminders": false,
  "Product updates & news": true,
  "Billing & plan updates": true,
};
const NOTIFICATION_DESCS: Record<string, string> = {
  "Script generation complete": "When your script is ready",
  "New video ideas available": "Daily AI-generated ideas for your niche",
  "Production board reminders": "Due date reminders for your videos",
  "Product updates & news": "New features and improvements",
  "Billing & plan updates": "Invoices and plan changes",
};

const S = {
  card: {
    borderRadius: 16, overflow: "hidden" as const,
    background: "linear-gradient(135deg, rgba(15,24,42,0.95), rgba(8,13,26,0.98))",
    border: "1px solid rgba(255,255,255,0.06)",
    marginBottom: 20,
  },
  cardHeader: {
    padding: "16px 22px", borderBottom: "1px solid rgba(255,255,255,0.04)",
  },
  cardBody: { padding: "20px 22px" },
  label: { fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.1em", textTransform: "uppercase" as const, display: "block", marginBottom: 8 },
  input: {
    width: "100%", boxSizing: "border-box" as const,
    background: "rgba(8,13,26,0.8)", border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 10, padding: "11px 14px", color: "#e2e8f0", fontSize: 14, outline: "none",
  },
};

export default function SettingsPage() {
  const router = useRouter();
  const [name, setName] = useLocalStorage("th_settings_name", "Towns Hub");
  const [notifications, setNotifications] = useLocalStorage<Record<string, boolean>>("th_notifications", NOTIFICATION_DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };
  const toggleNotification = (label: string) => setNotifications((prev) => ({ ...prev, [label]: !prev[label] }));
  const handleLogout = async () => {
    setLoggingOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  return (
    <div style={{ minHeight: "100vh", background: "#080D1A" }}>
      <Topbar title="Settings" subtitle="Manage your account preferences" />

      <div style={{ padding: "28px 32px", maxWidth: 720, margin: "0 auto" }}>

        {/* Profile */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <User size={14} color="#00D4FF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Profile</span>
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>Your personal information</p>
          </div>
          <div style={S.cardBody}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
              <div style={{
                width: 60, height: 60, borderRadius: "50%",
                background: "linear-gradient(135deg, #f97316, #dc2626)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 22, fontWeight: 800, color: "#fff",
                boxShadow: "0 0 20px rgba(249,115,22,0.3)",
              }}>
                {(typeof name === "string" ? name : "T").charAt(0).toUpperCase()}
              </div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>Profile Photo</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: "3px 0 0" }}>Upload a photo or leave it as initials</p>
                <button style={{ fontSize: 12, color: "#00D4FF", background: "none", border: "none", cursor: "pointer", padding: 0, marginTop: 4 }}>Change photo</button>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Name</label>
              <input value={typeof name === "string" ? name : ""} onChange={(e) => setName(e.target.value)} style={S.input}
                onFocus={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.4)"}
                onBlur={e => e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"} />
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={S.label}>Email</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Mail size={14} color="#475569" />
                <span style={{ fontSize: 13, color: "#94a3b8", flex: 1 }}>kabodnnamdi@gmail.com</span>
                <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 99, background: "rgba(52,211,153,0.12)", color: "#34d399", border: "1px solid rgba(52,211,153,0.2)" }}>Verified</span>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={S.label}>Plan</label>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", borderRadius: 10, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <Zap size={14} color="#00D4FF" />
                <span style={{ fontSize: 13, color: "#e2e8f0", fontWeight: 600, flex: 1 }}>Starter Plan</span>
                <Link href="/dashboard/billing" style={{ fontSize: 12, color: "#fb923c", fontWeight: 700, textDecoration: "none" }}>Upgrade →</Link>
              </div>
            </div>

            <button onClick={handleSave} style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 22px", borderRadius: 10, border: "none",
              background: saved ? "rgba(52,211,153,0.15)" : "linear-gradient(135deg, #00D4FF, #0080cc)",
              color: saved ? "#34d399" : "#04080F", fontSize: 13, fontWeight: 700, cursor: "pointer",
              outline: saved ? "1px solid rgba(52,211,153,0.3)" : "none",
            }}>
              {saved ? <><CheckCircle2 size={14} /> Saved!</> : "Save Changes"}
            </button>
          </div>
        </div>

        {/* Chrome Extension */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Globe size={14} color="#00D4FF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Chrome Extension</span>
            </div>
            <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>Analyze YouTube channels directly on YouTube</p>
          </div>
          <div style={S.cardBody}>
            <div style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px", borderRadius: 12, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", marginBottom: 16 }}>
              <div style={{ width: 40, height: 40, borderRadius: 11, background: "rgba(251,146,60,0.12)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Puzzle size={18} color="#fb923c" />
              </div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#e2e8f0", margin: 0 }}>Extension Not Connected</p>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0" }}>Install the Chrome Extension to analyze channels.</p>
              </div>
              <button style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9,
                background: "rgba(0,212,255,0.1)", border: "1px solid rgba(0,212,255,0.2)",
                color: "#00D4FF", fontSize: 12, fontWeight: 700, cursor: "pointer", flexShrink: 0,
              }}>Install <ExternalLink size={11} /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {["Outlier score on every YouTube video","Channel analytics overlay","Video tags & SEO data","Monetization status indicator","One-click channel import"].map((f) => (
                <div key={f} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <CheckCircle2 size={12} color="#475569" />
                  <span style={{ fontSize: 12, color: "#94a3b8" }}>{f}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Bell size={14} color="#00D4FF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Notifications</span>
            </div>
          </div>
          <div style={S.cardBody}>
            {Object.keys(NOTIFICATION_DEFAULTS).map((label, i, arr) => {
              const on = notifications[label] ?? NOTIFICATION_DEFAULTS[label as keyof typeof NOTIFICATION_DEFAULTS];
              return (
                <div key={label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none" }}>
                  <div>
                    <p style={{ fontSize: 13, color: "#e2e8f0", margin: 0, fontWeight: 500 }}>{label}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>{NOTIFICATION_DESCS[label]}</p>
                  </div>
                  <button onClick={() => toggleNotification(label)} style={{
                    position: "relative", width: 40, height: 22, borderRadius: 99,
                    background: on ? "#00D4FF" : "rgba(255,255,255,0.08)",
                    border: "none", cursor: "pointer", transition: "background 0.2s", flexShrink: 0,
                  }}>
                    <div style={{
                      position: "absolute", top: 2, width: 18, height: 18, borderRadius: "50%",
                      background: "#fff", transition: "left 0.2s",
                      left: on ? 20 : 2, boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                    }} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Security */}
        <div style={S.card}>
          <div style={S.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Shield size={14} color="#00D4FF" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#e2e8f0" }}>Security</span>
            </div>
          </div>
          <div style={S.cardBody}>
            {[
              { icon: Key, label: "Change Password", sub: "Last changed never" },
              { icon: Globe, label: "Active Sessions", sub: "1 active session" },
            ].map((item, i, arr) => (
              <button key={item.label} style={{
                display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
                padding: "12px 10px", borderRadius: 10, border: "none", background: "transparent",
                cursor: "pointer", borderBottom: i < arr.length - 1 ? "1px solid rgba(255,255,255,0.04)" : "none",
                transition: "background 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.03)")}
                onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <item.icon size={14} color="#475569" />
                  <div style={{ textAlign: "left" }}>
                    <p style={{ fontSize: 13, color: "#e2e8f0", margin: 0, fontWeight: 500 }}>{item.label}</p>
                    <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>{item.sub}</p>
                  </div>
                </div>
                <span style={{ fontSize: 13, color: "#00D4FF" }}>→</span>
              </button>
            ))}
          </div>
        </div>

        {/* Danger Zone */}
        <div style={{ ...S.card, borderColor: "rgba(239,68,68,0.12)" }}>
          <div style={S.cardHeader}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <AlertCircle size={14} color="#f87171" />
              <span style={{ fontSize: 13, fontWeight: 700, color: "#f87171" }}>Danger Zone</span>
            </div>
          </div>
          <div style={S.cardBody}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(255,255,255,0.05)", marginBottom: 10 }}>
              <div>
                <p style={{ fontSize: 13, color: "#e2e8f0", margin: 0, fontWeight: 500 }}>Sign Out</p>
                <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>Sign out of your Townshub account</p>
              </div>
              <button onClick={handleLogout} disabled={loggingOut} style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9,
                background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)",
                color: "#94a3b8", fontSize: 12, fontWeight: 600, cursor: loggingOut ? "not-allowed" : "pointer",
              }}>
                <LogOut size={13} /> {loggingOut ? "Signing out…" : "Sign Out"}
              </button>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", borderRadius: 10, border: "1px solid rgba(239,68,68,0.15)" }}>
              <div>
                <p style={{ fontSize: 13, color: "#f87171", margin: 0, fontWeight: 500 }}>Delete Account</p>
                <p style={{ fontSize: 11, color: "#64748b", margin: "2px 0 0" }}>Permanently delete your account and all data</p>
              </div>
              <button style={{
                display: "flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 9,
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)",
                color: "#f87171", fontSize: 12, fontWeight: 600, cursor: "pointer",
              }}>
                <Trash2 size={13} /> Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
